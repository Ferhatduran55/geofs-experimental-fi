import Logger from "../../shared/Logger";
import Notify from "../../shared/Notify";
import FuelEngine from "../fuel/FuelEngine";
import type { AirportInfo } from "./AirportDatabase";

const log = Logger.create("SafeFlightLauncher");

export interface LaunchOptions {
  aircraftId: string | number;
  originAirport: AirportInfo;
  fuelPercent: number;
  onSuccess?: () => void;
  onError?: (err: any) => void;
}

export class SafeFlightLauncher {
  /**
   * Safely loads aircraft, positions it on runway threshold, engages brakes,
   * refuels and resets Cesium camera so it never freezes or desyncs.
   */
  static async launchFlight(options: LaunchOptions): Promise<boolean> {
    const geofs = (unsafeWindow as any).geofs;
    if (!geofs) {
      Notify.errorNow("GeoFS engine is not available");
      return false;
    }

    try {
      const targetAcId = Number(options.aircraftId);
      const currentInst = geofs.aircraft?.instance;
      const currentId = Number(currentInst?.id);

      log.info(`Launching flight: targetAcId=${targetAcId}, currentId=${currentId}, airport=${options.originAirport.icao}`);

      // 1. Change Aircraft if necessary and wait for 3D model & Cesium entity to be ready
      if (!isNaN(targetAcId) && targetAcId > 0 && currentId !== targetAcId) {
        Notify.infoNow("Loading aircraft model...");
        if (typeof geofs.aircraft?.loadAircraft === "function") {
          geofs.aircraft.loadAircraft(targetAcId);
        } else if (typeof currentInst?.change === "function") {
          currentInst.change(targetAcId);
        }

        // Wait until new aircraft instance is ready
        await this.waitForAircraftReady(targetAcId, 12000);
      }

      // 2. Refuel Aircraft
      FuelEngine.refuel(options.fuelPercent);

      // 3. Position Aircraft precisely on runway threshold
      const dep = options.originAirport;
      let heading = dep.heading !== undefined ? dep.heading : 270;
      let elevMeters = Number(dep.elevationFt || 0) / 3.28084;
      let placeCoord: [number, number, number] = [dep.lat, dep.lon, elevMeters + 1.2];

      if (typeof geofs.runways?.getNearestRunway === "function") {
        try {
          const rw = geofs.runways.getNearestRunway([dep.lat, dep.lon, 0]);
          if (rw) {
            const loc = rw.threshold || rw.location;
            if (loc && Array.isArray(loc) && loc.length >= 2) {
              const rElev = Number(rw.elevation || (loc.length > 2 ? loc[2] : 0) || 0);
              placeCoord = [Number(loc[0]), Number(loc[1]), rElev + 1.2];
            }
            if (typeof rw.heading === "number") heading = rw.heading;
          }
        } catch (e) {}
      }

      // Give a brief tick for physics engine before placing
      await new Promise((r) => setTimeout(r, 150));

      const newInst = geofs.aircraft?.instance;
      if (newInst) {
        if (typeof newInst.place === "function") {
          newInst.place(placeCoord, heading);
        } else if (typeof geofs.flyTo === "function") {
          geofs.flyTo([placeCoord[0], placeCoord[1], placeCoord[2], heading]);
        }

        // Re-hook Cesium camera target and reset camera orientation
        if (geofs.camera) {
          try {
            if (typeof geofs.camera.setTarget === "function") {
              geofs.camera.setTarget(newInst);
            }
            if (typeof geofs.camera.reset === "function") {
              geofs.camera.reset();
            }
          } catch (camErr) {
            log.warn("Camera reset warning:", camErr);
          }
        }

        // Engage parking brakes and zero throttle
        const controls = (unsafeWindow as any).controls || newInst.controls;
        if (controls) {
          controls.throttle = 0;
          controls.brakes = 1;
          controls.parkingBrakes = 1;
          controls.airbrakes = 0;
          controls.pitch = 0;
          controls.roll = 0;
          controls.yaw = 0;
        }

        // Zero linear velocity
        if (newInst.rigidBody && typeof newInst.rigidBody.setLinearVelocity === "function") {
          const Cesium = (unsafeWindow as any).Cesium;
          if (Cesium?.Cartesian3) {
            newInst.rigidBody.setLinearVelocity(new Cesium.Cartesian3(0, 0, 0));
          }
        }
      }

      // 4. Resume Game
      if (typeof geofs.pause === "function") {
        geofs.pause(false);
      }

      log.info("Flight successfully launched on runway threshold");
      options.onSuccess?.();
      return true;
    } catch (err) {
      log.error("Failed to safely launch flight:", err);
      options.onError?.(err);
      Notify.errorNow("Failed to start flight: " + String(err));
      return false;
    }
  }

  private static waitForAircraftReady(targetId: number, timeoutMs: number): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        const geofs = (unsafeWindow as any).geofs;
        const inst = geofs?.aircraft?.instance;

        // Check if new aircraft instance is instantiated and initialized
        if (inst && Number(inst.id) === targetId && inst.rigidBody && inst.llaLocation) {
          clearInterval(checkInterval);
          resolve();
          return;
        }

        if (Date.now() - startTime > timeoutMs) {
          log.warn(`Aircraft loading timeout (${timeoutMs}ms), proceeding anyway.`);
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }
}

export default SafeFlightLauncher;
