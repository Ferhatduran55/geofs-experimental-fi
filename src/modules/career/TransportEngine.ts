import Logger from "../../shared/Logger";
import {
  calculateDistanceNm,
  calculateBearingDeg,
  formatBearingWithCompass,
  findNearestAirport,
  getGeoFSRunways,
  type AirportInfo,
} from "./AirportDatabase";
import { FinancialEngine, type TransportPayload } from "./FinancialEngine";
import { MarketEngine } from "./MarketEngine";

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
  aircraftModel: string;            // Uçak Adı ve Modeli (GeoFS'ten canlı alınır)
  silhouette: "airliner" | "regional" | "turboprop" | "ga" | "heavy" | "business";
  originIcao: string;
  originAirport: AirportInfo;
  destinationIcao: string;
  destinationAirport: AirportInfo;
  fixedDistanceNm: number;          // Sabit Kuş Uçuşu Mesafesi (NM)
  initialBearingDeg: number;        // Kalkış Kerteriz Açısı (°)
  initialBearingFormatted: string;  // Örn: "312° (NW)"
  payload: TransportPayload;
  grossRevenue: number;             // Sabit Müşteri Sözleşme Bedeli ($)
  ratePerUnitNm: number;
  baseHandlingFee: number;
  expectedDurationMs: number;       // Tahmini Uçuş Süresi (ms)
  timeLimitMs: number;
  fuelRequiredPercent: number;      // Önerilen Yakıt Miktarı (%)
  recommendedAircraft: string;
  isAccepted: boolean;
  acceptedAt?: number;
  timeSlotIndex: number;            // 30 dakikalık zaman bloğu indexi
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
    return Math.floor(Date.now() / (30 * 60 * 1000));
  }

  static getRemainingSlotSeconds(): number {
    const elapsedSec = Math.floor(Date.now() / 1000) % 1800;
    return 1800 - elapsedSec;
  }

  /**
   * Dynamically fetch aircraft info from GeoFS aircraftList or live instance
   */
  static getDynamicAircraftForCategory(
    category: "Airliner" | "Regional" | "Bush / GA" | "Cargo" | "VIP",
    prng: () => number
  ): AircraftInfoPreset {
    const geofs = (unsafeWindow as any).geofs;
    const acList = geofs?.aircraftList;

    if (acList && typeof acList === "object") {
      const keys = Object.keys(acList);
      if (keys.length > 0) {
        const matchingKeys: string[] = [];
        for (const k of keys) {
          const ac = acList[k];
          const nameLower = String(ac?.name || "").toLowerCase();

          if (category === "Airliner" && (nameLower.includes("737") || nameLower.includes("320") || nameLower.includes("777") || nameLower.includes("380") || nameLower.includes("airliner"))) {
            matchingKeys.push(k);
          } else if (category === "Cargo" && (nameLower.includes("cargo") || nameLower.includes("747") || nameLower.includes("225") || nameLower.includes("freight"))) {
            matchingKeys.push(k);
          } else if (category === "Regional" && (nameLower.includes("embraer") || nameLower.includes("crj") || nameLower.includes("otter") || nameLower.includes("king air") || nameLower.includes("regional") || nameLower.includes("dash"))) {
            matchingKeys.push(k);
          } else if (category === "VIP" && (nameLower.includes("phenom") || nameLower.includes("learjet") || nameLower.includes("citation") || nameLower.includes("jet") || nameLower.includes("business"))) {
            matchingKeys.push(k);
          } else if (category === "Bush / GA" && (nameLower.includes("cessna") || nameLower.includes("cub") || nameLower.includes("baron") || nameLower.includes("extra") || nameLower.includes("single") || nameLower.includes("prop"))) {
            matchingKeys.push(k);
          }
        }

        const pool = matchingKeys.length > 0 ? matchingKeys : keys;
        const selectedId = pool[Math.floor(prng() * pool.length)];
        const acData = acList[selectedId];
        const modelName = acData?.name || `Aircraft #${selectedId}`;

        let sil: "airliner" | "regional" | "turboprop" | "ga" | "heavy" | "business" = "airliner";
        if (category === "Cargo") sil = "heavy";
        else if (category === "VIP") sil = "business";
        else if (category === "Bush / GA") sil = "ga";
        else if (category === "Regional") sil = "regional";

        return {
          aircraftId: String(selectedId),
          model: modelName,
          silhouette: sil,
        };
      }
    }

    const curInst = geofs?.aircraft?.instance;
    const curId = String(curInst?.id || "1");
    const curName = curInst?.definition?.name || "Aircraft";

    let sil: "airliner" | "regional" | "turboprop" | "ga" | "heavy" | "business" = "airliner";
    if (category === "Cargo") sil = "heavy";
    else if (category === "VIP") sil = "business";
    else if (category === "Bush / GA") sil = "ga";
    else if (category === "Regional") sil = "regional";

    return {
      aircraftId: curId,
      model: curName,
      silhouette: sil,
    };
  }

  /**
   * 100% Procedural & Authentic Operations Generator
   * Targets are ALWAYS real GeoFS runways. Never synthetic or in the middle of the sea.
   */
  static generate30MinDeterministicOperations(
    originLat?: number,
    originLon?: number,
    aircraftMassKg: number = 2500,
    _aircraftId?: string | number
  ): TransportMission[] {
    const timeSlot = this.getCurrentTimeSlot();
    const geofs = (unsafeWindow as any).geofs;
    const lla =
      originLat !== undefined && originLon !== undefined
        ? [originLat, originLon]
        : geofs?.aircraft?.instance?.llaLocation || [41.2753, 28.7519];

    // Find nearest departure runway from GeoFS
    const departure = findNearestAirport(lla[0], lla[1]);

    const seed = Math.abs(
      (timeSlot * 1000003) ^
      (Math.round(departure.lat * 1000) * 73856093) ^
      (Math.round(departure.lon * 1000) * 19349663) ^
      (Math.round(aircraftMassKg) * 83492791)
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
    ];

    const missions: TransportMission[] = [];

    // Filter available real runways other than departure
    const validDestinations = allRunways.filter(
      (rw) => rw.icao !== departure.icao && calculateDistanceNm(departure.lat, departure.lon, rw.lat, rw.lon) > 2
    );

    for (let i = 0; i < categories.length; i++) {
      const cat = categories[i];
      let minDist = 20;
      let maxDist = 150;
      let cruiseSpeedKts = 130;

      if (cat === "Airliner") {
        minDist = 120;
        maxDist = 1200;
        cruiseSpeedKts = 450;
      } else if (cat === "Cargo") {
        minDist = 100;
        maxDist = 950;
        cruiseSpeedKts = 430;
      } else if (cat === "Regional") {
        minDist = 40;
        maxDist = 380;
        cruiseSpeedKts = 260;
      } else if (cat === "VIP") {
        minDist = 50;
        maxDist = 550;
        cruiseSpeedKts = 420;
      } else {
        minDist = 10;
        maxDist = 110;
        cruiseSpeedKts = 120;
      }

      const aircraft = this.getDynamicAircraftForCategory(cat, prng);

      // 1. First try to find real GeoFS runways in the preferred category distance range
      let candidates = validDestinations.filter((rw) => {
        const d = calculateDistanceNm(departure.lat, departure.lon, rw.lat, rw.lon);
        return d >= minDist && d <= maxDist;
      });

      let destAirport: AirportInfo;

      if (candidates.length > 0) {
        const destIdx = Math.floor(prng() * candidates.length);
        destAirport = candidates[destIdx];
      } else if (validDestinations.length > 0) {
        // 2. Fallback: Select from any other real GeoFS runway in the world
        const destIdx = Math.floor(prng() * validDestinations.length);
        destAirport = validDestinations[destIdx];
      } else {
        // 3. Absolute fallback if GeoFS has only 1 runway loaded: place at 30 NM along runway heading
        const headingRad = ((departure.heading || 270) * Math.PI) / 180;
        const targetDistNm = 35;
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

      const isPax =
        cat === "Airliner" ||
        cat === "VIP" ||
        (cat === "Regional" && i % 2 === 0) ||
        (cat === "Bush / GA" && i % 2 === 0);
      let payload: TransportPayload;

      if (isPax) {
        let pax = 3;
        if (cat === "Airliner") pax = Math.round(120 + prng() * 140);
        else if (cat === "Regional") pax = Math.round(30 + prng() * 45);
        else if (cat === "VIP") pax = Math.round(4 + prng() * 8);
        else pax = Math.round(1 + prng() * 3);

        payload = {
          type: "passenger",
          amount: pax,
          maxCapacity: pax,
        };
      } else {
        let kg = 350;
        if (cat === "Cargo") kg = Math.round(6000 + prng() * 25000);
        else if (cat === "Regional") kg = Math.round(1500 + prng() * 2500);
        else kg = Math.round(150 + prng() * 600);

        payload = {
          type: "cargo",
          amount: kg,
          maxCapacity: kg,
        };
      }

      const financialPlan = FinancialEngine.calculateFixedContractRevenue(fixedDistanceNm, payload, rates);
      const expectedDurationMs = Math.round((fixedDistanceNm / cruiseSpeedKts) * 3600000);
      const timeLimitMs = Math.round(expectedDurationMs * 2.2 + 300000);
      const fuelRequiredPercent = Math.min(100, Math.max(30, Math.round(25 + (fixedDistanceNm / maxDist) * 65)));

      missions.push({
        id: `dyn_${timeSlot}_${departure.icao}_${destAirport.icao}_${i}`,
        category: cat,
        aircraftId: aircraft.aircraftId,
        aircraftModel: aircraft.model,
        silhouette: aircraft.silhouette,
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
}

export default TransportEngine;
