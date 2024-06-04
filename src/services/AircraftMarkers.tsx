import options from "../assets/json/AircraftMarkerOptions";
import aircraftGroups from "../assets/json/AircraftGroups";
import aircraftIcons from "../assets/icons/aircraft";
import SvgToImgOptions from "../assets/json/SvgToImgOptions";

function defineMarkers() {
  for (let a in aircraftGroups)
    if (aircraftIcons[a]) {
      flightAssistant.instance.icons[a] = {
        url: aircraftIcons[a].render(SvgToImgOptions.user).toBase64(),
        ...options.user,
      };
      addSelfMarker(a);
    }
}
function addSelfMarker(a: string) {
  flightAssistant.instance.icons[a + "-self"] = {
    url: aircraftIcons[a].render(SvgToImgOptions.self).toBase64(),
    ...options.self,
  };
}
function getMarker(a: string, b: boolean = !1) {
  return flightAssistant.instance.icons[b ? a + "-self" : a];
}
function getGroup(a: string) {
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
