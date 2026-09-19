import Logger from "../../shared/Logger";
import Storage from "../../shared/Storage";
import Notify from "../../shared/Notify";
import type { ICoreEngine, IModule } from "../../core/types";
import type { TransportMission } from "./TransportEngine";

const log = Logger.create("TransportModule");

export class TransportModule implements IModule {
  readonly id = "transport";
  readonly name = "Transport Operations";
  readonly version = "1.0.0";
  readonly description = "Commercial flight contract dispatch board, cargo/passenger payloads and operations";
  readonly defaultEnabled = true;
  readonly requires = ["career"];

  private core: ICoreEngine | null = null;
  private _isEnabled: boolean = false;
  private unbindListeners: (() => void)[] = [];

  // Active mission state
  currentMission: TransportMission | null = null;

  isEnabled(): boolean {
    return this._isEnabled;
  }

  async init(core: ICoreEngine): Promise<void> {
    this.core = core;
    (unsafeWindow as any).__efiTransportModule = this;
    await this.loadActiveMission();
    log.info("TransportModule initialized.");
  }

  async enable(): Promise<void> {
    if (this._isEnabled || !this.core) return;
    this._isEnabled = true;

    // Listen for mission cancellations or completions
    this.unbindListeners.push(
      this.core.eventBus.on("flight:landed", () => {
        // Enroute landing check is handled by CareerModule/StateMachine
      })
    );

    log.info("TransportModule enabled");
  }

  async disable(): Promise<void> {
    if (!this._isEnabled || !this.core) return;
    this._isEnabled = false;

    for (const unbind of this.unbindListeners) {
      unbind();
    }
    this.unbindListeners = [];

    log.info("TransportModule disabled");
  }

  async loadActiveMission(): Promise<void> {
    const saved = await Storage.get("career_current_mission");
    if (saved && typeof saved === "object") {
      this.currentMission = saved as TransportMission;
    }
  }

  setActiveMission(mission: TransportMission | null): void {
    this.currentMission = mission;
    Storage.write("career_current_mission", mission);
  }

  abortCurrentMission(): void {
    if (!this.currentMission) return;
    const msn = this.currentMission;
    this.setActiveMission(null);
    Notify.warning(`Contract aborted: ${msn.originIcao} ➔ ${msn.destinationIcao}. Payload safely returned.`, "Transport Operations");
  }
}

export const transportModule = new TransportModule();
export default transportModule;
