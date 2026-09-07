import Logger from "../../shared/Logger";
import InstrumentManager from "../../shared/InstrumentManager";
import Storage from "../../shared/Storage";

const log = Logger.create("FuelEngine");

export const FUEL_INSTRUMENT_NAME = "efiFuelGauge";

export interface FuelStatus {
  isActive: boolean;
  percentage: number;
  currentGal: number;
  capacityGal: number;
  consumptionRateGalPerSec: number;
}

export class FuelEngine {
  static isActive: boolean = false;
  static fuelPercentage: number = 100;
  static fuelCapacityGal: number = 0;
  static currentFuelGal: number = 0;
  static consumptionRateGalPerSec: number = 0;

  static readonly KG_TO_GAL: number = 0.330215;

  static lastAircraftMassKg: number | null = null;
  static currentAircraftId: number = -1;
  static lastUpdateTime: number = 0;

  static capacityMultiplier: number = 0.6349575;
  static consumptionMultiplier: number = 0.05;
  private static creatingGauge: boolean = false;

  static STORAGE_KEYS = {
    fuelPercentage: "fuel_system_percentage",
    aircraftId: "fuel_system_aircraft_id",
    isActive: "fuel_system_is_active",
    capacityMultiplier: "fuel_system_capacity_multiplier",
    consumptionMultiplier: "fuel_system_consumption_multiplier",
  };

  /**
   * Birebir Orijinal GeoFS Flight Assistant SVG Fuel Face
   */
  static createFuelFaceSVG(): SVGElement {
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
      { start: 75, end: 100, color: "#00ff00" },
    ];

    const percentToAngle = (percent: number) => {
      return -135 + (percent / 100) * 270;
    };

    const createArcPath = (startPercent: number, endPercent: number, r: number) => {
      const startAngle = (percentToAngle(startPercent) * Math.PI) / 180;
      const endAngle = (percentToAngle(endPercent) * Math.PI) / 180;
      const x1 = cx + r * Math.cos(startAngle);
      const y1 = cy + r * Math.sin(startAngle);
      const x2 = cx + r * Math.cos(endAngle);
      const y2 = cy + r * Math.sin(endAngle);
      const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
      return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
    };

    let svgContent = '<g transform="rotate(270 100 100)">';
    for (const arc of arcs) {
      svgContent += `<path d="${createArcPath(
        arc.start,
        arc.end,
        radius
      )}" fill="none" stroke="${arc.color}" stroke-width="${arcWidth}" stroke-linecap="butt" opacity="0.9"/>`;
    }

    for (let percent = 0; percent <= 100; percent += 2) {
      const angle = (percentToAngle(percent) * Math.PI) / 180;
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

    for (let percent = 0; percent <= 100; percent += 10) {
      const angle = (percentToAngle(percent) * Math.PI) / 180;
      const labelRadius = radius - arcWidth / 2 - 22;
      const x = cx + labelRadius * Math.cos(angle);
      const y = cy + labelRadius * Math.sin(angle);
      let label = String(percent);
      if (percent === 0) label = "E";
      else if (percent === 100) label = "F";
      svgContent += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="#ffffff" font-size="12" font-family="Arial" font-weight="bold" transform="rotate(-270 ${x} ${y})">${label}</text>`;
    }

    svgContent += "</g>";

    // Düz Açılı Başlık Yazıları
    svgContent += '<text x="100" y="90" text-anchor="middle" fill="#ffffff" font-size="16" font-family="Arial" font-weight="bold">FUEL</text>';
    svgContent += '<text x="100" y="120" text-anchor="middle" fill="#ffffff" font-size="10" font-family="Arial">PERCENT</text>';

    // Alt Kısımda Anlık Birim Tüketim Kadranı
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
      const angleDeg = value * 120 - 90;
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

  static getInstrumentDefinition(): InstrumentDef {
    const fuelFaceSVG = this.createFuelFaceSVG();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(fuelFaceSVG);
    const fuelFaceBase64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));

    return {
      name: FUEL_INSTRUMENT_NAME,
      container: ".geofs-instruments-container",
      compositors: "canvas,css",
      stackX: true,
      group: "all",
      visibility: true,
      animations: [{ value: "view", type: "show", notEq: "cockpit" }],
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
            position: { x: 0, y: 0 },
          },
          {
            animations: [
              {
                type: "rotate",
                value: "fuelPercentage",
                ratio: -2.7,
                offset: 135,
                min: 0,
                max: 100,
              },
            ],
            url: "images/instruments/airspeed-hand.png",
            anchor: { x: 10, y: 34 },
            size: { x: 20, y: 120 },
            position: { x: 0, y: 0 },
            class: "geofs-fuel-needle",
          },
          {
            animations: [
              {
                type: "rotate",
                value: "fuelConsumption",
                ratio: -120,
                min: 0,
              },
            ],
            url: "images/instruments/mach-hand.png",
            anchor: { x: 5, y: 5 },
            size: { x: 11, y: 31 },
            position: { x: 0, y: -60 },
            class: "geofs-fuel-consumption-needle",
          },
        ],
      },
      onInit: () => FuelEngine.updateAnimationValues(),
    };
  }

  static async loadSettings(): Promise<void> {
    try {
      const savedCapacity = await Storage.get(this.STORAGE_KEYS.capacityMultiplier);
      const savedConsumption = await Storage.get(this.STORAGE_KEYS.consumptionMultiplier);

      if (typeof savedCapacity === "number") this.capacityMultiplier = savedCapacity;
      if (typeof savedConsumption === "number") this.consumptionMultiplier = savedConsumption;
    } catch (error) {
      log.error("Failed to load fuel settings:", error);
    }
  }

  static saveSettings(): void {
    try {
      Storage.write(this.STORAGE_KEYS.capacityMultiplier, this.capacityMultiplier);
      Storage.write(this.STORAGE_KEYS.consumptionMultiplier, this.consumptionMultiplier);
    } catch (error) {
      log.error("Failed to save fuel settings:", error);
    }
  }

  static saveFuelState(): void {
    try {
      Storage.write(this.STORAGE_KEYS.fuelPercentage, this.fuelPercentage);
      Storage.write(this.STORAGE_KEYS.aircraftId, this.currentAircraftId);
      Storage.write(this.STORAGE_KEYS.isActive, this.isActive);
    } catch (error) {
      log.error("Failed to save fuel state:", error);
    }
  }

  static async loadFuelState(currentId: number): Promise<{ percentage: number; isActive: boolean }> {
    try {
      const savedPercentage = await Storage.get(this.STORAGE_KEYS.fuelPercentage);
      const savedAircraftId = await Storage.get(this.STORAGE_KEYS.aircraftId);
      const savedIsActive = await Storage.get(this.STORAGE_KEYS.isActive);

      if (savedAircraftId !== currentId && savedAircraftId !== undefined) {
        return { percentage: 100, isActive: savedIsActive === true };
      }

      return {
        percentage: typeof savedPercentage === "number" ? savedPercentage : 100,
        isActive: savedIsActive === true,
      };
    } catch (error) {
      log.error("Failed to load fuel state:", error);
      return { percentage: 100, isActive: false };
    }
  }

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
    const aircraft = (unsafeWindow as any).geofs?.aircraft?.instance;
    if (!aircraft) return;

    const aircraftMass = aircraft.definition?.mass || 1000;
    const oldPercentage = this.fuelPercentage;
    this.fuelCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;
    this.currentFuelGal = (this.fuelCapacityGal * oldPercentage) / 100;
  }

  static async initialize(): Promise<void> {
    try {
      const aircraft = (unsafeWindow as any).geofs?.aircraft?.instance;
      const aircraftMass = aircraft?.definition?.mass || 1500;
      this.lastAircraftMassKg = aircraftMass;

      await this.loadSettings();
      this.fuelCapacityGal = aircraftMass * this.capacityMultiplier * this.KG_TO_GAL;

      this.currentAircraftId = aircraft?.id || 0;
      const savedState = await this.loadFuelState(this.currentAircraftId);
      this.fuelPercentage = savedState.percentage;
      this.currentFuelGal = (this.fuelCapacityGal * savedState.percentage) / 100;
      this.lastUpdateTime = Date.now();
      this.isActive = true;

      this.createFuelIndicator();
    } catch (error) {
      log.error("Fuel initialization failed:", error);
    }
  }

  static createFuelIndicator(): void {
    if (this.creatingGauge) return;
    this.creatingGauge = true;

    const tryRegister = (attempts: number) => {
      try {
        const instruments = (unsafeWindow as any).instruments;
        if (!instruments || !instruments.definitions) {
          if (attempts > 0) {
            setTimeout(() => tryRegister(attempts - 1), 500);
          } else {
            this.creatingGauge = false;
          }
          return;
        }

        InstrumentManager.init();
        InstrumentManager.registerDefinition(this.getInstrumentDefinition());
        InstrumentManager.activateInstrument(FUEL_INSTRUMENT_NAME);
        this.updateAnimationValues();
        log.info("Fuel indicator successfully attached to GeoFS cockpit!");
      } catch (e) {
        log.error("Failed to create fuel indicator:", e);
      } finally {
        this.creatingGauge = false;
      }
    };

    tryRegister(10);
  }

  static async activate(): Promise<void> {
    this.isActive = true;
    this.createFuelIndicator();
    this.saveFuelState();
    log.info("FuelEngine activated");
  }

  static deactivate(): void {
    this.isActive = false;
    InstrumentManager.deactivateInstrument(FUEL_INSTRUMENT_NAME);
    this.saveFuelState();
    log.info("FuelEngine deactivated");
  }

  static checkAircraftChange(): void {
    const aircraft = (unsafeWindow as any).geofs?.aircraft?.instance;
    if (!aircraft) return;

    const currentId = aircraft.id || 0;
    if (currentId !== this.currentAircraftId && this.currentAircraftId !== -1) {
      setTimeout(() => this.initialize(), 500);
      return;
    }

    const aircraftMass = aircraft.definition?.mass || 0;
    if (this.lastAircraftMassKg !== null && aircraftMass !== this.lastAircraftMassKg) {
      this.recalculateCapacity();
      this.lastAircraftMassKg = aircraftMass;
    }
  }

  static tickUpdate(deltaTime: number): void {
    if (!this.isActive) return;

    const geofs = (unsafeWindow as any).geofs;
    if (!geofs || geofs.pause) return;

    const aircraft = geofs.aircraft?.instance;
    if (!aircraft || !aircraft.engines || !Array.isArray(aircraft.engines) || aircraft.engines.length === 0) {
      return;
    }

    let totalConsumptionGalPerSec = 0;
    for (let i = 0; i < aircraft.engines.length; i++) {
      const engine = aircraft.engines[i];
      const thrust = Math.abs(engine?.currentThrust ?? 0);
      const rpm = Math.abs(engine?.rpm || 0);

      if (!rpm || rpm === 0) continue;

      const perEngineKgPerSec = (thrust / rpm) * this.consumptionMultiplier;
      const perEngineGalPerSec = perEngineKgPerSec * this.KG_TO_GAL;
      totalConsumptionGalPerSec += perEngineGalPerSec;
    }

    this.consumptionRateGalPerSec = totalConsumptionGalPerSec;
    this.updateAnimationValues();

    if (this.fuelPercentage > 0) {
      const consumedFuel = this.consumptionRateGalPerSec * deltaTime;
      this.currentFuelGal = Math.max(0, this.currentFuelGal - consumedFuel);
      this.fuelPercentage = (this.currentFuelGal / this.fuelCapacityGal) * 100;
    }

    if (this.fuelPercentage <= 0) {
      this.onFuelEmpty();
    }
  }

  static updateAnimationValues(): void {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs?.animation?.values) {
      geofs.animation.values.fuelPercentage = this.fuelPercentage;
      geofs.animation.values.fuelConsumption = this.consumptionRateGalPerSec;
    }
  }

  static refuel(percentage: number = 100): void {
    percentage = Math.max(0, Math.min(100, percentage));
    this.fuelPercentage = percentage;
    this.currentFuelGal = (this.fuelCapacityGal * percentage) / 100;

    const geofs = (unsafeWindow as any).geofs;
    const aircraft = geofs?.aircraft?.instance;
    if (aircraft && this.fuelPercentage > 0 && aircraft.crashed) {
      aircraft.crashed = false;
    }

    this.saveFuelState();
    this.updateAnimationValues();
    log.info(`Refueled aircraft to ${percentage}% (${this.currentFuelGal.toFixed(1)} gal)`);
  }

  static onFuelEmpty(): void {
    const geofs = (unsafeWindow as any).geofs;
    const aircraft = geofs?.aircraft?.instance;
    if (aircraft) {
      aircraft.crashed = true;
      if (typeof aircraft.stopEngine === "function") {
        aircraft.stopEngine();
      }
    }
  }

  static getStatus(): FuelStatus {
    return {
      isActive: this.isActive,
      percentage: this.fuelPercentage,
      currentGal: this.currentFuelGal,
      capacityGal: this.fuelCapacityGal,
      consumptionRateGalPerSec: this.consumptionRateGalPerSec,
    };
  }
}

export default FuelEngine;
