import { Portal, render } from "solid-js/web";
import { onMount, onCleanup } from "solid-js";

export const ContainerComponent = (props) => {
  let ref;
  const queue = [
    <input
      id="setMinRPM"
      type="number"
      min="0"
      max="1000000"
      step="100"
      placeholder="Set Min RPM: ..Between 0 and 1000000.."
      class="w-11/12 m-2 border-0 rounded-md p-2 shadow-md"
      oninput={(e) => {
        if (e.target.value <= flightAssistant.instance.maxRPM) {
          flightAssistant.instance.minRPM = e.target.value;
        }
      }}
    />,
    <input
      id="setMaxRPM"
      type="number"
      min="0"
      max="1000000"
      step="100"
      placeholder="Set Max RPM: ..Between 0 and 1000000.."
      class="w-11/12 m-2 border-0 rounded-md p-2 shadow-md"
      oninput={(e) => {
        if (e.target.value >= flightAssistant.instance.minRPM) {
          flightAssistant.instance.maxRPM = e.target.value;
        }
      }}
    />,
  ];

  if (props.children) {
    if (Array.isArray(props.children)) {
      queue.push(...props.children);
    } else {
      queue.push(props.children);
    }
  }

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
        <For each={queue}>{(item) => item}</For>
      </ul>
    </>
  );
};

export const Container = (props) => {
  const mount = document.querySelector(".geofs-ui-left");
  render(() => <ContainerComponent {...props} />, mount);
};

export const ButtonComponent = () => {
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
  const mount =
    document.querySelector(".geofs-ui-bottom");
  render(() => <ButtonComponent />, mount);
};
