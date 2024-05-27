import def from "./default";
import fighter from "./fighter";
import fighterJet from "./fighter-jet";
import glider from "./glider";
import singleEngine from "./single-engine";
import twinPistonEngine from "./twin-piston-engine";
import privateJet from "./private-jet";
import twinTurboprop from "./twin-turboprop";
import twinjetNarrowBody from "./twinjet-narrow-body";
import rearMountedTwinJet from "./rear-mounted-twin-jet";
import wideBody4Engine from "./wide-body-4-engine";

const defs = {
  outline: (
    <filter
      id="outline-filter-0"
      color-interpolation-filters="sRGB"
      x="-50%"
      y="-50%"
      width="200%"
      height="200%"
    >
      <title>Outline</title>
      <feMorphology
        in="SourceAlpha"
        result="dilated"
        radius="1"
        operator="dilate"
        x="0"
      ></feMorphology>
      <feFlood result="flood" style="flood-opacity: 0.39;"></feFlood>
      <feComposite
        in="flood"
        in2="dilated"
        operator="in"
        result="outline"
        x="0"
        y="0"
      ></feComposite>
      <feMerge result="merge-0">
        <feMergeNode in="outline"></feMergeNode>
        <feMergeNode in="SourceGraphic"></feMergeNode>
      </feMerge>
    </filter>
  ),
};
const icons = {
  default: def,
  fighter: fighter,
  "fighter-jet": fighterJet,
  glider: glider,
  "single-engine": singleEngine,
  "twin-piston-engine": twinPistonEngine,
  "private-jet": privateJet,
  "twin-turboprop": twinTurboprop,
  "twinjet-narrow-body": twinjetNarrowBody,
  "rear-mounted-twin-jet":rearMountedTwinJet,
  "wide-body-4-engine": wideBody4Engine,
};

export default { defs, icons };
