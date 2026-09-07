// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import InstrumentManager from "../classes/InstrumentManager";

interface FakeOverlay {
  definition: any;
  position: { x: number; y: number };
  size: { x: number; y: number };
  anchor: { x: number; y: number };
  scale: { x: number; y: number };
  children: Array<{ position: { x: number; y: number } }>;
  scaleAndPlace: () => void;
  setVisibility: (visible: boolean) => void;
}

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

class FakeIndicator {
  definition: any;
  overlay: FakeOverlay;
  visibility: boolean;
  destroyed = false;

  constructor(definition: any) {
    this.definition = clone(definition);
    const overlayDefinition = clone(definition.overlay);
    this.overlay = {
      definition: overlayDefinition,
      position: { ...overlayDefinition.position },
      size: { ...overlayDefinition.size },
      anchor: { ...overlayDefinition.anchor },
      scale: { x: 1, y: 1 },
      children: [{ position: { x: 0, y: 0 } }],
      scaleAndPlace: () => {
        this.overlay.position = { ...this.overlay.definition.position };
      },
      setVisibility: () => undefined,
    };
    this.visibility = definition.visibility !== false;
  }

  setVisibility(visible: boolean): void {
    this.visibility = visible;
  }

  destroy(): void {
    this.destroyed = true;
  }
}

const definition = (name: string): InstrumentDef => ({
  name,
  container: ".geofs-instruments-container",
  stackX: true,
  group: "all",
  visibility: true,
  overlay: {
    size: { x: 200, y: 200 },
    anchor: { x: 100, y: 100 },
    position: { x: 100, y: 100 },
    rescale: true,
    rescalePosition: true,
  },
});

const nativeIndicator = (name: string): FakeIndicator => new FakeIndicator(definition(name));

describe("InstrumentManager gauge lifecycle and layout", () => {
  let instruments: any;
  let nativeInitCalls: number;

  beforeEach(() => {
    nativeInitCalls = 0;
    instruments = {
      definitions: {},
      list: {
        airspeed: nativeIndicator("airspeed"),
        altitude: nativeIndicator("altitude"),
      },
      groups: { all: {} },
      stackPosition: { x: 530, y: 100 },
      visible: true,
      init: () => {
        nativeInitCalls += 1;
        instruments.list = {
          airspeed: nativeIndicator("airspeed"),
          altitude: nativeIndicator("altitude"),
        };
        instruments.groups = { all: {} };
      },
      show: () => {
        instruments.visible = true;
        Object.values(instruments.list).forEach((indicator: any) => indicator.setVisibility(true));
      },
      hide: () => {
        instruments.visible = false;
        Object.values(instruments.list).forEach((indicator: any) => indicator.setVisibility(false));
      },
      toggle: () => {
        if (instruments.visible) instruments.hide();
        else instruments.show();
      },
      rescale: () => undefined,
      updateScreenPositions: () => undefined,
    };

    (globalThis as any).unsafeWindow = {
      instruments,
      geofs: {
        viewportDimensions: { x: 1920, y: 1080 },
        camera: { currentModeName: "free" },
      },
    };
  });

  afterEach(() => {
    InstrumentManager.cleanup();
    delete (globalThis as any).unsafeWindow;
  });

  it("does not rebuild native gauges or overlap radar when fuel is reactivated", () => {
    InstrumentManager.init();
    InstrumentManager.registerDefinition(definition("efiRadar"));
    InstrumentManager.registerDefinition(definition("efiFuelGauge"));

    InstrumentManager.activateInstrument("efiRadar");
    const radar = InstrumentManager.getIndicator("efiRadar") as FakeIndicator;

    InstrumentManager.activateInstrument("efiFuelGauge");
    const fuel = InstrumentManager.getIndicator("efiFuelGauge") as FakeIndicator;

    const visibleGauges = [
      instruments.list.airspeed,
      instruments.list.altitude,
      radar,
      fuel,
    ] as FakeIndicator[];
    const visualLeftEdges = visibleGauges.map((indicator) => indicator.overlay.position.x - indicator.overlay.anchor.x);

    expect(nativeInitCalls).toBe(0);
    expect(visualLeftEdges[0]).toBe(524); // (1920 - (4 × 200 + 3 × 24)) / 2
    expect(visualLeftEdges.slice(1).every((left, index) => left - visualLeftEdges[index] >= 224)).toBe(true);
    expect(radar.overlay.position.x).not.toBe(fuel.overlay.position.x);
    expect(radar.overlay.children[0].position).toEqual({ x: 0, y: 0 });

    InstrumentManager.deactivateInstrument("efiFuelGauge");
    expect(instruments.list.efiFuelGauge).toBeUndefined();
    expect(instruments.list.efiRadar).toBe(radar);
    expect(radar.destroyed).toBe(false);

    InstrumentManager.activateInstrument("efiFuelGauge");
    const reactivatedFuel = InstrumentManager.getIndicator("efiFuelGauge") as FakeIndicator;

    expect(nativeInitCalls).toBe(0);
    expect(reactivatedFuel).not.toBe(fuel);
    expect(reactivatedFuel.overlay.position.x).not.toBe(radar.overlay.position.x);
    expect(Math.abs(reactivatedFuel.overlay.position.x - radar.overlay.position.x)).toBeGreaterThanOrEqual(224);
  });

  it("recreates active custom gauges after GeoFS reloads its native instrument list", () => {
    InstrumentManager.init();
    InstrumentManager.registerDefinition(definition("efiRadar"));
    InstrumentManager.registerDefinition(definition("efiFuelGauge"));
    InstrumentManager.activateInstrument("efiRadar");
    InstrumentManager.activateInstrument("efiFuelGauge");

    const oldRadar = InstrumentManager.getIndicator("efiRadar") as FakeIndicator;
    const oldFuel = InstrumentManager.getIndicator("efiFuelGauge") as FakeIndicator;
    instruments.init({});

    const newRadar = InstrumentManager.getIndicator("efiRadar") as FakeIndicator;
    const newFuel = InstrumentManager.getIndicator("efiFuelGauge") as FakeIndicator;

    expect(nativeInitCalls).toBe(1);
    expect(newRadar).not.toBe(oldRadar);
    expect(newFuel).not.toBe(oldFuel);
    expect(instruments.list.efiRadar).toBe(newRadar);
    expect(instruments.list.efiFuelGauge).toBe(newFuel);
    expect(newRadar.overlay.position.x).not.toBe(newFuel.overlay.position.x);
  });

  it("keeps a locally hidden gauge out of the row and restores it to a distinct slot", () => {
    InstrumentManager.init();
    InstrumentManager.registerDefinition(definition("efiRadar"));
    InstrumentManager.registerDefinition(definition("efiFuelGauge"));
    InstrumentManager.activateInstrument("efiRadar");
    InstrumentManager.activateInstrument("efiFuelGauge");

    const radar = InstrumentManager.getIndicator("efiRadar") as FakeIndicator;
    InstrumentManager.hide("efiFuelGauge");

    expect(InstrumentManager.isVisible("efiFuelGauge")).toBe(false);
    expect(radar.overlay.position.x).toBeGreaterThan(500);

    InstrumentManager.show("efiFuelGauge");
    const fuel = InstrumentManager.getIndicator("efiFuelGauge") as FakeIndicator;

    expect(InstrumentManager.isVisible("efiFuelGauge")).toBe(true);
    expect(radar.overlay.position.x).not.toBe(fuel.overlay.position.x);
  });
});
