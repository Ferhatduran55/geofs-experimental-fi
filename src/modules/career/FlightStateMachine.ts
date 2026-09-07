import Logger from "../../classes/Logger";
import type { IEventBus } from "../../core/types";
import { calculateGreatCircleNm, findNearestAirport } from "./AirportDatabase";

const log = Logger.create("FlightStateMachine");

export enum FlightState {
  PARKED = "PARKED",
  TAXI = "TAXI",
  TAKEOFF_ROLL = "TAKEOFF_ROLL",
  LIFTOFF_PENDING = "LIFTOFF_PENDING",
  AIRBORNE_CONFIRMED = "AIRBORNE_CONFIRMED",
  IN_FLIGHT = "IN_FLIGHT",
  TOUCHDOWN_PENDING = "TOUCHDOWN_PENDING",
  LANDING_CONFIRMED = "LANDING_CONFIRMED",
}

export interface FlightTrackingData {
  departureIcao: string;
  departureCoords: [number, number, number];
  takeoffTimestamp: number;
  maxGForce: number;
  lastVerticalSpeedFpm: number;
  touchdownVsfpm: number;
  flownDistanceNm: number;
}

export class FlightStateMachine {
  private eventBus: IEventBus;
  private state: FlightState = FlightState.PARKED;

  // Timers & Hysteresis counters
  private airborneTimeMs: number = 0;
  private groundContactTimeMs: number = 0;
  private tracking: FlightTrackingData | null = null;
  private initialLiftoffCoords: [number, number, number] | null = null;

  // Requirements thresholds
  static readonly MIN_TAKEOFF_TIME_MS = 15000;      // 15 seconds continuous airborne
  static readonly MIN_TAKEOFF_DISTANCE_NM = 0.5;    // 0.5 NM from liftoff point
  static readonly MIN_TAKEOFF_ALT_FT = 100;         // 100 ft AGL/climb
  static readonly MIN_LANDING_GROUND_TIME_MS = 5000; // 5 seconds continuous ground contact
  static readonly MAX_LANDING_TAXI_SPEED = 25;       // < 25 kts to confirm full stop/landing
  static readonly MIN_TOTAL_FLIGHT_TIME_MS = 45000;  // Minimum 45s flight to record
  static readonly MIN_TOTAL_FLIGHT_DIST_NM = 1.0;    // Minimum 1 NM flown to record

  constructor(eventBus: IEventBus) {
    this.eventBus = eventBus;
  }

  getState(): FlightState {
    return this.state;
  }

  isAirborne(): boolean {
    return (
      this.state === FlightState.AIRBORNE_CONFIRMED ||
      this.state === FlightState.IN_FLIGHT ||
      this.state === FlightState.TOUCHDOWN_PENDING
    );
  }

  getTrackingData(): FlightTrackingData | null {
    return this.tracking;
  }

  /**
   * Called on every flight tick
   */
  update(tick: {
    deltaTime: number;
    kias: number;
    altitudeFt: number;
    verticalSpeedFpm: number;
    gForce: number;
    groundContact: boolean;
    lla: [number, number, number];
  }): void {
    const { deltaTime, kias, altitudeFt, verticalSpeedFpm, gForce, groundContact, lla } = tick;
    const deltaMs = deltaTime * 1000;

    // Track G-Force and Vertical Speed when in flight
    if (this.tracking && this.isAirborne()) {
      if (gForce > this.tracking.maxGForce) {
        this.tracking.maxGForce = Number(gForce.toFixed(2));
      }
      this.tracking.lastVerticalSpeedFpm = verticalSpeedFpm;
    }

    switch (this.state) {
      case FlightState.PARKED:
        if (kias > 5) {
          this.transitionTo(FlightState.TAXI);
        }
        break;

      case FlightState.TAXI:
        if (kias > 35 && groundContact) {
          this.transitionTo(FlightState.TAKEOFF_ROLL);
        } else if (kias <= 1) {
          this.transitionTo(FlightState.PARKED);
        }
        break;

      case FlightState.TAKEOFF_ROLL:
        if (!groundContact && kias > 35) {
          // Liftoff started!
          this.airborneTimeMs = 0;
          this.initialLiftoffCoords = [lla[0], lla[1], lla[2]];
          this.transitionTo(FlightState.LIFTOFF_PENDING);
        } else if (kias < 20) {
          this.transitionTo(FlightState.TAXI);
        }
        break;

      case FlightState.LIFTOFF_PENDING:
        if (groundContact) {
          // Bounced back to ground within 15 seconds -> ABORTED TAKEOFF / BOUNCE!
          log.info("Bounce/Aborted takeoff detected. Reverting to TAKEOFF_ROLL (Mission preserved).");
          this.airborneTimeMs = 0;
          this.transitionTo(FlightState.TAKEOFF_ROLL);
          return;
        }

        this.airborneTimeMs += deltaMs;
        const distFromLiftoff = this.initialLiftoffCoords
          ? calculateGreatCircleNm(this.initialLiftoffCoords[0], this.initialLiftoffCoords[1], lla[0], lla[1])
          : 0;

        // Check if official takeoff conditions are satisfied
        if (
          this.airborneTimeMs >= FlightStateMachine.MIN_TAKEOFF_TIME_MS &&
          (distFromLiftoff >= FlightStateMachine.MIN_TAKEOFF_DISTANCE_NM || altitudeFt >= FlightStateMachine.MIN_TAKEOFF_ALT_FT)
        ) {
          this.handleConfirmedTakeoff(lla);
          this.transitionTo(FlightState.AIRBORNE_CONFIRMED);
        }
        break;

      case FlightState.AIRBORNE_CONFIRMED:
        // Transition to steady IN_FLIGHT
        this.transitionTo(FlightState.IN_FLIGHT);
        break;

      case FlightState.IN_FLIGHT:
        if (groundContact) {
          // Touchdown initiated!
          this.groundContactTimeMs = 0;
          if (this.tracking) {
            this.tracking.touchdownVsfpm = verticalSpeedFpm;
          }
          log.info(`Touchdown detected! Vertical speed: ${verticalSpeedFpm.toFixed(0)} fpm`);
          this.eventBus.emit("flight:touchdown", {
            isHardLanding: verticalSpeedFpm < -500,
            verticalSpeedFpm,
            gForce,
          });
          this.transitionTo(FlightState.TOUCHDOWN_PENDING);
        }
        break;

      case FlightState.TOUCHDOWN_PENDING:
        if (!groundContact && kias > 35) {
          // Liftoff again after touchdown -> TOUCH-AND-GO / GO-AROUND!
          log.info("Touch-and-Go detected! Aircraft airborne again. Continuing flight.");
          this.groundContactTimeMs = 0;
          this.transitionTo(FlightState.IN_FLIGHT);
          return;
        }

        if (groundContact) {
          this.groundContactTimeMs += deltaMs;

          // Confirm landing when on ground for 5s and speed < 25 kts
          if (this.groundContactTimeMs >= FlightStateMachine.MIN_LANDING_GROUND_TIME_MS && kias <= FlightStateMachine.MAX_LANDING_TAXI_SPEED) {
            this.handleConfirmedLanding(lla);
            this.transitionTo(FlightState.LANDING_CONFIRMED);
          }
        }
        break;

      case FlightState.LANDING_CONFIRMED:
        // Completed flight, return to TAXI/PARKED for next leg
        this.tracking = null;
        this.transitionTo(kias > 5 ? FlightState.TAXI : FlightState.PARKED);
        break;
    }
  }

  private handleConfirmedTakeoff(lla: [number, number, number]): void {
    const originAp = findNearestAirport(lla[0], lla[1]);
    const now = Date.now();

    this.tracking = {
      departureIcao: originAp.icao,
      departureCoords: [lla[0], lla[1], lla[2]],
      takeoffTimestamp: now,
      maxGForce: 1.0,
      lastVerticalSpeedFpm: 0,
      touchdownVsfpm: 0,
      flownDistanceNm: 0,
    };

    log.info(`Official Takeoff Confirmed from ${originAp.icao} (${originAp.name})`);
    this.eventBus.emit("flight:takeoff", {
      airportIcao: originAp.icao,
      coordinates: [lla[0], lla[1], lla[2]],
      timestamp: now,
    });
  }

  private handleConfirmedLanding(lla: [number, number, number]): void {
    if (!this.tracking) return;

    const arrivalAp = findNearestAirport(lla[0], lla[1]);
    const now = Date.now();
    const flightDurationMs = now - this.tracking.takeoffTimestamp;
    const flownDistanceNm = calculateGreatCircleNm(
      this.tracking.departureCoords[0],
      this.tracking.departureCoords[1],
      lla[0],
      lla[1]
    );

    // Anti-Glitch Validation: Must be at least 45s or 1.0 NM
    if (
      flightDurationMs < FlightStateMachine.MIN_TOTAL_FLIGHT_TIME_MS &&
      flownDistanceNm < FlightStateMachine.MIN_TOTAL_FLIGHT_DIST_NM
    ) {
      log.warn(`Flight too short to record (${(flightDurationMs / 1000).toFixed(0)}s, ${flownDistanceNm} NM). Skipping.`);
      return;
    }

    log.info(
      `Official Landing Confirmed at ${arrivalAp.icao} (${arrivalAp.name}). Duration: ${(flightDurationMs / 60000).toFixed(1)}m, Distance: ${flownDistanceNm} NM`
    );

    this.eventBus.emit("flight:landed", {
      airportIcao: arrivalAp.icao,
      coordinates: [lla[0], lla[1], lla[2]],
      timestamp: now,
      flightDurationMs,
      flownDistanceNm,
      maxGForce: this.tracking.maxGForce,
      touchdownVsfpm: this.tracking.touchdownVsfpm,
    });
  }

  private transitionTo(newState: FlightState): void {
    if (this.state !== newState) {
      log.debug(`FlightState: ${this.state} → ${newState}`);
      this.state = newState;
    }
  }

  reset(): void {
    this.state = FlightState.PARKED;
    this.airborneTimeMs = 0;
    this.groundContactTimeMs = 0;
    this.tracking = null;
    this.initialLiftoffCoords = null;
  }
}
