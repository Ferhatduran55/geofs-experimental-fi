import Logger from "../../shared/Logger";
import FuelEngine from "./FuelEngine";
import renderFuelTab from "./views/FuelTab";
import LocalGasStation from "../../assets/icons/LocalGasStation";
import type { ICoreEngine, IModule, SettingsDefinition, TabDefinition } from "../../core/types";

const log = Logger.create("FuelModule");

export class FuelModule implements IModule {
  readonly id = "fuel";
  readonly name = "Fuel Management";
  readonly version = "1.0.0";
  readonly description = "Dynamic fuel consumption, realistic analog fuel gauge and refueling operations";
  readonly defaultEnabled = true;

  private core: ICoreEngine | null = null;
  private _isEnabled: boolean = false;
  private unbindListeners: (() => void)[] = [];

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(core: ICoreEngine): Promise<void> {
    this.core = core;
    await FuelEngine.initialize();
    log.info("FuelModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled || !this.core) return;
    this._isEnabled = true;

    await FuelEngine.activate();

    // Bind tick to FuelEngine
    this.unbindListeners.push(
      this.core.eventBus.on("flight:tick", (tick) => {
        if (!this._isEnabled) return;
        FuelEngine.tickUpdate(tick.deltaTime);
      }),
      this.core.eventBus.on("aircraft:changed", () => {
        if (!this._isEnabled) return;
        FuelEngine.checkAircraftChange();
      })
    );

    log.info("FuelModule enabled");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled) return;
    this._isEnabled = false;

    FuelEngine.deactivate();

    for (const unbind of this.unbindListeners) {
      unbind();
    }
    this.unbindListeners = [];

    log.info("FuelModule disabled");
  }

  getTabDefinition(): TabDefinition {
    return {
      id: "fuel",
      title: "Fuel Management",
      icon: LocalGasStation,
      order: 30,
      className: "bg-gray-800 dark:bg-black/70",
      render: async () => {
        return (await renderFuelTab()) as any;
      },
    };
  }

  getSettingsDefinition(): SettingsDefinition {
    return {
      id: "fuel",
      label: "Fuel Management System",
      description: "Advanced fuel consumption and analog fuel gauge instrument",
    };
  }
}

export const fuelModule = new FuelModule();
export default fuelModule;
