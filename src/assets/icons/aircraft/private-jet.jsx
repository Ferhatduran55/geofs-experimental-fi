import { defs } from "@/assets/filters/AircraftMarkerDefs";
import { Marker } from "@/classes/Marker";

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
      d="M 18.285 17.094 L 7.606 19.124 C 7.458 19.101 6.512 22.72 6.591 22.734 L 16.329 22.745 L 16.713 28.721 L 18.329 28.721 L 19.154 26.824 L 19.154 30.819 L 17.715 32.479 L 17.715 35.51 L 15.777 36.742 L 15.581 38.299 L 20.034 37.312 L 24.645 38.299 L 24.406 36.742 L 22.393 35.51 L 22.393 32.479 L 20.997 30.776 L 20.997 26.824 L 21.794 28.721 L 23.379 28.721 L 23.748 22.745 L 33.575 22.745 C 33.698 22.713 32.732 19.024 32.61 19.056 L 21.794 17.12 L 21.741 4.909 C 21.537 3.741 21.594 3.461 20.997 2.507 C 20.734 2.088 20.505 1.829 20.031 1.7 C 19.591 1.847 19.399 2.045 19.154 2.507 C 18.692 3.377 18.6 3.594 18.329 4.895 L 18.285 17.094 Z"
    />,
  ],
});
