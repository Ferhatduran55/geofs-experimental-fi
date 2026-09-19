import Logger from "../../shared/Logger";
import Props from "../../shared/Props";
import Aircraft from "../../shared/Aircraft";
import propsData from "../../assets/json/Props";
import AircraftSetupStore from "./AircraftSetupStore";
import type { ICoreEngine, IModule } from "../../core/types";

const log = Logger.create("AircraftConfigModule");

export class AircraftConfigModule implements IModule {
  readonly id = "aircraft-config";
  readonly name = "Aircraft Tuning & Definitions";
  readonly version = "1.0.0";
  readonly description = "Real-time live tuning for aerodynamic definitions and engine parameters";
  readonly defaultEnabled = true;

  private core: ICoreEngine | null = null;
  private _isEnabled: boolean = false;
  private unbindListeners: (() => void)[] = [];

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(core: ICoreEngine): Promise<void> {
    this.core = core;
    await Props.load(propsData);
    Aircraft.refresh();
    AircraftSetupStore.captureDefaults();
    log.info("AircraftConfigModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled || !this.core) return;
    this._isEnabled = true;

    AircraftSetupStore.captureDefaults();

    this.unbindListeners.push(
      this.core.eventBus.on("aircraft:changed", async () => {
        if (!this._isEnabled) return;
        try {
          Props.cleanup();
          await Props.load(propsData);
          Aircraft.refresh();
          AircraftSetupStore.captureDefaults(undefined, true);
          log.info("Aircraft configuration reloaded for new aircraft");
          this.core?.ui.requestReload();
        } catch (e) {
          log.error("Failed to reload aircraft config:", e);
        }
      })
    );

    log.info("AircraftConfigModule enabled");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled || !this.core) return;
    this._isEnabled = false;

    for (const unbind of this.unbindListeners) {
      unbind();
    }
    this.unbindListeners = [];

    log.info("AircraftConfigModule disabled");
  }
}

export const aircraftConfigModule = new AircraftConfigModule();
export default aircraftConfigModule;
