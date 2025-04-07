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
      d="M 20 4 C 20.36 4 21 5 21 5 C 21 5 22 6.5 22 8 L 22 15.5 L 24 16 L 24 14 C 24 13.5 25.49 13.5 25.49 14 L 25.49 16.5 L 27 17 L 27 15 C 27 14.5 28.5 14.5 28.5 15 L 28.5 17.5 L 36 20 C 36.268 20 36.268 22 36 22 L 22 20.5 L 22 26 C 22 26 22 29 21 34 L 27 37 L 27 39 L 20 37.5 L 13 39 L 13 37 L 19 34 C 18 29 18 26 18 26 L 18 20.5 L 4 22 C 3.81 22 3.82 20 4 20 L 11.503 17.5 L 11.503 15 C 11.503 14.5 13 14.5 13 15 L 13 17 L 14.447 16.5 L 14.447 14 C 14.447 13.5 16 13.5 16 14 L 16 16 L 18 15.5 L 18 8 C 18 6.5 19 5 19 5 C 19 5 19.644 4 20 4 Z"
    />,
  ],
});
