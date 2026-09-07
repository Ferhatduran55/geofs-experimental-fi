import Props from "./Props";

export class Aircraft {
  static get instance(): any {
    return (unsafeWindow as any).geofs?.aircraft?.instance;
  }

  static refresh(): void {
    // GeoFS updates instance automatically
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

  static definitions(): any[] {
    const definitions = this.instance?.definition;
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

  static engines(): any[] {
    const engines = this.instance?.engines;
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
