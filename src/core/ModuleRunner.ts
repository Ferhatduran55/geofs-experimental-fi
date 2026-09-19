import Logger from "../shared/Logger";
import Storage from "../shared/Storage";
import Notify from "../shared/Notify";
import type { ICoreEngine, IEventBus, IModule, IModuleRunner, IUIRegistry } from "./types";

const log = Logger.create("ModuleRunner");

export class ModuleRunner implements IModuleRunner {
  private modules: Map<string, IModule> = new Map();
  private enabledStates: Map<string, boolean> = new Map();
  private core: ICoreEngine;
  private eventBus: IEventBus;
  private ui: IUIRegistry;

  constructor(core: ICoreEngine, eventBus: IEventBus, ui: IUIRegistry) {
    this.core = core;
    this.eventBus = eventBus;
    this.ui = ui;
  }

  register(module: IModule): void {
    if (this.modules.has(module.id)) {
      log.warn(`Module "${module.id}" is already registered. Overwriting.`);
    }

    this.modules.set(module.id, module);
    log.info(`Registered module: ${module.name} (v${module.version}) [${module.id}]`);

    this.eventBus.emit("module:registered", {
      moduleId: module.id,
      name: module.name,
    });
  }

  get(id: string): IModule | undefined {
    return this.modules.get(id);
  }

  getAll(): IModule[] {
    return Array.from(this.modules.values());
  }

  isEnabled(id: string): boolean {
    return this.enabledStates.get(id) ?? false;
  }

  private getStorageKey(moduleId: string): string {
    return `module_enabled_${moduleId}`;
  }

  async initAll(): Promise<void> {
    log.info(`Initializing ${this.modules.size} modules...`);

    for (const [id, module] of this.modules) {
      try {
        await module.init(this.core);

        // Read saved state from Storage, default to module.defaultEnabled ?? true
        const storageKey = this.getStorageKey(id);
        const saved = await Storage.get(storageKey);
        const shouldEnable = typeof saved === "boolean" ? saved : (module.defaultEnabled ?? true);

        if (shouldEnable) {
          await this.enable(id);
        } else {
          this.enabledStates.set(id, false);
          log.debug(`Module "${id}" initialized (disabled)`);
        }
      } catch (error) {
        log.error(`Failed to initialize module "${id}":`, error);
        this.eventBus.emit("module:error", { moduleId: id, error: error as Error });
      }
    }

    log.info("All modules initialized.");
  }

  getDependents(moduleId: string): IModule[] {
    return this.getAll().filter((m) => m.requires && m.requires.includes(moduleId));
  }

  checkRequirementsMet(moduleId: string): boolean {
    const module = this.modules.get(moduleId);
    if (!module || !module.requires || module.requires.length === 0) return true;
    return module.requires.every((reqId) => this.isEnabled(reqId));
  }

  async enable(id: string): Promise<boolean> {
    const module = this.modules.get(id);
    if (!module) {
      log.error(`Cannot enable unknown module "${id}"`);
      return false;
    }

    // 1. Check declarative dependencies: auto-enable missing requirements or warn
    if (module.requires && module.requires.length > 0) {
      for (const reqId of module.requires) {
        if (!this.isEnabled(reqId)) {
          const reqModule = this.modules.get(reqId);
          const reqName = reqModule?.name || reqId;
          log.info(`Module "${module.name}" requires "${reqName}". Auto-enabling prerequisite...`);
          const reqSuccess = await this.enable(reqId);
          if (!reqSuccess) {
            log.error(`Cannot enable "${module.name}": required prerequisite "${reqName}" failed to activate.`);
            return false;
          }
        }
      }
    }

    try {
      await module.enable();
      this.enabledStates.set(id, true);
      Storage.write(this.getStorageKey(id), true);

      // Register Tab if provided
      if (module.getTabDefinition) {
        const tab = module.getTabDefinition();
        if (tab) {
          this.ui.registerTab(tab);
        }
      }

      this.eventBus.emit("module:enabled", { moduleId: id });
      log.info(`Enabled module: ${module.name} [${id}]`);

      // 2. Cascade: Auto-restore dependent modules if their stored preference was enabled
      const dependents = this.getDependents(id);
      for (const dep of dependents) {
        if (!this.isEnabled(dep.id)) {
          const savedPref = await Storage.get(this.getStorageKey(dep.id));
          const shouldEnable = typeof savedPref === "boolean" ? savedPref : (dep.defaultEnabled ?? true);
          if (shouldEnable && this.checkRequirementsMet(dep.id)) {
            log.info(`Auto-restoring dependent module "${dep.name}" as requirement "${module.name}" became active`);
            await this.enable(dep.id);
          }
        }
      }

      return true;
    } catch (error) {
      log.error(`Failed to enable module "${id}":`, error);
      this.eventBus.emit("module:error", { moduleId: id, error: error as Error });
      return false;
    }
  }

  async disable(id: string): Promise<boolean> {
    const module = this.modules.get(id);
    if (!module) {
      log.error(`Cannot disable unknown module "${id}"`);
      return false;
    }

    // 1. Cascade: Force disable any active dependent modules first!
    const dependents = this.getDependents(id);
    for (const dep of dependents) {
      if (this.isEnabled(dep.id)) {
        log.warn(`Deactivating dependent module "${dep.name}" because parent "${module.name}" is being disabled.`);
        await this.disable(dep.id);
        Notify.warning(`"${dep.name}" was deactivated because "${module.name}" was disabled.`, "Module Dependency");
      }
    }

    try {
      await module.disable();
      this.enabledStates.set(id, false);
      Storage.write(this.getStorageKey(id), false);

      // Unregister Tab if was provided
      if (module.getTabDefinition) {
        const tab = module.getTabDefinition();
        if (tab) {
          this.ui.unregisterTab(tab.id);
        }
      }

      this.eventBus.emit("module:disabled", { moduleId: id });
      log.info(`Disabled module: ${module.name} [${id}]`);
      return true;
    } catch (error) {
      log.error(`Failed to disable module "${id}":`, error);
      this.eventBus.emit("module:error", { moduleId: id, error: error as Error });
      return false;
    }
  }

  async toggle(id: string): Promise<boolean> {
    if (this.isEnabled(id)) {
      await this.disable(id);
      return false;
    } else {
      await this.enable(id);
      return true;
    }
  }
}
