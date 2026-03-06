export default [
  {
    name: "Definition",
    options: {
      source: { target: "geofs.aircraft.instance", prop: "definition" },
      reactive: true,
      reset: true,
      allowed: [
        { name: "startupTime", type: "float" },
        { name: "shutdownTime", type: "float" },
        { name: "optionalAnimatedPartTravelTime", type: "float" },
        { name: "airbrakesTravelTime", type: "float" },
        { name: "accessoriesTravelTime", type: "float" },
        { name: "flapsTravelTime", type: "float" },
        { name: "flapsSteps", type: "int" },
        { name: "gearTravelTime", type: "float" },
        { name: "zeroThrustAltitude", type: "int" },
        { name: "zeroRPMAltitude", type: "int" },
        { name: "mass", type: "int" },
        { name: "minRPM", type: "int", comment: "not recommended" },
        { name: "maxRPM", type: "int", comment: "not recommended" },
      ],
      ignored: [
        "object",
        "function",
        "undefined",
        "null",
        "boolean",
        "symbol",
        "array",
      ],
    },
  },
  {
    name: "Icons",
    options: {
      source: {
        target: "geofs.map",
        prop: "icons",
      },
      reactive: true,
    },
  },
  {
    name: "Engines",
    options: {
      source: {
        target: "geofs.aircraft.instance",
        prop: "engines",
      },
      reactive: true,
      reset: true,
      allowed: [
        { name: "thrust", type: "int" },
        { name: "afterBurnerThrust", type: "int" },
        { name: "reverseThrust", type: "int" },
      ],
      ignored: [
        "object",
        "function",
        "undefined",
        "null",
        "boolean",
        "symbol",
        "array",
      ],
    },
  },
  {
    name: "ExperimentalFeatures",
    options: {
      allowed: [
        { name: "fuelSystem", type: "boolean", label: "Fuel Management System" },
        { name: "aircraftMarkers", type: "boolean", label: "Special Aircraft Markers" },
        { name: "aircraftRadar", type: "boolean", label: "Aircraft Radar" },
      ],
      ignored: [],
    },
  }
];
