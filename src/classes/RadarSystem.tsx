import Logger from "./Logger";
import Storage from "./Storage";
import InstrumentManager from "./InstrumentManager";

const log = Logger.create("RadarSystem");

export interface RadarTarget {
  id: string;
  callsign: string;
  distance: number;
  bearing: number;
  altitude: number;
  relativeAltitude: number;
  aircraftType: string;
  lastUpdate: number;
}

export interface RadarSettings {
  range: number;
  showLabels: boolean;
  sweepSpeed: number;
}

const STORAGE_KEYS = {
  range: "radar_range",
  showLabels: "radar_show_labels",
  sweepSpeed: "radar_sweep_speed",
};

const DEFAULT_SETTINGS: RadarSettings = {
  range: 50,
  showLabels: true,
  sweepSpeed: 4,
};

const NM_TO_METERS = 1852;
export const RADAR_INSTRUMENT_NAME = "efiRadar";

/**
 * RadarSystem - Radar logic and data processing
 * 
 * This class handles:
 * - Target tracking and calculations
 * - Animation values for GeoFS
 * - Settings management
 * - Sweep animation
 * - Blip rendering
 * 
 * Instrument creation/management is delegated to InstrumentManager
 */
class RadarSystem {
  // State
  static isActive: boolean = false;
  static settings: RadarSettings = { ...DEFAULT_SETTINGS };
  static targets: Map<string, RadarTarget> = new Map();

  // Animation
  static sweepAngle: number = 0;
  static lastSweepTime: number = 0;

  // Intervals
  static updateInterval: number | null = null;
  static sweepInterval: number | null = null;

  // ============================================
  // INSTRUMENT DEFINITION (used by InstrumentManager)
  // ============================================

  static getInstrumentDefinition(): InstrumentDef {
    return {
      name: RADAR_INSTRUMENT_NAME,
      container: ".geofs-instruments-container",
      stackX: true,
      compositors: "css",
      visibility: true,
      animations: [
        { value: 'view', type: 'show', notEq: 'cockpit' }
      ],
      overlay: {
        url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3C/svg%3E",
        anchor: { x: 100, y: 100 },
        position: { x: 100, y: 100 },
        rescale: true,
        rescalePosition: true,
        size: { x: 200, y: 200 },
        class: "efi-radar-background geofs-instrument-background",
        overlays: [
          {
            class: "efi-radar-screen",
            anchor: { x: 100, y: 100 },
            size: { x: 200, y: 200 },
            position: { x: 0, y: 0 },
          },
        ],
      },
      onInit: () => RadarSystem.onInstrumentReady(),
      onDestroy: () => RadarSystem.onInstrumentDestroyed(),
      onShow: () => log.debug("Radar instrument shown"),
      onHide: () => log.debug("Radar instrument hidden"),
    };
  }

  static getStyles(): string {
    return `
      .efi-radar-background {
        position: relative;
      }

      .efi-radar-screen {
        position: absolute;
        width: 200px;
        height: 200px;
        background: radial-gradient(circle, rgba(0, 20, 0, 0.95) 0%, rgba(0, 10, 0, 0.98) 100%);
        border-radius: 50%;
        border: 3px solid #1a3a1a;
        box-shadow: 
          inset 0 0 40px rgba(0, 255, 0, 0.08),
          inset 0 0 10px rgba(0, 255, 0, 0.15),
          0 0 15px rgba(0, 0, 0, 0.6);
        overflow: hidden;
      }

      .efi-radar-grid {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transform-origin: center center;
        transition: transform 0.1s linear;
      }

      .efi-radar-ring {
        position: absolute;
        border: 1px solid rgba(0, 255, 0, 0.3);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .efi-radar-ring-1 { width: 33%; height: 33%; }
      .efi-radar-ring-2 { width: 66%; height: 66%; }
      .efi-radar-ring-3 { width: 95%; height: 95%; }

      .efi-radar-crosshair-h,
      .efi-radar-crosshair-v {
        position: absolute;
        background: rgba(0, 255, 0, 0.2);
      }

      .efi-radar-crosshair-h {
        width: 100%;
        height: 1px;
        top: 50%;
        left: 0;
      }

      .efi-radar-crosshair-v {
        width: 1px;
        height: 100%;
        top: 0;
        left: 50%;
      }

      .efi-radar-cardinal {
        position: absolute;
        color: rgba(0, 255, 0, 0.9);
        font-size: 10px;
        font-weight: bold;
        font-family: Arial, sans-serif;
        text-shadow: 0 0 4px rgba(0, 255, 0, 0.5);
      }

      .efi-radar-n { top: 3px; left: 50%; transform: translateX(-50%); }
      .efi-radar-s { bottom: 3px; left: 50%; transform: translateX(-50%) rotate(180deg); }
      .efi-radar-e { right: 3px; top: 50%; transform: translateY(-50%) rotate(90deg); }
      .efi-radar-w { left: 3px; top: 50%; transform: translateY(-50%) rotate(-90deg); }

      .efi-radar-sweep-trail {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        border-radius: 50%;
        transform-origin: center center;
        background: conic-gradient(
          from 90deg at 50% 50%,
          transparent 0deg,
          transparent 270deg,
          rgba(0, 255, 0, 0.03) 290deg,
          rgba(0, 255, 0, 0.08) 310deg,
          rgba(0, 255, 0, 0.15) 330deg,
          rgba(0, 255, 0, 0.25) 345deg,
          rgba(0, 255, 0, 0.35) 355deg,
          rgba(0, 255, 0, 0.45) 360deg
        );
        mask-image: radial-gradient(circle, transparent 5%, black 8%, black 92%, transparent 95%);
        -webkit-mask-image: radial-gradient(circle, transparent 5%, black 8%, black 92%, transparent 95%);
      }

      .efi-radar-sweep-line {
        position: absolute;
        width: 50%;
        height: 2px;
        top: 50%;
        left: 50%;
        transform-origin: left center;
        background: linear-gradient(90deg, 
          rgba(0, 255, 0, 1) 0%, 
          rgba(0, 255, 0, 0.7) 40%,
          rgba(0, 255, 0, 0.3) 70%,
          transparent 100%
        );
        box-shadow: 0 0 6px rgba(0, 255, 0, 0.9), 0 0 12px rgba(0, 255, 0, 0.5);
        margin-top: -1px;
      }

      .efi-radar-heading-indicator {
        position: absolute;
        top: 5px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 8px solid rgba(0, 255, 0, 0.9);
        filter: drop-shadow(0 0 3px rgba(0, 255, 0, 0.8));
      }

      .efi-radar-center {
        position: absolute;
        width: 10px;
        height: 10px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, #00ff00 30%, rgba(0, 255, 0, 0.6) 100%);
        border-radius: 50%;
        box-shadow: 0 0 8px #00ff00, 0 0 16px rgba(0, 255, 0, 0.6);
      }

      .efi-radar-blips {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .efi-radar-blip {
        position: absolute;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, #00ff00 40%, rgba(0, 255, 0, 0.4) 100%);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 4px #00ff00, 0 0 8px rgba(0, 255, 0, 0.6);
        transition: opacity 0.3s ease-out;
      }

      .efi-radar-blip-above {
        background: radial-gradient(circle, #00ffff 40%, rgba(0, 255, 255, 0.4) 100%);
        box-shadow: 0 0 4px #00ffff, 0 0 8px rgba(0, 255, 255, 0.6);
      }

      .efi-radar-blip-below {
        background: radial-gradient(circle, #ffff00 40%, rgba(255, 255, 0, 0.4) 100%);
        box-shadow: 0 0 4px #ffff00, 0 0 8px rgba(255, 255, 0, 0.6);
      }

      .efi-radar-blip-label {
        position: absolute;
        left: 12px;
        top: -3px;
        font-size: 9px;
        color: inherit;
        white-space: nowrap;
        text-shadow: 0 0 4px #000, 1px 1px 2px #000;
        font-family: monospace;
        opacity: 0.9;
      }
    `;
  }

  // ============================================
  // INSTRUMENT CALLBACKS
  // ============================================

  static onInstrumentReady(): void {
    this.createRadarElements();
    log.debug("Radar instrument ready");
  }

  static onInstrumentDestroyed(): void {
    this.stopUpdating();
    log.debug("Radar instrument destroyed");
  }

  // ============================================
  // SETTINGS
  // ============================================

  static async loadSettings(): Promise<void> {
    try {
      const range = await Storage.get(STORAGE_KEYS.range);
      const showLabels = await Storage.get(STORAGE_KEYS.showLabels);
      const sweepSpeed = await Storage.get(STORAGE_KEYS.sweepSpeed);

      if (typeof range === "number") this.settings.range = range;
      if (typeof showLabels === "boolean") this.settings.showLabels = showLabels;
      if (typeof sweepSpeed === "number") this.settings.sweepSpeed = sweepSpeed;

      log.debug("Loaded radar settings:", this.settings);
    } catch (error) {
      log.error("Failed to load radar settings:", error);
    }
  }

  static saveSettings(): void {
    try {
      Storage.write(STORAGE_KEYS.range, this.settings.range);
      Storage.write(STORAGE_KEYS.showLabels, this.settings.showLabels);
      Storage.write(STORAGE_KEYS.sweepSpeed, this.settings.sweepSpeed);
    } catch (error) {
      log.error("Failed to save radar settings:", error);
    }
  }

  static setRange(range: number): void {
    this.settings.range = Math.max(5, Math.min(100, range));
    this.saveSettings();
  }

  static setShowLabels(show: boolean): void {
    this.settings.showLabels = show;
    this.saveSettings();
  }

  static setSweepSpeed(speed: number): void {
    this.settings.sweepSpeed = Math.max(2, Math.min(10, speed));
    this.saveSettings();
  }

  // ============================================
  // ACTIVATION / DEACTIVATION
  // ============================================

  static async activate(): Promise<void> {
    if (this.isActive) return;

    await this.loadSettings();
    this.injectStyles();

    // Use InstrumentManager for instrument lifecycle
    InstrumentManager.init();

    if (!InstrumentManager.isActive(RADAR_INSTRUMENT_NAME)) {
      InstrumentManager.registerDefinition(this.getInstrumentDefinition());
      InstrumentManager.activateInstrument(RADAR_INSTRUMENT_NAME);
    } else {
      InstrumentManager.show(RADAR_INSTRUMENT_NAME);
    }

    this.startUpdating();
    this.isActive = true;
    log.info("Radar system activated");
  }

  static deactivate(): void {
    if (!this.isActive) return;

    this.stopUpdating();
    this.targets.clear();

    // Just hide, don't destroy
    InstrumentManager.hide(RADAR_INSTRUMENT_NAME);

    this.isActive = false;
    log.info("Radar system deactivated");
  }

  // ============================================
  // UPDATE LOOP
  // ============================================

  static startUpdating(): void {
    this.stopUpdating();

    this.updateInterval = window.setInterval(() => {
      const geofs = (unsafeWindow as any).geofs;
      if (!geofs || geofs.pause) return;

      this.updateTargets();
    }, 500);

    this.sweepInterval = window.setInterval(() => {
      const geofs = (unsafeWindow as any).geofs;
      if (!geofs || geofs.pause) return;

      this.updateSweep();
    }, 50);

    this.lastSweepTime = Date.now();
  }

  static stopUpdating(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    if (this.sweepInterval) {
      clearInterval(this.sweepInterval);
      this.sweepInterval = null;
    }
  }

  // ============================================
  // SWEEP & RENDERING
  // ============================================

  static updateSweep(): void {
    const now = Date.now();
    const elapsed = Math.min((now - this.lastSweepTime) / 1000, 0.1);
    const degreesPerSecond = 360 / this.settings.sweepSpeed;

    this.sweepAngle = (this.sweepAngle + elapsed * degreesPerSecond) % 360;
    this.lastSweepTime = now;

    const sweepLine = document.querySelector(".efi-radar-sweep-line") as HTMLElement;
    const sweepTrail = document.querySelector(".efi-radar-sweep-trail") as HTMLElement;

    if (sweepLine) sweepLine.style.transform = `rotate(${this.sweepAngle}deg)`;
    if (sweepTrail) sweepTrail.style.transform = `rotate(${this.sweepAngle}deg)`;

    const geofs = (unsafeWindow as any).geofs;
    const heading = geofs?.animation?.values?.heading || 0;
    this.updateCardinalDirections(heading);
    this.renderBlips();
  }

  static updateCardinalDirections(heading: number): void {
    const grid = document.querySelector(".efi-radar-grid") as HTMLElement;
    if (grid) {
      grid.style.transform = `rotate(${-heading}deg)`;
    }
  }

  static createRadarElements(): void {
    const screen = document.querySelector(".efi-radar-screen");
    if (!screen) {
      log.warn("Radar screen not found, retrying...");
      setTimeout(() => this.createRadarElements(), 200);
      return;
    }

    screen.innerHTML = "";

    const grid = document.createElement("div");
    grid.className = "efi-radar-grid";
    grid.innerHTML = `
      <div class="efi-radar-ring efi-radar-ring-1"></div>
      <div class="efi-radar-ring efi-radar-ring-2"></div>
      <div class="efi-radar-ring efi-radar-ring-3"></div>
      <div class="efi-radar-crosshair-h"></div>
      <div class="efi-radar-crosshair-v"></div>
      <span class="efi-radar-cardinal efi-radar-n">N</span>
      <span class="efi-radar-cardinal efi-radar-e">E</span>
      <span class="efi-radar-cardinal efi-radar-s">S</span>
      <span class="efi-radar-cardinal efi-radar-w">W</span>
    `;
    screen.appendChild(grid);

    const sweepTrail = document.createElement("div");
    sweepTrail.className = "efi-radar-sweep-trail";
    screen.appendChild(sweepTrail);

    const sweepLine = document.createElement("div");
    sweepLine.className = "efi-radar-sweep-line";
    screen.appendChild(sweepLine);

    const center = document.createElement("div");
    center.className = "efi-radar-center";
    screen.appendChild(center);

    const headingIndicator = document.createElement("div");
    headingIndicator.className = "efi-radar-heading-indicator";
    screen.appendChild(headingIndicator);

    const blips = document.createElement("div");
    blips.className = "efi-radar-blips";
    screen.appendChild(blips);

    log.debug("Radar elements created");
  }

  static renderBlips(): void {
    const blipsContainer = document.querySelector(".efi-radar-blips");
    if (!blipsContainer) return;

    const geofs = (unsafeWindow as any).geofs;
    const heading = geofs?.animation?.values?.heading || 0;

    blipsContainer.innerHTML = "";

    const rangeMeters = this.settings.range * NM_TO_METERS;
    const radius = 85;

    for (const [, target] of this.targets) {
      const normalizedDistance = target.distance / rangeMeters;
      if (normalizedDistance > 1) continue;

      const distancePixels = normalizedDistance * radius;
      const relativeBearing = (target.bearing - heading + 360) % 360;
      const angleRad = this.toRad(relativeBearing - 90);

      const x = Math.cos(angleRad) * distancePixels;
      const y = Math.sin(angleRad) * distancePixels;

      const angleDiff = (relativeBearing - this.sweepAngle + 360) % 360;
      const intensity = angleDiff < 90 ? 1 - angleDiff / 90 : 0.15;

      const blip = document.createElement("div");
      blip.className = "efi-radar-blip";

      if (target.relativeAltitude > 300) {
        blip.classList.add("efi-radar-blip-above");
      } else if (target.relativeAltitude < -300) {
        blip.classList.add("efi-radar-blip-below");
      }

      blip.style.left = `calc(50% + ${x}px)`;
      blip.style.top = `calc(50% + ${y}px)`;
      blip.style.opacity = String(0.15 + intensity * 0.85);

      if (this.settings.showLabels && intensity > 0.3) {
        const label = document.createElement("span");
        label.className = "efi-radar-blip-label";
        label.textContent = target.callsign.substring(0, 5);
        blip.appendChild(label);
      }

      blipsContainer.appendChild(blip);
    }
  }

  // ============================================
  // TARGET TRACKING
  // ============================================

  static updateTargets(): void {
    const geofs = (unsafeWindow as any).geofs;
    const multiplayer = (unsafeWindow as any).multiplayer;
    const ownAircraft = geofs?.aircraft?.instance;

    if (!ownAircraft || !multiplayer?.users) return;

    const ownLla = ownAircraft.llaLocation;
    if (!ownLla) return;

    const [ownLat, ownLon, ownAlt] = ownLla;
    const rangeMeters = this.settings.range * NM_TO_METERS;
    const now = Date.now();
    const activeIds = new Set<string>();

    for (const [userId, userData] of Object.entries(multiplayer.users) as [string, any][]) {
      const coords = userData?.lastUpdate?.co || userData?.referenceCoord;
      if (!coords || !Array.isArray(coords) || coords.length < 2) continue;

      const [targetLat, targetLon, targetAlt = 0] = coords;
      const distance = this.calculateDistance(ownLat, ownLon, targetLat, targetLon);

      if (distance > rangeMeters) continue;

      const absoluteBearing = this.calculateBearing(ownLat, ownLon, targetLat, targetLon);

      activeIds.add(userId);
      this.targets.set(userId, {
        id: userId,
        callsign: userData.callsign || userId.substring(0, 6),
        distance,
        bearing: absoluteBearing,
        altitude: targetAlt,
        relativeAltitude: targetAlt - ownAlt,
        aircraftType: userData.aircraft?.toString() || "unknown",
        lastUpdate: now,
      });
    }

    // Remove stale targets
    for (const [id] of this.targets) {
      if (!activeIds.has(id)) {
        this.targets.delete(id);
      }
    }
  }

  // ============================================
  // MATH UTILITIES
  // ============================================

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = this.toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(this.toRad(lat2));
    const x =
      Math.cos(this.toRad(lat1)) * Math.sin(this.toRad(lat2)) -
      Math.sin(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) * Math.cos(dLon);
    return (this.toDeg(Math.atan2(y, x)) + 360) % 360;
  }

  static toRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  static toDeg(rad: number): number {
    return rad * (180 / Math.PI);
  }

  // ============================================
  // STYLES
  // ============================================

  static injectStyles(): void {
    const styleId = "efi-radar-styles";
    if (document.getElementById(styleId)) return;

    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = this.getStyles();
    document.head.appendChild(style);
  }
}

export default RadarSystem;
