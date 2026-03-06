

import { describe, it, expect, beforeEach } from "vitest";
import { defs } from "../assets/filters/AircraftMarkerDefs";
import Marker from "../classes/Marker";

const DEFAULT_PATH =
  "M 5.101 15.347 C 2.964 16.627 1.651 20.48 4.784 22.347 L 18.428 22.427 L 18.34 27.221 L 14.479 29.308 L 14.454 32.061 L 15.93 33.312 L 24.341 33.439 L 25.637 32.184 L 25.606 29.62 L 21.474 27.133 L 21.513 22.427 L 35.197 22.387 C 38.144 20.244 36.826 17.341 35.356 15.585 L 22.554 15.521 L 23.117 12.941 L 21.93 11.38 L 19.954 10.848 L 18.043 11.497 L 16.884 12.976 L 17.333 15.443 L 5.101 15.347";

const MARKER_CONFIG = {
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
};

const RENDER_OPTIONS = {
  children: {
    "path-0": {
      fill: "#ffc107",
      stroke: "#ffffff",
      strokeWidth: "0.5px",
    },
  },
};

describe("Marker Class", () => {
  let marker: Marker;

  
  beforeEach(() => {
    marker = new Marker({
      ...MARKER_CONFIG,
      defs: [defs.outline],
      children: [
        <path name="path-0" filters={[0]} d={DEFAULT_PATH}></path>,
      ],
    });
  });

  
  describe("Initialization", () => {
    it("should create a Marker instance", () => {
      expect(marker).toBeDefined();
      expect(marker).toBeInstanceOf(Marker);
    });

    it("should have correct props", () => {
      expect(marker.props.width).toBe(40);
      expect(marker.props.height).toBe(40);
      expect(marker.props.viewBox).toBe("0 0 40 40");
    });

    it("should have children", () => {
      expect(marker.hasChildren()).toBe(true);
    });

    it("should have defs", () => {
      expect(marker.props.defs).toBeDefined();
      expect(marker.props.defs.length).toBeGreaterThan(0);
    });
  });

  
  describe("Rendering", () => {
    it("should render without errors", () => {
      expect(() => marker.render(RENDER_OPTIONS)).not.toThrow();
    });

    it("should return Marker instance after render", () => {
      const result = marker.render(RENDER_OPTIONS);
      expect(result).toBe(marker);
    });

    it("should create SVG element", () => {
      marker.render(RENDER_OPTIONS);
      expect(marker.plane).toBeDefined();
      expect(marker.plane.tagName.toLowerCase()).toBe("svg");
    });

    it("should have correct dimensions", () => {
      marker.render(RENDER_OPTIONS);
      expect(marker.plane.getAttribute("width")).toBe("40");
      expect(marker.plane.getAttribute("height")).toBe("40");
    });
  });

  
  describe("Base64 Output", () => {
    it("should convert to Base64 string", () => {
      marker.render(RENDER_OPTIONS);
      const base64 = marker.toBase64();

      expect(base64).toBeDefined();
      expect(typeof base64).toBe("string");
    });

    it("should start with data:image/svg+xml;base64,", () => {
      marker.render(RENDER_OPTIONS);
      const base64 = marker.toBase64();

      expect(base64.startsWith("data:image/svg+xml;base64,")).toBe(true);
    });
  });

  
  describe("Cleanup", () => {
    it("should clear plane after clear()", () => {
      marker.render(RENDER_OPTIONS);
      expect(marker.plane).toBeDefined();

      marker.clear();
      expect(marker.plane).toBeNull();
    });
  });

  
  describe("Error Handling", () => {
    it("should throw error when rendering without children", () => {
      const emptyMarker = new Marker({
        ...MARKER_CONFIG,
        defs: [],
        children: [],
      });

      expect(() => emptyMarker.render(RENDER_OPTIONS)).toThrow(
        "Marker must have children"
      );
    });
  });
});
