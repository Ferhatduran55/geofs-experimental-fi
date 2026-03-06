import { createResource } from "solid-js";
import getDefinitions, { resetDefinitions } from "../services/Definitions";
import getEngines, { resetEngines } from "../services/Engines";
import getExperimentalFeatures from "../services/ExperimentalFeatures";
import getFuelManagement from "../services/FuelManagement";
import { Description, Engine, Tune, LocalGasStation } from "../assets/icons";

export default () => [
  {
    name: "definitions",
    title: "Definitions",
    icon: Description,
    className: "bg-gray-300/50 dark:bg-gray-900/70",
    resource: createResource(getDefinitions),
    reference: null,
    onReset: resetDefinitions,
  },
  {
    name: "engines",
    title: "Engines",
    icon: Engine,
    className: "bg-gray-300/50 dark:bg-gray-900/70",
    resource: createResource(getEngines),
    reference: null,
    onReset: resetEngines,
  },
  {
    name: "experimental",
    title: "Settings",
    icon: Tune,
    className: "bg-gray-300/50 dark:bg-gray-900/70",
    resource: createResource(getExperimentalFeatures),
    reference: null,
  },
  {
    name: "fuelManagement",
    title: "Fuel Management",
    icon: LocalGasStation,
    className: "bg-gray-800 dark:bg-black/70",
    resource: createResource(getFuelManagement),
    reference: null,
  },
];
