import { createSignal, Show } from "solid-js";
import Notify from "../../../shared/Notify";
import Storage from "../../../shared/Storage";
import Logger from "../../../shared/Logger";
import { reloadUI } from "../../../layouts/Assistant";
import Input from "../../../components/Input";
import { core } from "../../../core/CoreEngine";
import SaveManager from "../../aircraft-config/SaveManager";
import ConfigurationManager from "../ConfigurationManager";
import PresetBrowserModal from "./PresetBrowserModal";
import FuelSettingsPanel from "../../fuel/views/FuelSettingsPanel";
import MarkersSettingsPanel from "../../markers/views/MarkersSettingsPanel";
import RadarSettingsPanel from "../../radar/views/RadarSettingsPanel";
import DevSettingsPanel from "../../developer/views/DevSettingsPanel";

const log = Logger.create("SettingsTab");

const [fuelSystemEnabled, setFuelSystemEnabled] = createSignal(core.modules.isEnabled("fuel"));
const [aircraftMarkersEnabled, setAircraftMarkersEnabled] = createSignal(core.modules.isEnabled("markers"));
const [aircraftRadarEnabled, setAircraftRadarEnabled] = createSignal(core.modules.isEnabled("radar"));
const [careerSystemEnabled, setCareerSystemEnabled] = createSignal(core.modules.isEnabled("career"));
const [definitionsEnabled, setDefinitionsEnabled] = createSignal(core.modules.isEnabled("definitions"));
const [enginesEnabled, setEnginesEnabled] = createSignal(core.modules.isEnabled("engines"));
const [marketEnabled, setMarketEnabled] = createSignal(core.modules.isEnabled("market"));
const [transportEnabled, setTransportEnabled] = createSignal(core.modules.isEnabled("transport"));
const [cancelOnCrash, setCancelOnCrash] = createSignal(true);
const [showPresetBrowser, setShowPresetBrowser] = createSignal(false);

const syncStatesWithCore = async () => {
  setFuelSystemEnabled(core.modules.isEnabled("fuel"));
  setAircraftMarkersEnabled(core.modules.isEnabled("markers"));
  setAircraftRadarEnabled(core.modules.isEnabled("radar"));
  setCareerSystemEnabled(core.modules.isEnabled("career"));
  setDefinitionsEnabled(core.modules.isEnabled("definitions"));
  setEnginesEnabled(core.modules.isEnabled("engines"));
  setMarketEnabled(core.modules.isEnabled("market"));
  setTransportEnabled(core.modules.isEnabled("transport"));

  const savedCrash = await Storage.get("cancel_mission_on_crash");
  setCancelOnCrash(savedCrash !== false);
};

const toggleModule = async (moduleId: string, label: string) => {
  const enabled = await core.modules.toggle(moduleId);
  await syncStatesWithCore();
  Notify.successNow(`${label} ${enabled ? "enabled" : "disabled"}`);
  reloadUI();
};

const toggleDependentModule = async (moduleId: string, label: string) => {
  if (!careerSystemEnabled()) {
    Notify.warning(`Cannot toggle ${label}: Career System is currently disabled!`, "Dependencies");
    return;
  }
  await toggleModule(moduleId, label);
};

export default async () => {
  try {
    await syncStatesWithCore();

    return [
      <div class="space-y-4 font-sans pb-4">
        {/* Preset Browser & Configuration Profiles Hub */}
        <div class="p-3 bg-gradient-to-r from-gray-900 via-gray-850 to-gray-900 border border-gray-700/80 rounded-xl shadow-lg space-y-3">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="font-bold text-gray-900 dark:text-white text-sm flex items-center space-x-1.5">
                <span>⚙️</span>
                <span>Configuration & Preset Hub</span>
              </h3>
              <p class="text-[11px] text-gray-400">Save and load individual aircraft setups or whole addon state snapshots</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPresetBrowser(true)}
              class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <span>📁</span>
              <span>Browse Presets</span>
            </button>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              class="px-2.5 py-1.5 rounded-lg bg-emerald-700/80 hover:bg-emerald-600 text-white font-medium transition-colors flex items-center justify-center space-x-1"
              onClick={async () => {
                await ConfigurationManager.saveAircraftProfile();
                await syncStatesWithCore();
              }}
              title="Quick save current aircraft physics/engines as an Aircraft Profile"
            >
              <span>✈️</span>
              <span>Save Aircraft</span>
            </button>

            <button
              type="button"
              class="px-2.5 py-1.5 rounded-lg bg-indigo-700/80 hover:bg-indigo-600 text-white font-medium transition-colors flex items-center justify-center space-x-1"
              onClick={async () => {
                await ConfigurationManager.saveGlobalProfile();
                await syncStatesWithCore();
              }}
              title="Quick save current addon module states and settings as a Global Profile"
            >
              <span>🌐</span>
              <span>Save Suite</span>
            </button>

            <button
              type="button"
              class="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-750 text-gray-200 border border-gray-700 transition-colors flex items-center justify-center space-x-1"
              onClick={() => SaveManager.load()}
              title="Quick load default slot for current aircraft"
            >
              <span>⚡</span>
              <span>Quick Load</span>
            </button>

            <button
              type="button"
              class="px-2.5 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800/60 transition-colors flex items-center justify-center space-x-1"
              onClick={() => SaveManager.delete()}
              title="Delete default slot for current aircraft"
            >
              <span>🗑️</span>
              <span>Clear Slot</span>
            </button>
          </div>
        </div>

        {/* Core Modules Toggles */}
        <div class="space-y-3">
          <h3 class="font-semibold text-gray-900 dark:text-white text-sm">Core Modules</h3>

          <Input
            type="boolean"
            name="mod_definitions"
            label="Aircraft Definitions"
            comment="Editable aerodynamic, mass, and performance parameters for active aircraft"
            value={definitionsEnabled()}
            onChange={() => toggleModule("definitions", "Aircraft Definitions")}
            notifyMode="none"
          />

          <Input
            type="boolean"
            name="mod_engines"
            label="Aircraft Engines"
            comment="Multi-engine thrust, RPM, and turbine tuning panel"
            value={enginesEnabled()}
            onChange={() => toggleModule("engines", "Aircraft Engines")}
            notifyMode="none"
          />

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

          <Input
            type="boolean"
            name="mod_market"
            label={careerSystemEnabled() ? "Aviation Market Engine" : "Aviation Market Engine 🔒 (Requires Career)"}
            comment="Real-time passenger, cargo, and jet fuel rate indices"
            value={marketEnabled()}
            onChange={() => toggleDependentModule("market", "Market Engine")}
            notifyMode="none"
          />

          <Input
            type="boolean"
            name="mod_transport"
            label={careerSystemEnabled() ? "Procedural Flight Transport" : "Procedural Flight Transport 🔒 (Requires Career)"}
            comment="Dynamic procedural transport mission generator and safe runway launcher"
            value={transportEnabled()}
            onChange={() => toggleDependentModule("transport", "Transport Engine")}
            notifyMode="none"
          />
        </div>

        {/* Career Module Settings */}
        <Show when={careerSystemEnabled()}>
          <div class="mt-4 space-y-3">
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
        </Show>

        {/* Modular Fuel Settings Panel */}
        <Show when={fuelSystemEnabled()}>
          <FuelSettingsPanel />
        </Show>

        {/* Modular Markers Settings Panel */}
        <Show when={aircraftMarkersEnabled()}>
          <MarkersSettingsPanel />
        </Show>

        {/* Modular Radar Settings Panel */}
        <Show when={aircraftRadarEnabled()}>
          <RadarSettingsPanel />
        </Show>

        {/* Modular Developer & Diagnostics Panel */}
        <DevSettingsPanel />

        {/* Preset Browser Modal */}
        <Show when={showPresetBrowser()}>
          <PresetBrowserModal onClose={() => setShowPresetBrowser(false)} />
        </Show>
      </div>
    ];
  } catch (e) {
    log.error("Failed to load settings tab UI:", e);
    return [
      <div class="p-4 text-xs text-rose-500 font-sans">
        Failed to load Settings panel: {String(e)}
      </div>
    ];
  }
};

