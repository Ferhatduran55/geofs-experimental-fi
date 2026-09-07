import Logger from "../../shared/Logger";
import Storage from "../../shared/Storage";
import Notify from "../../shared/Notify";
import Modal from "../../components/Modal";
import FlightIcon from "../../assets/icons/Flight";
import type { ICoreEngine, IModule, SettingsDefinition, TabDefinition } from "../../core/types";
import { findNearestAirport, calculateDistanceNm } from "./AirportDatabase";
import { FinancialEngine, type FlightFinancials } from "./FinancialEngine";
import { FlightStateMachine } from "./FlightStateMachine";
import { MarketEngine } from "./MarketEngine";
import { TransportEngine, type TransportMission } from "./TransportEngine";
import renderCareerTab from "./views/CareerTab";

const log = Logger.create("CareerModule");

export interface FlightLogEntry {
  aircraftId: string | number;
  aircraftName: string;
  departureIcao: string;
  arrivalIcao: string;
  takeoffTime: number;
  landingTime: number;
  flightDurationHours: string;
  flownDistanceNm: number;
  fixedDistanceNm: number;
  payloadDescription: string;
  financials?: FlightFinancials;
  callsign: string;
  status?: "completed" | "crashed" | "diverted";
}

export class CareerModule implements IModule {
  readonly id = "career";
  readonly name = "Career & Transport";
  readonly version = "1.0.0";
  readonly description = "Flight scoring, dynamic aviation market and passenger/cargo transport contracts";
  readonly defaultEnabled = true;

  private core: ICoreEngine | null = null;
  private stateMachine: FlightStateMachine | null = null;
  private unbindListeners: (() => void)[] = [];

  // Career State
  balance: number = 10000;
  logbook: Record<string, FlightLogEntry[]> = {};
  currentMission: TransportMission | null = null;
  availableMissions: TransportMission[] = [];
  fuelStartGal: number = 0;
  currentAircraftMassKg: number = 2500;
  currentAircraftId: string | number = "1";
  currentAircraftName: string = "Aircraft";

  private cancelOnCrashSetting: boolean = true;
  private destArrivalTimerMs: number = 0;
  private isCrashedHandled: boolean = false;
  private _isEnabled: boolean = false;

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(core: ICoreEngine): Promise<void> {
    this.core = core;
    (unsafeWindow as any).__efiCareerModule = this;
    this.stateMachine = new FlightStateMachine(core.eventBus);
    MarketEngine.init();

    await this.loadData();
    log.info("CareerModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled || !this.core) return;
    this._isEnabled = true;

    const bus = this.core.eventBus;
    this.cancelOnCrashSetting = (await Storage.get("cancel_mission_on_crash")) !== false;

    this.unbindListeners.push(
      bus.on("flight:tick", (tick) => {
        if (!this._isEnabled || !this.stateMachine) return;
        this.stateMachine.update(tick);
        this.checkDirectDestinationArrival(tick);
        this.checkCrashState(tick);
      }),

      bus.on("aircraft:changed", (data) => {
        this.currentAircraftId = data.id;
        this.currentAircraftName = data.name;
        this.currentAircraftMassKg = data.massKg;
        this.stateMachine?.reset();
        this.isCrashedHandled = false;
        this.destArrivalTimerMs = 0;
        this.availableMissions = [];
        log.debug(`Aircraft updated in CareerModule: ${data.name}`);
      }),

      bus.on("flight:takeoff", (data) => {
        this.isCrashedHandled = false;
        this.handleTakeoff(data);
      }),

      bus.on("flight:landed", (data) => {
        this.handleLanding(data);
      })
    );

    log.info("CareerModule enabled and listening to flight dynamics");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled) return;
    this._isEnabled = false;

    for (const unbind of this.unbindListeners) {
      unbind();
    }
    this.unbindListeners = [];
    this.stateMachine?.reset();

    log.info("CareerModule disabled");
  }

  async loadData(): Promise<void> {
    try {
      const saved = await Storage.read<{
        balance: number;
        logbook: Record<string, FlightLogEntry[]>;
        currentMission: TransportMission | null;
      }>("career_data", {
        balance: 10000,
        logbook: {},
        currentMission: null,
      });

      if (saved) {
        this.balance = saved.balance ?? 10000;
        this.logbook = saved.logbook ?? {};
        this.currentMission = saved.currentMission ?? null;
      }
    } catch (e) {
      log.error("Failed to load career data:", e);
    }
  }

  saveData(): void {
    try {
      Storage.write("career_data", {
        balance: this.balance,
        logbook: this.logbook,
        currentMission: this.currentMission,
      });
    } catch (e) {
      log.error("Failed to save career data:", e);
    }
  }

  /**
   * 1 NM Destination Radius Rule:
   * Handles air spawns or manual approach where aircraft stops within 1 NM of destination airport.
   */
  private checkDirectDestinationArrival(tick: {
    deltaTime: number;
    kias: number;
    groundContact: boolean;
    lla: [number, number, number];
    gForce: number;
    verticalSpeedFpm: number;
  }): void {
    if (!this.currentMission) {
      this.destArrivalTimerMs = 0;
      return;
    }

    const dest = this.currentMission.destinationAirport;
    if (!dest) return;

    const distNm = calculateDistanceNm(tick.lla[0], tick.lla[1], dest.lat, dest.lon);

    // If within 1.0 NM radius and on ground at stopped/taxi speed (< 25 kts)
    if (distNm <= 1.0 && tick.groundContact && tick.kias < 25) {
      this.destArrivalTimerMs += tick.deltaTime * 1000;

      // After 3 seconds sustained on ground at destination
      if (this.destArrivalTimerMs >= 3000) {
        this.destArrivalTimerMs = 0;
        const tracking = this.stateMachine?.getTrackingData();
        const durationMs = tracking ? Date.now() - tracking.takeoffTimestamp : 60000;
        const flownDist = tracking ? tracking.flownDistanceNm : this.currentMission.fixedDistanceNm;

        this.handleLanding({
          airportIcao: dest.icao,
          coordinates: tick.lla,
          timestamp: Date.now(),
          flightDurationMs: Math.max(30000, durationMs),
          flownDistanceNm: Math.max(1, flownDist),
          maxGForce: tracking ? tracking.maxGForce : 1.2,
          touchdownVsfpm: tick.verticalSpeedFpm || -150,
        });
      }
    } else {
      this.destArrivalTimerMs = 0;
    }
  }

  /**
   * Crash detection and optional mission cancellation
   */
  private checkCrashState(tick: { gForce: number }): void {
    if (this.isCrashedHandled || !this.currentMission) return;

    const geofs = (unsafeWindow as any).geofs;
    const isCrashed = geofs?.aircraft?.instance?.crashed === true || tick.gForce > 9.5;

    if (isCrashed) {
      this.isCrashedHandled = true;
      if (this.cancelOnCrashSetting) {
        this.handleCrash();
      }
    }
  }

  private handleCrash(): void {
    const activeMission = this.currentMission;
    if (!activeMission) return;

    const penalty = Math.min(this.balance, Math.round(activeMission.grossRevenue * 0.3 + 1500));
    this.balance = Math.max(0, this.balance - penalty);

    const acKey = String(this.currentAircraftId);
    if (!this.logbook[acKey]) this.logbook[acKey] = [];

    const geofs = (unsafeWindow as any).geofs;
    const callsign = geofs?.userRecord?.callsign || "Pilot";

    this.logbook[acKey].unshift({
      aircraftId: this.currentAircraftId,
      aircraftName: this.currentAircraftName,
      departureIcao: activeMission.originIcao,
      arrivalIcao: "CRASHED",
      takeoffTime: Date.now() - 30000,
      landingTime: Date.now(),
      flightDurationHours: "0.1",
      flownDistanceNm: 0,
      fixedDistanceNm: activeMission.fixedDistanceNm,
      payloadDescription: TransportEngine.getPayloadDescription(activeMission.payload),
      callsign,
      status: "crashed",
    });

    this.currentMission = null;
    this.saveData();

    Modal.show({
      title: "Mission Failed: Aircraft Crashed 💥",
      content: `
        <div class="text-center space-y-3 font-sans p-2">
          <p class="text-red-500 font-bold text-sm">Aircraft structural failure or high-impact crash detected.</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Contract cancelled. Emergency services & insurance deductibles: <span class="text-red-500 font-bold">-$${penalty}</span>
          </p>
          <p class="text-xs font-bold text-gray-700 dark:text-gray-300">Remaining Balance: $${this.balance}</p>
        </div>
      `,
      type: "error",
      position: "center",
      icon: "💥",
      overlay: true,
      buttons: [{ text: "Acknowledge", onClick: () => {}, style: "primary" }],
    });

    log.warn(`Mission failed due to crash. Penalty: $${penalty}`);
  }

  private handleTakeoff(data: { airportIcao: string; coordinates: [number, number, number]; timestamp: number }): void {
    const geofs = (unsafeWindow as any).geofs;
    const anim = geofs?.animation?.values;
    this.fuelStartGal = anim?.fuelPercentage !== undefined ? anim.fuelPercentage : 100;

    if (this.currentMission) {
      const payloadDesc = TransportEngine.getPayloadDescription(this.currentMission.payload);
      Notify.success(
        `<b>Mission Active!</b><br/>En route to: <b>${this.currentMission.destinationIcao}</b><br/>Payload: ${payloadDesc}`,
        "Career"
      );
      log.info(`Departed ${data.airportIcao} on mission to ${this.currentMission.destinationIcao}`);
    } else {
      Notify.info(`Departed from ${data.airportIcao}. Free flight recorded.`, "Career");
      log.info(`Departed ${data.airportIcao} in free flight mode.`);
    }
  }

  private handleLanding(data: {
    airportIcao: string;
    coordinates: [number, number, number];
    timestamp: number;
    flightDurationMs: number;
    flownDistanceNm: number;
    maxGForce: number;
    touchdownVsfpm: number;
  }): void {
    const { airportIcao, flightDurationMs, flownDistanceNm, maxGForce, touchdownVsfpm } = data;
    const rates = MarketEngine.getCurrentRates();
    const geofs = (unsafeWindow as any).geofs;
    const callsign = geofs?.userRecord?.callsign || "Pilot";

    let settlement: FlightFinancials | undefined = undefined;
    let title = "Flight Summary 🛬";
    let modalType: "success" | "warning" | "error" | "info" = "info";
    let messageHtml = "";

    const flightDurationSec = flightDurationMs / 1000;
    const estimatedBurnedGal = Math.max(1, flightDurationSec * 0.04);
    const activeMission = this.currentMission;

    if (activeMission) {
      // Check if arrived at intended destination (by ICAO or 1 NM distance)
      const distToDest = calculateDistanceNm(
        data.coordinates[0],
        data.coordinates[1],
        activeMission.destinationAirport.lat,
        activeMission.destinationAirport.lon
      );

      const isArrivalValid = airportIcao === activeMission.destinationIcao || distToDest <= 1.2;

      if (isArrivalValid) {
        // --- SUCCESSFUL MISSION SETTLEMENT ---
        settlement = FinancialEngine.calculateSettlement(
          activeMission.grossRevenue,
          activeMission.fixedDistanceNm,
          activeMission.ratePerUnitNm,
          activeMission.baseHandlingFee,
          flightDurationMs,
          activeMission.expectedDurationMs,
          maxGForce,
          touchdownVsfpm,
          estimatedBurnedGal,
          rates.fuelRatePerGal
        );

        this.balance += settlement.netIncome;
        title = `Contract Completed: Rating ${settlement.rating} ✈️`;
        modalType = settlement.rating === "S" || settlement.rating === "A" ? "success" : "info";

        const pDesc = TransportEngine.getPayloadDescription(activeMission.payload);
        const bonusColor = settlement.totalBonusPenalty >= 0 ? "text-green-500" : "text-red-500";
        const bonusSign = settlement.totalBonusPenalty >= 0 ? "+$" : "-$";

        messageHtml = `
          <div class="space-y-3 font-sans text-sm">
            <div class="bg-gray-100 dark:bg-gray-800/60 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <div class="flex justify-between items-center mb-1">
                <span class="font-bold text-base text-gray-900 dark:text-white">${activeMission.originIcao} ➔ ${activeMission.destinationIcao}</span>
                <span class="font-mono bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                  Fixed: ${activeMission.fixedDistanceNm} NM
                </span>
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400">
                Flown: ${flownDistanceNm} NM | Time: ${(flightDurationMs / 60000).toFixed(1)}m | Payload: ${pDesc}
              </div>
            </div>

            <div class="space-y-1.5 p-3 bg-gray-50 dark:bg-black/30 rounded-lg text-xs">
              <div class="flex justify-between">
                <span>Fixed Contract Value:</span>
                <span class="font-semibold text-gray-800 dark:text-gray-200">$${settlement.grossContractRevenue}</span>
              </div>
              <div class="flex justify-between ${bonusColor}">
                <span>Performance & Comfort (VS: ${touchdownVsfpm.toFixed(0)} fpm, Max G: ${maxGForce}G):</span>
                <span>${bonusSign}${Math.abs(settlement.totalBonusPenalty)}</span>
              </div>
              <div class="flex justify-between text-red-500">
                <span>Fuel Expenses (${settlement.burnedFuelGal} gal @ $${settlement.fuelPricePerGal}/gal):</span>
                <span>-$${settlement.fuelCost}</span>
              </div>
              <div class="border-t border-gray-300 dark:border-gray-700 pt-2 mt-2 flex justify-between font-bold text-sm">
                <span class="text-gray-900 dark:text-white">Net Payout:</span>
                <span class="text-green-600 dark:text-green-400">+$${settlement.netIncome}</span>
              </div>
              <div class="flex justify-between text-xs text-gray-500">
                <span>New Account Balance:</span>
                <span class="font-bold text-gray-700 dark:text-gray-300">$${this.balance}</span>
              </div>
            </div>
          </div>
        `;

        log.info(`Mission to ${activeMission.destinationIcao} complete. Net income: $${settlement.netIncome}`);
      } else {
        // Diverted
        modalType = "warning";
        title = "Mission Diverted / Incomplete ⚠️";
        messageHtml = `
          <div class="text-center space-y-2 p-2">
            <p class="font-semibold text-amber-600 dark:text-amber-400">Landed at ${airportIcao} instead of ${activeMission.destinationIcao}</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Contract payload was safely returned. No client payout awarded for diverted delivery.
            </p>
            <p class="text-xs font-bold text-gray-700 dark:text-gray-300">Balance: $${this.balance}</p>
          </div>
        `;
        log.warn(`Mission diverted. Landed at ${airportIcao} instead of ${activeMission.destinationIcao}`);
      }

      this.currentMission = null;
    } else {
      // Free Flight
      messageHtml = `
        <div class="text-center space-y-2 p-2">
          <p class="font-semibold text-blue-600 dark:text-blue-400">Flight Complete: ${airportIcao}</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Recorded ${(flightDurationMs / 60000).toFixed(1)} min free flight (${flownDistanceNm} NM).
          </p>
          <p class="text-xs text-gray-400">Accept contracts in Flight Operations to earn revenue!</p>
        </div>
      `;
    }

    // Record in Logbook
    const acKey = String(this.currentAircraftId);
    if (!this.logbook[acKey]) {
      this.logbook[acKey] = [];
    }

    const logEntry: FlightLogEntry = {
      aircraftId: this.currentAircraftId,
      aircraftName: this.currentAircraftName,
      departureIcao: findNearestAirport(data.coordinates[0], data.coordinates[1]).icao,
      arrivalIcao: airportIcao,
      takeoffTime: Date.now() - flightDurationMs,
      landingTime: Date.now(),
      flightDurationHours: (flightDurationMs / 3600000).toFixed(2),
      flownDistanceNm,
      fixedDistanceNm: settlement?.fixedDistanceNm ?? flownDistanceNm,
      payloadDescription: activeMission ? TransportEngine.getPayloadDescription(activeMission.payload) : "Free Flight",
      financials: settlement,
      callsign,
      status: "completed",
    };

    this.logbook[acKey].unshift(logEntry);
    this.saveData();

    Modal.show({
      title,
      content: messageHtml,
      type: modalType,
      position: "center",
      icon: "📋",
      overlay: true,
      width: "max-w-md",
      buttons: [{ text: "Close", onClick: () => {}, style: "primary" }],
    });
  }

  getTabDefinition(): TabDefinition {
    return {
      id: "career",
      title: "Career",
      icon: FlightIcon,
      order: 40,
      className: "bg-gray-800 dark:bg-black/70",
      render: async () => {
        return (await renderCareerTab(this)) as any;
      },
    };
  }

  getSettingsDefinition(): SettingsDefinition {
    return {
      id: "career",
      label: "Career & Transport",
      description: "Flight logging, fixed contract missions and aviation market economics",
    };
  }
}

export const careerModule = new CareerModule();
export default careerModule;
