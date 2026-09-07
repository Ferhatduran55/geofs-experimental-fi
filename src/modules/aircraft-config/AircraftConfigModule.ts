import Logger from "../../shared/Logger";
import Props from "../../shared/Props";
import Aircraft from "../../shared/Aircraft";
import propsData from "../../assets/json/Props";
import DescriptionIcon from "../../assets/icons/Description";
import EngineIcon from "../../assets/icons/Engine";
import renderDefinitionsTab, { resetDefinitions } from "./views/DefinitionsTab";
import renderEnginesTab, { resetEngines } from "./views/EnginesTab";
import type { ICoreEngine, IModule, TabDefinition } from "../../core/types";

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
    log.info("AircraftConfigModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled || !this.core) return;
    this._isEnabled = true;

    // Register Definitions Tab & Engines Tab
    this.core.ui.registerTab(this.getDefinitionsTab());
    this.core.ui.registerTab(this.getEnginesTab());

    this.unbindListeners.push(
      this.core.eventBus.on("aircraft:changed", async () => {
        if (!this._isEnabled) return;
        try {
          Props.cleanup();
          await Props.load(propsData);
          Aircraft.refresh();
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

    this.core.ui.unregisterTab("definitions");
    this.core.ui.unregisterTab("engines");

    for (const unbind of this.unbindListeners) {
      unbind();
    }
    this.unbindListeners = [];

    log.info("AircraftConfigModule disabled");
  }

  private getDefinitionsTab(): TabDefinition {
    return {
      id: "definitions",
      title: "Definitions",
      icon: DescriptionIcon,
      order: 10,
      className: "bg-gray-300/50 dark:bg-gray-900/70",
      render: async () => {
        return (await renderDefinitionsTab()) as any;
      },
      onReset: resetDefinitions,
    };
  }

  private getEnginesTab(): TabDefinition {
    return {
      id: "engines",
      title: "Engines",
      icon: EngineIcon,
      order: 20,
      className: "bg-gray-300/50 dark:bg-gray-900/70",
      render: async () => {
        return (await renderEnginesTab()) as any;
      },
      onReset: resetEngines,
    };
  }
}

export const aircraftConfigModule = new AircraftConfigModule();
export default aircraftConfigModule;
