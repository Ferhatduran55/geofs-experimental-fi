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
  private static isReinitializing: boolean = false;
  private static isRecalculating: boolean = false;

  static init(): void {
    if (this.isInitialized) return;
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments) {
      log.warn("GeoFS instruments system not available yet");
      return;
    }
    this.isInitialized = true;
    this.installGeoFSSyncHooks();
    log.info("InstrumentManager initialized with gap-free responsive cockpit panel engine");
  }

  /**
   * Installs synchronization hooks on GeoFS instruments engine
   */
  static installGeoFSSyncHooks(): void {
    if (this.hooksInstalled) return;

    const instruments = (unsafeWindow as any).instruments;
    const geofs = (unsafeWindow as any).geofs;
    if (!instruments) return;

    this.hooksInstalled = true;

    // 1. Hook instruments.init() -> Rebuild custom instruments and recalculate layout
    const origInit = instruments.init;
    if (typeof origInit === "function") {
      instruments.init = function (...args: any[]) {
        const res = origInit.apply(this, args);
        if (!InstrumentManager.isReinitializing) {
          InstrumentManager.reinitializeActiveInstruments();
        }
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

    // 6. Hook instruments.updateScreenPositions()
    const origUpdateScreenPositions = instruments.updateScreenPositions;
    if (typeof origUpdateScreenPositions === "function") {
      instruments.updateScreenPositions = function (...args: any[]) {
        const res = origUpdateScreenPositions.apply(this, args);
        if (!InstrumentManager.isReinitializing) {
          InstrumentManager.recalculateAllInstrumentPositions();
        }
        return res;
      };
    }

    // 7. Window resize listener (Responsive auto-fit across Desktop & Mobile viewports)
    window.addEventListener("resize", () => {
      this.recalculateAllInstrumentPositions();
    });

    // 8. Hook aircraft changes in GeoFS
    if (geofs?.api?.callbacks) {
      geofs.api.addCallback &&
        geofs.api.addCallback("aircraftLoaded", () => {
          setTimeout(() => {
            this.reinitializeActiveInstruments();
          }, 350);
        });
    }

    // 9. Hook camera changes to dynamically re-pack gauges when cockpit view switches
    window.addEventListener("cameraChange", () => {
      this.recalculateAllInstrumentPositions();
    });
    const geofsJQuery = (unsafeWindow as any).jQuery || (unsafeWindow as any).$;
    if (geofsJQuery) {
      try {
        geofsJQuery(document).on("cameraChange", () => {
          this.recalculateAllInstrumentPositions();
        });
      } catch {}
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
   * Checks if an indicator is truly active and visible on the 2D panel
   * (eliminates ghost/hidden gauge slots that cause empty gaps)
   */
  private static isIndicatorVisible(ind: any): boolean {
    if (!ind || !ind.overlay) return false;
    if (ind.visibility === false) return false;
    if (ind.overlay.visibility === false) return false;
    if (ind.definition && ind.definition.visibility === false) return false;
    if (ind.overlay.definition && ind.overlay.definition.visibility === false) return false;

    // Cockpit-only 3D indicator should not take a slot in the 2D panel unless in cockpit mode
    const geofs = (unsafeWindow as any).geofs;
    const isCockpitMode = geofs?.camera?.currentModeName === "cockpit";
    if (ind.definition?.cockpit && !isCockpitMode) {
      return false;
    }

    // Check DOM element visibility if already mounted
    const el = ind.overlay.compositorLayer?._$element?.[0] || ind.container || ind.domElement;
    if (el) {
      if (el.classList?.contains("geofs-hidden")) return false;
      if (el.style?.display === "none") return false;
      if (el.getAttribute?.("style")?.includes("display: none")) return false;
    }
    const mask = ind.overlay.compositorLayer?._$mask?.[0];
    if (mask) {
      if (mask.classList?.contains("geofs-hidden")) return false;
      if (mask.style?.display === "none") return false;
    }

    return true;
  }

  /**
   * Filters and retrieves valid cockpit panel indicators in stable sequential order:
   * Native aircraft gauges first, followed by active custom gauges (efiRadar, efiFuelGauge).
   * Excludes non-gauge items like pads (brakes, gear, flaps), wind indicators, and hidden gauges.
   */
  private static getPanelIndicators(): Array<{ name: string; indicator: any }> {
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments?.list) return [];

    const nativeGauges: Array<{ name: string; indicator: any }> = [];
    const customGauges: Array<{ name: string; indicator: any }> = [];

    for (const key in instruments.list) {
      const ind = instruments.list[key];
      if (!ind || !ind.overlay) continue;

      // Filter out controls/pads (like brakes, gear, flaps) which belong to .geofs-pads-container
      const container = ind.definition?.container;
      if (container && container !== ".geofs-instruments-container") {
        continue;
      }

      // Filter out wind indicator or specifically aligned overlays
      if (key === "wind" || ind.definition?.alignment) {
        continue;
      }

      // Check if it's one of our registered instruments
      if (this.registeredInstruments.has(key)) {
        const reg = this.registeredInstruments.get(key);
        if (reg?.isActive) {
          customGauges.push({ name: key, indicator: ind });
        }
      } else {
        // Native aircraft gauge - must be genuinely visible to occupy a slot
        if (this.isIndicatorVisible(ind)) {
          nativeGauges.push({ name: key, indicator: ind });
        }
      }
    }

    // Stable sort custom gauges: efiRadar first, efiFuelGauge second
    customGauges.sort((a, b) => {
      if (a.name === "efiRadar") return -1;
      if (b.name === "efiRadar") return 1;
      return 0;
    });

    return [...nativeGauges, ...customGauges];
  }

  /**
   * Single-Row Responsive Layout Engine:
   * 
   * Mathematical & Architecture Design:
   * 1. Collects all active cockpit panel gauges (native gauges + active custom gauges).
   * 2. Sequentially calculates unscaled X center positions using base gauge width (200px)
   *    and native GeoFS default margin (10px), starting flush from left (startX: 100px).
   * 3. Calculates the responsive scale factor: targetScale = Math.min(1.0, availableWidth / totalUnscaledWidth).
   * 4. Updates each indicator's `ind.overlay.definition.position.x/y` and invokes GeoFS's
   *    own `overlay.scaleAndPlace()` with a simulated viewport matching targetScale.
   *    This guarantees that the gauge body and ALL internal sub-overlays (needles, rotating dials,
   *    graduations, face plates) are scaled and placed synchronously by GeoFS without scattering.
   * 5. Updates `instruments.stackPosition` and `.geofs-instruments-container` width cleanly.
   */
  static recalculateAllInstrumentPositions(): void {
    if (this.isRecalculating) return;
    this.isRecalculating = true;

    try {
      const instruments = (unsafeWindow as any).instruments;
      if (!instruments || !instruments.list) return;

      const activeIndicators = this.getPanelIndicators();
      if (activeIndicators.length === 0) return;

      const count = activeIndicators.length;
      const baseGaugeWidth = 200; // Native GeoFS base gauge size (px)
      const defaultMargin = instruments.defaultMargin !== undefined ? instruments.defaultMargin : 10;
      const pitch = baseGaugeWidth + defaultMargin; // 210px pitch between adjacent gauge centers
      const startX = 100; // Native GeoFS initial offset (stackPosition starts at x: 100)
      const baseCenterY = 100; // Native GeoFS vertical center position (px)

      // Unscaled rightmost edge: startX + (count * pitch) - defaultMargin
      // For 8 gauges: 100 + 8 * 210 - 10 = 1770px; for 9 gauges: 1980px
      const totalUnscaledWidth = startX + count * pitch - defaultMargin;

      // Viewport width and responsive scale
      const viewportWidth = window.innerWidth;

      // Check width of .geofs-pads-container (flaps, brakes, airbrakes, gear) on bottom-right
      const padsEl = document.querySelector(".geofs-pads-container") as HTMLElement;
      const padsWidth = padsEl && padsEl.offsetWidth > 40 ? padsEl.offsetWidth : 150;
      // Provide safe right padding so gauges never overlap under the flap/brake/airbrake pads
      const safeRightPadding = Math.max(160, padsWidth + 30);
      const availableWidth = Math.max(260, viewportWidth - safeRightPadding);

      // Responsive scale so all gauges fit on a single row without wrapping, clipping, or touching pads
      let targetScale = 1.0;
      if (totalUnscaledWidth > availableWidth) {
        targetScale = availableWidth / totalUnscaledWidth;
      }
      // Limit min scale for legibility on small mobile screens
      targetScale = Math.max(0.30, Math.min(1.0, targetScale));

      // Custom simulated viewport to feed GeoFS scaleAndPlace
      // GeoFS computes scale: c = Math.min(viewport.x / 1800, viewport.y / 800)
      const customViewport = {
        x: targetScale * 1800,
        y: Math.max(600, window.innerHeight),
      };

      activeIndicators.forEach((item, index) => {
        const ind = item.indicator;
        if (!ind?.overlay) return;

        // Native GeoFS gauge center: 200 + index * 210
        const unscaledCenterX = startX + (baseGaugeWidth / 2) + index * pitch;

        // 1. Update Overlay Definition position (This is what GeoFS scaleAndPlace reads!)
        if (!ind.overlay.definition) ind.overlay.definition = {};
        if (!ind.overlay.definition.position) ind.overlay.definition.position = {};
        ind.overlay.definition.position.x = unscaledCenterX;
        ind.overlay.definition.position.y = baseCenterY;
        ind.overlay.definition.rescale = true;
        ind.overlay.definition.rescalePosition = true;

        // 2. Set Indicator logical position
        if (!ind.position) ind.position = {};
        ind.position.x = unscaledCenterX;
        ind.position.y = baseCenterY;

        // 3. Rescale indicator natively if available
        if (typeof ind.rescale === "function") {
          try {
            ind.rescale();
          } catch {}
        }

        // 4. Invoke GeoFS scaleAndPlace to reposition root overlay and all child overlays (needles, dials, bug)
        if (typeof ind.overlay.scaleAndPlace === "function") {
          try {
            ind.overlay.scaleAndPlace(null, null, customViewport);
          } catch (e) {
            log.warn(`Error placing overlay for ${item.name}:`, e);
          }
        }
      });

      // 5. Update GeoFS instruments.stackPosition to the end of the gauge row
      instruments.stackPosition = {
        x: totalUnscaledWidth + defaultMargin,
        y: 0,
      };

      // 6. Update .geofs-instruments-container bounding dimensions
      const container = document.querySelector(".geofs-instruments-container") as HTMLElement;
      if (container) {
        container.style.width = `${Math.ceil(totalUnscaledWidth * targetScale)}px`;
        container.style.height = `${Math.ceil(baseGaugeWidth * targetScale)}px`;
      }
    } finally {
      this.isRecalculating = false;
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
    if (this.isReinitializing) return;
    this.isReinitializing = true;

    try {
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
          // Deep clone definition so previous mutations don't corrupt coordinate calculations
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
          // Deactivated instrument cleanup
          const indicator = instruments.list[name];
          if (indicator) {
            if (typeof indicator.destroy === "function") {
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

      // Recalculate unified single-row layout across all native & custom indicators
      this.recalculateAllInstrumentPositions();
    } finally {
      this.isReinitializing = false;
    }
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
