/// <reference types="vitest" />
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import path from "path";

export default defineConfig({
  plugins: [
    solidPlugin(),
    cssInjectedByJsPlugin({
      injectCode: (cssCode, options) => {
        return `try{if(typeof document != 'undefined'){GM.addStyle(${cssCode});}}catch(e){console.error('vite-plugin-css-injected-by-js', e);}`;
      },
    }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: "esnext",
    rollupOptions: {
      input: "src/index.jsx",
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  test: {
    // ...
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
