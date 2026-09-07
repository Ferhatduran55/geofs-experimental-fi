// 3D Destination Marker Engine completely removed as requested.
export const DESTINATION_MARKER_STORAGE_KEY = "destination_3d_marker";
export class DestinationMarkerEngine {
  static isEnabled: boolean = false;
  static async init(): Promise<void> {}
  static setEnabled(_val: boolean): void {}
  static startLoop(): void {}
  static stopLoop(): void {}
  static update(): void {}
}
export default DestinationMarkerEngine;
