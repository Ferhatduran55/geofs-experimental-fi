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
      d="M 20 4 C 20.8 4 21.5 6 21.5 8 L 21.5 15 L 35 19 L 35 21 L 21.5 18 L 21.5 23 L 23.5 23 L 23.5 28 L 21.5 28 L 21.5 30 L 26 32 L 26 34 L 20 32.5 L 14 34 L 14 32 L 18.5 30 L 18.5 28 L 16.5 28 L 16.5 23 L 18.5 23 L 18.5 18 L 5 21 L 5 19 L 18.5 15 L 18.5 8 C 18.5 6 19.2 4 20 4 Z"
    />,
  ],
});
