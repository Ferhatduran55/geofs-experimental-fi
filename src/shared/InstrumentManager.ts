import Logger from "./Logger";

const log = Logger.create("InstrumentManager");

export interface RegisteredInstrument {
  definition: InstrumentDef;
  indicator: any | null;
  isActive: boolean;
}

export class InstrumentManager {
  private static registeredInstruments: Map<string, RegisteredInstrument> = new Map();
  private static isInitialized: boolean = false;
  private static areInstrumentsGloballyVisible: boolean = true;
  private static hooksInstalled: boolean = false;

  static init(): void {
    if (this.isInitialized) return;
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments) {
      log.warn("GeoFS instruments system not available yet");
      return;
    }
    this.isInitialized = true;
    this.installGeoFSSyncHooks();
    log.info("InstrumentManager initialized with unified dynamic cockpit panel engine");
  }

  /**
   * Installs comprehensive synchronization, aircraft load and layout recalculation hooks on GeoFS instruments engine
   */
  static installGeoFSSyncHooks(): void {
    if (this.hooksInstalled) return;

    const instruments = (unsafeWindow as any).instruments;
    const geofs = (unsafeWindow as any).geofs;
    if (!instruments) return;

    this.hooksInstalled = true;

    // 1. Hook instruments.init() -> Trigger layout recalculation on new aircraft / instrument initialization
    const origInit = instruments.init;
    if (typeof origInit === "function") {
      instruments.init = function (...args: any[]) {
        const res = origInit.apply(this, args);
        InstrumentManager.reinitializeActiveInstruments();
        return res;
      };
    }

    // 2. Hook instruments.hide()
    const origHide = instruments.hide;
    if (typeof origHide === "function") {
      instruments.hide = function (...args: any[]) {
        const res = origHide.apply(this, args);
        InstrumentManager.setGlobalVisibility(false);
        return res;
      };
    }

    // 3. Hook instruments.show()
    const origShow = instruments.show;
    if (typeof origShow === "function") {
      instruments.show = function (...args: any[]) {
        const res = origShow.apply(this, args);
        InstrumentManager.setGlobalVisibility(true);
        return res;
      };
    }

    // 4. Hook instruments.toggle()
    const origToggle = instruments.toggle;
    if (typeof origToggle === "function") {
      instruments.toggle = function (...args: any[]) {
        const res = origToggle.apply(this, args);
        const isVisible = instruments.visible !== false && instruments.isVisible !== false;
        InstrumentManager.setGlobalVisibility(isVisible);
        return res;
      };
    }

    // 5. Hook instruments.rescale()
    const origRescale = instruments.rescale;
    if (typeof origRescale === "function") {
      instruments.rescale = function (...args: any[]) {
        const res = origRescale.apply(this, args);
        InstrumentManager.recalculateAllInstrumentPositions();
        return res;
      };
    }

    // 6. Window resize listener (Responsive for both Mobile & Desktop viewports)
    window.addEventListener("resize", () => {
      this.recalculateAllInstrumentPositions();
    });

    // 7. Hook aircraft changes in GeoFS
    if (geofs?.api?.callbacks) {
      geofs.api.addCallback &&
        geofs.api.addCallback("aircraftLoaded", () => {
          setTimeout(() => {
            this.reinitializeActiveInstruments();
          }, 350);
        });
    }
  }

  static setGlobalVisibility(visible: boolean): void {
    this.areInstrumentsGloballyVisible = visible;
    const instruments = (unsafeWindow as any).instruments;

    for (const [name, registered] of this.registeredInstruments) {
      if (registered.isActive) {
        const indicator = instruments?.list?.[name] || registered.indicator;
        if (indicator) {
          indicator.visibility = visible;
          const container = indicator.container || indicator.domElement;
          if (container && container.style) {
            container.style.display = visible ? "" : "none";
          }
        }
      }
    }
  }

  /**
   * Master Unified Layout & Adaptive Zigzag/Row Engine:
   * 
   * Mathematical & Architecture Design:
   * 1. Collects all active instruments (both original GeoFS instruments and custom assistant instruments).
   * 2. Synchronizes both `indicator.position.x/y` AND `indicator.overlay.position.x/y` to prevent GeoFS from pulling gauges back to 0.
   * 3. Calculates the optimal layout mode:
   *    - Wide Screen / Low Gauge Count -> Unified Centered Single Row with comfortable spacing.
   *    - Narrow Screen / High Gauge Count (Mobile or Many Gauges) -> 2-Row / Zigzag Staggered Grid to preserve high readability without extreme shrinking.
   * 4. Updates all main overlays and internal sub-overlays (needles, rotating disks, dials) in lockstep.
   */
  static recalculateAllInstrumentPositions(): void {
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments || !instruments.list) return;

    const activeIndicators: Array<{ name: string; indicator: any }> = [];

    // Collect all valid, currently active indicators from the GeoFS list
    for (const key in instruments.list) {
      const ind = instruments.list[key];
      if (ind && (ind.overlay || ind.container)) {
        activeIndicators.push({ name: key, indicator: ind });
      }
    }

    if (activeIndicators.length === 0) return;

    const count = activeIndicators.length;
    const screenWidth = window.innerWidth;
    const isMobile = screenWidth <= 768;
    const baseGaugeWidth = 200; // Base unscaled size (px)
    const baseMarginBottom = 100; // Base vertical center position (px)

    // Calculate space needed for single-row
    const minSpacing = isMobile ? 4 : 8;
    const totalSingleRowNaturalWidth = (count * baseGaugeWidth) + ((count - 1) * minSpacing);
    const availableWidth = screenWidth - (isMobile ? 16 : 40);

    // Layout Decision: Single Row vs 2-Row Zigzag
    const singleRowScale = availableWidth / totalSingleRowNaturalWidth;
    const useTwoRows = isMobile && count > 4 && singleRowScale < 0.60;

    let targetScale = 1.0;

    if (useTwoRows) {
      // 2-Row / Zigzag Compact Mode: Split gauges across 2 rows for optimal readability
      const colsPerRow = Math.ceil(count / 2);
      const rowNaturalWidth = (colsPerRow * baseGaugeWidth) + ((colsPerRow - 1) * minSpacing);
      targetScale = Math.max(0.48, Math.min(0.85, availableWidth / rowNaturalWidth));
      instruments.scale = targetScale;

      const scaledWidth = baseGaugeWidth * targetScale;
      const scaledSpacing = minSpacing * targetScale;
      const rowTotalWidth = (colsPerRow * scaledWidth) + ((colsPerRow - 1) * scaledSpacing);
      const startX = Math.max(10, (screenWidth - rowTotalWidth) / 2);

      const bottomRowY = baseMarginBottom * targetScale;
      const topRowY = bottomRowY + (scaledWidth * 0.95);

      activeIndicators.forEach((item, index) => {
        const ind = item.indicator;
        const isTopRow = index % 2 === 1;
        const colIndex = Math.floor(index / 2);

        const currentLeft = startX + colIndex * (scaledWidth + scaledSpacing);
        const centerX = currentLeft + (scaledWidth / 2);
        const centerY = isTopRow ? topRowY : bottomRowY;

        this.applyGaugePosition(ind, centerX, centerY);
      });
    } else {
      // Unified Single Row Mode: Balanced, centered, beautifully spaced
      targetScale = Math.max(0.38, Math.min(1.0, singleRowScale));
      instruments.scale = targetScale;

      const scaledWidth = baseGaugeWidth * targetScale;
      const scaledSpacing = minSpacing * targetScale;
      const totalWidth = (count * scaledWidth) + ((count - 1) * scaledSpacing);
      const startX = Math.max(10, (screenWidth - totalWidth) / 2);
      const centerY = baseMarginBottom * targetScale;

      activeIndicators.forEach((item, index) => {
        const ind = item.indicator;
        const currentLeft = startX + index * (scaledWidth + scaledSpacing);
        const centerX = currentLeft + (scaledWidth / 2);

        this.applyGaugePosition(ind, centerX, centerY);
      });
    }

    if (instruments.startPosition) {
      instruments.startPosition.x = 0;
    }
  }

  /**
   * Safely applies coordinates to indicator root, overlays and sub-overlays
   */
  private static applyGaugePosition(ind: any, centerX: number, centerY: number): void {
    if (!ind) return;

    // 1. Rescale indicator natively
    if (typeof ind.rescale === "function") {
      try {
        ind.rescale();
      } catch {}
    }

    // 2. Set Indicator logical position (Crucial to stop GeoFS resetting to 0!)
    if (!ind.position) ind.position = {};
    ind.position.x = centerX;
    ind.position.y = centerY;

    // 3. Set Main Overlay position
    if (ind.overlay) {
      if (!ind.overlay.position) ind.overlay.position = {};
      ind.overlay.position.x = centerX;
      ind.overlay.position.y = centerY;

      if (typeof ind.overlay.setPosition === "function") {
        try {
          ind.overlay.setPosition();
        } catch {}
      }
    }

    // 4. Synchronize all sub-overlays (needles, rotating disks, dials, frames)
    if (Array.isArray(ind.overlays)) {
      for (const subOverlay of ind.overlays) {
        if (subOverlay) {
          if (!subOverlay.position) subOverlay.position = {};
          subOverlay.position.x = centerX;
          subOverlay.position.y = centerY;

          if (typeof subOverlay.setPosition === "function") {
            try {
              subOverlay.setPosition();
            } catch {}
          }
        }
      }
    }

    // 5. Update screen position methods
    if (typeof ind.updateScreenPosition === "function") {
      try {
        ind.updateScreenPosition();
      } catch {}
    } else if (typeof ind.updatePosition === "function") {
      try {
        ind.updatePosition();
      } catch {}
    }
  }

  static registerDefinition(definition: InstrumentDef): boolean {
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments?.definitions) {
      log.error("instruments.definitions not available");
      return false;
    }

    const { name } = definition;
    const geofsDefinition: any = {
      container: definition.container,
      stackX: definition.stackX ?? true,
      stackY: definition.stackY,
      group: definition.group || "all",
      compositors: definition.compositors || "css",
      overlay: JSON.parse(JSON.stringify(definition.overlay)),
    };

    if (definition.animations) {
      geofsDefinition.animations = JSON.parse(JSON.stringify(definition.animations));
    }
    if (definition.visibility !== undefined) {
      geofsDefinition.visibility = definition.visibility;
    }

    this.registeredInstruments.set(name, {
      definition,
      indicator: null,
      isActive: false,
    });

    log.debug(`Registered instrument definition in manager: ${name}`);
    return true;
  }

  static activateInstrument(name: string): boolean {
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments) return false;

    const registered = this.registeredInstruments.get(name);
    if (!registered) return false;

    registered.isActive = true;
    this.reinitializeActiveInstruments();
    log.debug(`Activated instrument: ${name}`);
    return true;
  }

  static deactivateInstrument(name: string): boolean {
    const registered = this.registeredInstruments.get(name);
    if (!registered) return false;

    registered.isActive = false;
    if (registered.definition.onDestroy) {
      try {
        registered.definition.onDestroy();
      } catch {
        // ignore
      }
    }

    this.reinitializeActiveInstruments();
    log.debug(`Deactivated instrument: ${name}`);
    return true;
  }

  static reinitializeActiveInstruments(): void {
    const instruments = (unsafeWindow as any).instruments;
    const geofs = (unsafeWindow as any).geofs;
    if (!instruments || !geofs) return;

    let IndicatorClass = null;
    if (instruments.list) {
      for (const key in instruments.list) {
        if (!this.registeredInstruments.has(key)) {
          IndicatorClass = instruments.list[key]?.constructor;
          if (IndicatorClass) break;
        }
      }
    }

    if (!IndicatorClass) {
      IndicatorClass = geofs.gui?.Indicator || (geofs as any).Indicator;
    }
    if (!IndicatorClass) return;

    for (const [name, registered] of this.registeredInstruments) {
      if (registered.isActive) {
        const geofsDef: any = {
          container: registered.definition.container,
          stackX: registered.definition.stackX ?? true,
          stackY: registered.definition.stackY,
          group: registered.definition.group || "all",
          compositors: registered.definition.compositors || "css",
          overlay: JSON.parse(JSON.stringify(registered.definition.overlay)),
        };

        if (registered.definition.animations) {
          geofsDef.animations = JSON.parse(JSON.stringify(registered.definition.animations));
        }
        if (registered.definition.visibility !== undefined) {
          geofsDef.visibility = registered.definition.visibility;
        }

        instruments.definitions[name] = geofsDef;

        if (!instruments.list[name]) {
          try {
            const indicator = new IndicatorClass(instruments.definitions[name], name);
            instruments.list[name] = indicator;
            registered.indicator = indicator;
            if (indicator.init) indicator.init();
            if (registered.definition.onInit) {
              try {
                registered.definition.onInit();
              } catch {}
            }

            // Sync global visibility
            indicator.visibility = this.areInstrumentsGloballyVisible;
            const container = indicator.container || indicator.domElement;
            if (container && container.style) {
              container.style.display = this.areInstrumentsGloballyVisible ? "" : "none";
            }
          } catch (e) {
            log.error(`Failed to instantiate instrument: ${name}`, e);
          }
        }
      } else {
        const indicator = instruments.list[name];
        if (indicator) {
          if (indicator.destroy) {
            try {
              indicator.destroy();
            } catch {}
          } else if (indicator.container?.remove) {
            indicator.container.remove();
          } else if (indicator.domElement?.remove) {
            indicator.domElement.remove();
          }
          delete instruments.list[name];
          delete instruments.definitions[name];
          registered.indicator = null;
        } else {
          delete instruments.definitions[name];
        }
      }
    }

    // Recalculate unified layout across all native & custom indicators
    this.recalculateAllInstrumentPositions();
  }

  static isActive(name: string): boolean {
    return this.registeredInstruments.get(name)?.isActive ?? false;
  }

  static isVisible(name: string): boolean {
    const instruments = (unsafeWindow as any).instruments;
    const indicator = instruments?.list?.[name];
    if (!indicator) return false;
    return indicator.visibility !== false;
  }

  static show(name: string): void {
    const instruments = (unsafeWindow as any).instruments;
    if (instruments?.list?.[name]) {
      instruments.list[name].show();
      log.debug(`Showed instrument: ${name}`);
    }
  }

  static hide(name: string): void {
    const instruments = (unsafeWindow as any).instruments;
    if (instruments?.list?.[name]) {
      instruments.list[name].hide();
      log.debug(`Hid instrument: ${name}`);
    }
  }

  static toggle(name: string): void {
    if (this.isVisible(name)) {
      this.hide(name);
    } else {
      this.show(name);
    }
  }

  static cleanup(): void {
    for (const name of this.registeredInstruments.keys()) {
      this.deactivateInstrument(name);
    }
    this.registeredInstruments.clear();
    this.isInitialized = false;
    log.info("InstrumentManager cleaned up");
  }
}

export default InstrumentManager;
