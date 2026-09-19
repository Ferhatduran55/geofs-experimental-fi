import Logger from "../../shared/Logger";
import DeveloperEngine from "./DeveloperEngine";
import type { ICoreEngine, IModule } from "../../core/types";

const log = Logger.create("DeveloperModule");

/**
 * Developer & Diagnostics Module
 *
 * Provides real-time performance bottleneck monitoring, frame drop alerts,
 * local watch logs, and single-click diagnostic JSON export for developer debugging.
 */
export class DeveloperModule implements IModule {
  readonly id = "developer";
  readonly name = "Developer & Diagnostics";
  readonly version = "1.0.0";
  readonly description = "Real-time performance profiler, watch logs, and diagnostic dump exports";
  readonly defaultEnabled = true;

  private _isEnabled: boolean = false;

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(_core: ICoreEngine): Promise<void> {
    await DeveloperEngine.init();
    log.info("DeveloperModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled) return;
    this._isEnabled = true;
    log.info("DeveloperModule enabled.");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled) return;
    this._isEnabled = false;
    log.info("DeveloperModule disabled.");
  }

  destroy(): void {
    DeveloperEngine.destroy();
    this._isEnabled = false;
  }
}

export const developerModule = new DeveloperModule();
export default developerModule;
