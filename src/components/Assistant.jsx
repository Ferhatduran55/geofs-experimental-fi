import { render } from "solid-js/web";
import { GroupRotation } from "@icons/GroupRotation";
import {
  onMount,
  onCleanup,
  createSignal,
  createResource,
  createEffect,
  createMemo,
  Switch,
  Match,
  Suspense,
  Show,
  For,
} from "solid-js";
import { get as getDefinitions } from "@services/Definitions";
import { get as getEngines } from "@services/Engines";

const MenuComponent = (props) => {
  const [currentAircraftId, setCurrentAircraftId] = createSignal();
  setCurrentAircraftId(flightAssistant.instance.id);
  const sameAircraftId = createMemo(
    () => flightAssistant.instance.id === currentAircraftId()
  );

  const [engines, enginesSrc = { refetch }] = createResource(getEngines);
  const [definitions, definitionsSrc = { refetch }] =
    createResource(getDefinitions);

  const [items, setItems] = createSignal([]);
  const numberOfItems = createMemo(() => items().length);

  let refDefinitions;
  let refEngines;
  let refItems;

  const addItem = (...task) => {
    let len = task.length;
    if (len === 0) return;
    setItems([...items(), ...task]);
  };

  if (props.children) {
    if (Array.isArray(props.children)) {
      addItem(...props.children);
    } else {
      addItem(props.children);
    }
  }

  createEffect(() => {
    if (!sameAircraftId()) {
      setCurrentAircraftId(flightAssistant.instance.id);
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
      <details class="group/definition">
        <summary class="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
          <span class="flex gap-2">Definitions</span>
          <GroupRotation group-open="definition" />
        </summary>
        <article class="px-4 pb-4">
          <ul
            class="flex flex-col gap-4 pl-2 mt-4  flight-assistant-definition-list"
            ref={refDefinitions}
          >
            <Suspense fallback={<div>Definitions Loading...</div>}>
              <Switch>
                <Match when={definitions.loading}>
                  <span>Loading...</span>
                </Match>
                <Match when={definitions.error}>
                  <span>Error: {definitions.error}</span>
                </Match>
                <Match when={definitions()}>
                  <For each={definitions()}>
                    {(definition) => {
                      return definition;
                    }}
                  </For>
                </Match>
              </Switch>
            </Suspense>
          </ul>
        </article>
      </details>
      <details class="group/engines">
        <summary class="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
          <span class="flex gap-2">Engines</span>
          <GroupRotation group-open="engines" />
        </summary>
        <article class="px-4 pb-4">
          <ul
            class="flex flex-col gap-4 pl-2 mt-4  flight-assistant-engine-list"
            ref={refEngines}
          >
            <Suspense fallback={<div>Engines Loading...</div>}>
              <Switch>
                <Match when={engines.loading}>
                  <span>Loading...</span>
                </Match>
                <Match when={engines.error}>
                  <span>Error: {engines.error}</span>
                </Match>
                <Match when={engines()}>
                  <For each={engines()}>
                    {(engine) => {
                      return engine;
                    }}
                  </For>
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
