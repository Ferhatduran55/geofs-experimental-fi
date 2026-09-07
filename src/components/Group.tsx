import { Switch, Match, Suspense, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import GroupRotation from "../assets/icons/GroupRotation";
import { Refresh } from "../assets/icons";
import Logger from "../shared/Logger";

const log = Logger.create("Group");

const Summary = (props: any) => {
  const handleReset = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (props.onReset && typeof props.onReset === 'function') {
      props.onReset();
    }
  };

  return (
    <summary class="flex items-center justify-between text-lg font-bold text-gray-900 dark:text-white cursor-pointer list-none outline-none select-none [&::-webkit-details-marker]:hidden">
      <div class="flex items-center">
        {props.icon && <Dynamic component={props.icon} />}
        {props.title}
      </div>
      <div class="flex items-center gap-2">
        <Show when={props.onReset}>
          <button
            type="button"
            class="p-1 rounded-full hover:bg-gray-400/50 dark:hover:bg-gray-700/50 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            title="Reset"
            onclick={handleReset}
          >
            <Refresh class="w-5 h-5" />
          </button>
        </Show>
        <GroupRotation />
      </div>
    </summary>
  );
};

const Article = (props: any) => {
  return (
    <div class={`p-4 rounded-lg space-y-4 ${props.className || "bg-gray-300/50 dark:bg-gray-900/70"}`}>
      <ul class="flex flex-col gap-4" ref={props.reference}>
        <Suspense fallback={<div>{props.title} Loading...</div>}>
          <Switch>
            <Match when={props.resource?.loading}>
              <span>Loading...</span>
            </Match>
            <Match when={props.resource?.error}>
              <span>Error: {props.resource.error}</span>
            </Match>
            <Match when={props.resource()}>
              <For each={props.resource()}>
                {(i) => {
                  return i;
                }}
              </For>
            </Match>
          </Switch>
        </Suspense>
      </ul>
    </div>
  );
};

const Details = (props: any) => {
  return (
    <details class="group space-y-2" open>
      <Summary {...props} />
      <Article {...props} />
    </details>
  );
};

export default (props: any) => {
  try {
    if (!props.name || !props.resource) {
      throw new Error("Group component requires a name and resource prop.");
    }
    if (typeof props.resource !== "function") {
      throw new Error("Group component resource prop must be an function.");
    }
    let { name, resource } = props;
    let icon = props.icon || true;
    let title = props.title || name;
    let reference = props.reference || null;
    let className = props.className;
    let onReset = props.onReset || null;

    return (
      <Details
        name={name}
        title={title}
        resource={resource}
        icon={icon}
        reference={reference}
        className={className}
        onReset={onReset}
      />
    );
  } catch (e) {
    log.error("Group validation failed:", e);
    return null;
  }
};
