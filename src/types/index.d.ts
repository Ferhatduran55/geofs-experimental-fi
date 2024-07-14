declare global {
  interface AircraftListItem {
    community: number;
    dir: string;
    multiplayerFiles: string;
    name: string;
    path: string;
  }

  interface AircraftInstanceDefinition {
    airbrakesTravelTime?: number;
    accessoriesTravelTime?: number;
    flapsTravelTime?: number;
    flapsSteps?: number;
    gearTravelTime?: number;
    zeroThrustAltitude?: number;
    zeroRPMAltitude?: number;
    mass?: number;
    minRPM?: number;
    maxRPM?: number;
  }

  interface AircraftInstanceEngineItem {
    thrust?: number;
    afterBurnerThrust?: number;
    reverseThrust?: number;
  }
  interface Geofs {
    map: {
      icons: {
        url: string;
        anchor: [number, number];
        className: string;
        size: [number, number];
      };
      planeMarker: any;
      mapActive: any;
      addPlayerMarker: (a: any, b: any, c: any) => any;
    };
    api: {
      map: {
        _map: any;
        getIcon: (a: any, b: any) => any;
        marker: any;
      };
    };
    aircraft: {
      instance: {
        id: string;
        definition?: AircraftInstanceDefinition;
        engines?: AircraftInstanceEngineItem[];
      };
    };
    aircraftList: AircraftListItem[];
  }

  interface Multiplayer {
    users: any;
  }

  interface UI {
    playerMarkers: any;
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
    static _id: string;
    static _instance: any;
    static _definition: any;
    static get instance(): any;
    static set instance(value: any);
    static get definition(): any;
    static set definition(value: any);
    static get engines(): any;
    static set engines(value: any);
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
    [key: string]: PropOptions;
  }

  type ParseOptions = {
    cloneAfterCreation?: boolean;
  };

  type ReactiveCache = {
    [key: string]: boolean;
  };

  type ReactiveOptions = {
    cloneAfterCreation: boolean;
    temp: any;
  };

  declare class Reactive {
    static _options: ReactiveOptions;
    static _cache: ReactiveCache;
    static get cache(): any;
    static set cache(value: any);
    static get options(): any;
    static set options(value: any);
    static parse(
      obj: any,
      propName: string,
      options?: ParseOptions
    ): Signal<T> | void;
  }

  declare class Storage {
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

  var geofs: Geofs;
  var multiplayer: Multiplayer;
  var ui: UI;
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
  }
}

declare namespace ExperimentalFlightInterface {
  export interface Refs {
    [key: string]: any;
  }
  export interface Instance {
    [key: string]: any;
  }
  export interface APP {
    version: string;
    refs: Refs;
    instance: Instance;
    aircraft?: Aircraft;
  }
}

declare module "solid-js" {
  namespace JSX {
    interface CoreSVGAttributes {
      name?: string;
      filters?: number[];
    }
  }
}
export {};
