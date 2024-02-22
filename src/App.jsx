import { toast } from "solid-toast";
import Storage from "@utils/Storage";
import ReactiveProps from "@json/ReactiveProps";
import { Reactive } from "@classes/Reactive";
import { Assistant } from "@classes/Assistant";
import { Toaster } from "@components/Toaster";

const environment = import.meta.env;

const App = () => {
  Storage.config(environment.VITE_STORAGE_VERSION, {
    prefix: environment.VITE_STORAGE_PREFIX,
  });

  const flightAssistant = {
    Assistant,
    Storage,
    Reactive,
    toast: toast,
    instance: {},
  };

  Reactive.options = {
    cloneAfterCreation: true,
    temp: flightAssistant.instance,
  };

  unsafeWindow.executeOnEventDone("geofsInitialized", function () {
    Assistant.init();
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
    <div>
      <Toaster />
    </div>
  );
};

export default App;
