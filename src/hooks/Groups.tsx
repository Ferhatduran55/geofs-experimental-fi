import { createResource } from "solid-js";
import { core } from "../core/CoreEngine";

export default () => {
  const tabs = core.ui.getTabs();

  return tabs.map((tab) => ({
    name: tab.id,
    title: tab.title,
    icon: tab.icon,
    className: tab.className || "bg-gray-300/50 dark:bg-gray-900/70",
    resource: createResource(tab.render),
    reference: null,
    onReset: tab.onReset,
  }));
};
