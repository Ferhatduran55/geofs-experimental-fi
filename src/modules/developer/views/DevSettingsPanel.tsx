import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import { Portal } from "solid-js/web";
import DeveloperEngine, { type PerformanceStats, type ModuleInfo, type CrashCacheData } from "../DeveloperEngine";
import { type LogEntry } from "../../../shared/Logger";
import Input from "../../../components/Input";
import FilteredWatchlogModal from "./FilteredWatchlogModal";
import Notify from "../../../shared/Notify";

export default function DevSettingsPanel() {
  const [debugMode, setDebugMode] = createSignal(DeveloperEngine.isDebugMode());
  const [maxLogs, setMaxLogs] = createSignal(DeveloperEngine.getMaxLogs());
  const [stats, setStats] = createSignal<PerformanceStats>(DeveloperEngine.getPerformanceStats());
  const [logs, setLogs] = createSignal<LogEntry[]>(DeveloperEngine.getLogs());
  const [modulesList, setModulesList] = createSignal<ModuleInfo[]>(DeveloperEngine.getActiveModulesInfo());
  const [crashCache, setCrashCache] = createSignal<CrashCacheData | null>(DeveloperEngine.getCrashCache());
  const [showLogViewer, setShowLogViewer] = createSignal(false);
  const [selectedLevel, setSelectedLevel] = createSignal<string>("all");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [inspectingModule, setInspectingModule] = createSignal<{ id: string; name: string } | null>(null);

  let timerHandle: number | null = null;

  onMount(() => {
    // Refresh stats and dynamic engine state every 500ms
    timerHandle = window.setInterval(() => {
      setStats(DeveloperEngine.getPerformanceStats());
      setModulesList(DeveloperEngine.getActiveModulesInfo());
      setCrashCache(DeveloperEngine.getCrashCache());
    }, 500);

    const unbind = DeveloperEngine.addChangeListener(() => {
      setDebugMode(DeveloperEngine.isDebugMode());
      setMaxLogs(DeveloperEngine.getMaxLogs());
      setStats(DeveloperEngine.getPerformanceStats());
      setLogs(DeveloperEngine.getLogs());
      setModulesList(DeveloperEngine.getActiveModulesInfo());
      setCrashCache(DeveloperEngine.getCrashCache());
    });

    onCleanup(() => {
      if (timerHandle !== null) clearInterval(timerHandle);
      unbind();
    });
  });

  const handleCopy = async () => {
    const success = await DeveloperEngine.copyDiagnosticJson();
    if (success) {
      Notify.successNow("Diagnostic report copied to clipboard!");
    } else {
      Notify.errorNow("Failed to copy diagnostic report to clipboard.");
    }
  };

  const handleDownload = () => {
    DeveloperEngine.downloadDiagnosticDump();
    Notify.successNow("Diagnostic JSON dump downloaded.");
  };

  const handleClearLogs = () => {
    DeveloperEngine.clearLogs();
    setLogs([]);
    Notify.successNow("Watch logs and bottleneck history cleared.");
  };

  const handleMaxLogsChange = (v: number) => {
    setMaxLogs(v);
    DeveloperEngine.setMaxLogs(v);
  };

  const handleExportCacheJson = () => {
    DeveloperEngine.exportCrashCache("json");
    Notify.successNow("Crash cache exported as JSON.");
  };

  const handleExportCacheTxt = () => {
    DeveloperEngine.exportCrashCache("txt");
    Notify.successNow("Crash cache exported as text.");
  };

  const handleClearCrashCache = () => {
    DeveloperEngine.clearCrashCache();
    setCrashCache(null);
    Notify.successNow("Crash log cache cleared.");
  };

  const filteredLogs = () => {
    let list = logs();
    const level = selectedLevel();
    if (level !== "all") {
      list = list.filter((item) => item.level === level);
    }
    const q = searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter(
        (item) =>
          item.tag.toLowerCase().includes(q) ||
          item.message.toLowerCase().includes(q) ||
          item.timeStr.includes(q)
      );
    }
    return list.slice().reverse(); // newest first
  };

  const getFpsColor = (fps: number) => {
    if (fps >= 45) return "text-emerald-500 dark:text-emerald-400";
    if (fps >= 25) return "text-amber-500 dark:text-amber-400";
    return "text-rose-500 dark:text-rose-400";
  };

  return (
    <div class="mt-4 space-y-4 font-sans text-gray-800 dark:text-gray-200">
      <h3 class="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
        <span class="text-indigo-500">🛠️</span>
        Developer & Diagnostics
      </h3>

      {/* Main Container */}
      <div class="p-3.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/40 space-y-4">
        {/* Debug Mode Toggle */}
        <Input
          type="boolean"
          name="dev_debug_mode"
          label="Verbose Debug Logging"
          value={debugMode()}
          onChange={(v: boolean) => {
            setDebugMode(v);
            DeveloperEngine.setDebugMode(v);
          }}
          notifyMode="none"
          comment="Enables high-resolution console debugging and real-time engine trace logs."
        />

        {/* Live Performance Profiler Metrics Grid */}
        <div class="grid grid-cols-4 gap-2 pt-1">
          <div class="p-2 rounded bg-white/70 dark:bg-gray-800/60 border border-indigo-100 dark:border-gray-700/60 text-center">
            <span class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 block tracking-wider">
              Current FPS
            </span>
            <span class={`text-base font-mono font-extrabold ${getFpsColor(stats().currentFps)}`}>
              {stats().currentFps}
            </span>
          </div>

          <div class="p-2 rounded bg-white/70 dark:bg-gray-800/60 border border-indigo-100 dark:border-gray-700/60 text-center">
            <span class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 block tracking-wider">
              Avg FPS
            </span>
            <span class={`text-base font-mono font-bold ${getFpsColor(stats().avgFps)}`}>
              {stats().avgFps}
            </span>
          </div>

          <div class="p-2 rounded bg-white/70 dark:bg-gray-800/60 border border-indigo-100 dark:border-gray-700/60 text-center">
            <span class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 block tracking-wider">
              Min FPS
            </span>
            <span class={`text-base font-mono font-bold ${getFpsColor(stats().minFps)}`}>
              {stats().minFps}
            </span>
          </div>

          <div class="p-2 rounded bg-white/70 dark:bg-gray-800/60 border border-indigo-100 dark:border-gray-700/60 text-center">
            <span class="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 block tracking-wider">
              Frame Drops
            </span>
            <span
              class={`text-base font-mono font-bold ${
                stats().frameDrops > 0 ? "text-rose-500 dark:text-rose-400" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              {stats().frameDrops}
            </span>
          </div>
        </div>

        {/* Bottleneck Alerts Notice */}
        <Show when={stats().bottleneckCount > 0}>
          <div class="p-2.5 rounded bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
            <span class="text-rose-500 font-bold">⚠️</span>
            <div class="space-y-1 flex-1">
              <span class="font-semibold block">
                {stats().bottleneckCount} performance spike(s) detected during this session:
              </span>
              <ul class="list-disc pl-4 space-y-0.5 text-[11px]">
                <For each={stats().lastBottlenecks.slice(0, 3)}>
                  {(b) => (
                    <li>
                      <span class="font-mono text-gray-500 dark:text-gray-400">[{b.timeStr}]</span> {b.description}
                    </li>
                  )}
                </For>
              </ul>
            </div>
          </div>
        </Show>

        {/* Active Modules Diagnostic Section */}
        <div class="p-3 rounded-lg bg-gray-900/50 border border-indigo-900/40 space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-gray-300 flex items-center gap-1.5">
              <span>📦</span> Active Engine Modules ({modulesList().filter((m) => m.enabled).length}/{modulesList().length})
            </span>
          </div>
          <div class="grid grid-cols-2 gap-1.5">
            <For each={modulesList()}>
              {(m) => {
                const errorCount = () => DeveloperEngine.getModuleErrorCount(m.id);
                return (
                  <div class="flex items-center justify-between px-2 py-1.5 rounded bg-gray-950/60 border border-gray-800 text-[11px] font-mono hover:border-gray-700 transition-colors">
                    <div class="flex items-center gap-1.5 truncate">
                      <span
                        class={`w-2 h-2 rounded-full shrink-0 ${
                          m.enabled ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-gray-600"
                        }`}
                      />
                      <span class="text-gray-200 truncate" title={m.name}>
                        {m.name}
                      </span>
                    </div>

                    <div class="flex items-center gap-1.5 shrink-0 ml-1">
                      <Show when={errorCount() > 0}>
                        <button
                          type="button"
                          onClick={() => setInspectingModule({ id: m.id, name: m.name })}
                          class="flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/80 text-[10px] font-bold animate-pulse transition-colors"
                          title={`Click to inspect ${errorCount()} error(s) in ${m.name}`}
                        >
                          <span>⚠️</span>
                          <span>{errorCount()}</span>
                        </button>
                      </Show>
                      <button
                        type="button"
                        onClick={() => setInspectingModule({ id: m.id, name: m.name })}
                        class="text-[9px] text-gray-500 hover:text-indigo-300 font-mono transition-colors"
                        title="View Module Diagnostic Logs"
                      >
                        [Trace]
                      </button>
                      <span class="text-[9px] text-gray-500">v{m.version}</span>
                    </div>
                  </div>
                );
              }}
            </For>
          </div>
        </div>

        {/* Log Buffer Limit Slider */}
        <Input
          type="range"
          name="max_logs"
          label="Log Buffer Limit"
          comment="Maximum log entries retained in memory before rotating (100 - 10,000)"
          min={100}
          max={10000}
          step={100}
          value={maxLogs()}
          onChange={(v: number) => handleMaxLogsChange(v)}
          notifyMode="none"
          unit="lines"
          showLimits={true}
        />

        {/* Crash & Session Cache Manager */}
        <Show when={crashCache()}>
          {(cache) => (
            <div class="p-3 rounded-lg bg-amber-950/30 border border-amber-800/50 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-bold text-amber-300 flex items-center gap-1.5">
                  <span>🛡️</span> Crash/Shutdown Log Cache Available
                </span>
                <span class="text-[10px] font-mono text-amber-400 bg-amber-900/50 px-2 py-0.5 rounded">
                  {cache().logs.length} logs cached
                </span>
              </div>
              <p class="text-[11px] text-gray-400 truncate" title={cache().reason}>
                Recorded at {cache().timeStr}: {cache().reason || "Session termination"}
              </p>
              <div class="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleExportCacheJson}
                  class="flex-1 px-2.5 py-1.5 rounded bg-amber-700 hover:bg-amber-600 text-white font-medium text-[11px] transition-colors flex items-center justify-center gap-1"
                >
                  <span>📥</span> Export JSON
                </button>
                <button
                  type="button"
                  onClick={handleExportCacheTxt}
                  class="flex-1 px-2.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-amber-200 border border-amber-700/60 font-medium text-[11px] transition-colors flex items-center justify-center gap-1"
                >
                  <span>📄</span> Export TXT
                </button>
                <button
                  type="button"
                  onClick={handleClearCrashCache}
                  class="px-2.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-rose-300 border border-rose-800/60 font-medium text-[11px] transition-colors"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          )}
        </Show>

        {/* Action Buttons */}
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopy}
            class="px-3 py-2 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors font-medium flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>📋</span> Copy Diagnostic JSON
          </button>

          <button
            type="button"
            onClick={handleDownload}
            class="px-3 py-2 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-md transition-colors font-medium flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          >
            <span>💾</span> Download Dump (.json)
          </button>

          <button
            type="button"
            onClick={() => setShowLogViewer(!showLogViewer())}
            class="px-3 py-2 text-xs bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md transition-colors font-medium flex items-center justify-center gap-1.5 border border-gray-300 dark:border-gray-700 active:scale-95"
          >
            <span>{showLogViewer() ? "🔼" : "👁️"}</span>{" "}
            {showLogViewer() ? "Hide Watch Logs" : `Watch Logs (${logs().length})`}
          </button>

          <button
            type="button"
            onClick={handleClearLogs}
            class="px-3 py-2 text-xs bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md transition-colors font-medium flex items-center justify-center gap-1.5 border border-gray-300 dark:border-gray-700 active:scale-95"
          >
            <span>🗑️</span> Clear Logs
          </button>
        </div>

        {/* Expandable Monospace Watch Log Viewer */}
        <Show when={showLogViewer()}>
          <div class="pt-2 border-t border-indigo-200/70 dark:border-indigo-900/50 space-y-2">
            {/* Filter Bar */}
            <div class="flex items-center gap-2">
              <select
                value={selectedLevel()}
                onChange={(e) => setSelectedLevel(e.currentTarget.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                class="px-2 py-1 text-xs rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-sans"
              >
                <option value="all">All Levels</option>
                <option value="error">Errors Only</option>
                <option value="warn">Warnings</option>
                <option value="info">Info</option>
                <option value="debug">Debug</option>
              </select>

              <input
                type="text"
                placeholder="Search logs..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                onKeyPress={(e) => e.stopPropagation()}
                class="flex-1 px-2.5 py-1 text-xs rounded bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 placeholder-gray-400 font-sans focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Monospace Scroll Window with Clear Badges & Clean Wrapping */}
            <div class="h-64 overflow-y-auto rounded-lg bg-gray-950 p-2.5 text-[11px] font-mono border border-gray-800 space-y-1.5 shadow-inner select-text custom-scrollbar">
              <Show
                when={filteredLogs().length > 0}
                fallback={
                  <div class="text-gray-500 text-center py-10">
                    No logs matching criteria
                  </div>
                }
              >
                <For each={filteredLogs()}>
                  {(entry) => {
                    const badgeStyles = () => {
                      switch (entry.level) {
                        case "error":
                          return "bg-rose-950/80 text-rose-300 border border-rose-800/80 font-black";
                        case "warn":
                          return "bg-amber-950/80 text-amber-300 border border-amber-800/80 font-bold";
                        case "info":
                          return "bg-sky-950/80 text-sky-300 border border-sky-800/80";
                        case "debug":
                          return "bg-purple-950/80 text-purple-300 border border-purple-800/80";
                        default:
                          return "bg-gray-900 text-gray-300 border border-gray-700";
                      }
                    };

                    return (
                      <div class="leading-relaxed hover:bg-gray-900/70 px-2 py-1.5 rounded-md flex items-start gap-2 border border-gray-900/40">
                        <span class="text-gray-500 shrink-0 select-none text-[10px]">
                          [{entry.timeStr}]
                        </span>
                        <span
                          class={`uppercase shrink-0 w-14 text-center text-[9px] px-1.5 py-0.5 rounded ${badgeStyles()}`}
                        >
                          {entry.level}
                        </span>
                        <span class="text-indigo-400 font-semibold shrink-0">
                          [{entry.tag}]
                        </span>
                        <span class="text-gray-200 flex-1 whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                          {entry.message}
                        </span>
                      </div>
                    );
                  }}
                </For>
              </Show>
            </div>
          </div>
        </Show>
      </div>

      {/* Filtered Module Diagnostics Watchlog Modal */}
      <Show when={inspectingModule()}>
        {(m) => (
          <Portal mount={document.body}>
            <FilteredWatchlogModal
              moduleId={m().id}
              moduleName={m().name}
              onClose={() => setInspectingModule(null)}
            />
          </Portal>
        )}
      </Show>
    </div>
  );
}
