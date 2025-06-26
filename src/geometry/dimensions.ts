import type {
  FrameDimensions,
  CourtDimensions,
  ServiceBoxDimensions,
} from "../types";

export function getFrameDimensions(canvas: HTMLCanvasElement): FrameDimensions {
  return {
    width: canvas.width * 0.9,
    height: canvas.height * 0.8,
    startX: (canvas.width - canvas.width * 0.9) / 2,
    startY: (canvas.height - canvas.height * 0.8) / 2,
    thickness: 20,
  };
}

export function getCourtDimensions(
  _canvas: HTMLCanvasElement,
  frame: FrameDimensions
): CourtDimensions {
  const courtWidth = frame.width * 0.85;
  const courtHeight = frame.height * 0.8;
  const startX = frame.startX + (frame.width - courtWidth) / 2;
  const startY = frame.startY + (frame.height - courtHeight) / 2;
  const singleCourtHeight = courtHeight * 0.77;

  return {
    width: courtWidth,
    height: courtHeight,
    startX,
    startY,
    singleCourtHeight,
    singleStartY: startY + (courtHeight - singleCourtHeight) / 2,
    serviceLineDistance: courtWidth * 0.25,
    centerX: startX + courtWidth / 2,
    centerY: startY + courtHeight / 2,
  };
}

export function getServiceBoxDimensions(
  court: CourtDimensions
): ServiceBoxDimensions {
  return {
    width: court.centerX - (court.startX + court.serviceLineDistance),
    height: court.centerY - court.singleStartY,
  };
}
