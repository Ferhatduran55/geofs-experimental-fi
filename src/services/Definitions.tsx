import { toast } from "solid-sonner";
import toastOptions from "../assets/json/ServicesToastOptions";
import Props from "../classes/Props";

export default async () => {
  return await new Promise((resolve, reject) => {
    try {
      const { allowed, ignored, reset } = (Props as any).Definition;
      const definition = flightAssistant.instance.definition;
      if (!definition) throw new Error("No definition found.");

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

        const isNum =
          ["int", "float", "number"].includes(syncType) ||
          propType === "number";
        const isInt = syncType === "int";
        const isFloat = syncType === "float";
        const isText = syncType === "string";
        /*
        response.push(
          <li class="flex gap-2">
            <Input name={propName} type={syncType} comment={hasComment} resource="flightAssistant.instance.definition" />
          </li>
        );
        */

        let props: ServiceItemInputAttributes | any = {};
        if (isText) {
          props.placeholder = "Text";
        } else if (isNum) {
          props.min = isInt ? "0" : "0.0";
          props.max = prop * 2;
          props.step = isFloat ? "0.2" : "1";
          props.placeholder = `Between ${props.min} and ${props.max}`;
        }
        if (reset) props["data-definitions-default"] = prop;
        props["data-definitions-propname"] = propName;
        props["data-definitions-type"] = syncType;

        response.push(
          <li class="flex gap-2">
            <label class="flex-none w-fit" for={`set${propName}`}>
              {propName}:
              {hasComment ? (
                <>
                  <br></br>
                  <span class="text-sm text-slate-500">{hasComment}</span>
                </>
              ) : null}
            </label>
            <input
              id={`set${propName}`}
              type={isNum ? "number" : isText ? "text" : undefined}
              {...props}
              class="flex-auto w-max m-2 border-0 rounded-md p-2 shadow-md"
              oninput={async (e: any) => {
                let that = e.target;
                let [min, max, value] = ["min", "max", "value"].map((e) =>
                  isNum ? parseFloat(that[e]) : that[e]
                );
                let type = that.type;

                await new Promise((resolve, reject) => {
                  if (type == "number" && value > min && value <= max) {
                    let newMax = value * 2 * 100;
                    e.target.max = newMax < 1 ? 10 : newMax;
                    flightAssistant.instance.definition[propName] = value;
                    that.placeholder = `Between ${min} and ${max}`;

                    resolve(`${propName} set to ${value}`);
                  } else if (type == "text" && !value) {
                    flightAssistant.instance.definition[propName] = value;

                    resolve(`${propName} set to ${value}`);
                  } else {
                    reject(
                      isNum
                        ? `Value must be between ${min} and ${max}`
                        : isText
                        ? `Value must be text`
                        : `Invalid value`
                    );
                  }
                })
                  .then((msg) => toast.success(msg as string, toastOptions))
                  .catch((msg) => toast.error(msg, toastOptions));
              }}
            />
          </li>
        );
      }
      if (reset) {
        response.unshift(
          <li class="flex gap-2">
            <button
              class="w-fit m-2 border-0 rounded-md px-3 bg-sky-600 text-white shadow-md hover:bg-sky-700 hover:cursor-pointer"
              onclick={() => {
                const inputs = document.querySelectorAll(
                  "input[data-definitions-default]"
                );
                inputs.forEach((input: any) => {
                  let prefix = "data-definitions-";
                  let value: any = input.getAttribute(`${prefix}default`);
                  let propName = input.getAttribute(`${prefix}propname`);

                  let type = input.getAttribute(`${prefix}type`);
                  if (type === "int") value = parseInt(value);
                  if (type === "float") value = parseFloat(value);

                  input.value = value;
                  flightAssistant.instance.definition[propName] = value;
                });
                if (inputs.length)
                  toast.success("Definitions reset", toastOptions);
                else toast.error("No definitions to reset", toastOptions);
              }}
            >
              Reset
            </button>
            <button
              class="w-fit m-2 border-0 rounded-md px-3 bg-sky-600 text-white shadow-md hover:bg-sky-700 hover:cursor-pointer"
              onclick={() => {
                toast.info("Coming soon..", toastOptions);
              }}
            >
              Save
            </button>
            <button
              class="w-fit m-2 border-0 rounded-md px-3 bg-sky-600 text-white shadow-md hover:bg-sky-700 hover:cursor-pointer"
              onclick={() => {
                toast.info("Coming soon..", toastOptions);
              }}
            >
              Load
            </button>
          </li>
        );
      }
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};
