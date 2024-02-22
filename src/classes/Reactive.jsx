import { createSignal } from "solid-js";
import { getObjectFromPath } from "@utils/Misc";

export class Reactive {
  static _options = {
    cloneAfterCreation: false,
    temp: null,
  };
  static _props = [];
  static _cache = {};
  static set props(value) {
    this._props = value;
  }
  static get props() {
    return this._props;
  }
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

  static parse(obj, propName) {
    let target = obj;
    try {
      if (typeof obj === "string") {
        target = getObjectFromPath(obj);
      } else if (typeof obj === "object") {
        target = obj;
      } else {
        throw new Error(
          "The first argument to parse must be an object or string path."
        );
      }
      if (typeof propName !== "string") {
        throw new Error("The second argument to parse must be a string.");
      }

      if (target === undefined) {
        throw new Error("Invalid target.");
      }

      if (propName === undefined) {
        throw new Error("Invalid property.");
      }

      let value = target[propName];

      if (value === undefined) {
        throw new Error("Invalid value.");
      }

      const [prop, setProp] = createSignal(value);

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

      if (this._options.cloneAfterCreation) {
        if (this._options.temp === null) {
          throw new Error("Temporary object not defined.");
        }
        if (this._cache[propName] !== undefined) {
          throw new Error("Property already exists in cache.");
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
          throw new Error("Reactive property clone not defined.");
        }
      }

      return [prop, setProp];
    } catch (e) {
      console.error(e);
    }
  }

  static all() {
    try {
      this._props.forEach(({ target, prop }) => {
        this.parse(target, prop);
      });
    } catch (e) {
      console.error(e);
    }
  }
}
