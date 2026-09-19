import Logger, { type LogEntry } from "../../shared/Logger";
import Storage from "../../shared/Storage";
import { CoreEngine } from "../../core/CoreEngine";

const log = Logger.create("DeveloperEngine");

export interface BottleneckIncident {
  timestamp: number;
  timeStr: string;
  deltaMs: number;
  fps: number;
  description: string;
}

export interface PerformanceStats {
  currentFps: number;
  avgFps: number;
  minFps: number;
  frameDrops: number;
  bottleneckCount: number;
  lastBottlenecks: BottleneckIncident[];
}

export interface ModuleInfo {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
}

export interface DiagnosticSnapshot {
  meta: {
    appName: string;
    version: string;
    exportTime: string;
    userAgent: string;
    url: string;
  };
  environment: {
    geofsVersion: string;
    aircraft: {
      id?: number | string;
      name?: string;
      lla?: [number, number, number];
      heading?: number;
      groundSpeedKts?: number;
      altitudeFt?: number;
      fps?: number;
    };
    multiplayer: {
      totalUsers: number;
      visibleUsers: number;
    };
    display: {
      innerWidth: number;
      innerHeight: number;
      devicePixelRatio: number;
    };
  };
  performance: PerformanceStats;
  modules: {
    registered: string[];
    enabled: string[];
  };
  recentLogs: LogEntry[];
}

export interface CrashCacheData {
  timestamp: number;
  timeStr: string;
  reason?: string;
  logs: LogEntry[];
}

export class DeveloperEngine {
  private static isInitialized = false;
  private static debugMode = false;
  private static maxLogs = 500;
  private static recentLogs: LogEntry[] = [];
  private static bottleneckIncidents: BottleneckIncident[] = [];
  private static listeners: Set<() => void> = new Set();

  // Performance tracking
  private static frameCount = 0;
  private static lastFrameTime = performance.now();
  private static lastFpsCheckTime = performance.now();
  private static currentFps = 60;
  private static fpsSamples: number[] = [];
  private static minFpsObserved = 60;
  private static frameDropCounter = 0;
  private static perfLoopHandle: number | null = null;
  private static unbindLoggerListener: (() => void) | null = null;

  private static moduleErrors: Map<string, number> = new Map();

  static async init(): Promise<void> {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // Load debug mode
    const savedDebug = await Storage.get("dev_debug_mode");
    if (typeof savedDebug === "boolean") {
      this.debugMode = savedDebug;
      Logger.setDevMode(savedDebug);
    }

    // Load log limit setting
    const savedMaxLogs = await Storage.get("dev_max_logs");
    if (typeof savedMaxLogs === "number" && savedMaxLogs >= 100 && savedMaxLogs <= 10000) {
      this.maxLogs = savedMaxLogs;
    }

    // Subscribe to Logger
    this.unbindLoggerListener = Logger.addListener((entry) => {
      this.recordLog(entry);
    });

    // Subscribe to CoreEngine module error events
    try {
      CoreEngine.instance.eventBus.on("module:error", (data) => {
        this.recordModuleError(data.moduleId, data.error);
      });
    } catch {}

    // Capture global unhandled exceptions, rejections & beforeunload
    window.addEventListener("error", this.handleGlobalError);
    window.addEventListener("unhandledrejection", this.handleUnhandledRejection);
    window.addEventListener("beforeunload", this.handleBeforeUnload);

    // Start performance profiler
    this.startPerformanceMonitoring();

    log.info("Developer & Diagnostics Engine initialized.");
  }

  static getModuleErrorCount(moduleId: string): number {
    return this.moduleErrors.get(moduleId.toLowerCase()) || 0;
  }

  static recordModuleError(moduleId: string, _error?: any): void {
    const key = moduleId.toLowerCase();
    const count = this.moduleErrors.get(key) || 0;
    this.moduleErrors.set(key, count + 1);
    this.notifyChange();
  }

  static clearModuleErrors(moduleId: string): void {
    this.moduleErrors.delete(moduleId.toLowerCase());
    this.notifyChange();
  }

  static getModuleLogs(moduleId: string): LogEntry[] {
    const target = moduleId.toLowerCase();
    return this.recentLogs.filter((l) => {
      const tag = l.tag.toLowerCase();
      const msg = l.message.toLowerCase();
      return (
        tag === target ||
        tag.includes(target) ||
        target.includes(tag) ||
        (target === "career" && (tag.includes("career") || tag.includes("flightstate"))) ||
        (target === "definitions" && tag.includes("definition")) ||
        (target === "engines" && tag.includes("engine") && !tag.includes("market") && !tag.includes("transport")) ||
        (target === "market" && tag.includes("market")) ||
        (target === "transport" && tag.includes("transport")) ||
        (target === "radar" && tag.includes("radar")) ||
        (target === "fuel" && tag.includes("fuel")) ||
        (target === "markers" && tag.includes("marker")) ||
        msg.includes(`[${target}]`)
      );
    });
  }

  static triggerMockError(moduleId: string, message: string = "Simulated synthetic test exception"): void {
    const errorMsg = `[MOCK_EXCEPTION] ${message} in module ${moduleId}`;
    const syntheticStack = `Error: ${errorMsg}\n    at DeveloperEngine.triggerMockError (DeveloperEngine.ts:180:12)\n    at Object.test (DevSettingsPanel.tsx:210:9)`;
    log.error(`[${moduleId}] ${errorMsg}\n${syntheticStack}`);
    this.recordModuleError(moduleId, errorMsg);
  }

  static isDebugMode(): boolean {
    return this.debugMode;
  }

  static setDebugMode(enabled: boolean): void {
    this.debugMode = enabled;
    Logger.setDevMode(enabled);
    Storage.write("dev_debug_mode", enabled);
    this.notifyChange();
  }

  static getMaxLogs(): number {
    return this.maxLogs;
  }

  static setMaxLogs(limit: number): void {
    const clamped = Math.max(100, Math.min(10000, Math.round(limit)));
    this.maxLogs = clamped;
    Storage.write("dev_max_logs", clamped);
    if (this.recentLogs.length > clamped) {
      this.recentLogs = this.recentLogs.slice(-clamped);
    }
    this.notifyChange();
  }

  static addChangeListener(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private static notifyChange(): void {
    for (const listener of this.listeners) {
      try {
        listener();
      } catch {}
    }
  }

  static recordLog(entry: LogEntry): void {
    this.recentLogs.push(entry);
    if (this.recentLogs.length > this.maxLogs) {
      this.recentLogs.shift();
    }

    if (entry.level === "error") {
      const tag = entry.tag.toLowerCase();
      let matchedModuleId: string | null = null;
      if (tag.includes("career") || tag.includes("flightstate")) matchedModuleId = "career";
      else if (tag.includes("market")) matchedModuleId = "market";
      else if (tag.includes("transport")) matchedModuleId = "transport";
      else if (tag.includes("radar")) matchedModuleId = "radar";
      else if (tag.includes("fuel")) matchedModuleId = "fuel";
      else if (tag.includes("marker")) matchedModuleId = "markers";
      else if (tag.includes("definition")) matchedModuleId = "definitions";
      else if (tag.includes("engine") && !tag.includes("developer")) matchedModuleId = "engines";
      else if (tag.includes("dev")) matchedModuleId = "developer";

      if (matchedModuleId) {
        const count = this.moduleErrors.get(matchedModuleId) || 0;
        this.moduleErrors.set(matchedModuleId, count + 1);
      }
    }

    this.notifyChange();
  }

  static getLogs(): LogEntry[] {
    return [...this.recentLogs];
  }

  static clearLogs(): void {
    this.recentLogs = [];
    this.bottleneckIncidents = [];
    this.frameDropCounter = 0;
    this.minFpsObserved = this.currentFps;
    this.notifyChange();
  }

  // Crash & Session cache management (localStorage)
  private static readonly CRASH_CACHE_KEY = "efi_crash_log_cache";

  private static saveCrashSnapshot(reason: string): void {
    try {
      const data: CrashCacheData = {
        timestamp: Date.now(),
        timeStr: new Date().toLocaleTimeString(),
        reason,
        logs: this.recentLogs.slice(-200),
      };
      localStorage.setItem(this.CRASH_CACHE_KEY, JSON.stringify(data));
    } catch {}
  }

  static getCrashCache(): CrashCacheData | null {
    try {
      const raw = localStorage.getItem(this.CRASH_CACHE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static clearCrashCache(): void {
    try {
      localStorage.removeItem(this.CRASH_CACHE_KEY);
      this.notifyChange();
    } catch {}
  }

  static exportCrashCache(format: "json" | "txt" = "json"): void {
    const cache = this.getCrashCache();
    if (!cache) return;

    let content = "";
    let mime = "application/json";
    let filename = `geofs-efi-crash-logs-${cache.timestamp}.${format}`;

    if (format === "json") {
      content = JSON.stringify(cache, null, 2);
    } else {
      mime = "text/plain";
      content = `GeoFS Flight Assistant - Crash / Shutdown Log Dump\n`;
      content += `Timestamp: ${new Date(cache.timestamp).toISOString()} (${cache.timeStr})\n`;
      content += `Reason: ${cache.reason || "Unknown"}\n`;
      content += `Total Logs Captured: ${cache.logs.length}\n`;
      content += `--------------------------------------------------------\n\n`;
      cache.logs.forEach((l) => {
        content += `[${l.timeStr}] [${l.level.toUpperCase()}] [${l.tag}] ${l.message}\n`;
      });
    }

    try {
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      log.error("Failed to export crash cache:", e);
    }
  }

  private static handleBeforeUnload = () => {
    this.saveCrashSnapshot("Window beforeunload (Normal Shutdown / Refresh)");
  };

  private static handleGlobalError = (event: ErrorEvent) => {
    const timeStr = new Date().toTimeString().split(" ")[0];
    const message = event.error?.stack || event.message || "Unknown error";
    const fullMsg = `${event.filename ? `${event.filename}:${event.lineno}:${event.colno} - ` : ""}${message}`;
    this.recordLog({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      timeStr,
      level: "error",
      tag: "GlobalRuntime",
      message: fullMsg,
    });
    this.saveCrashSnapshot(`Runtime Exception: ${fullMsg}`);
  };

  private static handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const timeStr = new Date().toTimeString().split(" ")[0];
    const reason = event.reason instanceof Error ? `${event.reason.message}\n${event.reason.stack}` : String(event.reason);
    this.recordLog({
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      timeStr,
      level: "error",
      tag: "UnhandledPromise",
      message: reason,
    });
    this.saveCrashSnapshot(`Unhandled Promise Rejection: ${reason}`);
  };

  private static startPerformanceMonitoring(): void {
    const tick = (now: number) => {
      this.frameCount++;
      const deltaMs = now - this.lastFrameTime;
      this.lastFrameTime = now;

      // Detect severe hitch / frame drop (> 85ms is equivalent to < 11 FPS)
      if (deltaMs > 85 && this.frameCount > 10) {
        this.frameDropCounter++;
        const instFps = Math.round(1000 / deltaMs);
        const incident: BottleneckIncident = {
          timestamp: Date.now(),
          timeStr: new Date().toTimeString().split(" ")[0],
          deltaMs: Math.round(deltaMs),
          fps: instFps,
          description: `Stutter spike: frame took ${Math.round(deltaMs)}ms (~${instFps} FPS)`,
        };
        this.bottleneckIncidents.push(incident);
        if (this.bottleneckIncidents.length > 25) this.bottleneckIncidents.shift();
      }

      // Compute FPS every 500ms
      if (now - this.lastFpsCheckTime >= 500) {
        const elapsed = (now - this.lastFpsCheckTime) / 1000;
        this.currentFps = Math.round(this.frameCount / elapsed);
        this.frameCount = 0;
        this.lastFpsCheckTime = now;

        this.fpsSamples.push(this.currentFps);
        if (this.fpsSamples.length > 60) this.fpsSamples.shift();

        if (this.currentFps > 0 && this.currentFps < this.minFpsObserved) {
          this.minFpsObserved = this.currentFps;
        }
      }

      this.perfLoopHandle = requestAnimationFrame(tick);
    };

    this.perfLoopHandle = requestAnimationFrame(tick);
  }

  static getPerformanceStats(): PerformanceStats {
    const avg =
      this.fpsSamples.length > 0
        ? Math.round(this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length)
        : this.currentFps;

    return {
      currentFps: this.currentFps,
      avgFps: avg,
      minFps: this.minFpsObserved,
      frameDrops: this.frameDropCounter,
      bottleneckCount: this.bottleneckIncidents.length,
      lastBottlenecks: [...this.bottleneckIncidents].reverse().slice(0, 10),
    };
  }

  static getActiveModulesInfo(): ModuleInfo[] {
    const core = CoreEngine.instance;
    if (!core?.modules) return [];
    try {
      const all = core.modules.getAll();
      return all.map((m) => ({
        id: m.id,
        name: m.name,
        version: m.version,
        enabled: core.modules.isEnabled(m.id),
      }));
    } catch {
      return [];
    }
  }

  static generateSnapshot(): DiagnosticSnapshot {
    const win: any = typeof unsafeWindow !== "undefined" ? unsafeWindow : typeof window !== "undefined" ? window : globalThis;
    const geofs = win?.geofs;
    const multiplayer = win?.multiplayer;
    const aircraftInstance = geofs?.aircraft?.instance;
    const lla = aircraftInstance?.llaLocation ? ([...aircraftInstance.llaLocation] as [number, number, number]) : undefined;

    const core = CoreEngine.instance || win?.__efiCore;
    const registeredModules: string[] = [];
    const enabledModules: string[] = [];

    if (core?.modules?.getAll) {
      try {
        const all = core.modules.getAll();
        for (const m of all) {
          registeredModules.push(m.id);
          if (core.modules.isEnabled(m.id)) enabledModules.push(m.id);
        }
      } catch {}
    }

    let totalUsers = 0;
    let visibleUsers = 0;
    if (multiplayer?.users) totalUsers = Object.keys(multiplayer.users).length;
    if (multiplayer?.visibleUsers) visibleUsers = Object.keys(multiplayer.visibleUsers).length;

    const groundSpeed = geofs?.animation?.values?.groundSpeed || 0;
    const groundSpeedKts = Math.round(groundSpeed * 1.94384);
    const altitudeFt = Math.round((geofs?.animation?.values?.altitude || 0) * 3.28084);
    const heading = Math.round(geofs?.animation?.values?.heading || 0);

    return {
      meta: {
        appName: "GeoFS Enhanced Flight Interface",
        version: "1.0.0-beta.4",
        exportTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      },
      environment: {
        geofsVersion: geofs?.version || "v4",
        aircraft: {
          id: aircraftInstance?.aircraftRecord?.id || aircraftInstance?.aircraftId,
          name: aircraftInstance?.aircraftRecord?.name || geofs?.aircraft?.instance?.name,
          lla,
          heading,
          groundSpeedKts,
          altitudeFt,
          fps: geofs?.fps,
        },
        multiplayer: {
          totalUsers,
          visibleUsers,
        },
        display: {
          innerWidth: window.innerWidth,
          innerHeight: window.innerHeight,
          devicePixelRatio: window.devicePixelRatio,
        },
      },
      performance: this.getPerformanceStats(),
      modules: {
        registered: registeredModules,
        enabled: enabledModules,
      },
      recentLogs: this.getLogs(),
    };
  }

  static getDiagnosticJson(pretty: boolean = true): string {
    const snap = this.generateSnapshot();
    return JSON.stringify(snap, null, pretty ? 2 : 0);
  }

  static async copyDiagnosticJson(): Promise<boolean> {
    try {
      const json = this.getDiagnosticJson(true);
      await navigator.clipboard.writeText(json);
      return true;
    } catch (e) {
      log.error("Failed to copy diagnostic JSON:", e);
      return false;
    }
  }

  static downloadDiagnosticDump(): void {
    try {
      const json = this.getDiagnosticJson(true);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      a.href = url;
      a.download = `geofs-efi-diagnostics-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      log.error("Failed to download diagnostic dump:", e);
    }
  }

  static destroy(): void {
    if (this.perfLoopHandle !== null) {
      cancelAnimationFrame(this.perfLoopHandle);
      this.perfLoopHandle = null;
    }
    if (this.unbindLoggerListener) {
      this.unbindLoggerListener();
      this.unbindLoggerListener = null;
    }
    window.removeEventListener("error", this.handleGlobalError);
    window.removeEventListener("unhandledrejection", this.handleUnhandledRejection);
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
    this.isInitialized = false;
  }
}

export default DeveloperEngine;
