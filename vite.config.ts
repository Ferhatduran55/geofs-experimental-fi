import { defineConfig } from 'vite'
import solid from 'vite-plugin-solid'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

export default defineConfig({
  plugins: [
    solid(),
    cssInjectedByJsPlugin({
      injectCodeFunction: function injectCodeCustomRunTimeFunction(cssCode: string, options: any) {
        try {
          if (typeof document != 'undefined') {
            var elementStyle = document.createElement('style');

            for (const attribute in options.attributes) {
              elementStyle.setAttribute(attribute, options.attributes[attribute]);
            }

            elementStyle.appendChild(document.createTextNode(cssCode));
            document.head.appendChild(elementStyle);
          }
        } catch (e) {
          console.error('vite-plugin-css-injected-by-js', e);
        }
      }
    }),
  ],
  build: {
    rollupOptions: {
      input: "src/index.tsx",
      output: {
        entryFileNames: "[name].js",
      },
    },
  }
})
