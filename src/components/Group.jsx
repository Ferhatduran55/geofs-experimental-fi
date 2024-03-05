import { GroupRotation } from "@icons/GroupRotation";
import { Switch, Match, Suspense, For } from "solid-js";

const Summary = (props) => {
  return (
    <summary class="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
      <span class="flex gap-2">{props.title}</span>
      <GroupRotation group-open={props.name} />
    </summary>
  );
};

const Article = (props) => {
  return (
    <article class="px-4 pb-4">
      <ul class="flex flex-col gap-4 pl-2 mt-4" ref={props.reference}>
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
    </article>
  );
};

const Details = (props) => {
  return (
    <details class={"group/" + props.name}>
      <Summary {...props} />
      <Article {...props} />
    </details>
  );
};

export default (props) => {
  try {
    if (!props.name || !props.resource) {
      throw new Error("Group component requires a name and resource prop.");
    }
    if (typeof props.resource !== "object") {
      throw new Error("Group component resource prop must be an object.");
    }
    let name = props.name;
    let resource = Object.entries(props.resource)[0][1];
    let icon = props.icon || true;
    let title = props.title || name;
    let reference = props.reference || null;

    return (
      <Details
        name={name}
        title={title}
        resource={resource}
        icon={icon}
        reference={reference}
      />
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};
