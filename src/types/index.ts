export interface FrameDimensions {
  width: number;
  height: number;
  startX: number;
  startY: number;
  thickness: number;
}

export interface CourtDimensions {
  width: number;
  height: number;
  startX: number;
  startY: number;
  singleCourtHeight: number;
  singleStartY: number;
  serviceLineDistance: number;
  centerX: number;
  centerY: number;
}

export interface ServiceBoxDimensions {
  width: number;
  height: number;
}

export interface AnimationConfig {
  duration: number;
  doorPhaseRatio: number;
  zoomStartRatio: number;
  netStartRatio: number;
  maxZoomFactor: number;
  textStartRatio: number;
}

export interface NetConfig {
  width: number;
  height: number;
  startX: number;
  startY: number;
  bandHeight: number;
  sagAmount: number;
  centralBandWidth: number;
  meshSize: number;
}
