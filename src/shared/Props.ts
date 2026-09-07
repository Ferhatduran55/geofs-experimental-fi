import Reactive from "./Reactive";
import Logger from "./Logger";

const log = Logger.create("Props");

export class Props {
  static _reactive: typeof Reactive = Reactive;
  static _data: Record<string, any> = {};

  static get reactive(): typeof Reactive {
    return this._reactive;
  }

  static set reactive(value: typeof Reactive) {
    this._reactive = value;
  }

  static async load(...arr: any[]): Promise<boolean> {
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
          const { source } = options || {};

          if (options?.reactive && source) {
            if (!source.target || !source.prop) {
              throw new Error("Reactive props require a target and prop");
            }
            try {
              Reactive.smartParse(source.target, source.prop);
            } catch (e) {
              log.debug(`Deferred reactive parse for ${name} until aircraft ready`);
            }
          }

          Object.defineProperty(this, name, {
            get: function () {
              return this._data[name];
            },
            set: function (newValue) {
              this._data[name] = newValue;
            },
            configurable: true,
            enumerable: true,
          });

          (this as any)[name] = {
            allowed: options?.allowed || [],
            ignored: options?.ignored || [],
            reset: options?.reset || false,
          };
        }
        resolve(true);
      } catch (e) {
        log.error("Failed to load props:", e);
        reject(e);
      }
    });
  }

  static cleanup(): void {
    log.debug("Starting cleanup...");
    Reactive.cleanup();
    const propsToDelete = Object.keys(this._data);
    this._data = {};
    for (const key of propsToDelete) {
      try {
        delete (this as any)[key];
      } catch (error) {
        log.warn(`Could not delete property ${key}:`, error);
      }
    }
    log.debug("Cleanup completed");
  }

  [key: string]: any;
}

export default Props;
