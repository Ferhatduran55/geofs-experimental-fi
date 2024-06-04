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
      style="paint-order:fill markers"
      d="M 5.101 15.347 C 2.964 16.627 1.651 20.48 4.784 22.347 L 18.428 22.427 L 18.34 27.221 L 14.479 29.308 L 14.454 32.061 L 15.93 33.312 L 24.341 33.439 L 25.637 32.184 L 25.606 29.62 L 21.474 27.133 L 21.513 22.427 L 35.197 22.387 C 38.144 20.244 36.826 17.341 35.356 15.585 L 22.554 15.521 L 23.117 12.941 L 21.93 11.38 L 19.954 10.848 L 18.043 11.497 L 16.884 12.976 L 17.333 15.443 L 5.101 15.347"
    />,
  ],
});
