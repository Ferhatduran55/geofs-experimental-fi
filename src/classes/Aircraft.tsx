import Props from "./Props";

class Aircraft {
  static aircrafts: Geofs["aircraftList"] = geofs.aircraftList;
  static _instance: Geofs["aircraft"]["instance"];

  get instance() {
    return Aircraft._instance;
  }
  
  set instance(value) {
    Aircraft._instance = value;
  }
  
  static refresh() {
    Aircraft._instance = geofs.aircraft.instance;
  }
  
  static getAllowed(group: string): any[] {
    const propsData = Props._data;
    const groupName = group === "definition" ? "Definition" : "Engines";
    return propsData[groupName]?.allowed || [];
  }
  
  static isAllowed(group: string, itemName: string): any {
    const allowed = this.getAllowed(group);
    return allowed.find((p: any) => p.name === itemName);
  }
  
  static definitions() {
    const definitions = this._instance?.definition;
    if (!definitions) return [];
    
    const response = [];
    for (const [name, value] of Object.entries(definitions)) {
      const allowedItem = this.isAllowed("definition", name);
      if (allowedItem) {
        response.push([name, value, allowedItem.type]);
      }
    }
    return response;
  }
  
  static engines() {
    const engines = this._instance?.engines;
    if (!engines) return [];
    
    const response = [];
    for (let i = 0; i < engines.length; i++) {
      const engineProps = [];
      for (const [name, value] of Object.entries(engines[i])) {
        const allowedItem = this.isAllowed("engines", name);
        if (allowedItem) {
          engineProps.push([name, value, allowedItem.type]);
        }
      }
      if (engineProps.length) {
        response.push(engineProps);
      }
    }
    return response;
  }
}

export default Aircraft;
