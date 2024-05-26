export function getObjectFromPath(path) {
  const parts = path.split(".");
  let obj = unsafeWindow;
  for (let part of parts) {
    obj = obj[part];
    if (obj === undefined) {
      throw new Error(`Path ${path} does not exist`);
    }
  }
  return obj;
}

export function createSvgElement(elementType, attributes = {}) {
  const element = document.createElementNS(
    "http://www.w3.org/2000/svg",
    elementType
  );
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttributeNS(null, key, value);
  });
  return element;
}

export function svgToImg(a, b, c) {
  b || (b = {});
  c || (c = {});
  const icon = a;
  const svg = createSvgElement("svg", {
    width: b.size[0],
    height: b.size[1],
    viewBox: `0 0 ${b.size.join(" ")}`,
  });

  const defs = createSvgElement("defs");
  Object.values(c).forEach((def) => defs.appendChild(def));

  const path = createSvgElement("path", {
    fillRule: "nonzero",
    shapeRendering: "optimizeSpeed",
    fill: b.fill || undefined,
    filter: b.filters.length > 0 ? `url(${b.filters.join(",")})` : undefined,
    stroke: b.stroke || "rgb(255, 255, 255)",
    strokeWidth: b.strokeWidth || "1",
    strokeMiterlimit: "1",
    d: icon.getAttributeNS(null, "d"),
  });
  path.style = icon.getAttributeNS(null, "style");

  svg.appendChild(defs);
  svg.appendChild(path);
  const serializedSvg = new XMLSerializer().serializeToString(svg);
  return `data:image/svg+xml;base64,${btoa(serializedSvg)}`;
}
