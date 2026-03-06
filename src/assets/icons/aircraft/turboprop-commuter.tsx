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
      d="M 20 2 L 21.7 5 L 21.7 12 L 23.5 12 L 23.5 11 L 25 11 L 25 13.5 L 37 18 L 37 20.5 L 25 17 L 23.5 17.5 L 21.7 18 L 21.7 29 L 27 31.5 L 27 33.5 L 20 32 L 13 33.5 L 13 31.5 L 18.3 29 L 18.3 18 L 16.5 17.5 L 15 17 L 3 20.5 L 3 18 L 15 13.5 L 15 11 L 16.5 11 L 16.5 12 L 18.3 12 L 18.3 5 L 20 2 Z"
    />,
  ],
});
