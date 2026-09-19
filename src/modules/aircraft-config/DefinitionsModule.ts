import Logger from "../../shared/Logger";
import DescriptionIcon from "../../assets/icons/Description";
import renderDefinitionsTab, { resetDefinitions } from "./views/DefinitionsTab";
import AircraftSetupStore from "./AircraftSetupStore";
import type { ICoreEngine, IModule, TabDefinition } from "../../core/types";

const log = Logger.create("DefinitionsModule");

export class DefinitionsModule implements IModule {
  readonly id = "definitions";
  readonly name = "Aircraft Definitions";
  readonly version = "1.0.0";
  readonly description = "Real-time aerodynamic and airframe physics definition editor";
  readonly defaultEnabled = true;

  private core: ICoreEngine | null = null;
  private _isEnabled: boolean = false;

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(core: ICoreEngine): Promise<void> {
    this.core = core;
    (unsafeWindow as any).__efiDefinitionsModule = this;
    AircraftSetupStore.captureDefaults();
    log.info("DefinitionsModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled || !this.core) return;
    this._isEnabled = true;

    AircraftSetupStore.captureDefaults();
    this.core.ui.registerTab(this.getTabDefinition());
    log.info("DefinitionsModule enabled");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled || !this.core) return;
    this._isEnabled = false;

    this.core.ui.unregisterTab("definitions");
    log.info("DefinitionsModule disabled");
  }

  getTabDefinition(): TabDefinition {
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
}

export const definitionsModule = new DefinitionsModule();
export default definitionsModule;
