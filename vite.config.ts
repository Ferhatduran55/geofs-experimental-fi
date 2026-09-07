import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    solid(),
    cssInjectedByJsPlugin({
      injectCodeFunction: function injectCodeCustomRunTimeFunction(
        cssCode: string,
        options: any
      ) {
        try {
          if (typeof document != "undefined") {
            var elementStyle = document.createElement("style");

            for (const attribute in options.attributes) {
              elementStyle.setAttribute(
                attribute,
                options.attributes[attribute]
              );
            }

            elementStyle.appendChild(document.createTextNode(cssCode));
            document.head.appendChild(elementStyle);
          }
        } catch (e) {
          console.error("vite-plugin-css-injected-by-js", e);
        }
      },
    }),
  ],
  build: {
    // Inline all assets as base64
    assetsInlineLimit: 1024 * 1024, // 1MB
    rollupOptions: {
      input: {
        index: "src/index.tsx",
      },
      output: {
        entryFileNames: "[name].js",
        inlineDynamicImports: true,
      },
    },
  },
});
