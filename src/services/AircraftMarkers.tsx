import options from "../assets/json/AircraftMarkerOptions";
import aircraftGroups from "../assets/json/AircraftGroups";
import aircraftIcons from "../assets/icons/aircraft";
import Logger from "../classes/Logger";
import Storage from "../classes/Storage";
import RadarSystem from "../classes/RadarSystem";

const log = Logger.create("AircraftMarkers");
let markersEnabled = false;
let radarEnabled = false;
let originalAddPlayerMarker: Function | null = null;

const MARKER_STORAGE_KEYS = {
  selfColor: "marker_self_color",
  otherColor: "marker_other_color",
  strokeColor: "marker_stroke_color",
};

const DEFAULT_SETTINGS = {
  selfColor: "#ffc107",
  otherColor: "#3155B1",
  strokeColor: "#ffffff",
};

let markerSettings = { ...DEFAULT_SETTINGS };

export async function loadMarkerSettings(): Promise<void> {
  try {
    const selfColor = await Storage.get(MARKER_STORAGE_KEYS.selfColor);
    const otherColor = await Storage.get(MARKER_STORAGE_KEYS.otherColor);
    const strokeColor = await Storage.get(MARKER_STORAGE_KEYS.strokeColor);

    if (selfColor) markerSettings.selfColor = selfColor;
    if (otherColor) markerSettings.otherColor = otherColor;
    if (strokeColor) markerSettings.strokeColor = strokeColor;

    log.debug("Loaded marker settings:", markerSettings);
  } catch (error) {
    log.error("Failed to load marker settings:", error);
  }
}

export function saveMarkerSettings(): void {
  try {
    Storage.write(MARKER_STORAGE_KEYS.selfColor, markerSettings.selfColor);
    Storage.write(MARKER_STORAGE_KEYS.otherColor, markerSettings.otherColor);
    Storage.write(MARKER_STORAGE_KEYS.strokeColor, markerSettings.strokeColor);
    log.debug("Saved marker settings:", markerSettings);
  } catch (error) {
    log.error("Failed to save marker settings:", error);
  }
}

export function getMarkerSettings() {
  return { ...markerSettings };
}

export function setSelfColor(color: string): void {
  markerSettings.selfColor = color;
  saveMarkerSettings();
  if (markersEnabled) redefineMarkers();
}

export function setOtherColor(color: string): void {
  markerSettings.otherColor = color;
  saveMarkerSettings();
  if (markersEnabled) redefineMarkers();
}

export function setStrokeColor(color: string): void {
  markerSettings.strokeColor = color;
  saveMarkerSettings();
  if (markersEnabled) redefineMarkers();
}

export function resetMarkerSettings(): void {
  markerSettings = { ...DEFAULT_SETTINGS };
  saveMarkerSettings();
  if (markersEnabled) redefineMarkers();
}

function getCustomSvgOptions() {
  return {
    user: {
      children: {
        "path-0": {
          fill: markerSettings.otherColor,
          stroke: markerSettings.strokeColor,
          strokeWidth: "0.25px",
        },
      },
    },
    self: {
      children: {
        "path-0": {
          fill: markerSettings.selfColor,
          stroke: markerSettings.strokeColor,
          strokeWidth: "0.5px",
        },
      },
    },
  };
}

export function getAircraftTypeCount(): number {
  return Object.keys(aircraftGroups).length;
}

export function getAircraftGroupNames(): string[] {
  return Object.keys(aircraftGroups);
}

function defineMarkers(): void {
  const customOptions = getCustomSvgOptions();
  for (let a in aircraftGroups) {
    if (aircraftIcons[a]) {
      flightAssistant.instance.icons[a] = {
        url: aircraftIcons[a].render(customOptions.user).toBase64(),
        ...options.user,
      };
      addSelfMarker(a, customOptions);
    }
  }
  log.debug(`Defined ${Object.keys(aircraftGroups).length} aircraft marker types`);
}

function redefineMarkers(): void {
  clearIconCache();
  flightAssistant.instance.icons = {};
  defineMarkers();
  refreshMarker();
  refreshAllPlayerMarkers();
  log.debug("Markers redefined with new settings");
}

function addSelfMarker(a: string, customOptions?: any): void {
  const opts = customOptions || getCustomSvgOptions();
  flightAssistant.instance.icons[a + "-self"] = {
    url: aircraftIcons[a].render(opts.self).toBase64(),
    ...options.self,
  };
}

function getMarker(a: string, isSelf: boolean = false): any {
  return flightAssistant.instance.icons[isSelf ? a + "-self" : a];
}

function getGroup(aircraftId: string | number): string {
  const id = String(aircraftId);
  for (let groupName in aircraftGroups) {
    if (aircraftGroups[groupName].includes(id)) {
      return groupName;
    }
  }
  return "default";
}

function refreshMarker(): void {
  if (!markersEnabled) {
    log.debug("Markers disabled, skipping refresh");
    return;
  }

  const aircraft = (unsafeWindow as any).geofs?.aircraft?.instance;
  if (!aircraft?.id) {
    log.warn("No aircraft instance found, scheduling retry...");
    setTimeout(refreshMarker, 1000);
    return;
  }

  const group = getGroup(aircraft.id);
  log.debug(`Refreshing marker for aircraft ${aircraft.id} (group: ${group})`);

  const geofs = (unsafeWindow as any).geofs;
  
  clearIconCache();
  
  if (geofs?.map?.planeMarker) {
    geofs.map.planeMarker.destroy();
  }

  const selfMarker = getMarker(group, true);
  geofs.map.planeMarker = new geofs.api.map.marker({
    zIndex: 1000,
    icon: geofs.api.map.getIcon(group + "-self", selfMarker),
  });
  geofs.map.planeMarker.addToMap();
}

function clearIconCache(): void {
  const geofs = (unsafeWindow as any).geofs;
  if (geofs?.api?.map?.icons) {
    for (const key in geofs.api.map.icons) {
      if (key !== "blue" && key !== "yellow" && key !== "red" && key !== "green") {
        delete geofs.api.map.icons[key];
      }
    }
    log.debug("Cleared GeoFS icon cache");
  }
}

function customAddPlayerMarker(this: any, userId: any, group: any, label: any): any {
  const geofs = (unsafeWindow as any).geofs;
  const ui = (unsafeWindow as any).ui;
  const multiplayer = (unsafeWindow as any).multiplayer;

  if (!group && multiplayer?.users?.[userId]?.aircraft) {
    group = getGroup(multiplayer.users[userId].aircraft.toString());
  }
  if (!group) {
    group = "default";
  }

  if (!ui.playerMarkers[userId]) {
    const marker = getMarker(group);
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

function refreshAllPlayerMarkers(): void {
  const geofs = (unsafeWindow as any).geofs;
  const ui = (unsafeWindow as any).ui;
  const multiplayer = (unsafeWindow as any).multiplayer;

  if (!ui?.playerMarkers || !multiplayer?.users) {
    log.debug("No player markers or multiplayer users to refresh");
    return;
  }

  clearIconCache();

  const usersToRefresh: { id: string; aircraft: string; label: string }[] = [];
  
  for (const markerId in ui.playerMarkers) {
    if (ui.playerMarkers[markerId] && multiplayer.users[markerId]) {
      try {
        const user = multiplayer.users[markerId];
        usersToRefresh.push({
          id: markerId,
          aircraft: user.aircraft?.toString() || "default",
          label: ui.playerMarkers[markerId]._label || user.callsign || "-"
        });
        
        ui.playerMarkers[markerId].destroy?.();
        delete ui.playerMarkers[markerId];
      } catch (e) {
        log.warn(`Failed to destroy marker for user ${markerId}:`, e);
      }
    }
  }

  for (const user of usersToRefresh) {
    const group = getGroup(user.aircraft);
    const marker = getMarker(group);
    
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

  log.debug(`Refreshed ${usersToRefresh.length} player markers with new icons`);
}

export async function enableMarkers(): Promise<void> {
  if (markersEnabled) return;

  await loadMarkerSettings();

  const geofs = (unsafeWindow as any).geofs;
  if (!originalAddPlayerMarker && geofs?.map?.addPlayerMarker) {
    originalAddPlayerMarker = geofs.map.addPlayerMarker.bind(geofs.map);
  }
  if (!flightAssistant.instance.icons) {
    flightAssistant.instance.icons = {};
  }
  defineMarkers();
  geofs.map.addPlayerMarker = customAddPlayerMarker.bind(geofs.map);

  markersEnabled = true;
  log.info("Aircraft markers enabled");
  refreshAllPlayerMarkers();
  setTimeout(refreshMarker, 500);
}

export function disableMarkers(): void {
  if (!markersEnabled) return;

  const geofs = (unsafeWindow as any).geofs;
  const ui = (unsafeWindow as any).ui;
  if (originalAddPlayerMarker && geofs?.map) {
    geofs.map.addPlayerMarker = originalAddPlayerMarker;
    log.debug("Restored original addPlayerMarker function");
  }
  if (ui?.playerMarkers) {
    for (const markerId in ui.playerMarkers) {
      if (ui.playerMarkers[markerId]) {
        try {
          ui.playerMarkers[markerId].destroy?.();
        } catch (e) {
        }
      }
    }
    for (const key in ui.playerMarkers) {
      delete ui.playerMarkers[key];
    }
    log.debug("Cleared player markers for refresh");
  }
  if (geofs?.map?.planeMarker) {
    try {
      geofs.map.planeMarker.destroy();
    } catch (e) {
    }
    geofs.map.planeMarker = new geofs.api.map.marker({
      zIndex: 1000,
      icon: geofs.api.map.getIcon("yellow", geofs.map.icons.yellow),
    });
    geofs.map.planeMarker.addToMap();
    log.debug("Restored default plane marker with yellow icon");
  }

  markersEnabled = false;
  log.info("Aircraft markers disabled, reverted to GeoFS defaults");
}

export function isMarkersEnabled(): boolean {
  return markersEnabled;
}

export function isRadarEnabled(): boolean {
  return radarEnabled;
}

export async function enableRadar(): Promise<void> {
  // Check both local flag and RadarSystem state
  if (radarEnabled && RadarSystem.isActive) {
    log.debug("Radar already enabled, skipping");
    return;
  }
  
  // If there's a stale state, clean up first
  if (RadarSystem.isActive) {
    RadarSystem.deactivate();
  }
  
  await RadarSystem.activate();
  radarEnabled = true;
  log.info("Radar enabled");
}

export function disableRadar(): void {
  if (!radarEnabled && !RadarSystem.isActive) {
    log.debug("Radar already disabled, skipping");
    return;
  }
  
  RadarSystem.deactivate();
  radarEnabled = false;
  log.info("Radar disabled");
}

export function getRadarSettings() {
  return RadarSystem.settings;
}

export function setRadarRange(range: number): void {
  RadarSystem.setRange(range);
}

export function setRadarShowLabels(show: boolean): void {
  RadarSystem.setShowLabels(show);
}

export function setRadarSweepSpeed(speed: number): void {
  RadarSystem.setSweepSpeed(speed);
}

export { defineMarkers, getGroup, getMarker, refreshMarker };
