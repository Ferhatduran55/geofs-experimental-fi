import Market from "./Market";
import AircraftGroups from "../assets/json/AircraftGroups";

export type TransportCapability = "none" | "passenger" | "cargo" | "both";

export default class Transport {

    static getAircraftCapability(aircraftId: string | number): TransportCapability {
        if (!aircraftId && aircraftId !== 0) return "none";
        const id = aircraftId.toString();

        let foundGroup: string | null = null;
        for (const [groupName, ids] of Object.entries(AircraftGroups)) {
            if ((ids as string[]).includes(id)) {
                foundGroup = groupName;
                break;
            }
        }

        // If not found in any group (e.g., custom addon plane), allow both so we don't block them
        if (!foundGroup) return "both";

        const nonTransport = ["default", "fighter", "fighterJet", "glider"];
        if (nonTransport.includes(foundGroup)) return "none";

        if (foundGroup === "heavyCargo") return "cargo";

        const largeJets = [
            "twinjetNarrowBody", "twinjetNarrowBody2", "twinjetWideBody",
            "wideBody4Engine", "narrowBody4Engine", "trijet", "rearMountedTwinJet"
        ];
        
        // Large airliners can carry both standard pax and belly cargo
        if (largeJets.includes(foundGroup)) return "both";

        // Smaller planes (single engine, business jet, regional jet, etc.) strictly passenger/light pax for now
        return "passenger";
    }

    static calculatePayload(aircraftMass: number, capability: TransportCapability): TransportPayload {
        if (capability === "none") {
            throw new Error("Aircraft not capable of transport");
        }

        let isCargo = false;
        if (capability === "cargo") isCargo = true;
        else if (capability === "passenger") isCargo = false;
        else isCargo = Math.random() > 0.5;

        if (isCargo) {
            // Cargo: Assume max 30% of aircraft mass can be allocated to cargo payload
            const maxCargo = Math.max(100, Math.floor(aircraftMass * 0.3));
            const actualCargo = Math.floor(Math.random() * maxCargo) + 50;
            return { type: "cargo", amount: actualCargo, maxCapacity: maxCargo };
        } else {
            // Passenger: Assume 1 Pax + Baggage = 150kg
            const maxPax = Math.max(1, Math.floor(aircraftMass / 150));
            const actualPax = Math.floor(Math.random() * maxPax) + 1;
            return { type: "passenger", amount: actualPax, maxCapacity: maxPax };
        }
    }

    static generateMissions(currentAirport: string, aircraftMass: number, count: number = 3): TransportMission[] {
        const missions: TransportMission[] = [];
        const geofs = (unsafeWindow as any).geofs;
        const aircraftId = geofs.aircraft?.instance?.id;

        const capability = this.getAircraftCapability(aircraftId);
        if (capability === "none") return missions;

        // Get all available runways to pick random destinations
        const runways = geofs?.runways?.runways || [];
        if (runways.length === 0) return missions;

        // Current location coordinates (approximate from current flight)
        const myLoc = geofs.aircraft?.instance?.llaLocation || [0, 0, 0];

        for (let i = 0; i < count; i++) {
            // Pick a random destination that isn't the current airport
            let destRunway = runways[Math.floor(Math.random() * runways.length)];
            let destId = destRunway.icao || destRunway.id;
            let attempts = 0;

            while (destId === currentAirport && attempts < 10) {
                destRunway = runways[Math.floor(Math.random() * runways.length)];
                destId = destRunway.icao || destRunway.id;
                attempts++;
            }

            // Calculate distance to destination
            const rLoc = destRunway.location || [0, 0, 0];
            const distanceMeters = geofs.utils.llaDistanceInMeters(myLoc, rLoc);
            const distanceNm = Math.max(10, Math.round(distanceMeters * 0.000539957)); // Min 10 NM

            const payload = this.calculatePayload(aircraftMass, capability);
            const baseIncome = this.calculateBaseIncome(payload, distanceNm);

            // Assume average 250kts + 15 mins for takeoff/landing buffers
            const expectedHours = (distanceNm / 250) + 0.25;
            const timeLimitMs = expectedHours * 60 * 60 * 1000;

            missions.push({
                id: `msn-${Date.now()}-${i}`,
                destination: destId,
                distanceNm: distanceNm,
                payload: payload,
                totalReward: baseIncome,
                timeLimitMs: Math.round(timeLimitMs),
                isAccepted: false
            });
        }

        return missions;
    }

    static calculateBaseIncome(payload: TransportPayload, distanceNm: number): number {
        const rates = Market.getCurrentRates();

        if (payload.type === "passenger") {
            // Rate: market passenger rate per NM per passenger
            return Math.round(payload.amount * distanceNm * rates.passenger);
        } else {
            // Rate: market cargo rate per NM per kg of cargo
            return Math.round(payload.amount * distanceNm * rates.cargo);
        }
    }

    static getPayloadDescription(payload: TransportPayload): string {
        if (payload.type === "passenger") {
            return `${payload.amount} Passengers`;
        } else {
            return `${payload.amount} kg Cargo`;
        }
    }

    static calculateScore(
        mission: TransportMission,
        flightTimeMs: number,
        maxGForce: number,
        hardLanding: boolean
    ): FlightScore {
        const baseIncome = mission.totalReward;

        const expectedTimeHours = mission.timeLimitMs / (1000 * 60 * 60);
        const actualTimeHours = flightTimeMs / (1000 * 60 * 60);

        let flightTimeBonus = 0;
        if (actualTimeHours > 0) {
            const timeDiff = expectedTimeHours - actualTimeHours;
            // Bonus for being quick, penalty for being too slow. Cap at ±15%
            flightTimeBonus = Math.round(baseIncome * Math.max(-0.15, Math.min(0.15, timeDiff / expectedTimeHours)));
        }

        // Smoothness: penalize high G forces
        let smoothnessBonus = Math.round(baseIncome * 0.05); // Default 5% bonus for smooth flight
        if (maxGForce > 3.0) {
            smoothnessBonus = -Math.round(baseIncome * 0.15); // 15% penalty for pulling >3G
        } else if (maxGForce > 2.0) {
            smoothnessBonus = 0; // No bonus
        }

        // Hard landing penalty
        let landingPenalty = 0;
        if (hardLanding) {
            // A hard landing is a big penalty
            landingPenalty = -Math.round(baseIncome * 0.25);
        }

        const totalIncome = Math.max(0, baseIncome + flightTimeBonus + smoothnessBonus + landingPenalty);

        let rating = "C";
        const scoreRatio = totalIncome / baseIncome;
        if (scoreRatio > 1.05) rating = "S";
        else if (scoreRatio >= 1.0) rating = "A";
        else if (scoreRatio >= 0.8) rating = "B";
        else if (scoreRatio >= 0.5) rating = "C";
        else rating = "D";

        return {
            baseIncome,
            flightTimeBonus,
            smoothnessBonus,
            landingPenalty,
            totalIncome,
            rating
        };
    }
}
