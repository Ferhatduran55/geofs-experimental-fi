import { createSignal, onMount, onCleanup, For, Show } from "solid-js";
import CustomScenarioEngine, { type CustomScenario } from "../CustomScenarioEngine";
import {
  getGeoFSRunways,
  calculateDistanceNm,
  calculateBearingDeg,
  formatBearingWithCompass,
  findNearestAirport,
  type AirportInfo,
} from "../AirportDatabase";
import Notify from "../../../shared/Notify";
import Input from "../../../components/Input";
import {
  getAircraftTransportPreset,
  type AircraftTransportPreset,
} from "../../../assets/json/AircraftTransportDefs";
import { getAircraftFuelPreset } from "../../../assets/json/AircraftFuelDefs";

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
  const [originSearchTerm, setOriginSearchTerm] = createSignal<string>("");
  const [destSearchTerm, setDestSearchTerm] = createSignal<string>("");
  const [destDistFilter, setDestDistFilter] = createSignal<string>("all");
  const [payloadType, setPayloadType] = createSignal<"passenger" | "cargo">("passenger");
  const [payloadAmount, setPayloadAmount] = createSignal<number>(85);
  const [fuelPercent, setFuelPercent] = createSignal<number>(75);
  const [fuelGallons, setFuelGallons] = createSignal<number>(42);
  const [customReward, setCustomReward] = createSignal<number>(12500);
  const [isLaunching, setIsLaunching] = createSignal<boolean>(false);

  const loadData = async () => {
    // 1. Load Saved Scenarios
    const saved = await CustomScenarioEngine.getSavedScenarios();
    setSavedScenarios(saved);

    // 2. Load GeoFS Runways
    const runways = getGeoFSRunways();
    setAllRunways(runways);

    const geofs = (unsafeWindow as any).geofs;
    if (geofs?.aircraft?.instance?.llaLocation) {
      const loc = geofs.aircraft.instance.llaLocation;
      const nearest = findNearestAirport(loc[0], loc[1]);
      if (nearest?.icao) {
        setSelectedOriginIcao(nearest.icao);
        const nextDest = runways.find((r) => r.icao !== nearest.icao);
        if (nextDest) setSelectedDestIcao(nextDest.icao);
      }
    } else if (runways.length > 0) {
      setSelectedOriginIcao(runways[0].icao);
      if (runways.length > 1) setSelectedDestIcao(runways[1].icao);
      else setSelectedDestIcao(runways[0].icao);
    }

    // 3. Load GeoFS Aircraft
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
    const activeAircraftId = String(geofs?.aircraft?.instance?.id || acs[0]?.id || "1");
    setSelectedAircraftId(activeAircraftId);
    const cap = getAircraftFuelPreset(activeAircraftId).capacityGal;
    setFuelGallons(Math.round((cap * fuelPercent()) / 100));
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

  const selectedPreset = (): AircraftTransportPreset => {
    return getAircraftTransportPreset(selectedAircraftId());
  };

  const calculatedDistance = (): number => {
    const orig = getOriginAirport();
    const dest = getDestAirport();
    return Math.round(calculateDistanceNm(orig.lat, orig.lon, dest.lat, dest.lon));
  };

  const calculatedBearing = (): number => {
    const orig = getOriginAirport();
    const dest = getDestAirport();
    return calculateBearingDeg(orig.lat, orig.lon, dest.lat, dest.lon);
  };

  const calculatedBearingFormatted = (): string => {
    return formatBearingWithCompass(calculatedBearing());
  };

  const rangeUtilizationPercent = (): number => {
    const dist = calculatedDistance();
    const maxR = Math.max(1, selectedPreset().maxRangeNm);
    return Math.min(100, Math.round((dist / maxR) * 100));
  };

  const fuelCapacityGal = (): number => {
    return getAircraftFuelPreset(selectedAircraftId()).capacityGal || 50;
  };

  const handleFuelPercentChange = (pct: number) => {
    const clampedPct = Math.max(5, Math.min(100, pct));
    setFuelPercent(clampedPct);
    const gal = Math.round((fuelCapacityGal() * clampedPct) / 100);
    setFuelGallons(gal);
  };

  const handleFuelGallonsChange = (gal: number) => {
    const cap = fuelCapacityGal();
    const clampedGal = Math.max(1, Math.min(cap, gal));
    setFuelGallons(clampedGal);
    const pct = Math.round((clampedGal / Math.max(1, cap)) * 100);
    setFuelPercent(pct);
  };

  const handleUseNearestOrigin = () => {
    const geofs = (unsafeWindow as any).geofs;
    const loc = geofs?.aircraft?.instance?.llaLocation;
    if (loc) {
      const nearest = findNearestAirport(loc[0], loc[1]);
      if (nearest?.icao) {
        setSelectedOriginIcao(nearest.icao);
        Notify.infoNow(`Kalkış meydanı ayarlandı: ${nearest.icao} (${nearest.name || "Runway"})`);
      }
    } else {
      Notify.warningNow("Uçak konumu hazır değil.");
    }
  };

  const filteredOriginRunways = () => {
    const q = originSearchTerm().trim().toLowerCase();
    const list = allRunways();
    if (!q) return list.slice(0, 150);
    return list
      .filter(
        (r) =>
          r.icao.toLowerCase().includes(q) ||
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.city && r.city.toLowerCase().includes(q)) ||
          (r.country && r.country.toLowerCase().includes(q))
      )
      .slice(0, 150);
  };

  const filteredDestRunways = () => {
    const orig = getOriginAirport();
    const q = destSearchTerm().trim().toLowerCase();
    const filter = destDistFilter();

    let list = allRunways()
      .filter((r) => r.icao !== orig.icao)
      .map((r) => {
        const dist = calculateDistanceNm(orig.lat, orig.lon, r.lat, r.lon);
        const brg = calculateBearingDeg(orig.lat, orig.lon, r.lat, r.lon);
        return {
          ...r,
          distFromOrigin: dist,
          bearingFromOrigin: brg,
          bearingStr: formatBearingWithCompass(brg),
        };
      });

    if (q) {
      list = list.filter(
        (r) =>
          r.icao.toLowerCase().includes(q) ||
          (r.name && r.name.toLowerCase().includes(q)) ||
          (r.city && r.city.toLowerCase().includes(q)) ||
          (r.country && r.country.toLowerCase().includes(q))
      );
    }

    if (filter === "near") {
      list = list.filter((r) => r.distFromOrigin <= 150);
    } else if (filter === "medium") {
      list = list.filter((r) => r.distFromOrigin > 150 && r.distFromOrigin <= 600);
    } else if (filter === "long") {
      list = list.filter((r) => r.distFromOrigin > 600);
    } else if (filter === "inRange") {
      const maxR = selectedPreset().maxRangeNm;
      list = list.filter((r) => r.distFromOrigin <= maxR);
    }

    list.sort((a, b) => a.distFromOrigin - b.distFromOrigin);
    return list.slice(0, 150);
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
    const cap = getAircraftFuelPreset(sc.aircraftId).capacityGal;
    setFuelGallons(Math.round((cap * sc.fuelPercent) / 100));
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
            <div class="space-y-1.5">
              <label class="text-xs font-bold text-gray-300">Selected Aircraft Model</label>
              <select
                value={selectedAircraftId()}
                onChange={(e) => {
                  const newId = e.currentTarget.value;
                  setSelectedAircraftId(newId);
                  const preset = getAircraftTransportPreset(newId);
                  const maxVal = payloadType() === "passenger" ? (preset.maxPassengers || 1) : (preset.maxCargoKg || 100);
                  if (payloadAmount() > maxVal) {
                    setPayloadAmount(maxVal);
                  }
                }}
                class="w-full px-3 py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <For each={aircraftList()}>
                  {(ac) => <option value={ac.id}>{ac.name}</option>}
                </For>
              </select>

              {/* Dynamic Specs Bar for Selected Aircraft */}
              <div class="flex flex-wrap items-center justify-between p-2.5 bg-indigo-950/40 rounded-lg border border-indigo-800/40 text-[11px] text-gray-300 font-mono">
                <span class="font-bold text-indigo-300">{selectedPreset().category}</span>
                <span>📏 Range: <b class="text-indigo-400">{selectedPreset().maxRangeNm} NM</b></span>
                <span>⚡ Cruise: <b class="text-indigo-400">{selectedPreset().cruiseSpeedKts} kts</b></span>
                <span>👥 Max: <b class="text-indigo-400">{selectedPreset().maxPassengers} Pax</b></span>
                <span>📦 Max: <b class="text-indigo-400">{selectedPreset().maxCargoKg.toLocaleString()} kg</b></span>
              </div>
            </div>

            {/* Origin & Destination Airfields */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Departure Airfield */}
              <div class="p-3.5 bg-gray-800/60 rounded-xl border border-emerald-500/30 space-y-2.5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm">🛫</span>
                    <label class="text-xs font-bold text-emerald-400">Kalkış Meydanı (Departure)</label>
                  </div>
                  <button
                    type="button"
                    onClick={handleUseNearestOrigin}
                    class="px-2 py-0.5 text-[10px] bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50 rounded transition-colors"
                    title="Uçağın şu an bulunduğu en yakın piste ayarla"
                  >
                    📍 Konumumu Kullan
                  </button>
                </div>

                {/* Selected Departure Airport Card */}
                <div class="p-2.5 bg-gray-900/80 rounded-lg border border-gray-700/60 flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 text-xs font-black font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/40">
                        {getOriginAirport().icao}
                      </span>
                      <span class="text-xs font-bold text-white truncate">
                        {getOriginAirport().name || "Airfield Runway"}
                      </span>
                    </div>
                    <div class="text-[11px] text-gray-400 mt-1 truncate">
                      {[getOriginAirport().city, getOriginAirport().country].filter(Boolean).join(", ") || "GeoFS Runway Coordinates"}
                    </div>
                    <div class="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-gray-400 font-mono">
                      <span>⛰️ {getOriginAirport().elevationFt} ft</span>
                      <Show when={getOriginAirport().runwayHeading}>
                        <span>🧭 {getOriginAirport().runwayHeading}</span>
                      </Show>
                      <Show when={getOriginAirport().lengthFeet}>
                        <span>📏 {getOriginAirport().lengthFeet?.toLocaleString()} ft Pist</span>
                      </Show>
                    </div>
                  </div>
                </div>

                {/* Search Input */}
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Meydan kodu (ICAO), isim veya şehir ara..."
                    value={originSearchTerm()}
                    onInput={(e) => setOriginSearchTerm(e.currentTarget.value)}
                    class="w-full px-2.5 py-1.5 pl-7 text-xs bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                  />
                  <span class="absolute left-2 top-2 text-[10px] text-gray-500">🔍</span>
                </div>

                {/* Airport Selector */}
                <select
                  value={selectedOriginIcao()}
                  onChange={(e) => setSelectedOriginIcao(e.currentTarget.value)}
                  class="w-full px-2.5 py-2 text-xs bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <For each={filteredOriginRunways()}>
                    {(rw) => (
                      <option value={rw.icao}>
                        {rw.icao} - {rw.name || "Runway"} {rw.city ? `(${rw.city})` : ""} • {rw.elevationFt}ft {rw.lengthFeet ? `• ${rw.lengthFeet.toLocaleString()}ft` : ""}
                      </option>
                    )}
                  </For>
                </select>
              </div>

              {/* Destination Airfield */}
              <div class="p-3.5 bg-gray-800/60 rounded-xl border border-cyan-500/30 space-y-2.5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-1.5">
                    <span class="text-sm">🛬</span>
                    <label class="text-xs font-bold text-cyan-400">Varış Meydanı (Destination)</label>
                  </div>
                  <span class="text-[10px] text-cyan-300 font-mono font-bold">
                    {calculatedDistance()} NM Rota
                  </span>
                </div>

                {/* Selected Destination Airport Card */}
                <div class="p-2.5 bg-gray-900/80 rounded-lg border border-gray-700/60 flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="px-2 py-0.5 text-xs font-black font-mono bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/40">
                        {getDestAirport().icao}
                      </span>
                      <span class="text-xs font-bold text-white truncate">
                        {getDestAirport().name || "Airfield Runway"}
                      </span>
                    </div>
                    <div class="text-[11px] text-gray-400 mt-1 truncate">
                      {[getDestAirport().city, getDestAirport().country].filter(Boolean).join(", ") || "GeoFS Runway Coordinates"}
                    </div>
                    <div class="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-gray-400 font-mono">
                      <span class="text-cyan-400 font-bold">📏 {calculatedDistance()} NM</span>
                      <span>🧭 {calculatedBearingFormatted()}</span>
                      <span>⛰️ {getDestAirport().elevationFt} ft</span>
                      <Show when={getDestAirport().lengthFeet}>
                        <span>📏 {getDestAirport().lengthFeet?.toLocaleString()} ft Pist</span>
                      </Show>
                    </div>
                  </div>
                </div>

                {/* Search & Distance Filters */}
                <div class="space-y-1.5">
                  <div class="relative">
                    <input
                      type="text"
                      placeholder="Varış ICAO, meydan adı veya şehir ara..."
                      value={destSearchTerm()}
                      onInput={(e) => setDestSearchTerm(e.currentTarget.value)}
                      class="w-full px-2.5 py-1.5 pl-7 text-xs bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
                    />
                    <span class="absolute left-2 top-2 text-[10px] text-gray-500">🔍</span>
                  </div>

                  {/* Distance Filter Chips */}
                  <div class="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
                    <button
                      type="button"
                      onClick={() => setDestDistFilter("all")}
                      class={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                        destDistFilter() === "all" ? "bg-cyan-600 text-white font-bold" : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      Tümü
                    </button>
                    <button
                      type="button"
                      onClick={() => setDestDistFilter("near")}
                      class={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                        destDistFilter() === "near" ? "bg-cyan-600 text-white font-bold" : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      &lt; 150 NM
                    </button>
                    <button
                      type="button"
                      onClick={() => setDestDistFilter("medium")}
                      class={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                        destDistFilter() === "medium" ? "bg-cyan-600 text-white font-bold" : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      150 - 600 NM
                    </button>
                    <button
                      type="button"
                      onClick={() => setDestDistFilter("long")}
                      class={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                        destDistFilter() === "long" ? "bg-cyan-600 text-white font-bold" : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      &gt; 600 NM
                    </button>
                    <button
                      type="button"
                      onClick={() => setDestDistFilter("inRange")}
                      class={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                        destDistFilter() === "inRange" ? "bg-cyan-600 text-white font-bold" : "bg-gray-800 text-cyan-400 border border-cyan-800/40 hover:text-white"
                      }`}
                      title={`Uçağın azami menzili (${selectedPreset().maxRangeNm} NM) içindeki meydanlar`}
                    >
                      ✓ Menzil İçi
                    </button>
                  </div>
                </div>

                {/* Destination Dropdown */}
                <select
                  value={selectedDestIcao()}
                  onChange={(e) => setSelectedDestIcao(e.currentTarget.value)}
                  class="w-full px-2.5 py-2 text-xs bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <For each={filteredDestRunways()}>
                    {(rw: any) => (
                      <option value={rw.icao}>
                        {rw.icao} - {rw.name || "Runway"} • {rw.distFromOrigin} NM {rw.bearingStr ? `• ${rw.bearingStr}` : ""} {rw.lengthFeet ? `• ${rw.lengthFeet.toLocaleString()}ft` : ""}
                      </option>
                    )}
                  </For>
                </select>
              </div>
            </div>

            {/* Flight Route vs Aircraft Capability Analysis Card */}
            <div class="p-4 bg-gray-800/60 rounded-xl border border-indigo-500/30 space-y-3 shadow-inner">
              <div class="flex items-center justify-between border-b border-gray-700/60 pb-2.5">
                <div class="flex items-center gap-2">
                  <span class="text-base">🗺️</span>
                  <div>
                    <span class="text-xs font-bold text-white block">Uçuş Rotası ve Performans Analizi</span>
                    <span class="text-[10px] text-gray-400">
                      {getOriginAirport().icao} ➔ {getDestAirport().icao}
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400 block font-mono">Tahmini Süre</span>
                  <span class="text-xs font-bold text-indigo-300 font-mono">
                    ~{Math.max(1, Math.round((calculatedDistance() / Math.max(50, selectedPreset().cruiseSpeedKts)) * 60))} dk (@ {selectedPreset().cruiseSpeedKts} kts)
                  </span>
                </div>
              </div>

              {/* Grid: Route Distance vs Aircraft Max Range */}
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
                <div class="p-2 bg-gray-900/70 rounded-lg border border-gray-700/50">
                  <span class="text-[10px] text-gray-400 block">Rota Uçuş Mesafesi</span>
                  <span class="text-sm font-black text-emerald-400">{calculatedDistance()} NM</span>
                </div>
                <div class="p-2 bg-gray-900/70 rounded-lg border border-gray-700/50">
                  <span class="text-[10px] text-gray-400 block">Uçağın Azami Menzili</span>
                  <span class="text-sm font-black text-cyan-400">{selectedPreset().maxRangeNm.toLocaleString()} NM</span>
                </div>
                <div class="p-2 bg-gray-900/70 rounded-lg border border-gray-700/50">
                  <span class="text-[10px] text-gray-400 block">Kalkış Başlığı</span>
                  <span class="text-sm font-bold text-amber-300">{calculatedBearingFormatted()}</span>
                </div>
                <div class="p-2 bg-gray-900/70 rounded-lg border border-gray-700/50">
                  <span class="text-[10px] text-gray-400 block">Seyir Sürati</span>
                  <span class="text-sm font-bold text-indigo-300">{selectedPreset().cruiseSpeedKts} kts</span>
                </div>
              </div>

              {/* Visual Range Utilization Bar */}
              <div class="space-y-1.5 pt-1">
                <div class="flex items-center justify-between text-[11px] font-mono">
                  <span class="text-gray-300">
                    Uçak Menzil Kullanımı: <b class={calculatedDistance() <= selectedPreset().maxRangeNm ? "text-emerald-400" : "text-rose-400"}>
                      %{rangeUtilizationPercent()}
                    </b>
                  </span>
                  <span class="text-gray-400 text-[10px]">
                    {calculatedDistance()} NM / {selectedPreset().maxRangeNm.toLocaleString()} NM
                  </span>
                </div>

                <div class="w-full h-2.5 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                  <div
                    class={`h-full rounded-full transition-all duration-300 ${
                      calculatedDistance() <= selectedPreset().maxRangeNm
                        ? "bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500"
                        : "bg-rose-500"
                    }`}
                    style={{ width: `${Math.min(100, Math.max(2, rangeUtilizationPercent()))}%` }}
                  />
                </div>

                <div class="text-[10px] text-gray-400 italic">
                  <Show
                    when={calculatedDistance() <= selectedPreset().maxRangeNm}
                    fallback={
                      <span class="text-amber-300 font-bold">
                        ⚠️ Dikkat: Rota mesafesi ({calculatedDistance()} NM), {selectedPreset().name} uçağının azami menzilini ({selectedPreset().maxRangeNm} NM) aşıyor! Uçuş için havada yakıt ikmali gerekir.
                      </span>
                    }
                  >
                    <span>
                      ℹ️ Rota mesafesi ({calculatedDistance()} NM), {selectedPreset().name} azami menzilinin ({selectedPreset().maxRangeNm.toLocaleString()} NM) yalnızca %{rangeUtilizationPercent()}'ini kapsamaktadır.
                    </span>
                  </Show>
                </div>
              </div>
            </div>

            {/* Payload Settings (Passengers or Cargo) */}
            <div class="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-xs font-bold text-gray-300">Payload Type</label>
                <div class="flex rounded-lg overflow-hidden border border-gray-700">
                  <button
                    onClick={() => {
                      setPayloadType("passenger");
                      const maxP = selectedPreset().maxPassengers || 1;
                      setPayloadAmount(Math.min(payloadAmount(), maxP));
                    }}
                    class={`px-3 py-1 text-xs font-bold transition-colors ${
                      payloadType() === "passenger" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    👥 Passengers (Max {selectedPreset().maxPassengers})
                  </button>
                  <button
                    onClick={() => {
                      setPayloadType("cargo");
                      const maxC = selectedPreset().maxCargoKg || 100;
                      setPayloadAmount(Math.min(payloadAmount(), maxC));
                    }}
                    class={`px-3 py-1 text-xs font-bold transition-colors ${
                      payloadType() === "cargo" ? "bg-indigo-600 text-white" : "bg-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    📦 Air Cargo (Max {selectedPreset().maxCargoKg.toLocaleString()} kg)
                  </button>
                </div>
              </div>

              <Input
                type="range"
                name="payload_amount"
                min={payloadType() === "passenger" ? (selectedPreset().maxPassengers > 0 ? 1 : 0) : 25}
                max={
                  payloadType() === "passenger"
                    ? Math.max(1, selectedPreset().maxPassengers)
                    : Math.max(50, selectedPreset().maxCargoKg)
                }
                step={payloadType() === "passenger" ? 1 : 25}
                unit={payloadType() === "passenger" ? "Pax" : "kg"}
                label={payloadType() === "passenger" ? "Passenger Count" : "Cargo Weight"}
                value={payloadAmount()}
                onChange={(v: number) => setPayloadAmount(v)}
                notifyMode="none"
              />
            </div>

            {/* Fuel & Contract Reward */}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div class="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 space-y-2">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-bold text-gray-300">Initial Fuel</label>
                  <span class="text-[10px] font-mono text-cyan-400 font-bold">
                    Max: {fuelCapacityGal().toLocaleString()} Gal
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-2 items-center">
                  <div>
                    <Input
                      type="range"
                      name="fuel_percent"
                      min={5}
                      max={100}
                      step={5}
                      unit="%"
                      label="Percentage"
                      value={fuelPercent()}
                      onChange={(v: number) => handleFuelPercentChange(v)}
                      notifyMode="none"
                    />
                  </div>

                  <div class="space-y-1">
                    <label class="text-[10px] font-semibold text-gray-400">Fuel (Gallons)</label>
                    <div class="flex items-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={fuelCapacityGal()}
                        step={1}
                        value={fuelGallons()}
                        onInput={(e) => handleFuelGallonsChange(Number(e.currentTarget.value) || 1)}
                        class="w-full px-2.5 py-1.5 text-xs bg-gray-900 border border-gray-700 rounded-lg text-white font-mono font-bold focus:outline-none focus:border-indigo-500 text-right"
                      />
                      <span class="text-xs text-gray-400 font-mono">gal</span>
                    </div>
                  </div>
                </div>
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
