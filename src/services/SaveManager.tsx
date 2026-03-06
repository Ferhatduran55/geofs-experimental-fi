import Logger from "../classes/Logger";
import Notify from "../classes/Notify";
import Props from "../classes/Props";
import Storage from "../classes/Storage";
import { reloadUI } from "../layouts/Assistant";

const log = Logger.create("SaveManager");

const SAVE_STORAGE_KEY = "aircraft_save";

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
    log.debug("No definition or allowed props found");
    return {};
  }

  const data: Record<string, any> = {};
  
  for (const prop of allowed) {
    if (prop.name && prop.name in definition) {
      data[prop.name] = definition[prop.name];
    }
  }
  
  log.debug(`Extracted ${Object.keys(data).length} definition properties`);
  return data;
};

const extractEngineData = (): EngineData[] => {
  const { allowed } = (Props as any).Engines || { allowed: [] };
  const engines = getAircraft()?.engines;
  
  if (!engines || !allowed) {
    log.debug("No engines or allowed props found");
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
      data: engineData
    });
  }
  
  log.debug(`Extracted data for ${data.length} engines`);
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

  log.debug(`Applied ${appliedCount} definition properties`);
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

  log.debug(`Applied ${appliedCount} engine properties`);
  return appliedCount;
};

export const saveAircraft = async (): Promise<boolean> => {
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
      engines: engineData
    };

    await Storage.set(aircraftKey, saveData);
    
    const defCount = Object.keys(definitionData).length;
    const engCount = engineData.reduce((sum, e) => sum + Object.keys(e.data).length, 0);
    
    log.info(`Saved aircraft: ${saveData.aircraftName} (${defCount} definition props, ${engCount} engine props)`);
    Notify.successNow(`Saved ${saveData.aircraftName}: ${defCount} definition, ${engCount} engine properties`);
    
    return true;
  } catch (error) {
    log.error("Save failed:", error);
    Notify.errorNow("Failed to save aircraft configuration");
    return false;
  }
};

export const loadAircraft = async (): Promise<boolean> => {
  try {
    const aircraftKey = getAircraftKey();
    if (!aircraftKey) {
      Notify.errorNow("No aircraft loaded");
      return false;
    }

    log.debug(`Loading from key: ${aircraftKey}`);
    
    const saveData = await Storage.get<AircraftSaveData>(aircraftKey);
    
    log.debug("Raw save data:", saveData);
    
    if (!saveData) {
      Notify.infoNow("No saved configuration found for this aircraft");
      return false;
    }
    let parsedData = saveData;
    if (typeof saveData === 'string') {
      try {
        parsedData = JSON.parse(saveData);
        log.debug("Parsed string data:", parsedData);
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
    
    log.info(`Loaded aircraft: ${parsedData.aircraftName} (${defApplied} definition, ${engApplied} engine properties)`);
    Notify.successNow(`Loaded: ${defApplied} definition, ${engApplied} engine properties (saved: ${savedDate})`);
    setTimeout(() => {
      reloadUI();
    }, 100);
    
    return true;
  } catch (error) {
    log.error("Load failed:", error);
    Notify.errorNow("Failed to load aircraft configuration");
    return false;
  }
};

export const deleteAircraftSave = async (): Promise<boolean> => {
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
    
    log.info("Deleted aircraft save");
    Notify.successNow("Saved configuration deleted");
    
    return true;
  } catch (error) {
    log.error("Delete failed:", error);
    Notify.errorNow("Failed to delete saved configuration");
    return false;
  }
};

export const hasSave = async (): Promise<boolean> => {
  const aircraftKey = getAircraftKey();
  if (!aircraftKey) return false;
  return await Storage.has(aircraftKey);
};

export const getSaveInfo = async (): Promise<{ exists: boolean; timestamp?: number; name?: string }> => {
  const aircraftKey = getAircraftKey();
  if (!aircraftKey) return { exists: false };
  
  const saveData = await Storage.get<AircraftSaveData>(aircraftKey);
  if (!saveData) return { exists: false };
  
  return {
    exists: true,
    timestamp: saveData.timestamp,
    name: saveData.aircraftName
  };
};

export const getAllSaveKeys = async (): Promise<string[]> => {
  const keys = await Storage.getKeys();
  return keys.filter(key => key.startsWith(SAVE_STORAGE_KEY));
};

export const exportAllSaves = async (): Promise<Record<string, AircraftSaveData>> => {
  try {
    const keys = await getAllSaveKeys();
    const exports: Record<string, AircraftSaveData> = {};
    
    for (const key of keys) {
      const data = await Storage.get<AircraftSaveData>(key);
      if (data) {
        exports[key] = data;
      }
    }
    
    log.info(`Exported ${Object.keys(exports).length} saves`);
    return exports;
  } catch (error) {
    log.error("Export failed:", error);
    return {};
  }
};

export const importSaves = async (data: Record<string, AircraftSaveData>): Promise<number> => {
  try {
    let imported = 0;
    
    for (const [key, saveData] of Object.entries(data)) {
      if (saveData && saveData.aircraftId) {
        await Storage.set(key, saveData);
        imported++;
      }
    }
    
    log.info(`Imported ${imported} saves`);
    Notify.successNow(`Imported ${imported} saves`);
    
    return imported;
  } catch (error) {
    log.error("Import failed:", error);
    Notify.errorNow("Failed to import saves");
    return 0;
  }
};

export default {
  save: saveAircraft,
  load: loadAircraft,
  delete: deleteAircraftSave,
  hasSave,
  getSaveInfo,
  getAllSaveKeys,
  exportAll: exportAllSaves,
  import: importSaves
};
