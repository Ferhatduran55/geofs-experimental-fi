import Logger from "../classes/Logger";
import Notify from "../classes/Notify";
import Props from "../classes/Props";
import Input from "../components/Input";

const log = Logger.create("Definitions");
const inputRefs = new Map<string, any>();

export const resetDefinitions = () => {
  if (inputRefs.size === 0) {
    Notify.errorNow("No definitions to reset");
    return;
  }

  inputRefs.forEach((ref) => {
    if (ref && typeof ref.reset === 'function') {
      ref.reset();
    }
  });
  
  log.info("Definitions reset to defaults");
  Notify.successNow("Definitions reset to defaults");
};

export default async () => {
  return await new Promise((resolve, reject) => {
    try {
      const { allowed, ignored, reset } = (Props as any).Definition;
      const definition = (unsafeWindow as any).geofs?.aircraft?.instance?.definition;
      if (!definition) throw new Error("No definition found.");

      inputRefs.clear();
      const response = [];

      for (const item of Object.entries(definition)) {
        const [propName, prop]: ServiceItem = item;
        const propType = typeof prop;

        if (ignored.includes(propType)) continue;

        const isAllowed = allowed.some((p: any) => p.name === propName);
        if (!isAllowed) continue;

        const syncType = allowed.find((p: any) => p.name === propName).type;
        if (!syncType) continue;

        const hasComment = allowed.find(
          (p: any) => p.name === propName
        ).comment;

        response.push(
          <li class="flex gap-2">
            <Input 
              name={propName} 
              type={syncType} 
              comment={hasComment} 
              resource="geofs.aircraft.instance.definition"
              ref={(el: any) => {
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
      reject(e);
    }
  });
};
