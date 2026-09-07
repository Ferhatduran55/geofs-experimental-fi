import type { JSX } from "solid-js";

/**
 * Global GeoFS Flight Assistant Core Events
 */
export interface CoreEvents {
  // GeoFS Lifecycle
  "geofs:ready": void;
  "geofs:pause": boolean;

  // Aircraft
  "aircraft:changed": {
    id: string | number;
    name: string;
    definition: any;
    engines: any[];
    massKg: number;
  };
  "aircraft:crashed": void;

  // Flight Loop & Dynamics
  "flight:tick": {
    deltaTime: number;
    kias: number;
    altitudeFt: number;
    verticalSpeedFpm: number;
    gForce: number;
    groundContact: boolean;
    lla: [number, number, number];
  };
  "flight:frame": void;

  // Flight States (Calculated by State Machine or Core)
  "flight:takeoff_pending": void;
  "flight:takeoff": {
    airportIcao: string;
    coordinates: [number, number, number];
    timestamp: number;
  };
  "flight:touchdown": {
    isHardLanding: boolean;
    verticalSpeedFpm: number;
    gForce: number;
  };
  "flight:landed": {
    airportIcao: string;
    coordinates: [number, number, number];
    timestamp: number;
    flightDurationMs: number;
    flownDistanceNm: number;
    maxGForce: number;
    touchdownVsfpm: number;
  };

  // Module Lifecycle
  "module:registered": { moduleId: string; name: string };
  "module:enabled": { moduleId: string };
  "module:disabled": { moduleId: string };
  "module:error": { moduleId: string; error: Error | string };

  // UI & Settings
  "ui:reload": void;
  "storage:changed": { key: string; value: any };
}

/**
 * UI Tab Registration Definition
 */
export interface TabDefinition {
  id: string;
  title: string;
  icon: (props: any) => JSX.Element;
  order?: number;
  className?: string;
  render: () => Promise<JSX.Element[]> | JSX.Element[];
  onReset?: () => void;
  badge?: () => string | number | null;
}

/**
 * Settings Section Definition (rendered inside Settings tab)
 */
export interface SettingsDefinition {
  id: string;
  label: string;
  description: string;
  renderPanel?: () => JSX.Element;
}

/**
 * Standard Module Interface (Anakart / Eklenti Modülü Kontratı)
 */
export interface IModule {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description?: string;
  readonly defaultEnabled?: boolean;

  /**
   * Called once during application boot to configure the module.
   */
  init(core: ICoreEngine): Promise<void> | void;

  /**
   * Called when module is toggled on / activated.
   */
  enable(): Promise<void> | void;

  /**
   * Called when module is toggled off / deactivated.
   */
  disable(): Promise<void> | void;

  /**
   * Optional: Returns whether module is currently active.
   */
  isEnabled?(): boolean;

  /**
   * Optional: Provide a UI Tab for the assistant menu.
   */
  getTabDefinition?(): TabDefinition | null;

  /**
   * Optional: Provide settings toggle & controls for Settings tab.
   */
  getSettingsDefinition?(): SettingsDefinition | null;

  /**
   * Optional: Cleanup when completely unloaded or reloaded.
   */
  destroy?(): void;
}

/**
 * Core Engine Public Interface
 */
export interface ICoreEngine {
  readonly version: string;
  readonly eventBus: IEventBus;
  readonly modules: IModuleRunner;
  readonly ui: IUIRegistry;
  
  start(): Promise<void>;
  reload(): void;
}

/**
 * Event Bus Interface
 */
export interface IEventBus {
  on<K extends keyof CoreEvents>(event: K, listener: (data: CoreEvents[K]) => void): () => void;
  once<K extends keyof CoreEvents>(event: K, listener: (data: CoreEvents[K]) => void): () => void;
  emit<K extends keyof CoreEvents>(event: K, data: CoreEvents[K]): void;
  off<K extends keyof CoreEvents>(event: K, listener: (data: CoreEvents[K]) => void): void;
  clear(): void;
}

/**
 * Module Runner Interface
 */
export interface IModuleRunner {
  register(module: IModule): void;
  get(id: string): IModule | undefined;
  getAll(): IModule[];
  isEnabled(id: string): boolean;
  enable(id: string): Promise<boolean>;
  disable(id: string): Promise<boolean>;
  toggle(id: string): Promise<boolean>;
}

/**
 * UI Registry Interface
 */
export interface IUIRegistry {
  registerTab(tab: TabDefinition): void;
  unregisterTab(id: string): void;
  getTabs(): TabDefinition[];
  requestReload(): void;
  onReloadRequested(callback: () => void): () => void;
}
