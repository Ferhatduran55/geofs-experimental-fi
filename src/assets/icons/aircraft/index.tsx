import def from "./default";
import fighter from "./fighter";
import fighterJet from "./fighter-jet";
import glider from "./glider";
import singleEngine from "./single-engine";
import twinPistonEngine from "./twin-piston-engine";
import privateJet from "./private-jet";
import twinTurboprop from "./twin-turboprop";
import twinjetNarrowBody from "./twinjet-narrow-body";
import twinjetNarrowBody2 from "./twinjet-narrow-body-2";
import rearMountedTwinJet from "./rear-mounted-twin-jet";
import wideBody4Engine from "./wide-body-4-engine";

const icons: AircraftMarkers = {
  default: def,
  fighter: fighter,
  fighterJet: fighterJet,
  glider: glider,
  singleEngine: singleEngine,
  twinPistonEngine: twinPistonEngine,
  privateJet: privateJet,
  twinTurboprop: twinTurboprop,
  twinjetNarrowBody: twinjetNarrowBody,
  twinjetNarrowBody2: twinjetNarrowBody2,
  rearMountedTwinJet: rearMountedTwinJet,
  wideBody4Engine: wideBody4Engine,
};

export default icons;
