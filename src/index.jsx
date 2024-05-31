/* @refresh reload */
import { render } from "solid-js/web";

import "@/assets/styles/index.css";

import App from "@/App";

const root = document.body;

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error("Root element not found.");
}

render(() => <App />, root);