import { createSignal } from "solid-js";
import RadarEngine from "../RadarEngine";
import Input from "../../../components/Input";
import Notify from "../../../shared/Notify";

/**
 * Modular Settings Panel for Cockpit Radar Instrument
 */
export default function RadarSettingsPanel() {
  const radarSettings = RadarEngine.settings;
  const [radarRange, setRadarRangeState] = createSignal(radarSettings.range);
  const [showLabels, setShowLabelsState] = createSignal(radarSettings.showLabels);
  const [sweepSpeed, setSweepSpeedState] = createSignal(radarSettings.sweepSpeed);
  const [showTraffic, setShowTrafficState] = createSignal(radarSettings.showTraffic);
  const [airborneOnly, setAirborneOnlyState] = createSignal(radarSettings.airborneTrafficOnly);
  const [blimpEffect, setBlimpEffectState] = createSignal(radarSettings.blimpEffect);
  const [blimpOpacity, setBlimpOpacityState] = createSignal(radarSettings.blimpOpacity || 0.9);
  const [showDestination, setShowDestinationState] = createSignal(radarSettings.showDestination);
  const [showAirports, setShowAirportsState] = createSignal(radarSettings.showAirports);
  const [showTerrainMap, setShowTerrainMapState] = createSignal(radarSettings.showTerrainMap);

  return (
    <div class="mt-4 space-y-3 font-sans">
      <h3 class="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
        <span class="text-emerald-500">📡</span>
        Cockpit Radar Instrument Settings
      </h3>

      <div class="p-3.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-300/50 dark:border-emerald-800/40 space-y-3">
        <Input
          type="range"
          name="radar_range"
          label="Radar Detection Range"
          min={5}
          max={100}
          step={1}
          value={radarRange()}
          onChange={(v: number) => {
            setRadarRangeState(v);
            RadarEngine.setRange(v);
          }}
          notifyMode="none"
          unit="NM"
        />

        <Input
          type="range"
          name="radar_sweep_speed"
          label="Sweep Beam Period"
          min={2}
          max={10}
          step={1}
          value={sweepSpeed()}
          onChange={(v: number) => {
            setSweepSpeedState(v);
            RadarEngine.setSweepSpeed(v);
          }}
          notifyMode="none"
          unit="s"
        />

        <Input
          type="range"
          name="radar_blimp_opacity"
          label="Blimp Target Opacity"
          comment="Peak phosphor flash intensity or static transparency"
          min={0.2}
          max={1.0}
          step={0.05}
          value={blimpOpacity()}
          onChange={(v: number) => {
            setBlimpOpacityState(v);
            RadarEngine.setBlimpOpacity(v);
          }}
          notifyMode="none"
          valueFormatter={(v) => `${Math.round(Number(v) * 100)}%`}
        />

        <Input
          type="boolean"
          name="radar_show_traffic"
          label="Show Multiplayer Traffic"
          comment="Display surrounding aircraft on cockpit radar screen"
          value={showTraffic()}
          onChange={(v: boolean) => {
            setShowTrafficState(v);
            RadarEngine.setShowTraffic(v);
            Notify.successNow(`Radar Traffic ${v ? "enabled" : "disabled"}`);
          }}
          notifyMode="none"
        />

        <Input
          type="boolean"
          name="radar_airborne_only"
          label="Airborne Traffic Only"
          comment="Filter out parked and ground taxiing aircraft to declutter radar"
          value={airborneOnly()}
          onChange={(v: boolean) => {
            setAirborneOnlyState(v);
            RadarEngine.setAirborneTrafficOnly(v);
            Notify.successNow(`Airborne Only Filter ${v ? "enabled" : "disabled"}`);
          }}
          notifyMode="none"
        />

        <Input
          type="boolean"
          name="radar_blimp_effect"
          label="Sweep Phosphor Blimp Effect"
          comment="Enable dynamic sweep decay effect. If disabled, blips remain clean and transparent"
          value={blimpEffect()}
          onChange={(v: boolean) => {
            setBlimpEffectState(v);
            RadarEngine.setBlimpEffect(v);
            Notify.successNow(`Blimp Phosphor Effect ${v ? "enabled" : "disabled"}`);
          }}
          notifyMode="none"
        />

        <Input
          type="boolean"
          name="radar_show_labels"
          label="Show Traffic Callsigns"
          comment="Display aircraft callsign tags next to multiplayer blips"
          value={showLabels()}
          onChange={(v: boolean) => {
            setShowLabelsState(v);
            RadarEngine.setShowLabels(v);
            Notify.successNow(`Radar Callsigns ${v ? "enabled" : "disabled"}`);
          }}
          notifyMode="none"
        />

        <Input
          type="boolean"
          name="radar_show_destination"
          label="Show Destination on Radar"
          comment="Display bearing vector line and arrival zone on cockpit radar"
          value={showDestination()}
          onChange={(v: boolean) => {
            setShowDestinationState(v);
            RadarEngine.setShowDestination(v);
            Notify.successNow(`Radar Destination ${v ? "enabled" : "disabled"}`);
          }}
          notifyMode="none"
        />

        <Input
          type="boolean"
          name="radar_show_airports"
          label="Show Nearby Airports on Radar"
          comment="Display surrounding GeoFS airfields and runways on radar"
          value={showAirports()}
          onChange={(v: boolean) => {
            setShowAirportsState(v);
            RadarEngine.setShowAirports(v);
            Notify.successNow(`Radar Airports ${v ? "enabled" : "disabled"}`);
          }}
          notifyMode="none"
        />

        <Input
          type="boolean"
          name="radar_show_terrain_map"
          label="Show Land & Sea Coastline Map"
          comment="Display tactical dark land, ocean and coastline terrain overlay on radar"
          value={showTerrainMap()}
          onChange={(v: boolean) => {
            setShowTerrainMapState(v);
            RadarEngine.setShowTerrainMap(v);
            Notify.successNow(`Radar Terrain Map ${v ? "enabled" : "disabled"}`);
          }}
          notifyMode="none"
        />
      </div>
    </div>
  );
}
