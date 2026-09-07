import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import CustomScenarioEngine, { type CustomScenario } from "../CustomScenarioEngine";
import { getGeoFSRunways, calculateDistanceNm, type AirportInfo } from "../AirportDatabase";
import Notify from "../../../shared/Notify";
import Input from "../../../components/Input";

interface CustomScenarioModalProps {
  onClose: () => void;
  onScenarioLaunched?: () => void;
}

export default (props: CustomScenarioModalProps) => {
  const [savedScenarios, setSavedScenarios] = createSignal<CustomScenario[]>([]);
  const [allRunways, setAllRunways] = createSignal<AirportInfo[]>([]);
  const [aircraftList, setAircraftList] = createSignal<{ id: string; name: string }[]>([]);

  // Form State
  const [editingId, setEditingId] = createSignal<string | null>(null);
  const [scenarioName, setScenarioName] = createSignal<string>("Custom Charter Flight");
  const [selectedAircraftId, setSelectedAircraftId] = createSignal<string>("1");
  const [selectedOriginIcao, setSelectedOriginIcao] = createSignal<string>("LTFM");
  const [selectedDestIcao, setSelectedDestIcao] = createSignal<string>("LTFJ");
  const [payloadType, setPayloadType] = createSignal<"passenger" | "cargo">("passenger");
  const [payloadAmount, setPayloadAmount] = createSignal<number>(85);
  const [fuelPercent, setFuelPercent] = createSignal<number>(75);
  const [customReward, setCustomReward] = createSignal<number>(12500);
  const [isLaunching, setIsLaunching] = createSignal<boolean>(false);

  const loadData = async () => {
    // 1. Load Saved Scenarios
    const saved = await CustomScenarioEngine.getSavedScenarios();
    setSavedScenarios(saved);

    // 2. Load GeoFS Runways
    const runways = getGeoFSRunways();
    setAllRunways(runways);

    if (runways.length > 0) {
      setSelectedOriginIcao(runways[0].icao);
      if (runways.length > 1) setSelectedDestIcao(runways[1].icao);
      else setSelectedDestIcao(runways[0].icao);
    }

    // 3. Load GeoFS Aircraft
    const geofs = (unsafeWindow as any).geofs;
    const acs: { id: string; name: string }[] = [];
    if (geofs?.aircraftList && typeof geofs.aircraftList === "object") {
      for (const [id, ac] of Object.entries(geofs.aircraftList)) {
        acs.push({
          id,
          name: (ac as any)?.name || `Aircraft #${id}`,
        });
      }
    }
    if (acs.length === 0) {
      const curId = String(geofs?.aircraft?.instance?.id || "1");
      const curName = geofs?.aircraft?.instance?.definition?.name || "Standard Aircraft";
      acs.push({ id: curId, name: curName });
    }
    setAircraftList(acs);
    setSelectedAircraftId(acs[0]?.id || "1");
  };

  onMount(() => {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs && typeof geofs.pause === "function") geofs.pause(true);
    loadData();
  });

  onCleanup(() => {
    const geofs = (unsafeWindow as any).geofs;
    if (geofs && typeof geofs.pause === "function") geofs.pause(false);
  });

  const getOriginAirport = (): AirportInfo => {
    const rws = allRunways();
    const found = rws.find((r) => r.icao === selectedOriginIcao());
    if (found) return found;
    return (
      rws[0] || {
        icao: selectedOriginIcao(),
        name: "Origin Airport",
        lat: 41.2753,
        lon: 28.7519,
        elevationFt: 300,
      }
    );
  };

  const getDestAirport = (): AirportInfo => {
    const rws = allRunways();
    const found = rws.find((r) => r.icao === selectedDestIcao());
    if (found) return found;
    return (
      rws[1] || {
        icao: selectedDestIcao(),
        name: "Destination Airport",
        lat: 40.8986,
        lon: 29.3092,
        elevationFt: 312,
      }
    );
  };

  const getSelectedAircraftName = (): string => {
    const found = aircraftList().find((a) => a.id === selectedAircraftId());
    return found?.name || `Aircraft #${selectedAircraftId()}`;
  };

  const calculatedDistance = () => {
    const orig = getOriginAirport();
    const dest = getDestAirport();
    return calculateDistanceNm(orig.lat, orig.lon, dest.lat, dest.lon);
  };

  const handleSave = async () => {
    const name = scenarioName().trim() || "Untitled Custom Flight";
    const orig = getOriginAirport();
    const dest = getDestAirport();

    const scenario: CustomScenario = {
      id: editingId() || `sc_${Date.now()}`,
      name,
      aircraftId: selectedAircraftId(),
      aircraftName: getSelectedAircraftName(),
      originAirport: orig,
      destinationAirport: dest,
      fuelPercent: fuelPercent(),
      payload: {
        type: payloadType(),
        amount: payloadAmount(),
        maxCapacity: payloadAmount(),
      },
      customReward: customReward(),
      createdAt: Date.now(),
    };

    await CustomScenarioEngine.saveScenario(scenario);
    Notify.successNow(`Scenario "${name}" saved!`);
    setEditingId(null);
    const updated = await CustomScenarioEngine.getSavedScenarios();
    setSavedScenarios(updated);
  };

  const handleLoadScenarioIntoEditor = (sc: CustomScenario) => {
    setEditingId(sc.id);
    setScenarioName(sc.name);
    setSelectedAircraftId(String(sc.aircraftId));
    setSelectedOriginIcao(sc.originAirport.icao);
    setSelectedDestIcao(sc.destinationAirport.icao);
    setPayloadType(sc.payload.type);
    setPayloadAmount(sc.payload.amount);
    setFuelPercent(sc.fuelPercent);
    setCustomReward(sc.customReward);
    Notify.infoNow(`Loaded "${sc.name}" into editor`);
  };

  const handleDeleteScenario = async (id: string, e: MouseEvent) => {
    e.stopPropagation();
    await CustomScenarioEngine.deleteScenario(id);
    const updated = await CustomScenarioEngine.getSavedScenarios();
    setSavedScenarios(updated);
    Notify.infoNow("Scenario removed");
  };

  const handleLaunchCurrent = async () => {
    setIsLaunching(true);
    const name = scenarioName().trim() || "Custom Flight";
    const orig = getOriginAirport();
    const dest = getDestAirport();

    const scenario: CustomScenario = {
      id: editingId() || `sc_${Date.now()}`,
      name,
      aircraftId: selectedAircraftId(),
      aircraftName: getSelectedAircraftName(),
      originAirport: orig,
      destinationAirport: dest,
      fuelPercent: fuelPercent(),
      payload: {
        type: payloadType(),
        amount: payloadAmount(),
        maxCapacity: payloadAmount(),
      },
      customReward: customReward(),
      createdAt: Date.now(),
    };

    const success = await CustomScenarioEngine.launchCustomScenario(
      scenario,
      () => {
        Notify.success(`Custom flight "${name}" started! Fly to ${dest.icao}`, "Custom Operations");
        props.onScenarioLaunched?.();
        props.onClose();
      },
      () => {
        setIsLaunching(false);
      }
    );

    if (!success) setIsLaunching(false);
  };

  const handleDirectLaunchScenario = async (sc: CustomScenario, e: MouseEvent) => {
    e.stopPropagation();
    setIsLaunching(true);
    const success = await CustomScenarioEngine.launchCustomScenario(
      sc,
      () => {
        Notify.success(`Custom flight "${sc.name}" started! Fly to ${sc.destinationAirport.icao}`, "Custom Operations");
        props.onScenarioLaunched?.();
        props.onClose();
      },
      () => {
        setIsLaunching(false);
      }
    );
    if (!success) setIsLaunching(false);
  };

  return (
    <div class="fixed inset-0 z-[999999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn font-sans select-none text-gray-100">
      <div class="relative w-full max-w-6xl h-[90vh] bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div class="flex items-center justify-between px-6 py-4 bg-gray-800/90 border-b border-gray-700/80">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-700 flex items-center justify-center text-xl shadow-lg shadow-indigo-900/40">
              🛠️
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-black tracking-wide text-white">Custom Flight Scenario Builder</h2>
                <span class="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-indigo-900/60 text-indigo-400 border border-indigo-700/50">
                  Mission Editor
                </span>
              </div>
              <p class="text-xs text-gray-400">
                Design, customize, save and launch your own flight contracts & charter operations
              </p>
            </div>
          </div>

          <button
            onClick={props.onClose}
            class="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white border border-gray-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Editor Body Grid: Left = Form, Right = Saved Library */}
        <div class="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left: Scenario Configuration Parameters (7 cols) */}
          <div class="lg:col-span-7 p-6 overflow-y-auto custom-scrollbar border-r border-gray-700/60 space-y-4">
            
            {/* Scenario Name */}
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-300">Scenario Title</label>
              <input
                type="text"
                value={scenarioName()}
                onInput={(e) => setScenarioName(e.currentTarget.value)}
                placeholder="e.g. Executive VIP Shuttle, Cargo Haul..."
                class="w-full px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Aircraft Selection */}
            <div class="space-y-1">
              <label class="text-xs font-bold text-gray-300">Selected Aircraft Model</label>
              <select
                value={selectedAircraftId()}
                onChange={(e) => setSelectedAircraftId(e.currentTarget.value)}
                class="w-full px-3 py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <For each={aircraftList()}>
                  {(ac) => <option value={ac.id}>{ac.name}</option>}
                </For>
              </select>
            </div>

            {/* Origin & Destination Airfields */}
            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="text-xs font-bold text-emerald-400">Departure Airport (Runway Threshold)</label>
                <select
                  value={selectedOriginIcao()}
                  onChange={(e) => setSelectedOriginIcao(e.currentTarget.value)}
                  class="w-full px-3 py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                >
                  <For each={allRunways()}>
                    {(rw) => (
                      <option value={rw.icao}>
                        {rw.icao} - {rw.name} ({rw.elevationFt}ft)
                      </option>
                    )}
                  </For>
                </select>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-bold text-cyan-400">Destination Airport (Target)</label>
                <select
                  value={selectedDestIcao()}
                  onChange={(e) => setSelectedDestIcao(e.currentTarget.value)}
                  class="w-full px-3 py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 font-mono font-bold"
                >
                  <For each={allRunways()}>
                    {(rw) => (
                      <option value={rw.icao}>
                        {rw.icao} - {rw.name} ({rw.elevationFt}ft)
                      </option>
                    )}
                  </For>
                </select>
              </div>
            </div>

            {/* Route Distance Badge */}
            <div class="p-3 bg-gray-800/60 rounded-xl border border-gray-700/50 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-base">📏</span>
                <span class="text-xs text-gray-300 font-medium">Calculated Flight Distance:</span>
              </div>
              <span class="text-sm font-black text-indigo-400 font-mono">{calculatedDistance()} NM</span>
            </div>

            {/* Payload Settings (Passengers or Cargo) */}
            <div class="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-300">Payload Type</label>
                <div class="flex rounded-lg overflow-hidden border border-gray-700">
                  <button
                    onClick={() => {
                      setPayloadType("passenger");
                      setPayloadAmount(85);
                    }}
                    class={`px-3 py-1 text-xs font-bold transition-colors ${
                      payloadType() === "passenger" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    👥 Passengers
                  </button>
                  <button
                    onClick={() => {
                      setPayloadType("cargo");
                      setPayloadAmount(5500);
                    }}
                    class={`px-3 py-1 text-xs font-bold transition-colors ${
                      payloadType() === "cargo" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    📦 Air Cargo
                  </button>
                </div>
              </div>

              <Input
                type="range"
                name="payload_amount"
                min={payloadType() === "passenger" ? 1 : 100}
                max={payloadType() === "passenger" ? 450 : 60000}
                step={payloadType() === "passenger" ? 1 : 100}
                unit={payloadType() === "passenger" ? "Pax" : "kg"}
                label={payloadType() === "passenger" ? "Passenger Count" : "Cargo Weight"}
                value={payloadAmount()}
                onChange={(v: number) => setPayloadAmount(v)}
                notifyMode="none"
              />
            </div>

            {/* Fuel & Contract Reward */}
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                <Input
                  type="range"
                  name="fuel_percent"
                  min={10}
                  max={100}
                  step={5}
                  unit="%"
                  label="Initial Fuel"
                  value={fuelPercent()}
                  onChange={(v: number) => setFuelPercent(v)}
                  notifyMode="none"
                />
              </div>

              <div class="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 space-y-1">
                <label class="text-xs font-bold text-emerald-400">Custom Contract Reward ($)</label>
                <input
                  type="number"
                  min={500}
                  max={500000}
                  step={500}
                  value={customReward()}
                  onInput={(e) => setCustomReward(Number(e.currentTarget.value) || 1000)}
                  class="w-full px-3 py-1.5 text-sm bg-gray-900 border border-gray-700 rounded-lg text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div class="flex items-center gap-3 pt-2">
              <button
                onClick={handleSave}
                class="flex-1 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs border border-gray-600 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
              >
                <span>💾</span>
                <span>{editingId() ? "Update Saved Scenario" : "Save Scenario"}</span>
              </button>

              <button
                onClick={handleLaunchCurrent}
                disabled={isLaunching()}
                class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-emerald-950/60 disabled:opacity-50"
              >
                <Show when={isLaunching()} fallback={<><span>🚀</span><span>Launch Flight Now</span></>}>
                  <span class="animate-spin">🔄</span>
                  <span>Spawning Aircraft on Runway...</span>
                </Show>
              </button>
            </div>

          </div>

          {/* Right: Saved Scenarios Library (5 cols) */}
          <div class="lg:col-span-5 p-6 bg-gray-950/40 flex flex-col overflow-hidden">
            <div class="flex items-center justify-between pb-3 mb-4 border-b border-gray-800">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-white">Saved Scenarios Library</h3>
                <span class="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-indigo-900/60 text-indigo-400 border border-indigo-700/40">
                  {savedScenarios().length}
                </span>
              </div>
              <Show when={editingId()}>
                <button
                  onClick={() => {
                    setEditingId(null);
                    setScenarioName("Custom Charter Flight");
                  }}
                  class="text-[10px] text-gray-400 hover:text-white underline"
                >
                  + New Blank
                </button>
              </Show>
            </div>

            <div class="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
              <Show
                when={savedScenarios().length > 0}
                fallback={
                  <div class="flex flex-col items-center justify-center h-48 text-gray-500 text-xs text-center p-4">
                    <span class="text-3xl mb-2">📁</span>
                    <span>No saved scenarios yet. Configure parameters on the left and click "Save Scenario"!</span>
                  </div>
                }
              >
                <For each={savedScenarios()}>
                  {(sc) => (
                    <div
                      onClick={() => handleLoadScenarioIntoEditor(sc)}
                      class="p-3 bg-gray-900/80 hover:bg-gray-850 border border-gray-800 hover:border-indigo-500/50 rounded-xl transition-all cursor-pointer group shadow-md"
                    >
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="font-bold text-xs text-white group-hover:text-indigo-400 transition-colors truncate max-w-[180px]">
                          {sc.name}
                        </span>
                        <span class="text-xs font-black text-emerald-400 font-mono">
                          ${sc.customReward.toLocaleString()}
                        </span>
                      </div>

                      <div class="flex items-center justify-between text-[11px] text-gray-400 font-mono bg-gray-950/60 px-2 py-1 rounded mb-2">
                        <span class="text-emerald-400 font-bold">{sc.originAirport.icao}</span>
                        <span>➔</span>
                        <span class="text-cyan-400 font-bold">{sc.destinationAirport.icao}</span>
                        <span class="text-gray-500 text-[10px]">
                          {calculateDistanceNm(sc.originAirport.lat, sc.originAirport.lon, sc.destinationAirport.lat, sc.destinationAirport.lon)} NM
                        </span>
                      </div>

                      <div class="flex items-center justify-between text-[10px] text-gray-400">
                        <span class="truncate max-w-[140px]">✈️ {sc.aircraftName}</span>
                        <span>{sc.payload.type === "passenger" ? `👥 ${sc.payload.amount} Pax` : `📦 ${sc.payload.amount} kg`}</span>
                      </div>

                      <div class="flex items-center gap-2 mt-2 pt-2 border-t border-gray-800">
                        <button
                          onClick={(e) => handleDirectLaunchScenario(sc, e)}
                          class="flex-1 py-1 px-2 rounded bg-emerald-700/80 hover:bg-emerald-600 text-white text-[10px] font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <span>🚀</span>
                          <span>Quick Launch</span>
                        </button>
                        <button
                          onClick={(e) => handleDeleteScenario(sc.id, e)}
                          class="p-1 px-2 rounded bg-red-900/40 hover:bg-red-800/70 text-red-300 text-[10px] transition-colors"
                          title="Delete scenario"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </For>
              </Show>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
