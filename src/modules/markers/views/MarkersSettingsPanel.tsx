import { createSignal } from "solid-js";
import MarkerEngine from "../MarkerEngine";
import Input from "../../../components/Input";
import Notify from "../../../shared/Notify";

/**
 * Modular Settings Panel for Aircraft Markers
 */
export default function MarkersSettingsPanel() {
  const settings = MarkerEngine.settings;
  const [selfColor, setSelfColorState] = createSignal(settings.selfColor);
  const [otherColor, setOtherColorState] = createSignal(settings.otherColor);
  const [strokeColor, setStrokeColorState] = createSignal(settings.strokeColor);

  const handleReset = () => {
    setSelfColorState("#ffc107");
    setOtherColorState("#3155B1");
    setStrokeColorState("#ffffff");
    MarkerEngine.resetSettings();
    Notify.successNow("Marker colors reset to defaults");
  };

  return (
    <div class="mt-4 space-y-3 font-sans">
      <h3 class="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
        <span class="text-blue-500">📍</span>
        Aircraft Markers Customization
      </h3>

      <div class="p-3.5 rounded-lg bg-blue-50/60 dark:bg-blue-950/20 border border-blue-300/50 dark:border-blue-800/40 space-y-3">
        <Input
          type="color"
          name="marker_self_color"
          label="Own Aircraft Marker Color"
          comment="Silhouette fill color for your own aircraft on the navigation map"
          value={selfColor()}
          onChange={(v: string) => {
            setSelfColorState(v);
            MarkerEngine.setSelfColor(v);
          }}
          notifyMode="none"
        />

        <Input
          type="color"
          name="marker_other_color"
          label="Multiplayer Aircraft Marker Color"
          comment="Silhouette fill color for other online pilots"
          value={otherColor()}
          onChange={(v: string) => {
            setOtherColorState(v);
            MarkerEngine.setOtherColor(v);
          }}
          notifyMode="none"
        />

        <Input
          type="color"
          name="marker_stroke_color"
          label="Marker Outline & Border Color"
          comment="Silhouette stroke outline color for maximum contrast"
          value={strokeColor()}
          onChange={(v: string) => {
            setStrokeColorState(v);
            MarkerEngine.setStrokeColor(v);
          }}
          notifyMode="none"
        />

        <button
          type="button"
          onClick={handleReset}
          class="w-full px-3 py-2 text-xs bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md transition-colors font-medium border border-gray-300/60 dark:border-gray-700/60"
        >
          Reset Colors to Defaults
        </button>
      </div>
    </div>
  );
}
