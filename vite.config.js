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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@classes": path.resolve(__dirname, "src/classes"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@styles": path.resolve(__dirname, "src/assets/styles"),
      "@json": path.resolve(__dirname, "src/assets/json"),
      "@icons": path.resolve(__dirname, "src/assets/icons"),
      "@services": path.resolve(__dirname, "src/components/services"),
    },
  },
});
