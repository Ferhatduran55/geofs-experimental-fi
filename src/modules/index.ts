import type { ICoreEngine } from "../core/types";
import { aircraftConfigModule } from "./aircraft-config/AircraftConfigModule";
import { definitionsModule } from "./aircraft-config/DefinitionsModule";
import { enginesModule } from "./aircraft-config/EnginesModule";
import { fuelModule } from "./fuel/FuelModule";
import { markersModule } from "./markers/MarkersModule";
import { radarModule } from "./radar/RadarModule";
import { careerModule } from "./career/CareerModule";
import { transportModule } from "./transport/TransportModule";
import { marketModule } from "./market/MarketModule";
import { settingsModule } from "./settings/SettingsModule";
import { developerModule } from "./developer/DeveloperModule";

/**
 * Register all built-in modules into CoreEngine
 */
export function registerBuiltinModules(core: ICoreEngine): void {
  core.modules.register(aircraftConfigModule);
  core.modules.register(definitionsModule);
  core.modules.register(enginesModule);
  core.modules.register(fuelModule);
  core.modules.register(markersModule);
  core.modules.register(radarModule);
  core.modules.register(careerModule);
  core.modules.register(transportModule);
  core.modules.register(marketModule);
  core.modules.register(developerModule);
  core.modules.register(settingsModule);
}

export {
  aircraftConfigModule,
  definitionsModule,
  enginesModule,
  fuelModule,
  markersModule,
  radarModule,
  careerModule,
  transportModule,
  marketModule,
  settingsModule,
  developerModule,
};
