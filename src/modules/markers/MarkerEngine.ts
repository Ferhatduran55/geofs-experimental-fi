import options from "../../assets/json/AircraftMarkerOptions";
import aircraftGroups from "../../assets/json/AircraftGroups";
import aircraftIcons from "../../assets/icons/aircraft";
import Logger from "../../shared/Logger";
import Storage from "../../shared/Storage";

const log = Logger.create("MarkerEngine");

export interface MarkerSettings {
  selfColor: string;
  otherColor: string;
  strokeColor: string;
}

const MARKER_STORAGE_KEYS = {
  selfColor: "marker_self_color",
  otherColor: "marker_other_color",
  strokeColor: "marker_stroke_color",
};

const DEFAULT_SETTINGS: MarkerSettings = {
  selfColor: "#ffc107",
  otherColor: "#3155B1",
  strokeColor: "#ffffff",
};

export class MarkerEngine {
  static markersEnabled: boolean = false;
  static originalAddPlayerMarker: Function | null = null;
  static settings: MarkerSettings = { ...DEFAULT_SETTINGS };

  static async loadSettings(): Promise<void> {
    try {
      const selfColor = await Storage.get(MARKER_STORAGE_KEYS.selfColor);
      const otherColor = await Storage.get(MARKER_STORAGE_KEYS.otherColor);
      const strokeColor = await Storage.get(MARKER_STORAGE_KEYS.strokeColor);

      if (selfColor) this.settings.selfColor = selfColor;
      if (otherColor) this.settings.otherColor = otherColor;
      if (strokeColor) this.settings.strokeColor = strokeColor;
    } catch (error) {
      log.error("Failed to load marker settings:", error);
    }
  }

  static saveSettings(): void {
    try {
      Storage.write(MARKER_STORAGE_KEYS.selfColor, this.settings.selfColor);
      Storage.write(MARKER_STORAGE_KEYS.otherColor, this.settings.otherColor);
      Storage.write(MARKER_STORAGE_KEYS.strokeColor, this.settings.strokeColor);
    } catch (error) {
      log.error("Failed to save marker settings:", error);
    }
  }

  static setSelfColor(color: string): void {
    this.settings.selfColor = color;
    this.saveSettings();
    if (this.markersEnabled) this.redefineMarkers();
  }

  static setOtherColor(color: string): void {
    this.settings.otherColor = color;
    this.saveSettings();
    if (this.markersEnabled) this.redefineMarkers();
  }

  static setStrokeColor(color: string): void {
    this.settings.strokeColor = color;
    this.saveSettings();
    if (this.markersEnabled) this.redefineMarkers();
  }

  static resetSettings(): void {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    if (this.markersEnabled) this.redefineMarkers();
  }

  static getCustomSvgOptions() {
    return {
      user: {
        children: {
          "path-0": {
            fill: this.settings.otherColor,
            stroke: this.settings.strokeColor,
            strokeWidth: "0.25px",
          },
        },
      },
      self: {
        children: {
          "path-0": {
            fill: this.settings.selfColor,
            stroke: this.settings.strokeColor,
            strokeWidth: "0.5px",
          },
        },
      },
    };
  }

  static defineMarkers(): void {
    const customOptions = this.getCustomSvgOptions();
    const fa = (unsafeWindow as any).flightAssistant;
    if (!fa.instance) fa.instance = {};
    if (!fa.instance.icons) fa.instance.icons = {};

    for (const a in aircraftGroups) {
      if ((aircraftIcons as any)[a]) {
        fa.instance.icons[a] = {
          url: (aircraftIcons as any)[a].render(customOptions.user).toBase64(),
          ...options.user,
        };
        this.addSelfMarker(a, customOptions);
      }
    }
    log.debug(`Defined ${Object.keys(aircraftGroups).length} aircraft marker types`);
  }

  static redefineMarkers(): void {
    this.clearIconCache();
    const fa = (unsafeWindow as any).flightAssistant;
    if (fa?.instance) fa.instance.icons = {};
    this.defineMarkers();
    this.refreshMarker();
    this.refreshAllPlayerMarkers();
  }

  static addSelfMarker(a: string, customOptions?: any): void {
    const opts = customOptions || this.getCustomSvgOptions();
    const fa = (unsafeWindow as any).flightAssistant;
    fa.instance.icons[a + "-self"] = {
      url: (aircraftIcons as any)[a].render(opts.self).toBase64(),
      ...options.self,
    };
  }

  static getMarker(a: string, isSelf: boolean = false): any {
    const fa = (unsafeWindow as any).flightAssistant;
    return fa?.instance?.icons?.[isSelf ? a + "-self" : a];
  }

  static getGroup(aircraftId: string | number): string {
    const id = String(aircraftId);
    for (const groupName in aircraftGroups) {
      if ((aircraftGroups as any)[groupName].includes(id)) {
        return groupName;
      }
    }
    return "default";
  }

  static refreshMarker(): void {
    if (!this.markersEnabled) return;

    const aircraft = (unsafeWindow as any).geofs?.aircraft?.instance;
    if (!aircraft?.id) {
      setTimeout(() => this.refreshMarker(), 1000);
      return;
    }

    const group = this.getGroup(aircraft.id);
    const geofs = (unsafeWindow as any).geofs;
    this.clearIconCache();

    if (geofs?.map?.planeMarker) {
      geofs.map.planeMarker.destroy();
    }

    const selfMarker = this.getMarker(group, true);
    if (geofs?.api?.map?.marker) {
      geofs.map.planeMarker = new geofs.api.map.marker({
        zIndex: 1000,
        icon: geofs.api.map.getIcon(group + "-self", selfMarker),
      });
      geofs.map.planeMarker.addToMap();
    }
  }

  static clearIconCache(): void {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs?.api?.map?.icons) {
      for (const key in geofs.api.map.icons) {
        if (key !== "blue" && key !== "yellow" && key !== "red" && key !== "green") {
          delete geofs.api.map.icons[key];
        }
      }
    }
  }

  static customAddPlayerMarker(this: any, userId: any, group: any, label: any): any {
    const geofs = (unsafeWindow as any).geofs;
    const ui = (unsafeWindow as any).ui;
    const multiplayer = (unsafeWindow as any).multiplayer;

    if (!group && multiplayer?.users?.[userId]?.aircraft) {
      group = MarkerEngine.getGroup(multiplayer.users[userId].aircraft.toString());
    }
    if (!group) group = "default";

    if (!ui.playerMarkers[userId]) {
      const marker = MarkerEngine.getMarker(group);
      const markerOptions = {
        coords: [0, 0],
        icon: marker ? geofs.api.map.getIcon(group, marker) : geofs.api.map.getIcon("blue", geofs.map.icons.blue),
        label: label || "-",
      };
      ui.playerMarkers[userId] = new geofs.api.map.marker(markerOptions);
    }

    if (geofs.api.map._map && this.mapActive) {
      ui.playerMarkers[userId].addToMap();
    }

    return ui.playerMarkers[userId];
  }

  static refreshAllPlayerMarkers(): void {
    const geofs = (unsafeWindow as any).geofs;
    const ui = (unsafeWindow as any).ui;
    const multiplayer = (unsafeWindow as any).multiplayer;

    if (!ui?.playerMarkers || !multiplayer?.users) return;

    this.clearIconCache();
    const usersToRefresh: { id: string; aircraft: string; label: string }[] = [];

    for (const markerId in ui.playerMarkers) {
      if (ui.playerMarkers[markerId] && multiplayer.users[markerId]) {
        try {
          const user = multiplayer.users[markerId];
          usersToRefresh.push({
            id: markerId,
            aircraft: user.aircraft?.toString() || "default",
            label: ui.playerMarkers[markerId]._label || user.callsign || "-",
          });
          ui.playerMarkers[markerId].destroy?.();
          delete ui.playerMarkers[markerId];
        } catch {}
      }
    }

    for (const user of usersToRefresh) {
      const group = this.getGroup(user.aircraft);
      const marker = this.getMarker(group);
      if (marker) {
        const markerOptions = {
          coords: [0, 0],
          icon: geofs.api.map.getIcon(group, marker),
          label: user.label,
        };
        ui.playerMarkers[user.id] = new geofs.api.map.marker(markerOptions);
        if (geofs.api.map._map && geofs.map.mapActive) {
          ui.playerMarkers[user.id].addToMap();
        }
      }
    }
  }

  static async enable(): Promise<void> {
    if (this.markersEnabled) return;
    await this.loadSettings();

    const geofs = (unsafeWindow as any).geofs;
    if (!this.originalAddPlayerMarker && geofs?.map?.addPlayerMarker) {
      this.originalAddPlayerMarker = geofs.map.addPlayerMarker.bind(geofs.map);
    }

    this.defineMarkers();
    if (geofs?.map) {
      geofs.map.addPlayerMarker = this.customAddPlayerMarker.bind(geofs.map);
    }

    this.markersEnabled = true;
    log.info("MarkerEngine enabled");
    this.refreshAllPlayerMarkers();
    setTimeout(() => this.refreshMarker(), 500);
  }

  static disable(): void {
    if (!this.markersEnabled) return;

    const geofs = (unsafeWindow as any).geofs;
    const ui = (unsafeWindow as any).ui;

    if (this.originalAddPlayerMarker && geofs?.map) {
      geofs.map.addPlayerMarker = this.originalAddPlayerMarker;
    }

    if (ui?.playerMarkers) {
      for (const markerId in ui.playerMarkers) {
        if (ui.playerMarkers[markerId]) {
          try {
            ui.playerMarkers[markerId].destroy?.();
          } catch {}
        }
      }
      for (const key in ui.playerMarkers) {
        delete ui.playerMarkers[key];
      }
    }

    if (geofs?.map?.planeMarker) {
      try {
        geofs.map.planeMarker.destroy();
      } catch {}
      geofs.map.planeMarker = new geofs.api.map.marker({
        zIndex: 1000,
        icon: geofs.api.map.getIcon("yellow", geofs.map.icons.yellow),
      });
      geofs.map.planeMarker.addToMap();
    }

    this.markersEnabled = false;
    log.info("MarkerEngine disabled");
  }
}

export default MarkerEngine;
