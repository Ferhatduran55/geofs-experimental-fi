import { createSignal } from "solid-js";
import { getObjectFromPath } from "../utils/Misc";

class Reactive {
  static _options: ReactiveOptions = {
    cloneAfterCreation: false,
    temp: {},
  };
  static _cache: ReactiveCache = {};
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
  static parse(target: any, propName: any, options: ParseOptions) {
    if (target[propName] === undefined) {
      throw new Error("Invalid path.");
    }

    const [prop, setProp] = createSignal(target[propName]);
    const cloneAfterCreation =
      options?.cloneAfterCreation ?? this._options.cloneAfterCreation;

    Object.defineProperty(target, propName, {
      get: function () {
        return prop();
      },
      set: function (newValue) {
        target[propName] = newValue;
        setProp(newValue);
      },
    });

    if (Object.getOwnPropertyDescriptor(target, propName) === undefined) {
      throw new Error("Reactive property not created.");
    }

    if (cloneAfterCreation) {
      if (this._options.temp === null)
        throw new Error("Temporary object not defined.");

      if (this._cache[propName] !== undefined) {
        throw new Error("Property already exists in cache. " + propName);
      }

      const [reactiveProp, setReactiveProp] = [prop, setProp];

      this._cache[propName] = true;
      Object.defineProperty(this._options.temp, propName, {
        get: function () {
          return reactiveProp();
        },
        set: function (newValue) {
          setReactiveProp(newValue);
        },
      });
    }

    return [prop, setProp];
  }
  static smartParse(
    target: string | object,
    propName: string,
    options: ParseOptions
  ) {
    if (typeof target === "string" && typeof propName === "string") {
      return this.parse(getObjectFromPath(target), propName, options);
    } else if (typeof target === "object" && typeof propName === "string") {
      return this.parse(target, propName, options);
    } else {
      throw new Error(
        "The target must be a string or an object. The property must be a string."
      );
    }
  }
}

export default Reactive;
