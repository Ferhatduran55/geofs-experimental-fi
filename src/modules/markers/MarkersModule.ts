import Logger from "../../shared/Logger";
import MarkerEngine from "./MarkerEngine";
import type { ICoreEngine, IModule, SettingsDefinition } from "../../core/types";

const log = Logger.create("MarkersModule");

export class MarkersModule implements IModule {
  readonly id = "markers";
  readonly name = "Aircraft Markers";
  readonly version = "1.0.0";
  readonly description = "Custom SVG 2D aircraft silhouettes on GeoFS map and multiplayer traffic";
  readonly defaultEnabled = true;

  private _isEnabled: boolean = false;

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(_core: ICoreEngine): Promise<void> {
    log.info("MarkersModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled) return;
    this._isEnabled = true;

    await MarkerEngine.enable();
    log.info("MarkersModule enabled");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled) return;
    this._isEnabled = false;

    MarkerEngine.disable();
    log.info("MarkersModule disabled");
  }

  getSettingsDefinition(): SettingsDefinition {
    return {
      id: "markers",
      label: "Aircraft Markers",
      description: "Custom SVG markers representing aircraft types on the map",
    };
  }
}

export const markersModule = new MarkersModule();
export default markersModule;
