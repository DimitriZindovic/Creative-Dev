import { COLORS } from "../constants";
import { getFrameDimensions, getCourtDimensions } from "../geometry/dimensions";
import type { CourtDimensions } from "../types";

export function drawTennisCourtLines(
  canvas: HTMLCanvasElement,
  showAllLines: boolean = false,
  fadeProgress: number = 1
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const frame = getFrameDimensions(canvas);
  const court = getCourtDimensions(canvas, frame);

  ctx.save();
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.globalAlpha = fadeProgress;

  ctx.strokeRect(court.startX, court.startY, court.width, court.height);
  ctx.strokeRect(
    court.startX,
    court.singleStartY,
    court.width,
    court.singleCourtHeight
  );

  if (showAllLines) {
    drawAllCourtLines(ctx, court);
  } else {
    drawPartialCourtLines(ctx, court);
  }

  ctx.restore();
}

function drawAllCourtLines(
  ctx: CanvasRenderingContext2D,
  court: CourtDimensions
) {
  ctx.beginPath();
  ctx.moveTo(court.centerX, court.startY);
  ctx.lineTo(court.centerX, court.startY + court.height);
  ctx.stroke();

  drawServiceLine(
    ctx,
    court.startX + court.serviceLineDistance,
    court.singleStartY,
    court.singleCourtHeight
  );
  drawServiceLine(
    ctx,
    court.startX + court.width - court.serviceLineDistance,
    court.singleStartY,
    court.singleCourtHeight
  );

  ctx.beginPath();
  ctx.moveTo(court.startX + court.serviceLineDistance, court.centerY);
  ctx.lineTo(
    court.startX + court.width - court.serviceLineDistance,
    court.centerY
  );
  ctx.stroke();
}

function drawPartialCourtLines(
  ctx: CanvasRenderingContext2D,
  court: CourtDimensions
) {
  ctx.beginPath();
  ctx.moveTo(court.centerX, court.startY);
  ctx.lineTo(court.centerX, court.singleStartY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(court.centerX, court.singleStartY + court.singleCourtHeight);
  ctx.lineTo(court.centerX, court.startY + court.height);
  ctx.stroke();

  drawPartialServiceLines(ctx, court);
}

function drawServiceLine(
  ctx: CanvasRenderingContext2D,
  x: number,
  startY: number,
  height: number
) {
  ctx.beginPath();
  ctx.moveTo(x, startY);
  ctx.lineTo(x, startY + height);
  ctx.stroke();
}

function drawPartialServiceLines(
  ctx: CanvasRenderingContext2D,
  court: CourtDimensions
) {
  const leftServiceX = court.startX + court.serviceLineDistance;
  const rightServiceX = court.startX + court.width - court.serviceLineDistance;

  [leftServiceX, rightServiceX].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, court.singleStartY);
    ctx.lineTo(x, court.centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, court.centerY);
    ctx.lineTo(x, court.singleStartY + court.singleCourtHeight);
    ctx.stroke();
  });

  const serviceLineLength = court.centerX - leftServiceX;

  ctx.beginPath();
  ctx.moveTo(leftServiceX, court.centerY);
  ctx.lineTo(leftServiceX + serviceLineLength * 0.1, court.centerY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(court.centerX + serviceLineLength * 0.9, court.centerY);
  ctx.lineTo(rightServiceX, court.centerY);
  ctx.stroke();
}
