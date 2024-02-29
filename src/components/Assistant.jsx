import { render } from "solid-js/web";
import { toast } from "solid-toast";
import { allowed as allowedProps, ignoredTypes } from "@json/DefinitionProps";
import {
  onMount,
  onCleanup,
  createSignal,
  createResource,
  createEffect,
  Switch,
  Match,
  Suspense,
  Show,
} from "solid-js";

const toastOptions = { duration: 2000 };

const getDefinitions = async () => {
  return await new Promise((resolve, reject) => {
    try {
      const definition = flightAssistant.instance.definition;
      if (!definition) {
        throw new Error("No definition found.");
      }

      const response = [];
      for (const item of Object.entries(definition)) {
        const [propName, prop] = item;
        const propType = typeof prop;

        if (ignoredTypes.includes(propType)) continue;

        const isAllowed = allowedProps.some((p) => p.name === propName);
        if (!isAllowed) continue;

        const syncType = allowedProps.find((p) => p.name === propName).type;
        if (!syncType) continue;

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
          props.min = 0.0;
          props.max = prop * 2.0;
          props.step = isInt ? "1" : isFloat ? "0.2" : null;
          props.placeholder = `Between ${props.min} and ${props.max}`;
        }

        response.push(
          <li class="flex gap-2">
            <label for={`set${propName}`}>{propName}:</label>
            <input
              id={`set${propName}`}
              type={isNum ? "number" : isText ? "text" : null}
              {...props}
              class="w-11/12 m-2 border-0 rounded-md p-2 shadow-md"
              oninput={async (e) => {
                let that = e.target,
                  value,
                  min,
                  max;

                if (isNum) {
                  min = parseFloat(that.min);
                  max = parseFloat(that.max);
                  value = parseFloat(that.value);
                } else {
                  min = that.min;
                  max = that.max;
                  value = that.value;
                }
                let type = that.type;

                await new Promise((resolve, reject) => {
                  if (type == "number" && value > min && value <= max) {
                    e.target.max = value * 2 * 100;
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
                  .then((msg) => toast.success(msg, toastOptions))
                  .catch((msg) => toast.error(msg, toastOptions));
              }}
            />
          </li>
        );
      }
      resolve(response);
    } catch (e) {
      reject(e);
    }
  });
};

const getEngines = async () => {
  return await new Promise((resolve, reject) => {
    const engines = flightAssistant.instance.engines;
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
            <svg
              class={
                "w-5 h-5 text-gray-500 transition group-open/engine" +
                i +
                ":rotate-90"
              }
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
              ></path>
            </svg>
          </summary>
          <article class="px-4 pb-4">
            <ul class="flex flex-col gap-4 pl-2 mt-4">
              <Show when={engines[i].thrust}>
                <li class="flex gap-2">
                  <label for={`setEngine${i + 1}Thrust`}>Thrust:</label>
                  <input
                    id={`setEngine${i + 1}Thrust`}
                    type="number"
                    min="0"
                    max={engines[i].thrust * 2 * 100}
                    step="100"
                    placeholder={`Between 0 and ${engines[i].thrust * 2 * 100}`}
                    class="w-11/12 m-2 border-0 rounded-md p-2 shadow-md"
                    oninput={async (e) => {
                      let value = parseInt(e.target.value);
                      let min = parseInt(e.target.min);
                      let max = parseInt(e.target.max);

                      await new Promise((resolve, reject) => {
                        if (value > min && value <= max) {
                          e.target.max = value * 2 * 100;
                          flightAssistant.instance.engines[i].thrust = value;

                          e.target.placeholder = `Between ${min} and ${max}`;
                          resolve(`${engines[i].name} thrust set to ${value}`);
                        } else {
                          reject(`Value must be between ${min} and ${max}`);
                        }
                      })
                        .then((msg) => toast.success(msg, toastOptions))
                        .catch((msg) => toast.error(msg, toastOptions));
                    }}
                  />
                </li>
              </Show>
              <Show when={engines[i].afterBurnerThrust}>
                <li class="flex gap-2">
                  <label for={`setEngine${i + 1}AfterBurnerThrust`}>
                    After Burner Thrust:
                  </label>
                  <input
                    id={`setEngine${i + 1}AfterBurnerThrust`}
                    type="number"
                    min="0"
                    max={engines[i].afterBurnerThrust * 2 * 100}
                    step="100"
                    placeholder={`Between 0 and ${
                      engines[i].afterBurnerThrust * 2 * 100
                    }`}
                    class="w-11/12 m-2 border-0 rounded-md p-2 shadow-md"
                    oninput={async (e) => {
                      let value = parseInt(e.target.value);
                      let min = parseInt(e.target.min);
                      let max = parseInt(e.target.max);

                      await new Promise((resolve, reject) => {
                        if (value > min && value <= max) {
                          e.target.max = value * 2 * 100;
                          flightAssistant.instance.engines[
                            i
                          ].afterBurnerThrust = value;
                          e.target.placeholder = `Between ${min} and ${max}`;
                          resolve(
                            `${engines[i].name} after burner thrust set to ${value}`
                          );
                        } else {
                          reject(`Value must be between ${min} and ${max}`);
                        }
                      })
                        .then((msg) => toast.success(msg, toastOptions))
                        .catch((msg) => toast.error(msg, toastOptions));
                    }}
                  />
                </li>
              </Show>
              <Show when={engines[i].reverseThrust}>
                <li class="flex gap-2">
                  <label for={`setEngine${i + 1}ReverseThrust`}>
                    Reverse Thrust:
                  </label>
                  <input
                    id={`setEngine${i + 1}ReverseThrust`}
                    type="number"
                    min="0"
                    max={engines[i].reverseThrust * 2 * 100}
                    step="100"
                    placeholder={`Between 0 and ${
                      engines[i].reverseThrust * 2 * 100
                    }`}
                    class="w-11/12 m-2 border-0 rounded-md p-2 shadow-md"
                    oninput={async (e) => {
                      let value = parseInt(e.target.value);
                      let min = parseInt(e.target.min);
                      let max = parseInt(e.target.max);

                      await new Promise((resolve, reject) => {
                        if (value > min && value <= max) {
                          e.target.max = value * 2 * 100;
                          flightAssistant.instance.engines[i].reverseThrust =
                            value;
                          e.target.placeholder = `Between ${min} and ${max}`;
                          resolve(
                            `${engines[i].name} reverse thrust set to ${value}`
                          );
                        } else {
                          reject(`Value must be between ${min} and ${max}`);
                        }
                      })
                        .then((msg) => toast.success(msg, toastOptions))
                        .catch((msg) => toast.error(msg, toastOptions));
                    }}
                  />
                </li>
              </Show>
            </ul>
          </article>
        </details>
      );
    }
    resolve(response);
  });
};

const MenuComponent = (props) => {
  const [currentAircraftId, setCurrentAircraftId] = createSignal();
  setCurrentAircraftId(flightAssistant.instance.id);

  const [engines, enginesSrc = { refetch }] = createResource(getEngines);
  const [definitions, definitionsSrc = { refetch }] =
    createResource(getDefinitions);

  const [items, setItems] = createSignal([]);
  const [numberOfItems, setNumberOfItems] = createSignal(items.length);

  let refDefinitions;
  let refEngines;
  let refItems;

  const addItem = (...task) => {
    let len = task.length;
    if (len === 0) return;
    setItems([...items(), ...task]);
    setNumberOfItems(numberOfItems() + len);
  };

  if (props.children) {
    if (Array.isArray(props.children)) {
      addItem(...props.children);
    } else {
      addItem(props.children);
    }
  }

  createEffect(() => {
    const aircraftId = flightAssistant.instance.id;
    if (currentAircraftId() !== aircraftId) {
      setCurrentAircraftId(aircraftId);
      setTimeout(() => {
        enginesSrc.refetch();
        definitionsSrc.refetch();
      }, 1000);
    }
  });

  onMount(() => {
    flightAssistant.state.itemList = refItems;
    flightAssistant.state.definitionList = refDefinitions;
    flightAssistant.state.engineList = refEngines;
  });

  return (
    <>
      <Show when={numberOfItems() === 0}>
        <ul class="flight-assistant-item-list" ref={refItems}>
          <For each={items()}>{(item) => item}</For>
        </ul>
      </Show>
      <details class="group">
        <summary class="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
          <span class="flex gap-2">Definitions</span>
          <svg
            class="w-5 h-5 text-gray-500 transition group-open:rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            ></path>
          </svg>
        </summary>
        <article class="px-4 pb-4">
          <ul
            class="flex flex-col gap-4 pl-2 mt-4  flight-assistant-definition-list"
            ref={refDefinitions}
          >
            <Suspense fallback={<div>Definitions Loading...</div>}>
              <Switch>
                <Match when={definitions.error}>
                  <span>Error: {definitions.error}</span>
                </Match>
                <Match when={definitions()}>
                  <For each={definitions()}>
                    {(definition) => <li> {definition} </li>}
                  </For>
                </Match>
              </Switch>
            </Suspense>
          </ul>
        </article>
      </details>
      <details class="group">
        <summary class="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
          <span class="flex gap-2">Engines</span>
          <svg
            class="w-5 h-5 text-gray-500 transition group-open:rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
            ></path>
          </svg>
        </summary>
        <article class="px-4 pb-4">
          <ul
            class="flex flex-col gap-4 pl-2 mt-4  flight-assistant-engine-list"
            ref={refEngines}
          >
            <Suspense fallback={<div>Engines Loading...</div>}>
              <Switch>
                <Match when={engines.error}>
                  <span>Error: {engines.error}</span>
                </Match>
                <Match when={engines()}>
                  <For each={engines()}>{(engine) => <li> {engine} </li>}</For>
                </Match>
              </Switch>
            </Suspense>
          </ul>
        </article>
      </details>
    </>
  );
};

const ContainerComponent = (props) => {
  let ref;

  onMount(() => {
    flightAssistant.state.container = ref;
  });

  onCleanup(() => {
    flightAssistant.state.container = null;
  });

  return (
    <>
      <ul
        class="geofs-list geofs-toggle-panel geofs-assistant-list"
        data-noblur="true"
        data-onshow="{geofs.initializePreferencesPanel()}"
        data-onhide="{geofs.savePreferencesPanel()}"
        ref={ref}
      >
        <MenuComponent children={props.children}></MenuComponent>
      </ul>
    </>
  );
};

export const Container = (props) => {
  const mount = document.querySelector(".geofs-ui-left");
  render(() => <ContainerComponent {...props} />, mount);
};

const ButtonComponent = () => {
  let ref;
  onMount(() => {
    flightAssistant.state.button = ref;
  });

  onCleanup(() => {
    flightAssistant.state.button = null;
  });

  return (
    <>
      <button
        class="mdl-button mdl-js-button geofs-f-standard-ui"
        id="assistantbutton"
        tabindex="0"
        data-upgraded=",MaterialButton"
        data-toggle-panel=".geofs-assistant-list"
        data-tooltip-classname="mdl-tooltip--top"
        title="Flight Assistant"
        ref={ref}
      >
        ASSISTANT
      </button>
    </>
  );
};

export const Button = () => {
  const mount = document.querySelector(".geofs-ui-bottom");
  render(() => <ButtonComponent />, mount);
};
