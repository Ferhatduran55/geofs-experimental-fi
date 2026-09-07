import Logger from "../shared/Logger";
import type { IUIRegistry, TabDefinition } from "./types";

const log = Logger.create("UIRegistry");

export class UIRegistry implements IUIRegistry {
  private tabs: Map<string, TabDefinition> = new Map();
  private reloadListeners: Set<() => void> = new Set();

  registerTab(tab: TabDefinition): void {
    this.tabs.set(tab.id, tab);
    log.debug(`Registered UI tab: ${tab.id} ("${tab.title}")`);
    this.requestReload();
  }

  unregisterTab(id: string): void {
    if (this.tabs.delete(id)) {
      log.debug(`Unregistered UI tab: ${id}`);
      this.requestReload();
    }
  }

  getTabs(): TabDefinition[] {
    return Array.from(this.tabs.values()).sort((a, b) => (a.order ?? 50) - (b.order ?? 50));
  }

  requestReload(): void {
    log.debug("UI reload requested");
    for (const callback of this.reloadListeners) {
      try {
        callback();
      } catch (e) {
        log.error("Error in UI reload listener:", e);
      }
    }
  }

  onReloadRequested(callback: () => void): () => void {
    this.reloadListeners.add(callback);
    return () => {
      this.reloadListeners.delete(callback);
    };
  }

  clear(): void {
    this.tabs.clear();
    this.reloadListeners.clear();
  }
}
