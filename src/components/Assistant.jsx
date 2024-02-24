import { render } from "solid-js/web";
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
                    max="30000000"
                    step="100"
                    placeholder={`Between 0 and 30000000`}
                    class="w-11/12 m-2 border-0 rounded-md p-2 shadow-md"
                    oninput={(e) => {
                      if (e.target.value > 0 && e.target.value <= 30000000) {
                        flightAssistant.instance.engines[i].thrust = parseInt(
                          e.target.value
                        );
                      }
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
                    max="30000000"
                    step="100"
                    placeholder={`Between 0 and 30000000`}
                    class="w-11/12 m-2 border-0 rounded-md p-2 shadow-md"
                    oninput={(e) => {
                      if (e.target.value > 0 && e.target.value <= 30000000) {
                        flightAssistant.instance.engines[i].afterBurnerThrust =
                          parseInt(e.target.value);
                      }
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

  const [engines, { refetch }] = createResource(getEngines);

  const [items, setItems] = createSignal([]);
  const [numberOfItems, setNumberOfItems] = createSignal(items.length);

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
        refetch();
      }, 1000);
    }
  });

  onMount(() => {
    flightAssistant.state.itemList = refItems;
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
                  <For each={engines()}>{(engine) => <li> {engine}</li>}</For>
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
