declare const GRAVITY: number;
declare const DEGREES_TO_RAD: number;
declare const RAD_TO_DEGREES: number;
declare const KMH_TO_MS: number;
declare const METERS_TO_FEET: number;
declare const METERS_TO_NM: number;
declare const FEET_TO_METERS: number;
declare const LONGITUDE_TO_HOURS: number;
declare const EPSILON: number;
declare const ONE_MINUS_EPSILON: number;
declare const MERIDIONAL_RADIUS: number;
declare const EARTH_CIRCUMFERENCE: number;
declare const METERS_TO_LOCAL_LAT: number;
declare const STANDARD_GLIDE_ANGLE: number;
declare const GLIDE_SLOPE: number;
declare const invE: number;
declare const PI: number;
declare const HALF_PI: number;
declare const TWO_PI: number;
declare const ONE_OVER_TWO_PI: number;
declare const ONE_OVER_PI: number;
declare const MS_TO_FEETMINUTE: number;
declare const MS_TO_KNOTS: number;
declare const KNOTS_TO_MS: number;
declare const KMH_TO_KNOTS: number;
declare const KELVIN_OFFSET: number;
declare const TEMPERATURE_LAPSE_RATE: number;
declare const AIR_DENSITY_SL: number;
declare const AIR_PRESSURE_SL: number;
declare const AIR_TEMP_SL: number;
declare const DRAG_CONSTANT: number;
declare const MIN_DRAG_COEF: number;
declare const PLANFORM_EFFICIENCY_FACTOR: number;
declare const TOTAL_DRAG_CONSTANT: number;
declare const SPEED_OF_SOUND: number;
declare const IDEAL_GAS_CONSTANT: number;
declare const MOLAR_MASS_DRY_AIR: number;
declare const GAS_CONSTANT: number;
declare const GM_RL: number;
declare const DEFAULT_AIRFOIL_ASPECT_RATIO: number;
declare const WATER_DENSITY: number;
declare const FOV: number;
declare const VIEWPORT_REFERENCE_WIDTH: number;
declare const VIEWPORT_REFERENCE_HEIGHT: number;
declare const SMOOTHING_FACTOR: number;

declare const AXIS_TO_INDEX: { X: number; Y: number; Z: number };
declare const AXIS_TO_VECTOR: { X: number[]; Y: number[]; Z: number[] };
declare const ZUPAxis: { X: string; Y: string; Z: string };
declare const YUPAxis: { X: string; Y: string; Z: string };
declare const SIX_STEP_WARNING: string[];

declare let SHADOWS_NONE: number;
declare let SHADOWS_ALL: number;
declare let SHADOWS_CAST: number;
declare let SHADOWS_RECEIVE: number;
declare let SMOOTH_BUFFER: Record<string, any>;
declare let geofsShaders: Record<string, string>;

interface Math {
    sign(e: number): number;
    maxAbsValue(e: number, t: number): number;
    arrayToPrecision(e: any[], t: number): any[];
    parity(e: number): boolean;
}

declare namespace V2 {
    function add(e: number[], t: number[]): number[];
    function sub(e: number[], t: number[]): number[];
    function length(e: number[]): number;
    function fastLengthApprox(e: number[]): number;
    function scale(e: number[], t: number): number[];
    function parseInt(e: number[]): number[];
    function round(e: number[]): number[];
    function div(e: number[], t: number[]): number[];
}

declare namespace V3 {
    function isValid(e: any): boolean;
    function dup(e: number[]): number[];
    function toString(e: number[]): string;
    function nearlyEqual(e: number[], t: number[], a?: number): boolean;
    function abs(e: number[]): number[];
    function cross(e: number[], t: number[]): number[];
    function dot(e: number[], t: number[]): number;
    function add(e: number[], t: number[]): number[];
    function addAngles(e: number[], t: number[]): number[];
    function sub(e: number[], t: number[]): number[];
    function mult(e: number[], t: number[]): number[];
    function scale(e: number[], t: number): number[];
    function length(e: number[]): number;
    function normalize(e: number[]): number[];
    function bisect(e: number[], t: number[]): number[];
    function rotate(e: number[], t: number[], a: number): number[];
    function toRadians(e: number[]): number[];
    function toDegrees(e: number[]): number[];
    function clamp(e: number[], t: number, a: number): number[];
    function span(e: number[], t: number, a: number): number[];
    function exponentialSmoothing(e: string, t: number[], a: number, o: number[], n?: number): number[];
    function sqrt(e: number[]): number[];
}

declare namespace M33 {
    let ZupToYup: number[][];
    function toString(e: number[][]): string;
    function toM4(e: number[][]): number[];
    function toArray(e: number[][]): number[];
    function toRowMajorArray(e: number[][]): number[];
    function fromColumnMajorArray(e: number[]): number[][];
    function fromRowMajorArray(e: number[]): number[][];
    function identity(): number[][];
    function dup(e: number[][]): number[][];
    function nearlyEqual(e: number[][], t: number[][]): boolean;
    function transpose(e: number[][]): number[][];
    function add(e: number[][], t: number[][]): number[][];
    function multiplyV(e: number[][], t: number[]): number[];
    function multiply(e: number[][], t: number[][]): number[][];
    function scaled(e: number[][], t: number[]): number[][];
    function transform(e: number[][], t: number[]): number[];
    function rotationXYZ(e: number[][], t: number[]): number[][];
    function rotationX(e: number[][], t: number): number[][];
    function rotationY(e: number[][], t: number): number[][];
    function rotationZ(e: number[][], t: number): number[][];
    function rotationParentFrameX(e: number[][], t: number): number[][];
    function rotationParentFrameY(e: number[][], t: number): number[][];
    function rotationParentFrameZ(e: number[][], t: number): number[][];
    function rotate(e: number[][], t: number[], a: number): number[][];
    function transformByTranspose(e: number[][], t: number[]): number[];
    function makeOrthonormalFrame(e: number[], t: number[]): number[][];
    function setFromEuler(e: number[]): number[][];
    function getOrientation(e: number[][]): number[];
    function toEuler(e: number[][]): number[];
    function toMatrix(e: number[][]): number[][];
    function toYup(e: number[][]): number[][];
}

declare namespace M3 {
    function identity(): number[];
    function sub(e: number[], t: number[]): number[];
    function add(e: number[], t: number[]): number[];
    function dup(e: number[]): number[];
    function scale(e: number[], t: number): number[];
    function toM33(e: number[]): number[][];
    function snapToUnit(e: number[]): number[];
}

declare namespace M4 {
    function fromRowMajorArray(e: number[]): number[][];
    function fromColumnMajorArray(e: number[]): number[][];
}

declare namespace S2 {
    function identity(): { x: number; y: number };
    function mult(e: { x: number; y: number }, t: { x: number; y: number }): { x: number; y: number };
    function add(e: { x: number; y: number }, t: { x: number; y: number }): { x: number; y: number };
    function scale(e: { x: number; y: number }, t: number): { x: number; y: number };
}

declare function absMin(e: number, t: number): number;
declare function span(e: number, t: number, a: number): number;
declare function boundHours24(e: number): number;
declare function fixAngle(e: number): number;
declare function fixAngle360(e: number): number;
declare function fixAngles360(e: number[]): number[];
declare function fixAngles(e: number[]): number[];
declare function exponentialSmoothing(e: string, t: number, a?: number, o?: number, n?: number): number;
declare function getBuildingCollision(e: any): any;
declare function xyz2lla(e: number[], t: number[]): number[];
declare function xy2ll(e: number[], t: number[]): number[];
declare function lla2xyz(e: number[], t: number[]): number[];
declare function ll2xy(e: number[], t: number[]): number[];
declare function clamp(e: number, t: number, a: number): number;
declare function incrementToStop(e: number, t: number, a: number): number;
declare function snapToUnit(e: number): number;
declare function geoDecodeLocation(e: string, t: Function): void;
declare function lookAt(e: number[], t: number[], a: number[]): number[];
declare function getURLParameters(): Record<string, string>;
declare function clone(e: any): any;
declare function fireBasicEvent(eventName: string): void;

declare class Object3D {
    constructor(e?: any);
    _name: string;
    _nodeName: string;
    _children: any[];
    _points: Record<string, any>;
    _collisionPoints: any[];
    visible: boolean;
    _options: any;
    model: any;
    worldRotation: number[][];
    worldPosition: number[];
    worldScale: number[];
    _rotation: number[][];
    _position: number[];
    _scale: number[];
    _initialRotation: number[][];
    _initialPosition: number[];
    _initialScale: number[];
    _modeOnlyRotation: number[][];
    _nodeOrigin: number[];
    _scaleOffset: number;
    _node: any;
    _light: any;
    lla: number[];
    htr: number[];

    reset(): void;
    setInitialRotation(e?: number[]): void;
    setModelOnlyRotation(e?: number[]): void;
    rotateInitialRotation(e?: number[]): void;
    rotate(e: number[]): void;
    rotateX(e: number): void;
    rotateY(e: number): void;
    rotateZ(e: number): void;
    setRotationX(e: number): void;
    setRotationY(e: number): void;
    setRotationZ(e: number): void;
    rotateParentFrameX(e: number): void;
    rotateParentFrameY(e: number): void;
    rotateParentFrameZ(e: number): void;
    getRotation(): number[][];
    setInitialPosition(e?: number[]): void;
    setInitialScale(e?: number | number[]): void;
    scale(e: number | number[], t?: boolean): void;
    setPosition(e: number[]): void;
    translate(e: number[]): void;
    setTranslation(e: number[]): void;
    setScale(e: number | number[], t?: boolean): void;
    getScale(): number[];
    setOpacity(e: number): void;
    setScaleOffset(e: number, t?: boolean): void;
    getPosition(): number[];
    getLocalPosition(): number[];
    resetAnimatedTransform(): void;
    resetRotationMatrix(): void;
    setPoint(e: string, t: any): void;
    setVectorWorldPosition(e: any): number[];
    compute(e: number[]): void;
    render(e: number[]): void;
    setModel(e: any): void;
    getModel(e?: any): any;
    getNode(): any;
    getNodePosition(): number[];
    getNodeRotation(): number[][];
    setLight(e: any): void;
    getWorldFrame(): number[][];
    getWorldPosition(): number[];
    getLlaLocation(): number[];
    addChild(e: Object3D): void;
    setVisibility(e: boolean, t?: boolean): void;
    findModelInAncestry(): any;
    getParent(): Object3D;
    propagateToTree(e: string, t: any[]): void;
    destroy(): void;

    static utilities: {
        getPointLla(e: any, t: any): number[];
    };
}

declare class rigidBody {
    mass: number;
    s_inverseMass: number;
    minLinearVelocity: number;
    minAngularVelocity: number;
    impulseQueue: any[];
    v_linearVelocity: number[];
    v_angularVelocity: number[];
    v_totalForce: number[];
    v_totalTorque: number[];
    v_prevLinearVelocity: number[];
    v_prevAcceleration: number[];
    v_prevAngularVelocity: number[];
    v_acceleration: number[];
    v_jerk: number[];
    v_angularAcceleration: number[];
    v_localInvInertia: number[];
    gravityForce: number[];
    m_worldInvInertiaTensor: number[][];
    savedLinearVelocity: number[];
    savedAngularVelocity: number[];

    reset(): void;
    setMassProps(e: number, t: number[] | number): void;
    getLinearVelocity(): number[];
    getAngularVelocity(): number[];
    getLinearAcceleration(): number[];
    getAngularAcceleration(): number[];
    setLinearVelocity(e: number[]): void;
    setAngularVelocity(e: number[]): void;
    setLinearAcceleration(e: number[]): void;
    setAngularAcceleration(e: number[]): void;
    getVelocityInLocalPoint(e: number[]): number[];
    getForceInLocalPoint(e: number[]): number[];
    applyCentralForce(e: number[]): void;
    applyTorque(e: number[]): void;
    applyForce(e: number[], t: number[]): void;
    applyCentralImpulse(e: number[]): void;
    applyTorqueImpulse(e: number[]): void;
    applyImpulse(e: number[], t: number[]): void;
    queueImpulse(e: number[], t: number[]): void;
    clearImpulseQueue(): void;
    applyImpulseQueue(): void;
    computeJacobian(e: number, t: number, a: number[], o: number[]): number;
    computeImpulse(e: number, t: number, a: number[], o: number[]): number[];
    integrateVelocities(e: number): void;
    integrateTransform(e: number): void;
    updateInertiaTensor(): void;
    setCurrentAcceleration(e: number, t: number): void;
    clearForces(): void;
    saveState(): void;
    restoreState(): void;
}

declare class PID {
    constructor(p: number, i: number, d: number);
    _kp: number;
    _ki: number;
    _kd: number;
    _minOutput: number;
    _maxOutput: number;
    _target: number;
    _integral: number;
    _previousInput: number;

    set(target: number, min: number, max: number): void;
    initialize(current: number, target: number): void;
    compute(current: number, dt: number): number;
    reset(): void;
}

declare class Overlay {
    constructor(e: any, t?: any, a?: any);
    definition: any;
    parent: Overlay | null;
    container: any;
    compositor: any;
    compositorLayer: any;
    children: Overlay[];
    opacity: number;
    rotation: number;
    position: { x: number, y: number };
    size: { x: number, y: number };
    anchor: { x: number, y: number };
    scale: { x: number, y: number };
    offset: { x: number, y: number };

    create(): void;
    destroy(): void;
    hide(): void;
    show(): void;
    setVisibility(e: boolean): void;
    setOpacity(e: number): void;
    animate(e?: any): void;
    translateIcon(e: number, t: string): void;
    scaleAllProperties(): void;
    scaleAndPlace(e?: any, t?: any, a?: any, o?: boolean): void;
    place(e?: any, t?: any): void;
    scaleFromParent(e: any): any;
    positionFromParentRotation(): any;
}

declare class Indicator {
    constructor(e: any);
    definition: InstrumentDef;
    overlay: Overlay;
    visibility: boolean;
    scale(): void;
    show(): void;
    hide(): void;
    setVisibility(e: boolean): void;
    updateCockpitPosition(): void;
    update(e?: any): void;
    destroy(): void;
}

declare interface AnimationDef {
    type: string;
    value?: string;
    ratio?: number;
    offset?: number;
    min?: number;
    max?: number;
    function?: string;
    eq?: any;
    notEq?: any;
}

declare interface OverlayDef {
    url?: string;
    class?: string;
    anchor?: { x: number; y: number };
    position?: { x: number; y: number };
    size?: { x: number; y: number };
    rescale?: boolean;
    rescalePosition?: boolean;
    animations?: AnimationDef[];
    overlays?: OverlayDef[];
    alignment?: { x?: string; y?: string };
}

declare interface InstrumentDef {
    name: string;
    container?: string;
    stackX?: boolean;
    stackY?: boolean;
    group?: string;
    compositors?: string;
    visibility?: boolean;
    cockpit?: {
        position: { x: number; y: number; z: number };
        scale: number;
    };
    animations?: AnimationDef[];
    overlay?: OverlayDef;
    onInit?: () => void;
    onDestroy?: () => void;
    onUpdate?: () => void;
    onShow?: () => void;
    onHide?: () => void;
}

declare class Validator {
    isValid(coordinates: string): boolean;
    validate(coordinates: string): boolean;
    checkContainsNoLetters(coordinates: string): void;
    checkValidOrientation(coordinates: string): void;
    checkNumbers(coordinates: string): boolean;
    checkAnyCoordinateNumbers(coordinateNumbers: string[]): void;
    checkEvenCoordinateNumbers(coordinateNumbers: string[]): void;
    checkMaximumCoordinateNumbers(coordinateNumbers: string[]): void;
}

declare class CoordinateNumber {
    constructor(coordinateNumbers: string[]);
    sign: number;
    degrees: number;
    minutes: number;
    seconds: number;
    milliseconds: number;
    normalizeCoordinateNumbers(coordinateNumbers: string[]): number[];
    normalizedSignOf(number: number): number;
    detectSpecialFormats(): void;
    toDecimal(): number;
}

declare class Coordinates {
    constructor(coordinateString: string);
    coordinates: string;
    latitudeNumbers: string[] | null;
    longitudeNumbers: string[] | null;
    latitude: number;
    longitude: number;
    validate(): boolean;
    parse(): number;
    groupCoordinateNumbers(): void;
    extractCoordinateNumbers(coordinates: string): string[];
    extractLatitude(): number;
    extractLongitude(): number;
    coordinateNumbersToDecimal(coordinateNumbers: string[]): number;
    latitudeIsNegative(): RegExpMatchArray | null;
    longitudeIsNegative(): RegExpMatchArray | null;
    getLatitude(): number;
    getLongitude(): number;
}

declare namespace geofs {
    let debugOn: boolean;
    let version: number;
    let isApp: boolean;
    let PRODUCTION: boolean;
    let killCache: string;
    let mainAirportList: Record<string, number[]>;
    let url: string;
    let localUrl: string;
    let retroOn: boolean;
    let groundElevation: number;
    let waveHeight: number;
    let waveVerticalSpeed: number;
    let groundIsWater: boolean;
    let waterIsSea: boolean;
    let frameNumber: number;
    let pause: boolean;
    let WGS84TileSize: number;
    let includes: Record<string, any>;
    let initialRunways: number[][];
    let lastFlightDefault: any;
    let lastFlight: any;
    let lastFlightCoordinates: number[];
    let absolutePause: boolean;
    let userPause: boolean;
    let pauseLevel: number;
    let cautiousWithTerrain: boolean;
    let preferenceInitialized: boolean;
    let autoStart: boolean;
    let manualStart: boolean;
    let isMobileDevice: boolean;
    let forceMobileMode: boolean;
    let lastTime: number | null;
    let viewport: HTMLElement;
    let canvas: any;
    let resizeHandlers: Record<string, Function>;
    let resizeHandlersIndex: number;
    let preferences: any;
    let preferencesDefault: any;
    let preferencesKeycodeLookup: Record<number, string>;
    let localStorage: Storage;

    let aircraftList: Record<string, {
        name: string;
        dir?: string;
        path?: string;
        multiplayerFiles?: string;
        local?: boolean;
        community?: boolean;
    }>;
    let userRecord: {
        id: number | string;
        sessionId: string;
        muteListMap: Record<string, any>;
        licenseid?: string;
    };
    let isNight: boolean;
    let isSnowy: boolean;
    let isSnow: boolean;
    let season: string;
    let vrOn: boolean;
    let XRFov: number | null;
    let waterDepth: number | null;
    let relativeAltitude: number;
    let withinCollisionRange: boolean;
    let renderLoop: Function;
    let XRSession: any;
    let androidViewerOptions: any;
    let iosViewerOptions: any;
    let platform: string | null;
    let lookAroundValue: number;
    let lookUpDownValue: number;
    let simpleShadowOn: boolean;
    let shadowsDisabled: boolean;
    let keepAliveInterval: number;
    let probbingTimeout: number;
    let terrainProbingDuration: number;
    let forcePreferenceResetOnVersionChange: boolean;

    function init(): void;
    function start(e?: any, t?: any): void;
    function unload(): void;
    function initLoggedInUser(): void;
    function terrainProbbingDone(): void;
    function probeTerrain(): void;
    function togglePause(): void;
    function isPaused(): boolean;
    function doPause(e?: number, t?: boolean): void;
    function undoPause(e?: number): void;
    function frameCallback(e: number): void;
    function flyTo(e: number[], t?: boolean): void;
    function flyToCamera(): void;
    function resetFlight(): void;
    function getViewportDimentions(): void;
    function handleResize(): void;
    function addResizeHandler(e: Function, t: any): void;
    function initPreferences(): void;
    function isPreferencePanelOpen(): boolean;
    function saveFlight(e?: any): void;
    function clearSavedFlight(): void;
    function savePreferences(): void;
    function resetPreferences(e?: boolean): void;
    function readPreferences(e?: Function): void;
    function populateCopilotVoices(): void;
    function populateButtonAssignments(): void;
    function populateAxesAssignments(): void;
    function populateKeyAssignments(): void;
    function preferencesDebugInfo(): void;
    function preferencesTestJoystick(): boolean;
    function preferencesTestOrientation(): boolean;
    function preferencesStartFeedback(): void;
    function setPreferenceFromInput(e: any): void;
    function setPreferenceValues(e?: any, t?: boolean): void;
    function WGS84Coord2tile(e: number, t: number, a: number): { x: number; y: number };
    function coord2tile(e: number, t: number, a: number): { x: number; y: number };
    function coord2CenterTile(e: number, t: number, a: number): { x: number; y: number };
    function coord2tileQuad(e: number, t: number, a: number): any[];
    function coord2tileGrid(e: number, t: number, a: number, o: number, n?: any): any[];
    function tile2Grid(e: number, t: any): any[];
    function tile2coord(e: number, t: number, a: number): { lat: number; lon: number };
    function getLatLonMatrixcoord(e: number, t: number, a: number): string;
    function visibilityCycle(): void;
    function setInputHandlers(selector: string | any): void;
    function getAltitudeAtPointFromCollisionResult(e: any, t: number[]): number;
    function getNormalFromCollision(e: any, t: any): number[];
    function useSimpleShadow(e: boolean): void;
    function disableShadows(): void;
    function enableShadows(): void;
    function initializePreferencesPanel(): void;
    function fromHeadingPitchRoll(heading: number, pitch: number, roll: number): any;
    function headingPitchRollScaleToFixedFrame(position: any, heading: number, pitch: number, roll: number, scale: number[]): any;
    function selectDropdown(selectElement: HTMLSelectElement, value: string | number): void;
    function getLink(): void;

    namespace configuration {
        let defaults: any;
        let current: any;
        let google: any;
        function applyConfiguration(e?: any): void;
    }

    class simple3DTileProvider {
        constructor(e: any);
        tilingScheme: any;
        options: any;
        tiles: any;
        update(e: number[]): void;
        loadTile(e: any): void;
        unloadTile(e: string): void;
        destroy(): void;
        coords2tile(e: number, t: number, a: number): any;
        tile2coords(e: number, t: number, a: number): number[];
    }

    class shadow {
        constructor(e: string, t: number[]);
        scale: number[];
        shadow: api.Model;
        context: any;
        shadowOffset: number;

        createShadow(e: string, t: number[]): void;
        setLocationRotation(e: number[], t: number[]): void;
        destroy(): void;
    }

    class tileManager {
        constructor(e: any);
        server: string;
        tileSize: number;
        zoomLevel: number;
        maxZoomLevel: number;
        sizeInPixels: number;
        backgroundColor: string;
        useDataView: boolean;
        sizeInTiles: number;
        canvasAPI: api.Canvas;
        tileSizeAtZoom: number[];
        initialized: boolean;
        tileCoordinates: any[];
        originAtZoom: any[];
        originTileId: string;
        ready: boolean;
        dataView: DataView | null;
        origin: { lat: number; lon: number };
        end: { lat: number; lon: number };
        pixelGeographicSize: { lat: number; lon: number };

        update(e: number, t: number): void;
        prepareDataView(): void;
        coordsToPixels(e: number, t: number): { x: number; y: number } | undefined;
        getSubTilePixel(e: number, t: number, a: number, o: number, n: number): any;
        getTilePixel(e: number, t: number, a: number, o: number, n: number): any;
        getTileImageData(e: number, t: number, a: number, o: number, n: number, r: number, s: number): any;
        getImageDataFromCoords(e: any, t: any): any;
        pixelsToCoords(e: any, t: any): void;
    }

    namespace api {
        let march2019theTwentyFirst: number;
        let halfADayInSeconds: number;
        let overlayBaseZIndex: number;
        let ALTITUDE_RELATIVE: string;
        let CLAMP_TO_GROUND: string;
        let nativeMouseHandling: boolean;
        let maximumUpsamplingResolution: number;
        let viewer: any;
        let terrainProviderName: string;
        let imageryProviderName: string;
        let googleTileset: any;
        let hdOn: boolean;
        let dataProvider: string;
        let renderingSettings: any;
        let camera: any;
        let labels: any;
        let billboards: Record<string, any>;
        let models: any;
        let waterMask: any;
        let precisionTime: number;

        function initWorld(e: string, t?: any): any;
        function destroyWorld(): void;
        function triggerExplicitRendering(): void;
        function addFrameCallback(e: Function, t?: string, a?: number): number;
        function removeFrameCallback(e: number, t?: string): void;
        function frameCallbackWrapper(e: number, t?: number): void;
        function setOutsideShadowDistance(e: number): void;
        function configureOutsideView(): void;
        function configureInsideView(): void;
        function setGlobeLighting(e: boolean): void;
        function setSceneLight(e: any, t?: number): void;
        function setWaterEffect(e: boolean): void;
        function setVegetation(e: boolean): void;
        function setBuildings(e: boolean): void;
        function setHD(e: boolean): void;
        function setDataProvider(e: string): void;
        function setTerrainProvider(e: any, t?: string): void;
        function setImageryProvider(e: any, t?: boolean, a?: number, o?: number, n?: number, r?: string): any;
        function setGoogleTiles(e: boolean): Promise<void>;
        function updateGoogleTiles(e: number[]): void;
        function setDebugImageryProvider(): void;
        function setTimeAndDate(e: number, t?: number): void;
        function setClock(e: Date): void;
        function isWebXRAvailable(): boolean;
        function toggleVr(): void;
        function enhanceColors(e?: number): void;
        function setImageryColorModifier(e: string, t: any): void;
        function removeImageryColorModifier(e: string): void;
        function applyImageryColorModifiers(): void;
        function setImageryBrightness(e: number): number;
        function setImageryContrast(e: number): number;
        function setImagerySaturation(e: number): number;
        function setImageryHue(e: number): number;
        function setImageryGamma(e: number): number;
        function setAtmosphereColorModifier(e: string, t: any): void;
        function removeAtmosphereColorModifier(e: string): void;
        function applyAtmosphereColorModifiers(): void;
        function showSun(): void;
        function hideSun(): void;
        function advancedRenderingQuality(): void;
        function renderingQuality(e?: number, t?: boolean): void;
        function adaptativeRenderingQuality(): void;
        function useNativeShadows(e: boolean): void;
        function useNativeAtmosphere(e: boolean): void;
        function addLabel(e: string, t?: number[], a?: any): any;
        function updateLabelText(e: any, t: string): void;
        function makeLabelTextSafe(e: string): string;
        function removeLabel(e: any): void;
        function setLabelPosition(e: any, t: number[]): void;
        function getGuarantiedGroundAltitude(e: number[]): Promise<any[]>;
        function getFastTerrainElevation(e: number[]): number;
        function getGroundAltitude(e: number[], t?: any): number;
        function getGroundNormal(e: number[], t?: any): number[];
        function generateShader(e: any, t?: string): any;
        function getShaderTextureList(e: any, t: string): any;
        function generateUniforms(e: any, t: string): any;
        function loadModel(e: any | string): Promise<any>;
        function addModelToWorld(e: any): void;
        function addModelInstance(e: string, t: any, a: string): void;
        function commitInstanceCollection(e: string): void;
        function destroyInstanceCollection(e: string): void;
        function setModelTextureFromCanvas(e: any, t: any, a?: number): void;
        function changeModelTexture(e: any, t: string, a: any): void;
        function toggleModelShadow(e: any, t: boolean): void;
        function removeModelFromWorld(e: any): void;
        function setModelVisibility(e: any, t: boolean): boolean;
        function setModelColor(e: any, t: number, a: number, o: number, n: number): boolean | void;
        function setModelOpacity(e: any, t: number): boolean;
        function destroyModel(e: any): void;
        function setModelElevation(e: any, t: number): void;
        function setModelPositionOrientationAndScale(e: any, t?: number[] | null, a?: number[] | null, o?: number | number[] | null): void;
        function getModelNode(e: any, t: string): any;
        function setModelRotationPosition(e: any, t: number[][] | null, a: number[] | null): void;
        function setNodeRotationTranslationScale(e: any, t: number[][] | null, a: number[] | null, o: number[] | null, n?: boolean): void;
        function setNodeScale(e: any, t: number[]): void;
        function setNodeVisibility(e: any, t: boolean): boolean;
        function getNodePosition(e: any, t?: boolean): number[];
        function getNodeOriginalMatrix(e: any, t?: boolean): any;
        function getNodeRotation(e: any): number[][];
        function initAndGetCamera(): any;
        function getFOV(e: any): number;
        function setFOV(e: any, t: number): void;
        function setCameraPositionAndOrientation(e: any, t: number[], a: number[]): void;
        function getCameraLla(e: any): number[];
        function setCameraLookAt(e: any, t: number[]): void;
        function getHeading(e: any): number;
        function getTilt(e: any): number;
        function debug(e: boolean): void;
        function getPositionFromScreenCoords(e: number, t: number): any;
        function getDistanceFromScreenCoords(e: number, t: number, a: any): number;
        function getModelFromScreenCoords(e: number, t: number): any;
        function getNodeNameFromScreenCoords(e: number, t: number): string | null;
        function getLlaFromScreencoordDepth(e: number, t: number, a: any): number[] | undefined;
        function getScreenCoordFromLla(e: number[]): { x: number; y: number } | undefined;
        function xyz2lla(e: number[], t: number[]): number[];
        function takeCanvasScreenShot(e: HTMLAnchorElement): void;
        function notify(e: string, t?: string, a?: any): void;
        function postMessage(e: any): void;

        class Model {
            constructor(e: string | any, t?: any);
            loadedPromise: Promise<void>;
            readyPromise: Promise<void>;
            forceZup: boolean;
            detroyed: boolean;
            ready: boolean;
            _model: any;
            addToWorld(): void;
            removeFromWorld(): void;
            getReadyPromise(): Promise<void>;
            isReady(): boolean;
            getNode(e: string): any;
            setOpacity(e: number): void;
            setRotation(e: number, t?: number): void;
            setScale(e: number | number[]): void;
            setPositionOrientationAndScale(e: number[] | null, t?: number[] | null, a?: number | number[] | null): void;
            setLocation(e: number[]): void;
            translate(e: number[]): void;
            rotate(e: number[]): void;
            scale(e: number | number[]): void;
            setColor(e: any): void;
            setShadows(e: any): void;
            setCssColor(e: string): void;
            addShader(e: any, t: any): any;
            setTextureFromCanvas(e: any, t: any): any;
            changeTexture(e: string, t: any): any;
            setVisibility(e: boolean): boolean;
            hide(): void;
            show(): void;
            setNodeVisibilityByName(e: string, t: boolean): any;
            destroy(): void;
            remove(): void;
        }

        class billboard {
            constructor(e?: number[], t?: string, a?: any);
            _billboard: any;
            _lla: number[];
            _options: any;
            opacity: number;
            scale: number;
            rotationFixCallback: number;
            setUrl(e: string): void;
            setVisibility(e: boolean): void;
            setColor(e: any): void;
            setCssColor(e: string): void;
            setOpacity(e: number): void;
            setRotation(e: number): void;
            setScale(e: number): void;
            setLocation(e: number[]): void;
            getLla(): number[];
            fixCameraRotation(): void;
            destroy(): void;
        }

        class groundTexture {
            constructor(e?: number[], t?: string, a?: any);
            _entity: any;
            lla: number[];
            _options: any;
            opacity: number;
            scale: number;
            setUrl(e: string): void;
            setVisibility(e: boolean): void;
            setColor(e: any): void;
            setOpacity(e: number): void;
            setRotation(e: number): void;
            setScale(e: number): void;
            setLocation(e: number[]): void;
            getLla(): number[];
            destroy(): void;
        }

        class Canvas {
            constructor(e: any);
            canvas: HTMLCanvasElement;
            width: number;
            height: number;
            context: CanvasRenderingContext2D;
            _options: any;
            patchSize: number;
            images: Record<number | string, HTMLImageElement>;
            imageIndex: number;
            imagesToLoad: number;
            imagesLoaded: number;
            loadTiles(e: string | string[]): Promise<any>;
            paintAndResolve(e: Function): void;
            clear(e?: string): void;
            loadImage(e: string, t?: number | string): HTMLImageElement;
            drawRotatedSprite(e: any): void;
            drawSprite(e: any): void;
            getImageAsURLData(): string | void;
            destroy(): void;
        }

        class FlatRunwayTerrainProvider {
            constructor(e: any);
            baseProvider: any;
            regions: Record<string, any>;
            tiles: Record<string, any>;
            defaultMinFlatteningLevel: number;
            minFlatteningLevel: number;
            maximumLevel: number;
            flatten: boolean;
            readonly availability: any;
            readonly credit: any;
            readonly _tileCredits: any;
            readonly errorEvent: any;
            readonly hasMetadata: boolean;
            readonly _layers: any;
            readonly hasVertexNormals: boolean;
            readonly requestMetadata: boolean;
            readonly requestVertexNormals: boolean;
            readonly hasWaterMask: boolean;
            readonly _ready: boolean;
            readonly ready: boolean;
            readonly readyPromise: Promise<boolean>;
            readonly tilingScheme: any;
            getLevelMaximumGeometricError(e: number): number;
            getTileDataAvailable(e: number, t: number, a: number): boolean;
            setMaximumLevel(e: number): void;
            addRunway(e: any): void;
            requestTileGeometry(t: number, a: number, o: number, n: any): any;
            getPromise(t: any, a: any, o: any): Promise<any>;
        }

        class cssCompositorLayer {
            constructor(e: string | null, t: boolean);
            container: string;
            _element: any;
            inline: boolean;
            rotation: number;
            positionX: number;
            positionY: number;
            frame: { x: number; y: number };
            size: { x: number; y: number };
            offset: { x: number; y: number };
            image?: HTMLImageElement;
            _mask?: any;
            naturalSize?: { x: number; y: number };
            setDrawOrder(e: number): void;
            setUrl(e: string): void;
            setMask(e: string): void;
            setText(e: string): void;
            setTitle(e: string): void;
            setClass(e: string): void;
            setStyle(e: string): void;
            loaded(): void;
            setFrameSize(e: { x: number; y: number }): void;
            setVisibility(e: boolean): void;
            setAnchor(e: { x: number; y: number }): void;
            setRotationCenter(e: { x: number; y: number }): void;
            setSize(e: { x: number; y: number }): void;
            setPosition(e: { x: number; y: number }): void;
            setPositionX(e: number): void;
            setPositionY(e: number): void;
            setOffset(e: { x: number; y: number }): void;
            setTranslation(e: { x: number; y: number }): void;
            setOpacity(e: number): void;
            setRotation(e: number): void;
            getElement(): HTMLElement;
            destroy(): void;
        }

        class canvasCompositorLayer {
            constructor(e: any, t: any);
            compositor: any;
            rotation: number;
            opacity: number;
            anchor: any;
            origin: number[];
            position: number[];
            size: number[];
            frameSize: number[];
            rotationCenter: number[];
            offset: number[];
            drawOrder?: number;
            image?: HTMLImageElement;
            clip?: any;
            mask?: HTMLImageElement;
            maskNaturalSize?: number[];
            maskCenter?: number[];
            text?: string;
            title?: string;
            visibility?: boolean;
            sprite?: number[];
            translation?: number[];
            setDrawOrder(e: number): void;
            setUrl(e: string): void;
            setMask(e: string, t?: any): void;
            setText(e: string): void;
            setTitle(e: string): void;
            setClass(e: string): void;
            setStyle(e: string): void;
            loaded(): void;
            setFrameSize(e: { x: number; y: number }): void;
            setVisibility(e: boolean): void;
            setAnchor(e: { x: number; y: number }): void;
            setRotationCenter(e: { x: number; y: number }): void;
            setSize(e: { x: number; y: number }): void;
            setPosition(e: { x: number; y: number }): void;
            setPositionX(e: number): void;
            setPositionY(e: number): void;
            setOffset(e: { x: number; y: number }): void;
            setTranslation(e: { x: number; y: number }): void;
            setOpacity(e: number): void;
            setRotation(e: number): void;
            getElement(): HTMLElement;
            destroy(): void;
        }

        namespace analytics {
            function init(): void;
            function event(e: string, t: string, a?: string, o?: number): void;
        }

        namespace waterDetection {
            let initialized: boolean;
            let canvasAPI: Canvas | null;
            let blur: number;
            let backgroundColour: string;
            let depthSlope: number;
            let depthOffset: number;
            let tileSize: number;
            let zoomLevel: number;
            let lastTileURL: string | null;
            let lastDepth: number;
            let tileOrigin: any;
            let pixelGeographicSize: any;
            function create(): void;
            function reset(): void;
            function getWaterDepth(e: number, t: number): number | null;
            function destroy(): void;
        }

        namespace map {
            let defaultMarker: any;
            let markerByMinZoom: any[];
            let markerLayers: Record<string, any>;
            let defaultLayer: any;
            let path: any[];
            let flightPathOn: boolean;
            let _map: any;
            let _holder: HTMLElement;
            let icons: Record<string, any>;
            let genericPopupIsOpenForIOS: boolean;
            function init(e: any, t?: number, a?: number): void;
            function updateMap(e: number, t: number, a?: number[]): void;
            function getCenterLla(e?: any, t?: any): number[];
            function getPixelSize(): any;
            function llaToPixel(e: number[]): any;
            function getIcon(e: string, t: any): any;
            function addLayer(e: string): any;
            function addLayeredMarker(e: string, t: any): void;
            function getVisibleTiles(e: any, t: number): Record<string, boolean>;
            function showTile(e: any, t: string): void;
            function hideTile(e: any, t: string): void;
            function updateMarkerLayers(): void;
            function updateMarkerVisibility(): void;
            function getCoordsFromMouseEvent(e: any): number[];
            function isGenericPopupOpen(): boolean;
            function closeGenericPopup(): void;
            function openGenericPopup(e: string, t: number[]): void;
            function closeAllPopups(): void;
            function setTooltipVisibility(e: boolean): void;
            function addImageLayer(e: string, t: number, a?: number[][]): any;
            function removeImageLayer(e: any): void;
            function createPath(e?: any[], t?: any[], a?: any): any;
            function createGreatCirclePath(e?: any[], t?: any, a?: any, o?: any): any;
            function clearPath(e?: any[]): void;

            class marker {
                constructor(e: any);
                _marker: any;
                label?: string;
                addToMap(e?: any, t?: any): void;
                removeFromMap(): void;
                update(e?: number, t?: number, a?: number, o?: string): void;
                destroy(): void;
                resetTooltip(): void;
            }
        }

        namespace color {
            function pixelToHex(e: number[]): string;
            function bytesToHex(e: number, t: number, a: number, o?: number): string;
            function compareRGBBytes(e: number[], t: number[]): boolean;
            function mix(e: any, t: any, a: number): any;
            function mixArray(e: any[], t: number): any;
        }

        namespace compositors {
            let css: {
                new(e?: any, t?: any): {
                    name: string;
                    createLayer(e: string | null, t: boolean): cssCompositorLayer;
                    render(): void;
                    destroy(): void;
                }
            };
            let canvas: {
                new(e: any, t: any): {
                    container: string;
                    _element: any;
                    canvasAPI: Canvas;
                    layers: canvasCompositorLayer[];
                    name: string;
                    createLayer(e: string | null, t: boolean): canvasCompositorLayer;
                    render(): void;
                    destroy(): void;
                }
            };
        }
    }

    namespace trees {
        let qualityLevels: any;
        let simple3DTileProvider: any;
        let shader: any;
        let seasonChangeHandlerSet: any;
        function init(): void;
        function makeTextureURL(): string;
        function updateSeasonTextures(season: string): void;
        function update(e: number[]): void;
        function destroy(): void;
    }

    namespace buildings {
        let GLSLReflection: boolean;
        let qualityLevels: any;
        let buildingsShader: any;
        let simple3DTileProvider: any;
        function init(): void;
        function update(e: number[]): void;
        function makeTextureURL(): string;
        function updateTextures(): void;
        function destroy(): void;
    }

    namespace runways {
        let nearRunways: Record<string, any>;
        let tempRunways: Record<string, any>;
        let lastRunwayTestLocation: number[];
        let runwayNumberLimit: number;
        let refreshRate: number;
        let refreshDistanceThreshold: number;
        let modelVisibility: boolean;
        let defaultPadding: number;
        let defaultWidth: number;
        let defaultLength: number;
        let tileLength: number;
        let modelRunwayWidth: number;
        let thresholdToAimingPoint: number;
        let thresholdLength: number;
        let modelVerticalOffset: number;
        let imageryLayers: any[];
        let imageryOpacity: number;
        function init(): void;
        function redraw(): void;
        function refresh(): void;
        function reset(): void;
        function getNearestRunway(e: number[]): any;
        function getNearRunways(e: number[], t?: number, a?: number): any[];
        function setRunwayDistance(e: number[], t: any[]): void;
        function setRunwayModelVisibility(e: boolean): void;
        function toggleRunwayCircuit(e: string): void;
        function setCircuitVisibility(e: boolean): void;
        function generateRunwayId(e: any[]): string;
        function newRunwayFromNavaidId(e: string): runway;
        function newRunwayFromNavaidObject(e: any, t?: string): runway;
        function newRunwayFromGridRecord(e: any[], t: string): runway;

        class runway {
            constructor(e: any[], t?: string, a?: boolean);
            id: string;
            icao: string;
            location: number[];
            heading: number;
            lengthFeet: number;
            widthFeet: number;
            padding: number;
            headingRad: number;
            lengthMeters: number;
            widthMeters: number;
            threshold1: number[];
            meterLengthLocal: number[];
            meterlla: number[];
            lengthInLla: number[];
            meterWidthLocal: number[];
            meterWidthLla: number[];
            widthInLla: number[];
            meterAcrossInLla: number[];
            threshold2: number[];
            aimingPointLla1: number[];
            aimingPointLla2: number[];
            lightsOn: boolean;
            lights: any[];
            PAPIs: any[];
            localStepXm: number;
            localStepYm: number;
            stepX: number[];
            stepY: number[];
            setElevation(e?: number): void;
            showCircuit(): void;
            destroyCircuit(): void;
            hideCircuit(): void;
            turnLightsOn(): void;
            addLightRow(e: number[], t: any[], a: number): void;
            turnLightsOff(): void;
            addPAPIs(): void;
            generateRunwayModel(): void;
            destroyRunwayModel(): void;
            destroyLights(): void;
            destroyPAPIs(): void;
            destroy(): void;
        }
    }

    namespace runwaysLights {
        let lightBillboardOptions: any;
        let papiBillboardOptions: any;
        let lightElevation: number;
        let thresholdLightTemplate: any[];
        let templateCenter: number[];
        function turnAllOff(): void;
        function turnAllOn(): void;
        function updateAll(): void;

        class PAPI {
            constructor(e: number[], t: number[]);
            lights: any[];
            heightAboveGround: number;
            location: number[];
            refresh(): void;
            destroy(): void;
        }
    }

    namespace animation {
        let values: Record<string, any>;
        function getRampRatio(e: any, t: number): number;
        function getRampValue(e: any, t: number): number;
        function resetValues(e: Record<string, any>): void;
        function getValue(e: string): any;
        function setValue(e: string, t: any): any;
        function filter(e: any, t?: number): number;
    }

    namespace utils {
        let timeProvider: any;
        let lastNow: number;
        let functionsMap: Record<string, any>;
        function fastNow(): number;
        function now(): number;
        function updateTime(e: any, t: number): boolean;
        function hourStamp(): number;
        function llaDistanceInMeters(e: number[], t: number[], a?: number[]): number;
        function llaDistanceInMeters3D(e: number[], t: number[], a?: number[]): number;
        function executeOnceWithinTime(e: Function, t: number): void;
        function throttleWithDefault(e: Function, t: any, a: number, o: any): any;
        function pivotArray(e: any[]): Record<string, number>;
        function htrFromHeadingNormal(e: number, t: number[]): number[];
        function hash(e: string): number;
        function hashCode(e: string): string;
        function displayAltitude(e: number): string;
        function parseAltitude(e: string | number): number | null;
        function stickyRounding(e: number, t: number): number;
        function knotsToMach(e: number): number;
        function machToKnots(e: number): number;
        function machToMs(e: number): number;
        function sortLocationByDistance(e: number[], t: any[]): any[];
        function distanceBetweenLocations(e: number[], t: number[]): number;
        function bearingBetweenLocations(e: number[], t: number[]): number;
        function isWebglSupported(): any;
        function getFunctionFromString(e: string): Function | undefined;
        function booleanToBinary(e: boolean): number;
        function toFixedFloat(e: number, t: number): number;
        function arrayToFixed(e: number[], t: number): number[];
        function wordToDigit(e: string): number | string;
    }

    namespace ajax {
        function post(e: string, t: any, a: Function, o?: Function): any;
    }

    namespace perlin {
        let size: number;
        let gradient: any[];
        let normalizationRatio: number;
        function lerp(e: number, t: number, a: number): number;
        function dotGridGradient(e: number, t: number, a: number, o: number): number;
        function get(e: number, t: number, a: number): number;
    }

    namespace aircraft {
        let _default: number;
        let defaultDefinition: any;
        let instance: Aircraft;

        class Aircraft {
            constructor(e: number[]);
            id: string;
            aircraftRecord: any;
            engine: {
                rpm: number;
                on: boolean;
                startup?: boolean;
                invRPMRange?: number;
            };
            engines: any[];
            brakesOn: boolean;
            groundContact: boolean;
            llaLocation: number[];
            lastLlaLocation: number[];
            collResult: any;
            relativeAltitude: number;
            htr: number[];
            htrAngularSpeed: number[];
            airVelocityDirection: number[];
            trueAirSpeed: number;
            definition: any;
            setup: any;
            controllers: any;
            parts: Record<string, any>;
            models: any[];
            airfoils: any[];
            balloons: any[];
            wheels: any[];
            collisionPoints: any[];
            lights: any[];
            suspensions: any[];
            manipulators: Record<string, Function>;
            object3d: Object3D;
            boundingSphereRadius: number;
            rigidBody: rigidBody;
            shadow: geofs.shadow | null;
            liveryId: string | null;
            fullPath: string;
            crashed: boolean;
            crashNotified: boolean;
            arrestingCableContact: any;
            launchBarContact: any;
            onCatapult: boolean;
            stalling: boolean;
            angleOfAttackDeg: number;
            oldAltitude: number;
            envelopeTemp: number;
            maxAngularVRatio: number;
            absoluteStartAltitude?: boolean;
            startAltitude?: number;
            startOnGround?: boolean;
            getCurrentCoordinates(): number[];
            addShadow(): boolean;
            removeShadow(): void;
            loadDefault(e?: string): void;
            parseRecord(e: string): any;
            change(e?: string, t?: string, a?: boolean, o?: any): Promise<void>;
            loadLivery(e: string | null): void;
            loadWithLivery(e: string, t: number[] | null, a?: string): Promise<void>;
            load(e: string, t: number[] | null, a?: boolean, o?: any): Promise<void>;
            init(e: any, t?: number[], a?: boolean, o?: any): void;
            setVisibility(e: boolean): void;
            unloadAircraft(): void;
            reset(e?: boolean): void;
            place(e: number[], t?: number[]): void;
            placeParts(e?: any): void;
            placePart(e: any): void;
            render(): void;
            startEngine(): void;
            stopEngine(): void;
            addOffsets(e: any, t: number): void;
            fixCockpitScale(e: number): void;
            crash(): void;
        }
    }

    namespace objects {
        let on: boolean;
        let currentTileCoords: any;
        let zoomLevel: number;
        let objectList: any[];
        let collidableObjectList: any[];
        let collidableObject: boolean;
        let collidableInterval: number;
        function init(): void;
        function update(e: number[]): void;
        function destroy(): void;
        function preProcessObjects(): void;
        function unloadModels(): void;
        function loadModels(e?: any): void;
        function updateDayNightTextures(e: boolean): void;
        function updateCollidables(): void;
        function areCollidableObjectAtLocation(e: number[], t?: any): boolean;
        function getAltitudeAtLocation(lla: number[], ignoreThickness?: boolean): any;
        function move(e: number, t?: number, a?: number, o?: number): void;
        function rotate(e: number, t?: number): void;
        function scale(e: number, t?: number): void;
        function getLla(e: number | string): number[];
        function getHtr(e: number | string): number[];
        function getScale(e: number | string): number[];
    }

    namespace camera {
        let cam: any;
        let lla: number[];
        let htr: number[];
        let hasMoved: boolean;
        let currentMode: number;
        let currentModeName: string;
        let currentDefinition: any;
        let currentView: string;
        let worldPosition: number[];
        let openSlave: boolean;
        let motionRange: number;
        let rotationRange: number;
        let defaultFOV: number;
        let currentFOV: number;
        let groundAltitude: number;
        let radianRoll: number;
        let dotAircraftForward: number;
        function init(e?: any): void;
        function setFOV(e: number): void;
        function increaseFOV(e?: number): void;
        function decreaseFOV(e?: number): void;
        function reset(): void;
        function cycle(): void;
        function set(e: number, t?: string): void;
        function lookAround(e?: number, t?: number): boolean;
        function rotate(e?: number, t?: number, a?: number): boolean;
        function translate(e?: number, t?: number, a?: number): boolean;
        function setPosition(e?: number, t?: number, a?: number): boolean;
        function setOffsets(e?: number, t?: number, a?: number): void;
        function isHandlingMouseRotation(): boolean;
        function setRotation(e?: number, t?: number, a?: number): boolean;
        function saveRotation(): void;
        function saveOffset(): void;
        function setToNeutral(): void;
        function setGroundAltitude(): void;
        function avoidGround(): void;
        function getFlytToCoordinates(): any[];
        function update(e: number): void;
        function openSlaveWindow(e: number): void;
        function updateSlaveData(): void;
    }

    namespace autopilot {
        let on: boolean;
        let mode: string;
        let speedMode: string;
        let PIDs: Record<string, any>;
        let values: { course: number; altitude: number; speed: number; verticalSpeed: number };
        let defaults: any;
        let definition: any;
        let currentNAVUnit: any;
        let VNAV: boolean;
        let targetVerticalSpeed: number;
        function init(): void;
        function setMode(e?: string): void;
        function setCourse(e: number, t?: boolean): void;
        function setAltitude(e: number, t?: boolean): void;
        function setSpeed(e: number, t?: boolean): void;
        function setSpeedMode(e: string): void;
        function setVerticalSpeed(e: number | null): void;
        function update(e: number): void;
        function toggle(): void;
        function resetPIDs(): void;
        function turnOn(): void;
        function turnOff(): void;

        namespace UI {
            function init(): void;
            function update(): void;
        }
    }

    let flightPlan: {
        mapPath: any[];
        waypointArray: any[];
        isInitialized: boolean;
        isOpen: boolean;
        trackedWaypoint: any;
        totalDistance: number;
        totalTime: number;
        init(): void;
        toggle(): void;
        gotoWaypoint(e: number): void;
        selectWaypoint(e: number): void;
        moveWaypoint(e: number, t: number): void;
        deleteWaypoint(e: number): void;
        refreshWaypoints(): void;
        paste(e?: any): Promise<void>;
        copy(): Promise<void>;
        importSimBrief(): void;
        "import"(e: any): void;
        "export"(): string;
        upload(e: HTMLInputElement): void;
        download(e: HTMLAnchorElement): void;
        clear(): void;
    };

    namespace nav {
        let navaidsAndRunwaysLoaded: boolean;
        let fixesLoaded: boolean;
        let navaids: any[];
        let navaidsICAOMap: Record<string, any[]>;
        let frequencies: any[];
        let units: Record<string, any>;
        let currentNAVUnit: any;
        let currentNAVUnitName: string | null;
        let HDG: number;
        let ADFManCourse: number;
        let types: Record<string, any>;
        function init(): void;
        function loadFixes(): void;
        function loadNavaidsAndRunways(): void;
        function addNavaid(e: any): any;
        function getNavaid(e: number | string): any;
        function removeNavaid(e: number): void;
        function addWaypoint(e: number[], t: string, a?: string): any;
        function addGPSFIX(e: number[], t: string): any;
        function generateGPSFIXNavaid(e: number[], t: string, a?: string, o?: string): any;
        function selectNavaid(e: number, t?: boolean): void;
        function setNAVMode(e: string | null, t?: string, a?: boolean): void;
        function setNavaid(e: any, t?: string): void;
        function setOBS(e: string | null, t: number | string, a?: number | null, o?: boolean): void;
        function setHDG(e: number | null, t: number, a?: boolean): void;
        function setADFManCourse(e: number | null, t: number): void;
        function clear(e?: string): void;
        function isNavaidInRange(e: any): boolean;
        function update(e: number): void;
        function computeBearingToNavaid(e: any): number;
        function updateUnit(e: number, t: string): void;
        function setUnitAnimationValue(e: any, t: string): void;
    }

    namespace radio {
        let visible: boolean;
        let pushToTalk: boolean;
        let units: Record<string, any>;
        let frequencyScanInterval: number;
        let NAVFrequencyRange: number[];
        let ADFFrequencyRange: number[];
        let navKnob: any;
        let adfKnob: any;
        let OBSKnob: any;
        function init(): void;
        function scanUnitFrequency(e: string): any;
        function scanFrequenciesAround(): void;
        function tuneNAVFrequency(e: number | null, t: number | null, a: string): void;
        function tuneADFFrequency(e: number | null, t?: number | null): void;
        function displayNAVFrequency(e: string | null, t?: string): void;
        function displayADFFrequency(e?: string): void;
        function displayOBS(e: number | string): void;
        function clear(e?: string): void;
        function enableUnitIdent(e: string): void;
        function disableAllIdent(): void;
        function startIdent(e: string): void;
        function stopIdent(e?: string): void;
        function update(e: number): void;
        function toggle(): void;
        function show(): void;
        function hide(): void;

        namespace atc {
            let ATCMessages: any[];
            let ATCMessagesLength: number;
            function init(): void;
            function callAI(e: string): void;
        }
    }

    namespace map {
        let dontMoveTimeoutValue: number;
        let mapUpdateInterval: number;
        let minimumPanRatio: number;
        let cloudLayerUpdatePeriod: number;
        let navaidsLayer: any;
        let planeMarker: any;
        let mapActive: boolean;
        let ATCMode: boolean;
        let runwayMarkerRadius: number;
        let icons: Record<string, any>;
        function init(e?: any, t?: number, a?: number): void;
        function runwayMarkerPopup(e: any): string;
        function navaidMarkerPopup(e: any): string;
        function resize(): void;
        function addRunwayMarker(e: any): void;
        function addNavaidMarker(e: any): any;
        function getLocationPopupContent(e: number[]): string;
        function mapClickHandler(e: any): void;
        function setMouseClickBehavior(): void;
        function stopMap(): void;
        function startMap(): void;
        function stopMovingMap(e?: boolean): void;
        function updateMap(e: number[], t?: boolean): void;
        function updatePlaneMarker(e: number, t: number, a: number): void;
        function addPlayerMarker(e: string, t: string, a: string): any;
        function updatePlayerMarker(e: string, t: number[], a: string, o: string, n: string, r: string | number): void;
        function deletePlayerMarker(e: string): void;
        function toggleATCMode(): void;
        function setTooltipVisibility(e: boolean): void;
        function showWeather(): void;
        function hideWeather(): void;
    }

    namespace fx {
        let globeLoaded: boolean;
        function setParticlesColor(color: any): void;

        namespace atmosphere {
            let color: any;
            let dayColor: any;
            let nightColor: any;
            let brightness: number;
            let postProcessingStageSet: boolean;
            let realPlanetRadius: number;
            let planetRadius: number;
            let atmosphereThickness: number;
            let planetRadiusOffset: number;
            let cloudLayerPosition: number;
            function create(e?: boolean, t?: number, a?: boolean, o?: boolean, n?: boolean): void;
            function addPostProcessingStage(): void;
            function reset(): void;
            function update(e: number[], t?: boolean): void;
            function setConditions(e: number[], t: number): void;
            function setVolumetricFog(e: number, t: number, a: number): void;
            function setFogColor(e?: number, t?: number): void;
            function setFogDensity(e: number): void;
            function destroy(): void;
        }

        namespace cloudManager {
            let instance: any;
            let cloudCoverToCloudNumber: number;
            let clouds: Record<string, Cloud>;
            let numberOfClouds: number;
            let maxNumberOfClouds: number;
            let currentID: number;
            let fullCover: CloudCover | null;
            function init(e: number[]): void;
            function spawnClouds(): void;
            function triggerUpdate(): void;
            function update(e: number[], t: number): void;
            function setCloudsBrightness(e: number): void;
            function setCloudColors(e: number | null, t: number | null, a: number | null, o?: number, n?: any): void;
            function setCloudCover(e: number): void;
            function setNumberOfClouds(e: number): void;
            function setCeiling(e: number): void;
            function destroyLastCloud(): void;
            function destroyAllClouds(): void;
            function destroy(): void;
        }

        class Cloud {
            constructor(e?: number[], t?: any);
            _id: number;
            _type: any;
            _location: number[];
            _entity: any;
            create(e?: number[]): void;
            setCeiling(e: number): void;
            setColor(e: any): void;
            move(e: number[]): void;
            setLocation(e: number[]): void;
            update(): void;
            destroy(): void;
        }

        class CloudCover {
            constructor(e: number[]);
            entity: api.Model | null;
            create(e: number[]): void;
            setColor(e: any): void;
            setLocation(e: number[]): void;
            update(): void;
            destroy(): void;
        }

        namespace precipitation {
            let type: string;
            let amount: number;
            let visible: boolean;
            let apiModel: api.Model | null;
            let motionOffset: number;
            function init(): void;
            function create(e: string, t: number): void;
            function update(e: number[], t: number): void;
            function show(): void;
            function hide(): void;
            function destroy(): void;
        }

        namespace water {
            let material: any;
            let postProcessingStage: any;
            function create(): void;
            function setConditions(e: number): void;
            function setColours(e: any, t: any): void;
            function update(e: number[]): void;
            function getWaveHeight(e: number, t: number, a: number): number;
            function destroy(): void;
        }

        namespace wake {
            let emitter: ParticleEmitter | null;
            function create(): void;
            function update(e: number, t: number): void;
            function destroy(): void;
        }

        class ParticleEmitter {
            constructor(options: any);
            turnOn(): void;
            turnOff(): void;
            destroy(): void;
        }

        class light {
            constructor(location: number[], type: string, options: any);
            lightBillboard: api.billboard;
            destroy(): void;
        }

        namespace dayNightManager {
            let sunColor: any;
            function init(): void;
            function update(e?: number[], t?: number): void;
        }
    }

    let debug: {
        logStack: string[];
        logStackMaxLength: number;
        fps: number | string;
        placingObjectId: string;
        atmosphereSize: number[];
        atmosphereResolution: number[];
        init(): void;
        turnOn(): void;
        afterWorldInit(): void;
        turnOff(): void;
        watch(e: string, t: any): void;
        error(e: any, t?: string): void;
        log(e: string): void;
        "debugger"(): void;
        "throw"(e: any): void;
        alert(e: string, t?: any): void;
        stackLog(e: string): void;
        update(e: number): void;
        loadAxis(): void;
        placeProbe(e: number[]): void;
        loadProbe(): void;
        placeAxis(e: number[][], t: number[]): void;
        toggleDebug(): void;
        drawAtmosphere(e?: number[]): void;
    };

    namespace mobile {
        let on: boolean;
        let configuration: any;
        function init(): void;
        function configure(): void;
        function turnOn(): void;
        function turnOff(): void;
        function setMobileMode(): void;
    }

    namespace speech {
        let initialized: boolean;
        let synthesis: SpeechSynthesis;
        let recognition: any;
        let textSpoken: string | null;
        let wordsSpoken: string[] | null;
        let commandSpoken: string | null;
        let valueSpoken: string | null;
        function init(e?: any): void;
        function getVoices(): SpeechSynthesisVoice[];
        function setLanguage(e: string): void;
        function setVoice(e: number | null, t: string): void;
        function getVoice(e: number, t?: string): SpeechSynthesisVoice;
        function speak(e: string, t?: any): void;
        function cancel(): void;
        function startRecognition(): void;
        function stopRecognition(): void;
        function addRecognitionListener(e: Function): void;
        function destroy(): void;
    }
}

declare namespace flight {
    let currentAltitudeTestContext: any;
    let pastAltitudeTestContext: any;
    let elevationAtPreviousLocation: number;
    let skipCollisionResponse: boolean;
    let arrestingHookDiscardVelocity: number;
    let arrestingHookDiscardLength: number;
    let minPenetrationThreshold: number;
    function setAnimationValues(e: number, t: number): void;
    function terrainElevationManagement(): void;
    function reset(e: number): void;
    function tick(a: number, t: number, e: number): void;

    let recorder: {
        tape: any[];
        rate: number;
        maxLength: number;
        playing: boolean;
        currentStep: number;
        lastRecordTime: number;
        pathDrawDistanceThreshold: number;
        mapPath: any[];
        pathColors: any[];
        lastDrawnLla: number[] | null;
        liveRecord: any;
        deltaRecord: any;
        paused: boolean;
        init(): void;
        record(): void;
        makeRecord(e?: number, t?: number[], a?: number[]): any;
        setRecorderDuration(): void;
        setTapeLength(e?: number): void;
        clear(): void;
        clearPath(): void;
        setPathDrawState(): void;
        enterPlayback(): void;
        exitPlayback(): void;
        pausePlayback(): void;
        unpausePlayback(): void;
        startPlayback(): void;
        setStep(e: number, t?: string): boolean;
        play(e: number): void;
        drawPath(e: number[], t: number[]): void;
        "import"(e: string): Promise<void>;
        "export"(): string;
        upload(e: HTMLInputElement): void;
        download(e: HTMLAnchorElement): void;
    };

    namespace sharing {
        let targetDT: number;
        let on: boolean;
        let lastRecord: any;
        let liveRecord: any;
        let deltaRecord: any;
        let now: number;
        function start(e?: any): void;
        function stop(): void;
        function reset(e?: any): void;
        function peerUpdate(e: any, t: any): void;
        function update(e: number): void;
    }

    namespace interpolator {
        function computeDeltaRecord(e: any, t: any, a: number, o?: number): any;
        function increment(e: any, t: any, a: number): void;
        function setAircraft(e: any): void;
    }
}

declare namespace controls {
    let states: Record<string, boolean>;
    let mouse: any;
    let keyboard: any;
    let touch: any;
    let orientation: any;
    let joystick: any;
    let multiplier: any;
    let mixYawRoll: boolean;
    let exponential: number;
    let steerWithRoll: boolean;
    let mode: string;
    let throttleIncrement: number;
    let roll: number;
    let rawPitch: number;
    let pitch: number;
    let yaw: number;
    let throttle: number;
    let mixture: number;
    let carbHeat: number;
    let reverse: number;
    let brakes: number;
    let engine: any;
    let elevatorTrim: number;
    let elevatorTrimMin: number;
    let elevatorTrimMax: number;
    let elevatorTrimStep: number;
    let gear: any;
    let flaps: any;
    let airbrakes: any;
    let optionalAnimatedPart: any;
    let accessories: any;
    let steering: number;
    let rawYaw: number;
    let throttleAsReverse: number;
    let axisSetters: Record<string, any>;
    let setters: Record<string, any>;
    let manipulators: Record<string, any>;
    let nodeClickHandlers: Record<string, Function>;

    function init(): void;
    function resetWithAircraftDefinition(): void;
    function reset(): void;
    function setMode(e: string): void;
    function trimUp(e?: any): void;
    function trimDown(e?: any): void;
    function update(e: number): void;
    function setPartAnimationDelta(e: any): void;
    function animatePart(e: string, t: number): void;
    function updateMouse(e: number): void;
    function updateKeyboard(e: number): void;
    function updateJoystick(e: number): void;
    function updateOrientation(e: number): void;
    function updateTouch(e: number): void;
    function recenter(): void;
    function keyDown(e: any): void;
    function keyUp(e: any): void;
    function initViewportDimensions(): void;
    function applyManipulator(e: any): void;
    function updateManipulator(e: any, t: any): void;
    function releaseManipulator(e: any): void;
    function addNodeClickHandler(e: string, t: Function): void;
    function runNodeClickHandlers(e: string): void;
    function removeNodeClickHandler(e: string): void;
    function clearNodeClickHandlers(): void;

    namespace copilot {
        let initialized: boolean;
        let lastReading: number;
        let spokenHeading: number;
        let spokenAltitude: number;
        let spokenIAS: number;
        function init(): void;
        function update(e: number): void;
        function speechCallback(): void;
        function speak(e: string | string[]): void;
        function command(): void;
        function noComprendo(): void;
        function destroy(): void;
    }

    namespace joystick {
        let deadZoneUp: number;
        let deadZoneDown: number;
        let ready: boolean;
        let sticksNumber: number;
        let calibrationDurationSeconds: number;
        let sticks: any[];
        let api: any;
        let calibrating: boolean;
        let calibratingTime: number;
        let calibrationInterval: number;
        let oldButtonsValue: number;
        let buttons: Record<string, any>;
        let axes: Record<string, any>;
        let buttonHandlers: any;
        function poll(): boolean;
        function init(): void;
        function configure(): void;
        function startCalibration(): void;
        function calibrationStatus(): void;
        function stopCalibration(): void;
        function resetCalibration(): void;
        function checkButton(e: string): boolean;
        function getAxisValue(e: string, t?: number, a?: number): number;
        function addButtonListener(e: string, t: string, a: Function): void;
    }

    namespace orientation {
        let available: boolean;
        let eventListenerSet: boolean;
        let centers: number[] | null;
        let values: number[];
        let generalMultiplier: number;
        let iOSpermissionRequested: boolean;
        let yaw: number;
        function init(): void;
        function setScreenOrientation(): void;
        function requestIOSPermission(): void;
        function fixPitch(e: number[]): void;
        function recenter(): void;
        function isAvailable(): boolean;
        function getNormalizedAxis(e: number): number;
        function getHtr(): number[];
    }
}

declare namespace weather {
    let METARProxy: string;
    let realTimeCloudTexture: string;
    let realTimeCloudMap: string;
    let minimumCloudCover: number;
    let updateRate: number;
    let timeRatio: number;
    let seasonRatio: number;
    let contrailTemperatureThreshold: number;
    let contrailAltitude: number;
    let atmosphericDisturbance: number;
    let atmosphericDisturbanceScale: number;
    let defaults: any;
    let definition: any;
    let definitionBounds: Record<string, number[]>;
    let currentWindVector: number[];
    let currentWindVectorWC: any;
    let currentWindVectorLla: number[];
    let currentWindDirection: number;
    let currentWindSpeed: number;
    let currentWindSpeedMs: number;
    let activeWindLayer: number;
    let windLayers: Wind[];
    let isSnowable: boolean;
    let windActive: boolean;

    function init(e?: any): void;
    function reset(e?: any): void;
    function refresh(e?: any): void;
    function sanitizedDefinition(e: any): any;
    function generateDefinition(e?: any, t?: any): any;
    function setAdvanced(): void;
    function set(e: any, t?: any): void;
    function update(e: number): void;
    function setWindIndicatorVisibility(e: boolean): void;
    function setDateAndTime(e?: any): void;
    function getLocalTurbulence(e: any): number[];
    function setThermals(e: any): void;
    function getLocalThermal(e: any): number[];
    function initWind(e: number, t: number): void;
    function windOff(): void;

    class Wind {
        constructor(e: number, t: number, a: number, o: number);
        mainDirection: number;
        speedKnots: number;
        speedMs: number;
        vector: number[];
        vectorMs: number[];
        vectorCross: number[];
        floor: number;
        ceiling: number;
        direction: number;
        speed: number;
        vectorWC: any;
        randomize(): void;
        computeAndSet(e?: any): void;
        computeTerrainLift(e?: any): any;
    }

    namespace atmosphere {
        let airTempAtAltitude: number;
        let airTempAtAltitudeKelvin: number;
        let airPressureAtAltitude: number;
        let airDensityAtAltitude: number;
        function init(): void;
        function update(e?: number): void;
    }
}

declare namespace instruments {
    let stackPosition: { x: number, y: number };
    let margins: number[];
    let defaultMargin: number;
    let visible: boolean;
    let list: Record<string, Indicator>;
    let groups: Record<string, Record<string, Indicator>>;
    let containers: Record<string, HTMLElement>;
    let definitions: Record<string, InstrumentDef>;
    let rendererInstancesByName: Record<string, Renderer>;
    let manipulators: Record<string, Function>;

    function init(e?: any): void;
    function reset(): void;
    function toggle(): void;
    function add(e: Indicator, t: string): void;
    function hide(e?: string): void;
    function show(e?: string): void;
    function setOpacity(e: number): void;
    function rescale(): void;
    function update(e?: boolean): void;
    function updateCockpitPositions(): void;
    function updateScreenPositions(): void;

    class Renderer {
        constructor(e: any);
        definition: InstrumentDef;
        canvasAPI: geofs.api.Canvas;
        images: Record<string, HTMLImageElement>;
        reuseExistingRenderer?: Renderer;
        loadImages(): void;
        update(e: any, t?: any): void;
        destroy(): void;
        drawGrads(e: any, t: any): void;
    }
}

declare namespace multiplayer {
    let nbUsers: number;
    let users: Record<string, User>;
    let visibleUsers: Record<string, User>;
    let minUpdateDelay: number;
    let mapUpdatePeriod: number;
    let myId: string | null;
    let chatMessage: string;
    let chatMessageId: number;
    let on: boolean;
    let started: boolean;
    let avgPing: number;
    let minPing: number;
    let serverTimeOffset: number | null;

    function init(): void;
    function stop(): void;
    function start(): void;
    function startUpdates(): void;
    function stopUpdates(e?: any): void;
    function getServerTime(): number;
    function getUser(e: string): User;
    function updateUsers(e: any[]): void;
    function startMapUpdate(): void;
    function update(e: number): void;
    function sendUpdate(): void;
    function blockUser(e: string): void;
    function banUser(e: string): void;
    function loadModels(e: string): any[];
    function setNbUsers(e: number): void;
    function setChatMessage(e: string): void;

    namespace flightSharing {
        let status: string | null;
        let peer: any;
        let willpeer: any;
        let waspeer: any;
        let control: boolean;
        let host: boolean;
        let timeout: number;
        function init(): void;
        function request(e: any): void;
        function incoming(e: any): void;
        function accept(e: any): void;
        function accepted(e: any): void;
        function peerUpdate(e: any, t?: any): void;
        function swapControl(e?: boolean): void;
        function refuse(e: any): void;
        function stop(): void;
    }

    class User {
        constructor(e: any);
        id: string;
        acid: string;
        callsign: string;
        aircraft: string | null;
        aircraftName: string | null;
        lod: number | null;
        lastUpdate: any;
        model: any;
        visibleGear: boolean;
        referencePoint: any;
        currentServerTime: number;
        isTraffic: boolean;
        updated: boolean;
        isPeer: boolean;
        currentLivery: string | null;
        label: any;
        icon: geofs.api.billboard | null;
        heartBeat(): void;
        update(e: any, t?: boolean): void;
        getLOD(e: any): number;
        updateAircraft(e: any): void;
        updateContrails(): void;
        updateModel(e: any): void;
        addCallsign(e: string, t: string): void;
        removeCallsign(): void;
        removeFromWorld(): void;
        removeModels(): void;
        remove(): void;
        getCoordinates(): number[];
        isOnGround(): boolean;
    }
}

declare namespace ui {
    let playerMarkers: Record<string, geofs.api.map.marker>;
    function init(): void;
    function showCrashNotification(): void;
    function hideCrashNotification(): void;
    function toggleButton(selector: string, state: boolean): void;
    function addMouseUpHandler(handler: Function): void;

    namespace panel {
        function toggle(selector: string): void;
    }

    namespace notification {
        function show(msg: string): void;
    }

    namespace chat {
        function publish(msg: any): void;
        function removeUserMessages(userId: string): void;
    }
}

declare namespace audio {
    let on: boolean;
    let maxFilterFreq: number;
    let sounds: Record<string, any>;
    let soundplayer: any;

    function init(e: any): void;
    function toggleMute(): void;
    function stop(): void;
    function mute(): void;
    function unmute(): void;
    function playStartup(): void;
    function playShutdown(): void;
    function playSoundLoop(e: string, t: boolean): void;
    function stopSoundLoop(e: string): void;

    namespace impl {
        namespace webAudio {
            let context: any;
            let decodingStack: any[];
            function createPlayer(): any;
            function stackDecoding(e: Function): void;
            function setupSoundNodes(e: any): void;
            function loadSound(e: any, t?: Function): void;
            function playSound(e: any, t?: boolean, a?: Function): void;
            function startSound(e: any, t?: boolean, a?: Function): void;
            function stopSound(e: any): void;
            function setVolume(e: any, t: number): void;
            function setRate(e: any, t: number): void;
            function setFilter(e: any, t?: number, a?: number, o?: number): void;
            function setHPFilter(e: any, t?: number, a?: number): void;
            function unsetFilter(e: any): void;
            function destroySound(e: any): void;
            function destroyPlayer(): void;
            function setMasterVolume(): void;
        }
        namespace html5 {
            let player: any;
            function createPlayer(): any;
            function loadMP3(e: string, t: string, a?: boolean): any;
            function playFile(e: string, t?: boolean, a?: Function): any;
            function playSequence(e: string[], t?: number): any;
            function playSound(e: string): void;
            function stopSound(e: string): void;
            function setVolume(e: string, t: number): void;
            function setRate(e: string, t: number): void;
            function destroyPlayer(): void;
            function setMasterVolume(): void;
        }
    }
}

declare namespace L {
    namespace Polyline {
        function Arc(start: any, end: any, options?: any): any;

        class plotter {
            constructor(latlngs: any[], options?: any);
            _lineMarkers: any[];
            _halfwayPointMarkers: any[];
            _existingLatLngs: any[];
            options: any;
            onAdd(map: any): void;
            onRemove(map: any): void;
            setLatLngs(latlngs: any[]): void;
            setReadOnly(readOnly: boolean): void;
            _bindMapClick(): void;
            _unbindMapClick(): void;
            _setExistingLatLngs(latlngs: any[]): void;
            _replot(): void;
            _getNewMarker(latlng: any, options: any): any;
            _unbindMarkerEvents(marker: any): void;
            _bindMarkerEvents(marker: any): void;
            _bindHalfwayMarker(marker: any): void;
            _unbindHalfwayMarker(marker: any): void;
            _addToMapAndBindMarker(marker: any): void;
            _removePoint(e: any): void;
            _onMapClick(e: any): void;
            _addNewMarker(e: any): void;
            _redrawHalfwayPoints(): void;
            _addHalfwayPoint(e: any): void;
            _plotExisting(): void;
            _redraw(): void;
        }

        function Plotter(latlngs: any[], options?: any): plotter;
    }

    namespace tileLayer {
        function fallback(url: string, options?: any): any;
    }

    function canvasMarker(latlng: any, options?: any): any;
}