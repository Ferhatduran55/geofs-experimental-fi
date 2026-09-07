import { createStore } from "solid-js/store";
import { onMount } from "solid-js";
import type { Component } from "solid-js";

import Storage from "./shared/Storage";
import Logger from "./shared/Logger";
import Notify from "./shared/Notify";
import { Container, Button } from "./layouts/Assistant";
import Toaster from "./components/Toaster";
import { ModalUI } from "./components/Modal";
import { core } from "./core/CoreEngine";
import { registerBuiltinModules } from "./modules";

const log = Logger.create("App");

const App: Component = () => {
  const [status, setStatus] = createStore({
    loading: true,
    ready: false,
    error: undefined as string | undefined,
  });

  const bootstrapApplication = async (): Promise<void> => {
    try {
      log.info("Bootstrapping GeoFS Flight Assistant Core...");

      // 1. Expose global namespace
      (unsafeWindow as any).flightAssistant = {
        version: typeof GM !== "undefined" && GM.info?.script?.version ? GM.info.script.version : "0.8.0",
        core,
        refs: {},
        instance: { icons: {} },
        status,
        Storage,
      };

      // 2. Register all built-in modules into CoreEngine
      registerBuiltinModules(core);

      // 3. Mount UI Frames
      Container();
      Button();

      // 4. Start CoreEngine (initializes GeoFSAdapter, Storage and all Modules)
      await core.start();

      setStatus({ ready: true, loading: false, error: undefined });
      Notify.successNow("Flight Assistant ready! ✈️");
      log.info("Flight Assistant bootstrapped successfully!");
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      log.error("Bootstrap error:", error);
      setStatus({ loading: false, ready: false, error: msg });
      Notify.errorNow(`Error starting Assistant: ${msg}`);
    }
  };

  onMount(() => {
    // Wait for GeoFS to signal readiness
    if (typeof (unsafeWindow as any).executeOnEventDone === "function") {
      (unsafeWindow as any).executeOnEventDone("geofsStarted", async () => {
        await bootstrapApplication();
      });
    } else {
      setTimeout(bootstrapApplication, 2000);
    }
  });

  return (
    <>
      <Toaster />
      <ModalUI />
    </>
  );
};

export default App;
