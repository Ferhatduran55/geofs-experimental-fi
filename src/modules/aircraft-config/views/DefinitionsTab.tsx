import Logger from "../../../shared/Logger";
import Notify from "../../../shared/Notify";
import Props from "../../../shared/Props";
import Input from "../../../components/Input";

const log = Logger.create("Definitions");
const inputRefs = new Map<string, InputRef>();

export const resetDefinitions = () => {
  if (inputRefs.size === 0) {
    Notify.errorNow("No definitions to reset");
    return;
  }
  let resetCount = 0;
  inputRefs.forEach((ref) => {
    if (ref && typeof ref.reset === "function") {
      ref.reset();
      resetCount++;
    }
  });
  if (resetCount > 0) {
    log.info(`Reset ${resetCount} definition properties to defaults`);
    Notify.successNow(`${resetCount} definition properties reset to defaults`);
  } else {
    Notify.errorNow("No definition properties to reset");
  }
};

export default async () => {
  return await new Promise((resolve) => {
    try {
      const definition = (unsafeWindow as any).geofs?.aircraft?.instance?.definition;
      if (!definition) {
        log.debug("No definition found yet, showing waiting placeholder.");
        resolve([
          <div class="p-6 text-center text-gray-400 dark:text-gray-500 font-sans space-y-2">
            <div class="text-3xl animate-bounce">✈️</div>
            <p class="text-sm font-medium">Waiting for aircraft to load...</p>
            <p class="text-xs text-gray-500">Definitions will appear as soon as the aircraft is active.</p>
          </div>,
        ]);
        return;
      }

      const { allowed, ignored, reset } = (Props as any).Definition || { allowed: [], ignored: [], reset: false };
      inputRefs.clear();
      const response = [];

      for (const item of Object.entries(definition)) {
        const [propName, prop] = item;
        const propType = typeof prop;
        if (ignored.includes(propType)) continue;
        const isAllowed = allowed.some((p: any) => p.name === propName);
        if (!isAllowed) continue;
        const syncType = allowed.find((p: any) => p.name === propName)?.type;
        if (!syncType) continue;
        const hasComment = allowed.find((p: any) => p.name === propName)?.comment;

        response.push(
          <li class="flex gap-2">
            <Input
              name={propName}
              type={syncType}
              comment={hasComment}
              resource="geofs.aircraft.instance.definition"
              ref={(el: InputRef) => {
                if (reset && el) {
                  inputRefs.set(propName, el);
                }
              }}
            />
          </li>
        );
      }

      log.debug(`Loaded ${response.length} definition properties`);
      resolve(response);
    } catch (e) {
      log.error("Failed to load definitions:", e);
      resolve([
        <div class="p-4 text-center text-red-400 text-xs">
          Failed to load definitions. Check console for details.
        </div>,
      ]);
    }
  });
};
