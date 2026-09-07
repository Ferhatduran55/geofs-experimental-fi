import { createSignal } from "solid-js";
import Notify from "../../../shared/Notify";
import Storage from "../../../shared/Storage";
import Logger from "../../../shared/Logger";
import { reloadUI } from "../../../layouts/Assistant";
import Input from "../../../components/Input";
import { core } from "../../../core/CoreEngine";
import FuelEngine from "../../fuel/FuelEngine";
import MarkerEngine from "../../markers/MarkerEngine";
import RadarEngine from "../../radar/RadarEngine";
import SaveManager from "../../aircraft-config/SaveManager";

const log = Logger.create("SettingsTab");

const [fuelSystemEnabled, setFuelSystemEnabled] = createSignal(core.modules.isEnabled("fuel"));
const [aircraftMarkersEnabled, setAircraftMarkersEnabled] = createSignal(core.modules.isEnabled("markers"));
const [aircraftRadarEnabled, setAircraftRadarEnabled] = createSignal(core.modules.isEnabled("radar"));
const [careerSystemEnabled, setCareerSystemEnabled] = createSignal(core.modules.isEnabled("career"));
const [cancelOnCrash, setCancelOnCrash] = createSignal(true);
const [showRadarDestination, setShowRadarDestination] = createSignal(true);
const [showRadarAirports, setShowRadarAirports] = createSignal(true);
const [showRadarTerrainMap, setShowRadarTerrainMap] = createSignal(true);
const [debugModeEnabled, setDebugModeEnabled] = createSignal(false);

const syncStatesWithCore = async () => {
  setFuelSystemEnabled(core.modules.isEnabled("fuel"));
  setAircraftMarkersEnabled(core.modules.isEnabled("markers"));
  setAircraftRadarEnabled(core.modules.isEnabled("radar"));
  setCareerSystemEnabled(core.modules.isEnabled("career"));

  const savedCrash = await Storage.get("cancel_mission_on_crash");
  setCancelOnCrash(savedCrash !== false);

  const savedRadarDest = await Storage.get("radar_show_destination");
  setShowRadarDestination(savedRadarDest !== false);

  const savedRadarAp = await Storage.get("radar_show_airports");
  setShowRadarAirports(savedRadarAp !== false);

  const savedRadarTerrain = await Storage.get("radar_show_terrain_map");
  setShowRadarTerrainMap(savedRadarTerrain !== false);
};

const toggleModule = async (moduleId: string, label: string) => {
  const enabled = await core.modules.toggle(moduleId);
  syncStatesWithCore();
  Notify.successNow(`${label} ${enabled ? "enabled" : "disabled"}`);
  reloadUI();
};

export default async () => {
  return await new Promise(async (resolve, reject) => {
    try {
      await syncStatesWithCore();
      const savedDebug = await Storage.get("experimental_debug_mode");
      if (typeof savedDebug === "boolean") {
        setDebugModeEnabled(savedDebug);
        Logger.setDevMode(savedDebug);
      }

      const response = [];

      // Aircraft Configuration (Save/Load/Delete)
      response.push(
        <div class="space-y-2 mb-4 font-sans">
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Aircraft Configuration</h3>
          <div class="flex flex-wrap gap-2">
            <button
              class="flex-1 min-w-[80px] border-0 rounded-md px-3 py-2 bg-emerald-600 text-white shadow-md hover:bg-emerald-700 hover:cursor-pointer transition-colors text-sm font-medium"
              onclick={() => SaveManager.save()}
              title="Save current aircraft configuration (definition + engines)"
            >
              Save
            </button>
            <button
              class="flex-1 min-w-[80px] border-0 rounded-md px-3 py-2 bg-amber-600 text-white shadow-md hover:bg-amber-700 hover:cursor-pointer transition-colors text-sm font-medium"
              onclick={() => SaveManager.load()}
              title="Load saved aircraft configuration"
            >
              Load
            </button>
            <button
              class="flex-1 min-w-[80px] border-0 rounded-md px-3 py-2 bg-red-600 text-white shadow-md hover:bg-red-700 hover:cursor-pointer transition-colors text-sm font-medium"
              onclick={() => SaveManager.delete()}
              title="Delete saved aircraft configuration"
            >
              Delete
            </button>
          </div>
        </div>
      );

      response.push(
        <h3 class="font-semibold text-gray-900 dark:text-white text-sm mt-4">Core Modules</h3>
      );

      // Core Modules List with Input Component
      response.push(
        <div class="space-y-3 font-sans">
          <Input
            type="boolean"
            name="mod_fuel"
            label="Fuel Management System"
            comment="Advanced fuel consumption simulation and cockpit gauge"
            value={fuelSystemEnabled()}
            onChange={() => toggleModule("fuel", "Fuel System")}
            notifyMode="none"
          />

          <Input
            type="boolean"
            name="mod_markers"
            label="Aircraft Markers"
            comment="Custom SVG 2D aircraft silhouettes on map and multiplayer traffic"
            value={aircraftMarkersEnabled()}
            onChange={() => toggleModule("markers", "Aircraft Markers")}
            notifyMode="none"
          />

          <Input
            type="boolean"
            name="mod_radar"
            label="Multiplayer Radar"
            comment="Cockpit radar tracking nearby multiplayer aircraft and runways"
            value={aircraftRadarEnabled()}
            onChange={() => toggleModule("radar", "Aircraft Radar")}
            notifyMode="none"
          />

          <Input
            type="boolean"
            name="mod_career"
            label="Career & Transport System"
            comment="Aviation market contracts, flight scoring and pilot logbook"
            value={careerSystemEnabled()}
            onChange={() => toggleModule("career", "Career System")}
            notifyMode="none"
          />
        </div>
      );

      // Career Module Settings
      if (careerSystemEnabled()) {
        response.push(
          <div class="mt-4 space-y-3 font-sans">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Career & Navigation Settings</h3>
            <Input
              type="boolean"
              name="career_cancel_crash"
              label="Cancel Mission on Crash"
              comment="Abort active contract and apply insurance penalty on destruction"
              value={cancelOnCrash()}
              onChange={(v: boolean) => {
                setCancelOnCrash(v);
                Storage.write("cancel_mission_on_crash", v);
                Notify.successNow(`Crash Cancellation ${v ? "enabled" : "disabled"}`);
              }}
              notifyMode="none"
            />
          </div>
        );
      }

      // Fuel Settings Section if enabled
      if (fuelSystemEnabled()) {
        const [capacityMult, setCapacityMult] = createSignal(FuelEngine.capacityMultiplier);
        const [consumptionMult, setConsumptionMult] = createSignal(FuelEngine.consumptionMultiplier);

        response.push(
          <div class="mt-4 space-y-3 font-sans">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Fuel System Tuning</h3>

            <div class="p-3 rounded-md bg-amber-100/50 dark:bg-amber-900/30 border border-amber-300/50 dark:border-amber-700/50 space-y-4">
              <Input
                type="range"
                name="capacity_multiplier"
                min={0.1}
                max={2.0}
                step={0.01}
                value={capacityMult()}
                onChange={(v: number) => {
                  setCapacityMult(v);
                  FuelEngine.setCapacityMultiplier(v);
                }}
                notifyMode={"none"}
                minLabel={"Less fuel"}
                maxLabel={"More fuel"}
                showLimits={true}
                comment={"Fuel capacity = Aircraft Mass × Multiplier × 0.33"}
                valueFormatter={(v) => Number(v).toFixed(4)}
              />

              <Input
                type="range"
                name="consumption_multiplier"
                min={0.001}
                max={0.2}
                step={0.001}
                value={consumptionMult()}
                onChange={(v: number) => {
                  setConsumptionMult(v);
                  FuelEngine.setConsumptionMultiplier(v);
                }}
                notifyMode={"none"}
                minLabel={"Slow burn"}
                maxLabel={"Fast burn"}
                showLimits={true}
                comment={"Fuel burn rate = (Thrust/RPM) × Multiplier"}
                valueFormatter={(v) => Number(v).toFixed(4)}
              />

              <button
                onclick={() => {
                  setCapacityMult(0.6349575);
                  setConsumptionMult(0.05);
                  FuelEngine.setCapacityMultiplier(0.6349575);
                  FuelEngine.setConsumptionMultiplier(0.05);
                  Notify.successNow("Fuel settings reset to defaults");
                }}
                class="w-full px-3 py-2 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors font-medium"
              >
                Reset Fuel to Defaults
              </button>
            </div>
          </div>
        );
      }

      // Marker Settings Section if enabled
      if (aircraftMarkersEnabled()) {
        const settings = MarkerEngine.settings;
        const [selfColor, setSelfColorState] = createSignal(settings.selfColor);
        const [otherColor, setOtherColorState] = createSignal(settings.otherColor);
        const [strokeColor, setStrokeColorState] = createSignal(settings.strokeColor);

        response.push(
          <div class="mt-4 space-y-3 font-sans">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Aircraft Markers Settings</h3>

            <div class="p-3 rounded-md bg-blue-100/50 dark:bg-blue-900/30 border border-blue-300/50 dark:border-blue-700/50 space-y-3">
              <Input
                type="color"
                name="marker_self_color"
                value={selfColor()}
                onChange={(v: string) => {
                  setSelfColorState(v);
                  MarkerEngine.setSelfColor(v);
                }}
                notifyMode={"none"}
              />

              <Input
                type="color"
                name="marker_other_color"
                value={otherColor()}
                onChange={(v: string) => {
                  setOtherColorState(v);
                  MarkerEngine.setOtherColor(v);
                }}
                notifyMode={"none"}
              />

              <Input
                type="color"
                name="marker_stroke_color"
                value={strokeColor()}
                onChange={(v: string) => {
                  setStrokeColorState(v);
                  MarkerEngine.setStrokeColor(v);
                }}
                notifyMode={"none"}
              />

              <button
                onclick={() => {
                  setSelfColorState("#ffc107");
                  setOtherColorState("#3155B1");
                  setStrokeColorState("#ffffff");
                  MarkerEngine.resetSettings();
                  Notify.successNow("Marker settings reset to defaults");
                }}
                class="w-full px-3 py-2 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors font-medium"
              >
                Reset Colors to Defaults
              </button>
            </div>
          </div>
        );
      }

      // Radar Settings Section if enabled
      if (aircraftRadarEnabled()) {
        const radarSettings = RadarEngine.settings;
        const [radarRange, setRadarRangeState] = createSignal(radarSettings.range);
        const [showLabels, setShowLabelsState] = createSignal(radarSettings.showLabels);
        const [sweepSpeed, setSweepSpeedState] = createSignal(radarSettings.sweepSpeed);
        const [showTraffic, setShowTrafficState] = createSignal(radarSettings.showTraffic);
        const [airborneOnly, setAirborneOnlyState] = createSignal(radarSettings.airborneTrafficOnly);
        const [blimpEffect, setBlimpEffectState] = createSignal(radarSettings.blimpEffect);
        const [blimpOpacity, setBlimpOpacityState] = createSignal(radarSettings.blimpOpacity || 0.9);

        response.push(
          <div class="mt-4 space-y-3 font-sans">
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Aircraft Radar Settings</h3>

            <div class="p-3 rounded-md bg-green-100/50 dark:bg-green-900/30 border border-green-300/50 dark:border-green-700/50 space-y-3">
              <Input
                type="range"
                name="radar_range"
                min={5}
                max={100}
                step={1}
                value={radarRange()}
                onChange={(v: number) => {
                  setRadarRangeState(v);
                  RadarEngine.setRange(v);
                }}
                notifyMode={"none"}
                unit={"NM"}
              />

              <Input
                type="range"
                name="radar_sweep_speed"
                min={2}
                max={10}
                step={1}
                value={sweepSpeed()}
                onChange={(v: number) => {
                  setSweepSpeedState(v);
                  RadarEngine.setSweepSpeed(v);
                }}
                notifyMode={"none"}
                unit={"s"}
              />

              <Input
                type="range"
                name="radar_blimp_opacity"
                min={0.2}
                max={1.0}
                step={0.05}
                value={blimpOpacity()}
                onChange={(v: number) => {
                  setBlimpOpacityState(v);
                  RadarEngine.setBlimpOpacity(v);
                }}
                notifyMode={"none"}
                label="Blimp Target Opacity"
                comment="Peak phosphor flash intensity or static transparency"
                valueFormatter={(v) => `${Math.round(Number(v) * 100)}%`}
              />

              <Input
                type="boolean"
                name="radar_show_traffic"
                label="Show Multiplayer Traffic"
                comment="Display surrounding aircraft on cockpit radar screen"
                value={showTraffic()}
                onChange={(v: boolean) => {
                  setShowTrafficState(v);
                  RadarEngine.setShowTraffic(v);
                  Notify.successNow(`Radar Traffic ${v ? "enabled" : "disabled"}`);
                }}
                notifyMode={"none"}
              />

              <Input
                type="boolean"
                name="radar_airborne_only"
                label="Airborne Traffic Only"
                comment="Filter out parked and ground taxiing aircraft to declutter radar"
                value={airborneOnly()}
                onChange={(v: boolean) => {
                  setAirborneOnlyState(v);
                  RadarEngine.setAirborneTrafficOnly(v);
                  Notify.successNow(`Airborne Only Filter ${v ? "enabled" : "disabled"}`);
                }}
                notifyMode={"none"}
              />

              <Input
                type="boolean"
                name="radar_blimp_effect"
                label="Sweep Phosphor Blimp Effect"
                comment="Enable dynamic sweep decay effect. If disabled, blips remain clean and transparent"
                value={blimpEffect()}
                onChange={(v: boolean) => {
                  setBlimpEffectState(v);
                  RadarEngine.setBlimpEffect(v);
                  Notify.successNow(`Blimp Phosphor Effect ${v ? "enabled" : "disabled"}`);
                }}
                notifyMode={"none"}
              />

              <Input
                type="boolean"
                name="radar_show_labels"
                label="Show Traffic Callsigns"
                comment="Display aircraft callsign tags next to multiplayer blips"
                value={showLabels()}
                onChange={(v: boolean) => {
                  setShowLabelsState(v);
                  RadarEngine.setShowLabels(v);
                }}
                notifyMode={"none"}
              />

              <Input
                type="boolean"
                name="radar_show_destination"
                label="Show Destination on Radar"
                comment="Display bearing vector line and arrival zone on cockpit radar"
                value={showRadarDestination()}
                onChange={(v: boolean) => {
                  setShowRadarDestination(v);
                  RadarEngine.setShowDestination(v);
                  Notify.successNow(`Radar Destination ${v ? "enabled" : "disabled"}`);
                }}
                notifyMode={"none"}
              />

              <Input
                type="boolean"
                name="radar_show_airports"
                label="Show Nearby Airports on Radar"
                comment="Display surrounding GeoFS airfields and runways on radar"
                value={showRadarAirports()}
                onChange={(v: boolean) => {
                  setShowRadarAirports(v);
                  RadarEngine.setShowAirports(v);
                  Notify.successNow(`Radar Airports ${v ? "enabled" : "disabled"}`);
                }}
                notifyMode={"none"}
              />

              <Input
                type="boolean"
                name="radar_show_terrain_map"
                label="Show Land & Sea Coastline Map"
                comment="Display tactical dark land, ocean and coastline terrain overlay on radar"
                value={showRadarTerrainMap()}
                onChange={(v: boolean) => {
                  setShowRadarTerrainMap(v);
                  RadarEngine.setShowTerrainMap(v);
                  Notify.successNow(`Radar Terrain Map ${v ? "enabled" : "disabled"}`);
                }}
                notifyMode={"none"}
              />
            </div>
          </div>
        );
      }

      // Developer / Debug Mode
      response.push(
        <h3 class="font-semibold text-gray-900 dark:text-white text-sm mt-4">Developer Tools</h3>
      );

      response.push(
        <div class="space-y-3 font-sans">
          <Input
            type="boolean"
            name="dev_debug_mode"
            label="Debug Diagnostic Mode"
            comment="Enable detailed diagnostic logging in browser developer console"
            value={debugModeEnabled()}
            onChange={(v: boolean) => {
              setDebugModeEnabled(v);
              Logger.setDevMode(v);
              Storage.write("experimental_debug_mode", v);
              Notify.successNow(`Debug Mode ${v ? "enabled" : "disabled"}`);
            }}
            notifyMode="none"
          />
        </div>
      );

      resolve(response);
    } catch (e) {
      log.error("Failed to load settings tab UI:", e);
      reject(e);
    }
  });
};
