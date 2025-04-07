import { toast } from "solid-sonner";
import propsData from "./assets/json/Props";
import Props from "./classes/Props";
import Reactive from "./classes/Reactive";
import Aircraft from "./classes/Aircraft";
import { Container, Button } from "./layouts/Assistant";
import {
  defineMarkers,
  getGroup,
  getMarker,
  refreshMarker,
} from "./services/AircraftMarkers";
import Toaster from "./components/Toaster";

const App = () => {
  flightAssistant = {
    version: GM.info.script.version,
    refs: {},
    instance: {},
    aircraft: Aircraft,
  };

  Reactive.options = {
    cloneAfterCreation: true,
    temp: flightAssistant.instance,
  };

  unsafeWindow.executeOnEventDone("geofsStarted", function () {
    geofs.map.addPlayerMarker = function (a, b, c) {
      b || (b = getGroup(multiplayer.users[a].aircraft.toString()));
      ui.playerMarkers[a] ||
        ((b = {
          coords: [0, 0],
          icon: geofs.api.map.getIcon(b, getMarker(b)),
          label: c || "-",
        }),
        (ui.playerMarkers[a] = new geofs.api.map.marker(b)));
      geofs.api.map._map && this.mapActive && ui.playerMarkers[a].addToMap();
      return ui.playerMarkers[a];
    };
    const starter = new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          Props.load(propsData);
          Container();
          Button();
          defineMarkers();
          refreshMarker();
          Aircraft.refresh();
          resolve("Assistant Started.");
        } catch (e) {
          reject(e);
        }
      }, 5000);
    });
    toast.promise(starter, {
      loading: "Assistant is starting..",
      success: (data: unknown): string => data as string,
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
