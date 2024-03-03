import { createSignal } from "solid-js";
import { getObjectFromPath } from "@utils/Misc";

export class Reactive {
  static _options = {
    cloneAfterCreation: false,
    temp: null,
  };
  static _cache = {};
  static set cache(value) {
    this._cache = value;
  }
  static get cache() {
    return this._cache;
  }
  static set options(value) {
    this._options = value;
  }
  static get options() {
    return this._options;
  }

  static parse(obj, propName, options = {}) {
    let target = obj;
    try {
      if (typeof obj === "string") {
        target = getObjectFromPath(obj);
      } else if (typeof obj === "object") {
        target = obj;
      } else {
        throw new Error(
          "The first argument to parse must be an object or string path.", obj);
      }
      if (typeof propName !== "string") {
        throw new Error("The second argument to parse must be a string.", propName);
      }

      if (target === undefined) {
        throw new Error("Invalid target.", target);
      }

      if (propName === undefined) {
        throw new Error("Invalid property.", propName);
      }

      let value = target[propName];

      if (value === undefined) {
        throw new Error("Invalid value.", value);
      }

      const [prop, setProp] = createSignal(value);
      const cloneAfterCreation = (() =>
        options?.cloneAfterCreation !== undefined
          ? options?.cloneAfterCreation
          : this._options?.cloneAfterCreation)();

      if (prop === undefined || setProp === undefined) {
        throw new Error("Signal not created.");
      }

      Object.defineProperty(target, propName, {
        get: function () {
          return prop();
        },
        set: function (newValue) {
          value = newValue;
          setProp(newValue);
        },
      });

      if (Object.getOwnPropertyDescriptor(target, propName) === undefined) {
        throw new Error("Reactive property not created.");
      }

      if (cloneAfterCreation) {
        if (this._options.temp === null) {
          throw new Error("Temporary object not defined.");
        }
        if (this._cache[propName] !== undefined) {
          throw new Error("Property already exists in cache.", propName);
        }

        const [reactiveProp, setReactiveProp] = [prop, setProp];

        if (reactiveProp === undefined || setReactiveProp === undefined) {
          throw new Error("Reactive property not cloned.");
        }
        this._cache[propName] = true;

        Object.defineProperty(this._options.temp, propName, {
          get: function () {
            return reactiveProp();
          },
          set: function (newValue) {
            setReactiveProp(newValue);
          },
        });

        if (
          Object.getOwnPropertyDescriptor(this._options.temp, propName) ===
          undefined
        ) {
          throw new Error("Reactive property clone not defined.", propName);
        }
      }

      return [prop, setProp];
    } catch (e) {
      console.error(e);
    }
  }
}
