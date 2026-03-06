

import { describe, it, expect, beforeEach } from "vitest";
import { createComponent } from "solid-js";
import { render } from "solid-js/web";
import Input from "../components/Input";

describe("Input Component", () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  
  describe("DOM Creation", () => {
    it("should create a valid DOM container", () => {
      expect(container).toBeDefined();
      expect(container instanceof HTMLDivElement).toBe(true);
    });
  });

  
  describe("Example Data", () => {
    const exampleData = {
      name: "example",
      resource: {
        example: "An example input component.",
      },
      type: "text",
      comment: "This is an example input component.",
    };

    it("should have valid example data structure", () => {
      expect(exampleData).toBeDefined();
      expect(exampleData.name).toBe("example");
      expect(exampleData.type).toBe("text");
    });

    it("should have resource object with example value", () => {
      expect(exampleData.resource).toBeDefined();
      expect(exampleData.resource.example).toBe("An example input component.");
    });

    it("should have comment property", () => {
      expect(exampleData.comment).toBe("This is an example input component.");
    });
  });

  
  describe("Component Rendering", () => {
    it("should render Input component without errors", () => {
      const props = {
        name: "test-input",
        resource: { "test-input": "Test Value" },
        type: "text",
        comment: "Test comment",
      };

      expect(() => {
        render(() => createComponent(Input, props as any), container);
      }).not.toThrow();
    });
  });
});
