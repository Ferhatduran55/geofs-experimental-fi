import groups from "./AircraftGroups";

export interface AircraftFuelPreset {
  id?: string;
  name: string;
  category?: string;
  capacityGal: number;
  idleFlowGalPerSec: number;
  cruiseFlowGalPerSec: number;
  maxFlowGalPerSec: number;
}

/**
 * Predefined Fuel Capacities & Consumption Profiles for known GeoFS Aircraft
 */
export const AIRCRAFT_FUEL_PRESETS: Record<string, AircraftFuelPreset> = {
  // General Aviation - Single Piston
  "1": {
    name: "Piper J-3 Cub",
    capacityGal: 12,
    idleFlowGalPerSec: 0.00025, // ~0.9 gal/hr
    cruiseFlowGalPerSec: 0.00125, // ~4.5 gal/hr
    maxFlowGalPerSec: 0.00220, // ~7.9 gal/hr
  },
  "2": {
    name: "Cessna 172 Skyhawk",
    capacityGal: 56,
    idleFlowGalPerSec: 0.00042, // ~1.5 gal/hr
    cruiseFlowGalPerSec: 0.00236, // ~8.5 gal/hr
    maxFlowGalPerSec: 0.00389, // ~14.0 gal/hr
  },
  "8": {
    name: "Alphajet",
    capacityGal: 525,
    idleFlowGalPerSec: 0.0080,
    cruiseFlowGalPerSec: 0.0450,
    maxFlowGalPerSec: 0.1100,
  },
  "12": {
    name: "Pitts Special S-1",
    capacityGal: 20,
    idleFlowGalPerSec: 0.00060,
    cruiseFlowGalPerSec: 0.00350,
    maxFlowGalPerSec: 0.00650,
  },
  "13": {
    name: "Extra 300S",
    capacityGal: 32,
    idleFlowGalPerSec: 0.00080,
    cruiseFlowGalPerSec: 0.00420,
    maxFlowGalPerSec: 0.00800,
  },
  "21": {
    name: "de Havilland Canada DHC-2 Beaver",
    capacityGal: 95,
    idleFlowGalPerSec: 0.00120,
    cruiseFlowGalPerSec: 0.00600,
    maxFlowGalPerSec: 0.01200,
  },
  "40": {
    name: "Hughes 500D (Helicopter)",
    capacityGal: 64,
    idleFlowGalPerSec: 0.00250,
    cruiseFlowGalPerSec: 0.00850,
    maxFlowGalPerSec: 0.01500,
  },

  // Twin Piston / Turboprop
  "14": {
    name: "Beechcraft Baron 58",
    capacityGal: 166,
    idleFlowGalPerSec: 0.00110,
    cruiseFlowGalPerSec: 0.00650,
    maxFlowGalPerSec: 0.01300,
  },
  "16": {
    name: "Piper PA-34 Seneca",
    capacityGal: 128,
    idleFlowGalPerSec: 0.00100,
    cruiseFlowGalPerSec: 0.00580,
    maxFlowGalPerSec: 0.01150,
  },
  "6": {
    name: "de Havilland Canada DHC-6 Twin Otter",
    capacityGal: 382,
    idleFlowGalPerSec: 0.00450,
    cruiseFlowGalPerSec: 0.01800,
    maxFlowGalPerSec: 0.03600,
  },
  "26": {
    name: "Beechcraft Super King Air B200",
    capacityGal: 544,
    idleFlowGalPerSec: 0.00550,
    cruiseFlowGalPerSec: 0.02400,
    maxFlowGalPerSec: 0.04800,
  },
  "247": {
    name: "ATR 72-600",
    capacityGal: 1780,
    idleFlowGalPerSec: 0.00900,
    cruiseFlowGalPerSec: 0.04500,
    maxFlowGalPerSec: 0.08500,
  },
  "1013": {
    name: "Bombardier Dash 8 Q400",
    capacityGal: 1770,
    idleFlowGalPerSec: 0.01000,
    cruiseFlowGalPerSec: 0.05200,
    maxFlowGalPerSec: 0.09800,
  },

  // Business Jets & Regional
  "5": {
    name: "Embraer Phenom 100",
    capacityGal: 420,
    idleFlowGalPerSec: 0.00750,
    cruiseFlowGalPerSec: 0.03500,
    maxFlowGalPerSec: 0.07500,
  },
  "1021": {
    name: "Cessna Citation X",
    capacityGal: 1930,
    idleFlowGalPerSec: 0.01200,
    cruiseFlowGalPerSec: 0.06000,
    maxFlowGalPerSec: 0.13000,
  },
  "236": {
    name: "Embraer E190",
    capacityGal: 3430,
    idleFlowGalPerSec: 0.01600,
    cruiseFlowGalPerSec: 0.07800,
    maxFlowGalPerSec: 0.17000,
  },
  "1015": {
    name: "Bombardier CRJ-700",
    capacityGal: 3100,
    idleFlowGalPerSec: 0.01500,
    cruiseFlowGalPerSec: 0.07200,
    maxFlowGalPerSec: 0.16000,
  },

  // Narrow-body Jet Airliners
  "4": {
    name: "Boeing 737-700",
    capacityGal: 6875,
    idleFlowGalPerSec: 0.02500, // ~90 gal/hr per engine at idle
    cruiseFlowGalPerSec: 0.10500, // ~378 gal/hr per engine at cruise
    maxFlowGalPerSec: 0.27000, // ~972 gal/hr per engine at TOGA
  },
  "1001": {
    name: "Boeing 737-800",
    capacityGal: 6875,
    idleFlowGalPerSec: 0.02500,
    cruiseFlowGalPerSec: 0.10800,
    maxFlowGalPerSec: 0.27500,
  },
  "242": {
    name: "Airbus A320neo",
    capacityGal: 6400,
    idleFlowGalPerSec: 0.02300,
    cruiseFlowGalPerSec: 0.09800,
    maxFlowGalPerSec: 0.26000,
  },
  "238": {
    name: "Airbus A321-200",
    capacityGal: 7930,
    idleFlowGalPerSec: 0.02600,
    cruiseFlowGalPerSec: 0.11500,
    maxFlowGalPerSec: 0.29000,
  },

  // Wide-body Jet Airliners (Twin)
  "24": {
    name: "Boeing 777-200ER",
    capacityGal: 45220,
    idleFlowGalPerSec: 0.06500,
    cruiseFlowGalPerSec: 0.35000,
    maxFlowGalPerSec: 0.95000,
  },
  "25": {
    name: "Boeing 787-8 Dreamliner",
    capacityGal: 33340,
    idleFlowGalPerSec: 0.05000,
    cruiseFlowGalPerSec: 0.26000,
    maxFlowGalPerSec: 0.72000,
  },
  "235": {
    name: "Airbus A330-300",
    capacityGal: 25600,
    idleFlowGalPerSec: 0.05200,
    cruiseFlowGalPerSec: 0.27000,
    maxFlowGalPerSec: 0.75000,
  },
  "240": {
    name: "Airbus A350-900",
    capacityGal: 37200,
    idleFlowGalPerSec: 0.05800,
    cruiseFlowGalPerSec: 0.29000,
    maxFlowGalPerSec: 0.82000,
  },

  // Wide-body 4-Engine Airliners & Cargo
  "10": {
    name: "Boeing 747-400",
    capacityGal: 57285,
    idleFlowGalPerSec: 0.04500, // per engine (4 engines total)
    cruiseFlowGalPerSec: 0.22000,
    maxFlowGalPerSec: 0.65000,
  },
  "252": {
    name: "Airbus A380-800",
    capacityGal: 84600,
    idleFlowGalPerSec: 0.05200, // per engine (4 engines total)
    cruiseFlowGalPerSec: 0.26000,
    maxFlowGalPerSec: 0.78000,
  },
  "1002": {
    name: "Airbus A340-600",
    capacityGal: 51600,
    idleFlowGalPerSec: 0.04000,
    cruiseFlowGalPerSec: 0.21000,
    maxFlowGalPerSec: 0.62000,
  },
  "1023": {
    name: "McDonnell Douglas MD-11",
    capacityGal: 38615,
    idleFlowGalPerSec: 0.04800, // per engine (3 engines)
    cruiseFlowGalPerSec: 0.24000,
    maxFlowGalPerSec: 0.69000,
  },
  "2788": {
    name: "Antonov An-225 Mriya",
    capacityGal: 96000,
    idleFlowGalPerSec: 0.04200, // per engine (6 engines total)
    cruiseFlowGalPerSec: 0.24000,
    maxFlowGalPerSec: 0.70000,
  },

  // Military / Supersonic Fighter Jets & Transports
  "3": {
    name: "Dassault Mirage 2000",
    capacityGal: 1050,
    idleFlowGalPerSec: 0.02800,
    cruiseFlowGalPerSec: 0.14000,
    maxFlowGalPerSec: 0.75000, // Full afterburner
  },
  "7": {
    name: "Supermarine Spitfire Mk IX",
    capacityGal: 102,
    idleFlowGalPerSec: 0.00200,
    cruiseFlowGalPerSec: 0.01200,
    maxFlowGalPerSec: 0.02800,
  },
  "9": {
    name: "Major Tom (Hot Air Balloon)",
    capacityGal: 40, // Propane fuel equivalent
    idleFlowGalPerSec: 0.00050,
    cruiseFlowGalPerSec: 0.00250,
    maxFlowGalPerSec: 0.00800,
  },
  "15": {
    name: "North American P-51D Mustang",
    capacityGal: 269,
    idleFlowGalPerSec: 0.00350,
    cruiseFlowGalPerSec: 0.01600,
    maxFlowGalPerSec: 0.03800,
  },
  "18": {
    name: "General Dynamics F-16 Fighting Falcon",
    capacityGal: 1670, // 1070 gal internal + 600 gal external drop tanks
    idleFlowGalPerSec: 0.03000,
    cruiseFlowGalPerSec: 0.15000,
    maxFlowGalPerSec: 0.85000,
  },
  "20": {
    name: "Aérospatiale/BAC Concorde",
    capacityGal: 31080,
    idleFlowGalPerSec: 0.07500, // per engine (4 Olympus 593)
    cruiseFlowGalPerSec: 0.55000,
    maxFlowGalPerSec: 1.65000,
  },
  "27": {
    name: "Sukhoi Su-35 Flanker-E",
    capacityGal: 3040,
    idleFlowGalPerSec: 0.03200, // per engine
    cruiseFlowGalPerSec: 0.16000,
    maxFlowGalPerSec: 0.90000,
  },
  "29": {
    name: "Boeing F/A-18F Super Hornet",
    capacityGal: 1900,
    idleFlowGalPerSec: 0.02900,
    cruiseFlowGalPerSec: 0.14500,
    maxFlowGalPerSec: 0.82000,
  },
  "1024": {
    name: "McDonnell Douglas F-15 Eagle",
    capacityGal: 3500,
    idleFlowGalPerSec: 0.03500,
    cruiseFlowGalPerSec: 0.18000,
    maxFlowGalPerSec: 0.95000,
  },
  "2310": {
    name: "Grumman F-14 Tomcat",
    capacityGal: 2400,
    idleFlowGalPerSec: 0.03200,
    cruiseFlowGalPerSec: 0.16500,
    maxFlowGalPerSec: 0.88000,
  },
  "2364": {
    name: "Eurofighter Typhoon",
    capacityGal: 1750,
    idleFlowGalPerSec: 0.02800,
    cruiseFlowGalPerSec: 0.14500,
    maxFlowGalPerSec: 0.80000,
  },
  "2556": {
    name: "Fairchild Republic A-10 Thunderbolt II",
    capacityGal: 1600,
    idleFlowGalPerSec: 0.02000,
    cruiseFlowGalPerSec: 0.09500,
    maxFlowGalPerSec: 0.35000,
  },
  "2581": {
    name: "Lockheed Martin F-22 Raptor",
    capacityGal: 2600,
    idleFlowGalPerSec: 0.03600,
    cruiseFlowGalPerSec: 0.17000,
    maxFlowGalPerSec: 0.92000,
  },
  "2808": {
    name: "Mitsubishi A6M Zero",
    capacityGal: 135,
    idleFlowGalPerSec: 0.00200,
    cruiseFlowGalPerSec: 0.01100,
    maxFlowGalPerSec: 0.02500,
  },
  "2857": {
    name: "Mikoyan MiG-29 Fulcrum",
    capacityGal: 1150,
    idleFlowGalPerSec: 0.02700,
    cruiseFlowGalPerSec: 0.14000,
    maxFlowGalPerSec: 0.78000,
  },
  "2948": {
    name: "Lockheed Martin F-35 Lightning II",
    capacityGal: 2700,
    idleFlowGalPerSec: 0.03200,
    cruiseFlowGalPerSec: 0.15500,
    maxFlowGalPerSec: 0.84000,
  },
  "2988": {
    name: "Sukhoi Su-27 Flanker",
    capacityGal: 3200,
    idleFlowGalPerSec: 0.03300,
    cruiseFlowGalPerSec: 0.16500,
    maxFlowGalPerSec: 0.91000,
  },
  "3591": {
    name: "Lockheed SR-71 Blackbird",
    capacityGal: 12200,
    idleFlowGalPerSec: 0.08000,
    cruiseFlowGalPerSec: 0.65000,
    maxFlowGalPerSec: 2.10000,
  },
  "3617": {
    name: "Saab JAS 39 Gripen",
    capacityGal: 900,
    idleFlowGalPerSec: 0.02500,
    cruiseFlowGalPerSec: 0.12500,
    maxFlowGalPerSec: 0.72000,
  },
  "4251": {
    name: "Messerschmitt Bf 109",
    capacityGal: 105,
    idleFlowGalPerSec: 0.00200,
    cruiseFlowGalPerSec: 0.01300,
    maxFlowGalPerSec: 0.02800,
  },
  "5229": {
    name: "McDonnell Douglas F-4 Phantom II",
    capacityGal: 3300,
    idleFlowGalPerSec: 0.03800,
    cruiseFlowGalPerSec: 0.19000,
    maxFlowGalPerSec: 1.05000,
  },
  "5347": {
    name: "Northrop T-38 Talon",
    capacityGal: 580,
    idleFlowGalPerSec: 0.01800,
    cruiseFlowGalPerSec: 0.08500,
    maxFlowGalPerSec: 0.42000,
  },
  "5405": {
    name: "Dassault Rafale",
    capacityGal: 1800,
    idleFlowGalPerSec: 0.02800,
    cruiseFlowGalPerSec: 0.14500,
    maxFlowGalPerSec: 0.80000,
  },
  "5431": {
    name: "Sukhoi Su-57 Felon",
    capacityGal: 3300,
    idleFlowGalPerSec: 0.03500,
    cruiseFlowGalPerSec: 0.17500,
    maxFlowGalPerSec: 0.95000,
  },

  // Gliders (No fuel consumption)
  "11": {
    name: "Schleicher ASK 21 Glider",
    capacityGal: 0,
    idleFlowGalPerSec: 0,
    cruiseFlowGalPerSec: 0,
    maxFlowGalPerSec: 0,
  },
  "41": {
    name: "DG Flugzeugbau DG-808S",
    capacityGal: 0,
    idleFlowGalPerSec: 0,
    cruiseFlowGalPerSec: 0,
    maxFlowGalPerSec: 0,
  },
};

/**
 * Category-level Fallback Presets matching AircraftGroups
 */
export const CATEGORY_FUEL_PRESETS: Record<string, AircraftFuelPreset> = {
  singleEngine: {
    name: "General Aviation (Single)",
    capacityGal: 55,
    idleFlowGalPerSec: 0.00042,
    cruiseFlowGalPerSec: 0.00240,
    maxFlowGalPerSec: 0.00420,
  },
  twinPistonEngine: {
    name: "Twin Piston Aircraft",
    capacityGal: 160,
    idleFlowGalPerSec: 0.00110,
    cruiseFlowGalPerSec: 0.00650,
    maxFlowGalPerSec: 0.01250,
  },
  twinTurboprop: {
    name: "Twin Turboprop",
    capacityGal: 450,
    idleFlowGalPerSec: 0.00500,
    cruiseFlowGalPerSec: 0.02100,
    maxFlowGalPerSec: 0.04200,
  },
  turbopropCommuter: {
    name: "Turboprop Commuter",
    capacityGal: 1750,
    idleFlowGalPerSec: 0.00950,
    cruiseFlowGalPerSec: 0.04800,
    maxFlowGalPerSec: 0.09200,
  },
  businessJet: {
    name: "Business Jet",
    capacityGal: 1200,
    idleFlowGalPerSec: 0.01000,
    cruiseFlowGalPerSec: 0.05000,
    maxFlowGalPerSec: 0.10500,
  },
  privateJet: {
    name: "Private Jet",
    capacityGal: 1200,
    idleFlowGalPerSec: 0.01000,
    cruiseFlowGalPerSec: 0.05000,
    maxFlowGalPerSec: 0.10500,
  },
  regionalJet: {
    name: "Regional Jet",
    capacityGal: 3200,
    idleFlowGalPerSec: 0.01550,
    cruiseFlowGalPerSec: 0.07500,
    maxFlowGalPerSec: 0.16500,
  },
  twinjetNarrowBody: {
    name: "Narrow-body Jet Airliner",
    capacityGal: 6800,
    idleFlowGalPerSec: 0.02450,
    cruiseFlowGalPerSec: 0.10500,
    maxFlowGalPerSec: 0.27000,
  },
  twinjetNarrowBody2: {
    name: "Narrow-body Jet Airliner",
    capacityGal: 6800,
    idleFlowGalPerSec: 0.02450,
    cruiseFlowGalPerSec: 0.10500,
    maxFlowGalPerSec: 0.27000,
  },
  rearMountedTwinJet: {
    name: "Rear-mounted Twinjet",
    capacityGal: 3600,
    idleFlowGalPerSec: 0.01600,
    cruiseFlowGalPerSec: 0.08000,
    maxFlowGalPerSec: 0.18000,
  },
  twinjetWideBody: {
    name: "Wide-body Twin Jet",
    capacityGal: 38000,
    idleFlowGalPerSec: 0.05800,
    cruiseFlowGalPerSec: 0.30000,
    maxFlowGalPerSec: 0.85000,
  },
  wideBody4Engine: {
    name: "Wide-body 4-Engine Heavy",
    capacityGal: 65000,
    idleFlowGalPerSec: 0.04800,
    cruiseFlowGalPerSec: 0.24000,
    maxFlowGalPerSec: 0.70000,
  },
  narrowBody4Engine: {
    name: "Narrow-body 4-Engine",
    capacityGal: 22000,
    idleFlowGalPerSec: 0.02300,
    cruiseFlowGalPerSec: 0.11000,
    maxFlowGalPerSec: 0.28000,
  },
  trijet: {
    name: "Trijet Airliner",
    capacityGal: 36000,
    idleFlowGalPerSec: 0.04600,
    cruiseFlowGalPerSec: 0.23000,
    maxFlowGalPerSec: 0.65000,
  },
  heavyCargo: {
    name: "Heavy Cargo Transport",
    capacityGal: 80000,
    idleFlowGalPerSec: 0.04500,
    cruiseFlowGalPerSec: 0.25000,
    maxFlowGalPerSec: 0.72000,
  },
  fighterJet: {
    name: "Fighter Jet",
    capacityGal: 1400,
    idleFlowGalPerSec: 0.03000,
    cruiseFlowGalPerSec: 0.15000,
    maxFlowGalPerSec: 0.85000,
  },
  fighter: {
    name: "Piston Fighter",
    capacityGal: 120,
    idleFlowGalPerSec: 0.00220,
    cruiseFlowGalPerSec: 0.01300,
    maxFlowGalPerSec: 0.03000,
  },
  glider: {
    name: "Glider / Sailplane",
    capacityGal: 0,
    idleFlowGalPerSec: 0,
    cruiseFlowGalPerSec: 0,
    maxFlowGalPerSec: 0,
  },
  default: {
    name: "Standard Aircraft",
    capacityGal: 2500,
    idleFlowGalPerSec: 0.01200,
    cruiseFlowGalPerSec: 0.06000,
    maxFlowGalPerSec: 0.14000,
  },
};

/**
 * Resolves the category for a given aircraft ID using AircraftGroups or name heuristics
 */
export function getAircraftCategory(aircraftId: string | number, aircraftName?: string): string {
  const idStr = String(aircraftId);
  for (const [catName, idList] of Object.entries(groups)) {
    if (Array.isArray(idList) && idList.includes(idStr)) {
      return catName;
    }
  }

  // Name-based classification for community or unlisted aircraft
  const geofs = (typeof unsafeWindow !== "undefined" ? (unsafeWindow as any) : (globalThis as any))?.geofs;
  const name =
    aircraftName ||
    geofs?.aircraftList?.[idStr]?.name ||
    (String(geofs?.aircraft?.instance?.id) === idStr ? geofs?.aircraft?.instance?.definition?.name : "");

  if (name) {
    const nameLower = name.toLowerCase();
    if (
      nameLower.includes("fighter") ||
      nameLower.includes("f-1") ||
      nameLower.includes("f-2") ||
      nameLower.includes("f-3") ||
      nameLower.includes("f/a-18") ||
      nameLower.includes("f-14") ||
      nameLower.includes("f-15") ||
      nameLower.includes("f-16") ||
      nameLower.includes("f-22") ||
      nameLower.includes("f-35") ||
      nameLower.includes("f-4") ||
      nameLower.includes("f-5") ||
      nameLower.includes("mirage") ||
      nameLower.includes("rafale") ||
      nameLower.includes("typhoon") ||
      nameLower.includes("eurofighter") ||
      nameLower.includes("gripen") ||
      nameLower.includes("mig-") ||
      nameLower.includes("su-") ||
      nameLower.includes("sukhoi") ||
      nameLower.includes("harrier") ||
      nameLower.includes("tornado") ||
      nameLower.includes("a-10")
    ) {
      return "fighterJet";
    }
    if (
      nameLower.includes("phenom") ||
      nameLower.includes("citation") ||
      nameLower.includes("learjet") ||
      nameLower.includes("gulfstream") ||
      nameLower.includes("challenger") ||
      nameLower.includes("global express") ||
      nameLower.includes("falcon") ||
      nameLower.includes("hawker") ||
      nameLower.includes("hondajet") ||
      nameLower.includes("pc-24") ||
      nameLower.includes("business") ||
      nameLower.includes("bizjet")
    ) {
      return "businessJet";
    }
    if (
      nameLower.includes("an-124") ||
      nameLower.includes("an-225") ||
      nameLower.includes("mriya") ||
      nameLower.includes("beluga") ||
      nameLower.includes("c-5") ||
      nameLower.includes("c-17") ||
      (nameLower.includes("cargo") && (nameLower.includes("747") || nameLower.includes("777")))
    ) {
      return "heavyCargo";
    }
    if (nameLower.includes("747") || nameLower.includes("380")) {
      return "wideBody4Engine";
    }
    if (
      nameLower.includes("777") ||
      nameLower.includes("787") ||
      nameLower.includes("350") ||
      nameLower.includes("330") ||
      nameLower.includes("340") ||
      nameLower.includes("dc-10") ||
      nameLower.includes("md-11")
    ) {
      return "twinjetWideBody";
    }
    if (
      nameLower.includes("737") ||
      nameLower.includes("320") ||
      nameLower.includes("321") ||
      nameLower.includes("319") ||
      nameLower.includes("757") ||
      nameLower.includes("727") ||
      nameLower.includes("717") ||
      nameLower.includes("md-8") ||
      nameLower.includes("c919") ||
      nameLower.includes("airliner")
    ) {
      return "twinjetNarrowBody";
    }
    if (
      nameLower.includes("crj") ||
      nameLower.includes("erj") ||
      nameLower.includes("e-jet") ||
      nameLower.includes("e170") ||
      nameLower.includes("e175") ||
      nameLower.includes("e190") ||
      nameLower.includes("e195") ||
      nameLower.includes("a220") ||
      nameLower.includes("superjet") ||
      nameLower.includes("regional")
    ) {
      return "regionalJet";
    }
    if (
      nameLower.includes("atr") ||
      nameLower.includes("dash 8") ||
      nameLower.includes("q400") ||
      nameLower.includes("king air") ||
      nameLower.includes("saab") ||
      nameLower.includes("twin otter") ||
      nameLower.includes("commuter") ||
      nameLower.includes("turboprop")
    ) {
      return "turbopropCommuter";
    }
    if (
      nameLower.includes("cessna") ||
      nameLower.includes("cub") ||
      nameLower.includes("piper") ||
      nameLower.includes("bonanza") ||
      nameLower.includes("baron") ||
      nameLower.includes("cirrus") ||
      nameLower.includes("extra") ||
      nameLower.includes("prop")
    ) {
      return "singleEngine";
    }
  }

  return "default";
}

/**
 * Retrieves the most accurate predefined fuel preset for an aircraft
 */
export function getAircraftFuelPreset(
  aircraftId?: string | number,
  fallbackCategory?: string,
  aircraftMassKg?: number
): AircraftFuelPreset {
  const geofs = (typeof unsafeWindow !== "undefined" ? (unsafeWindow as any) : (globalThis as any))?.geofs;
  if (aircraftId !== undefined && aircraftId !== null) {
    const idStr = String(aircraftId);
    const liveName = geofs?.aircraftList?.[idStr]?.name;

    if (AIRCRAFT_FUEL_PRESETS[idStr]) {
      return {
        ...AIRCRAFT_FUEL_PRESETS[idStr],
        id: idStr,
        name: liveName || AIRCRAFT_FUEL_PRESETS[idStr].name,
      };
    }

    const detectedCategory = getAircraftCategory(idStr, liveName);
    if (detectedCategory && CATEGORY_FUEL_PRESETS[detectedCategory]) {
      return {
        ...CATEGORY_FUEL_PRESETS[detectedCategory],
        id: idStr,
        category: detectedCategory,
        name: liveName || CATEGORY_FUEL_PRESETS[detectedCategory].name,
      };
    }
  }

  if (fallbackCategory && CATEGORY_FUEL_PRESETS[fallbackCategory]) {
    return { ...CATEGORY_FUEL_PRESETS[fallbackCategory], category: fallbackCategory };
  }

  // Dynamic fallback based on mass if completely unknown community aircraft
  const mass = aircraftMassKg || 2000;
  const estCapacityGal = Math.max(20, Math.round(mass * 0.21));
  const estIdleFlow = Math.max(0.0003, estCapacityGal * 0.000006);
  const estCruiseFlow = Math.max(0.0015, estCapacityGal * 0.000035);
  const estMaxFlow = estCruiseFlow * 2.5;

  return {
    name: "Custom Aircraft",
    capacityGal: estCapacityGal,
    idleFlowGalPerSec: estIdleFlow,
    cruiseFlowGalPerSec: estCruiseFlow,
    maxFlowGalPerSec: estMaxFlow,
  };
}

export default AIRCRAFT_FUEL_PRESETS;
