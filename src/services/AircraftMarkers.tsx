import MarkerEngine from "../modules/markers/MarkerEngine";
import RadarEngine from "../modules/radar/RadarEngine";

export const enableMarkers = () => MarkerEngine.enable();
export const disableMarkers = () => MarkerEngine.disable();
export const isMarkersEnabled = () => MarkerEngine.markersEnabled;
export const getMarkerSettings = () => MarkerEngine.settings;
export const setSelfColor = (c: string) => MarkerEngine.setSelfColor(c);
export const setOtherColor = (c: string) => MarkerEngine.setOtherColor(c);
export const setStrokeColor = (c: string) => MarkerEngine.setStrokeColor(c);
export const resetMarkerSettings = () => MarkerEngine.resetSettings();

export const enableRadar = () => RadarEngine.activate();
export const disableRadar = () => RadarEngine.deactivate();
export const getRadarSettings = () => RadarEngine.settings;
export const setRadarRange = (r: number) => RadarEngine.setRange(r);
export const setRadarShowLabels = (s: boolean) => RadarEngine.setShowLabels(s);
export const setRadarSweepSpeed = (s: number) => RadarEngine.setSweepSpeed(s);

export default MarkerEngine;
