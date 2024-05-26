import { svgToImg } from "@utils/Misc";
import options from "@json/AircraftMarkerOptions";
import aircraftGroups from "@json/AircraftGroups";
import aircraftIcons from "@icons/aircraft";
import SvgToImgOptions from "../assets/json/SvgToImgOptions";
function defineMarkers() {
  for (let a in aircraftGroups)
    if (aircraftIcons.icons[a]) {
      flightAssistant.instance.icons[a] = {
        url: svgToImg(
          aircraftIcons.icons[a],
          SvgToImgOptions.user,
          aircraftIcons.defs
        ),
        ...options.user,
      };
      addSelfMarker(a);
    }
}
function addSelfMarker(a) {
  flightAssistant.instance.icons[a + "-self"] = {
    url: svgToImg(
      aircraftIcons.icons[a],
      SvgToImgOptions.self,
      aircraftIcons.defs
    ),
    ...options.self,
  };
}
function getMarker(a, b) {
  return flightAssistant.instance.icons[b ? a + "-self" : a];
}
function getGroup(a) {
  for (let b in aircraftGroups)
    if (aircraftGroups[b].includes(a)) {
      return b;
    }
  return "default";
}
function refreshMarker() {
  let g = getGroup(flightAssistant.instance.id);
  geofs.map.planeMarker && geofs.map.planeMarker.destroy();
  geofs.map.planeMarker = new geofs.api.map.marker({
    zIndex: 1e3,
    icon: geofs.api.map.getIcon(g + "-self", getMarker(g, !0)),
  });
  geofs.map.planeMarker.addToMap();
}
export { defineMarkers, getGroup, getMarker, refreshMarker };
