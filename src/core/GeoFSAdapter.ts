import Logger from "../shared/Logger";
import type { IEventBus } from "./types";

const log = Logger.create("GeoFSAdapter");

export class GeoFSAdapter {
  private eventBus: IEventBus;
  private lastAircraftId: string | number | null = null;
  private aircraftCheckTimer: number | null = null;
  private frameCallbackId: number | null = null;
  private isHooked: boolean = false;
  private originalFlightTick: ((e: number, t: number, a: number) => void) | null = null;

  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Start listening to GeoFS events and hooking tick/frame
   */
  init(): void {
    if (this.isHooked) return;

    this.waitForGeoFSReady(() => {
      this.setupAircraftMonitoring();
      this.setupFlightTickHook();
      this.setupFrameCallback();
      this.eventBus.emit("geofs:ready", undefined as void);
      log.info("GeoFS Adapter initialized and connected");
    });

    this.isHooked = true;
  }

  private waitForGeoFSReady(callback: () => void): void {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs && geofs.isReady) {
      callback();
      return;
    }

    if (typeof (unsafeWindow as any).executeOnEventDone === "function") {
      (unsafeWindow as any).executeOnEventDone("geofsStarted", () => {
        callback();
      });
    } else {
      // Fallback polling
      const check = setInterval(() => {
        const g = (unsafeWindow as any).geofs;
        if (g && (g.isReady || g.aircraft?.instance)) {
          clearInterval(check);
          callback();
        }
      }, 500);
    }
  }

  private setupAircraftMonitoring(): void {
    if (this.aircraftCheckTimer !== null) return;

    const checkAircraft = () => {
      const geofs = (unsafeWindow as any).geofs;
      const currentInstance = geofs?.aircraft?.instance;
      const currentId = currentInstance?.id;

      if (currentInstance && currentId !== undefined && currentId !== this.lastAircraftId) {
        this.lastAircraftId = currentId;
        const massKg = currentInstance.definition?.mass || 1500;
        const name = currentInstance.aircraftRecord?.name || currentInstance.definition?.name || "Unknown Aircraft";

        log.info(`Aircraft changed to: ${name} (ID: ${currentId}, Mass: ${massKg}kg)`);

        this.eventBus.emit("aircraft:changed", {
          id: currentId,
          name,
          definition: currentInstance.definition || {},
          engines: currentInstance.engines || [],
          massKg,
        });
      }
    };

    // Initial check
    checkAircraft();
    this.aircraftCheckTimer = window.setInterval(checkAircraft, 1000);
  }

  private setupFlightTickHook(): void {
    const flight = (unsafeWindow as any).flight;
    if (!flight || typeof flight.tick !== "function") {
      setTimeout(() => this.setupFlightTickHook(), 1000);
      return;
    }

    if (this.originalFlightTick) return;

    this.originalFlightTick = flight.tick.bind(flight);
    const self = this;

    flight.tick = function (e: number, t: number, a: number) {
      if (self.originalFlightTick) {
        self.originalFlightTick(e, t, a);
      }

      const geofs = (unsafeWindow as any).geofs;
      if (!geofs || geofs.pause) return;

      const inst = geofs.aircraft?.instance;
      if (!inst) return;

      const anim = geofs.animation?.values || {};
      const kias = anim.kias || 0;
      const altitudeFt = anim.altitude !== undefined ? anim.altitude * 3.28084 : (inst.llaLocation ? inst.llaLocation[2] * 3.28084 : 0);
      const verticalSpeedFpm = anim.verticalSpeed || 0;
      const accZ = anim.accZ !== undefined ? anim.accZ : 9.8;
      const gForce = Math.abs(accZ / 9.8);
      const groundContact = inst.groundContact === true;
      const lla = inst.llaLocation || [0, 0, 0];

      self.eventBus.emit("flight:tick", {
        deltaTime: e || 0.016,
        kias,
        altitudeFt,
        verticalSpeedFpm,
        gForce,
        groundContact,
        lla: [lla[0] || 0, lla[1] || 0, lla[2] || 0],
      });
    };

    log.debug("Hooked into GeoFS flight.tick");
  }

  private setupFrameCallback(): void {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs?.api?.addFrameCallback && this.frameCallbackId === null) {
      this.frameCallbackId = geofs.api.addFrameCallback(() => {
        this.eventBus.emit("flight:frame", undefined as void);
      }, "efiCoreFrame");
      log.debug("Registered GeoFS frame callback");
    }
  }

  destroy(): void {
    if (this.aircraftCheckTimer !== null) {
      clearInterval(this.aircraftCheckTimer);
      this.aircraftCheckTimer = null;
    }

    const geofs = (unsafeWindow as any).geofs;
    if (this.frameCallbackId !== null && geofs?.api?.removeFrameCallback) {
      geofs.api.removeFrameCallback(this.frameCallbackId);
      this.frameCallbackId = null;
    }

    const flight = (unsafeWindow as any).flight;
    if (flight && this.originalFlightTick) {
      flight.tick = this.originalFlightTick;
      this.originalFlightTick = null;
    }

    this.isHooked = false;
    log.info("GeoFS Adapter destroyed");
  }
}
