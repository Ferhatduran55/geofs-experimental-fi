import { toast } from "solid-sonner";
//import Storage from "@utils/Storage";
import propsData from "@json/Props";
import { Props } from "@classes/Props";
import { Container, Button } from "@layouts/Assistant";
import Toaster from "@components/Toaster";

const App = () => {
  /*Storage.config(import.meta.env.VITE_STORAGE_VERSION, {
    prefix: import.meta.env.VITE_STORAGE_PREFIX,
  });*/

  const flightAssistant = {
    version: GM.info.script.version,
    refs: {},
    instance: {},
  };

  Props.reactive.options = {
    cloneAfterCreation: true,
    temp: flightAssistant.instance,
  };

  unsafeWindow.executeOnEventDone("geofsStarted", function () {
    const starter = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          Props.load(propsData);
          Container();
          Button();
          resolve("Assistant Started.");
        } catch (e) {
          reject(e);
        }
      }, 5000);
    });
    toast.promise(starter, {
      loading: "Assistant is starting..",
      success: (data) => data,
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
