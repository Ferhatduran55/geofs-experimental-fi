import { toast } from "solid-toast";
import Storage from "@utils/Storage";
import ReactiveProps from "@json/ReactiveProps";
import { Reactive } from "@classes/Reactive";
import { Container, Button } from "@components/Assistant";
import { Toaster } from "@components/Toaster";

const App = () => {
  Storage.config(import.meta.env.VITE_STORAGE_VERSION, {
    prefix: import.meta.env.VITE_STORAGE_PREFIX,
  });

  const flightAssistant = {
    version: GM.info.script.version,
    state: {},
    instance: {},
  };

  Reactive.options = {
    cloneAfterCreation: true,
    temp: flightAssistant.instance,
  };

  unsafeWindow.executeOnEventDone("geofsInitialized", function () {
    Container();
    Button();
  });

  unsafeWindow.executeOnEventDone("geofsStarted", function () {
    const starter = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          Reactive.props = ReactiveProps;
          Reactive.all();
          resolve("Assistant Started.");
        } catch (e) {
          reject(e);
        }
      }, 5000);
    });
    toast.promise(starter, {
      loading: "Assistant is starting..",
      success: (data) => `Success: ${data}`,
      error: (err) => `Error: ${err.message}`,
    });
  });
  unsafeWindow.flightAssistant = flightAssistant;

  return (
    <>
      <Toaster />
    </>
  );
};

export default App;
