import Logger from "../../shared/Logger";

const log = Logger.create("AircraftSetupStore");

export class AircraftSetupStore {
  static originalDefinitions: Record<string, any> = {};
  static originalEngines: Array<Record<string, any>> = [];
  static capturedAircraftId: string | number | null = null;

  /**
   * Captures the pristine factory setup of the currently loaded aircraft.
   * Runs whenever an aircraft spawns or changes.
   */
  static captureDefaults(aircraft?: any, force: boolean = false): void {
    const ac = aircraft || (unsafeWindow as any).geofs?.aircraft?.instance;
    if (!ac || !ac.definition) {
      log.debug("No aircraft instance available to capture defaults.");
      return;
    }

    const currentId = ac.id !== undefined ? ac.id : "default";
    if (!force && this.capturedAircraftId === currentId && Object.keys(this.originalDefinitions).length > 0) {
      log.debug(`Aircraft ${currentId} defaults already captured.`);
      return;
    }

    this.capturedAircraftId = currentId;
    this.originalDefinitions = {};
    for (const [key, value] of Object.entries(ac.definition)) {
      if (typeof value === "number" || typeof value === "string" || typeof value === "boolean") {
        this.originalDefinitions[key] = value;
      }
    }

    this.originalEngines = [];
    if (Array.isArray(ac.engines)) {
      for (let i = 0; i < ac.engines.length; i++) {
        const eng = ac.engines[i];
        const engCopy: Record<string, any> = {};
        for (const [key, value] of Object.entries(eng)) {
          if (typeof value === "number" || typeof value === "string" || typeof value === "boolean") {
            engCopy[key] = value;
          }
        }
        this.originalEngines.push(engCopy);
      }
    }

    log.info(
      `Captured pristine setup for aircraft ${currentId}: ${Object.keys(this.originalDefinitions).length} definition props, ${this.originalEngines.length} engines.`
    );
  }

  static getDefinitionDefault(propName: string): any {
    return this.originalDefinitions[propName];
  }

  static getEngineDefault(engineIndex: number, propName: string): any {
    return this.originalEngines[engineIndex]?.[propName];
  }

  /**
   * Restores all definition properties on the live aircraft instance to their original numbers
   */
  static restoreDefinitions(): number {
    const ac = (unsafeWindow as any).geofs?.aircraft?.instance;
    if (!ac?.definition) return 0;

    let count = 0;
    for (const [key, value] of Object.entries(this.originalDefinitions)) {
      const strictVal = typeof value === "number" ? Number(value) : value;
      if (key in ac.definition) {
        ac.definition[key] = strictVal;
        count++;
      }
      if (key in ac) {
        ac[key] = strictVal;
      }
    }

    log.info(`Restored ${count} definition properties to factory defaults`);
    return count;
  }

  /**
   * Restores all engine properties on the live aircraft instance to their original numbers
   */
  static restoreEngines(): number {
    const ac = (unsafeWindow as any).geofs?.aircraft?.instance;
    if (!ac?.engines || !Array.isArray(ac.engines)) return 0;

    let count = 0;
    for (let i = 0; i < this.originalEngines.length; i++) {
      const liveEngine = ac.engines[i];
      const defaultEngine = this.originalEngines[i];
      if (!liveEngine || !defaultEngine) continue;

      for (const [key, value] of Object.entries(defaultEngine)) {
        const strictVal = typeof value === "number" ? Number(value) : value;
        if (key in liveEngine) {
          liveEngine[key] = strictVal;
          count++;
        }
        if (liveEngine.definition && key in liveEngine.definition) {
          liveEngine.definition[key] = strictVal;
        }
        if (ac.definition?.engines?.[i] && key in ac.definition.engines[i]) {
          ac.definition.engines[i][key] = strictVal;
        }
      }
    }

    log.info(`Restored ${count} engine properties to factory defaults`);
    return count;
  }
}

export default AircraftSetupStore;
