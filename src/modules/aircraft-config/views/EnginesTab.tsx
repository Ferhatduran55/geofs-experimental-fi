import Logger from "../../../shared/Logger";
import Notify from "../../../shared/Notify";
import Props from "../../../shared/Props";
import Input from "../../../components/Input";
import ExpandMore from "../../../assets/icons/ExpandMore";
import AircraftSetupStore from "../AircraftSetupStore";

const log = Logger.create("Engines");
const engineInputRefs = new Map<string, Map<string, InputRef>>();

export const resetEngines = () => {
  // 1. Restore the live in-memory engine properties directly from the captured factory setup
  const restoredCount = AircraftSetupStore.restoreEngines();

  // 2. Update all visible input references with the pristine default values
  let resetCount = 0;
  engineInputRefs.forEach((propsMap, engineKey) => {
    const engineIndex = parseInt(engineKey.replace("engine_", ""), 10) || 0;
    propsMap.forEach((ref, propName) => {
      if (ref && typeof ref.resetToDefault === "function") {
        const defaultVal = AircraftSetupStore.getEngineDefault(engineIndex, propName);
        ref.resetToDefault(defaultVal);
        resetCount++;
      } else if (ref && typeof ref.reset === "function") {
        ref.reset();
        resetCount++;
      }
    });
  });

  if (resetCount > 0 || restoredCount > 0) {
    const total = Math.max(resetCount, restoredCount);
    log.info(`Reset ${total} engine properties to factory defaults`);
    Notify.successNow(`${total} engine properties reset to default aircraft setup`);
  } else {
    Notify.errorNow("No engine properties to reset");
  }
};

export default async () => {
  return await new Promise((resolve) => {
    try {
      const engines = (unsafeWindow as any).geofs?.aircraft?.instance?.engines;
      if (!engines || !Array.isArray(engines) || !engines.length) {
        log.debug("No engines found yet, showing waiting placeholder.");
        resolve([
          <div class="p-6 text-center text-gray-400 dark:text-gray-500 font-sans space-y-2">
            <div class="text-3xl animate-bounce">⚙️</div>
            <p class="text-sm font-medium">Waiting for aircraft engines...</p>
            <p class="text-xs text-gray-500">Engine parameters will appear as soon as the aircraft is active.</p>
          </div>,
        ]);
        return;
      }

      const { allowed, ignored, reset } = (Props as any).Engines || { allowed: [], ignored: [], reset: false };
      engineInputRefs.clear();
      const response = [];

      for (let i = 0; i < engines.length; i++) {
        const engineName = engines[i].name || `Engine ${i + 1}`;
        const engineKey = `engine_${i}`;
        const currentEngine = engines[i];

        if (!engineInputRefs.has(engineKey)) {
          engineInputRefs.set(engineKey, new Map());
        }
        const currentEngineRefs = engineInputRefs.get(engineKey)!;
        const engineInputs = [];

        for (const item of Object.entries(currentEngine)) {
          const [propName, prop] = item;
          const propType = typeof prop;
          if (ignored.includes(propType)) continue;
          const isAllowed = allowed.some((p: any) => p.name === propName);
          if (!isAllowed) continue;
          const syncType = allowed.find((p: any) => p.name === propName)?.type;
          if (!syncType) continue;
          const hasComment = allowed.find((p: any) => p.name === propName)?.comment;

          engineInputs.push(
            <li class="flex gap-2">
              <Input
                name={propName}
                type={syncType}
                comment={hasComment}
                resource={`geofs.aircraft.instance.engines.${i}`}
                onChange={(val: number) => {
                  try {
                    const ac = (unsafeWindow as any).geofs?.aircraft?.instance;
                    if (!ac) return;
                    // 1. Live engine instance
                    if (ac.engines && ac.engines[i]) {
                      ac.engines[i][propName] = val;
                      if (ac.engines[i].definition) {
                        ac.engines[i].definition[propName] = val;
                      }
                    }
                    // 2. Aircraft definition engines
                    if (ac.definition?.engines && ac.definition.engines[i]) {
                      ac.definition.engines[i][propName] = val;
                    }
                    log.debug(`Engine ${i} ${propName} synced to ${val}`);
                  } catch (err) {
                    log.error(`Failed to sync engine ${i} ${propName}:`, err);
                  }
                }}
                ref={(el: InputRef) => {
                  if (reset && el) {
                    currentEngineRefs.set(propName, el);
                  }
                }}
              />
            </li>
          );
        }

        response.push(
          <details class="group/engine bg-gray-800/50 dark:bg-black/30 rounded-lg">
            <summary class="flex items-center justify-between gap-2 p-3 font-medium cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span class="flex gap-2 text-gray-900 dark:text-white">{engineName}</span>
              <ExpandMore class="w-5 h-5 text-gray-500 dark:text-gray-400 transition-transform duration-300 ease-in-out group-open/engine:rotate-180" />
            </summary>
            <article class="px-4 pb-4">
              <ul class="flex flex-col gap-4 pl-2 mt-2">{engineInputs}</ul>
            </article>
          </details>
        );
      }

      log.debug(`Loaded ${engines.length} engines`);
      resolve(response);
    } catch (e) {
      log.error("Failed to load engines:", e);
      resolve([
        <div class="p-4 text-center text-red-400 text-xs">
          Failed to load engines. Check console for details.
        </div>,
      ]);
    }
  });
};
