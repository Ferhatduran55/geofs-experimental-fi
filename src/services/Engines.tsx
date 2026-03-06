import Logger from "../classes/Logger";
import Notify from "../classes/Notify";
import Props from "../classes/Props";
import Input from "../components/Input";
import { ExpandMore } from "../assets/icons";

const log = Logger.create("Engines");
const engineInputRefs = new Map<string, Map<string, any>>();

export const resetEngines = () => {
  if (engineInputRefs.size === 0) {
    Notify.errorNow("No engines to reset");
    return;
  }

  let resetCount = 0;
  engineInputRefs.forEach((propsMap) => {
    propsMap.forEach((ref) => {
      if (ref && typeof ref.reset === 'function') {
        ref.reset();
        resetCount++;
      }
    });
  });
  
  if (resetCount > 0) {
    log.info(`Reset ${resetCount} engine properties to defaults`);
    Notify.successNow(`${resetCount} engine properties reset to defaults`);
  } else {
    Notify.errorNow("No engine properties to reset");
  }
};

export default async () => {
  return await new Promise((resolve, reject) => {
    try {
      const { allowed, ignored, reset } = (Props as any).Engines;
      const engines = (unsafeWindow as any).geofs?.aircraft?.instance?.engines;
      if (!engines) throw new Error("No engines found.");

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

        const engineInputs: any[] = [];

        for (const item of Object.entries(currentEngine)) {
          const [propName, prop]: ServiceItem = item;
          const propType = typeof prop;

          if (ignored.includes(propType)) continue;

          const isAllowed = allowed.some((p: any) => p.name === propName);
          if (!isAllowed) continue;

          const syncType = allowed.find((p: any) => p.name === propName).type;
          if (!syncType) continue;

          const hasComment = allowed.find((p: any) => p.name === propName)?.comment;

          engineInputs.push(
            <li class="flex gap-2">
              <Input
                name={propName}
                type={syncType}
                comment={hasComment}
                resource={currentEngine}
                ref={(el: any) => {
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
              <ul class="flex flex-col gap-4 pl-2 mt-2">
                {engineInputs}
              </ul>
            </article>
          </details>
        );
      }

      log.debug(`Loaded ${engines.length} engines`);
      resolve(response);
    } catch (e) {
      log.error("Failed to load engines:", e);
      reject(e);
    }
  });
};
