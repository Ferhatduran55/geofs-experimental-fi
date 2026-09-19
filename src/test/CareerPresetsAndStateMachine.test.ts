import { describe, it, expect, beforeEach } from "vitest";
import { getAircraftTransportPreset, findAircraftGroup } from "../assets/json/AircraftTransportDefs";
import { getAircraftFuelPreset } from "../assets/json/AircraftFuelDefs";
import { isValidIcaoCode } from "../modules/career/AirportDatabase";
import { FlightStateMachine, FlightState } from "../modules/career/FlightStateMachine";
import { EventBus } from "../core/EventBus";

describe("Career Presets & Heuristics", () => {
  it("should accurately identify ID 5 as Embraer Phenom 100 (not Boeing 777)", () => {
    const transportPreset = getAircraftTransportPreset("5");
    expect(transportPreset.name).toContain("Phenom");
    expect(transportPreset.category).toBe("VIP");
    expect(transportPreset.maxPassengers).toBe(5);
    expect(transportPreset.maxPassengers).not.toBe(396);

    const fuelPreset = getAircraftFuelPreset("5");
    expect(fuelPreset.capacityGal).toBe(420);
  });

  it("should accurately identify ID 18 as F-16 Fighting Falcon", () => {
    const transportPreset = getAircraftTransportPreset("18");
    expect(transportPreset.name).toContain("F-16");
    expect(transportPreset.category).toBe("VIP");
    expect(transportPreset.maxPassengers).toBe(1);

    const fuelPreset = getAircraftFuelPreset("18");
    expect(fuelPreset.capacityGal).toBe(1670);
  });

  it("should accurately identify ID 24 as Boeing 777-200ER", () => {
    const transportPreset = getAircraftTransportPreset("24");
    expect(transportPreset.name).toContain("Boeing 777");
    expect(transportPreset.category).toBe("Airliner");
    expect(transportPreset.maxPassengers).toBe(396);

    const fuelPreset = getAircraftFuelPreset("24");
    expect(fuelPreset.capacityGal).toBe(45220);
  });

  it("should classify community aircraft using keyword heuristics", () => {
    // Community Fighter Jet
    const fighterGroup = findAircraftGroup("9999", "F-16C Fighting Falcon");
    expect(fighterGroup).toBe("fighterJet");
    // When mocked with window geofs aircraftList:
    (globalThis as any).window = (globalThis as any).window || {};
    (globalThis as any).window.geofs = {
      aircraftList: {
        "9999": { name: "F-16C Fighting Falcon" },
        "8888": { name: "Citation CJ4" },
      },
    };

    const fighterPreset = getAircraftTransportPreset("9999");
    expect(fighterPreset.maxPassengers).toBe(1);
    expect(fighterPreset.maxCargoKg).toBe(100);

    const bizPreset = getAircraftTransportPreset("8888");
    expect(bizPreset.category).toBe("VIP");
    expect(bizPreset.maxPassengers).toBeLessThanOrEqual(9);

    const fuelFighter = getAircraftFuelPreset("9999");
    expect(fuelFighter.capacityGal).toBe(1400);
  });

  it("should validate real airport ICAO codes and reject runway designators", () => {
    expect(isValidIcaoCode("LTFM")).toBe(true);
    expect(isValidIcaoCode("KJFK")).toBe(true);
    expect(isValidIcaoCode("EGLL")).toBe(true);
    expect(isValidIcaoCode("SFO")).toBe(true);

    // Runway designators must NOT be treated as ICAO codes
    expect(isValidIcaoCode("35L")).toBe(false);
    expect(isValidIcaoCode("17R")).toBe(false);
    expect(isValidIcaoCode("05")).toBe(false);
    expect(isValidIcaoCode("36C")).toBe(false);
    expect(isValidIcaoCode("RWY 12")).toBe(false);
    expect(isValidIcaoCode("")).toBe(false);
    expect(isValidIcaoCode(undefined)).toBe(false);
  });
});

describe("FlightStateMachine Enhancements", () => {
  let eventBus: EventBus;
  let fsm: FlightStateMachine;

  beforeEach(() => {
    eventBus = new EventBus();
    fsm = new FlightStateMachine(eventBus);
  });

  it("should detect airborne reconnect/spawn and transition directly to IN_FLIGHT", () => {
    expect(fsm.getState()).toBe(FlightState.PARKED);

    // Aircraft spawns in the air: !groundContact, alt 2500 ft, kias 180
    fsm.update({
      deltaTime: 0.1,
      kias: 180,
      groundContact: false,
      lla: [41.275, 28.751, 2500],
      gForce: 1.0,
      verticalSpeedFpm: 0,
      altitudeFt: 2500,
    });

    expect(fsm.getState()).toBe(FlightState.IN_FLIGHT);
    const tracking = fsm.getTrackingData();
    expect(tracking).not.toBeNull();
    expect(tracking?.departureIcao).toBeDefined();
  });

  it("should emit departureIcao and departureCoords on confirmed landing", () => {
    let landedData: any = null;
    eventBus.on("flight:landed", (data) => {
      landedData = data;
    });

    // Start in flight
    fsm.update({
      deltaTime: 0.1,
      kias: 150,
      groundContact: false,
      lla: [41.275, 28.751, 3000],
      gForce: 1.0,
      verticalSpeedFpm: 0,
      altitudeFt: 3000,
    });

    const tracking = fsm.getTrackingData();
    if (tracking) {
      // Simulate 2 minutes flight time and 10 NM distance
      tracking.takeoffTimestamp = Date.now() - 120000;
      tracking.departureCoords = [41.0, 28.5, 0];
      tracking.departureIcao = "LTBA";
    }

    // Touchdown
    fsm.update({
      deltaTime: 0.1,
      kias: 60,
      groundContact: true,
      lla: [41.275, 28.751, 100],
      gForce: 1.1,
      verticalSpeedFpm: -120,
      altitudeFt: 100,
    });

    expect(fsm.getState()).toBe(FlightState.TOUCHDOWN_PENDING);

    // Rollout for > 5 seconds below 25 kts
    for (let i = 0; i < 60; i++) {
      fsm.update({
        deltaTime: 0.1,
        kias: 15,
        groundContact: true,
        lla: [41.275, 28.751, 100],
        gForce: 1.0,
        verticalSpeedFpm: 0,
        altitudeFt: 100,
      });
    }

    expect(landedData).not.toBeNull();
    expect(landedData.departureIcao).toBe("LTBA");
    expect(landedData.departureCoords).toEqual([41.0, 28.5, 0]);
  });
});
