import Logger from "../../shared/Logger";
import Storage from "../../shared/Storage";
import InstrumentManager from "../../shared/InstrumentManager";
import type { TransportMission } from "../career/TransportEngine";
import { getGeoFSRunways, calculateDistanceNm, calculateBearingDeg } from "../career/AirportDatabase";

const log = Logger.create("RadarEngine");

export interface RadarTarget {
  id: string;
  callsign: string;
  distance: number;        // Meters
  distanceNm: number;      // NM
  bearing: number;
  altitude: number;
  relativeAltitude: number; // Positive = Above, Negative = Below
  aircraftType: string;
  lastUpdate: number;
}

export interface RadarSettings {
  range: number;
  showLabels: boolean;
  sweepSpeed: number;
  showDestination: boolean;
  showAirports: boolean;
  showTerrainMap: boolean;
  showTraffic: boolean;
  airborneTrafficOnly: boolean;
  blimpEffect: boolean;
  blimpOpacity: number;
}

const STORAGE_KEYS = {
  range: "radar_range",
  showLabels: "radar_show_labels",
  sweepSpeed: "radar_sweep_speed",
  showDestination: "radar_show_destination",
  showAirports: "radar_show_airports",
  showTerrainMap: "radar_show_terrain_map",
  showTraffic: "radar_show_traffic",
  airborneTrafficOnly: "radar_airborne_only",
  blimpEffect: "radar_blimp_effect",
  blimpOpacity: "radar_blimp_opacity",
};

const DEFAULT_SETTINGS: RadarSettings = {
  range: 50,
  showLabels: true,
  sweepSpeed: 4,
  showDestination: true,
  showAirports: true,
  showTerrainMap: true,
  showTraffic: true,
  airborneTrafficOnly: false,
  blimpEffect: true,
  blimpOpacity: 0.9,
};

const NM_TO_METERS = 1852;
export const RADAR_INSTRUMENT_NAME = "efiRadar";

interface BlipDOMEntry {
  rootEl: HTMLElement;
  labelEl: HTMLElement;
  lastSweptTime: number;
}

// Memory tile cache for pure Land/Sea monochromatic tiles
const mapTileCache = new Map<string, HTMLImageElement>();
const processedTileCanvasCache = new Map<string, HTMLCanvasElement>();

export class RadarEngine {
  static isActive: boolean = false;
  static settings: RadarSettings = { ...DEFAULT_SETTINGS };
  static targets: Map<string, RadarTarget> = new Map();

  // Persistent Zero-Flicker DOM Caches
  private static blipDOMMap = new Map<string, BlipDOMEntry>();
  private static airportDOMMap = new Map<string, HTMLElement>();

  static sweepAngle: number = 0;
  static lastSweepTime: number = 0;

  static updateInterval: number | null = null;
  static sweepInterval: number | null = null;

  static getInstrumentDefinition(): InstrumentDef {
    return {
      name: RADAR_INSTRUMENT_NAME,
      container: ".geofs-instruments-container",
      stackX: true,
      compositors: "css",
      visibility: true,
      animations: [{ value: "view", type: "show", notEq: "cockpit" }],
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
      onInit: () => RadarEngine.createRadarElements(),
      onDestroy: () => RadarEngine.stopUpdating(),
    };
  }

  static getStyles(): string {
    return `
      .efi-radar-background { position: relative; }
      .efi-radar-screen {
        position: absolute;
        width: 200px;
        height: 200px;
        background: #020904;
        border-radius: 50%;
        border: 3px solid #132a18;
        box-shadow: inset 0 0 40px rgba(0, 255, 100, 0.08), inset 0 0 10px rgba(0, 255, 100, 0.15), 0 0 15px rgba(0, 0, 0, 0.7);
        overflow: hidden;
      }

      /* Pure Monochromatic Land/Sea Map Canvas Layer */
      .efi-radar-map-canvas {
        position: absolute;
        width: 200px;
        height: 200px;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 1;
        opacity: 0.92;
      }

      .efi-radar-grid {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transform-origin: center center;
        transition: transform 0.08s linear;
        pointer-events: none;
        z-index: 3;
      }
      .efi-radar-ring {
        position: absolute;
        border: 1px solid rgba(0, 255, 120, 0.22);
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
      .efi-radar-ring-1 { width: 33%; height: 33%; }
      .efi-radar-ring-2 { width: 66%; height: 66%; }
      .efi-radar-ring-3 { width: 95%; height: 95%; }
      .efi-radar-crosshair-h, .efi-radar-crosshair-v {
        position: absolute;
        background: rgba(0, 255, 120, 0.16);
      }
      .efi-radar-crosshair-h { width: 100%; height: 1px; top: 50%; left: 0; }
      .efi-radar-crosshair-v { width: 1px; height: 100%; top: 0; left: 50%; }
      .efi-radar-cardinal {
        position: absolute;
        color: rgba(0, 255, 120, 0.9);
        font-size: 9px;
        font-weight: bold;
        font-family: Arial, sans-serif;
      }
      .efi-radar-n { top: 3px; left: 50%; transform: translateX(-50%); }
      .efi-radar-s { bottom: 3px; left: 50%; transform: translateX(-50%) rotate(180deg); }
      .efi-radar-e { right: 3px; top: 50%; transform: translateY(-50%) rotate(90deg); }
      .efi-radar-w { left: 3px; top: 50%; transform: translateY(-50%) rotate(-90deg); }

      /* SVG Vector Navigation Layer (Autopilot & Career lines) */
      .efi-radar-svg-layer {
        position: absolute;
        width: 200px;
        height: 200px;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 4;
      }

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
          rgba(0, 255, 120, 0.02) 290deg,
          rgba(0, 255, 120, 0.12) 330deg,
          rgba(0, 255, 120, 0.38) 360deg
        );
        pointer-events: none;
        z-index: 5;
      }
      .efi-radar-sweep-line {
        position: absolute;
        width: 50%;
        height: 2px;
        top: 50%;
        left: 50%;
        transform-origin: left center;
        background: linear-gradient(90deg, rgba(0, 255, 120, 1) 0%, rgba(0, 255, 120, 0.3) 70%, transparent 100%);
        margin-top: -1px;
        pointer-events: none;
        z-index: 6;
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
        border-bottom: 8px solid rgba(0, 255, 120, 0.9);
        z-index: 8;
        pointer-events: none;
      }
      .efi-radar-center {
        position: absolute;
        width: 8px;
        height: 8px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, #00ff88 30%, rgba(0, 255, 136, 0.6) 100%);
        border-radius: 50%;
        z-index: 10;
        pointer-events: none;
      }

      .efi-radar-airports-layer {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 7;
      }
      .efi-radar-blips {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 8;
      }
      .efi-radar-overlay-labels {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 9;
      }

      /* Altitude Difference Color Coding */
      .efi-radar-blip {
        position: absolute;
        width: 7px;
        height: 7px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: opacity 0.05s linear;
        will-change: transform, opacity;
      }
      .efi-blip-level {
        background: #fbbf24;
        box-shadow: 0 0 7px #fbbf24;
      }
      .efi-blip-above {
        background: #00e5ff;
        box-shadow: 0 0 7px #00e5ff;
      }
      .efi-blip-below {
        background: #10b981;
        box-shadow: 0 0 6px #10b981;
      }

      .efi-radar-blip-label {
        position: absolute;
        top: 8px;
        left: 50%;
        font-size: 8px;
        font-family: monospace;
        font-weight: bold;
        white-space: nowrap;
        text-shadow: 0 0 3px #000000, 0 0 6px #000000;
        pointer-events: none;
      }
      .efi-label-level { color: #fbbf24; }
      .efi-label-above { color: #38bdf8; }
      .efi-label-below { color: #34d399; }

      .efi-radar-airport-blip {
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
      }
      .efi-radar-airport-icon {
        width: 6px;
        height: 6px;
        border: 1px solid #38bdf8;
        background: rgba(56, 189, 248, 0.4);
        border-radius: 1px;
        box-shadow: 0 0 4px #38bdf8;
      }
      .efi-radar-airport-label {
        margin-top: 1px;
        color: #38bdf8;
        font-size: 7.5px;
        font-family: monospace;
        font-weight: bold;
        white-space: nowrap;
        text-shadow: 0 0 3px #000000;
      }

      .efi-radar-dest-tag {
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
      }
      .efi-radar-dest-circle {
        width: 18px;
        height: 18px;
        border: 1.5px dashed #00e5ff;
        background: rgba(0, 229, 255, 0.15);
        border-radius: 50%;
        box-shadow: 0 0 8px #00e5ff;
      }
      .efi-radar-dest-tag-text {
        margin-top: 2px;
        color: #00e5ff;
        font-size: 8px;
        font-weight: bold;
        font-family: monospace;
        text-shadow: 0 0 4px #000000;
        white-space: nowrap;
      }

      .efi-radar-lnav-tag {
        position: absolute;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: none;
      }
      .efi-radar-lnav-box {
        width: 8px;
        height: 8px;
        border: 1.5px solid #ec4899;
        background: rgba(236, 72, 153, 0.45);
        border-radius: 2px;
        box-shadow: 0 0 6px #ec4899;
      }
      .efi-radar-lnav-tag-text {
        margin-top: 2px;
        color: #f472b6;
        font-size: 8px;
        font-weight: bold;
        font-family: monospace;
        text-shadow: 0 0 4px #000000;
        white-space: nowrap;
      }
    `;
  }

  static async loadSettings(): Promise<void> {
    try {
      const savedRange = await Storage.get(STORAGE_KEYS.range);
      const savedLabels = await Storage.get(STORAGE_KEYS.showLabels);
      const savedSpeed = await Storage.get(STORAGE_KEYS.sweepSpeed);
      const savedDest = await Storage.get(STORAGE_KEYS.showDestination);
      const savedAirports = await Storage.get(STORAGE_KEYS.showAirports);
      const savedTerrain = await Storage.get(STORAGE_KEYS.showTerrainMap);
      const savedTraffic = await Storage.get(STORAGE_KEYS.showTraffic);
      const savedAirborne = await Storage.get(STORAGE_KEYS.airborneTrafficOnly);
      const savedBlimp = await Storage.get(STORAGE_KEYS.blimpEffect);
      const savedOpacity = await Storage.get(STORAGE_KEYS.blimpOpacity);

      if (typeof savedRange === "number") this.settings.range = savedRange;
      if (typeof savedLabels === "boolean") this.settings.showLabels = savedLabels;
      if (typeof savedSpeed === "number") this.settings.sweepSpeed = savedSpeed;
      if (typeof savedDest === "boolean") this.settings.showDestination = savedDest;
      if (typeof savedAirports === "boolean") this.settings.showAirports = savedAirports;
      if (typeof savedTerrain === "boolean") this.settings.showTerrainMap = savedTerrain;
      if (typeof savedTraffic === "boolean") this.settings.showTraffic = savedTraffic;
      if (typeof savedAirborne === "boolean") this.settings.airborneTrafficOnly = savedAirborne;
      if (typeof savedBlimp === "boolean") this.settings.blimpEffect = savedBlimp;
      if (typeof savedOpacity === "number") this.settings.blimpOpacity = savedOpacity;
    } catch (e) {
      log.error("Failed to load radar settings:", e);
    }
  }

  static saveSettings(): void {
    try {
      Storage.write(STORAGE_KEYS.range, this.settings.range);
      Storage.write(STORAGE_KEYS.showLabels, this.settings.showLabels);
      Storage.write(STORAGE_KEYS.sweepSpeed, this.settings.sweepSpeed);
      Storage.write(STORAGE_KEYS.showDestination, this.settings.showDestination);
      Storage.write(STORAGE_KEYS.showAirports, this.settings.showAirports);
      Storage.write(STORAGE_KEYS.showTerrainMap, this.settings.showTerrainMap);
      Storage.write(STORAGE_KEYS.showTraffic, this.settings.showTraffic);
      Storage.write(STORAGE_KEYS.airborneTrafficOnly, this.settings.airborneTrafficOnly);
      Storage.write(STORAGE_KEYS.blimpEffect, this.settings.blimpEffect);
      Storage.write(STORAGE_KEYS.blimpOpacity, this.settings.blimpOpacity);
    } catch (e) {
      log.error("Failed to save radar settings:", e);
    }
  }

  static setRange(range: number): void {
    this.settings.range = Math.max(5, Math.min(200, range));
    this.saveSettings();
  }

  static setSweepSpeed(speed: number): void {
    this.settings.sweepSpeed = Math.max(1, Math.min(20, speed));
    this.saveSettings();
  }

  static setShowLabels(show: boolean): void {
    this.settings.showLabels = show;
    this.saveSettings();
    if (!show) {
      for (const [, entry] of this.blipDOMMap) {
        entry.labelEl.style.display = "none";
      }
    }
  }

  static setShowDestination(show: boolean): void {
    this.settings.showDestination = show;
    this.saveSettings();
    if (!show) {
      const svgLayer = document.querySelector(".efi-radar-svg-layer");
      if (svgLayer) svgLayer.innerHTML = "";
      const overlay = document.querySelector(".efi-radar-overlay-labels");
      if (overlay) overlay.innerHTML = "";
    }
  }

  static setShowAirports(show: boolean): void {
    this.settings.showAirports = show;
    this.saveSettings();
    if (!show) {
      for (const [, el] of this.airportDOMMap) el.remove();
      this.airportDOMMap.clear();
    }
  }

  static setShowTerrainMap(show: boolean): void {
    this.settings.showTerrainMap = show;
    this.saveSettings();
    if (!show) {
      const canvas = document.querySelector(".efi-radar-map-canvas") as HTMLCanvasElement;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }

  static setShowTraffic(show: boolean): void {
    this.settings.showTraffic = show;
    this.saveSettings();
    if (!show) {
      for (const [, entry] of this.blipDOMMap) entry.rootEl.remove();
      this.blipDOMMap.clear();
      this.targets.clear();
    }
  }

  static setAirborneTrafficOnly(airborneOnly: boolean): void {
    this.settings.airborneTrafficOnly = airborneOnly;
    this.saveSettings();
  }

  static setBlimpEffect(enabled: boolean): void {
    this.settings.blimpEffect = enabled;
    this.saveSettings();
  }

  static setBlimpOpacity(opacity: number): void {
    this.settings.blimpOpacity = Math.max(0.1, Math.min(1.0, opacity));
    this.saveSettings();
  }

  static async activate(): Promise<void> {
    if (this.isActive) return;
    this.isActive = true;

    await this.loadSettings();
    this.injectStyles();

    InstrumentManager.init();
    if (!InstrumentManager.isActive(RADAR_INSTRUMENT_NAME)) {
      InstrumentManager.registerDefinition(this.getInstrumentDefinition());
      InstrumentManager.activateInstrument(RADAR_INSTRUMENT_NAME);
    }

    this.startUpdating();
    log.info("RadarEngine activated");
  }

  static deactivate(): void {
    if (!this.isActive) return;
    this.isActive = false;

    this.stopUpdating();
    this.clearAllRadarDOM();
    InstrumentManager.deactivateInstrument(RADAR_INSTRUMENT_NAME);
    log.info("RadarEngine deactivated");
  }

  static clearAllRadarDOM(): void {
    for (const [, entry] of this.blipDOMMap) entry.rootEl.remove();
    this.blipDOMMap.clear();

    for (const [, el] of this.airportDOMMap) el.remove();
    this.airportDOMMap.clear();

    const svgLayer = document.querySelector(".efi-radar-svg-layer");
    if (svgLayer) svgLayer.innerHTML = "";

    const overlay = document.querySelector(".efi-radar-overlay-labels");
    if (overlay) overlay.innerHTML = "";

    const canvas = document.querySelector(".efi-radar-map-canvas") as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  static startUpdating(): void {
    if (this.updateInterval) return;

    this.lastSweepTime = Date.now();
    this.updateTargetsDirect();

    // Data polling loop - runs every 250ms
    this.updateInterval = window.setInterval(() => {
      this.updateAirports();
      this.renderNavigationVectors();
      this.renderPureLandSeaMap();
    }, 250);

    // High frequency 60 FPS sweep line and phosphor render loop - runs every 30ms
    this.sweepInterval = window.setInterval(() => {
      this.updateTargetsDirect();
      this.renderFrame();
    }, 30);
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

  static createRadarElements(): void {
    const screen = document.querySelector(".efi-radar-screen");
    if (!screen) {
      setTimeout(() => this.createRadarElements(), 200);
      return;
    }

    screen.innerHTML = `
      <canvas class="efi-radar-map-canvas" width="200" height="200"></canvas>
      <div class="efi-radar-grid">
        <div class="efi-radar-ring efi-radar-ring-1"></div>
        <div class="efi-radar-ring efi-radar-ring-2"></div>
        <div class="efi-radar-ring efi-radar-ring-3"></div>
        <div class="efi-radar-crosshair-h"></div>
        <div class="efi-radar-crosshair-v"></div>
        <span class="efi-radar-cardinal efi-radar-n">N</span>
        <span class="efi-radar-cardinal efi-radar-e">E</span>
        <span class="efi-radar-cardinal efi-radar-s">S</span>
        <span class="efi-radar-cardinal efi-radar-w">W</span>
      </div>
      <svg class="efi-radar-svg-layer" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"></svg>
      <div class="efi-radar-sweep-trail"></div>
      <div class="efi-radar-sweep-line"></div>
      <div class="efi-radar-airports-layer"></div>
      <div class="efi-radar-blips"></div>
      <div class="efi-radar-overlay-labels"></div>
      <div class="efi-radar-center"></div>
      <div class="efi-radar-heading-indicator"></div>
    `;
  }

  /**
   * Pure Monochromatic Land vs Sea Shader:
   * Classifies water vs land without ANY red roads, text, or clutter!
   * Sea: Deep Night Black (#010704)
   * Land: Uniform Tactical Dark Green (#0a2916)
   */
  static processTileToPureLandSea(img: HTMLImageElement, tileKey: string): HTMLCanvasElement {
    let processed = processedTileCanvasCache.get(tileKey);
    if (processed) return processed;

    const pCanvas = document.createElement("canvas");
    pCanvas.width = img.naturalWidth || 256;
    pCanvas.height = img.naturalHeight || 256;
    const pCtx = pCanvas.getContext("2d");
    if (!pCtx) return pCanvas;

    pCtx.drawImage(img, 0, 0);

    try {
      const imgData = pCtx.getImageData(0, 0, pCanvas.width, pCanvas.height);
      const data = imgData.data;

      // Classify each pixel: Water vs Land
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // In standard OSM tiles, water is characteristic blue/light-cyan (b > r + 15 and b > g - 10)
        // or light sea-blue rgb(~170, ~218, ~255) / rgb(181, 208, 208)
        const isWater = (b > r + 12 && b >= g - 8 && b > 140) || (b > 180 && r < 190 && g > 180);

        if (isWater) {
          // Pure Deep Night Black Water
          data[i] = 1;      // R
          data[i + 1] = 7;  // G
          data[i + 2] = 4;  // B
          data[i + 3] = 240;// Alpha
        } else {
          // Pure Monochromatic Tactical Dark Green Land (All roads/buildings unified into one clean tone)
          data[i] = 10;     // R
          data[i + 1] = 42; // G
          data[i + 2] = 22; // B
          data[i + 3] = 240;// Alpha
        }
      }

      pCtx.putImageData(imgData, 0, 0);
      processedTileCanvasCache.set(tileKey, pCanvas);
    } catch (e) {
      // Fallback in case of canvas security
      return pCanvas;
    }

    return pCanvas;
  }

  /**
   * Pure Land/Sea NM Bounded Map Renderer (Zero Red Lines, Zero Road Clutter)
   */
  static renderPureLandSeaMap(): void {
    if (!this.settings.showTerrainMap) return;

    const canvas = document.querySelector(".efi-radar-map-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const geofs = (unsafeWindow as any).geofs;
    const ownLla = geofs?.aircraft?.instance?.llaLocation;
    if (!ownLla) return;

    const [lat, lon] = ownLla;
    const heading = geofs?.animation?.values?.heading || 0;
    const rangeNm = this.settings.range;

    let zoom = 8;
    if (rangeNm <= 15) zoom = 10;
    else if (rangeNm <= 35) zoom = 9;
    else if (rangeNm <= 75) zoom = 8;
    else if (rangeNm <= 130) zoom = 7;
    else zoom = 6;

    const n = Math.pow(2, zoom);
    const radLat = (lat * Math.PI) / 180;
    const centerTileX = ((lon + 180) / 360) * n;
    const centerTileY = ((1 - Math.log(Math.tan(radLat) + 1 / Math.cos(radLat)) / Math.PI) / 2) * n;

    const tileXInt = Math.floor(centerTileX);
    const tileYInt = Math.floor(centerTileY);

    ctx.clearRect(0, 0, 200, 200);
    ctx.save();

    // Circular radar clip mask (NM range bounded)
    ctx.beginPath();
    ctx.arc(100, 100, 95, 0, Math.PI * 2);
    ctx.clip();

    // Default Deep Water Background
    ctx.fillStyle = "#010704";
    ctx.fillRect(0, 0, 200, 200);

    // Rotate map with aircraft heading
    ctx.translate(100, 100);
    ctx.rotate((-heading * Math.PI) / 180);

    const metersPerPixel = (156543.03392 * Math.cos(radLat)) / Math.pow(2, zoom);
    const pxPerMeter = 1 / metersPerPixel;
    const radarMetersRadius = rangeNm * NM_TO_METERS;
    const scaleFactor = (85 / radarMetersRadius) * (1 / pxPerMeter);

    const tileSize = 256 * scaleFactor;

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const tx = (tileXInt + dx + n) % n;
        const ty = tileYInt + dy;
        if (ty < 0 || ty >= n) continue;

        const tileKey = `pure_osm_${zoom}_${tx}_${ty}`;
        const url = `https://tile.openstreetmap.org/${zoom}/${tx}/${ty}.png`;

        let img = mapTileCache.get(tileKey);
        if (!img) {
          img = new Image();
          img.crossOrigin = "anonymous";
          img.src = url;
          img.onload = () => {
            RadarEngine.renderPureLandSeaMap();
          };
          mapTileCache.set(tileKey, img);
        }

        if (img.complete && img.naturalWidth > 0) {
          const processedCanvas = this.processTileToPureLandSea(img, tileKey);
          const drawX = (tx - centerTileX) * 256 * scaleFactor;
          const drawY = (ty - centerTileY) * 256 * scaleFactor;
          ctx.drawImage(processedCanvas, drawX, drawY, tileSize, tileSize);
        }
      }
    }

    ctx.restore();
  }

  /**
   * 60 FPS Render Frame: Sweep Line Rotation & Instant Phosphor Flash
   */
  static renderFrame(): void {
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
    const grid = document.querySelector(".efi-radar-grid") as HTMLElement;
    if (grid) grid.style.transform = `rotate(${-heading}deg)`;

    const blipsContainer = document.querySelector(".efi-radar-blips");
    if (!blipsContainer) return;

    const rangeMeters = this.settings.range * NM_TO_METERS;
    const radius = 85;
    const activeTargetIds = new Set<string>();

    for (const [id, target] of this.targets) {
      activeTargetIds.add(id);

      const normalizedDist = target.distance / rangeMeters;
      if (normalizedDist > 1) {
        const existing = this.blipDOMMap.get(id);
        if (existing) {
          existing.rootEl.remove();
          this.blipDOMMap.delete(id);
        }
        continue;
      }

      const distPx = normalizedDist * radius;
      const relBearing = (target.bearing - heading + 360) % 360;
      const angleRad = (relBearing - 90) * (Math.PI / 180);
      const x = Math.cos(angleRad) * distPx;
      const y = Math.sin(angleRad) * distPx;

      let colorClass = "efi-blip-level";
      let labelColorClass = "efi-label-level";

      if (target.relativeAltitude > 300) {
        colorClass = "efi-blip-above";
        labelColorClass = "efi-label-above";
      } else if (target.relativeAltitude < -300) {
        colorClass = "efi-blip-below";
        labelColorClass = "efi-label-below";
      }

      let entry = this.blipDOMMap.get(id);
      if (!entry) {
        const rootEl = document.createElement("div");
        rootEl.id = `efi-blip-${id}`;
        rootEl.className = `efi-radar-blip ${colorClass}`;

        const labelEl = document.createElement("span");
        labelEl.className = `efi-radar-blip-label ${labelColorClass}`;
        labelEl.textContent = target.callsign;
        rootEl.appendChild(labelEl);

        blipsContainer.appendChild(rootEl);
        entry = { rootEl, labelEl, lastSweptTime: now };
        this.blipDOMMap.set(id, entry);
      }

      entry.rootEl.className = `efi-radar-blip ${colorClass}`;
      entry.labelEl.className = `efi-radar-blip-label ${labelColorClass}`;
      entry.labelEl.textContent = target.callsign;

      entry.rootEl.style.left = `calc(50% + ${x.toFixed(1)}px)`;
      entry.rootEl.style.top = `calc(50% + ${y.toFixed(1)}px)`;

      const targetOpacity = this.settings.blimpOpacity !== undefined ? this.settings.blimpOpacity : 0.9;

      if (!this.settings.blimpEffect) {
        // Static transparent/clean mode: no blinking/decay, constantly visible at chosen target opacity
        entry.rootEl.style.opacity = targetOpacity.toFixed(2);
        if (!this.settings.showLabels) {
          entry.labelEl.style.display = "none";
        } else {
          entry.labelEl.style.display = "block";
          entry.labelEl.style.opacity = Math.min(1.0, targetOpacity * 1.1).toFixed(2);
        }
      } else {
        // Detect instant sweep line pass
        const anglePastNeedle = (this.sweepAngle - relBearing + 360) % 360;
        if (anglePastNeedle < 12) {
          entry.lastSweptTime = now;
        }

        const timeSinceSweep = (now - entry.lastSweptTime) / 1000;
        const decayDuration = this.settings.sweepSpeed * 0.95;
        const progress = Math.min(1.0, timeSinceSweep / decayDuration);
        
        // Peak intensity reaches user's configured blimpOpacity
        const maxAlpha = targetOpacity;
        const minAlpha = maxAlpha * 0.15;
        const intensity = Math.max(minAlpha, maxAlpha - progress * (maxAlpha - minAlpha));

        entry.rootEl.style.opacity = intensity.toFixed(2);

        if (!this.settings.showLabels) {
          entry.labelEl.style.display = "none";
        } else {
          entry.labelEl.style.display = intensity > (minAlpha * 1.8) ? "block" : "none";
          entry.labelEl.style.opacity = Math.min(1.0, intensity * 1.2).toFixed(2);
        }
      }
    }

    for (const [id, entry] of this.blipDOMMap) {
      if (!activeTargetIds.has(id)) {
        entry.rootEl.remove();
        this.blipDOMMap.delete(id);
      }
    }
  }

  /**
   * Update and cache nearby GeoFS airports on radar layer
   */
  static updateAirports(): void {
    const layer = document.querySelector(".efi-radar-airports-layer");
    if (!layer || !this.settings.showAirports) {
      if (layer && !this.settings.showAirports) layer.innerHTML = "";
      return;
    }

    const geofs = (unsafeWindow as any).geofs;
    const ownLla = geofs?.aircraft?.instance?.llaLocation;
    if (!ownLla) return;

    const heading = geofs?.animation?.values?.heading || 0;
    const rangeMeters = this.settings.range * NM_TO_METERS;
    const radius = 85;
    const allRunways = getGeoFSRunways();
    const activeIcaos = new Set<string>();

    for (const rw of allRunways) {
      const distMeters = this.calculateDistance(ownLla[0], ownLla[1], rw.lat, rw.lon);
      if (distMeters > rangeMeters || distMeters < 80) continue;

      const icaoKey = rw.icao;
      activeIcaos.add(icaoKey);

      const normalizedDist = distMeters / rangeMeters;
      const distPx = normalizedDist * radius;
      const bearing = this.calculateBearing(ownLla[0], ownLla[1], rw.lat, rw.lon);
      const relBearing = (bearing - heading + 360) % 360;
      const angleRad = (relBearing - 90) * (Math.PI / 180);
      const x = Math.cos(angleRad) * distPx;
      const y = Math.sin(angleRad) * distPx;

      let el = this.airportDOMMap.get(icaoKey);
      if (!el) {
        el = document.createElement("div");
        el.className = "efi-radar-airport-blip";
        el.innerHTML = `
          <div class="efi-radar-airport-icon"></div>
          <span class="efi-radar-airport-label">${rw.icao}</span>
        `;
        layer.appendChild(el);
        this.airportDOMMap.set(icaoKey, el);
      }

      el.style.left = `calc(50% + ${x.toFixed(1)}px)`;
      el.style.top = `calc(50% + ${y.toFixed(1)}px)`;
    }

    for (const [icao, el] of this.airportDOMMap) {
      if (!activeIcaos.has(icao)) {
        el.remove();
        this.airportDOMMap.delete(icao);
      }
    }
  }

  /**
   * SVG Vector Navigation Layer:
   * Exclusively renders active Career Contract Destination Vector from aircraft center
   * directly to the destination airfield center.
   */
  static renderNavigationVectors(): void {
    const svgLayer = document.querySelector(".efi-radar-svg-layer");
    const overlayLabels = document.querySelector(".efi-radar-overlay-labels");
    if (!svgLayer || !overlayLabels) return;

    if (!this.settings.showDestination) {
      svgLayer.innerHTML = "";
      overlayLabels.innerHTML = "";
      return;
    }

    const geofs = (unsafeWindow as any).geofs;
    const ownLla = geofs?.aircraft?.instance?.llaLocation;
    if (!ownLla) {
      svgLayer.innerHTML = "";
      overlayLabels.innerHTML = "";
      return;
    }

    const careerModule = (unsafeWindow as any).__efiCareerModule;
    const activeMission: TransportMission | null = careerModule?.currentMission;

    if (!activeMission) {
      svgLayer.innerHTML = "";
      overlayLabels.innerHTML = "";
      return;
    }

    const heading = geofs?.animation?.values?.heading || 0;
    const rangeMeters = this.settings.range * NM_TO_METERS;
    const radius = 85;
    const cx = 100;
    const cy = 100;

    const dest = activeMission.destinationAirport;
    const distMeters = this.calculateDistance(ownLla[0], ownLla[1], dest.lat, dest.lon);
    const distNm = (distMeters / NM_TO_METERS).toFixed(1);
    const bearing = this.calculateBearing(ownLla[0], ownLla[1], dest.lat, dest.lon);
    const relBearing = (bearing - heading + 360) % 360;
    const angleRad = ((relBearing - 90) * Math.PI) / 180;

    const normalizedDist = distMeters / rangeMeters;
    const clampedDistPx = Math.min(normalizedDist, 1.0) * radius;
    const targetX = cx + Math.cos(angleRad) * clampedDistPx;
    const targetY = cy + Math.sin(angleRad) * clampedDistPx;

    // Cyan Dashed Dispatch Route Line from EXACT aircraft center (100, 100) to EXACT destination center (targetX, targetY)
    const svgContent = `
      <line x1="${cx}" y1="${cy}" x2="${targetX.toFixed(1)}" y2="${targetY.toFixed(1)}" stroke="#00e5ff" stroke-width="2.2" stroke-dasharray="4 3" opacity="0.95" />
    `;

    let labelsContent = "";
    if (normalizedDist <= 1.0) {
      labelsContent = `
        <div class="efi-radar-dest-tag" style="left: ${targetX.toFixed(1)}px; top: ${targetY.toFixed(1)}px;">
          <div class="efi-radar-dest-circle"></div>
          <span class="efi-radar-dest-tag-text">🎯 ${activeMission.destinationIcao} (${distNm}NM)</span>
        </div>
      `;
    } else {
      // Pointing arrow at edge of radar ring with distance
      labelsContent = `
        <div class="efi-radar-dest-tag" style="left: ${targetX.toFixed(1)}px; top: ${targetY.toFixed(1)}px;">
          <span class="efi-radar-dest-tag-text" style="font-size: 7.5px; color: #00e5ff;">▲ ${activeMission.destinationIcao} ${distNm}NM</span>
        </div>
      `;
    }

    svgLayer.innerHTML = svgContent;
    overlayLabels.innerHTML = labelsContent;
  }

  /**
   * Direct 60 FPS Multiplayer Target Scanner
   */
  static updateTargetsDirect(): void {
    if (!this.settings.showTraffic) {
      if (this.targets.size > 0) {
        this.targets.clear();
        for (const [, entry] of this.blipDOMMap) entry.rootEl.remove();
        this.blipDOMMap.clear();
      }
      return;
    }

    const geofs = (unsafeWindow as any).geofs;
    const multiplayer = (unsafeWindow as any).multiplayer;
    const own = geofs?.aircraft?.instance;
    if (!own) return;

    const ownLla = own.llaLocation;
    if (!ownLla) return;

    const [ownLat, ownLon, ownAlt] = ownLla;
    const rangeMeters = this.settings.range * NM_TO_METERS;
    const now = Date.now();
    const activeIds = new Set<string>();

    const userPool: Record<string, any> = {};
    if (multiplayer?.users && typeof multiplayer.users === "object") {
      Object.assign(userPool, multiplayer.users);
    }
    if (multiplayer?.visibleUsers && typeof multiplayer.visibleUsers === "object") {
      Object.assign(userPool, multiplayer.visibleUsers);
    }

    for (const [userId, userData] of Object.entries(userPool)) {
      if (!userData) continue;

      const coords =
        userData.referenceCoord ||
        userData.llaLocation ||
        userData.coord ||
        userData.lastUpdate?.co ||
        userData.instance?.llaLocation;

      if (!coords || !Array.isArray(coords) || coords.length < 2) continue;

      const targetLat = Number(coords[0]);
      const targetLon = Number(coords[1]);
      const targetAlt = Number(coords[2] || 0);

      if (isNaN(targetLat) || isNaN(targetLon) || (targetLat === 0 && targetLon === 0)) continue;

      // Robust Airborne Traffic Filter:
      // In GeoFS, targetAlt > 45m or speed > 35 kts means aircraft is definitively airborne!
      if (this.settings.airborneTrafficOnly) {
        const rawSpeed = Number(
          userData.lastUpdate?.sp || userData.lastUpdate?.gs || userData.groundSpeed || userData.lastUpdate?.ki || 0
        );
        const speedKts = rawSpeed > 100 ? rawSpeed : rawSpeed * 1.94384; // convert m/s to kts if needed
        const onGroundFlag = userData.onGround === true || userData.lastUpdate?.og === true;

        const isDefinitivelyAirborne = targetAlt > 45 || speedKts > 35;
        if (!isDefinitivelyAirborne && (onGroundFlag || (speedKts < 20 && targetAlt < 25))) {
          continue; // Filter ground parked/taxi traffic
        }
      }

      const distance = this.calculateDistance(ownLat, ownLon, targetLat, targetLon);
      if (distance > rangeMeters || distance < 10) continue;

      const distanceNm = calculateDistanceNm(ownLat, ownLon, targetLat, targetLon);
      const bearing = this.calculateBearing(ownLat, ownLon, targetLat, targetLon);
      activeIds.add(userId);

      const callsign = String(
        userData.callsign || userData.cs || userData.name || userData.id || userId
      ).substring(0, 6);

      this.targets.set(userId, {
        id: userId,
        callsign,
        distance,
        distanceNm,
        bearing,
        altitude: targetAlt,
        relativeAltitude: targetAlt - ownAlt,
        aircraftType: String(userData.aircraft || userData.ac || "traffic"),
        lastUpdate: now,
      });
    }

    for (const [id] of this.targets) {
      if (!activeIds.has(id)) {
        this.targets.delete(id);
      }
    }
  }

  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  static calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    return calculateBearingDeg(lat1, lon1, lat2, lon2);
  }

  static injectStyles(): void {
    const styleId = "efi-radar-styles";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = this.getStyles();
    document.head.appendChild(style);
  }
}

export default RadarEngine;
