/// <reference path="./geofs.d.ts" />
declare global {

  interface Observer<T = any> {
    update(data: T): void;
  }

  interface AircraftMarkers {
    [key: string]: Marker;
  }

  interface AircraftGroups {
    [key: string]: string[];
  }

  interface AircraftMarkerOptions {
    anchor: number[];
    className: string;
    size: number[];
  }

  declare class Aircraft {
    static aircrafts: typeof geofs.aircraftList;
    static _instance: typeof geofs.aircraft.instance;
    get instance(): any;
    set instance(value: any);
    static refresh(): void;
    static getAllowed(group: string): any[];
    static isAllowed(group: string, itemName: string): any;
    static definitions(): any[];
    static engines(): any[];
  }

  declare class Marker {
    props: any;
    plane: any;
    constructor(props: any);
    hasChildren(): boolean;
    render(options: any): this;
    template(elementType: any, attributes?: {}): any;
    defs(indexes: any): any;
    clear(): void;
    toBase64(): string;
  }

  interface PropOptions {
    allowed: any[];
    ignored: any[];
    reset: boolean;
  }

  declare class Props {
    static reactive: any;
    static _reactive: Reactive;
    static _data: any;
    static get reactive(): Reactive;
    static set reactive(value: Reactive);
    static async load(...arr: any[]): void;
    static cleanup(): void;
    [key: string]: PropOptions;
  }

  type ReactiveCache = {
    [key: string]: boolean;
  };

  declare class Reactive {
    static _cache: ReactiveCache;
    static get cache(): any;
    static set cache(value: any);
    static parse(obj: any, propName: string): Signal<T> | void;
    static smartParse(target: string | object, propName: string): Signal<T> | void;
    static cleanup(): void;
  }

  declare class FlightStorage {
    static _version: string;
    static _options: {
      prefix: string;
    };
    static get version(): string;
    static set version(value: string);
    static get options(): any;
    static set options(value: any);
    static config(version: string, options: any): void;
    static read(key: string, defaultValue: any): any;
    static write(key: string, value: any): boolean;
    static delete(key: string): boolean;
    static readKeys(): any;
    static set(key: string, value: any): boolean;
    static add(key: string, value: any): boolean;
    static replace(key: string, itemFind: any, itemReplacement: any): boolean;
    static remove(key: string, value: any): boolean;
    static get(key: string, defaultValue: any): any;
    static getAll(): any;
    static getKeys(): any;
    static getPrefix(): string;
    static empty(): void;
    static has(key: string): boolean;
    static forEach(callbackFunc: any): void;
    static _parse(value: any): any;
    static _stringify(value: any): any;
    static _listKeys(usePrefix: boolean): any;
    static _prefix(key: string): string;
    static _unprefix(key: string): string;
    static _isJson(value: any): boolean;
    static _isUndefined(value: any): boolean;
    static _isNull(value: any): boolean;
    static _is(object: any, type: any): boolean;
  }


  var flightAssistant: ExperimentalFlightInterface.APP;

  interface UserInterface {
    left: MountableElement<HTMLElement>;
    bottom: MountableElement<HTMLElement>;
  }

  type ServiceItem = [string, any];
  interface ServiceItemInputAttributes {
    placeholder?: string;
    min?: string;
    max?: number;
    step?: string;
  }

  interface Window {
    flightAssistant: ExperimentalFlightInterface.APP;
    executeOnEventDone: (a: any, b: any) => any;
    [key: string]: any;
  }

  // FuelSystem types
  interface FuelStatus {
    isActive: boolean;
    percentage: number;
    currentGal: number;
    capacityGal: number;
    consumptionRateGalPerSec: number;
  }

  // Storage types
  interface StorageOptions {
    prefix: string;
  }

  interface StorageExport {
    version: string;
    timestamp: string;
    data: Record<string, any>;
  }

  interface StorageStats {
    totalKeys: number;
    totalSize: number;
    prefix: string;
    version: string;
    cacheEnabled: boolean;
    cacheSize: number;
  }

  // Notify types
  type NotificationType = "success" | "error" | "info" | "warning";

  interface NotificationItem {
    type: NotificationType;
    message: string;
    timestamp: number;
  }

  interface NotifyConfig {
    batchDelay?: number;
    maxBatchSize?: number;
    maxDisplayItems?: number;
  }

  // Input component shared types
  type InputType = 'int' | 'float' | 'number' | 'range' | 'color' | 'boolean' | 'text';
  type InputNotifyMode = 'input' | 'apply' | 'both' | 'none';

  interface InputRef {
    reset(): void;
    resetToDefault(): void;
  }

  interface InputProps {
    name?: string;
    label?: string;
    comment?: string;
    type?: InputType;
    resource?: string | object;
    value?: number | string | boolean;
    onChange?: (value: any) => void;
    onApply?: (value: any) => void;
    debounceApply?: number; // ms
    notifyMode?: InputNotifyMode;
    notifyCategory?: string;
    unit?: string; // display unit (e.g., '%', 'NM', 's')
    showLimits?: boolean; // show min/max under the slider
    minLabel?: string;
    maxLabel?: string;
    valueFormatter?: (v: number | string) => string;
    min?: number;
    max?: number;
    step?: number | string;
    variant?: 'default' | 'compact' | 'small' | 'wide';
    ref?: (r: InputRef) => void;
    disabled?: boolean;
    ariaLabel?: string;
  }

  // Logger types
  type LogLevel = "debug" | "info" | "warn" | "error";

  interface LoggerConfig {
    enabled: boolean;
    minLevel: LogLevel;
    prefix: string;
    showTimestamp: boolean;
    devMode: boolean;
  }

  // SaveManager types
  interface AircraftSaveData {
    aircraftId: number;
    aircraftName: string;
    timestamp: number;
    version: string;
    definition: Record<string, any>;
    engines: EngineData[];
  }

  interface EngineData {
    index: number;
    name: string;
    data: Record<string, any>;
  }
}

declare namespace ExperimentalFlightInterface {
  export interface Status {
    loading: boolean;
    ready: boolean;
    initDelay?: number;
    error?: Error | string;
  }

  export interface Refs {
    [key: string]: any;
  }
  export interface Instance {
    [key: string]: any;
  }
  export interface APP {
    version: string;
    status?: Status;
    refs: Refs;
    instance: Instance;
    aircraft?: Aircraft;
    Storage?: typeof FlightStorage;
    getAircraftKey?: () => string | null;
  }
}

interface AppStatus extends ExperimentalFlightInterface.Status { }

declare module "solid-js" {
  namespace JSX {
    interface CoreSVGAttributes {
      name?: string;
      filters?: number[];
    }
  }
}
export { };
