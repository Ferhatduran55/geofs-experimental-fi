

import { describe, it, expect } from "vitest";
import { promises as fs } from "fs";
import path from "path";
import icons from "../assets/icons/aircraft";
import type Marker from "../classes/Marker";

function extractPathFromMarker(marker: Marker): string {
  try {
    const child = marker.props.children[0];
    if (child && child.attributes) {
      const dAttr = Array.from(child.attributes).find(
        (attr: any) => attr.name === "d"
      ) as any;
      return dAttr?.value || "";
    }
  } catch {
    return "";
  }
  return "";
}

function loadIconData(): Array<{ name: string; path: string }> {
  return Object.entries(icons).map(([name, marker]) => ({
    name,
    path: extractPathFromMarker(marker as Marker),
  }));
}

const ICON_CATEGORIES = {
  fighters: ["fighter", "fighterJet"],
  commercial: [
    "twinjetNarrowBody",
    "twinjetNarrowBody2",
    "twinjetWideBody",
    "wideBody4Engine",
    "narrowBody4Engine",
  ],
  regional: ["regionalJet", "turbopropCommuter"],
  business: ["privateJet", "businessJet"],
  light: ["singleEngine", "twinPistonEngine", "glider"],
  special: ["trijet", "rearMountedTwinJet", "heavyCargo", "twinTurboprop"],
} as const;

describe("Aircraft Icons", () => {
  const iconData = loadIconData();
  const iconNames = iconData.map((i) => i.name);

  
  describe("Icon Count", () => {
    it("should have at least 19 aircraft icons", () => {
      expect(iconData.length).toBeGreaterThanOrEqual(19);
      console.log(`\n📊 Total icons loaded: ${iconData.length}`);
    });

    it("should have path data for all icons", () => {
      iconData.forEach(({ path }) => {
        expect(path).toBeDefined();
        expect(typeof path).toBe("string");
        expect(path.length).toBeGreaterThan(0);
      });
    });
  });

  
  describe("Icon Categories", () => {
    Object.entries(ICON_CATEGORIES).forEach(([category, names]) => {
      it(`should have all "${category}" icons`, () => {
        names.forEach((name) => {
          expect(iconNames).toContain(name);
        });
      });
    });
  });

  
  describe("SVG Path Validation", () => {
    iconData.forEach(({ name, path }) => {
      it(`should have valid SVG path for "${name}"`, () => {
        expect(path.trim()).toMatch(/^M\s/);
        const validCommands = /^[MLHVCSQTAZ\s\d.,\-]+$/i;
        expect(path).toMatch(validCommands);
      });
    });
  });

  
  describe("HTML Gallery Output", () => {
    it("should generate HTML gallery to dist/test-output/", async () => {
      const html = generateGalleryHTML(iconData);
      const outputDir = path.join(process.cwd(), "dist", "test-output");
      const outputPath = path.join(outputDir, "aircraft-icons.html");

      await fs.mkdir(outputDir, { recursive: true });
      await fs.writeFile(outputPath, html, "utf-8");

      const stats = await fs.stat(outputPath);
      expect(stats.isFile()).toBe(true);

      console.log(`\n✅ Gallery: ${outputPath}`);
    });
  });
});

function generateGalleryHTML(
  icons: Array<{ name: string; path: string }>
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aircraft Icons Gallery</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: system-ui, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      padding: 2rem;
      min-height: 100vh;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    h1 { text-align: center; margin-bottom: 0.5rem; color: #22d3ee; }
    .subtitle { text-align: center; color: #64748b; margin-bottom: 2rem; }
    .controls {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .control-group { display: flex; flex-direction: column; gap: 0.25rem; }
    .control-group label { font-size: 0.75rem; color: #94a3b8; }
    .control-group input[type="color"] {
      width: 60px; height: 30px;
      border: none; border-radius: 4px; cursor: pointer;
    }
    .control-group input[type="range"] { width: 120px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1rem;
    }
    .icon-card {
      background: #1e293b;
      border-radius: 8px;
      padding: 1rem;
      text-align: center;
      transition: transform 0.2s, box-shadow 0.2s;
      cursor: pointer;
    }
    .icon-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    }
    .icon-wrapper {
      width: 60px; height: 60px;
      margin: 0 auto 0.75rem;
      background: #334155;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-wrapper svg { width: 40px; height: 40px; }
    .icon-name { font-size: 0.75rem; color: #94a3b8; word-break: break-word; }
    .stats {
      text-align: center;
      margin-top: 2rem;
      padding: 1rem;
      background: #1e293b;
      border-radius: 8px;
      font-size: 0.875rem;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>✈️ Aircraft Icons</h1>
    <p class="subtitle">GeoFS Flight Assistant - ${icons.length} Icons</p>
    <div class="controls">
      <div class="control-group">
        <label>Fill Color</label>
        <input type="color" id="fillColor" value="#e74c3c">
      </div>
      <div class="control-group">
        <label>Stroke Color</label>
        <input type="color" id="strokeColor" value="#2c3e50">
      </div>
      <div class="control-group">
        <label>Stroke Width: <span id="strokeValue">1</span>px</label>
        <input type="range" id="strokeWidth" min="0.5" max="3" step="0.1" value="1">
      </div>
    </div>
    <div class="grid" id="grid">
      ${icons
        .map(
          ({ name, path }) => `
        <div class="icon-card">
          <div class="icon-wrapper">
            <svg viewBox="0 0 40 40">
              <path d="${path}" fill="#e74c3c" stroke="#2c3e50" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="icon-name">${name}</div>
        </div>`
        )
        .join("")}
    </div>
    <div class="stats">Generated by Aircraft Icons Test</div>
  </div>
  <script>
    const fill = document.getElementById('fillColor');
    const stroke = document.getElementById('strokeColor');
    const width = document.getElementById('strokeWidth');
    const widthVal = document.getElementById('strokeValue');
    function update() {
      document.querySelectorAll('.icon-card path').forEach(p => {
        p.setAttribute('fill', fill.value);
        p.setAttribute('stroke', stroke.value);
        p.setAttribute('stroke-width', width.value);
      });
      widthVal.textContent = width.value;
    }
    fill.addEventListener('input', update);
    stroke.addEventListener('input', update);
    width.addEventListener('input', update);
  </script>
</body>
</html>`;
}
