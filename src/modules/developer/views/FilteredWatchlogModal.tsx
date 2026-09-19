import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import { DeveloperEngine } from "../DeveloperEngine";
import type { LogEntry } from "../../../shared/Logger";
import Notify from "../../../shared/Notify";

export interface FilteredWatchlogModalProps {
  moduleId: string;
  moduleName: string;
  onClose: () => void;
}

export function FilteredWatchlogModal(props: FilteredWatchlogModalProps) {
  const [filterLevel, setFilterLevel] = createSignal<"all" | "errors" | "warnings">("all");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [logs, setLogs] = createSignal<LogEntry[]>([]);
  const [errorCount, setErrorCount] = createSignal(0);

  const refresh = () => {
    setLogs(DeveloperEngine.getModuleLogs(props.moduleId));
    setErrorCount(DeveloperEngine.getModuleErrorCount(props.moduleId));
  };

  onMount(() => {
    refresh();
    const unbind = DeveloperEngine.addChangeListener(refresh);
    onCleanup(unbind);
  });

  const filteredLogs = () => {
    let list = logs();
    if (filterLevel() === "errors") {
      list = list.filter((l) => l.level === "error");
    } else if (filterLevel() === "warnings") {
      list = list.filter((l) => l.level === "warn" || l.level === "error");
    }

    const q = searchQuery().trim().toLowerCase();
    if (q) {
      list = list.filter((l) => l.message.toLowerCase().includes(q) || l.tag.toLowerCase().includes(q));
    }
    return list;
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "error":
        return <span class="bg-rose-950/80 text-rose-400 border border-rose-800 px-1.5 py-0.2 rounded text-[9px] font-bold">ERROR</span>;
      case "warn":
        return <span class="bg-amber-950/80 text-amber-400 border border-amber-800 px-1.5 py-0.2 rounded text-[9px] font-bold">WARN</span>;
      case "info":
        return <span class="bg-blue-950/80 text-blue-400 border border-blue-800 px-1.5 py-0.2 rounded text-[9px] font-bold">INFO</span>;
      default:
        return <span class="bg-gray-800 text-gray-400 border border-gray-700 px-1.5 py-0.2 rounded text-[9px] font-bold">DEBUG</span>;
    }
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(filteredLogs(), null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `module_logs_${props.moduleId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    Notify.successNow(`Exported ${filteredLogs().length} logs for ${props.moduleName}`);
  };

  const handleTriggerTestError = () => {
    DeveloperEngine.triggerMockError(props.moduleId, `Manual diagnostic check on ${props.moduleName}`);
    Notify.warning(`Triggered mock exception in ${props.moduleName}`, "Diagnostics");
  };

  const handleClearErrors = () => {
    DeveloperEngine.clearModuleErrors(props.moduleId);
    Notify.infoNow(`Cleared error counter for ${props.moduleName}`);
  };

  return (
    <div class="fixed inset-0 z-[100000] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div class="bg-gray-900 border border-gray-700/80 rounded-2xl w-[94vw] max-w-4xl h-[88vh] flex flex-col shadow-2xl overflow-hidden text-gray-100">
        {/* Header Bar */}
        <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 border-b border-gray-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-xl shadow-lg">
              🔍
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-bold text-white text-base">Module Diagnostics: {props.moduleName}</h3>
                <span class="px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-gray-800 text-gray-300 border border-gray-700">
                  {props.moduleId}
                </span>
                <Show when={errorCount() > 0}>
                  <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-rose-900/60 text-rose-300 border border-rose-700/60 flex items-center gap-1 animate-pulse">
                    <span>⚠️</span>
                    <span>{errorCount()} Errors Logged</span>
                  </span>
                </Show>
              </div>
              <p class="text-xs text-gray-400">
                Isolated runtime trace, exception stream and call stacks for this module
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={props.onClose}
            class="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
            title="Close Diagnostics"
          >
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-gray-800/40 border-b border-gray-800 text-xs">
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setFilterLevel("all")}
              class={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterLevel() === "all" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              All Logs ({logs().length})
            </button>
            <button
              type="button"
              onClick={() => setFilterLevel("errors")}
              class={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterLevel() === "errors" ? "bg-rose-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Errors Only ({logs().filter((l) => l.level === "error").length})
            </button>
            <button
              type="button"
              onClick={() => setFilterLevel("warnings")}
              class={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                filterLevel() === "warnings" ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Warnings & Errors ({logs().filter((l) => l.level === "warn" || l.level === "error").length})
            </button>
          </div>

          <div class="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search module log text..."
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              onKeyDown={(e) => e.stopPropagation()}
              onKeyUp={(e) => e.stopPropagation()}
              onKeyPress={(e) => e.stopPropagation()}
              class="px-3 py-1 bg-gray-900 border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 w-44"
            />
            <button
              type="button"
              onClick={handleTriggerTestError}
              class="px-2.5 py-1 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-800/80 font-bold transition-all"
              title="Dispatches a synthetic mock exception for testing"
            >
              🧪 Trigger Mock Error
            </button>
            <button
              type="button"
              onClick={handleClearErrors}
              class="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium transition-all"
            >
              Clear Errors
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              class="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 text-indigo-300 border border-indigo-800 font-medium transition-all"
            >
              Export JSON
            </button>
          </div>
        </div>

        {/* Log Viewer Container */}
        <div class="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-950 font-mono text-xs">
          <Show
            when={filteredLogs().length > 0}
            fallback={
              <div class="text-center py-20 text-gray-500 space-y-2">
                <div class="text-3xl">🛡️</div>
                <p class="font-medium">No log entries found matching criteria for module {props.moduleId}.</p>
                <p class="text-[11px] text-gray-600">The module is running without any isolated diagnostic incidents.</p>
              </div>
            }
          >
            <For each={filteredLogs()}>
              {(logEntry) => (
                <div class={`p-2.5 rounded-lg border text-[11px] space-y-1.5 transition-all ${
                  logEntry.level === "error"
                    ? "bg-rose-950/20 border-rose-900/60 text-rose-200"
                    : logEntry.level === "warn"
                    ? "bg-amber-950/20 border-amber-900/60 text-amber-200"
                    : "bg-gray-900/70 border-gray-800 text-gray-300"
                }`}>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <span class="text-gray-500 font-mono text-[10px]">[{logEntry.timeStr}]</span>
                      {getLevelBadge(logEntry.level)}
                      <span class="text-indigo-400 font-bold">[{logEntry.tag}]</span>
                    </div>
                    <span class="text-gray-600 text-[9px] font-mono">{logEntry.id}</span>
                  </div>
                  <div class="whitespace-pre-wrap break-all pl-1 leading-relaxed">
                    {logEntry.message}
                  </div>
                </div>
              )}
            </For>
          </Show>
        </div>

        {/* Footer */}
        <div class="px-6 py-3 bg-gray-950 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400">
          <span>Showing {filteredLogs().length} of {logs().length} module entries</span>
          <button
            type="button"
            onClick={props.onClose}
            class="px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilteredWatchlogModal;
