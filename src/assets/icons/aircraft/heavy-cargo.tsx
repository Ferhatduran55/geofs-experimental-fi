import { defs } from "../../../assets/filters/AircraftMarkerDefs";
import Marker from "../../../classes/Marker";

export default new Marker({
  width: 40,
  height: 40,
  viewBox: "0 0 40 40",
  defs: [defs.outline],
  children: [
    <path
      name="path-0"
      filters={[0]}
      style="paint-order:fill markers;stroke-linecap: round; stroke-linejoin: round;"
      d="M 20 3 C 20.8 3 21.5 6 21.5 9 L 21.5 14 L 23.5 14.5 L 23.5 12 L 26 12 L 26 15.5 L 38 20 L 38 23 L 21.5 18 L 21.5 31 L 29 35 L 29 37 L 20 35 L 11 37 L 11 35 L 18.5 31 L 18.5 18 L 2 23 L 2 20 L 14 15.5 L 14 12 L 16.5 12 L 16.5 14.5 L 18.5 14 L 18.5 9 C 18.5 6 19.2 3 20 3 Z"
    />,
  ],
});
