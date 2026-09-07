import Logger from "./Logger";
import InstrumentManager from "./InstrumentManager";

const log = Logger.create("FuelSystem");

export const FUEL_INSTRUMENT_NAME = "efiFuelGauge";

export interface FuelStatus {
  isActive: boolean;
  percentage: number;
  currentGal: number;
  capacityGal: number;
  consumptionRateGalPerSec: number;
}

/**
 * FuelSystem - Fuel simulation and monitoring
 * 
 * This class handles:
 * - Fuel consumption calculations
 * - Animation values for GeoFS
 * - Settings management
 * - Flight tick hooking
 * 
 * Instrument creation/management is delegated to InstrumentManager
 */
class FuelSystem {
  // State
  static isActive: boolean = false;
  static fuelPercentage: number = 100;
  static fuelCapacityGal: number = 0;
  static currentFuelGal: number = 0;
  static consumptionRateGalPerSec: number = 0;
  static smoothedConsumptionGalPerSec: number = 0;

  // Constants
  static readonly KG_TO_GAL: number = 0.330215;

  // Aircraft tracking
  static lastAircraftMassKg: number | null = null;
  static currentAircraftId: number = -1;
  static lastUpdateTime: number = 0;

  // Flags
  static isInitializing: boolean = false;
  static creatingGauge: boolean = false;
  static isHooked: boolean = false;

  // Hooks
  static originalFlightTick: ((e: number, t: number, a: number) => void) | null = null;
  static saveIntervalId: number | null = null;

  // Settings
  static capacityMultiplier: number = 0.6349575;
  static consumptionMultiplier: number = 0.05;

  static STORAGE_KEYS = {
    fuelPercentage: "fuel_system_percentage",
    aircraftId: "fuel_system_aircraft_id",
    isActive: "fuel_system_is_active",
    capacityMultiplier: "fuel_system_capacity_multiplier",
    consumptionMultiplier: "fuel_system_consumption_multiplier",
  };

  // ============================================
  // INSTRUMENT DEFINITION
  // ============================================

  static getInstrumentDefinition(): InstrumentDef {
    const fuelFaceSVG = this.createFuelFaceSVG();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(fuelFaceSVG);
    const fuelFaceBase64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgString)));

    return {
      name: FUEL_INSTRUMENT_NAME,
      container: ".geofs-instruments-container",
      compositors: "canvas,css",
      stackX: true,
      group: "all",
      visibility: true,
      animations: [
        { value: 'view', type: 'show', notEq: 'cockpit' }
      ],
      overlay: {
        url: "images/instruments/background.png",
        class: "geofs-instrument-background geofs-fuel-gauge",
        size: { x: 200, y: 200 },
        anchor: { x: 100, y: 100 },
        position: { x: 100, y: 100 },
        rescale: true,
        rescalePosition: true,
        overlays: [
          {
            url: fuelFaceBase64,
            anchor: { x: 100, y: 100 },
            size: { x: 200, y: 200 },
            position: { x: 0, y: 0 }
          },
          {
            animations: [
              {
                type: "rotate",
                value: "fuelPercentage",
                ratio: -2.7,
                offset: 135,
                min: 0,
                max: 100
              }
            ],
            url: "images/instruments/airspeed-hand.png",
            anchor: { x: 10, y: 34 },
            size: { x: 20, y: 120 },
            position: { x: 0, y: 0 },
            class: "geofs-fuel-needle"
          },
          {
            animations: [
              {
                type: "rotate",
                value: "fuelConsumption",
                ratio: -120,
                min: 0
              }
            ],
            url: "images/instruments/mach-hand.png",
            anchor: { x: 5, y: 5 },
            size: { x: 11, y: 31 },
            position: { x: 0, y: -60 },
            class: "geofs-fuel-consumption-needle"
          }
        ]
      },
      onInit: () => FuelSystem.onInstrumentReady(),
      onDestroy: () => FuelSystem.onInstrumentDestroyed(),
      onShow: () => log.debug("Fuel gauge shown"),
      onHide: () => log.debug("Fuel gauge hidden"),
    };
  }

  // ============================================
  // INSTRUMENT CALLBACKS
  // ============================================

  static onInstrumentReady(): void {
    this.updateAnimationValues();
    log.debug("Fuel gauge ready");
  }

  static onInstrumentDestroyed(): void {
    log.debug("Fuel gauge destroyed");
  }

  // ============================================
  // STORAGE
  // ============================================

  private static getStorage() {
    return (unsafeWindow as any).flightAssistant?.Storage;
  }

  static async loadSettings(): Promise<void> {
    try {
      const Storage = this.getStorage();
      if (!Storage) return;

      const savedCapacity = await Storage.get(this.STORAGE_KEYS.capacityMultiplier);
      const savedConsumption = await Storage.get(this.STORAGE_KEYS.consumptionMultiplier);

      if (typeof savedCapacity === 'number') this.capacityMultiplier = savedCapacity;
      if (typeof savedConsumption === 'number') this.consumptionMultiplier = savedConsumption;

      log.debug("Loaded settings:", { capacityMultiplier: this.capacityMultiplier, consumptionMultiplier: this.consumptionMultiplier });
    } catch (error) {
      log.error("Failed to load settings:", error);
    }
  }

  static saveSettings(): void {
    try {
      const Storage = this.getStorage();
      if (!Storage) return;

      Storage.write(this.STORAGE_KEYS.capacityMultiplier, this.capacityMultiplier);
      Storage.write(this.STORAGE_KEYS.consumptionMultiplier, this.consumptionMultiplier);
    } catch (error) {
      log.error("Failed to save settings:", error);
    }
  }

  static saveFuelState(): void {
    try {
      const Storage = this.getStorage();
      if (!Storage) return;

      Storage.write(this.STORAGE_KEYS.fuelPercentage, this.fuelPercentage);
      Storage.write(this.STORAGE_KEYS.aircraftId, this.currentAircraftId);
      Storage.write(this.STORAGE_KEYS.isActive, this.isActive);
    } catch (error) {
      log.error("Failed to save fuel state:", error);
    }
  }

  static async loadFuelState(): Promise<{ percentage: number; isActive: boolean }> {
    try {
      const Storage = this.getStorage();
      if (!Storage) return { percentage: 100, isActive: false };

      const savedPercentage = await Storage.get(this.STORAGE_KEYS.fuelPercentage);
      const savedAircraftId = await Storage.get(this.STORAGE_KEYS.aircraftId);
      const savedIsActive = await Storage.get(this.STORAGE_KEYS.isActive);

      if (savedAircraftId !== this.currentAircraftId && savedAircraftId !== undefined) {
        return { percentage: 100, isActive: savedIsActive === true };
      }

      return {
        percentage: typeof savedPercentage === 'number' ? savedPercentage : 100,
        isActive: savedIsActive === true,
      };
    } catch (error) {
      log.error("Failed to load fuel state:", error);
      return { percentage: 100, isActive: false };
    }
  }

  static clearStorage(): void {
    try {
      const Storage = this.getStorage();
      if (!Storage) return;

      Storage.delete(this.STORAGE_KEYS.fuelPercentage);
      Storage.delete(this.STORAGE_KEYS.aircraftId);
      Storage.delete(this.STORAGE_KEYS.isActive);
    } catch (error) {
      log.error("Failed to clear storage:", error);
    }
  }

  // ============================================
  // SETTINGS
  // ============================================

  static setCapacityMultiplier(value: number): void {
    this.capacityMultiplier = Math.max(0.1, Math.min(2.0, value));
    this.saveSettings();
    this.recalculateCapacity();
  }

  static setConsumptionMultiplier(value: number): void {
    this.consumptionMultiplier = Math.max(0.001, Math.min(1.0, value));
    this.saveSettings();
  }

  static recalculateCapacity(): void {
    const aircraft = unsafeWindow.geofs?.aircraft?.instance;
    if (!aircraft) return;

    const aircraftMass = aircraft.definition?.mass || 1000;
    const oldPercentage = this.fuelPercentage;
    this.fuelCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;
    this.currentFuelGal = (this.fuelCapacityGal * oldPercentage) / 100;
  }

  // ============================================
  // INITIALIZATION
  // ============================================

  static async initialize(): Promise<void> {
    if (this.isInitializing) return;
    this.isInitializing = true;

    try {
      const aircraft = unsafeWindow.geofs?.aircraft?.instance;
      if (!aircraft) {
        log.error("No aircraft instance found, retrying...");
        this.isInitializing = false;
        setTimeout(() => this.initialize(), 1000);
        return;
      }

      const aircraftId = aircraft.id || 0;
      const aircraftChanged = this.currentAircraftId !== aircraftId && this.currentAircraftId !== -1;

      if (aircraftChanged && this.gaugeExists()) {
        InstrumentManager.deactivateInstrument(FUEL_INSTRUMENT_NAME);
      }

      const aircraftMass = aircraft.definition?.mass || 1000;
      this.lastAircraftMassKg = aircraftMass;

      await this.loadSettings();
      this.fuelCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;

      const hasEngines = aircraft.engines && Array.isArray(aircraft.engines) && aircraft.engines.length > 0;

      const savedState = await this.loadFuelState();
      this.fuelPercentage = savedState.percentage;
      this.currentFuelGal = (this.fuelCapacityGal * savedState.percentage) / 100;
      this.lastUpdateTime = Date.now();
      this.currentAircraftId = aircraftId;

      this.isActive = savedState.isActive;
      this.isInitializing = false;

      if (this.isActive && hasEngines) {
        if (!this.gaugeExists() || aircraftChanged) {
          this.createFuelIndicator();
        }
        this.startMonitoring();
      }
    } catch (error) {
      log.error("Initialization failed:", error);
      this.isActive = false;
      this.isInitializing = false;
    }
  }

  // ============================================
  // ACTIVATION / DEACTIVATION
  // ============================================

  static async activate(): Promise<void> {
    if (this.isActive) return;

    const aircraft = unsafeWindow.geofs?.aircraft?.instance;
    if (!aircraft) {
      log.error("No aircraft instance found");
      return;
    }

    const hasEngines = aircraft?.engines && Array.isArray(aircraft.engines) && aircraft.engines.length > 0;

    if (!hasEngines) {
      log.debug("No engines, skipping activation");
      return;
    }

    if (this.fuelCapacityGal === 0) {
      const aircraftMass = aircraft.definition?.mass || 1000;
      this.lastAircraftMassKg = aircraftMass;
      await this.loadSettings();
      this.fuelCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;
      this.currentAircraftId = aircraft.id || 0;

      const savedState = await this.loadFuelState();
      this.fuelPercentage = savedState.percentage;
      this.currentFuelGal = (this.fuelCapacityGal * savedState.percentage) / 100;
      this.lastUpdateTime = Date.now();
    }

    this.isActive = true;
    this.saveFuelState();

    // Use InstrumentManager
    InstrumentManager.init();

    if (!InstrumentManager.isActive(FUEL_INSTRUMENT_NAME)) {
      InstrumentManager.registerDefinition(this.getInstrumentDefinition());
      InstrumentManager.activateInstrument(FUEL_INSTRUMENT_NAME);
    } else {
      InstrumentManager.show(FUEL_INSTRUMENT_NAME);
    }

    this.startMonitoring();
    log.info("Fuel system activated");
  }

  static deactivate(): void {
    if (!this.isActive) return;

    this.isActive = false;
    this.unhookFlightTick();

    if (this.saveIntervalId !== null) {
      clearInterval(this.saveIntervalId);
      this.saveIntervalId = null;
    }

    const aircraft = unsafeWindow.geofs?.aircraft?.instance;
    if (aircraft && aircraft.crashed) {
      aircraft.crashed = false;
    }

    // Remove the gauge from the managed layout. Keeping a hidden Indicator in
    // GeoFS's list leaves a stale stack slot and can make it overlap the radar
    // when the fuel system is enabled again.
    InstrumentManager.deactivateInstrument(FUEL_INSTRUMENT_NAME);

    this.saveFuelState();
    log.info("Fuel system deactivated");
  }

  static gaugeExists(): boolean {
    return InstrumentManager.isActive(FUEL_INSTRUMENT_NAME);
  }

  // ============================================
  // MONITORING
  // ============================================

  static startMonitoring(): void {
    this.hookFlightTick();

    if (this.saveIntervalId !== null) {
      clearInterval(this.saveIntervalId);
    }
    this.saveIntervalId = window.setInterval(() => {
      this.saveFuelState();
      this.checkAircraftChange();
    }, 5000);
  }

  static hookFlightTick(): void {
    if (this.isHooked) return;

    const flight = (unsafeWindow as any).flight;
    if (!flight || typeof flight.tick !== 'function') {
      log.warn("flight.tick not found, retrying...");
      setTimeout(() => this.hookFlightTick(), 1000);
      return;
    }

    this.originalFlightTick = flight.tick.bind(flight);

    const self = this;
    flight.tick = function (e: number, t: number, a: number) {
      if (self.originalFlightTick) {
        self.originalFlightTick(e, t, a);
      }
      if (self.isActive) {
        self.tickUpdate(e);
      }
    };

    this.isHooked = true;
    log.debug("Hooked into flight.tick");
  }

  static unhookFlightTick(): void {
    if (!this.isHooked) return;

    const flight = (unsafeWindow as any).flight;
    if (flight && this.originalFlightTick) {
      flight.tick = this.originalFlightTick;
      this.originalFlightTick = null;
    }

    this.isHooked = false;
  }

  static checkAircraftChange(): void {
    const aircraft = unsafeWindow.geofs?.aircraft?.instance;
    if (!aircraft) return;

    const currentId = aircraft.id || 0;

    if (currentId !== this.currentAircraftId && this.currentAircraftId !== -1) {
      setTimeout(() => this.initialize(), 500);
      return;
    }

    const aircraftMass = aircraft.definition?.mass || 0;
    if (this.lastAircraftMassKg !== null && aircraftMass !== this.lastAircraftMassKg) {
      const newCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;
      const oldPercentage = this.fuelPercentage;
      this.fuelCapacityGal = newCapacityGal;
      this.currentFuelGal = (this.fuelCapacityGal * oldPercentage) / 100;
      this.currentFuelGal = Math.max(0, Math.min(this.currentFuelGal, this.fuelCapacityGal));
      this.fuelPercentage = this.fuelCapacityGal > 0 ? (this.currentFuelGal / this.fuelCapacityGal) * 100 : 0;
      this.lastAircraftMassKg = aircraftMass;
    }
  }

  // ============================================
  // TICK UPDATE & ANIMATION VALUES
  // ============================================

  static tickUpdate(deltaTime: number): void {
    if (!this.isActive) return;

    const geofs = unsafeWindow.geofs;
    if (!geofs || geofs.pause) return;

    const aircraft = geofs?.aircraft?.instance;
    if (!aircraft) return;

    if (!aircraft.engines || !Array.isArray(aircraft.engines) || aircraft.engines.length === 0) {
      return;
    }

    // Calculate consumption
    let totalConsumptionGalPerSec = 0;
    for (let i = 0; i < aircraft.engines.length; i++) {
      const engine = aircraft.engines[i] as any;
      const thrust = Math.abs(engine?.currentThrust ?? 0);
      const rpm = Math.abs(engine?.rpm || 0);
      if (!rpm || rpm === 0) continue;

      const perEngineKgPerSec = (thrust / rpm) * this.consumptionMultiplier;
      const perEngineGalPerSec = perEngineKgPerSec * this.KG_TO_GAL;
      totalConsumptionGalPerSec += perEngineGalPerSec;
    }

    this.consumptionRateGalPerSec = totalConsumptionGalPerSec;

    // Update animation values
    this.updateAnimationValues();

    // Consume fuel
    if (this.fuelPercentage > 0) {
      const consumedFuel = this.consumptionRateGalPerSec * deltaTime;
      this.currentFuelGal = Math.max(0, this.currentFuelGal - consumedFuel);
      this.fuelPercentage = (this.currentFuelGal / this.fuelCapacityGal) * 100;

      if (aircraft.crashed) {
        aircraft.crashed = false;
      }
    }

    // Low fuel warning
    if (this.fuelPercentage < 20 && this.fuelPercentage > 19.5) {
      this.showLowFuelWarning();
    }

    // Fuel empty
    if (this.fuelPercentage <= 0) {
      this.onFuelEmpty();
    }
  }

  static updateAnimationValues(): void {
    const geofs = unsafeWindow.geofs;
    if (geofs?.animation?.values) {
      (geofs.animation as any).values.fuelPercentage = this.fuelPercentage;
      (geofs.animation as any).values.fuelConsumption = this.consumptionRateGalPerSec;
    }
  }

  // ============================================
  // FUEL OPERATIONS
  // ============================================

  static refuel(percentage: number = 100): void {
    percentage = Math.max(0, Math.min(100, percentage));
    this.fuelPercentage = percentage;
    this.currentFuelGal = (this.fuelCapacityGal * percentage) / 100;

    const aircraft = unsafeWindow.geofs?.aircraft?.instance;
    if (aircraft && this.fuelPercentage > 0 && aircraft.crashed) {
      aircraft.crashed = false;
    }

    this.saveFuelState();
    this.updateAnimationValues();
  }

  static showLowFuelWarning(): void {
    // TODO: Implement warning
  }

  static onFuelEmpty(): void {
    const aircraft = unsafeWindow.geofs?.aircraft?.instance;
    if (aircraft) {
      aircraft.crashed = true;
      if (typeof aircraft.stopEngine === 'function') {
        aircraft.stopEngine();
      }
    }
  }

  // ============================================
  // INSTRUMENT CREATION
  // ============================================

  static createFuelIndicator(): void {
    if (this.gaugeExists() || this.creatingGauge) return;
    this.creatingGauge = true;

    try {
      const aircraft = unsafeWindow.geofs?.aircraft?.instance;
      if (!aircraft || !aircraft.engines?.length) {
        this.creatingGauge = false;
        return;
      }

      if (!(unsafeWindow as any).instruments) {
        this.creatingGauge = false;
        return;
      }

      InstrumentManager.init();
      InstrumentManager.registerDefinition(this.getInstrumentDefinition());

      if (InstrumentManager.activateInstrument(FUEL_INSTRUMENT_NAME)) {
        this.updateAnimationValues();
        log.debug("Fuel indicator created");
      }
    } catch (error) {
      log.error("Failed to create fuel indicator:", error);
    } finally {
      this.creatingGauge = false;
    }
  }

  // ============================================
  // SVG GENERATION
  // ============================================

  static createFuelFaceSVG(): SVGSVGElement {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "200");
    svg.setAttribute("viewBox", "0 0 200 200");

    const cx = 100;
    const cy = 100;
    const radius = 88;
    const arcWidth = 10;

    const arcs = [
      { start: 0, end: 10, color: "#ff0000" },
      { start: 10, end: 40, color: "#ff8800" },
      { start: 40, end: 75, color: "#ffdd00" },
      { start: 75, end: 100, color: "#00ff00" }
    ];

    const percentToAngle = (percent: number): number => {
      return -135 + (percent / 100) * 270;
    };

    const createArcPath = (startPercent: number, endPercent: number, r: number): string => {
      const startAngle = percentToAngle(startPercent) * Math.PI / 180;
      const endAngle = percentToAngle(endPercent) * Math.PI / 180;

      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);

      const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;

      return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    };

    let svgContent = '<g transform="rotate(270 100 100)">';

    // Color arcs
    for (const arc of arcs) {
      svgContent += `<path d="${createArcPath(arc.start, arc.end, radius)}" fill="none" stroke="${arc.color}" stroke-width="${arcWidth}" stroke-linecap="butt" opacity="0.9"/>`;
    }

    // Tick marks
    for (let percent = 0; percent <= 100; percent += 2) {
      const angle = percentToAngle(percent) * Math.PI / 180;
      const isMajor = percent % 10 === 0;

      const outerRadius = radius - arcWidth / 2 - 2;
      const innerRadius = isMajor ? outerRadius - 10 : outerRadius - 4;

      const x1 = cx + innerRadius * Math.cos(angle);
      const y1 = cy + innerRadius * Math.sin(angle);
      const x2 = cx + outerRadius * Math.cos(angle);
      const y2 = cy + outerRadius * Math.sin(angle);

      const strokeWidth = isMajor ? 3 : 1;
      const strokeColor = isMajor ? "#ffffff" : "#aaaaaa";

      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="${strokeWidth}"/>`;
    }

    // Labels
    for (let percent = 0; percent <= 100; percent += 10) {
      const angle = percentToAngle(percent) * Math.PI / 180;
      const labelRadius = radius - arcWidth / 2 - 22;
      const x = cx + labelRadius * Math.cos(angle);
      const y = cy + labelRadius * Math.sin(angle);

      let label = String(percent);
      if (percent === 0) label = "E";
      else if (percent === 100) label = "F";

      svgContent += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="12" font-family="Arial" font-weight="bold" transform="rotate(-270 ${x} ${y})">${label}</text>`;
    }

    svgContent += '</g>';

    // Title
    svgContent += '<text x="100" y="90" text-anchor="middle" fill="#ffffff" font-size="16" font-family="Arial" font-weight="bold">FUEL</text>';
    svgContent += '<text x="100" y="120" text-anchor="middle" fill="#ffffff" font-size="10" font-family="Arial">PERCENT</text>';

    // Consumption gauge
    const innerR = 20;
    const centerX = 100;
    const centerY = 160;
    const innerCirc = (2 * Math.PI * innerR).toFixed(3);
    const tickOuterR = innerR + 8;
    const frameR = tickOuterR + 2;

    svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${frameR}" fill="none" stroke="#333" stroke-width="2"/>`;
    svgContent += `<circle cx="${centerX}" cy="${centerY}" r="${innerR}" fill="none" stroke="#00ff88" stroke-width="3" stroke-linecap="round" transform="rotate(-90 ${centerX} ${centerY})" stroke-dasharray="${innerCirc}" stroke-dashoffset="${innerCirc}"/>`;

    for (let i = 0; i <= 14; i++) {
      const value = i * 0.2;
      const isMajor = Math.abs(value - Math.round(value)) < 1e-6 && (value === 0 || value === 1 || value === 2);

      const angleDeg = (value * 120) - 90;
      const angle = (angleDeg * Math.PI) / 180;
      const outerR = innerR + 6;
      const innerTickR = isMajor ? outerR - 8 : outerR - 4;
      const x1 = centerX + outerR * Math.cos(angle);
      const y1 = centerY + outerR * Math.sin(angle);
      const x2 = centerX + innerTickR * Math.cos(angle);
      const y2 = centerY + innerTickR * Math.sin(angle);

      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#ffffff" stroke-width="${isMajor ? 2 : 1}"/>`;

      if (isMajor) {
        const lx = centerX + (innerTickR - 8) * Math.cos(angle);
        const ly = centerY + (innerTickR - 8) * Math.sin(angle) + 2;
        svgContent += `<text x="${lx}" y="${ly}" text-anchor="middle" fill="#ffffff" font-size="10" font-family="Arial">${Math.round(value)}</text>`;
      }
    }

    svg.innerHTML = svgContent;
    return svg;
  }

  // ============================================
  // STATUS & CLEANUP
  // ============================================

  static getStatus(): FuelStatus {
    return {
      isActive: this.isActive,
      percentage: this.fuelPercentage,
      currentGal: this.currentFuelGal,
      capacityGal: this.fuelCapacityGal,
      consumptionRateGalPerSec: this.consumptionRateGalPerSec,
    };
  }

  static cleanup(removeUI: boolean = true): void {
    this.unhookFlightTick();

    if (this.saveIntervalId !== null) {
      clearInterval(this.saveIntervalId);
      this.saveIntervalId = null;
    }

    this.isActive = false;
    this.fuelPercentage = 100;
    this.currentFuelGal = 0;
    this.fuelCapacityGal = 0;
    this.consumptionRateGalPerSec = 0;

    this.saveFuelState();

    if (removeUI) {
      InstrumentManager.deactivateInstrument(FUEL_INSTRUMENT_NAME);

      const geofs = unsafeWindow.geofs;
      if (geofs?.animation?.values) {
        delete (geofs.animation as any).values.fuelPercentage;
        delete (geofs.animation as any).values.fuelConsumption;
      }
    }
  }
}

export default FuelSystem;

