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
      d="M 20 2 C 20.8 2 21.8 5 21.8 8 L 21.8 15 L 36 22 L 36 24 L 21.8 19 L 21.8 25 L 24.5 25 L 24.5 31 L 21.8 30 L 21.8 33 L 27 36 L 27 38 L 20 37 L 13 38 L 13 36 L 18.2 33 L 18.2 30 L 15.5 31 L 15.5 25 L 18.2 25 L 18.2 19 L 4 24 L 4 22 L 18.2 15 L 18.2 8 C 18.2 5 19.2 2 20 2 Z"
    />,
  ],
});
