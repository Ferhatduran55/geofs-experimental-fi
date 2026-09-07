import type { ICoreEngine } from "../core/types";
import { aircraftConfigModule } from "./aircraft-config/AircraftConfigModule";
import { fuelModule } from "./fuel/FuelModule";
import { markersModule } from "./markers/MarkersModule";
import { radarModule } from "./radar/RadarModule";
import { careerModule } from "./career/CareerModule";
import { settingsModule } from "./settings/SettingsModule";

/**
 * Register all built-in modules into CoreEngine
 */
export function registerBuiltinModules(core: ICoreEngine): void {
  core.modules.register(aircraftConfigModule);
  core.modules.register(fuelModule);
  core.modules.register(markersModule);
  core.modules.register(radarModule);
  core.modules.register(careerModule);
  core.modules.register(settingsModule);
}

export {
  aircraftConfigModule,
  fuelModule,
  markersModule,
  radarModule,
  careerModule,
  settingsModule,
};
