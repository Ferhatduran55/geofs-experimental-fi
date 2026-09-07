import { createSignal } from "solid-js";
import { getObjectFromPath } from "../utils/Misc";
import Logger from "./Logger";

const log = Logger.create("Reactive");

export class Reactive {
  static _cache: Record<string, boolean> = {};

  static set cache(value: Record<string, boolean>) {
    this._cache = value;
  }

  static get cache(): Record<string, boolean> {
    return this._cache;
  }

  static parse(target: any, propName: string): any {
    if (!target) {
      throw new Error("Target object is invalid or not defined.");
    }
    if (target[propName] === undefined) {
      log.debug(`Property ${propName} is undefined on target, initializing.`);
    }

    const originalValue = target[propName];
    const [prop, setProp] = createSignal(originalValue);
    const originalDescriptor = Object.getOwnPropertyDescriptor(target, propName);

    Object.defineProperty(target, propName, {
      get: function () {
        return prop();
      },
      set: function (newValue) {
        setProp(newValue);
        if (originalDescriptor && originalDescriptor.set) {
          originalDescriptor.set.call(this, newValue);
        }
      },
      configurable: true,
      enumerable: true,
    });

    this._cache[propName] = true;
    return [prop, setProp];
  }

  static smartParse(target: string | object, propName: string): any {
    if (typeof target === "string" && typeof propName === "string") {
      const obj = getObjectFromPath(target, true);
      if (!obj) {
        throw new Error(`Path ${target} does not exist`);
      }
      return this.parse(obj, propName);
    } else if (typeof target === "object" && typeof propName === "string") {
      return this.parse(target, propName);
    } else {
      throw new Error("The target must be a string or an object. The property must be a string.");
    }
  }

  static cleanup(): void {
    log.debug("Starting cleanup, cache size:", Object.keys(this._cache).length);
    this._cache = {};
    log.debug("Cleanup completed");
  }
}

export default Reactive;
