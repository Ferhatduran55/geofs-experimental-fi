import Logger from "./Logger";
import Transport from "./Transport";
import Notify from "./Notify";
import Modal from "../components/Modal";

const log = Logger.create("Career");

// Required global declarations from GeoFS context
declare const geofs: any;
declare const Storage: any;

export default class Career {
    static balance: number = 10000;
    static logbook: Record<string, FlightRecord[]> = {};
    static currentFlight: FlightRecord | null = null;
    static currentMission: TransportMission | null = null;
    static availableMissions: TransportMission[] = [];
    static flightState: "ground" | "airborne" = "ground";
    static callbackId: number | null = null;

    // Tracking parameters
    static maxGTracker: number = 1.0;
    static lastVerticalSpeed: number = 0;
    static isActive: boolean = false;
    static isInitialized: boolean = false;

    static async init(): Promise<void> {
        if (this.isInitialized) return;
        await this.loadData();
        this.isInitialized = true;
        log.info("Career system instantiated.");
    }

    static async activate(): Promise<void> {
        if (this.isActive) return;
        this.isActive = true;

        if (!this.isInitialized) {
            await this.init();
        }

        if (!this.callbackId) {
            this.callbackId = geofs.api.addFrameCallback(() => this.update(), "careerModule");
        }

        log.info("Career and Transport module activated.");
        Notify.success("Career and Transport module activated.", "Career");
    }

    static deactivate(): void {
        if (!this.isActive) return;
        this.isActive = false;

        if (this.callbackId) {
            geofs.api.removeFrameCallback(this.callbackId);
            this.callbackId = null;
        }

        log.info("Career and Transport module deactivated.");
        Notify.info("Career and Transport module deactivated.", "Career");
    }

    static getStorage() {
        return (unsafeWindow as any).flightAssistant?.Storage;
    }

    static async loadData(): Promise<void> {
        const store = this.getStorage();
        if (!store) return;

        let data = await store.read("geofsCareerLogbook", { balance: 10000, logbook: {}, currentMission: null });
        this.balance = data?.balance || 10000;
        this.logbook = data?.logbook || {};
        this.currentMission = data?.currentMission || null;
    }

    static saveData(): void {
        const store = this.getStorage();
        if (!store) return;

        let data = { balance: this.balance, logbook: this.logbook, currentMission: this.currentMission };
        store.write("geofsCareerLogbook", data);
    }

    static getNearestAirport(location: number[]): string {
        // Try native method first
        let rw = geofs.runways?.getNearestRunway?.(location);
        if (rw) return rw.icao || rw.id || "Unknown Area";

        // Fallback: manually search all runways
        const allRunways = geofs.runways?.runways || [];
        let bestDist = Infinity;
        let bestId = "Unknown Area";

        for (const runway of allRunways) {
            const rLoc = runway.location || runway.lla;
            if (!rLoc) continue;

            try {
                const dist = geofs.utils.llaDistanceInMeters(location, rLoc);
                if (dist < bestDist) {
                    bestDist = dist;
                    bestId = runway.icao || runway.id || "Unknown Area";
                    rw = runway;
                }
            } catch (e) {
                // skip
            }
        }

        // Only return if within 10km / ~5.4 NM
        if (bestDist < 10000) return bestId;
        return "Unknown Area";
    }

    static update(): void {
        if (!this.isActive) return;
        if (!geofs.aircraft || !geofs.aircraft.instance) return;

        const onGround: boolean = geofs.aircraft.instance.groundContact;
        const speedKts: number = geofs.animation.values.kias;

        // Takeoff Detection: Airborne and speed above 30 knots
        if (this.flightState === "ground" && !onGround && speedKts > 30) {
            this.flightState = "airborne";
            this.handleTakeoff();
        }
        // Landing Detection: Touched down and slowed to taxi speed (< 20 knots)
        else if (this.flightState === "airborne" && onGround && speedKts < 20) {
            this.flightState = "ground";
            this.handleLanding();
        }

        // Track max G-Force and vertical speed when airborne
        if (this.flightState === "airborne") {
            const accZ = geofs.animation.values.accZ !== undefined ? geofs.animation.values.accZ : 9.8;
            const currentG = Math.abs(accZ / 9.8);
            if (currentG > this.maxGTracker) {
                this.maxGTracker = currentG;
            }
            this.lastVerticalSpeed = geofs.animation.values.verticalSpeed !== undefined ? geofs.animation.values.verticalSpeed : 0;
        }
    }

    static handleTakeoff(): void {
        const loc = geofs.initialCoordinates;
        const dep = this.getNearestAirport(loc);

        // Reset tracking vars
        this.maxGTracker = 1.0;
        this.lastVerticalSpeed = 0;

        let callsign = geofs.userRecord?.callsign || "Unknown Callsign";

        if (!this.currentMission) {
            log.info(`Departed from ${dep} with no active mission.`);
            Notify.info(`Departed without an active mission. Free flight mode.`, "Flight");
        } else {
            const payloadDesc = Transport.getPayloadDescription(this.currentMission.payload);
            log.info(`Departed from ${dep}. Mission to ${this.currentMission.destination}. Payload: ${payloadDesc}`);
            Notify.success(`Mission started! Destination: ${this.currentMission.destination}. Payload: ${payloadDesc}`, "Flight");
        }

        // We record the flight even if there's no mission (just for logbook)
        this.currentFlight = {
            aircraftId: geofs.aircraft.instance.id,
            aircraftName: geofs.aircraft.instance.aircraftRecord.name || "Unknown Aircraft",
            departure: dep,
            depCoords: [loc[0], loc[1], loc[2]],
            takeoffTime: Date.now(),
            payload: this.currentMission ? this.currentMission.payload : { type: "cargo", amount: 0, maxCapacity: 0 },
            callsign: callsign
        };
    }

    static handleLanding(): void {
        if (!this.currentFlight) return;

        const loc = geofs.initialCoordinates;
        const arr = this.getNearestAirport(loc);
        const landingTime = Date.now();
        const flightTimeMs = landingTime - this.currentFlight.takeoffTime;
        const flightTimeHours = (flightTimeMs / (1000 * 60 * 60)).toFixed(2);

        // Calculate distance using GeoFS utility
        const distanceMeters = geofs.utils.llaDistanceInMeters(this.currentFlight.depCoords, loc);
        const distanceNm = Math.round(distanceMeters * 0.000539957);

        // Evaluate Flight (Hard Landing if VS < -600 fpm)
        const isHardLanding = this.lastVerticalSpeed < -600;

        // Update Flight Data Basics
        this.currentFlight.arrival = arr;
        this.currentFlight.arrCoords = [loc[0], loc[1], loc[2]];
        this.currentFlight.landingTime = landingTime;
        this.currentFlight.flightTime = flightTimeHours;
        this.currentFlight.distance = distanceNm;

        // --- Mission Validation & Scoring ---
        let msg = "";
        let ratingType: "success" | "warning" | "error" | "info" = "info";

        if (this.currentMission) {
            // Check if landed at the correct destination
            if (arr === this.currentMission.destination) {
                // Success
                const score = Transport.calculateScore(
                    this.currentMission,
                    flightTimeMs,
                    this.maxGTracker,
                    isHardLanding
                );

                this.currentFlight.score = score;
                this.currentFlight.income = score.totalIncome;
                this.balance += score.totalIncome;

                const payloadDesc = Transport.getPayloadDescription(this.currentMission.payload);
                const gLabel = score.smoothnessBonus < 0 ? `<b style="color: red;">Maneuvers: Penalty</b>` : `<b>Maneuvers: Good</b>`;
                const landingLabel = isHardLanding ? `<b style="color: red;">Hard Landing!</b>` : `<b>Smooth Landing</b>`;

                msg = `<div style="text-align: center; font-family: sans-serif;">
                    <h4 style="margin: 0 0 10px 0; color: #18a400;">Mission Complete: Rating ${score.rating}</h4>
                    <b>Route:</b> ${this.currentFlight.departure} ➔ ${arr}<br/>
                    <b>Payload:</b> ${payloadDesc}<br/>
                    ${gLabel} | ${landingLabel}<br/>
                    <b style="color: #ffd200;">Income: +$${score.totalIncome}</b><br/>
                    <b>New Balance:</b> $${this.balance}
                </div>`;

                ratingType = score.rating === "S" || score.rating === "A" ? "success" : score.rating === "B" || score.rating === "C" ? "info" : "warning";
                log.info(`Successful mission to ${arr}. Rating: ${score.rating}. Income: $${score.totalIncome}`);
            } else {
                // Wrong destination
                msg = `<div style="text-align: center; font-family: sans-serif;">
                    <h4 style="margin: 0 0 10px 0; color: #d32f2f;">Mission Aborted: Wrong Destination</h4>
                    <b>Intended:</b> ${this.currentMission.destination} <br/>
                    <b>Landed at:</b> ${arr} <br/>
                    <span style="font-size: 0.9em; color: gray;">The payload was returned. No income awarded.</span><br/>
                    <b>Balance:</b> $${this.balance}
                </div>`;
                ratingType = "error";
                log.info(`Mission aborted. Landed at ${arr} instead of ${this.currentMission.destination}`);
            }

            // Clear the mission since we landed
            this.currentMission = null;
        } else {
            // Free Flight Landing (No active mission)
            msg = `<div style="text-align: center; font-family: sans-serif;">
                <h4 style="margin: 0 0 10px 0; color: #4fc3f7;">Flight Complete</h4>
                <b>Route:</b> ${this.currentFlight.departure} ➔ ${arr}<br/>
                <b>Distance:</b> ${distanceNm} NM<br/>
                <span style="font-size: 0.9em; color: gray;">Free flight recorded. Select a mission next time to earn money!</span>
            </div>`;
            ratingType = "info";
        }

        // Group flight in logbook by aircraftId
        const acId = String(this.currentFlight.aircraftId);
        if (!this.logbook[acId]) {
            this.logbook[acId] = [];
        }
        this.logbook[acId].push(this.currentFlight);

        // Persist data
        this.saveData();

        Modal.show({
            title: "Landing Report 🛬",
            content: msg,
            type: ratingType,
            position: "center",
            icon: "📋",
            overlay: true,
            width: "max-w-md",
            buttons: [
                { text: "Close", onClick: () => { }, style: "primary" }
            ]
        });

        // Reset current flight for the next leg
        this.currentFlight = null;
    }
}