import Logger from "../../shared/Logger";
import Storage from "../../shared/Storage";
import SafeFlightLauncher from "./SafeFlightLauncher";
import type { AirportInfo } from "./AirportDatabase";
import type { TransportPayload } from "./FinancialEngine";
import type { TransportMission } from "./TransportEngine";
import { calculateDistanceNm, calculateBearingDeg, formatBearingWithCompass } from "./AirportDatabase";

const log = Logger.create("CustomScenarioEngine");

export interface CustomScenario {
  id: string;
  name: string;
  aircraftId: string | number;
  aircraftName: string;
  originAirport: AirportInfo;
  destinationAirport: AirportInfo;
  fuelPercent: number;
  payload: TransportPayload;
  customReward: number;
  createdAt: number;
}

const STORAGE_KEY = "career_custom_scenarios";

export class CustomScenarioEngine {
  static async getSavedScenarios(): Promise<CustomScenario[]> {
    try {
      const saved = await Storage.get(STORAGE_KEY);
      if (Array.isArray(saved)) return saved;
      return [];
    } catch (e) {
      log.error("Failed to load custom scenarios:", e);
      return [];
    }
  }

  static async saveScenario(scenario: CustomScenario): Promise<void> {
    try {
      const list = await this.getSavedScenarios();
      const existingIdx = list.findIndex((s) => s.id === scenario.id);
      if (existingIdx >= 0) {
        list[existingIdx] = scenario;
      } else {
        list.push(scenario);
      }
      await Storage.write(STORAGE_KEY, list);
      log.info(`Custom scenario "${scenario.name}" saved successfully`);
    } catch (e) {
      log.error("Failed to save custom scenario:", e);
    }
  }

  static async deleteScenario(id: string): Promise<void> {
    try {
      const list = await this.getSavedScenarios();
      const filtered = list.filter((s) => s.id !== id);
      await Storage.write(STORAGE_KEY, filtered);
      log.info(`Custom scenario ${id} deleted`);
    } catch (e) {
      log.error("Failed to delete custom scenario:", e);
    }
  }

  /**
   * Converts CustomScenario into a live playable TransportMission and starts it safely!
   */
  static async launchCustomScenario(
    scenario: CustomScenario,
    onSuccess?: () => void,
    onError?: (err: any) => void
  ): Promise<boolean> {
    const distNm = calculateDistanceNm(
      scenario.originAirport.lat,
      scenario.originAirport.lon,
      scenario.destinationAirport.lat,
      scenario.destinationAirport.lon
    );

    const bearingDeg = calculateBearingDeg(
      scenario.originAirport.lat,
      scenario.originAirport.lon,
      scenario.destinationAirport.lat,
      scenario.destinationAirport.lon
    );

    const mission: TransportMission = {
      id: `custom_${scenario.id}_${Date.now()}`,
      category: scenario.payload.type === "passenger" ? "VIP" : "Cargo",
      aircraftId: String(scenario.aircraftId),
      aircraftModel: scenario.aircraftName,
      silhouette: scenario.payload.type === "passenger" ? "business" : "heavy",
      originIcao: scenario.originAirport.icao,
      originAirport: scenario.originAirport,
      destinationIcao: scenario.destinationAirport.icao,
      destinationAirport: scenario.destinationAirport,
      fixedDistanceNm: distNm,
      initialBearingDeg: bearingDeg,
      initialBearingFormatted: formatBearingWithCompass(bearingDeg),
      payload: scenario.payload,
      grossRevenue: scenario.customReward,
      ratePerUnitNm: 1.5,
      baseHandlingFee: 0,
      expectedDurationMs: Math.round((distNm / 300) * 3600000),
      timeLimitMs: Math.round((distNm / 300) * 3600000 * 2.5),
      fuelRequiredPercent: scenario.fuelPercent,
      recommendedAircraft: scenario.aircraftName,
      isAccepted: true,
      acceptedAt: Date.now(),
      timeSlotIndex: 0,
    };

    return await SafeFlightLauncher.launchFlight({
      aircraftId: scenario.aircraftId,
      originAirport: scenario.originAirport,
      fuelPercent: scenario.fuelPercent,
      onSuccess: async () => {
        const careerModule = (unsafeWindow as any).__efiCareerModule;
        if (careerModule) {
          careerModule.currentMission = mission;
        }
        await Storage.write("career_current_mission", mission);
        onSuccess?.();
      },
      onError,
    });
  }
}

export default CustomScenarioEngine;
