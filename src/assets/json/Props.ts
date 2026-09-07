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
        { name: "minRPM", type: "int", comment: "Minimum Engine RPM" },
        { name: "maxRPM", type: "int", comment: "Maximum Engine RPM" },
        { name: "dragFactor", type: "float" },
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
        { name: "minRPM", type: "int", comment: "Idle / Minimum RPM" },
        { name: "maxRPM", type: "int", comment: "Maximum RPM" },
        { name: "idleRPM", type: "int" },
        { name: "spoolUpTime", type: "float" },
        { name: "spoolDownTime", type: "float" },
        { name: "consumption", type: "float" },
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
        { name: "careerSystem", type: "boolean", label: "Career & Transport System" },
      ],
      ignored: [],
    },
  }
];
