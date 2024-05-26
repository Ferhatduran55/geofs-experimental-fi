import { toast } from "solid-sonner";
import propsData from "@json/Props";
import { Props } from "@classes/Props";
import { Container, Button } from "@layouts/Assistant";
import { defineMarkers, getGroup, getMarker, refreshMarker } from "@services/AircraftMarkers";
import Toaster from "@components/Toaster";

const App = () => {
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
