import Logger from "../../shared/Logger";
import Notify from "../../shared/Notify";
import Storage from "../../shared/Storage";
import Props from "../../shared/Props";
import { core } from "../../core/CoreEngine";
import { reloadUI } from "../../layouts/Assistant";

const log = Logger.create("ConfigurationManager");

const AIRCRAFT_PROFILES_KEY = "addon_aircraft_profiles";
const GLOBAL_PROFILES_KEY = "addon_global_profiles";

export type ProfileType = "aircraft" | "global";

export interface EngineProfileData {
  index: number;
  name: string;
  data: Record<string, any>;
}

export interface AircraftProfile {
  id: string;
  name: string;
  type: "aircraft";
  aircraftId: number | string;
  aircraftName: string;
  createdAt: number;
  updatedAt: number;
  version: string;
  notes?: string;
  definition: Record<string, any>;
  engines: EngineProfileData[];
  summary: {
    definitionPropsCount: number;
    enginesCount: number;
    maxThrust?: number;
    maxRPM?: number;
  };
}

export interface GlobalProfile {
  id: string;
  name: string;
  type: "global";
  createdAt: number;
  updatedAt: number;
  version: string;
  notes?: string;
  modules: Record<string, boolean>;
  settings: Record<string, any>;
  summary: {
    enabledModules: string[];
    disabledModules: string[];
  };
}

export type Profile = AircraftProfile | GlobalProfile;

const NATO_PHONETIC = [
  "Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel",
  "India", "Kilo", "Lima", "Mike", "Nova", "Omega", "Phantom", "Sierra",
  "Tango", "Victor", "Vortex", "Whiskey", "Zenith"
];

const FLEET_TAGS = [
  "Fleet", "Cruiser", "Skyline", "Heavy", "Aero", "Stratosphere",
  "Horizon", "Mach", "Viper", "Titan", "Falcon"
];

export class ConfigurationManager {
  /**
   * Generates creative auto-names like Config-Alpha-2026 or Fleet-Heavy-9X
   */
  static generateAutoName(type: ProfileType, customAcName?: string): string {
    const year = new Date().getFullYear();
    const phonetic = NATO_PHONETIC[Math.floor(Math.random() * NATO_PHONETIC.length)];

    if (type === "global") {
      const num = Math.floor(10 + Math.random() * 90);
      return `Config-${phonetic}-${year}-${num}`;
    } else {
      const tag = FLEET_TAGS[Math.floor(Math.random() * FLEET_TAGS.length)];
      let acPart = customAcName ? customAcName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) : "";
      if (!acPart) acPart = "Heavy";
      return `${tag}-${acPart}-${phonetic}`;
    }
  }

  // --- AIRCRAFT PROFILES ---

  static async getAircraftProfiles(): Promise<AircraftProfile[]> {
    try {
      const list = await Storage.get<AircraftProfile[]>(AIRCRAFT_PROFILES_KEY, []);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      log.error("Failed to read aircraft profiles:", e);
      return [];
    }
  }

  static async saveAircraftProfile(name?: string, notes?: string): Promise<AircraftProfile | null> {
    try {
      const geofs = (unsafeWindow as any).geofs;
      const ac = geofs?.aircraft?.instance;
      if (!ac?.id) {
        Notify.errorNow("No active aircraft loaded in GeoFS");
        return null;
      }

      const acName = ac.definition?.name || `Aircraft ${ac.id}`;
      const profileName = name?.trim() || this.generateAutoName("aircraft", acName);

      // Extract definitions
      const defData: Record<string, any> = {};
      const allowedDef = (Props as any).Definition?.allowed || [];
      if (ac.definition) {
        if (allowedDef.length > 0) {
          for (const item of allowedDef) {
            if (item.name && item.name in ac.definition) {
              defData[item.name] = ac.definition[item.name];
            }
          }
        } else {
          // Fallback: copy primitive properties from definition
          for (const [k, v] of Object.entries(ac.definition)) {
            if (typeof v === "number" || typeof v === "string" || typeof v === "boolean") {
              defData[k] = v;
            }
          }
        }
      }

      // Extract engines
      const enginesData: EngineProfileData[] = [];
      const allowedEngines = (Props as any).Engines?.allowed || [];
      let maxThrust = 0;
      let maxRPM = 0;

      if (Array.isArray(ac.engines)) {
        for (let i = 0; i < ac.engines.length; i++) {
          const eng = ac.engines[i];
          const engObj: Record<string, any> = {};

          if (allowedEngines.length > 0) {
            for (const item of allowedEngines) {
              if (item.name && item.name in eng) {
                engObj[item.name] = eng[item.name];
              }
            }
          } else {
            for (const [k, v] of Object.entries(eng)) {
              if (typeof v === "number" || typeof v === "string" || typeof v === "boolean") {
                engObj[k] = v;
              }
            }
          }

          if (typeof eng.thrust === "number" && eng.thrust > maxThrust) maxThrust = eng.thrust;
          if (typeof eng.maxRPM === "number" && eng.maxRPM > maxRPM) maxRPM = eng.maxRPM;

          enginesData.push({
            index: i,
            name: eng.name || `Engine ${i + 1}`,
            data: engObj,
          });
        }
      }

      const profile: AircraftProfile = {
        id: `ac_profile_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: profileName,
        type: "aircraft",
        aircraftId: ac.id,
        aircraftName: acName,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: Storage.version,
        notes: notes?.trim() || undefined,
        definition: defData,
        engines: enginesData,
        summary: {
          definitionPropsCount: Object.keys(defData).length,
          enginesCount: enginesData.length,
          maxThrust: maxThrust || undefined,
          maxRPM: maxRPM || undefined,
        },
      };

      const profiles = await this.getAircraftProfiles();
      profiles.unshift(profile);
      await Storage.set(AIRCRAFT_PROFILES_KEY, profiles);

      Notify.successNow(`Saved Aircraft Profile: "${profile.name}" (${profile.summary.definitionPropsCount} props, ${profile.summary.enginesCount} engines)`);
      return profile;
    } catch (e) {
      log.error("Failed to save aircraft profile:", e);
      Notify.errorNow("Failed to save aircraft profile: " + String(e));
      return null;
    }
  }

  static async applyAircraftProfile(profile: AircraftProfile): Promise<boolean> {
    try {
      const geofs = (unsafeWindow as any).geofs;
      const ac = geofs?.aircraft?.instance;
      if (!ac) {
        Notify.errorNow("No active aircraft in GeoFS");
        return false;
      }

      let defApplied = 0;
      if (ac.definition && profile.definition) {
        for (const [key, value] of Object.entries(profile.definition)) {
          if (key in ac.definition) {
            ac.definition[key] = value;
            defApplied++;
          }
        }
      }

      let engApplied = 0;
      if (Array.isArray(ac.engines) && Array.isArray(profile.engines)) {
        for (const engProfile of profile.engines) {
          if (engProfile.index < ac.engines.length) {
            const targetEng = ac.engines[engProfile.index];
            for (const [key, value] of Object.entries(engProfile.data)) {
              if (key in targetEng) {
                targetEng[key] = value;
                engApplied++;
              }
            }
          }
        }
      }

      Notify.successNow(`Applied Profile "${profile.name}": ${defApplied} definitions, ${engApplied} engine props updated`);
      return true;
    } catch (e) {
      log.error("Failed to apply aircraft profile:", e);
      Notify.errorNow("Failed to apply aircraft profile: " + String(e));
      return false;
    }
  }

  // --- GLOBAL ADDON PROFILES ---

  static async getGlobalProfiles(): Promise<GlobalProfile[]> {
    try {
      const list = await Storage.get<GlobalProfile[]>(GLOBAL_PROFILES_KEY, []);
      return Array.isArray(list) ? list : [];
    } catch (e) {
      log.error("Failed to read global profiles:", e);
      return [];
    }
  }

  static async saveGlobalProfile(name?: string, notes?: string): Promise<GlobalProfile | null> {
    try {
      const profileName = name?.trim() || this.generateAutoName("global");

      // Capture all module states
      const allModules = core.modules.getAll();
      const moduleStates: Record<string, boolean> = {};
      const enabledList: string[] = [];
      const disabledList: string[] = [];

      for (const mod of allModules) {
        const isEn = core.modules.isEnabled(mod.id);
        moduleStates[mod.id] = isEn;
        if (isEn) enabledList.push(mod.name || mod.id);
        else disabledList.push(mod.name || mod.id);
      }

      // Capture stored addon settings
      const settingsData: Record<string, any> = {
        fuel_multiplier: await Storage.get("fuel_multiplier", 1),
        fuel_infinite: await Storage.get("fuel_infinite", false),
        radar_range_nm: await Storage.get("radar_range_nm", 20),
        radar_show_runways: await Storage.get("radar_show_runways", true),
        cancel_mission_on_crash: await Storage.get("cancel_mission_on_crash", true),
        career_logbook_hide_crashes: await Storage.get("career_logbook_hide_crashes", false),
      };

      const profile: GlobalProfile = {
        id: `global_profile_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        name: profileName,
        type: "global",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: Storage.version,
        notes: notes?.trim() || undefined,
        modules: moduleStates,
        settings: settingsData,
        summary: {
          enabledModules: enabledList,
          disabledModules: disabledList,
        },
      };

      const profiles = await this.getGlobalProfiles();
      profiles.unshift(profile);
      await Storage.set(GLOBAL_PROFILES_KEY, profiles);

      Notify.successNow(`Saved Global Profile: "${profile.name}" (${enabledList.length} modules active)`);
      return profile;
    } catch (e) {
      log.error("Failed to save global profile:", e);
      Notify.errorNow("Failed to save global profile: " + String(e));
      return null;
    }
  }

  static async applyGlobalProfile(profile: GlobalProfile): Promise<boolean> {
    try {
      // Apply modules
      for (const [modId, shouldEnable] of Object.entries(profile.modules)) {
        const current = core.modules.isEnabled(modId);
        if (current !== shouldEnable) {
          if (shouldEnable) {
            await core.modules.enable(modId);
          } else {
            await core.modules.disable(modId);
          }
        }
      }

      // Apply settings
      for (const [key, val] of Object.entries(profile.settings)) {
        await Storage.set(key, val);
      }

      Notify.successNow(`Applied Global Profile "${profile.name}" (${profile.summary.enabledModules.length} modules active)`);
      reloadUI();
      return true;
    } catch (e) {
      log.error("Failed to apply global profile:", e);
      Notify.errorNow("Failed to apply global profile: " + String(e));
      return false;
    }
  }

  // --- DELETE & MANAGEMENT ---

  static async deleteProfile(id: string, type: ProfileType): Promise<boolean> {
    try {
      if (type === "aircraft") {
        const profiles = await this.getAircraftProfiles();
        const filtered = profiles.filter((p) => p.id !== id);
        await Storage.set(AIRCRAFT_PROFILES_KEY, filtered);
      } else {
        const profiles = await this.getGlobalProfiles();
        const filtered = profiles.filter((p) => p.id !== id);
        await Storage.set(GLOBAL_PROFILES_KEY, filtered);
      }
      Notify.successNow("Profile deleted successfully");
      return true;
    } catch (e) {
      log.error("Failed to delete profile:", e);
      Notify.errorNow("Failed to delete profile");
      return false;
    }
  }

  // --- IMPORT / EXPORT ---

  static exportProfileJson(profile: Profile): string {
    return JSON.stringify(profile, null, 2);
  }

  static async importProfileJson(jsonStr: string): Promise<Profile | null> {
    try {
      const parsed = JSON.parse(jsonStr) as Profile;
      if (!parsed || !parsed.type || !parsed.name) {
        throw new Error("Invalid profile JSON structure: missing type or name");
      }

      parsed.id = `${parsed.type}_imported_${Date.now()}`;
      parsed.updatedAt = Date.now();

      if (parsed.type === "aircraft") {
        const profiles = await this.getAircraftProfiles();
        profiles.unshift(parsed as AircraftProfile);
        await Storage.set(AIRCRAFT_PROFILES_KEY, profiles);
      } else if (parsed.type === "global") {
        const profiles = await this.getGlobalProfiles();
        profiles.unshift(parsed as GlobalProfile);
        await Storage.set(GLOBAL_PROFILES_KEY, profiles);
      } else {
        throw new Error(`Unsupported profile type: ${(parsed as any).type}`);
      }

      Notify.successNow(`Imported ${parsed.type} profile: "${parsed.name}"`);
      return parsed;
    } catch (e) {
      log.error("Failed to import profile JSON:", e);
      Notify.errorNow("Failed to import profile: " + String(e));
      return null;
    }
  }
}

export default ConfigurationManager;
