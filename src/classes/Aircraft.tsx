class Aircraft {
  static aircrafts: Geofs["aircraftList"] = geofs.aircraftList;
  static _instance: Geofs["aircraft"]["instance"];
  static _allowed: any = {
    definition: [
      { name: "airbrakesTravelTime", type: "float" },
      { name: "accessoriesTravelTime", type: "float" },
      { name: "flapsTravelTime", type: "float" },
      { name: "flapsSteps", type: "int" },
      { name: "gearTravelTime", type: "float" },
      { name: "zeroThrustAltitude", type: "int" },
      { name: "zeroRPMAltitude", type: "int" },
      { name: "mass", type: "int" },
      {
        name: "minRPM",
        type: "int",
        comment: "not recommended",
      },
      {
        name: "maxRPM",
        type: "int",
        comment: "not recommended",
      },
    ],
    engines: [
      { name: "thrust", type: "int" },
      { name: "afterBurnerThrust", type: "int" },
      { name: "reverseThrust", type: "int" },
    ],
  };
  get allowed() {
    return Aircraft._allowed;
  }
  get instance() {
    return Aircraft._instance;
  }
  set instance(value) {
    Aircraft._instance = value;
  }
  static refresh() {
    Aircraft._instance = geofs.aircraft.instance;
  }
  static definitions() {
    const definitions = this._instance.definition;
    if (!definitions) return [];
    const response = [];
    for (const item of Object.entries(definitions)) {
      let hasAllowed = this.allowed("definition", item[0]);
      if (hasAllowed) {
        response.push(item.concat(hasAllowed.type));
      }
    }
    return response;
  }
  static engines() {
    const engines = this._instance.engines;
    if (!engines) return [];
    const response = [];
    for (let i = 0; i < engines.length; i++) {
      let temp = [];
      for (const item of Object.entries(engines[i])) {
        let hasAllowed = this.allowed("engines", item[0]);
        if (hasAllowed) {
          temp.push(item.concat(hasAllowed.type));
        }
      }
      temp.length ? response.push(temp) : null;
    }
    return response;
  }
  static allowed(group: string, item: string) {
    return this._allowed[group].find((p: any) => p.name === item);  
  }
}

export default Aircraft;
