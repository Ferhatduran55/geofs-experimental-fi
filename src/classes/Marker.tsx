class Marker {
  props: any;
  plane: any;
  constructor(props: any) {
    this.clear();
    this.props = props;
  }
  hasChildren() {
    return this.props.children.length > 0;
  }
  render(options: any) {
    if (!this.hasChildren()) throw new Error("Marker must have children");
    const { width, height, viewBox, defs, children } = this.props;
    this.plane = this.template("svg", {
      width: options.width ?? width,
      height: options.height ?? height,
      viewBox:
        viewBox ?? `0 0 ${options.width ?? width} ${options.height ?? height}`,
    });
    const fragment: any = document.createDocumentFragment();
    if (defs) {
      fragment.appendChild(this.template("defs"));
      for (const def of defs) {
        fragment.firstChild.appendChild(def);
      }
    }
    for (const { tagName, attributes } of children) {
      let _attributes: any = Array.from(attributes).reduce(
        (acc: any, attr: any) => ({ ...acc, [attr.name]: attr.value }),
        {}
      );
      let _child = this.template(tagName, _attributes);
      if (_attributes.filters) {
        _child.style.filter = `url(${this.defs(_attributes.filters)})`;
      }
      if (Object.keys(options.children).includes(_attributes.name)) {
        Object.entries(options.children[_attributes.name]).forEach(
          ([key, value]) => {
            _child.setAttributeNS(null, key, value);
          }
        );
      }
      fragment.appendChild(_child);
    }
    this.plane.appendChild(fragment);
    return this;
  }
  template(elementType: any, attributes = {}) {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      elementType
    );
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttributeNS(null, key, value);
    });
    return element;
  }
  defs(indexes: any) {
    return [
      this.props.defs
        .filter((index: number) => indexes.includes(index.toString()))
        .map((def: any) => `#${def.id}`),
    ].join(",");
  }
  clear() {
    this.plane = null;
  }
  toBase64() {
    return `data:image/svg+xml;base64,${btoa(
      new XMLSerializer().serializeToString(this.plane)
    )}`;
  }
}

export default Marker;