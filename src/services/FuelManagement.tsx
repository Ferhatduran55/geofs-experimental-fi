import { createSignal } from "solid-js";
import FuelSystem from "../classes/FuelSystem";
import Input from "../components/Input";
import { WarningAmber, CheckCircle, Warning } from "../assets/icons";

export default async () => {
  return await new Promise((resolve, reject) => {
    try {
      const [isSystemActive, setIsSystemActive] = createSignal(FuelSystem.isActive);
      const checkInterval = setInterval(() => {
        setIsSystemActive(FuelSystem.isActive);
      }, 1000);
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 10000);
      if (!isSystemActive()) {
        resolve([
          <div class="p-4 text-center text-gray-500 dark:text-neutral-400">
            <p class="text-lg font-semibold mb-2">⛽ Fuel Management System</p>
            <p>System is not active.</p>
            <p class="text-sm mt-2">Enable it in <strong>Experimental Features</strong> tab.</p>
            <button
              onclick={() => {
                window.location.reload();
              }}
              class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div>
        ]);
        return;
      }

  const [currentFuel, setCurrentFuel] = createSignal(FuelSystem.fuelPercentage);
  const [fuelGal, setFuelGal] = createSignal(FuelSystem.currentFuelGal);
  const [capacityGal, setCapacityGal] = createSignal(FuelSystem.fuelCapacityGal);
  const [consumptionRateGal, setConsumptionRateGal] = createSignal(FuelSystem.consumptionRateGalPerSec);
      const [hasEngines, setHasEngines] = createSignal(true);
      const [canRefuel, setCanRefuel] = createSignal(false);
      const [refuelConditions, setRefuelConditions] = createSignal({
        onGround: false,
        brakesOn: false,
        lowSpeed: false,
        enginesOff: false
      });
      const checkRefuelConditions = () => {
        const aircraft = (unsafeWindow as any).geofs?.aircraft?.instance;
        if (!aircraft) return;

        const conditions = {
          onGround: aircraft.groundContact === true,
          brakesOn: aircraft.brakesOn === true,
          lowSpeed: (aircraft.groundSpeed || 0) < 0.5,
          enginesOff: !aircraft.engine?.on
        };

        setRefuelConditions(conditions);
        const allConditionsMet = Object.values(conditions).every(c => c === true);
        setCanRefuel(allConditionsMet);
      };
      const updateInterval = setInterval(() => {
        if (FuelSystem.isActive) {
          setCurrentFuel(FuelSystem.fuelPercentage);
          setFuelGal(FuelSystem.currentFuelGal);
          setCapacityGal(FuelSystem.fuelCapacityGal);
          setConsumptionRateGal(FuelSystem.consumptionRateGalPerSec);
          setIsSystemActive(true);
          checkRefuelConditions();
          const aircraft = (unsafeWindow as any).geofs?.aircraft?.instance;
          setHasEngines(!!(aircraft?.engines && aircraft.engines.length > 0));
        } else {
          setIsSystemActive(false);
        }
      }, 500);
      setTimeout(() => {
        return () => clearInterval(updateInterval);
      }, 0);

      let refuelTimeout: number | null = null;
      const doRefuel = (percent: number) => {
        const p = Math.max(0, Math.min(100, Math.round(percent)));
        FuelSystem.refuel(p);
        setCurrentFuel(FuelSystem.fuelPercentage);
        setFuelGal(FuelSystem.currentFuelGal);
      };

      const refuelToPercentage = (percent: number, immediate: boolean = false) => {
        // Update visual immediately
        setCurrentFuel(percent);

        if (refuelTimeout) {
          clearTimeout(refuelTimeout);
          refuelTimeout = null;
        }

        if (immediate) {
          doRefuel(percent);
          return;
        }

        // Debounce actual refuel to avoid excessive operations while sliding
        refuelTimeout = window.setTimeout(() => {
          doRefuel(percent);
          refuelTimeout = null;
        }, 250);
      };

      const response = [
        <div class="p-4">
          {}
          {!isSystemActive() ? (
            <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
              <p class="text-sm text-yellow-700 dark:text-yellow-300 font-medium">
                ⚠️ System Initializing...
              </p>
              <p class="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Please wait or enable Fuel System in Experimental Features.
              </p>
            </div>
          ) : !hasEngines() ? (
            <div class="bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-700 rounded-lg p-6 text-center">
              <div class="flex flex-col items-center gap-3">
                <div class="text-5xl">⚠️</div>
                <h3 class="text-xl font-bold text-red-800 dark:text-red-200">
                  Engine Not Detected
                </h3>
                <p class="text-base text-red-700 dark:text-red-300 max-w-md">
                  No engines found on this aircraft. The fuel consumption system cannot operate without engines.
                </p>
                <p class="text-sm text-red-600 dark:text-red-400 mt-2">
                  This aircraft may be a glider or non-powered vehicle.
                </p>
              </div>
            </div>
          ) : (
            <>
              {}
              <div class="bg-gray-800 dark:bg-black/70 p-4 rounded-lg space-y-6">
                <div>
                  <h3 class="text-base font-semibold text-white mb-4">Current Fuel Status</h3>
                  
                  {}
                  <div class="space-y-3">
                    <div class="flex justify-between items-center text-sm text-gray-300">
                      <span>Fuel Level</span>
                      <span class={`font-display ${
                        currentFuel() > 75 ? 'text-green-400' :
                        currentFuel() > 40 ? 'text-yellow-400' :
                        currentFuel() > 10 ? 'text-orange-400' : 'text-red-400'
                      }`}>{currentFuel().toFixed(1)}%</span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-2.5">
                      <div 
                        class={`h-2.5 rounded-full transition-all duration-300 ${
                          currentFuel() > 75 ? 'bg-green-500' :
                          currentFuel() > 40 ? 'bg-yellow-500' :
                          currentFuel() > 10 ? 'bg-orange-500' : 'bg-red-500'
                        }`}
                        style={`width: ${currentFuel()}%`}
                      />
                    </div>
                  </div>

                  {}
                  <div class="grid grid-cols-2 gap-3 mt-4">
                    <div class="bg-gray-900/70 p-3 rounded-md">
                      <p class="text-xs text-gray-400">Current Fuel</p>
                      <p class="font-display text-xl text-white">
                        {fuelGal().toFixed(1)} <span class="text-base text-gray-400">gal</span>
                      </p>
                    </div>
                    <div class="bg-gray-900/70 p-3 rounded-md">
                      <p class="text-xs text-gray-400">Capacity</p>
                      <p class="font-display text-xl text-white">
                        {capacityGal().toFixed(1)} <span class="text-base text-gray-400">gal</span>
                      </p>
                    </div>
                    <div class="bg-gray-900/70 p-3 rounded-md">
                      <p class="text-xs text-gray-400">Consumption</p>
                      <p class="font-display text-xl text-white">
                        {consumptionRateGal().toFixed(3)} <span class="text-base text-gray-400">gal/s</span>
                      </p>
                    </div>
                    <div class="bg-gray-900/70 p-3 rounded-md">
                      <p class="text-xs text-gray-400">Est. Time</p>
                      <p class="font-display text-xl text-white">
                        {consumptionRateGal() >= 0.0001
                          ? <>{Math.floor(fuelGal() / consumptionRateGal() / 60)} <span class="text-base text-gray-400">min</span></>
                          : '∞'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {}
              <div class="bg-gray-800 dark:bg-black/70 p-4 rounded-lg">
                <h3 class="text-base font-semibold text-white mb-3">
                  Refuel Aircraft
                </h3>

            {}
            {!canRefuel() ? (
              <div class="space-y-3 mb-4">
                <div class="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-3">
                  <div class="flex items-center text-yellow-400 font-semibold text-sm">
                    <WarningAmber class="w-5 h-5 mr-2" fill="currentColor" />
                    Refueling Safety Requirements
                  </div>
                  <div class="text-yellow-200/80 mt-2 ml-1 text-sm space-y-1">
                    <p class="text-yellow-200">
                      {!refuelConditions().onGround 
                        ? 'Land the aircraft first.' 
                        : 'Complete the following steps:'}
                    </p>
                    {!refuelConditions().onGround && (
                      <p class="text-xs text-yellow-400/60">
                        Find a runway or suitable landing area.
                      </p>
                    )}
                  </div>
                  
                  {refuelConditions().onGround && (
                    <div class="mt-3 space-y-2 ml-1">
                      <div class={`flex items-center gap-2 text-sm ${refuelConditions().brakesOn ? 'text-green-400' : 'text-yellow-300'}`}>
                        <span>{refuelConditions().brakesOn ? '✓' : '→'}</span>
                        <span>Engage parking brakes</span>
                        {!refuelConditions().brakesOn && (
                          <span class="text-xs text-yellow-400/60 ml-1">(Press <kbd class="px-1 py-0.5 bg-gray-700 rounded text-xs">.</kbd>)</span>
                        )}
                      </div>
                      
                      <div class={`flex items-center gap-2 text-sm ${refuelConditions().lowSpeed ? 'text-green-400' : 'text-yellow-300'}`}>
                        <span>{refuelConditions().lowSpeed ? '✓' : '→'}</span>
                        <span>Stop completely</span>
                        {!refuelConditions().lowSpeed && (
                          <span class="text-xs text-yellow-400/60 ml-1">(Below 0.5 kt)</span>
                        )}
                      </div>
                      
                      <div class={`flex items-center gap-2 text-sm ${refuelConditions().enginesOff ? 'text-green-400' : 'text-yellow-300'}`}>
                        <span>{refuelConditions().enginesOff ? '✓' : '→'}</span>
                        <span>Turn off engines</span>
                        {!refuelConditions().enginesOff && (
                          <span class="text-xs text-yellow-400/60 ml-1">(Press <kbd class="px-1 py-0.5 bg-gray-700 rounded text-xs">E</kbd>)</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                {}
                <div class="space-y-3 mb-4">
                  <div class="bg-green-900/30 border border-green-500/50 rounded-lg p-3">
                    <div class="flex items-center text-green-400 font-semibold text-sm">
                      <CheckCircle class="w-5 h-5 mr-2" fill="currentColor" />
                      All safety checks passed
                    </div>
                    
                    <div class="mt-2 space-y-1 ml-1 text-sm text-green-400/80">
                      <div class="flex items-center gap-2">
                        <span>✓</span>
                        <span>Aircraft landed</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span>✓</span>
                        <span>Parking brakes engaged</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span>✓</span>
                        <span>Aircraft stopped</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span>✓</span>
                        <span>Engines off</span>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div class="grid grid-cols-4 gap-2 mb-4">
                  <button
                    onclick={() => refuelToPercentage(25, true)}
                    class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    25%
                  </button>
                  <button
                    onclick={() => refuelToPercentage(50, true)}
                    class="px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    50%
                  </button>
                  <button
                    onclick={() => { doRefuel(75); }}
                    class="px-3 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    75%
                  </button>
                  <button
                    onclick={() => { doRefuel(100); }}
                    class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    100%
                  </button>
                </div>

                {}
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-300">
                    Custom Amount
                  </label>
                  <Input
                    type="range"
                    name="fuel_custom"
                    min={0}
                    max={100}
                    step={0.1}
                    value={currentFuel()}
                    onChange={(v: number) => setCurrentFuel(v)}
                    onApply={(v: number) => doRefuel(v)}
                    debounceApply={250}
                    notifyMode={'input'}
                    notifyCategory={'fuel'}
                    unit={'%'}
                  />
                </div>

                {}
                <button
                  onclick={() => refuelToPercentage(0)}
                  class="w-full mt-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                >
                  Empty Tank (0%)
                </button>
              </>
            )}
          </div>

          {}
          {hasEngines() && currentFuel() < 20 && (
            <div class="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mt-4">
              <div class="flex items-center text-red-400 font-semibold text-sm">
                <Warning class="w-5 h-5 mr-2" fill="currentColor" />
                LOW FUEL WARNING
              </div>
              <p class="text-sm text-red-300/80 mt-1 ml-1">
                Fuel level is critically low. Consider refueling soon.
              </p>
            </div>
          )}
            </>
          )}
        </div>
      ];

      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};
