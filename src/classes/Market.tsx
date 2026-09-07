import Logger from "./Logger";

const log = Logger.create("Market");

export default class Market {
    static seed: number = 42;

    // Base prices
    static readonly BASE_PAX_RATE = 0.45;     // $/pax/NM
    static readonly BASE_CARGO_RATE = 0.005;   // $/kg/NM
    static readonly BASE_FUEL_RATE = 5.80;     // $/gallon

    static init(seedString?: string): void {
        if (seedString) {
            this.seed = this.hashString(seedString);
        } else {
            this.seed = this.hashString("GeoFSCareerSeed");
        }
        log.info(`Market initialized with seed ${this.seed}`);
    }

    private static hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash) || 1;
    }

    /**
     * Integer hash for a given key. Produces a deterministic
     * pseudo-random number in [0, 1) for each unique integer input.
     * Uses a simple but effective bit-mixing approach (similar to xxHash-lite).
     */
    private static intHash(key: number): number {
        let h = (key ^ (this.seed * 2654435761)) >>> 0;
        h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
        h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
        h = (h ^ (h >>> 16)) >>> 0;
        return h / 4294967296; // normalize to [0, 1)
    }

    /**
     * Get a deterministic "anchor" value for a specific day+hour+channel.
     * Returns a modifier in [-fluctuation, +fluctuation].
     */
    private static getAnchor(dayKey: number, hour: number, channel: number): number {
        const fluctuation = 0.12; // ±12% max swing from base
        const key = dayKey * 1000 + hour * 10 + channel;
        const raw = this.intHash(key); // [0, 1)
        return (raw * 2 - 1) * fluctuation; // [-0.12, +0.12]
    }

    private static getDayKey(date: Date): number {
        const year = date.getUTCFullYear();
        const month = date.getUTCMonth();
        const day = date.getUTCDate();
        // unique day number
        return year * 400 + month * 32 + day;
    }

    static getRatesForTime(date: Date): MarketRates {
        const dayKey = this.getDayKey(date);
        const hour = date.getUTCHours();
        const minute = date.getUTCMinutes();
        const second = date.getUTCSeconds();

        // Linear interpolation factor within the current hour
        const t = (minute * 60 + second) / 3600; // [0, 1)

        // FUEL is the primary market driver — computed independently
        const fuelA = this.getAnchor(dayKey, hour, 4);
        const fuelB = this.getAnchor(dayKey, (hour + 1) % 25, 5);
        const fuelMod = fuelA + (fuelB - fuelA) * t;

        // PAX and CARGO are 70% correlated with fuel + 30% independent variation
        // This means when fuel is expensive, transport rates also rise
        const paxIndepA = this.getAnchor(dayKey, hour, 0);
        const paxIndepB = this.getAnchor(dayKey, (hour + 1) % 25, 1);
        const paxIndep = paxIndepA + (paxIndepB - paxIndepA) * t;
        const paxMod = fuelMod * 0.7 + paxIndep * 0.3;

        const cargoIndepA = this.getAnchor(dayKey, hour, 2);
        const cargoIndepB = this.getAnchor(dayKey, (hour + 1) % 25, 3);
        const cargoIndep = cargoIndepA + (cargoIndepB - cargoIndepA) * t;
        const cargoMod = fuelMod * 0.7 + cargoIndep * 0.3;

        return {
            passenger: Number((this.BASE_PAX_RATE * (1 + paxMod)).toFixed(4)),
            cargo: Number((this.BASE_CARGO_RATE * (1 + cargoMod)).toFixed(6)),
            fuel: Number((this.BASE_FUEL_RATE * (1 + fuelMod)).toFixed(2))
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
                rates: this.getRatesForTime(timePoint)
            });
        }

        return trend;
    }
}
