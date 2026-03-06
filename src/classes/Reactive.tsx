import { createSignal } from "solid-js";
import { getObjectFromPath } from "../utils/Misc";
import Logger from "./Logger";

const log = Logger.create("Reactive");

class Reactive {
  static _cache: ReactiveCache = {};
  
  static set cache(value) {
    this._cache = value;
  }
  
  static get cache() {
    return this._cache;
  }
  
  static parse(target: any, propName: any) {
    if (target[propName] === undefined) {
      throw new Error("Invalid path.");
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
      enumerable: true
    });

    if (Object.getOwnPropertyDescriptor(target, propName) === undefined) {
      throw new Error("Reactive property not created.");
    }

    this._cache[propName] = true;
    return [prop, setProp];
  }
  
  static smartParse(target: string | object, propName: string) {
    if (typeof target === "string" && typeof propName === "string") {
      return this.parse(getObjectFromPath(target), propName);
    } else if (typeof target === "object" && typeof propName === "string") {
      return this.parse(target, propName);
    } else {
      throw new Error(
        "The target must be a string or an object. The property must be a string."
      );
    }
  }
  
  static cleanup() {
    log.debug("Starting cleanup, cache size:", Object.keys(this._cache).length);
    this._cache = {};
    log.debug("Cleanup completed");
  }
}

export default Reactive;
