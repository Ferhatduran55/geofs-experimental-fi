import { toast } from "solid-toast";
import toastOptions from "@json/ServicesToastOptions";
import { GroupRotation } from "@icons/GroupRotation";
import { Props } from "@classes/Props";

export default async () => {
  return await new Promise((resolve, reject) => {
    try {
      const { allowed, ignored } = Props.Engines;
      const engines = flightAssistant.instance.engines;
      if (!engines) throw new Error("No engines found.");
      const response = [];
      for (let i = 0; i < engines.length; i++) {
        response.push(
          <details class={"group/engine" + i}>
            <summary class="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
              <span class="flex gap-2">
                <Switch>
                  <Match when={engines[i].name}>{engines[i].name}</Match>
                  <Match when={!engines[i].name}>Engine {i + 1}</Match>
                </Switch>
              </span>
              <GroupRotation group-open={`engine${i}`} />
            </summary>
            <article class="px-4 pb-4">
              <ul class="flex flex-col gap-4 pl-2 mt-4">
                <For each={Object.entries(engines[i])}>
                  {(item) => {
                    const [propName, prop] = item;
                    const propType = typeof prop;

                    if (ignored.includes(propType)) return null;

                    const isAllowed = allowed.some((p) => p.name === propName);
                    if (!isAllowed) return null;

                    const syncType = allowed.find(
                      (p) => p.name === propName
                    ).type;
                    if (!syncType) return null;

                    const isNum =
                      ["int", "float", "number"].includes(syncType) ||
                      propType === "number";
                    const isInt = syncType === "int";
                    const isFloat = syncType === "float";
                    const isText = syncType === "string";

                    let props = {};
                    if (isText) {
                      props.placeholder = "Text";
                    } else if (isNum) {
                      props.min = isInt ? "0" : isFloat ? "0.0" : null;
                      props.max = isInt
                        ? parseInt(prop * 2)
                        : isFloat
                        ? parseFloat(prop * 2)
                        : null;
                      props.step = isInt ? "1" : isFloat ? "0.2" : null;
                      props.placeholder = `Between ${props.min} and ${props.max}`;
                    }

                    return (
                      <li class="flex gap-2">
                        <label for={`set${engines[i].name}${propName}`}>
                          {propName}:
                        </label>
                        <input
                          id={`set${engines[i].name}${propName}`}
                          type={isNum ? "number" : isText ? "text" : null}
                          {...props}
                          class="w-11/12 m-2 border-0 rounded-md p-2 shadow-md"
                          oninput={async (e) => {
                            let that = e.target;
                            let [min, max, value] = ["min", "max", "value"].map(
                              (e) => (isNum ? parseFloat(that[e]) : that[e])
                            );
                            let type = that.type;

                            await new Promise((resolve, reject) => {
                              if (
                                type == "number" &&
                                value > min &&
                                value <= max
                              ) {
                                let newMax = value * 2 * 100;
                                e.target.max = newMax < 1 ? 10 : newMax;
                                flightAssistant.instance.engines[i][propName] =
                                  value;
                                that.placeholder = `Between ${min} and ${max}`;

                                resolve(
                                  `${engines[i].name}${propName} set to ${value}`
                                );
                              } else if (type == "text" && !value) {
                                flightAssistant.instance.engines[i][propName] =
                                  value;

                                resolve(
                                  `${engines[i].name}${propName} set to ${value}`
                                );
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
                              .then((msg) => toast.success(msg, toastOptions))
                              .catch((msg) => toast.error(msg, toastOptions));
                          }}
                        />
                      </li>
                    );
                  }}
                </For>
              </ul>
            </article>
          </details>
        );
      }
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};
