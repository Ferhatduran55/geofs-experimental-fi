import Logger from "../../classes/Logger";

const log = Logger.create("MarketEngine");

export interface MarketRates {
  passengerRatePerNm: number; // $/pax/NM
  cargoRatePerNm: number;     // $/kg/NM
  fuelRatePerGal: number;     // $/gallon
  baseContractFee: number;    // Sabit taban işlem ücreti ($)
}

export interface MarketTrendPoint {
  hour: number;
  rates: MarketRates;
}

export class MarketEngine {
  private static seed: number = 42;

  // Base constants
  static readonly BASE_PAX_RATE = 0.45;       // $/pax/NM
  static readonly BASE_CARGO_RATE = 0.005;     // $/kg/NM
  static readonly BASE_FUEL_RATE = 5.80;       // $/gal
  static readonly BASE_CONTRACT_FEE = 250.0;   // Sabit taban kontrat ücreti ($)

  static init(seedString: string = "GeoFSCareerSeed"): void {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      const char = seedString.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    this.seed = Math.abs(hash) || 42;
    log.info(`MarketEngine initialized with seed: ${this.seed}`);
  }

  private static intHash(key: number): number {
    let h = (key ^ (this.seed * 2654435761)) >>> 0;
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h = (h ^ (h >>> 16)) >>> 0;
    return h / 4294967296; // normalize to [0, 1)
  }

  private static getAnchor(dayKey: number, hour: number, channel: number): number {
    const fluctuation = 0.15; // ±15% max swing from base
    const key = dayKey * 1000 + hour * 10 + channel;
    const raw = this.intHash(key);
    return (raw * 2 - 1) * fluctuation; // [-0.15, +0.15]
  }

  private static getDayKey(date: Date): number {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();
    const day = date.getUTCDate();
    return year * 400 + month * 32 + day;
  }

  static getRatesForTime(date: Date): MarketRates {
    const dayKey = this.getDayKey(date);
    const hour = date.getUTCHours();
    const minute = date.getUTCMinutes();
    const second = date.getUTCSeconds();

    // Linear interpolation factor within the current hour
    const t = (minute * 60 + second) / 3600;

    // FUEL is the primary market driver
    const fuelA = this.getAnchor(dayKey, hour, 4);
    const fuelB = this.getAnchor(dayKey, (hour + 1) % 25, 5);
    const fuelMod = fuelA + (fuelB - fuelA) * t;

    // PAX and CARGO are 70% correlated with fuel + 30% independent variation
    const paxIndepA = this.getAnchor(dayKey, hour, 0);
    const paxIndepB = this.getAnchor(dayKey, (hour + 1) % 25, 1);
    const paxIndep = paxIndepA + (paxIndepB - paxIndepA) * t;
    const paxMod = fuelMod * 0.7 + paxIndep * 0.3;

    const cargoIndepA = this.getAnchor(dayKey, hour, 2);
    const cargoIndepB = this.getAnchor(dayKey, (hour + 1) % 25, 3);
    const cargoIndep = cargoIndepA + (cargoIndepB - cargoIndepA) * t;
    const cargoMod = fuelMod * 0.7 + cargoIndep * 0.3;

    return {
      passengerRatePerNm: Number((this.BASE_PAX_RATE * (1 + paxMod)).toFixed(4)),
      cargoRatePerNm: Number((this.BASE_CARGO_RATE * (1 + cargoMod)).toFixed(6)),
      fuelRatePerGal: Number((this.BASE_FUEL_RATE * (1 + fuelMod)).toFixed(2)),
      baseContractFee: this.BASE_CONTRACT_FEE,
    };
  }

  static getCurrentRates(): MarketRates {
    return this.getRatesForTime(new Date());
  }

  static getTodaysTrend(): MarketTrendPoint[] {
    const trend: MarketTrendPoint[] = [];
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setUTCHours(0, 0, 0, 0);

    for (let i = 0; i <= 24; i++) {
      const timePoint = new Date(startOfDay);
      timePoint.setUTCHours(i, 0, 0, 0);

      trend.push({
        hour: i,
        rates: this.getRatesForTime(timePoint),
      });
    }

    return trend;
  }
}
