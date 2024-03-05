import { render } from "solid-js/web";
import {
  onMount,
  onCleanup,
  createSignal,
  createResource,
  createEffect,
  createMemo,
} from "solid-js";
import getDefinitions from "@services/Definitions";
import getEngines from "@services/Engines";
import Group from "@components/Group";
import ui from "@json/UserInterface";

const MenuComponent = () => {
  const [engines, enginesSrc = { refetch }] = createResource(getEngines);
  const [definitions, definitionsSrc = { refetch }] =
    createResource(getDefinitions);

  const [currentAircraftId, setCurrentAircraftId] = createSignal();
  setCurrentAircraftId(flightAssistant.instance.id);
  const sameAircraftId = createMemo(
    () => flightAssistant.instance.id === currentAircraftId()
  );

  createEffect(() => {
    if (!sameAircraftId()) {
      setCurrentAircraftId(flightAssistant.instance.id);
      setTimeout(() => {
        enginesSrc.refetch();
        definitionsSrc.refetch();
      }, 1000);
    }
  });

  let refDefinitions;
  let refEngines;

  onMount(() => {
    flightAssistant.refs.definitions = refDefinitions;
    flightAssistant.refs.engines = refEngines;
  });

  return (
    <>
      <Group
        name="definitions"
        title="Definitions"
        icon={true}
        resource={{ definitions }}
        reference={refDefinitions}
      />
      <Group
        name="engines"
        title="Engines"
        icon={true}
        resource={{ engines }}
        reference={refEngines}
      />
    </>
  );
};

const ContainerComponent = () => {
  let ref;

  onMount(() => {
    flightAssistant.refs.container = ref;
  });

  onCleanup(() => {
    flightAssistant.refs.container = null;
  });

  return (
    <>
      <ul
        class="geofs-list geofs-toggle-panel geofs-efi-list"
        data-noblur="true"
        data-onshow="{geofs.initializePreferencesPanel()}"
        data-onhide="{geofs.savePreferencesPanel()}"
        ref={ref}
      >
        <MenuComponent></MenuComponent>
      </ul>
    </>
  );
};

const ButtonComponent = () => {
  let ref;
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
