import { describe, it, expect, beforeEach, vi } from "vitest";
import DeveloperEngine from "../modules/developer/DeveloperEngine";
import Logger from "../shared/Logger";

describe("DeveloperEngine & Diagnostics", () => {
  beforeEach(async () => {
    // Mock GM for testing Storage operations
    (globalThis as any).GM = {
      setValue: vi.fn(),
      getValue: vi.fn().mockResolvedValue(null),
      deleteValue: vi.fn(),
      listValues: vi.fn().mockResolvedValue([]),
    };
    DeveloperEngine.clearLogs();
  });

  it("should record log entries dispatched from Logger", () => {
    // Clear and check initial state
    DeveloperEngine.clearLogs();
    expect(DeveloperEngine.getLogs().length).toBe(0);

    // Directly record an entry
    DeveloperEngine.recordLog({
      id: "test1",
      timestamp: Date.now(),
      timeStr: "12:00:00",
      level: "info",
      tag: "TestScope",
      message: "Unit test message",
    });

    const logs = DeveloperEngine.getLogs();
    expect(logs.length).toBe(1);
    expect(logs[0].message).toBe("Unit test message");
    expect(logs[0].level).toBe("info");
    expect(logs[0].tag).toBe("TestScope");
  });

  it("should generate complete diagnostic snapshot structure", () => {
    const snapshot = DeveloperEngine.generateSnapshot();

    expect(snapshot).toBeDefined();
    expect(snapshot.meta.appName).toContain("GeoFS");
    expect(snapshot.meta.exportTime).toBeDefined();
    expect(snapshot.environment).toBeDefined();
    expect(snapshot.performance).toBeDefined();
    expect(typeof snapshot.performance.currentFps).toBe("number");
    expect(typeof snapshot.performance.avgFps).toBe("number");
    expect(Array.isArray(snapshot.recentLogs)).toBe(true);
  });

  it("should produce valid JSON string for export", () => {
    const jsonStr = DeveloperEngine.getDiagnosticJson(true);
    expect(typeof jsonStr).toBe("string");

    const parsed = JSON.parse(jsonStr);
    expect(parsed.meta).toBeDefined();
    expect(parsed.performance).toBeDefined();
  });

  it("should support debug mode toggle", () => {
    DeveloperEngine.setDebugMode(true);
    expect(DeveloperEngine.isDebugMode()).toBe(true);
    expect(Logger.isDevMode()).toBe(true);

    DeveloperEngine.setDebugMode(false);
    expect(DeveloperEngine.isDebugMode()).toBe(false);
    expect(Logger.isDevMode()).toBe(false);
  });

  it("should clear logs correctly", () => {
    DeveloperEngine.recordLog({
      id: "abc",
      timestamp: Date.now(),
      timeStr: "12:00:00",
      level: "warn",
      tag: "WarnScope",
      message: "Warning text",
    });

    expect(DeveloperEngine.getLogs().length).toBeGreaterThan(0);
    DeveloperEngine.clearLogs();
    expect(DeveloperEngine.getLogs().length).toBe(0);
  });
});
