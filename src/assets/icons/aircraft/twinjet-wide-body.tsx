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
      d="M 20 2 C 21.5 2 23 6 23 10 L 23 15 L 25 15.8 L 25 13 L 28 13 L 28 17 L 38 21 L 38 24 L 23 19 L 23 32 L 30 36 L 30 38 L 20 36 L 10 38 L 10 36 L 17 32 L 17 19 L 2 24 L 2 21 L 12 17 L 12 13 L 15 13 L 15 15.8 L 17 15 L 17 10 C 17 6 18.5 2 20 2 Z"
    />,
  ],
});
