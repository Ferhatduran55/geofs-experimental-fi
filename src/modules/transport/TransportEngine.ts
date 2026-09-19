import Logger from "../../shared/Logger";
import {
  calculateDistanceNm,
  calculateBearingDeg,
  formatBearingWithCompass,
  findNearestAirport,
  getGeoFSRunways,
  type AirportInfo,
} from "../career/AirportDatabase";
import { FinancialEngine, type TransportPayload } from "../career/FinancialEngine";
import { MarketEngine } from "../market/MarketEngine";
import {
  getAircraftTransportPreset,
  type AircraftTransportPreset,
} from "../../assets/json/AircraftTransportDefs";

const log = Logger.create("TransportEngine");

export type TransportCapability = "none" | "passenger" | "cargo" | "both";

export interface AircraftInfoPreset {
  aircraftId: string;
  model: string;
  silhouette: "airliner" | "regional" | "turboprop" | "ga" | "heavy" | "business";
}

export interface TransportMission {
  id: string;
  category: "Airliner" | "Regional" | "Bush / GA" | "Cargo" | "VIP";
  aircraftId: string;               // GeoFS Aircraft ID
  aircraftModel: string;            // Aircraft Name and Model (live from GeoFS)
  silhouette: "airliner" | "regional" | "turboprop" | "ga" | "heavy" | "business";
  originIcao: string;
  originAirport: AirportInfo;
  destinationIcao: string;
  destinationAirport: AirportInfo;
  fixedDistanceNm: number;          // Fixed Great Circle Distance (NM)
  initialBearingDeg: number;        // Initial Departure Bearing (°)
  initialBearingFormatted: string;  // e.g. "312° (NW)"
  payload: TransportPayload;
  grossRevenue: number;             // Fixed Customer Contract Amount ($)
  ratePerUnitNm: number;
  baseHandlingFee: number;
  expectedDurationMs: number;       // Estimated Flight Duration (ms)
  timeLimitMs: number;
  fuelRequiredPercent: number;      // Recommended Fuel Percentage (%)
  recommendedAircraft: string;
  isAccepted: boolean;
  acceptedAt?: number;
  timeSlotIndex: number;            // 30-minute time block slot index
  cumulativeFlownNm?: number;       // Preserved across reloads and multi-session flights
  lastSavedLla?: [number, number, number];
  lastSavedFuelGal?: number;
}

function createPRNG(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class TransportEngine {
  static getCurrentTimeSlot(): number {
    const now = Date.now();
    return Math.floor(now / 1800000); // 30 minutes in ms
  }

  static getDynamicAircraftForCategory(
    category: "Airliner" | "Regional" | "Bush / GA" | "Cargo" | "VIP",
    prng: () => number
  ): AircraftInfoPreset {
    const options: Record<string, AircraftInfoPreset[]> = {
      Airliner: [
        { aircraftId: "2", model: "Boeing 737-800", silhouette: "airliner" },
        { aircraftId: "3", model: "Airbus A320neo", silhouette: "airliner" },
        { aircraftId: "24", model: "Boeing 777-200ER", silhouette: "heavy" },
        { aircraftId: "252", model: "Airbus A380-800", silhouette: "heavy" },
      ],
      Regional: [
        { aircraftId: "2", model: "Boeing 737-800", silhouette: "airliner" },
        { aircraftId: "3", model: "Airbus A320neo", silhouette: "airliner" },
        { aircraftId: "12", model: "Bombardier CRJ-700", silhouette: "regional" },
        { aircraftId: "107", model: "Embraer E190", silhouette: "regional" },
      ],
      "Bush / GA": [
        { aircraftId: "1", model: "Cessna 172 Skyhawk", silhouette: "ga" },
        { aircraftId: "8", model: "de Havilland DHC-6 Twin Otter", silhouette: "turboprop" },
        { aircraftId: "5", model: "Embraer Phenom 100", silhouette: "business" },
      ],
      Cargo: [
        { aircraftId: "24", model: "Boeing 777-200ER Freighter", silhouette: "heavy" },
        { aircraftId: "8", model: "DHC-6 Twin Otter Cargo", silhouette: "turboprop" },
        { aircraftId: "2", model: "Boeing 737-800 BCF", silhouette: "airliner" },
      ],
      VIP: [
        { aircraftId: "5", model: "Embraer Phenom 100 VIP", silhouette: "business" },
        { aircraftId: "12", model: "Bombardier CRJ Corporate", silhouette: "regional" },
        { aircraftId: "3", model: "Airbus ACJ320 Prestige", silhouette: "airliner" },
      ],
    };

    const pool = options[category] || options["Regional"];
    const idx = Math.floor(prng() * pool.length);
    return pool[idx];
  }

  static generate30MinDeterministicOperations(
    originLat?: number,
    originLon?: number,
    aircraftMassKg: number = 2500,
    _aircraftId?: string | number,
    forceSeed?: number
  ): TransportMission[] {
    const timeSlot = this.getCurrentTimeSlot();
    const geofs = (unsafeWindow as any).geofs;
    const lla =
      originLat !== undefined && originLon !== undefined
        ? [originLat, originLon]
        : geofs?.aircraft?.instance?.llaLocation || [41.2753, 28.7519];

    // Find nearest departure runway from GeoFS
    const departure = findNearestAirport(lla[0], lla[1]);

    const seedBase = forceSeed !== undefined ? forceSeed : timeSlot * 1000003;
    const seed = Math.abs(
      (seedBase ^
        (Math.round(departure.lat * 1000) * 73856093) ^
        (Math.round(departure.lon * 1000) * 19349663) ^
        (Math.round(aircraftMassKg) * 83492791)) >>>
        0
    );
    const prng = createPRNG(seed);

    const allRunways = getGeoFSRunways();
    const rates = MarketEngine.getCurrentRates();

    const categories: ("Airliner" | "Regional" | "Bush / GA" | "Cargo" | "VIP")[] = [
      "Airliner",
      "Regional",
      "Bush / GA",
      "Cargo",
      "VIP",
      "Airliner",
      "Cargo",
      "Regional",
      "Bush / GA",
      "VIP",
      "Airliner",
      "Regional",
    ];

    const missions: TransportMission[] = [];
    const destUsageCount = new Map<string, number>();

    // Filter available real runways other than departure
    const validDestinations = allRunways.filter(
      (rw) => rw.icao !== departure.icao && calculateDistanceNm(departure.lat, departure.lon, rw.lat, rw.lon) > 2
    );

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      const aircraft = this.getDynamicAircraftForCategory(cat, prng);
      const preset = getAircraftTransportPreset(aircraft.aircraftId, undefined, aircraftMassKg);
      const cruiseSpeedKts = preset.cruiseSpeedKts;
      const maxRangeNm = preset.maxRangeNm;

      // Realistic mission distance scaled to aircraft range
      const minDist = Math.max(15, Math.round(maxRangeNm * 0.05));
      const maxDist = Math.max(minDist + 20, Math.min(Math.round(maxRangeNm * 0.75), 4500));

      // 1. Find runways in distance range with max 2 offers
      const candidates = validDestinations.filter((rw) => {
        const d = calculateDistanceNm(departure.lat, departure.lon, rw.lat, rw.lon);
        const count = destUsageCount.get(rw.icao) || 0;
        return d >= minDist && d <= maxDist && count < 2;
      });

      // Low probability of second offer: prefer airports with 0 offers
      const zeroOfferCandidates = candidates.filter((rw) => (destUsageCount.get(rw.icao) || 0) === 0);
      const chosenPool =
        zeroOfferCandidates.length > 0 && prng() > 0.2
          ? zeroOfferCandidates
          : candidates.length > 0
          ? candidates
          : validDestinations;

      let destAirport: AirportInfo;

      if (chosenPool.length > 0) {
        const destIdx = Math.floor(prng() * chosenPool.length);
        destAirport = chosenPool[destIdx];
      } else {
        // Absolute fallback if no runway available: place along runway heading
        const headingRad = ((departure.heading || 270) * Math.PI) / 180;
        const targetDistNm = Math.min(35, maxDist);
        const distDeg = targetDistNm / 60;
        const dLat = departure.lat + distDeg * Math.cos(headingRad);
        const dLon = departure.lon + distDeg * Math.sin(headingRad);

        destAirport = {
          icao: "AP-DEST",
          name: "Enroute Sector Runway",
          lat: dLat,
          lon: dLon,
          elevationFt: departure.elevationFt,
          runwayHeading: departure.runwayHeading,
        };
      }

      destUsageCount.set(destAirport.icao, (destUsageCount.get(destAirport.icao) || 0) + 1);

      const fixedDistanceNm = calculateDistanceNm(
        departure.lat,
        departure.lon,
        destAirport.lat,
        destAirport.lon
      );

      const initialBearingDeg = calculateBearingDeg(
        departure.lat,
        departure.lon,
        destAirport.lat,
        destAirport.lon
      );
      const initialBearingFormatted = formatBearingWithCompass(initialBearingDeg);

      const forcePax = preset.maxCargoKg === 0;
      const forceCargo = preset.maxPassengers === 0;
      const isPax = forcePax
        ? true
        : forceCargo
        ? false
        : cat === "Airliner" ||
          cat === "VIP" ||
          (cat === "Regional" && i % 2 === 0) ||
          (cat === "Bush / GA" && i % 2 === 0);

      let payload: TransportPayload;

      if (isPax) {
        const maxP = Math.max(1, preset.maxPassengers);
        const pax = Math.max(1, Math.min(maxP, Math.round(maxP * (0.35 + prng() * 0.65))));

        payload = {
          type: "passenger",
          amount: pax,
          maxCapacity: maxP,
        };
      } else {
        const maxC = Math.max(25, preset.maxCargoKg);
        const kg = Math.max(25, Math.min(maxC, Math.round(maxC * (0.35 + prng() * 0.65))));

        payload = {
          type: "cargo",
          amount: kg,
          maxCapacity: maxC,
        };
      }

      const financialPlan = FinancialEngine.calculateFixedContractRevenue(fixedDistanceNm, payload, rates);
      const expectedDurationMs = Math.round((fixedDistanceNm / cruiseSpeedKts) * 3600000);
      const timeLimitMs = Math.round(expectedDurationMs * 2.2 + 300000);
      const fuelRequiredPercent = Math.min(
        100,
        Math.max(20, Math.round((fixedDistanceNm / Math.max(50, maxRangeNm)) * 100 * 1.25))
      );

      missions.push({
        id: `dyn_${timeSlot}_${departure.icao}_${destAirport.icao}_${i}`,
        category: cat,
        aircraftId: aircraft.aircraftId,
        aircraftModel: aircraft.model,
        silhouette: preset.silhouette || aircraft.silhouette,
        originIcao: departure.icao,
        originAirport: departure,
        destinationIcao: destAirport.icao,
        destinationAirport: destAirport,
        fixedDistanceNm,
        initialBearingDeg,
        initialBearingFormatted,
        payload,
        grossRevenue: financialPlan.grossRevenue,
        ratePerUnitNm: financialPlan.ratePerUnitNm,
        baseHandlingFee: financialPlan.baseHandlingFee,
        expectedDurationMs,
        timeLimitMs,
        fuelRequiredPercent,
        recommendedAircraft: aircraft.model,
        isAccepted: false,
        timeSlotIndex: timeSlot,
        cumulativeFlownNm: 0,
      });
    }

    log.info(
      `Generated ${missions.length} dynamic missions originating from real GeoFS runway ${departure.icao}`
    );
    return missions;
  }

  static getPayloadDescription(payload: TransportPayload): string {
    if (payload.type === "passenger") {
      return `${payload.amount} Passengers (${payload.amount * 80} kg)`;
    } else {
      return `${payload.amount.toLocaleString()} kg Air Cargo (${(payload.amount * 2.20462).toFixed(0)} lbs)`;
    }
  }

  static getAircraftPreset(aircraftId?: string | number, massKg?: number): AircraftTransportPreset {
    return getAircraftTransportPreset(aircraftId, undefined, massKg);
  }
}

export default TransportEngine;
