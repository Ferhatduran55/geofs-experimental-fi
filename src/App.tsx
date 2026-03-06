import { createStore } from "solid-js/store";
import { createTimer } from "@solid-primitives/timer";
import { raceTimeout } from "@solid-primitives/promise";
import type { Component } from "solid-js";

import propsData from "./assets/json/Props";
import Props from "./classes/Props";
import Reactive from "./classes/Reactive";
import Aircraft from "./classes/Aircraft";
import Storage from "./classes/Storage";
import Notify from "./classes/Notify";
import Logger from "./classes/Logger";
import { Container, Button, reloadUI } from "./layouts/Assistant";
import { refreshMarker } from "./services/AircraftMarkers";
import Toaster from "./components/Toaster";

const log = Logger.create("App");

const App: Component = () => {
  const [status, setStatus] = createStore({
    loading: true,
    ready: false,
    initDelay: 5000,
    error: undefined as string | undefined,
  });

  const initializeApplication = (): void => {
    Storage.config(GM.info.script.version, { prefix: "geofs_efi_" });
    log.info(`Storage initialized v${GM.info.script.version} with prefix: "geofs_efi_"`);

    flightAssistant = {
      version: GM.info.script.version,
      refs: {},
      instance: {},
      status: status,
      Storage: Storage as any,
    };
  };

  const initializeComponents = (): void => {
    Props.load(propsData);
    Container();
    Button();
    if (!flightAssistant.instance.icons) {
      flightAssistant.instance.icons = {};
    }

    Aircraft.refresh();

    setStatus({ ...status, ready: true, loading: false });
  };

  const handleInitializationError = (error: unknown): void => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    setStatus({
      ...status,
      loading: false,
      error: errorMessage,
    });
  };

  const startApplication = async (): Promise<void> => {
    const starter = new Promise<string>((resolve, reject) => {
      createTimer(
        () => {
          try {
            initializeComponents();
            resolve("Flight Assistant started successfully!");
          } catch (error) {
            handleInitializationError(error);
            reject(error);
          }
        },
        () => status.initDelay,
        setTimeout
      );
    });
    const starterWithTimeout = raceTimeout(starter, status.initDelay * 2, true, "Initialization timeout");
    await Notify.promise(starterWithTimeout, {
      loading: "Flight Assistant is starting...",
      success: (data: string) => data,
      error: (err: Error) => `Error: ${err.message}`,
    });
  };

  const setupAircraftMonitoring = (): void => {
    let lastAircraftId: string | null = null;

    const checkAircraftChange = (): void => {
      const currentAircraftId = unsafeWindow.geofs?.aircraft?.instance?.id;

      if (currentAircraftId && currentAircraftId !== lastAircraftId) {
        if (lastAircraftId !== null) {
          log.info("Aircraft changed, cleaning up and reloading reactive properties");
          Props.cleanup();
          Reactive.cleanup();
          flightAssistant.instance.icons = {};
          setTimeout(async () => {
            try {
              await Props.load(propsData);
              log.info("Reactive properties reloaded");
              setTimeout(() => {
                log.debug("Triggering UI reload...");
                reloadUI();
                refreshMarker();
                Notify.successNow("Aircraft changed, configuration reloaded!");
              }, 500);
            } catch (error) {
              log.error("Error reloading reactive properties:", error);
              Notify.errorNow("Error reloading configuration");
            }
          }, 1000);
        }
        lastAircraftId = currentAircraftId;
      }
    };

    raceTimeout(
      createTimer(
        checkAircraftChange,
        () => (status.ready ? 1000 : false),
        setInterval
      ),
      1000
    );
  };

  initializeApplication();

  unsafeWindow.executeOnEventDone("geofsStarted", async (): Promise<void> => {
    await startApplication();
  });

  unsafeWindow.flightAssistant = flightAssistant;

  setupAircraftMonitoring();

  return (
    <>
      <Toaster />
    </>
  );
};

export default App;
