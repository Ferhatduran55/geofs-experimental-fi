import { createResource } from "solid-js";
import getDefinitions from "@/services/Definitions";
import getEngines from "@/services/Engines";

export default () => [
  {
    name: "definitions",
    title: "Definitions",
    icon: true,
    resource: createResource(getDefinitions),
    reference: null,
  },
  {
    name: "engines",
    title: "Engines",
    icon: true,
    resource: createResource(getEngines),
    reference: null,
  },
];
