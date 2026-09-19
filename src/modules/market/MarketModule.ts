import Logger from "../../shared/Logger";
import type { ICoreEngine, IModule } from "../../core/types";
import { MarketEngine, type MarketRates, type MarketTrendPoint } from "./MarketEngine";

const log = Logger.create("MarketModule");

export class MarketModule implements IModule {
  readonly id = "market";
  readonly name = "Aviation Market";
  readonly version = "1.0.0";
  readonly description = "Real-time economic index, dynamic passenger/cargo rates and fuel spot market";
  readonly defaultEnabled = true;
  readonly requires = ["career"];

  private core: ICoreEngine | null = null;
  private _isEnabled: boolean = false;

  isEnabled(): boolean {
    return this._isEnabled;
  }

  getCore(): ICoreEngine | null {
    return this.core;
  }

  async init(core: ICoreEngine): Promise<void> {
    this.core = core;
    (unsafeWindow as any).__efiMarketModule = this;
    MarketEngine.init();
    log.info("MarketModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled) return;
    this._isEnabled = true;
    log.info("MarketModule enabled");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled) return;
    this._isEnabled = false;
    log.info("MarketModule disabled");
  }

  getCurrentRates(): MarketRates {
    return MarketEngine.getCurrentRates();
  }

  getTodaysTrend(): MarketTrendPoint[] {
    return MarketEngine.getTodaysTrend();
  }
}

export const marketModule = new MarketModule();
export default marketModule;
