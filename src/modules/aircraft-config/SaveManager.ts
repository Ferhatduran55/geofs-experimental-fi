import Logger from "../../shared/Logger";
import Notify from "../../shared/Notify";
import Props from "../../shared/Props";
import Storage from "../../shared/Storage";
import { core } from "../../core/CoreEngine";

const log = Logger.create("SaveManager");

const SAVE_STORAGE_KEY = "aircraft_save";

export interface EngineData {
  index: number;
  name: string;
  data: Record<string, any>;
}

export interface AircraftSaveData {
  aircraftId: number;
  aircraftName: string;
  timestamp: number;
  version: string;
  definition: Record<string, any>;
  engines: EngineData[];
}

const getAircraft = (): any => {
  return (unsafeWindow as any).geofs?.aircraft?.instance;
};

const getAircraftKey = (): string | null => {
  const aircraft = getAircraft();
  if (!aircraft?.id) {
    log.warn("No aircraft loaded");
    return null;
  }
  return `${SAVE_STORAGE_KEY}_${aircraft.id}`;
};

const extractDefinitionData = (): Record<string, any> => {
  const { allowed } = (Props as any).Definition || { allowed: [] };
  const definition = getAircraft()?.definition;

  if (!definition || !allowed) {
    return {};
  }

  const data: Record<string, any> = {};
  for (const prop of allowed) {
    if (prop.name && prop.name in definition) {
      data[prop.name] = definition[prop.name];
    }
  }
  return data;
};

const extractEngineData = (): EngineData[] => {
  const { allowed } = (Props as any).Engines || { allowed: [] };
  const engines = getAircraft()?.engines;

  if (!engines || !allowed) {
    return [];
  }

  const data: EngineData[] = [];
  for (let i = 0; i < engines.length; i++) {
    const engineData: Record<string, any> = {};
    for (const prop of allowed) {
      if (prop.name && prop.name in engines[i]) {
        engineData[prop.name] = engines[i][prop.name];
      }
    }
    data.push({
      index: i,
      name: engines[i].name || `Engine ${i + 1}`,
      data: engineData,
    });
  }
  return data;
};

const applyDefinitionData = (data: Record<string, any>): number => {
  const definition = getAircraft()?.definition;
  if (!definition) return 0;

  let appliedCount = 0;
  for (const [key, value] of Object.entries(data)) {
    if (key in definition) {
      definition[key] = value;
      appliedCount++;
    }
  }
  return appliedCount;
};

const applyEngineData = (enginesData: EngineData[]): number => {
  const engines = getAircraft()?.engines;
  if (!engines) return 0;

  let appliedCount = 0;
  for (const engineData of enginesData) {
    if (engineData.index < engines.length) {
      for (const [key, value] of Object.entries(engineData.data)) {
        if (key in engines[engineData.index]) {
          engines[engineData.index][key] = value;
          appliedCount++;
        }
      }
    }
  }
  return appliedCount;
};

export class SaveManager {
  static async save(): Promise<boolean> {
    try {
      const aircraftKey = getAircraftKey();
      if (!aircraftKey) {
        Notify.errorNow("No aircraft loaded");
        return false;
      }

      const aircraft = getAircraft();
      const definitionData = extractDefinitionData();
      const engineData = extractEngineData();

      if (Object.keys(definitionData).length === 0 && engineData.length === 0) {
        Notify.errorNow("No data to save");
        return false;
      }

      const saveData: AircraftSaveData = {
        aircraftId: aircraft.id,
        aircraftName: aircraft.definition?.name || "Unknown",
        timestamp: Date.now(),
        version: Storage.version,
        definition: definitionData,
        engines: engineData,
      };

      await Storage.set(aircraftKey, saveData);
      const defCount = Object.keys(definitionData).length;
      const engCount = engineData.reduce((sum, e) => sum + Object.keys(e.data).length, 0);

      Notify.successNow(`Saved ${saveData.aircraftName}: ${defCount} definition, ${engCount} engine properties`);
      return true;
    } catch (error) {
      log.error("Save failed:", error);
      Notify.errorNow("Failed to save aircraft configuration");
      return false;
    }
  }

  static async load(): Promise<boolean> {
    try {
      const aircraftKey = getAircraftKey();
      if (!aircraftKey) {
        Notify.errorNow("No aircraft loaded");
        return false;
      }

      const saveData = await Storage.get<AircraftSaveData>(aircraftKey);
      if (!saveData) {
        Notify.infoNow("No saved configuration found for this aircraft");
        return false;
      }

      let parsedData = saveData;
      if (typeof saveData === "string") {
        try {
          parsedData = JSON.parse(saveData);
        } catch (e) {
          log.error("Failed to parse save data string:", e);
        }
      }

      let defApplied = 0;
      let engApplied = 0;
      if (parsedData.definition && Object.keys(parsedData.definition).length > 0) {
        defApplied = applyDefinitionData(parsedData.definition);
      }
      if (parsedData.engines && parsedData.engines.length > 0) {
        engApplied = applyEngineData(parsedData.engines);
      }

      const savedDate = new Date(parsedData.timestamp).toLocaleString();
      Notify.successNow(`Loaded: ${defApplied} def, ${engApplied} eng props (saved: ${savedDate})`);
      setTimeout(() => core.reload(), 100);
      return true;
    } catch (error) {
      log.error("Load failed:", error);
      Notify.errorNow("Failed to load aircraft configuration");
      return false;
    }
  }

  static async delete(): Promise<boolean> {
    try {
      const aircraftKey = getAircraftKey();
      if (!aircraftKey) {
        Notify.errorNow("No aircraft loaded");
        return false;
      }

      const exists = await Storage.has(aircraftKey);
      if (!exists) {
        Notify.infoNow("No saved configuration to delete");
        return false;
      }

      await Storage.remove(aircraftKey);
      Notify.successNow("Saved configuration deleted");
      return true;
    } catch (error) {
      log.error("Delete failed:", error);
      Notify.errorNow("Failed to delete saved configuration");
      return false;
    }
  }
}

export default SaveManager;
