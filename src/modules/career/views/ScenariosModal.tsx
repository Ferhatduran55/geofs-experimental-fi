import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import TransportEngine, { type TransportMission } from "../TransportEngine";
import SafeFlightLauncher from "../SafeFlightLauncher";
import { formatAirportDisplay } from "../AirportDatabase";
import Notify from "../../../shared/Notify";
import Storage from "../../../shared/Storage";
import Input from "../../../components/Input";

interface ScenariosModalProps {
  onClose: () => void;
  onMissionSelected?: (mission: TransportMission) => void;
}

export default (props: ScenariosModalProps) => {
  const [missionPool, setMissionPool] = createSignal<TransportMission[]>([]);
  const [selectedCategory, setSelectedCategory] = createSignal<string>("All");
  const [searchTerm, setSearchTerm] = createSignal<string>("");
  const [sortBy, setSortBy] = createSignal<"revenue_desc" | "dist_asc" | "dist_desc">("revenue_desc");
  const [loadingMissionId, setLoadingMissionId] = createSignal<string | null>(null);
  const [hasActiveMission, setHasActiveMission] = createSignal<boolean>(false);
  const [maxDistanceFilter, setMaxDistanceFilter] = createSignal<number>(1200);
  const [isRefreshing, setIsRefreshing] = createSignal<boolean>(false);

  const categories = ["All", "Airliner", "Regional", "Bush / GA", "Cargo", "VIP"];

  const checkActiveMission = async () => {
    const active = await Storage.get("career_current_mission");
    setHasActiveMission(!!active);
  };

  const loadCurrentPool = (forceSeed?: number) => {
    const geofs = (unsafeWindow as any).geofs;
    const ac = geofs?.aircraft?.instance;
    const lla = ac?.llaLocation || [41.2753, 28.7519];
    const mass = ac?.rigidBody?.mass || 2500;
    const acId = ac?.id || "1";

    const pool = TransportEngine.generate30MinDeterministicOperations(
      lla[0],
      lla[1],
      mass,
      acId
    );

    // If custom forceSeed is provided (Refresh button pressed)
    if (forceSeed) {
      setMissionPool(pool.sort(() => Math.random() - 0.5));
    } else {
      setMissionPool(pool);
    }
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadCurrentPool(Date.now());
    Notify.successNow("Contract offerings successfully refreshed!");
    setTimeout(() => setIsRefreshing(false), 400);
  };

  onMount(() => {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs && typeof geofs.pause === "function") geofs.pause(true);

    checkActiveMission();
    loadCurrentPool();
  });

  onCleanup(() => {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs && typeof geofs.pause === "function") geofs.pause(false);
  });

  const filteredMissions = () => {
    let list = [...missionPool()];

    // 1. Max Distance Slider Filter
    list = list.filter((m) => m.fixedDistanceNm <= maxDistanceFilter());

    // 2. Category Filter
    if (selectedCategory() !== "All") {
      list = list.filter((m) => m.category === selectedCategory());
    }

    // 3. Search Filter
    const q = searchTerm().trim().toLowerCase();
    if (q) {
      list = list.filter((m) => {
        const orig = formatAirportDisplay(m.originAirport);
        const dest = formatAirportDisplay(m.destinationAirport);
        return (
          m.originIcao.toLowerCase().includes(q) ||
          m.destinationIcao.toLowerCase().includes(q) ||
          orig.mainTitle.toLowerCase().includes(q) ||
          orig.subDetail.toLowerCase().includes(q) ||
          dest.mainTitle.toLowerCase().includes(q) ||
          dest.subDetail.toLowerCase().includes(q) ||
          m.aircraftModel.toLowerCase().includes(q)
        );
      });
    }

    // 4. Sort Filter
    if (sortBy() === "revenue_desc") {
      list.sort((a, b) => b.grossRevenue - a.grossRevenue);
    } else if (sortBy() === "dist_asc") {
      list.sort((a, b) => a.fixedDistanceNm - b.fixedDistanceNm);
    } else if (sortBy() === "dist_desc") {
      list.sort((a, b) => b.fixedDistanceNm - a.fixedDistanceNm);
    }

    return list;
  };

  const handleLaunchMission = async (mission: TransportMission) => {
    if (hasActiveMission()) {
      Notify.errorNow("You have an active contract. Complete or abort it first!");
      return;
    }

    setLoadingMissionId(mission.id);

    // Use SafeFlightLauncher to eliminate camera freeze and invisible aircraft
    const success = await SafeFlightLauncher.launchFlight({
      aircraftId: mission.aircraftId,
      originAirport: mission.originAirport,
      fuelPercent: mission.fuelRequiredPercent,
      onSuccess: async () => {
        const acceptedMission: TransportMission = {
          ...mission,
          isAccepted: true,
          acceptedAt: Date.now(),
        };

        const careerModule = (unsafeWindow as any).__efiCareerModule;
        if (careerModule) {
          careerModule.currentMission = acceptedMission;
        }

        await Storage.write("career_current_mission", acceptedMission);

        Notify.success(
          `Contract Accepted! Fly to ${mission.destinationIcao}. Reward: $${mission.grossRevenue.toLocaleString()}`,
          "Dispatch"
        );

        if (props.onMissionSelected) {
          props.onMissionSelected(acceptedMission);
        }

        props.onClose();
      },
      onError: () => {
        setLoadingMissionId(null);
      }
    });

    if (!success) {
      setLoadingMissionId(null);
    }
  };

  const getSilhouetteIcon = (sil: string) => {
    switch (sil) {
      case "heavy": return "✈️";
      case "business": return "🛩️";
      case "turboprop": return "🛫";
      case "ga": return "🛩️";
      default: return "✈️";
    }
  };

  return (
    <div class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn font-sans select-none">
      <div class="relative w-full max-w-6xl h-[90vh] bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-100">
        
        {/* Header Bar */}
        <div class="flex items-center justify-between px-6 py-4 bg-gray-800/90 border-b border-gray-700/80">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-xl shadow-lg shadow-emerald-900/40">
              ✈️
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-black tracking-wide text-white">Commercial Flight Dispatch Board</h2>
                <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-900/60 text-emerald-400 border border-emerald-700/50">
                  Live Operations
                </span>
              </div>
              <p class="text-xs text-gray-400">
                Procedural transport contracts originating from real GeoFS airfields
              </p>
            </div>
          </div>

          {/* Right Controls: Max Distance Slider + Refresh Button + Close */}
          <div class="flex items-center gap-4">
            <div class="w-48 bg-gray-900/60 px-3 py-1.5 rounded-lg border border-gray-700/60">
              <Input
                type="range"
                name="max_distance_slider"
                min={30}
                max={2000}
                step={25}
                unit="NM"
                label="Max Range"
                value={maxDistanceFilter()}
                onChange={(v: number) => setMaxDistanceFilter(v)}
                notifyMode="none"
              />
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing()}
              class="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
              title="Request new commercial flight contracts"
            >
              <span class={isRefreshing() ? "animate-spin" : ""}>🔄</span>
              <span>Refresh</span>
            </button>

            <button
              onClick={props.onClose}
              class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 transition-colors"
              title="Close Board"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-gray-800/40 border-b border-gray-700/50">
          <div class="flex items-center gap-1.5 overflow-x-auto py-1">
            <For each={categories}>
              {(cat) => (
                <button
                  onClick={() => setSelectedCategory(cat)}
                  class={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    selectedCategory() === cat
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                      : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700/40"
                  }`}
                >
                  {cat}
                </button>
              )}
            </For>
          </div>

          <div class="flex items-center gap-3">
            <div class="relative w-64">
              <input
                type="text"
                placeholder="Search ICAO, airport, aircraft..."
                value={searchTerm()}
                onInput={(e) => setSearchTerm(e.currentTarget.value)}
                class="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-900/90 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <span class="absolute left-2.5 top-2 text-gray-500 text-xs">🔍</span>
            </div>

            <select
              value={sortBy()}
              onChange={(e) => setSortBy(e.currentTarget.value as any)}
              class="px-3 py-1.5 text-xs bg-gray-900/90 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="revenue_desc">Highest Payout ($)</option>
              <option value="dist_asc">Shortest Flight (NM)</option>
              <option value="dist_desc">Longest Flight (NM)</option>
            </select>
          </div>
        </div>

        {/* Contract Offerings Cards Grid */}
        <div class="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
          <For each={filteredMissions()}>
            {(mission) => {
              const orig = formatAirportDisplay(mission.originAirport);
              const dest = formatAirportDisplay(mission.destinationAirport);
              const isPax = mission.payload.type === "passenger";

              return (
                <div class="flex flex-col justify-between bg-gray-800/80 hover:bg-gray-800 border border-gray-700/70 hover:border-emerald-500/60 rounded-xl p-4 transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-black/50 group">
                  <div>
                    {/* Top Meta Line */}
                    <div class="flex items-center justify-between pb-2 mb-3 border-b border-gray-700/50">
                      <span class="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded bg-gray-700/70 text-gray-300">
                        {mission.category}
                      </span>
                      <div class="text-right">
                        <div class="text-base font-black text-emerald-400 font-mono tracking-tight">
                          ${mission.grossRevenue.toLocaleString()}
                        </div>
                        <div class="text-[9px] text-gray-400">Fixed Contract Payout</div>
                      </div>
                    </div>

                    {/* Route Corridor */}
                    <div class="bg-gray-900/70 p-3 rounded-lg border border-gray-700/40 mb-3 space-y-2">
                      <div class="flex items-center justify-between">
                        <div>
                          <div class="text-sm font-black text-white font-mono">{mission.originIcao}</div>
                          <div class="text-[10px] text-gray-300 font-medium truncate max-w-[130px]" title={orig.mainTitle}>
                            {orig.mainTitle}
                          </div>
                          <div class="text-[9px] text-gray-500 truncate max-w-[130px]">{orig.subDetail}</div>
                        </div>

                        <div class="flex flex-col items-center px-2">
                          <span class="text-[10px] font-bold text-gray-400 font-mono">{mission.fixedDistanceNm} NM</span>
                          <div class="w-16 h-0.5 bg-gradient-to-r from-emerald-500/30 via-emerald-400 to-emerald-500/30 my-1 relative">
                            <span class="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[10px]">✈️</span>
                          </div>
                          <span class="text-[9px] text-emerald-400 font-mono font-bold">{mission.initialBearingFormatted}</span>
                        </div>

                        <div class="text-right">
                          <div class="text-sm font-black text-white font-mono">{mission.destinationIcao}</div>
                          <div class="text-[10px] text-gray-300 font-medium truncate max-w-[130px]" title={dest.mainTitle}>
                            {dest.mainTitle}
                          </div>
                          <div class="text-[9px] text-gray-500 truncate max-w-[130px]">{dest.subDetail}</div>
                        </div>
                      </div>
                    </div>

                    {/* Aircraft & Manifest Details */}
                    <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                      <div class="bg-gray-900/50 p-2 rounded border border-gray-700/30">
                        <div class="text-[9px] text-gray-400 uppercase font-semibold">Assigned Aircraft</div>
                        <div class="font-bold text-gray-200 truncate flex items-center gap-1 mt-0.5" title={mission.aircraftModel}>
                          <span>{getSilhouetteIcon(mission.silhouette)}</span>
                          <span class="truncate">{mission.aircraftModel}</span>
                        </div>
                      </div>

                      <div class="bg-gray-900/50 p-2 rounded border border-gray-700/30">
                        <div class="text-[9px] text-gray-400 uppercase font-semibold">Manifest Payload</div>
                        <div class="font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                          <span>{isPax ? "👥" : "📦"}</span>
                          <span>
                            {isPax
                              ? `${mission.payload.amount} Passengers`
                              : `${mission.payload.amount.toLocaleString()} kg Cargo`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Operational Limits */}
                    <div class="flex items-center justify-between text-[10px] text-gray-400 bg-gray-900/30 px-2 py-1 rounded">
                      <span>⏱️ Est. Time: {Math.round(mission.expectedDurationMs / 60000)} min</span>
                      <span>⛽ Min. Fuel: {mission.fuelRequiredPercent}%</span>
                      <span>⚓ Dep. Fee: ${mission.baseHandlingFee}</span>
                    </div>
                  </div>

                  {/* Accept & Dispatch Action */}
                  <div class="mt-4 pt-3 border-t border-gray-700/40">
                    <button
                      onClick={() => handleLaunchMission(mission)}
                      disabled={loadingMissionId() !== null || hasActiveMission()}
                      class={`w-full py-2 px-4 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                        hasActiveMission()
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white hover:shadow-emerald-900/50 active:scale-[0.98]"
                      }`}
                    >
                      <Show
                        when={loadingMissionId() === mission.id}
                        fallback={
                          <>
                            <span>🛫</span>
                            <span>Accept & Spawn On Runway</span>
                          </>
                        }
                      >
                        <span class="animate-spin">🔄</span>
                        <span>Configuring Aircraft & Runway...</span>
                      </Show>
                    </button>
                  </div>
                </div>
              );
            }}
          </For>
        </div>

      </div>
    </div>
  );
};
