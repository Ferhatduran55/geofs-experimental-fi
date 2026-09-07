import Logger from "../../shared/Logger";
import TuneIcon from "../../assets/icons/Tune";
import renderSettingsTab from "./views/SettingsTab";
import type { ICoreEngine, IModule, TabDefinition } from "../../core/types";

const log = Logger.create("SettingsModule");

export class SettingsModule implements IModule {
  readonly id = "settings";
  readonly name = "Settings & Feature Management";
  readonly version = "1.0.0";
  readonly description = "Central configuration panel for enabling and tweaking modules";
  readonly defaultEnabled = true;

  private core: ICoreEngine | null = null;
  private _isEnabled: boolean = false;

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(core: ICoreEngine): Promise<void> {
    this.core = core;
    log.info("SettingsModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled || !this.core) return;
    this._isEnabled = true;

    this.core.ui.registerTab(this.getTabDefinition());
    log.info("SettingsModule enabled");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled || !this.core) return;
    this._isEnabled = false;

    this.core.ui.unregisterTab("settings");
    log.info("SettingsModule disabled");
  }

  getTabDefinition(): TabDefinition {
    return {
      id: "settings",
      title: "Settings",
      icon: TuneIcon,
      order: 99,
      className: "bg-gray-300/50 dark:bg-gray-900/70",
      render: async () => {
        return (await renderSettingsTab()) as any;
      },
    };
  }
}

export const settingsModule = new SettingsModule();
export default settingsModule;
