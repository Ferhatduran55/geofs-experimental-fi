import Logger from "./Logger";

const log = Logger.create("InstrumentManager");

export interface RegisteredInstrument {
  definition: InstrumentDef;
  indicator: any | null;
  isActive: boolean;
  isVisible: boolean;
  order: number;
}

type GeoFSFunction = (...args: any[]) => any;

interface OriginalFunctions {
  init: GeoFSFunction | null;
  show: GeoFSFunction | null;
  hide: GeoFSFunction | null;
  toggle: GeoFSFunction | null;
  rescale: GeoFSFunction | null;
}

interface Position {
  x: number;
  y: number;
}

interface LayoutCursorSnapshot {
  stackPosition?: Position;
  startPosition?: Position;
}

interface GaugeMetrics {
  width: number;
  height: number;
  anchorX: number;
  anchorY: number;
  positionScaleX: number;
  positionScaleY: number;
}

interface LayoutItem {
  name: string;
  indicator: any;
  overlay: any;
  registered: RegisteredInstrument | undefined;
  containerKey: string;
  metrics: GaugeMetrics;
}

interface Viewport {
  width: number;
  height: number;
}

/**
 * Keeps custom gauges in the GeoFS instrument system without rebuilding every
 * native gauge when a feature is toggled.  GeoFS mutates an overlay's runtime
 * `position` on every screen update, so persistent layout changes must be made
 * on the root overlay definition as well.
 */
export class InstrumentManager {
  private static registeredInstruments: Map<string, RegisteredInstrument> = new Map();
  private static originals: OriginalFunctions = {
    init: null,
    show: null,
    hide: null,
    toggle: null,
    rescale: null,
  };
  private static wrappedFunctions: Partial<Record<keyof OriginalFunctions, GeoFSFunction>> = {};
  private static nativeOriginalPositions: Map<any, Position> = new Map();
  private static cursorSnapshot: LayoutCursorSnapshot | null = null;
  private static isInitialized: boolean = false;
  private static areInstrumentsGloballyVisible: boolean = true;
  private static hooksInstalled: boolean = false;
  private static isSynchronizing: boolean = false;
  private static registrationOrder: number = 0;
  private static layoutTimer: number | null = null;
  private static syncTimer: number | null = null;
  private static resizeHandler: (() => void) | null = null;
  private static aircraftLoadedHandler: (() => void) | null = null;

  static init(): void {
    if (this.isInitialized) return;

    const instruments = (unsafeWindow as any).instruments;
    if (!instruments) {
      log.warn("GeoFS instruments system not available yet");
      return;
    }

    this.areInstrumentsGloballyVisible = instruments.visible !== false && instruments.isVisible !== false;
    this.isInitialized = true;
    this.installGeoFSSyncHooks();
    this.reinitializeActiveInstruments();
    log.info("InstrumentManager initialized with synchronized adaptive gauge layout");
  }

  /**
   * Mirrors GeoFS lifecycle events only after GeoFS has completed its own work.
   * The manager never calls instruments.init() for an individual custom gauge:
   * doing so destroys and recreates every native gauge and leaves stale overlay
   * positions behind after a feature is toggled.
   */
  static installGeoFSSyncHooks(): void {
    if (this.hooksInstalled) return;

    const instruments = (unsafeWindow as any).instruments;
    const geofs = (unsafeWindow as any).geofs;
    if (!instruments) return;

    this.hooksInstalled = true;

    const originalInit = instruments.init;
    if (typeof originalInit === "function") {
      this.originals.init = originalInit;
      const wrappedInit = function (this: any, ...args: any[]) {
        // Native indicators are about to be destroyed, so their saved positions
        // and the old stacking cursor are no longer useful.
        InstrumentManager.clearNativeLayoutState();
        const result = originalInit.apply(this, args);
        InstrumentManager.reinitializeActiveInstruments();
        InstrumentManager.scheduleLayout();
        return result;
      };
      instruments.init = wrappedInit;
      this.wrappedFunctions.init = wrappedInit;
    }

    const originalHide = instruments.hide;
    if (typeof originalHide === "function") {
      this.originals.hide = originalHide;
      const wrappedHide = function (this: any, ...args: any[]) {
        const result = originalHide.apply(this, args);
        if (InstrumentManager.isGlobalVisibilityCall(args)) {
          InstrumentManager.setGlobalVisibility(false);
        } else {
          InstrumentManager.enforceRegisteredVisibility();
          InstrumentManager.recalculateAllInstrumentPositions();
        }
        return result;
      };
      instruments.hide = wrappedHide;
      this.wrappedFunctions.hide = wrappedHide;
    }

    const originalShow = instruments.show;
    if (typeof originalShow === "function") {
      this.originals.show = originalShow;
      const wrappedShow = function (this: any, ...args: any[]) {
        const result = originalShow.apply(this, args);
        if (InstrumentManager.isGlobalVisibilityCall(args)) {
          InstrumentManager.setGlobalVisibility(true);
        } else {
          // GeoFS group show() can make a locally hidden custom gauge visible.
          // Re-apply the feature's local visibility state afterwards.
          InstrumentManager.enforceRegisteredVisibility();
          InstrumentManager.recalculateAllInstrumentPositions();
        }
        return result;
      };
      instruments.show = wrappedShow;
      this.wrappedFunctions.show = wrappedShow;
    }

    const originalToggle = instruments.toggle;
    if (typeof originalToggle === "function") {
      this.originals.toggle = originalToggle;
      const wrappedToggle = function (this: any, ...args: any[]) {
        const result = originalToggle.apply(this, args);
        if (InstrumentManager.isGlobalVisibilityCall(args)) {
          InstrumentManager.setGlobalVisibility(instruments.visible !== false && instruments.isVisible !== false);
        } else {
          InstrumentManager.enforceRegisteredVisibility();
          InstrumentManager.recalculateAllInstrumentPositions();
        }
        return result;
      };
      instruments.toggle = wrappedToggle;
      this.wrappedFunctions.toggle = wrappedToggle;
    }

    const originalRescale = instruments.rescale;
    if (typeof originalRescale === "function") {
      this.originals.rescale = originalRescale;
      const wrappedRescale = function (this: any, ...args: any[]) {
        const result = originalRescale.apply(this, args);
        InstrumentManager.recalculateAllInstrumentPositions();
        return result;
      };
      instruments.rescale = wrappedRescale;
      this.wrappedFunctions.rescale = wrappedRescale;
    }

    this.resizeHandler = () => this.scheduleLayout();
    window.addEventListener("resize", this.resizeHandler);

    if (typeof geofs?.api?.addCallback === "function") {
      const aircraftLoadedHandler = () => {
        if (InstrumentManager.aircraftLoadedHandler !== aircraftLoadedHandler) return;
        window.setTimeout(() => {
          if (!InstrumentManager.isInitialized || InstrumentManager.aircraftLoadedHandler !== aircraftLoadedHandler) return;
          InstrumentManager.reinitializeActiveInstruments();
          InstrumentManager.scheduleLayout();
        }, 350);
      };
      this.aircraftLoadedHandler = aircraftLoadedHandler;
      try {
        geofs.api.addCallback("aircraftLoaded", aircraftLoadedHandler);
      } catch (error) {
        log.debug("Could not install aircraft-loaded instrument hook", error);
      }
    }
  }

  /**
   * Registers a custom definition without resetting an existing feature's
   * active/visible state.  Resetting that state during a reactivation was one
   * of the causes of duplicate/stale fuel indicators.
   */
  static registerDefinition(definition: InstrumentDef): boolean {
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments?.definitions) {
      log.error("instruments.definitions not available");
      return false;
    }

    const existing = this.registeredInstruments.get(definition.name);
    if (existing) {
      existing.definition = definition;
      existing.indicator = instruments.list?.[definition.name] || existing.indicator;
    } else {
      this.registeredInstruments.set(definition.name, {
        definition,
        indicator: null,
        isActive: false,
        isVisible: true,
        order: this.registrationOrder++,
      });
    }

    const registered = this.registeredInstruments.get(definition.name);
    if (registered) {
      this.ensureDefinition(definition.name, registered);
    }

    log.debug(`Registered instrument definition: ${definition.name}`);
    return true;
  }

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

    registered.isActive = true;
    registered.isVisible = true;
    this.reinitializeActiveInstruments();
    this.recalculateAllInstrumentPositions();
    log.debug(`Activated instrument: ${name}`);
    return true;
  }

  /**
   * Removes only the requested custom indicator.  Native gauges remain intact,
   * and the remaining gauges are laid out again immediately.
   */
  static deactivateInstrument(name: string): boolean {
    const registered = this.registeredInstruments.get(name);
    if (!registered) return false;

    const wasActive = registered.isActive;
    registered.isActive = false;
    registered.isVisible = false;

    if (wasActive) {
      this.callLifecycleCallback(registered.definition.onDestroy, `destroy ${name}`);
    }

    this.removeRegisteredIndicator(name, registered, true);

    if (this.hasActiveInstruments()) {
      this.recalculateAllInstrumentPositions();
    } else {
      this.restoreNativePositions();
      this.restoreLayoutCursors((unsafeWindow as any).instruments);
    }

    log.debug(`Deactivated instrument: ${name}`);
    return true;
  }

  /**
   * Ensures currently active custom indicators exist after an aircraft/native
   * instrument reload.  It deliberately does not call instruments.init().
   */
  static reinitializeActiveInstruments(): void {
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments || this.isSynchronizing) return;

    if (!instruments.list) instruments.list = {};

    this.isSynchronizing = true;
    let needsConstructorRetry = false;

    try {
      const IndicatorClass = this.getIndicatorConstructor(instruments);

      for (const [name, registered] of this.registeredInstruments) {
        if (!registered.isActive) {
          this.removeRegisteredIndicator(name, registered, false);
          continue;
        }

        this.ensureDefinition(name, registered);
        const currentIndicator = instruments.list[name];

        if (currentIndicator) {
          const isNewReference = currentIndicator !== registered.indicator;
          registered.indicator = currentIndicator;
          this.registerInGeoFSGroups(name, currentIndicator, registered.definition, instruments);
          this.setIndicatorVisibility(currentIndicator, this.areInstrumentsGloballyVisible && registered.isVisible);
          if (isNewReference) {
            this.callLifecycleCallback(registered.definition.onInit, `initialize ${name}`);
          }
          continue;
        }

        if (!IndicatorClass) {
          needsConstructorRetry = true;
          continue;
        }

        try {
          const indicator = new IndicatorClass(instruments.definitions[name], name);
          instruments.list[name] = indicator;
          registered.indicator = indicator;
          this.registerInGeoFSGroups(name, indicator, registered.definition, instruments);

          if (typeof indicator.init === "function") {
            indicator.init();
          }

          this.setIndicatorVisibility(indicator, this.areInstrumentsGloballyVisible && registered.isVisible);
          this.callLifecycleCallback(registered.definition.onInit, `initialize ${name}`);
        } catch (error) {
          needsConstructorRetry = true;
          log.error(`Failed to instantiate instrument: ${name}`, error);
        }
      }
    } finally {
      this.isSynchronizing = false;
    }

    if (needsConstructorRetry) {
      this.scheduleSynchronizationRetry();
    }

    if (this.hasActiveInstruments()) {
      this.recalculateAllInstrumentPositions();
    }
  }

  /**
   * Reflows only root overlays.  Child overlays are intentionally left at their
   * own local coordinates: moving needles/disks to a gauge's absolute position
   * breaks their parent-relative transforms and is what makes circular gauges
   * appear to overlap.
   */
  static recalculateAllInstrumentPositions(): void {
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments?.list || !this.hasActiveInstruments() || !this.areInstrumentsGloballyVisible) return;

    const viewport = this.getViewport();
    const byContainer = new Map<string, LayoutItem[]>();

    for (const name of Object.keys(instruments.list)) {
      const indicator = instruments.list[name];
      const registered = this.registeredInstruments.get(name);

      if (!indicator?.overlay) continue;
      if (registered && (!registered.isActive || !registered.isVisible)) continue;
      if (!registered && indicator.visibility === false) continue;

      const definition = indicator.definition || registered?.definition;
      const geofs = (unsafeWindow as any).geofs;
      if (geofs?.camera?.currentModeName === "cockpit" && definition?.cockpit) continue;

      const overlay = indicator.overlay;
      const containerKey = typeof definition?.container === "string" ? definition.container : "__default__";
      const item: LayoutItem = {
        name,
        indicator,
        overlay,
        registered,
        containerKey,
        metrics: this.getGaugeMetrics(indicator, overlay, viewport),
      };

      const items = byContainer.get(containerKey) || [];
      items.push(item);
      byContainer.set(containerKey, items);
    }

    const allItems: LayoutItem[] = [];
    for (const items of byContainer.values()) {
      const orderedItems = this.orderLayoutItems(items);
      this.layoutContainer(orderedItems, viewport);
      allItems.push(...orderedItems);
    }

    this.updateLayoutCursor(instruments, allItems);
  }

  static setGlobalVisibility(visible: boolean): void {
    this.areInstrumentsGloballyVisible = visible;
    this.enforceRegisteredVisibility();

    if (visible) {
      this.recalculateAllInstrumentPositions();
      this.scheduleLayout();
    }
  }

  static isActive(name: string): boolean {
    return this.registeredInstruments.get(name)?.isActive ?? false;
  }

  static exists(name: string): boolean {
    const instruments = (unsafeWindow as any).instruments;
    return !!instruments?.list?.[name];
  }

  static isVisible(name: string): boolean {
    const registered = this.registeredInstruments.get(name);
    if (registered) {
      return registered.isActive && registered.isVisible && this.areInstrumentsGloballyVisible;
    }

    const indicator = (unsafeWindow as any).instruments?.list?.[name];
    return !!indicator && indicator.visibility !== false;
  }

  static getIndicator(name: string): any {
    return this.registeredInstruments.get(name)?.indicator || (unsafeWindow as any).instruments?.list?.[name];
  }

  static show(name: string): void {
    const registered = this.registeredInstruments.get(name);
    if (registered) {
      registered.isVisible = true;
      if (registered.isActive) {
        this.reinitializeActiveInstruments();
        this.setIndicatorVisibility(registered.indicator, this.areInstrumentsGloballyVisible);
        this.recalculateAllInstrumentPositions();
      }
      log.debug(`Showed instrument: ${name}`);
      return;
    }

    const indicator = (unsafeWindow as any).instruments?.list?.[name];
    if (indicator) {
      this.setIndicatorVisibility(indicator, true);
      this.recalculateAllInstrumentPositions();
    }
  }

  static hide(name: string): void {
    const registered = this.registeredInstruments.get(name);
    if (registered) {
      registered.isVisible = false;
      this.setIndicatorVisibility(registered.indicator, false);
      this.recalculateAllInstrumentPositions();
      log.debug(`Hid instrument: ${name}`);
      return;
    }

    const indicator = (unsafeWindow as any).instruments?.list?.[name];
    if (indicator) {
      this.setIndicatorVisibility(indicator, false);
      this.recalculateAllInstrumentPositions();
    }
  }

  static toggle(name: string): void {
    if (this.isVisible(name)) {
      this.hide(name);
    } else {
      this.show(name);
    }
  }

  static setOpacity(name: string, opacity: number): void {
    const indicator = (unsafeWindow as any).instruments?.list?.[name];
    if (indicator?.overlay?.setOpacity) {
      indicator.overlay.setOpacity(opacity);
    }
  }

  static rescale(name: string): void {
    const indicator = (unsafeWindow as any).instruments?.list?.[name];
    if (indicator) {
      if (typeof indicator.scale === "function") {
        indicator.scale();
      } else if (typeof indicator.rescale === "function") {
        indicator.rescale();
      }
      this.recalculateAllInstrumentPositions();
    }
  }

  static updateScreenPosition(name: string): void {
    const indicator = (unsafeWindow as any).instruments?.list?.[name];
    if (!indicator) return;

    const geofs = (unsafeWindow as any).geofs;
    if (geofs?.camera?.currentModeName === "cockpit" && indicator.definition?.cockpit && typeof indicator.updateCockpitPosition === "function") {
      indicator.updateCockpitPosition();
      return;
    }

    this.recalculateAllInstrumentPositions();
  }

  static unregister(name: string): void {
    this.deactivateInstrument(name);
    this.registeredInstruments.delete(name);
    log.debug(`Unregistered instrument: ${name}`);
  }

  static getRegisteredInstruments(): string[] {
    return Array.from(this.registeredInstruments.keys());
  }

  static getActiveInstruments(): string[] {
    return Array.from(this.registeredInstruments.entries())
      .filter(([, registered]) => registered.isActive)
      .map(([name]) => name);
  }

  static cleanup(): void {
    const instruments = (unsafeWindow as any).instruments;

    for (const [name, registered] of this.registeredInstruments) {
      if (registered.isActive) {
        this.callLifecycleCallback(registered.definition.onDestroy, `destroy ${name}`);
      }
      registered.isActive = false;
      registered.isVisible = false;
      this.removeRegisteredIndicator(name, registered, true);
    }

    this.restoreNativePositions();
    this.restoreLayoutCursors(instruments);
    this.restoreGeoFSHooks(instruments);

    const geofs = (unsafeWindow as any).geofs;
    if (this.aircraftLoadedHandler && typeof geofs?.api?.removeCallback === "function") {
      try {
        geofs.api.removeCallback("aircraftLoaded", this.aircraftLoadedHandler);
      } catch {
        // Older GeoFS builds do not support removing callbacks by reference.
      }
    }

    if (this.resizeHandler) {
      window.removeEventListener("resize", this.resizeHandler);
      this.resizeHandler = null;
    }
    if (this.layoutTimer !== null) {
      window.clearTimeout(this.layoutTimer);
      this.layoutTimer = null;
    }
    if (this.syncTimer !== null) {
      window.clearTimeout(this.syncTimer);
      this.syncTimer = null;
    }

    this.registeredInstruments.clear();
    this.nativeOriginalPositions.clear();
    this.cursorSnapshot = null;
    this.wrappedFunctions = {};
    this.originals = {
      init: null,
      show: null,
      hide: null,
      toggle: null,
      rescale: null,
    };
    this.areInstrumentsGloballyVisible = true;
    this.hooksInstalled = false;
    this.isSynchronizing = false;
    this.isInitialized = false;
    this.registrationOrder = 0;
    this.aircraftLoadedHandler = null;
    log.info("InstrumentManager cleaned up");
  }

  private static hasActiveInstruments(): boolean {
    return Array.from(this.registeredInstruments.values()).some((registered) => registered.isActive);
  }

  private static ensureDefinition(name: string, registered: RegisteredInstrument): void {
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments?.definitions) return;
    instruments.definitions[name] = this.toGeoFSDefinition(registered.definition);
  }

  /**
   * GeoFS mutates overlay definitions while constructing an Indicator.  Give it
   * a private deep copy so repeated activations begin from a clean definition
   * and never mutate the application's source definition.
   */
  private static toGeoFSDefinition(definition: InstrumentDef): any {
    const source = definition as any;
    const geoFSDefinition: any = {};
    const lifecycleKeys = new Set(["name", "onInit", "onDestroy", "onShow", "onHide", "onUpdate"]);

    for (const key of Object.keys(source)) {
      if (!lifecycleKeys.has(key)) {
        geoFSDefinition[key] = this.cloneData(source[key]);
      }
    }

    geoFSDefinition.stackX = definition.stackX ?? true;
    geoFSDefinition.group = definition.group || "all";
    geoFSDefinition.compositors = definition.compositors || "css";
    return geoFSDefinition;
  }

  private static cloneData<T>(value: T, seen: WeakMap<object, any> = new WeakMap()): T {
    if (value === null || typeof value !== "object") return value;

    const existing = seen.get(value as object);
    if (existing) return existing;

    if (Array.isArray(value)) {
      const clone: any[] = [];
      seen.set(value, clone);
      for (const item of value) clone.push(this.cloneData(item, seen));
      return clone as T;
    }

    const clone: Record<string, any> = {};
    seen.set(value as object, clone);
    for (const key of Object.keys(value as Record<string, any>)) {
      clone[key] = this.cloneData((value as Record<string, any>)[key], seen);
    }
    return clone as T;
  }

  private static getIndicatorConstructor(instruments: any): any | null {
    for (const name of Object.keys(instruments.list || {})) {
      if (this.registeredInstruments.has(name)) continue;
      const candidate = instruments.list[name]?.constructor;
      if (typeof candidate === "function" && candidate !== Object) return candidate;
    }

    for (const registered of this.registeredInstruments.values()) {
      const candidate = registered.indicator?.constructor;
      if (typeof candidate === "function" && candidate !== Object) return candidate;
    }

    const geofs = (unsafeWindow as any).geofs;
    const candidates = [
      instruments.Indicator,
      geofs?.gui?.Indicator,
      geofs?.Indicator,
      (unsafeWindow as any).Indicator,
    ];

    return candidates.find((candidate) => typeof candidate === "function") || null;
  }

  private static removeRegisteredIndicator(name: string, registered: RegisteredInstrument, destroyDetachedReference: boolean): void {
    const instruments = (unsafeWindow as any).instruments;
    const listIndicator = instruments?.list?.[name];
    const indicator = listIndicator || (destroyDetachedReference ? registered.indicator : null);

    if (indicator) {
      try {
        if (typeof indicator.destroy === "function") {
          indicator.destroy();
        } else {
          const element = this.getOverlayElement(indicator.overlay);
          element?.remove();
        }
      } catch (error) {
        log.debug(`Could not destroy instrument: ${name}`, error);
      }
    }

    if (instruments?.list) delete instruments.list[name];
    if (instruments?.definitions) delete instruments.definitions[name];

    if (instruments?.groups) {
      for (const group of Object.values(instruments.groups) as any[]) {
        if (group && typeof group === "object") delete group[name];
      }
    }

    registered.indicator = null;
  }

  private static registerInGeoFSGroups(name: string, indicator: any, definition: InstrumentDef, instruments: any): void {
    if (!instruments.groups) return;
    const groupName = definition.group || "all";
    instruments.groups[groupName] = instruments.groups[groupName] || {};
    instruments.groups[groupName][name] = indicator;
  }

  private static callLifecycleCallback(callback: (() => void) | undefined, action: string): void {
    if (!callback) return;
    try {
      callback();
    } catch (error) {
      log.debug(`Instrument lifecycle callback failed during ${action}`, error);
    }
  }

  private static setIndicatorVisibility(indicator: any, visible: boolean): void {
    if (!indicator) return;

    try {
      if (typeof indicator.setVisibility === "function") {
        indicator.setVisibility(visible);
      } else if (visible && typeof indicator.show === "function") {
        indicator.show();
      } else if (!visible && typeof indicator.hide === "function") {
        indicator.hide();
      } else {
        indicator.visibility = visible;
        const element = this.getOverlayElement(indicator.overlay);
        if (element?.style) element.style.display = visible ? "" : "none";
      }
    } catch (error) {
      log.debug("Could not update instrument visibility", error);
    }

    indicator.visibility = visible;
  }

  private static enforceRegisteredVisibility(): void {
    const instruments = (unsafeWindow as any).instruments;
    if (!instruments?.list) return;

    for (const [name, registered] of this.registeredInstruments) {
      if (!registered.isActive) continue;
      const indicator = instruments.list[name] || registered.indicator;
      registered.indicator = indicator || null;
      this.setIndicatorVisibility(indicator, this.areInstrumentsGloballyVisible && registered.isVisible);
    }
  }

  private static isGlobalVisibilityCall(args: any[]): boolean {
    return args.length === 0 || args[0] === undefined || args[0] === null || args[0] === "all";
  }

  private static orderLayoutItems(items: LayoutItem[]): LayoutItem[] {
    const nativeItems = items.filter((item) => !item.registered);
    const customItems = items
      .filter((item) => !!item.registered)
      .sort((left, right) => (left.registered?.order || 0) - (right.registered?.order || 0));

    return [...nativeItems, ...customItems];
  }

  /**
   * Uses the rendered root dimensions (including CSS borders when measurable),
   * instead of assuming every gauge is exactly 200 px wide.  That gives circular
   * gauges a real visual gap rather than allowing their outlines to touch.
   */
  private static getGaugeMetrics(indicator: any, overlay: any, viewport: Viewport): GaugeMetrics {
    const definition = overlay?.definition || indicator?.definition?.overlay || {};
    const definitionWidth = this.numberOr(definition?.size?.x, this.numberOr(overlay?.size?.x, 200));
    const definitionHeight = this.numberOr(definition?.size?.y, this.numberOr(overlay?.size?.y, definitionWidth));
    const overlayWidth = this.finiteNumber(overlay?.size?.x);
    const overlayHeight = this.finiteNumber(overlay?.size?.y);
    const element = this.getOverlayElement(overlay);
    const rect = element?.getBoundingClientRect?.();
    const measuredWidth = this.finiteNumber(rect?.width) || this.finiteNumber(rect ? rect.right - rect.left : undefined);
    const measuredHeight = this.finiteNumber(rect?.height) || this.finiteNumber(rect ? rect.bottom - rect.top : undefined);

    const fallbackScale = this.getFallbackViewportScale(viewport);
    const rawScaleX = overlayWidth && definitionWidth > 0 ? overlayWidth / definitionWidth : undefined;
    const rawScaleY = overlayHeight && definitionHeight > 0 ? overlayHeight / definitionHeight : undefined;
    const overlayScaleX = this.finiteNumber(overlay?.scale?.x);
    const overlayScaleY = this.finiteNumber(overlay?.scale?.y);

    const visualScaleX = this.resolveVisualScale(rawScaleX, overlayScaleX, measuredWidth, definition?.rescale, fallbackScale);
    const visualScaleY = this.resolveVisualScale(rawScaleY, overlayScaleY, measuredHeight, definition?.rescale, fallbackScale);
    const positionScaleX = definition?.rescalePosition ? visualScaleX : 1;
    const positionScaleY = definition?.rescalePosition ? visualScaleY : 1;

    const rootAnchorX = this.finiteNumber(overlay?.anchor?.x);
    const rootAnchorY = this.finiteNumber(overlay?.anchor?.y);
    const definitionAnchorX = this.numberOr(definition?.anchor?.x, definitionWidth / 2);
    const definitionAnchorY = this.numberOr(definition?.anchor?.y, definitionHeight / 2);
    const anchorXNeedsFallbackScale = !measuredWidth && !!definition?.rescale && fallbackScale < 1 &&
      (rawScaleX === undefined || Math.abs(rawScaleX - 1) < 0.001) &&
      (overlayScaleX === undefined || Math.abs(overlayScaleX - 1) < 0.001);
    const anchorYNeedsFallbackScale = !measuredHeight && !!definition?.rescale && fallbackScale < 1 &&
      (rawScaleY === undefined || Math.abs(rawScaleY - 1) < 0.001) &&
      (overlayScaleY === undefined || Math.abs(overlayScaleY - 1) < 0.001);

    return {
      width: measuredWidth || definitionWidth * visualScaleX,
      height: measuredHeight || definitionHeight * visualScaleY,
      anchorX: anchorXNeedsFallbackScale ? definitionAnchorX * visualScaleX : (rootAnchorX ?? definitionAnchorX * visualScaleX),
      anchorY: anchorYNeedsFallbackScale ? definitionAnchorY * visualScaleY : (rootAnchorY ?? definitionAnchorY * visualScaleY),
      positionScaleX,
      positionScaleY,
    };
  }

  private static resolveVisualScale(
    rawScale: number | undefined,
    overlayScale: number | undefined,
    measuredSize: number | undefined,
    rescale: boolean | undefined,
    fallbackScale: number,
  ): number {
    if (measuredSize) {
      // The caller uses the measured size for the visual bounds.  The scale is
      // still needed only for translating a logical definition position.
      if (rawScale && rawScale > 0) return rawScale;
      if (overlayScale && overlayScale > 0) return overlayScale;
      return 1;
    }

    if (rawScale && rawScale > 0 && Math.abs(rawScale - 1) > 0.001) return rawScale;
    if (overlayScale && overlayScale > 0 && Math.abs(overlayScale - 1) > 0.001) return overlayScale;
    if (rescale && fallbackScale < 1) return fallbackScale;
    if (rawScale && rawScale > 0) return rawScale;
    if (overlayScale && overlayScale > 0) return overlayScale;
    return 1;
  }

  private static layoutContainer(items: LayoutItem[], viewport: Viewport): void {
    if (items.length === 0) return;

    const isMobile = viewport.width <= 768;
    const sidePadding = isMobile ? 8 : 20;
    // Include room for CSS borders/shadows around custom circular gauges, not
    // just the 200 px GeoFS image box.
    const horizontalGap = isMobile ? 14 : 24;
    const verticalGap = isMobile ? 14 : 20;
    const bottomPadding = isMobile ? 8 : 16;
    const availableWidth = Math.max(1, viewport.width - sidePadding * 2);
    const rows = this.splitIntoRows(items, availableWidth, horizontalGap);

    let rowBottom = bottomPadding;
    for (const row of rows) {
      const rowWidth = this.rowWidth(row, horizontalGap);
      const rowHeight = Math.max(...row.map((item) => item.metrics.height));
      let visualLeft = Math.max(sidePadding, (viewport.width - rowWidth) / 2);

      for (const item of row) {
        this.applyGaugePosition(
          item,
          visualLeft + item.metrics.anchorX,
          rowBottom + item.metrics.anchorY,
        );
        visualLeft += item.metrics.width + horizontalGap;
      }

      rowBottom += rowHeight + verticalGap;
    }
  }

  /**
   * Round-robin row assignment retains a stable zigzag ordering when a gauge is
   * added/removed, while increasing row count until every row fits the viewport.
   */
  private static splitIntoRows(items: LayoutItem[], availableWidth: number, gap: number): LayoutItem[][] {
    for (let rowCount = 1; rowCount <= items.length; rowCount++) {
      const rows: LayoutItem[][] = Array.from({ length: rowCount }, () => []);
      items.forEach((item, index) => rows[index % rowCount].push(item));
      if (rows.every((row) => this.rowWidth(row, gap) <= availableWidth)) return rows;
    }

    return items.map((item) => [item]);
  }

  private static rowWidth(items: LayoutItem[], gap: number): number {
    if (items.length === 0) return 0;
    return items.reduce((width, item) => width + item.metrics.width, 0) + gap * (items.length - 1);
  }

  /**
   * Writes the root definition before calling GeoFS placement methods.  GeoFS
   * subsequently recomputes `overlay.position` from that definition, so writing
   * only the runtime position would be overwritten on the next rescale/update.
   */
  private static applyGaugePosition(item: LayoutItem, screenX: number, screenY: number): void {
    const { indicator, overlay, registered, metrics } = item;
    const rootDefinition = overlay?.definition || indicator?.definition?.overlay;
    const definitionPositionScaleX = rootDefinition?.rescalePosition ? metrics.positionScaleX : 1;
    const definitionPositionScaleY = rootDefinition?.rescalePosition ? metrics.positionScaleY : 1;
    const definitionX = screenX / Math.max(definitionPositionScaleX, 0.001);
    const definitionY = screenY / Math.max(definitionPositionScaleY, 0.001);

    if (!registered) {
      this.rememberNativePosition(overlay);
    }

    if (rootDefinition) {
      this.setPosition(rootDefinition, definitionX, definitionY);
    }

    // Some GeoFS versions retain the screen-space position on Indicator instead
    // of Overlay. Keep that root-level state in sync, but never touch
    // overlay.children (needles/disks use parent-relative positions).
    this.setPosition(indicator, screenX, screenY);

    // The custom indicator owns this definition, so mirroring the logical
    // position here is safe and supports GeoFS versions without overlay.definition.
    if (registered && indicator?.definition?.overlay && indicator.definition.overlay !== rootDefinition) {
      this.setPosition(indicator.definition.overlay, definitionX, definitionY);
    }

    if (overlay?.position) {
      this.setPosition(overlay, screenX, screenY);
    }

    try {
      if (typeof overlay?.scaleAndPlace === "function") {
        overlay.scaleAndPlace();
      } else if (typeof overlay?.place === "function") {
        overlay.place();
      } else if (typeof overlay?.setPosition === "function") {
        overlay.setPosition({ x: screenX, y: screenY });
      }
    } catch (error) {
      log.debug(`Could not place instrument: ${item.name}`, error);
    }
  }

  private static rememberNativePosition(overlay: any): void {
    if (!overlay || this.nativeOriginalPositions.has(overlay)) return;
    const position = overlay.definition?.position || overlay.position;
    const x = this.finiteNumber(position?.x);
    const y = this.finiteNumber(position?.y);
    if (x === undefined || y === undefined) return;
    this.nativeOriginalPositions.set(overlay, { x, y });
  }

  private static restoreNativePositions(): void {
    for (const [overlay, position] of this.nativeOriginalPositions) {
      try {
        if (overlay?.definition) this.setPosition(overlay.definition, position.x, position.y);
        if (overlay?.position) this.setPosition(overlay, position.x, position.y);
        if (typeof overlay?.scaleAndPlace === "function") {
          overlay.scaleAndPlace();
        } else if (typeof overlay?.place === "function") {
          overlay.place();
        }
      } catch (error) {
        log.debug("Could not restore native gauge position", error);
      }
    }
    this.nativeOriginalPositions.clear();
  }

  private static updateLayoutCursor(instruments: any, items: LayoutItem[]): void {
    if (items.length === 0) return;
    this.rememberLayoutCursors(instruments);

    let furthestLogicalRight = 0;
    for (const item of items) {
      const screenPositionX = this.finiteNumber(item.overlay?.position?.x);
      if (screenPositionX === undefined) continue;
      const screenRight = screenPositionX - item.metrics.anchorX + item.metrics.width;
      furthestLogicalRight = Math.max(
        furthestLogicalRight,
        screenRight / Math.max(item.metrics.positionScaleX, 0.001),
      );
    }

    const logicalGap = 18 / Math.max(this.getFallbackViewportScale(this.getViewport()), 0.001);
    const nextPosition = furthestLogicalRight + logicalGap;

    if (instruments.stackPosition && typeof instruments.stackPosition === "object") {
      instruments.stackPosition.x = nextPosition;
    }
    if (instruments.startPosition && typeof instruments.startPosition === "object") {
      instruments.startPosition.x = nextPosition;
    }
  }

  private static rememberLayoutCursors(instruments: any): void {
    if (this.cursorSnapshot) return;

    const snapshot: LayoutCursorSnapshot = {};
    const stackX = this.finiteNumber(instruments?.stackPosition?.x);
    const stackY = this.finiteNumber(instruments?.stackPosition?.y);
    const startX = this.finiteNumber(instruments?.startPosition?.x);
    const startY = this.finiteNumber(instruments?.startPosition?.y);

    if (stackX !== undefined && stackY !== undefined) snapshot.stackPosition = { x: stackX, y: stackY };
    if (startX !== undefined && startY !== undefined) snapshot.startPosition = { x: startX, y: startY };
    this.cursorSnapshot = snapshot;
  }

  private static restoreLayoutCursors(instruments: any): void {
    if (!this.cursorSnapshot) return;

    if (this.cursorSnapshot.stackPosition && instruments?.stackPosition) {
      instruments.stackPosition.x = this.cursorSnapshot.stackPosition.x;
      instruments.stackPosition.y = this.cursorSnapshot.stackPosition.y;
    }
    if (this.cursorSnapshot.startPosition && instruments?.startPosition) {
      instruments.startPosition.x = this.cursorSnapshot.startPosition.x;
      instruments.startPosition.y = this.cursorSnapshot.startPosition.y;
    }
    this.cursorSnapshot = null;
  }

  private static clearNativeLayoutState(): void {
    this.nativeOriginalPositions.clear();
    this.cursorSnapshot = null;
  }

  private static getViewport(): Viewport {
    const geofs = (unsafeWindow as any).geofs;
    const dimensions = geofs?.viewportDimensions;
    const width = this.numberOr(dimensions?.x, this.numberOr(geofs?.viewportWidth, window.innerWidth));
    const height = this.numberOr(dimensions?.y, this.numberOr(geofs?.viewportHeight, window.innerHeight));
    return { width: Math.max(1, width), height: Math.max(1, height) };
  }

  private static getFallbackViewportScale(viewport: Viewport): number {
    // GeoFS screen overlays use a 1920x1080 reference layout and clamp at 0.3.
    // This fallback is used only before a newly-created overlay has been measured.
    return Math.max(0.3, Math.min(1, viewport.width / 1920, viewport.height / 1080));
  }

  private static getOverlayElement(overlay: any): HTMLElement | null {
    const candidates = [
      overlay?.overlay?._$element,
      overlay?.overlay?.element,
      overlay?.element,
      overlay?.domElement,
    ];

    for (const candidate of candidates) {
      const element = candidate?.[0] || candidate;
      if (element && typeof element.getBoundingClientRect === "function") {
        return element as HTMLElement;
      }
    }
    return null;
  }

  private static setPosition(target: any, x: number, y: number): void {
    if (!target) return;
    if (!target.position || typeof target.position !== "object") target.position = {};
    target.position.x = x;
    target.position.y = y;
  }

  private static finiteNumber(value: unknown): number | undefined {
    return typeof value === "number" && Number.isFinite(value) ? value : undefined;
  }

  private static numberOr(value: unknown, fallback: number): number {
    return this.finiteNumber(value) ?? fallback;
  }

  private static scheduleLayout(): void {
    if (this.layoutTimer !== null) return;
    this.layoutTimer = window.setTimeout(() => {
      this.layoutTimer = null;
      this.recalculateAllInstrumentPositions();
    }, 0);
  }

  private static scheduleSynchronizationRetry(): void {
    if (this.syncTimer !== null) return;
    this.syncTimer = window.setTimeout(() => {
      this.syncTimer = null;
      if (this.isInitialized) this.reinitializeActiveInstruments();
    }, 100);
  }

  private static restoreGeoFSHooks(instruments: any): void {
    for (const key of Object.keys(this.originals) as Array<keyof OriginalFunctions>) {
      const original = this.originals[key];
      const wrapped = this.wrappedFunctions[key];
      if (original && wrapped && instruments?.[key] === wrapped) {
        instruments[key] = original;
      }
    }
  }
}

export default InstrumentManager;
