import { describe, it, expect, beforeEach, vi } from "vitest";
import ConfigurationManager, {
  type AircraftProfile,
} from "../modules/settings/ConfigurationManager";
import Storage from "../shared/Storage";

describe("ConfigurationManager & Profiling", () => {
  let mockStore: Record<string, any> = {};

  beforeEach(() => {
    mockStore = {};
    Storage.clearCache();
    (globalThis as any).GM = {
      setValue: vi.fn((key: string, val: any) => {
        mockStore[key] = val;
      }),
      getValue: vi.fn((key: string, defVal: any) => {
        return Promise.resolve(mockStore[key] !== undefined ? mockStore[key] : defVal);
      }),
      deleteValue: vi.fn((key: string) => {
        delete mockStore[key];
      }),
      listValues: vi.fn(() => Promise.resolve(Object.keys(mockStore))),
    };

    (globalThis as any).unsafeWindow = {
      geofs: {
        aircraft: {
          instance: {
            id: 10,
            definition: {
              name: "Airbus A380",
              mass: 400000,
              dragFactor: 0.8,
            },
            engines: [
              { name: "Engine 1", thrust: 520000, maxRPM: 20000 },
              { name: "Engine 2", thrust: 520000, maxRPM: 20000 },
            ],
          },
        },
      },
    };
  });

  it("should generate creative auto-names for both profile types", () => {
    const acName = ConfigurationManager.generateAutoName("aircraft", "Airbus A380");
    expect(typeof acName).toBe("string");
    expect(acName.length).toBeGreaterThan(5);

    const globalName = ConfigurationManager.generateAutoName("global");
    expect(typeof globalName).toBe("string");
    expect(globalName).toMatch(/^Config-[A-Za-z]+-\d{4}-\d{2}$/);
  });

  it("should save and retrieve aircraft profiles", async () => {
    const profile = await ConfigurationManager.saveAircraftProfile("Custom A380 High Thrust", "Test notes");
    expect(profile).toBeDefined();
    expect(profile?.name).toBe("Custom A380 High Thrust");
    expect(profile?.aircraftName).toBe("Airbus A380");
    expect(profile?.summary.enginesCount).toBe(2);
    expect(profile?.summary.maxThrust).toBe(520000);

    const profiles = await ConfigurationManager.getAircraftProfiles();
    expect(profiles.length).toBe(1);
    expect(profiles[0].id).toBe(profile?.id);
  });

  it("should save and retrieve global profiles with active module states", async () => {
    const globalProfile = await ConfigurationManager.saveGlobalProfile("My Suite", "Global notes");
    expect(globalProfile).toBeDefined();
    expect(globalProfile?.name).toBe("My Suite");
    expect(globalProfile?.type).toBe("global");
    expect(globalProfile?.summary).toBeDefined();

    const profiles = await ConfigurationManager.getGlobalProfiles();
    expect(profiles.length).toBe(1);
    expect(profiles[0].name).toBe("My Suite");
  });

  it("should export and import profile JSON accurately", async () => {
    const mockProfile: AircraftProfile = {
      id: "ac_test_123",
      name: "Exported-Fleet-Falcon",
      type: "aircraft",
      aircraftId: 10,
      aircraftName: "Airbus A380",
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: "1.0.0",
      definition: { mass: 400000 },
      engines: [{ index: 0, name: "Engine 1", data: { thrust: 520000 } }],
      summary: { definitionPropsCount: 1, enginesCount: 1, maxThrust: 520000 },
    };

    const json = ConfigurationManager.exportProfileJson(mockProfile);
    expect(typeof json).toBe("string");
    expect(json).toContain("Exported-Fleet-Falcon");

    const imported = await ConfigurationManager.importProfileJson(json);
    expect(imported).toBeDefined();
    expect(imported?.name).toBe("Exported-Fleet-Falcon");
    expect(imported?.type).toBe("aircraft");

    const list = await ConfigurationManager.getAircraftProfiles();
    expect(list.some((p) => p.name === "Exported-Fleet-Falcon")).toBe(true);
  });

  it("should delete profiles cleanly", async () => {
    const profile = await ConfigurationManager.saveAircraftProfile("To Delete");
    expect(profile).toBeDefined();

    let list = await ConfigurationManager.getAircraftProfiles();
    expect(list.length).toBe(1);

    await ConfigurationManager.deleteProfile(profile!.id, "aircraft");
    list = await ConfigurationManager.getAircraftProfiles();
    expect(list.length).toBe(0);
  });
});
