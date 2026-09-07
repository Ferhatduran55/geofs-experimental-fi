import { createSignal, onMount, Show, For, onCleanup } from "solid-js";
import { Portal } from "solid-js/web";
import type { CareerModule } from "../CareerModule";
import { MarketEngine, type MarketTrendPoint } from "../MarketEngine";
import { TransportEngine, type TransportMission } from "../TransportEngine";
import { calculateDistanceNm, calculateBearingDeg, formatBearingWithCompass, formatAirportDisplay } from "../AirportDatabase";
import Notify from "../../../shared/Notify";
import ScenariosModal from "./ScenariosModal";
import CustomScenarioModal from "./CustomScenarioModal";

/**
 * 24-Hour Interactive SVG Market Trend Chart Component
 */
const MarketTrendChart = (props: {
  trend: MarketTrendPoint[];
  metricKey: "passengerRatePerNm" | "cargoRatePerNm" | "fuelRatePerGal";
  color: string;
  title: string;
  unit: string;
  currentValue: number;
}) => {
  const currentHour = new Date().getUTCHours() + new Date().getUTCMinutes() / 60;
  const values = props.trend.map((p) => p.rates[props.metricKey]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  const width = 450;
  const height = 120;
  const padLeft = 40;
  const padRight = 15;
  const padTop = 15;
  const padBottom = 25;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const points = props.trend
    .map((p, idx) => {
      const x = padLeft + (idx / 24) * chartW;
      const y = padTop + chartH - ((p.rates[props.metricKey] - minVal) / range) * chartH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  const nowX = padLeft + (currentHour / 24) * chartW;

  return (
    <div class="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-2">
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">{props.title}</span>
          <div class="text-lg font-bold font-mono text-white mt-0.5" style={{ color: props.color }}>
            ${props.currentValue.toFixed(props.metricKey === "cargoRatePerNm" ? 5 : props.metricKey === "passengerRatePerNm" ? 3 : 2)}{" "}
            <span class="text-xs text-gray-400 font-normal">{props.unit}</span>
          </div>
        </div>
        <div class="text-right text-[11px] text-gray-400 font-mono">
          <div>H: ${maxVal.toFixed(props.metricKey === "cargoRatePerNm" ? 4 : 2)}</div>
          <div>L: ${minVal.toFixed(props.metricKey === "cargoRatePerNm" ? 4 : 2)}</div>
        </div>
      </div>

      <div class="w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} class="w-full h-28">
          <line x1={padLeft} y1={padTop} x2={width - padRight} y2={padTop} stroke="#374151" stroke-dasharray="3,3" stroke-width="0.8" />
          <line x1={padLeft} y1={padTop + chartH / 2} x2={width - padRight} y2={padTop + chartH / 2} stroke="#374151" stroke-dasharray="3,3" stroke-width="0.8" />
          <line x1={padLeft} y1={padTop + chartH} x2={width - padRight} y2={padTop + chartH} stroke="#374151" stroke-width="1" />

          <polyline fill="none" stroke={props.color} stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points={points} />

          <line x1={nowX} y1={padTop - 5} x2={nowX} y2={padTop + chartH} stroke="#f59e0b" stroke-width="1.8" stroke-dasharray="3,2" />
          <text x={nowX} y={padTop - 8} fill="#f59e0b" font-size="9" font-family="monospace" font-weight="bold" text-anchor="middle">
            NOW
          </text>

          <text x={padLeft} y={height - 5} fill="#9ca3af" font-size="9" font-family="monospace">00:00</text>
          <text x={padLeft + chartW * 0.25} y={height - 5} fill="#9ca3af" font-size="9" font-family="monospace">06:00</text>
          <text x={padLeft + chartW * 0.5} y={height - 5} fill="#9ca3af" font-size="9" font-family="monospace">12:00</text>
          <text x={padLeft + chartW * 0.75} y={height - 5} fill="#9ca3af" font-size="9" font-family="monospace">18:00</text>
          <text x={width - padRight} y={height - 5} fill="#9ca3af" font-size="9" font-family="monospace" text-anchor="end">24:00</text>
        </svg>
      </div>
    </div>
  );
};

export default async (module: CareerModule) => {
  const [showOperationsModal, setShowOperationsModal] = createSignal(false);
  const [showCustomModal, setShowCustomModal] = createSignal(false);
  const [showLogbookModal, setShowLogbookModal] = createSignal(false);
  const [showTrendsModal, setShowTrendsModal] = createSignal(false);
  const [activeMission, setActiveMission] = createSignal<TransportMission | null>(module.currentMission);
  const [balance, setBalance] = createSignal(module.balance);

  // Live enroute navigation signals
  const [remainingDistNm, setRemainingDistNm] = createSignal<number>(0);
  const [liveBearing, setLiveBearing] = createSignal<string>("");
  const [estRemainingMins, setEstRemainingMins] = createSignal<number>(0);
  const [isWithin1Nm, setIsWithin1Nm] = createSignal<boolean>(false);

  // Tick loop for live distance & navigation update
  let navTimer: number | null = null;
  onMount(() => {
    navTimer = window.setInterval(() => {
      const msn = module.currentMission;
      if (!msn) return;

      const geofs = (unsafeWindow as any).geofs;
      const lla = geofs?.aircraft?.instance?.llaLocation;
      if (!lla) return;

      const dest = msn.destinationAirport;
      const d = calculateDistanceNm(lla[0], lla[1], dest.lat, dest.lon);
      setRemainingDistNm(d);
      setIsWithin1Nm(d <= 1.0);

      const b = calculateBearingDeg(lla[0], lla[1], dest.lat, dest.lon);
      setLiveBearing(formatBearingWithCompass(b));

      const kias = geofs?.animation?.values?.kias || 200;
      const speedKts = Math.max(80, kias);
      const mins = Math.round((d / speedKts) * 60);
      setEstRemainingMins(mins);
    }, 1000);
  });

  onCleanup(() => {
    if (navTimer !== null) {
      clearInterval(navTimer);
      navTimer = null;
    }
    const geofs = (unsafeWindow as any).geofs;
    if (geofs) geofs.pause = false;
  });

  const openLogbook = () => {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs) geofs.pause = true;
    setShowLogbookModal(true);
  };

  const closeLogbook = () => {
    setShowLogbookModal(false);
    const geofs = (unsafeWindow as any).geofs;
    if (geofs) geofs.pause = false;
  };

  const openTrends = () => {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs) geofs.pause = true;
    setShowTrendsModal(true);
  };

  const closeTrends = () => {
    setShowTrendsModal(false);
    const geofs = (unsafeWindow as any).geofs;
    if (geofs) geofs.pause = false;
  };

  const handleAbortContract = () => {
    module.currentMission = null;
    module.saveData();
    setActiveMission(null);
    Notify.warning("Contract aborted. Payload safely returned.", "Operations");
  };

  const totalFlights = () => {
    let count = 0;
    Object.keys(module.logbook).forEach((id) => {
      count += module.logbook[id].length;
    });
    return count;
  };

  const fleetSize = () => Object.keys(module.logbook).length;
  const currentRates = () => MarketEngine.getCurrentRates();
  const todaysTrend = () => MarketEngine.getTodaysTrend();

  return [
    <div class="p-4 space-y-4 font-sans text-gray-100">
      {/* Career Overview Banner */}
      <div class="bg-gray-800/90 dark:bg-black/70 border border-gray-700/60 p-4 rounded-xl space-y-3 shadow-lg">
        <div class="flex items-center justify-between">
          <h3 class="text-base font-bold text-white tracking-wide flex items-center">
            <span class="mr-2">✈️</span> Flight Career
          </h3>
          <span class="text-xs font-mono px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
            Certified Aviator
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2.5">
          <div class="bg-gray-900/80 p-3 rounded-lg text-center border border-gray-800">
            <p class="text-[11px] text-gray-400">Account Balance</p>
            <p class="font-display text-lg font-bold text-green-400 mt-0.5">
              ${balance().toLocaleString()}
            </p>
          </div>
          <div class="bg-gray-900/80 p-3 rounded-lg text-center border border-gray-800">
            <p class="text-[11px] text-gray-400">Total Flights</p>
            <p class="font-display text-lg font-bold text-white mt-0.5">{totalFlights()}</p>
          </div>
          <div class="bg-gray-900/80 p-3 rounded-lg text-center border border-gray-800">
            <p class="text-[11px] text-gray-400">Active Fleet</p>
            <p class="font-display text-lg font-bold text-blue-400 mt-0.5">{fleetSize()} AC</p>
          </div>
        </div>

        {/* Rich Active Contract & Navigation Briefing Card */}
        <Show when={activeMission()}>
          {(msn) => (
            <div class="p-4 bg-gradient-to-br from-gray-900 via-blue-950/60 to-gray-950 border border-blue-500/50 rounded-2xl space-y-3 shadow-xl">
              <div class="flex justify-between items-center text-xs text-blue-300">
                <span class="font-bold uppercase tracking-wider flex items-center">
                  <span class={`w-2.5 h-2.5 rounded-full ${isWithin1Nm() ? "bg-emerald-400 animate-ping" : "bg-green-400 animate-pulse"} mr-2`} />
                  {isWithin1Nm() ? "🎯 Final Landing Approach (<1 NM)" : `Active Flight: ${msn().aircraftModel}`}
                </span>
                <span class="font-mono bg-blue-900/80 px-2.5 py-0.5 rounded text-blue-200 text-xs font-semibold">
                  Fixed: {msn().fixedDistanceNm} NM
                </span>
              </div>

              {/* Route Summary */}
              <div class="flex items-start justify-between border-b border-gray-800 pb-2.5 gap-2">
                <div class="space-y-0.5 flex-1">
                  <div class="text-[10px] text-gray-400 uppercase font-semibold">Origin Airport</div>
                  <div class="font-bold text-sm text-white">{formatAirportDisplay(msn().originAirport).mainTitle}</div>
                  <div class="text-xs text-gray-400">{formatAirportDisplay(msn().originAirport).subDetail}</div>
                </div>

                <div class="text-right space-y-0.5 flex-1">
                  <div class="text-[10px] text-emerald-400 uppercase font-semibold">Destination Airport</div>
                  <div class="font-bold text-sm text-emerald-300">{formatAirportDisplay(msn().destinationAirport).mainTitle}</div>
                  <div class="text-xs text-gray-400">{formatAirportDisplay(msn().destinationAirport).subDetail}</div>
                </div>
              </div>

              {/* Live Enroute Telemetry & Landing Runway */}
              <div class="grid grid-cols-3 gap-2 bg-gray-950/90 rounded-xl p-3 text-center border border-gray-800">
                <div>
                  <div class="text-[10px] text-gray-400">Remaining Dist</div>
                  <div class="font-mono text-sm font-bold text-cyan-300 mt-0.5">
                    {remainingDistNm()} <span class="text-[10px] font-normal text-gray-400">NM</span>
                  </div>
                </div>
                <div>
                  <div class="text-[10px] text-gray-400">Target Bearing</div>
                  <div class="font-mono text-sm font-bold text-amber-400 mt-0.5">
                    🧭 {liveBearing() || msn().initialBearingFormatted}
                  </div>
                </div>
                <div>
                  <div class="text-[10px] text-gray-400">Est. Time (ETE)</div>
                  <div class="font-mono text-sm font-bold text-white mt-0.5">
                    ~{estRemainingMins()} <span class="text-[10px] font-normal text-gray-400">min</span>
                  </div>
                </div>
              </div>

              {/* Landing Runway & Payout Details */}
              <div class="flex items-center justify-between text-xs pt-1">
                <div class="text-gray-300">
                  <span>🛬 Assigned Runway: </span>
                  <b class="text-emerald-400">{msn().destinationAirport.runwayHeading || "Active Runway"}</b>
                </div>
                <div class="font-bold text-green-400 text-sm font-mono">
                  +${msn().grossRevenue.toLocaleString()}
                </div>
              </div>

              <div class="flex justify-between items-center text-xs pt-2 border-t border-gray-800">
                <span class="text-gray-400">📦 {TransportEngine.getPayloadDescription(msn().payload)}</span>
                <button
                  type="button"
                  class="text-xs text-red-400 hover:text-red-300 hover:underline font-semibold"
                  onClick={handleAbortContract}
                >
                  Abort Contract
                </button>
              </div>
            </div>
          )}
        </Show>
      </div>

      {/* Main Buttons */}
      <div class="space-y-2.5">
        <button
          type="button"
          class="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          onClick={() => setShowOperationsModal(true)}
        >
          <span>🛫</span>
          <span>Flight Operations & Contracts</span>
        </button>

        <button
          type="button"
          class="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2"
          onClick={() => setShowCustomModal(true)}
        >
          <span>🛠️</span>
          <span>Custom Scenario Builder</span>
        </button>

        <button
          type="button"
          class="w-full px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-medium text-sm transition-colors shadow flex items-center justify-center space-x-2"
          onClick={openLogbook}
        >
          <span>📚</span>
          <span>Pilot Logbook & Flight Records</span>
        </button>

        <button
          type="button"
          class="w-full px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-medium text-sm transition-colors shadow flex items-center justify-center space-x-2"
          onClick={openTrends}
        >
          <span>📈</span>
          <span>Aviation Market Economics</span>
        </button>
      </div>

      {/* Custom Scenario Builder Modal */}
      <Show when={showCustomModal()}>
        <Portal mount={document.body}>
          <CustomScenarioModal
            onClose={() => setShowCustomModal(false)}
            onScenarioLaunched={() => {
              setActiveMission(module.currentMission);
              setBalance(module.balance);
            }}
          />
        </Portal>
      </Show>

      {/* Operations Modal (Fullscreen 30m Dynamic Board) */}
      <Show when={showOperationsModal()}>
        <Portal mount={document.body}>
          <ScenariosModal
            onClose={() => setShowOperationsModal(false)}
            onMissionSelected={() => {
              setActiveMission(module.currentMission);
              setBalance(module.balance);
            }}
          />
        </Portal>
      </Show>

      {/* Logbook Modal (Fullscreen Portal) */}
      <Show when={showLogbookModal()}>
        <Portal mount={document.body}>
          <div class="fixed inset-0 z-[100000] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
            <div class="bg-gray-900 border border-gray-700/80 rounded-2xl w-[94vw] max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden text-gray-100">
              <div class="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
                <div class="flex items-center space-x-3">
                  <span class="text-3xl">📚</span>
                  <div>
                    <h3 class="font-bold text-white text-lg">Pilot Flight Logbook</h3>
                    <p class="text-xs text-gray-400">Chronological history of flights, settlements and performance ratings</p>
                  </div>
                </div>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                  onClick={closeLogbook}
                >
                  ✕
                </button>
              </div>

              <div class="flex-1 overflow-y-auto p-6 space-y-4">
                <Show
                  when={Object.keys(module.logbook).length > 0}
                  fallback={
                    <div class="text-center py-20 text-gray-500 space-y-2">
                      <div class="text-4xl">📖</div>
                      <p class="text-sm font-medium">No flight records logged yet. Fly contracts to build your career history!</p>
                    </div>
                  }
                >
                  <For each={Object.keys(module.logbook)}>
                    {(acId) => (
                      <div class="space-y-3">
                        <div class="flex items-center justify-between border-b border-gray-800 pb-2">
                          <h4 class="font-bold text-sm text-blue-400 uppercase tracking-wider">
                            ✈️ {module.logbook[acId][0]?.aircraftName || `Aircraft ${acId}`}
                          </h4>
                          <span class="text-xs text-gray-500 font-mono">
                            {module.logbook[acId].length} Flights Logged
                          </span>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <For each={module.logbook[acId]}>
                            {(f) => (
                              <div class="p-4 bg-gray-800/70 hover:bg-gray-800 rounded-2xl border border-gray-700/70 text-xs space-y-2 transition-all">
                                <div class="flex justify-between items-center font-bold">
                                  <span class="text-white text-base">
                                    {f.departureIcao} <span class="text-gray-500">➔</span> {f.arrivalIcao}
                                  </span>
                                  <span class="font-mono bg-blue-900/60 text-blue-300 px-2.5 py-0.5 rounded text-xs">
                                    {f.flownDistanceNm} NM
                                  </span>
                                </div>
                                <div class="text-gray-300 flex justify-between">
                                  <span>📦 {f.payloadDescription}</span>
                                  <span>⏱️ {f.flightDurationHours}h</span>
                                </div>
                                <div class="flex justify-between items-center pt-2 border-t border-gray-700/50 text-xs">
                                  <span class="text-gray-500 font-mono">
                                    {new Date(f.landingTime).toLocaleDateString()} • {f.callsign}
                                  </span>
                                  <Show
                                    when={f.financials}
                                    fallback={<span class="text-gray-400">Free Flight</span>}
                                  >
                                    <span class="font-bold text-green-400">
                                      Rating {f.financials!.rating} (+${f.financials!.netIncome.toLocaleString()})
                                    </span>
                                  </Show>
                                </div>
                              </div>
                            )}
                          </For>
                        </div>
                      </div>
                    )}
                  </For>
                </Show>
              </div>

              <div class="px-6 py-3 bg-gray-950 border-t border-gray-800 text-right">
                <button
                  type="button"
                  class="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl transition-colors"
                  onClick={closeLogbook}
                >
                  Close Logbook
                </button>
              </div>
            </div>
          </div>
        </Portal>
      </Show>

      {/* Market Trends Modal with 24-Hour SVG Curves */}
      <Show when={showTrendsModal()}>
        <Portal mount={document.body}>
          <div class="fixed inset-0 z-[100000] flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
            <div class="bg-gray-900 border border-gray-700/80 rounded-2xl w-[94vw] max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden text-gray-100">
              <div class="px-6 py-4 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950">
                <div class="flex items-center space-x-3">
                  <span class="text-3xl">📈</span>
                  <div>
                    <h3 class="font-bold text-white text-lg">Aviation Market Economics</h3>
                    <p class="text-xs text-gray-400">24-Hour UTC pricing trends, commodity rates and fuel economics</p>
                  </div>
                </div>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                  onClick={closeTrends}
                >
                  ✕
                </button>
              </div>

              <div class="flex-1 overflow-y-auto p-6 space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MarketTrendChart
                    trend={todaysTrend()}
                    metricKey="passengerRatePerNm"
                    color="#38bdf8"
                    title="Passenger Rate"
                    unit="/pax/NM"
                    currentValue={currentRates().passengerRatePerNm}
                  />
                  <MarketTrendChart
                    trend={todaysTrend()}
                    metricKey="cargoRatePerNm"
                    color="#34d399"
                    title="Air Cargo Rate"
                    unit="/kg/NM"
                    currentValue={currentRates().cargoRatePerNm}
                  />
                  <MarketTrendChart
                    trend={todaysTrend()}
                    metricKey="fuelRatePerGal"
                    color="#f87171"
                    title="Aviation Fuel"
                    unit="/gal"
                    currentValue={currentRates().fuelRatePerGal}
                  />
                </div>

                <div class="p-4 bg-gray-950/80 rounded-2xl border border-gray-800 space-y-2 text-xs text-gray-300">
                  <h4 class="font-bold text-white text-sm">💡 Dynamic Market Economics Guide:</h4>
                  <p>• <b>Fixed Client Contracts:</b> Payout is locked upon contract acceptance based on exact Great-Circle distance (NM).</p>
                  <p>• <b>Settlement Upon Arrival:</b> Fuel burned during flight is deducted at the arrival airport's current fuel rate.</p>
                  <p>• <b>30-Minute Market Rotations:</b> Contract availability rotates synchronously every 30 minutes (UTC).</p>
                  <p>• <b>Pilot Rating Multipliers:</b> Smooth landings (&lt; -150 fpm) and passenger comfort grant substantial bonus revenue.</p>
                </div>
              </div>

              <div class="px-6 py-3 bg-gray-950 border-t border-gray-800 text-right">
                <button
                  type="button"
                  class="px-5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded-xl transition-colors"
                  onClick={closeTrends}
                >
                  Close Market Panel
                </button>
              </div>
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  ];
};
