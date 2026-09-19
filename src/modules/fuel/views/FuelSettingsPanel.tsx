import { createSignal } from "solid-js";
import FuelEngine from "../FuelEngine";
import Input from "../../../components/Input";
import Notify from "../../../shared/Notify";

/**
 * Modular Settings Panel for Fuel Management System
 */
export default function FuelSettingsPanel() {
  const [capacityMult, setCapacityMult] = createSignal(FuelEngine.capacityMultiplier);
  const [consumptionMult, setConsumptionMult] = createSignal(FuelEngine.consumptionMultiplier);

  const handleReset = () => {
    setCapacityMult(1.0);
    setConsumptionMult(1.0);
    FuelEngine.setCapacityMultiplier(1.0);
    FuelEngine.setConsumptionMultiplier(1.0);
    Notify.successNow("Fuel settings reset to 1.0x factory defaults");
  };

  return (
    <div class="mt-4 space-y-3 font-sans">
      <h3 class="font-semibold text-gray-900 dark:text-white text-sm flex items-center gap-2">
        <span class="text-amber-500">⛽</span>
        Fuel System Tuning
      </h3>

      <div class="p-3.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-300/50 dark:border-amber-800/40 space-y-4">
        <Input
          type="range"
          name="capacity_multiplier"
          label="Tank Capacity Multiplier"
          min={0.5}
          max={2.0}
          step={0.05}
          value={capacityMult()}
          onChange={(v: number) => {
            setCapacityMult(v);
            FuelEngine.setCapacityMultiplier(v);
          }}
          notifyMode="none"
          minLabel="50% (Less)"
          maxLabel="200% (More)"
          showLimits={true}
          comment="Capacity Scale = Predefined Aircraft Tank × Multiplier"
          valueFormatter={(v) => `${(Number(v) * 100).toFixed(0)}% (${Number(v).toFixed(2)}x)`}
        />

        <Input
          type="range"
          name="consumption_multiplier"
          label="Fuel Burn Rate Multiplier"
          min={0.2}
          max={3.0}
          step={0.05}
          value={consumptionMult()}
          onChange={(v: number) => {
            setConsumptionMult(v);
            FuelEngine.setConsumptionMultiplier(v);
          }}
          notifyMode="none"
          minLabel="20% (Eco)"
          maxLabel="300% (Burn)"
          showLimits={true}
          comment="Burn Rate Scale = Authentic Idle & Cruise Flow × Multiplier"
          valueFormatter={(v) => `${(Number(v) * 100).toFixed(0)}% (${Number(v).toFixed(2)}x)`}
        />

        <button
          type="button"
          onClick={handleReset}
          class="w-full px-3 py-2 text-xs bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md transition-colors font-medium border border-gray-300/60 dark:border-gray-700/60"
        >
          Reset Fuel to 1.0x Factory Defaults
        </button>
      </div>
    </div>
  );
}
