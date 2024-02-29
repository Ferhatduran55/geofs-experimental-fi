export const allowed = [
  { name: "airbrakesTravelTime", type: "float" },
  { name: "accessoriesTravelTime", type: "float" },
  { name: "flapsTravelTime", type: "float" },
  { name: "flapsSteps", type: "int" },
  { name: "gearTravelTime", type: "float" },
  { name: "zeroThrustAltitude", type: "int" },
  { name: "zeroRPMAltitude", type: "int" },
  { name: "mass", type: "int" },
];

export const ignoredTypes = [
  "object",
  "function",
  "undefined",
  "null",
  "boolean",
  "symbol",
  "array",
];
