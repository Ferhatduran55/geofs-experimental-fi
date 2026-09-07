import Logger from "./Logger";

const log = Logger.create("InstrumentManager");


interface RegisteredInstrument {
  definition: InstrumentDef; // from src/types/index.d.ts
  indicator: Indicator | null;
  isActive: boolean;
}

interface OriginalFunctions {
  init: Function | null;
  update: Function | null;
  show: Function | null;
  hide: Function | null;
  toggle: Function | null;
  setOpacity: Function | null;
  rescale: Function | null;
  reset: Function | null;
  updateScreenPositions: Function | null;
  updateCockpitPositions: Function | null;
}

/**
 * InstrumentManager - Manages custom instruments using GeoFS native instrument system
 * 
 * Full integration with ALL GeoFS instrument functions:
 * - instruments.init() - Re-init on aircraft change
 * - instruments.show() / instruments.hide() - Visibility control
 * - instruments.toggle() - Toggle visibility
 * - instruments.setOpacity() - Opacity control
 * - instruments.rescale() - Rescale on screen change
 * - instruments.reset() - Reset positions
 * - instruments.update() - Animation updates
 * - instruments.updateScreenPositions() - Screen position updates
 * - instruments.updateCockpitPositions() - Cockpit position updates
 * 
 * Custom instruments behave exactly like native GeoFS instruments.
 */
class InstrumentManager {
  private static registeredInstruments: Map<string, RegisteredInstrument> = new Map();
  private static originals: OriginalFunctions = {
    init: null,
    update: null,
    show: null,
    hide: null,
    toggle: null,
    setOpacity: null,
    rescale: null,
    reset: null,
    updateScreenPositions: null,
    updateCockpitPositions: null,
  };
  private static isInitialized: boolean = false;

  /**
   * Initialize the InstrumentManager and hook into ALL GeoFS instrument functions
   */
  static init(): void {
    if (this.isInitialized) return;

    const instruments = (unsafeWindow as any).instruments;
    if (!instruments) {
      log.warn("GeoFS instruments system not available yet");
      return;
    }

    // Do not hook GeoFS instrument methods — integrate by registering definitions and calling init
    // Hooks caused layout interference. Use reinitializeActiveInstruments() to re-run GeoFS init when needed.
    this.isInitialized = true;
    log.info("InstrumentManager initialized with full GeoFS integration");
  }

  /**
   * Hook into ALL GeoFS instrument functions
   */




  /**
   * Register an instrument definition in GeoFS's instruments.definitions
   */
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

    // Add animations for visibility control (like GeoFS stall indicator)
    if (definition.animations) {
      geofsDefinition.animations = JSON.parse(JSON.stringify(definition.animations));
    }

    // Add visibility if specified (for GeoFS show/hide system)
    if (definition.visibility !== undefined) {
      geofsDefinition.visibility = definition.visibility;
    }

    // Register in GeoFS definitions
    instruments.definitions[name] = geofsDefinition;

    // Track in our registry
    this.registeredInstruments.set(name, {
      definition,
      indicator: null,
      isActive: false,
    });

    log.debug(`Registered instrument definition: ${name}`);
    return true;
  }

  /**
   * Activate an instrument by triggering a re-init of the instrument system
   * This ensures correct stacking and layout handling by GeoFS
   */
  static activateInstrument(name: string): boolean {
    const instruments = (unsafeWindow as any).instruments;

    if (!instruments) {
      log.error("GeoFS instrument system not available");
      return false;
    }

    const registered = this.registeredInstruments.get(name);
    if (!registered) {
      log.error(`Instrument not registered: ${name}`);
      return false;
    }

    // Mark as active so it gets included in next init
    registered.isActive = true;

    // Reinitialize all active instruments so GeoFS places them correctly
    this.reinitializeActiveInstruments();
    log.debug(`Activated instrument (reinit): ${name}`);
    return true;
  }

  /**
   * Deactivate an instrument (hide it, don't destroy to preserve stack position if possible, 
   * or destroy if we want to remove it completely)
   */
  static deactivateInstrument(name: string): boolean {
    const registered = this.registeredInstruments.get(name);
    if (!registered) return false;

    // Mark inactive and reinitialize GeoFS instruments so it's removed
    registered.isActive = false;
    if (registered.definition.onDestroy) {
      try { registered.definition.onDestroy(); } catch (e) { /* ignore */ }
    }

    this.reinitializeActiveInstruments();
    log.debug(`Deactivated instrument (reinit): ${name}`);
    return true;
  }



  /**
   * Re-initialize GeoFS instruments to include currently active registered instruments
   * We do NOT call instruments.init() here anymore, because it wipes and restarts all 
   * native instruments mid-flight, disconnecting their 3D cockpit references.
   * Instead, we manually construct the indicators and add them to instruments.list
   */
  static reinitializeActiveInstruments(): void {
    const instruments = (unsafeWindow as any).instruments;
    const geofs = (unsafeWindow as any).geofs;

    if (!instruments || !geofs) {
      log.warn("Cannot reinitialize instruments: GeoFS instruments not available");
      return;
    }

    // 1. Find the Indicator constructor from an existing native instrument
    let IndicatorClass = null;
    if (instruments.list) {
      for (const key in instruments.list) {
        if (!this.registeredInstruments.has(key)) {
          // It's a native instrument, grab its constructor
          IndicatorClass = instruments.list[key]?.constructor;
          if (IndicatorClass) break;
        }
      }
    }

    // Fallbacks if native list is somehow empty
    if (!IndicatorClass) {
      IndicatorClass = geofs.gui?.Indicator || (geofs as any).Indicator;
    }

    if (!IndicatorClass) {
      log.error("Could not determine GeoFS Indicator class");
      return;
    }

    let domChanged = false;

    // 2. Iterate over our registered instruments and add/remove manually
    for (const [name, registered] of this.registeredInstruments) {
      if (registered.isActive) {
        // ALWAYS inject a fresh deep-cloned definition into GeoFS
        // GeoFS mutates definitions upon initialization which breaks subsequent initializations
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

        // If it isn't in instruments.list yet, instantiate it manually!
        if (!instruments.list[name]) {
          try {
            const indicator = new IndicatorClass(instruments.definitions[name], name);
            instruments.list[name] = indicator;
            registered.indicator = indicator;

            // Run its init lifecycle to build generic DOM structures
            if (indicator.init) indicator.init();

            // Our custom lifecycle hook
            if (registered.definition.onInit) {
              try { registered.definition.onInit(); } catch (e) { /* ignore */ }
            }

            domChanged = true;
          } catch (e) {
            log.error(`Failed to instantiate instrument: ${name}`, e);
          }
        }
      } else {
        // Deactivate: properly destroy it without wiping the whole board
        const indicator = instruments.list[name];
        if (indicator) {
          if (indicator.destroy) {
            try { indicator.destroy(); } catch (e) { }
          } else {
            // Fallback DOM removal
            if (indicator.container && indicator.container.remove) {
              indicator.container.remove();
            } else if (indicator.domElement && indicator.domElement.remove) {
              indicator.domElement.remove();
            }
          }
          delete instruments.list[name];
          registered.indicator = null;
          domChanged = true;
        }
      }
    }

    // GeoFS Instrument Update Protection:
    if (geofs.animation && geofs.animation.values) {
      const vals = geofs.animation.values;
      if (vals.fuelPercentage === undefined) vals.fuelPercentage = 100;
      if (vals.fuelConsumption === undefined) vals.fuelConsumption = 0;
    }

    // 3. Trigger rescale so GeoFS measures and places new overlays
    if (domChanged) {
      try {
        instruments.rescale && instruments.rescale();
        instruments.updateScreenPositions && instruments.updateScreenPositions();
        log.debug("Reinitialized active instruments via direct injection");
      } catch (e) {
        log.error("Failed to rescale instruments:", e);
      }
    }
  }

  /**
   * Check if an instrument is active
   */
  static isActive(name: string): boolean {
    const registered = this.registeredInstruments.get(name);
    return registered?.isActive ?? false;
  }

  /**
   * Check if instrument exists in instruments.list
   */
  static exists(name: string): boolean {
    const instruments = (unsafeWindow as any).instruments;
    return !!instruments?.list?.[name];
  }

  /**
   * Check if an instrument is visible (uses GeoFS native system)
   */
  static isVisible(name: string): boolean {
    const instruments = (unsafeWindow as any).instruments;
    const indicator = instruments?.list?.[name];
    if (!indicator) return false;
    return indicator.visibility !== false;
  }

  /**
   * Get instrument indicator
   */
  static getIndicator(name: string): any {
    return this.registeredInstruments.get(name)?.indicator;
  }

  /**
   * Show an instrument (uses GeoFS native method)
   * Works with instruments.show() and instruments.show(groupName)
   */
  static show(name: string): void {
    const instruments = (unsafeWindow as any).instruments;
    if (instruments?.list?.[name]) {
      instruments.list[name].show();
      log.debug(`Showed instrument: ${name}`);
    }
  }

  /**
   * Hide an instrument (uses GeoFS native method)
   * Works with instruments.hide() and instruments.hide(groupName)
   */
  static hide(name: string): void {
    const instruments = (unsafeWindow as any).instruments;
    if (instruments?.list?.[name]) {
      instruments.list[name].hide();
      log.debug(`Hid instrument: ${name}`);
    }
  }

  /**
   * Toggle instrument visibility
   */
  static toggle(name: string): void {
    if (this.isVisible(name)) {
      this.hide(name);
    } else {
      this.show(name);
    }
  }

  /**
   * Set instrument opacity (uses GeoFS native method)
   */
  static setOpacity(name: string, opacity: number): void {
    const instruments = (unsafeWindow as any).instruments;
    if (instruments?.list?.[name]?.overlay) {
      instruments.list[name].overlay.setOpacity(opacity);
    }
  }

  /**
   * Rescale an instrument (uses GeoFS native method)
   */
  static rescale(name: string): void {
    const instruments = (unsafeWindow as any).instruments;
    if (instruments?.list?.[name]) {
      instruments.list[name].scale();
    }
  }

  /**
   * Update screen position for an instrument
   */
  static updateScreenPosition(name: string): void {
    const instruments = (unsafeWindow as any).instruments;
    const geofs = (unsafeWindow as any).geofs;
    const indicator = instruments?.list?.[name];

    if (!indicator || !indicator.definition) return;

    if (geofs?.camera?.currentModeName === "cockpit" && indicator.definition.cockpit) {
      indicator.updateCockpitPosition();
    } else {
      // Let GeoFS handle measuring/placing; trigger a full update of screen positions
      if (instruments.updateScreenPositions) {
        instruments.updateScreenPositions();
      }
    }
  }

  /**
   * Unregister an instrument completely
   */
  static unregister(name: string): void {
    this.deactivateInstrument(name);

    const instruments = (unsafeWindow as any).instruments;
    if (instruments?.definitions?.[name]) {
      delete instruments.definitions[name];
    }

    this.registeredInstruments.delete(name);
    log.debug(`Unregistered instrument: ${name}`);
  }

  /**
   * Get all registered instrument names
   */
  static getRegisteredInstruments(): string[] {
    return Array.from(this.registeredInstruments.keys());
  }

  /**
   * Apply custom layout logic (e.g. new lines)
   * This runs after instruments.init has placed everything in a single row
   */


  /**
   * Get all active instrument names
   */
  static getActiveInstruments(): string[] {
    return Array.from(this.registeredInstruments.entries())
      .filter(([, r]) => r.isActive)
      .map(([name]) => name);
  }

  /**
   * Cleanup - restore ALL original functions and remove all custom instruments
   */
  static cleanup(): void {
    const instruments = (unsafeWindow as any).instruments;

    // Deactivate all instruments first
    for (const name of this.registeredInstruments.keys()) {
      this.deactivateInstrument(name);
    }

    // Restore all original functions
    if (instruments) {
      if (this.originals.init) instruments.init = this.originals.init;
      if (this.originals.update) instruments.update = this.originals.update;
      if (this.originals.show) instruments.show = this.originals.show;
      if (this.originals.hide) instruments.hide = this.originals.hide;
      if (this.originals.toggle) instruments.toggle = this.originals.toggle;
      if (this.originals.setOpacity) instruments.setOpacity = this.originals.setOpacity;
      if (this.originals.rescale) instruments.rescale = this.originals.rescale;
      if (this.originals.reset) instruments.reset = this.originals.reset;
      if (this.originals.updateScreenPositions) instruments.updateScreenPositions = this.originals.updateScreenPositions;
      if (this.originals.updateCockpitPositions) instruments.updateCockpitPositions = this.originals.updateCockpitPositions;
    }

    // Reset originals
    this.originals = {
      init: null,
      update: null,
      show: null,
      hide: null,
      toggle: null,
      setOpacity: null,
      rescale: null,
      reset: null,
      updateScreenPositions: null,
      updateCockpitPositions: null,
    };

    this.registeredInstruments.clear();
    this.isInitialized = false;
    log.info("InstrumentManager cleaned up - all original functions restored");
  }
}

export default InstrumentManager;