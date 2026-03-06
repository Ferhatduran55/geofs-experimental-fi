import { createSignal } from "solid-js";
import Notify from "../classes/Notify";
import Props from "../classes/Props";
import Storage from "../classes/Storage";
import FuelSystem from "../classes/FuelSystem";
import Logger from "../classes/Logger";
import { reloadUI } from "../layouts/Assistant";
import SaveManager from "./SaveManager";
import Input from "../components/Input";
import {
  enableMarkers,
  disableMarkers,
  getAircraftTypeCount,
  getAircraftGroupNames,
  getMarkerSettings,
  setSelfColor,
  setOtherColor,
  setStrokeColor,
  resetMarkerSettings,
  enableRadar,
  disableRadar,
  getRadarSettings,
  setRadarRange,
  setRadarShowLabels,
  setRadarSweepSpeed
} from "./AircraftMarkers";

const log = Logger.create("ExperimentalFeatures");
const FEATURE_KEYS = {
  fuelSystem: "experimental_fuel_system",
  aircraftMarkers: "experimental_aircraft_markers",
  aircraftRadar: "experimental_aircraft_radar",
  debugMode: "experimental_debug_mode",
} as const;
if (typeof window !== 'undefined') {
  window.addEventListener('experimentalFeatureChanged', ((event: CustomEvent) => {
    const { feature, enabled } = event.detail;
    log.debug(`Global event: ${feature} changed to ${enabled}`);
    if (feature === 'fuelSystem') {
      log.debug(`Fuel gauge ${enabled ? 'shown' : 'hidden'}`);
    }
  }) as EventListener);
}
const [fuelSystemEnabled, setFuelSystemEnabled] = createSignal(false);
const [aircraftMarkersEnabled, setAircraftMarkersEnabled] = createSignal(false);
const [aircraftRadarEnabled, setAircraftRadarEnabled] = createSignal(false);
const [debugModeEnabled, setDebugModeEnabled] = createSignal(false);
let statesLoaded = false;
let autoApplied = false;

const getFeatureState = async (feature: keyof typeof FEATURE_KEYS): Promise<boolean> => {
  const value = await Storage.get(FEATURE_KEYS[feature]);
  if (typeof value === 'boolean') {
    return value;
  }

  return value === "true" || value === true;
};

const setFeatureState = (feature: keyof typeof FEATURE_KEYS, value: boolean): void => {
  Storage.write(FEATURE_KEYS[feature], value);
  Storage.clearCache();

  log.debug(`Wrote ${feature} = ${value}, cache cleared`);
};

const loadFeatureStates = async () => {
  if (statesLoaded) return;

  const fuelState = await getFeatureState("fuelSystem");
  const markersState = await getFeatureState("aircraftMarkers");
  const radarState = await getFeatureState("aircraftRadar");
  const debugState = await getFeatureState("debugMode");

  setFuelSystemEnabled(fuelState);
  setAircraftMarkersEnabled(markersState);
  setAircraftRadarEnabled(radarState);
  setDebugModeEnabled(debugState);
  Logger.setDevMode(debugState);

  statesLoaded = true;

  log.info("Loaded states from storage:", {
    fuelSystem: fuelState,
    aircraftMarkers: markersState,
    aircraftRadar: radarState,
    debugMode: debugState
  });
};

const dispatchFeatureStateChange = (feature: string, enabled: boolean) => {
  const event = new CustomEvent('experimentalFeatureChanged', {
    detail: { feature, enabled, timestamp: Date.now() }
  });
  window.dispatchEvent(event);

  log.debug(`Dispatched state change event for ${feature}`);
};

export const isFeatureEnabled = async (feature: keyof typeof FEATURE_KEYS): Promise<boolean> => {
  return await getFeatureState(feature);
};

export const getFuelSystemEnabled = () => fuelSystemEnabled();

export const getAircraftMarkersEnabled = () => aircraftMarkersEnabled();

export const getAircraftRadarEnabled = () => aircraftRadarEnabled();

export const getDebugModeEnabled = () => debugModeEnabled();

const toggleFeature = async (featureName: "fuelSystem" | "aircraftMarkers" | "aircraftRadar" | "debugMode", label: string) => {
  let currentState: boolean;

  switch (featureName) {
    case "fuelSystem":
      currentState = fuelSystemEnabled();
      break;
    case "aircraftMarkers":
      currentState = aircraftMarkersEnabled();
      break;
    case "aircraftRadar":
      currentState = aircraftRadarEnabled();
      break;
    case "debugMode":
      currentState = debugModeEnabled();
      break;
  }

  const newState = !currentState;

  log.debug(`Toggling ${featureName}: ${currentState} → ${newState}`);
  switch (featureName) {
    case "fuelSystem":
      setFuelSystemEnabled(newState);
      break;
    case "aircraftMarkers":
      setAircraftMarkersEnabled(newState);
      break;
    case "aircraftRadar":
      setAircraftRadarEnabled(newState);
      break;
    case "debugMode":
      setDebugModeEnabled(newState);
      Logger.setDevMode(newState);
      break;
  }
  setFeatureState(featureName, newState);
  log.debug(`Saved ${featureName} = ${newState} to storage`);
  Notify.successNow(`${label} ${newState ? "enabled" : "disabled"}`);
  if (featureName === "aircraftMarkers") {
    applyAircraftMarkersFeature(newState);
  } else if (featureName === "fuelSystem") {
    await applyFuelSystemFeature(newState);
  } else if (featureName === "aircraftRadar") {
    await applyRadarFeature(newState);
  }
  dispatchFeatureStateChange(featureName, newState);
  if (featureName !== "debugMode") {
    setTimeout(() => {
      log.debug("Reloading UI to update system status");
      reloadUI();
    }, 100);
  }
};

const applyAircraftMarkersFeature = (enabled: boolean) => {
  if (enabled) {
    log.debug("Activating Aircraft Markers...");
    enableMarkers();
    Notify.successNow("Aircraft Markers activated");
  } else {
    log.debug("Deactivating Aircraft Markers...");
    disableMarkers();
    Notify.infoNow("Aircraft markers reverted to default");
  }
};

const applyFuelSystemFeature = async (enabled: boolean) => {
  if (enabled) {
    log.debug("Activating Fuel System...");

    try {
      await FuelSystem.activate();
      log.info("Fuel System activated");
      Notify.successNow("Fuel Management System activated");
    } catch (error) {
      log.error("Fuel System activation failed:", error);
      Notify.errorNow("Failed to activate Fuel System");
      setFuelSystemEnabled(false);
      setFeatureState("fuelSystem", false);
    }
  } else {
    log.debug("Deactivating Fuel System...");
    FuelSystem.deactivate();
    log.info("Fuel System deactivated");
    Notify.infoNow("Fuel Management System deactivated");
  }
};

const applyRadarFeature = async (enabled: boolean) => {
  if (enabled) {
    log.debug("Activating Radar...");
    try {
      await enableRadar();
      log.info("Radar activated");
      Notify.successNow("Aircraft Radar activated");
    } catch (error) {
      log.error("Radar activation failed:", error);
      Notify.errorNow("Failed to activate Radar");
      setAircraftRadarEnabled(false);
      setFeatureState("aircraftRadar", false);
    }
  } else {
    log.debug("Deactivating Radar...");
    disableRadar();
    log.info("Radar deactivated");
    Notify.infoNow("Aircraft Radar deactivated");
  }
};

export default async () => {
  return await new Promise(async (resolve, reject) => {
    try {
      const { allowed } = (Props as any).ExperimentalFeatures || { allowed: [] };
      await loadFeatureStates();
      if (!autoApplied) {
        autoApplied = true;

        log.debug("Auto-applying saved states...");

        if (fuelSystemEnabled()) {
          log.debug("Fuel System is enabled in storage, activating...");
          try {
            await FuelSystem.activate();
            log.debug("Fuel System activated (auto-load)");
          } catch (error) {
            log.error("Fuel System auto-activation failed:", error);
          }
        } else {
          log.debug("Fuel System is disabled in storage, skipping activation");
        }

        if (aircraftMarkersEnabled()) {
          log.debug("Auto-enabling Aircraft Markers from storage");
          applyAircraftMarkersFeature(true);
        } else {
          log.debug("Aircraft Markers are disabled in storage");
        }

        if (aircraftRadarEnabled()) {
          log.debug("Auto-enabling Radar from storage");
          await applyRadarFeature(true);
        } else {
          log.debug("Radar is disabled in storage");
        }

        log.info("Auto-apply completed");
        setTimeout(() => {
          log.debug("Reloading UI after auto-apply to update status");
          reloadUI();
        }, 200);
      }

      const response = [];
      response.push(
        <div class="space-y-2 mb-4">
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Aircraft Configuration</h3>
          <div class="flex flex-wrap gap-2">
            <button
              class="flex-1 min-w-[80px] border-0 rounded-md px-3 py-2 bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:cursor-pointer transition-colors text-sm"
              onclick={() => SaveManager.save()}
              title="Save current aircraft configuration (definition + engines)"
            >
              Save
            </button>
            <button
              class="flex-1 min-w-[80px] border-0 rounded-md px-3 py-2 bg-amber-600 text-white shadow-md hover:bg-amber-700 hover:cursor-pointer transition-colors text-sm"
              onclick={() => SaveManager.load()}
              title="Load saved aircraft configuration"
            >
              Load
            </button>
            <button
              class="flex-1 min-w-[80px] border-0 rounded-md px-3 py-2 bg-red-600 text-white shadow-md hover:bg-red-700 hover:cursor-pointer transition-colors text-sm"
              onclick={() => SaveManager.delete()}
              title="Delete saved aircraft configuration"
            >
              Delete
            </button>
          </div>
        </div>
      );
      response.push(
        <h3 class="font-semibold text-gray-900 dark:text-white text-sm mt-4">Features</h3>
      );
      for (const feature of allowed) {
        const { name, label } = feature;
        const getIsEnabled = () => {
          switch (name) {
            case "fuelSystem": return fuelSystemEnabled();
            case "aircraftMarkers": return aircraftMarkersEnabled();
            case "aircraftRadar": return aircraftRadarEnabled();
            default: return false;
          }
        };

        response.push(
          <div class="flex items-center justify-between p-3 rounded-md bg-gray-400/50 dark:bg-gray-800/60 border border-gray-500/30">
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">{label}</h3>
              <p class="text-xs text-gray-600 dark:text-gray-400">
                {name === "fuelSystem" && "Advanced fuel consumption"}
                {name === "aircraftMarkers" && "Special markers on map"}
                {name === "aircraftRadar" && "Radar instrument display"}
              </p>
            </div>
            <div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
              <button
                type="button"
                class={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${getIsEnabled() ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                role="switch"
                aria-checked={getIsEnabled()}
                onclick={() => toggleFeature(name as "fuelSystem" | "aircraftMarkers" | "aircraftRadar" | "debugMode", label)}
              >
                <span
                  class={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ${getIsEnabled() ? "right-0 border-blue-500" : "left-0 border-gray-300 dark:border-gray-600"
                    }`}
                />
              </button>
            </div>
          </div>
        );
        if (name === "aircraftMarkers" && aircraftMarkersEnabled()) {
          const typeCount = getAircraftTypeCount();
          const groupNames = getAircraftGroupNames();

          response.push(
            <div class="ml-4 space-y-2">
              <h4 class="font-semibold text-gray-900 dark:text-white text-sm">Special Aircraft Markers</h4>
              <div class="p-3 rounded-md bg-blue-100/50 dark:bg-blue-900/30 border border-blue-300/50 dark:border-blue-700/50">
                <p class="text-xs text-blue-700 dark:text-blue-300 mb-2">
                  <span class="font-medium">{typeCount}</span> different aircraft types available
                </p>
                <div class="flex flex-wrap gap-1">
                  {groupNames.map((groupName) => (
                    <span class="px-2 py-0.5 text-xs bg-blue-200/50 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 rounded">
                      {groupName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        }
      }

      if (fuelSystemEnabled()) {
        const [capacityMult, setCapacityMult] = createSignal(FuelSystem.capacityMultiplier);
        const [consumptionMult, setConsumptionMult] = createSignal(FuelSystem.consumptionMultiplier);

        response.push(
          <div class="mt-4 space-y-3">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Fuel Management System</h3>

            <div class="p-3 rounded-md bg-amber-100/50 dark:bg-amber-900/30 border border-amber-300/50 dark:border-amber-700/50 space-y-4">
              <Input
                type="range"
                name="capacity_multiplier"
                min={0.1}
                max={2.0}
                step={0.01}
                value={capacityMult()}
                onChange={(v: number) => { setCapacityMult(v); FuelSystem.setCapacityMultiplier(v); }}
                notifyMode={'none'}
                minLabel={'Less fuel'}
                maxLabel={'More fuel'}
                showLimits={true}
                comment={'Fuel capacity = Aircraft Mass × Multiplier × 0.33 (kg→gal)'}
                valueFormatter={(v) => Number(v).toFixed(4)}
              />

              <Input
                type="range"
                name="consumption_multiplier"
                min={0.001}
                max={0.2}
                step={0.001}
                value={consumptionMult()}
                onChange={(v: number) => { setConsumptionMult(v); FuelSystem.setConsumptionMultiplier(v); }}
                notifyMode={'none'}
                minLabel={'Slow burn'}
                maxLabel={'Fast burn'}
                showLimits={true}
                comment={'Fuel burn rate = (Thrust/RPM) × Multiplier'}
                valueFormatter={(v) => Number(v).toFixed(4)}
              />

              <button
                onclick={() => {
                  setCapacityMult(0.6349575);
                  setConsumptionMult(0.05);
                  FuelSystem.setCapacityMultiplier(0.6349575);
                  FuelSystem.setConsumptionMultiplier(0.05);
                  Notify.successNow("Fuel settings reset to defaults");
                }}
                class="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        );
      }

      if (aircraftMarkersEnabled()) {
        const settings = getMarkerSettings();
        const [selfColor, setSelfColorState] = createSignal(settings.selfColor);
        const [otherColor, setOtherColorState] = createSignal(settings.otherColor);
        const [strokeColor, setStrokeColorState] = createSignal(settings.strokeColor);

        response.push(
          <div class="mt-4 space-y-3">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Aircraft Markers Settings</h3>

            <div class="p-3 rounded-md bg-blue-100/50 dark:bg-blue-900/30 border border-blue-300/50 dark:border-blue-700/50 space-y-4">

              <Input
                type="color"
                name="marker_self_color"
                value={selfColor()}
                onChange={(v: string) => { setSelfColorState(v); setSelfColor(v); }}
                notifyMode={'none'}
              />

              <Input
                type="color"
                name="marker_other_color"
                value={otherColor()}
                onChange={(v: string) => { setOtherColorState(v); setOtherColor(v); }}
                notifyMode={'none'}
              />

              <Input
                type="color"
                name="marker_stroke_color"
                value={strokeColor()}
                onChange={(v: string) => { setStrokeColorState(v); setStrokeColor(v); }}
                notifyMode={'none'}
              />

              <button
                onclick={() => {
                  setSelfColorState("#ffc107");
                  setOtherColorState("#3155B1");
                  setStrokeColorState("#ffffff");
                  resetMarkerSettings();
                  Notify.successNow("Marker settings reset to defaults");
                }}
                class="w-full px-3 py-2 text-sm bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        );
      }

      if (aircraftRadarEnabled()) {
        const radarSettings = getRadarSettings();
        const [radarRange, setRadarRangeState] = createSignal(radarSettings.range);
        const [showLabels, setShowLabelsState] = createSignal(radarSettings.showLabels);
        const [sweepSpeed, setSweepSpeedState] = createSignal(radarSettings.sweepSpeed);

        response.push(
          <div class="mt-4 space-y-3">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Aircraft Radar Settings</h3>

            <div class="p-3 rounded-md bg-green-100/50 dark:bg-green-900/30 border border-green-300/50 dark:border-green-700/50 space-y-4">
              <Input
                type="range"
                name="radar_range"
                min={5}
                max={100}
                step={1}
                value={radarRange()}
                onChange={(v: number) => { setRadarRangeState(v); setRadarRange(v); }}
                notifyMode={'none'}
                unit={'NM'}
              />

              <Input
                type="range"
                name="radar_sweep_speed"
                min={2}
                max={10}
                step={1}
                value={sweepSpeed()}
                onChange={(v: number) => { setSweepSpeedState(v); setRadarSweepSpeed(v); }}
                notifyMode={'none'}
                unit={'s'}
              />

              <Input
                type="boolean"
                name="radar_show_labels"
                value={showLabels()}
                onChange={(v: boolean) => { setShowLabelsState(v); setRadarShowLabels(v); }}
                notifyMode={'none'}
              />

              <div class="text-xs text-green-700 dark:text-green-300 space-y-1">
                <p>🟢 Green: Same altitude (±300m)</p>
                <p>🔵 Cyan: Above you (+300m)</p>
                <p>🟡 Yellow: Below you (-300m)</p>
              </div>
            </div>
          </div>
        );
      }

      response.push(
        <h3 class="font-semibold text-gray-900 dark:text-white text-sm mt-4">Developer</h3>
      );

      response.push(
        <div class="flex items-center justify-between p-3 rounded-md bg-gray-400/50 dark:bg-gray-800/60 border border-gray-500/30">
          <div>
            <h3 class="font-semibold text-gray-900 dark:text-white">Debug Mode</h3>
            <p class="text-xs text-gray-600 dark:text-gray-400">Enable detailed console logging</p>
          </div>
          <div class="relative inline-block w-12 align-middle select-none transition duration-200 ease-in">
            <button
              type="button"
              class={`relative inline-flex h-6 w-12 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out ${debugModeEnabled() ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-600"
                }`}
              role="switch"
              aria-checked={debugModeEnabled()}
              onclick={() => toggleFeature("debugMode", "Debug Mode")}
            >
              <span
                class={`absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-200 ${debugModeEnabled() ? "right-0 border-blue-500" : "left-0 border-gray-300 dark:border-gray-600"
                  }`}
              />
            </button>
          </div>
        </div>
      );

      resolve(response);
    } catch (e) {
      log.error("Failed to load experimental features:", e);
      reject(e);
    }
  });
};
