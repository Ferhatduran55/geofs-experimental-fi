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
      d="M 20 2 C 21 2 22 5 22 8 L 22 14 L 36 19 L 36 22 L 22 18 L 22 32 L 28 35 L 28 37 L 20 35.5 L 12 37 L 12 35 L 18 32 L 18 18 L 4 22 L 4 19 L 18 14 L 18 8 C 18 5 19 2 20 2 Z M 20 16 C 21 16 22 17 22 18 C 22 19 21 20 20 20 C 19 20 18 19 18 18 C 18 17 19 16 20 16 Z"
    />,
  ],
});
