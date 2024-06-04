import { render } from "solid-js/web";
import {
  onMount,
  onCleanup,
  createSignal,
  createEffect,
  createMemo,
  For,
} from "solid-js";
import Groups from "../hooks/Groups";
import Group from "../components/Group";
import ui from "../assets/json/UserInterface";
import { refreshMarker } from "../services/AircraftMarkers";

const MenuComponent = () => {
  const groups = Groups();
  const [currentAircraftId, setCurrentAircraftId] = createSignal();
  setCurrentAircraftId(flightAssistant.instance.id);
  const sameAircraftId = createMemo(
    () => flightAssistant.instance.id === currentAircraftId()
  );

  createEffect(() => {
    if (!sameAircraftId()) {
      setCurrentAircraftId(flightAssistant.instance.id);
      refreshMarker();
      setTimeout(() => {
        for (let i = 0; i < groups.length; i++) {
          groups[i].resource[1].refetch();
        }
      }, 1000);
    }
  });

  onMount(() => {
    for (let i = 0; i < groups.length; i++) {
      let { name, reference } = groups[i];
      flightAssistant.refs[name] = reference;
    }
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
              resource={group.resource[0]}
              reference={group.reference}
            />
          );
        }}
      </For>
    </>
  );
};

const ContainerComponent = () => {
  let ref: any;

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
