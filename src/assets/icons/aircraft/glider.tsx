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
      d="M 19.379 15.812 C 19.444 14.978 20.585 14.995 20.644 15.869 L 20.761 18.971 C 21.713 18.887 35.793 19.418 35.913 19.479 C 36.8 19.932 36.096 20.578 35.889 20.577 C 35.888 20.577 20.713 21.155 20.713 21.155 L 20.47 27.107 C 21.332 27.712 22.318 28.887 21.939 28.85 L 18.043 28.842 C 17.652 28.875 18.651 27.784 19.522 27.112 L 19.162 21.152 L 3.91 20.643 C 3.479 20.6 2.919 19.876 3.875 19.484 C 3.875 19.484 18.355 18.958 19.162 19.021 L 19.379 15.812 Z"
    />,
  ],
});
