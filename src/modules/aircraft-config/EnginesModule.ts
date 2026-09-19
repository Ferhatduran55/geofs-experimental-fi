import Logger from "../../shared/Logger";
import EngineIcon from "../../assets/icons/Engine";
import renderEnginesTab, { resetEngines } from "./views/EnginesTab";
import AircraftSetupStore from "./AircraftSetupStore";
import type { ICoreEngine, IModule, TabDefinition } from "../../core/types";

const log = Logger.create("EnginesModule");

export class EnginesModule implements IModule {
  readonly id = "engines";
  readonly name = "Aircraft Engines";
  readonly version = "1.0.0";
  readonly description = "Real-time live multi-engine thrust and RPM parameter editor";
  readonly defaultEnabled = true;

  private core: ICoreEngine | null = null;
  private _isEnabled: boolean = false;

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(core: ICoreEngine): Promise<void> {
    this.core = core;
    (unsafeWindow as any).__efiEnginesModule = this;
    AircraftSetupStore.captureDefaults();
    log.info("EnginesModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled || !this.core) return;
    this._isEnabled = true;

    AircraftSetupStore.captureDefaults();
    this.core.ui.registerTab(this.getTabDefinition());
    log.info("EnginesModule enabled");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled || !this.core) return;
    this._isEnabled = false;

    this.core.ui.unregisterTab("engines");
    log.info("EnginesModule disabled");
  }

  getTabDefinition(): TabDefinition {
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

export const enginesModule = new EnginesModule();
export default enginesModule;
