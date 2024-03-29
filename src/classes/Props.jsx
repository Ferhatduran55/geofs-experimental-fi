import { Reactive } from "@classes/Reactive";

export class Props {
  static _reactive = Reactive;
  static _data = {};
  static get reactive() {
    return this._reactive;
  }
  static set reactive(value) {
    this._reactive = value;
  }
  static async load(...arr) {
    return await new Promise((resolve, reject) => {
      try {
        if (!arr.length) {
          throw new Error("No props to load");
        }
        if (!Array.isArray(arr)) {
          throw new Error("Props must be an array");
        }
        for (const item of arr[0]) {
          const { name, options } = item;
          const { source } = options;
          if (options.reactive) {
            if (!options.source) {
              throw new Error("Reactive props require a source");
            }
            if (!options.source.target || !options.source.prop) {
              throw new Error("Reactive props require a target and prop");
            }
            this._reactive.parse(
              source.target,
              source.prop,
              options.source?.options
            );
          }

          
          Object.defineProperty(this, name, {
            get: function () {
              return this._data[name];
            },
            set: function (newValue) {
              this._data[name] = newValue;
            },
          });
          this[name] = {
            allowed: options.allowed || [],
            ignored: options.ignored || [],
            reset: options.reset || false,
          };
        }
        resolve(true);
      } catch (e) {
        reject(e);
      }
    });
  }
}
