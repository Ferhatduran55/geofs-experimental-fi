import Logger from "../shared/Logger";
import Storage from "../shared/Storage";
import { EventBus } from "./EventBus";
import { GeoFSAdapter } from "./GeoFSAdapter";
import { ModuleRunner } from "./ModuleRunner";
import { UIRegistry } from "./UIRegistry";
import type { ICoreEngine, IEventBus, IModuleRunner, IUIRegistry } from "./types";

const log = Logger.create("CoreEngine");

export class CoreEngine implements ICoreEngine {
  private static _instance: CoreEngine | null = null;

  readonly version: string;
  readonly eventBus: IEventBus;
  readonly modules: IModuleRunner;
  readonly ui: IUIRegistry;
  private geoFSAdapter: GeoFSAdapter;
  private isStarted: boolean = false;

  private constructor() {
    this.version = typeof GM !== "undefined" && GM.info?.script?.version ? GM.info.script.version : "0.8.0";
    this.eventBus = new EventBus();
    this.ui = new UIRegistry();
    this.modules = new ModuleRunner(this, this.eventBus, this.ui);
    this.geoFSAdapter = new GeoFSAdapter(this.eventBus);
  }

  static get instance(): CoreEngine {
    if (!this._instance) {
      this._instance = new CoreEngine();
    }
    return this._instance;
  }

  async start(): Promise<void> {
    if (this.isStarted) return;
    this.isStarted = true;

    log.info(`Booting Core Engine v${this.version}...`);

    // 1. Initialize Storage
    Storage.config(this.version, { prefix: "geofs_efi_" });

    // 2. Initialize GeoFS Adapter (listens to tick, aircraft change, ready)
    this.geoFSAdapter.init();

    // 3. Initialize all registered modules
    await (this.modules as ModuleRunner).initAll();

    log.info("Core Engine started successfully!");
  }

  reload(): void {
    log.info("Reloading Core Engine...");
    this.ui.requestReload();
    this.eventBus.emit("ui:reload", undefined as void);
  }
}

export const core = CoreEngine.instance;
