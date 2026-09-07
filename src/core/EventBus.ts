import Logger from "../shared/Logger";
import type { CoreEvents, IEventBus } from "./types";

const log = Logger.create("EventBus");

export class EventBus implements IEventBus {
  private listeners: Map<keyof CoreEvents, Set<(data: any) => void>> = new Map();

  on<K extends keyof CoreEvents>(event: K, listener: (data: CoreEvents[K]) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);

    // Return unbind function
    return () => {
      this.off(event, listener);
    };
  }

  once<K extends keyof CoreEvents>(event: K, listener: (data: CoreEvents[K]) => void): () => void {
    const wrapper = (data: CoreEvents[K]) => {
      this.off(event, wrapper);
      listener(data);
    };
    return this.on(event, wrapper);
  }

  emit<K extends keyof CoreEvents>(event: K, data: CoreEvents[K]): void {
    const list = this.listeners.get(event);
    if (!list || list.size === 0) return;

    // Iterate over a cloned array to prevent issues if listeners modify the set
    const handlers = Array.from(list);
    for (const handler of handlers) {
      try {
        handler(data);
      } catch (error) {
        log.error(`Error in event listener for "${String(event)}":`, error);
      }
    }
  }

  off<K extends keyof CoreEvents>(event: K, listener: (data: CoreEvents[K]) => void): void {
    const list = this.listeners.get(event);
    if (list) {
      list.delete(listener);
      if (list.size === 0) {
        this.listeners.delete(event);
      }
    }
  }

  clear(): void {
    this.listeners.clear();
    log.debug("EventBus cleared");
  }
}

export const eventBus = new EventBus();
