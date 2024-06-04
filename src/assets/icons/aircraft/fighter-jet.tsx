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
      style="paint-order: fill markers"
      d="M 19.745 4.207 C 19.819 3.899 20.298 2.806 20.654 4.205 C 20.921 5.256 21.28 7.204 21.28 7.247 C 21.28 7.317 24.835 10.529 25.08 10.757 C 25.323 10.99 25.029 11.865 24.871 11.805 L 21.911 11.006 C 21.503 11.12 23.396 18.508 23.573 18.733 C 23.759 19.18 32.785 28.852 32.57 28.708 C 32.784 29.296 32.515 31.546 32.435 31.33 C 32.419 31.437 24.948 32.67 24.143 32.52 C 23.45 32.313 21.734 32.018 21.734 32.095 L 20.199 35.862 L 18.579 32.108 C 18.484 32.021 16.159 32.567 15.963 32.596 C 15.771 32.626 7.871 31.262 7.926 31.295 C 7.76 31.368 7.538 28.83 7.718 28.747 L 16.511 19.141 C 16.888 18.946 18.961 11.135 18.225 11.043 L 15.319 11.771 C 15.064 11.771 15.195 10.47 15.446 10.47 L 19.041 7.227 L 19.745 4.207 Z"
    />,
  ],
});
