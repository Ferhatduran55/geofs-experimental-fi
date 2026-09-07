import Logger from "../../shared/Logger";
import RadarEngine from "./RadarEngine";
import type { ICoreEngine, IModule, SettingsDefinition } from "../../core/types";

const log = Logger.create("RadarModule");

export class RadarModule implements IModule {
  readonly id = "radar";
  readonly name = "Multiplayer Radar";
  readonly version = "1.0.0";
  readonly description = "Cockpit radar display tracking nearby multiplayer aircraft in real-time";
  readonly defaultEnabled = false;

  private _isEnabled: boolean = false;

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(_core: ICoreEngine): Promise<void> {
    await RadarEngine.loadSettings();
    log.info("RadarModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled) return;
    this._isEnabled = true;

    await RadarEngine.activate();
    log.info("RadarModule enabled");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled) return;
    this._isEnabled = false;

    RadarEngine.deactivate();
    log.info("RadarModule disabled");
  }

  getSettingsDefinition(): SettingsDefinition {
    return {
      id: "radar",
      label: "Aircraft Radar",
      description: "Cockpit instrument radar tracking nearby aircraft",
    };
  }
}

export const radarModule = new RadarModule();
export default radarModule;
