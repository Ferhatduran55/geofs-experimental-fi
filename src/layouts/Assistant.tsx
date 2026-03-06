import { render } from "solid-js/web";
import {
  onMount,
  onCleanup,
  createSignal,
  For,
} from "solid-js";
import Groups from "../hooks/Groups";
import Group from "../components/Group";
import ui from "../assets/json/UserInterface";
import Logger from "../classes/Logger";

const log = Logger.create("Assistant");

let reloadUICallback: (() => void) | null = null;

export const reloadUI = () => {
  log.debug("External reload UI called");
  if (reloadUICallback) {
    reloadUICallback();
  }
};

const MenuComponent = () => {
  return (
    <GroupsList />
  );
};

const GroupsList = () => {
  const groups = Groups();

  onMount(() => {
    log.debug("GroupsList mounted with groups:", groups.length);
    for (let i = 0; i < groups.length; i++) {
      let { name, reference } = groups[i];
      flightAssistant.refs[name] = reference;
    }
  });

  onCleanup(() => {
    log.debug("GroupsList cleanup");
  });

  return (
    <>
      <For each={groups}>
        {(group) => {
          return (
            <Group
              name={group.name}
              title={group.title}
              icon={group.icon}
              className={group.className}
              resource={group.resource[0]}
              reference={group.reference}
              onReset={group.onReset}
            />
          );
        }}
      </For>
    </>
  );
};

const ContainerComponent = () => {
  let ref: any;
  const [renderKey, setRenderKey] = createSignal(0);

  const forceReload = () => {
    log.debug("Force reloading UI...");
    if (ref) {
      ref.innerHTML = '';
      setRenderKey(prev => prev + 1);
      render(() => <MenuComponent />, ref);
      log.debug("UI reloaded with key:", renderKey());
    }
  };

  onMount(() => {
    flightAssistant.refs.container = ref;
    reloadUICallback = forceReload;
    log.debug("Reload callback registered");
  });

  onCleanup(() => {
    flightAssistant.refs.container = null;
    reloadUICallback = null;
  });

  return (
    <>
      <ul
        class="geofs-list geofs-toggle-panel geofs-efi-list w-[380px] bg-gray-200/80 dark:bg-black/70 backdrop-blur-md shadow-2xl overflow-y-auto font-sans text-gray-800 dark:text-gray-300 p-4 space-y-6"
        data-noblur="true"
        data-onshow="{geofs.initializePreferencesPanel()}"
        data-onhide="{geofs.savePreferencesPanel()}"
        ref={ref}
      >
        <MenuComponent />
      </ul>
    </>
  );
};

const ButtonComponent = () => {
  let ref: any;
  onMount(() => {
    flightAssistant.refs.button = ref;
  });

  onCleanup(() => {
    flightAssistant.refs.button = null;
  });

  return (
    <>
      <button
        class="mdl-button mdl-js-button geofs-f-standard-ui"
        id="geofs-efi-button"
        tabindex="0"
        data-upgraded=",MaterialButton"
        data-toggle-panel=".geofs-efi-list"
        data-tooltip-classname="mdl-tooltip--top"
        title="Experimental Flight Interface"
        ref={ref}
      >
        CONFIG
      </button>
    </>
  );
};

export const Container = () => render(() => <ContainerComponent />, ui.left);
export const Button = () => render(() => <ButtonComponent />, ui.bottom);
  