import { createSignal, onMount, For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import ConfigurationManager, {
  type AircraftProfile,
  type GlobalProfile,
  type Profile,
  type ProfileType,
} from "../ConfigurationManager";
import Notify from "../../../shared/Notify";

interface PresetBrowserModalProps {
  onClose: () => void;
  initialTab?: ProfileType;
}

export default (props: PresetBrowserModalProps) => {
  const [activeTab, setActiveTab] = createSignal<ProfileType>(props.initialTab || "aircraft");
  const [aircraftProfiles, setAircraftProfiles] = createSignal<AircraftProfile[]>([]);
  const [globalProfiles, setGlobalProfiles] = createSignal<GlobalProfile[]>([]);
  const [searchTerm, setSearchTerm] = createSignal<string>("");
  const [showSavePrompt, setShowSavePrompt] = createSignal<boolean>(false);
  const [newProfileName, setNewProfileName] = createSignal<string>("");
  const [newProfileNotes, setNewProfileNotes] = createSignal<string>("");
  const [showImportPrompt, setShowImportPrompt] = createSignal<boolean>(false);
  const [importJsonText, setImportJsonText] = createSignal<string>("");

  const refreshProfiles = async () => {
    const acs = await ConfigurationManager.getAircraftProfiles();
    const gls = await ConfigurationManager.getGlobalProfiles();
    setAircraftProfiles(acs);
    setGlobalProfiles(gls);
  };

  onMount(() => {
    refreshProfiles();
  });

  const handleOpenSavePrompt = () => {
    const defaultName = ConfigurationManager.generateAutoName(activeTab());
    setNewProfileName(defaultName);
    setNewProfileNotes("");
    setShowSavePrompt(true);
  };

  const handleSaveCurrent = async () => {
    if (activeTab() === "aircraft") {
      const res = await ConfigurationManager.saveAircraftProfile(newProfileName(), newProfileNotes());
      if (res) {
        setShowSavePrompt(false);
        await refreshProfiles();
      }
    } else {
      const res = await ConfigurationManager.saveGlobalProfile(newProfileName(), newProfileNotes());
      if (res) {
        setShowSavePrompt(false);
        await refreshProfiles();
      }
    }
  };

  const handleApply = async (profile: Profile) => {
    if (profile.type === "aircraft") {
      await ConfigurationManager.applyAircraftProfile(profile as AircraftProfile);
    } else {
      await ConfigurationManager.applyGlobalProfile(profile as GlobalProfile);
    }
  };

  const handleDelete = async (id: string, type: ProfileType) => {
    await ConfigurationManager.deleteProfile(id, type);
    await refreshProfiles();
  };

  const handleExport = (profile: Profile) => {
    const json = ConfigurationManager.exportProfileJson(profile);
    navigator.clipboard?.writeText?.(json);
    Notify.successNow(`Exported "${profile.name}" to clipboard as JSON!`);
  };

  const handleImportSubmit = async () => {
    if (!importJsonText().trim()) return;
    const res = await ConfigurationManager.importProfileJson(importJsonText());
    if (res) {
      setShowImportPrompt(false);
      setImportJsonText("");
      await refreshProfiles();
      setActiveTab(res.type);
    }
  };

  const filteredAircraftProfiles = () => {
    const q = searchTerm().trim().toLowerCase();
    if (!q) return aircraftProfiles();
    return aircraftProfiles().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.aircraftName.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q))
    );
  };

  const filteredGlobalProfiles = () => {
    const q = searchTerm().trim().toLowerCase();
    if (!q) return globalProfiles();
    return globalProfiles().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.notes && p.notes.toLowerCase().includes(q)) ||
        p.summary.enabledModules.some((m) => m.toLowerCase().includes(q))
    );
  };

  return (
    <Portal mount={document.body}>
      <div class="fixed inset-0 z-[100000] flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in font-sans select-none">
        <div class="bg-gray-900 border border-gray-700/80 rounded-2xl w-[95vw] max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden text-gray-100">
          
          {/* Header Bar */}
          <div class="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 shrink-0">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl shadow-lg shadow-indigo-900/40">
                ⚙️
              </div>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-bold text-white text-lg tracking-wide">Configuration Preset Browser</h3>
                  <span class="px-2 py-0.5 text-[10px] font-bold bg-indigo-900/60 text-indigo-300 rounded border border-indigo-700/50">
                    Dual Profile Hub
                  </span>
                </div>
                <p class="text-xs text-gray-400">Save, load, inspect and exchange aircraft physics & global addon setups</p>
              </div>
            </div>

            <button
              type="button"
              class="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
              onClick={props.onClose}
            >
              ✕
            </button>
          </div>

          {/* Sub-header Controls & Tab Switcher */}
          <div class="px-6 py-3 bg-gray-800/50 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Tabs */}
            <div class="flex items-center space-x-2 bg-gray-900/80 p-1 rounded-xl border border-gray-700/60">
              <button
                type="button"
                onClick={() => setActiveTab("aircraft")}
                class={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab() === "aircraft"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>✈️</span>
                <span>Aircraft Profiles</span>
                <span class="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono ml-1">
                  {aircraftProfiles().length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("global")}
                class={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  activeTab() === "global"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/50"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <span>🌐</span>
                <span>Global Addon Profiles</span>
                <span class="text-[10px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono ml-1">
                  {globalProfiles().length}
                </span>
              </button>
            </div>

            {/* Search & Action Buttons */}
            <div class="flex items-center space-x-3">
              <div class="relative w-56">
                <input
                  type="text"
                  placeholder="Filter profiles..."
                  value={searchTerm()}
                  onInput={(e) => setSearchTerm(e.currentTarget.value)}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyUp={(e) => e.stopPropagation()}
                  class="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                />
                <span class="absolute left-2.5 top-1.5 text-gray-500 text-xs">🔍</span>
              </div>

              <button
                type="button"
                onClick={handleOpenSavePrompt}
                class="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition-all active:scale-95"
              >
                <span>💾</span>
                <span>Save Current {activeTab() === "aircraft" ? "Aircraft" : "Global"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowImportPrompt(true)}
                class="flex items-center space-x-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-750 text-gray-300 hover:text-white border border-gray-700 text-xs font-bold rounded-lg transition-colors"
                title="Import Profile from JSON string"
              >
                <span>📥</span>
                <span>Import JSON</span>
              </button>
            </div>
          </div>

          {/* Body Content / Card List */}
          <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {/* AIRCRAFT PROFILES TAB */}
            <Show when={activeTab() === "aircraft"}>
              <Show
                when={filteredAircraftProfiles().length > 0}
                fallback={
                  <div class="text-center py-20 text-gray-500 space-y-2">
                    <div class="text-4xl">✈️</div>
                    <p class="text-sm font-medium">No Aircraft Profiles saved yet.</p>
                    <p class="text-xs text-gray-600">
                      Configure your aircraft in Definitions / Engines tabs and click "Save Current Aircraft" to create your first profile.
                    </p>
                  </div>
                }
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <For each={filteredAircraftProfiles()}>
                    {(profile) => (
                      <div class="flex flex-col justify-between bg-gray-800/80 hover:bg-gray-800 border border-gray-700/70 hover:border-emerald-500/50 rounded-xl p-4 transition-all duration-200 shadow-md">
                        <div>
                          {/* Card Header */}
                          <div class="flex items-center justify-between pb-2 mb-2 border-b border-gray-700/60">
                            <div>
                              <h4 class="font-bold text-white text-sm flex items-center space-x-2">
                                <span>✈️</span>
                                <span>{profile.name}</span>
                              </h4>
                              <p class="text-[10px] text-gray-400 font-mono mt-0.5">
                                Base Aircraft: <b class="text-gray-200">{profile.aircraftName}</b> (ID: {profile.aircraftId})
                              </p>
                            </div>
                            <span class="text-[10px] text-gray-500 font-mono">
                              {new Date(profile.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Notes if any */}
                          <Show when={profile.notes}>
                            <p class="text-xs text-gray-300 italic bg-gray-900/40 p-2 rounded mb-3 border border-gray-700/30">
                              "{profile.notes}"
                            </p>
                          </Show>

                          {/* Metrics / Summary Badges */}
                          <div class="flex flex-wrap gap-1.5 mb-3 text-[10px] font-mono">
                            <span class="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/50 text-emerald-300">
                              📋 {profile.summary.definitionPropsCount} Definition Props
                            </span>
                            <span class="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-800/50 text-blue-300">
                              ⚙️ {profile.summary.enginesCount} Engines
                            </span>
                            <Show when={profile.summary.maxThrust}>
                              <span class="px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/50 text-amber-300">
                                ⚡ Max Thrust: {profile.summary.maxThrust?.toLocaleString()} N
                              </span>
                            </Show>
                            <Show when={profile.summary.maxRPM}>
                              <span class="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/50 text-purple-300">
                                🔄 Max RPM: {profile.summary.maxRPM?.toLocaleString()}
                              </span>
                            </Show>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div class="pt-3 border-t border-gray-700/50 flex items-center justify-between gap-2 mt-auto">
                          <button
                            type="button"
                            onClick={() => handleApply(profile)}
                            class="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow transition-all active:scale-95 flex items-center justify-center space-x-1"
                          >
                            <span>▶️</span>
                            <span>Apply to Aircraft</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleExport(profile)}
                            class="py-1.5 px-3 bg-gray-700 hover:bg-gray-650 text-gray-200 text-xs font-medium rounded-lg transition-colors"
                            title="Export as JSON"
                          >
                            📋 Export
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(profile.id, "aircraft")}
                            class="py-1.5 px-2.5 bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 text-xs rounded-lg transition-colors"
                            title="Delete Profile"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </Show>

            {/* GLOBAL ADDON PROFILES TAB */}
            <Show when={activeTab() === "global"}>
              <Show
                when={filteredGlobalProfiles().length > 0}
                fallback={
                  <div class="text-center py-20 text-gray-500 space-y-2">
                    <div class="text-4xl">🌐</div>
                    <p class="text-sm font-medium">No Global Profiles saved yet.</p>
                    <p class="text-xs text-gray-600">
                      Configure your preferred modules and settings, then click "Save Current Global" to create a snapshot.
                    </p>
                  </div>
                }
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <For each={filteredGlobalProfiles()}>
                    {(profile) => (
                      <div class="flex flex-col justify-between bg-gray-800/80 hover:bg-gray-800 border border-gray-700/70 hover:border-indigo-500/50 rounded-xl p-4 transition-all duration-200 shadow-md">
                        <div>
                          {/* Card Header */}
                          <div class="flex items-center justify-between pb-2 mb-2 border-b border-gray-700/60">
                            <div>
                              <h4 class="font-bold text-white text-sm flex items-center space-x-2">
                                <span>🌐</span>
                                <span>{profile.name}</span>
                              </h4>
                              <p class="text-[10px] text-gray-400 font-mono mt-0.5">
                                Active Modules: <b class="text-indigo-300">{profile.summary.enabledModules.length} Enabled</b>
                              </p>
                            </div>
                            <span class="text-[10px] text-gray-500 font-mono">
                              {new Date(profile.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Notes if any */}
                          <Show when={profile.notes}>
                            <p class="text-xs text-gray-300 italic bg-gray-900/40 p-2 rounded mb-3 border border-gray-700/30">
                              "{profile.notes}"
                            </p>
                          </Show>

                          {/* Module Matrix Pills */}
                          <div class="space-y-1.5 mb-3">
                            <div class="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Module Status Matrix</div>
                            <div class="flex flex-wrap gap-1 text-[10px]">
                              <For each={Object.entries(profile.modules)}>
                                {([modId, enabled]) => (
                                  <span
                                    class={`px-2 py-0.5 rounded-full font-mono font-medium ${
                                      enabled
                                        ? "bg-emerald-950/80 border border-emerald-700/60 text-emerald-300"
                                        : "bg-gray-900/80 border border-gray-700/50 text-gray-500 line-through"
                                    }`}
                                  >
                                    {modId}
                                  </span>
                                )}
                              </For>
                            </div>
                          </div>

                          {/* Key Settings Preview */}
                          <div class="flex flex-wrap gap-1.5 mb-3 text-[10px] font-mono text-gray-400">
                            <Show when={profile.settings.fuel_multiplier !== undefined}>
                              <span class="px-2 py-0.5 rounded bg-gray-900/60 border border-gray-700/40">
                                ⛽ Fuel Mult: {profile.settings.fuel_multiplier}x
                              </span>
                            </Show>
                            <Show when={profile.settings.radar_range_nm !== undefined}>
                              <span class="px-2 py-0.5 rounded bg-gray-900/60 border border-gray-700/40">
                                📡 Radar: {profile.settings.radar_range_nm} NM
                              </span>
                            </Show>
                            <Show when={profile.settings.cancel_mission_on_crash !== undefined}>
                              <span class="px-2 py-0.5 rounded bg-gray-900/60 border border-gray-700/40">
                                💥 Crash Abort: {profile.settings.cancel_mission_on_crash ? "Yes" : "No"}
                              </span>
                            </Show>
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div class="pt-3 border-t border-gray-700/50 flex items-center justify-between gap-2 mt-auto">
                          <button
                            type="button"
                            onClick={() => handleApply(profile)}
                            class="flex-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition-all active:scale-95 flex items-center justify-center space-x-1"
                          >
                            <span>▶️</span>
                            <span>Load & Apply Suite</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleExport(profile)}
                            class="py-1.5 px-3 bg-gray-700 hover:bg-gray-650 text-gray-200 text-xs font-medium rounded-lg transition-colors"
                            title="Export as JSON"
                          >
                            📋 Export
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(profile.id, "global")}
                            class="py-1.5 px-2.5 bg-red-950/60 hover:bg-red-900 border border-red-800/60 text-red-300 text-xs rounded-lg transition-colors"
                            title="Delete Profile"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </Show>
            </Show>
          </div>

          {/* Footer Bar */}
          <div class="px-6 py-3 bg-gray-950 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400 shrink-0">
            <span>
              Configurations are permanently saved in Tampermonkey storage.
            </span>
            <button
              type="button"
              class="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl transition-colors"
              onClick={props.onClose}
            >
              Close Hub
            </button>
          </div>

          {/* SAVE PROMPT MODAL OVERLAY */}
          <Show when={showSavePrompt()}>
            <div class="fixed inset-0 z-[100010] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div class="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
                <div class="flex justify-between items-center pb-2 border-b border-gray-800">
                  <h4 class="font-bold text-white text-base">
                    Save New {activeTab() === "aircraft" ? "Aircraft" : "Global"} Profile
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowSavePrompt(false)}
                    class="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div class="space-y-3 text-xs">
                  <div>
                    <label class="block font-semibold text-gray-300 mb-1">Profile Name</label>
                    <input
                      type="text"
                      value={newProfileName()}
                      onInput={(e) => setNewProfileName(e.currentTarget.value)}
                      class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label class="block font-semibold text-gray-300 mb-1">Optional Notes</label>
                    <textarea
                      rows={2}
                      value={newProfileNotes()}
                      onInput={(e) => setNewProfileNotes(e.currentTarget.value)}
                      placeholder="e.g. Optimized for high-altitude cruise, extra climb thrust..."
                      class="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div class="flex justify-end space-x-2 pt-2 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowSavePrompt(false)}
                    class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCurrent}
                    class="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow transition-all"
                  >
                    Confirm Save
                  </button>
                </div>
              </div>
            </div>
          </Show>

          {/* IMPORT PROMPT MODAL OVERLAY */}
          <Show when={showImportPrompt()}>
            <div class="fixed inset-0 z-[100010] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
              <div class="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-2xl">
                <div class="flex justify-between items-center pb-2 border-b border-gray-800">
                  <h4 class="font-bold text-white text-base">Import Profile from JSON</h4>
                  <button
                    type="button"
                    onClick={() => setShowImportPrompt(false)}
                    class="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div class="space-y-2 text-xs">
                  <p class="text-gray-400">Paste the exported profile JSON string below:</p>
                  <textarea
                    rows={8}
                    value={importJsonText()}
                    onInput={(e) => setImportJsonText(e.currentTarget.value)}
                    placeholder='{"type": "aircraft", "name": "Fleet-Heavy-Alpha", ...}'
                    class="w-full p-3 bg-gray-950 border border-gray-700 rounded-lg text-white font-mono text-[11px] focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div class="flex justify-end space-x-2 pt-2 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowImportPrompt(false)}
                    class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleImportSubmit}
                    disabled={!importJsonText().trim()}
                    class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow transition-all"
                  >
                    Import & Save
                  </button>
                </div>
              </div>
            </div>
          </Show>

        </div>
      </div>
    </Portal>
  );
};
