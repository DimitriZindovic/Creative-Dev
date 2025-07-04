import "normalize.css";
import "./style.css";

import { COLORS } from "./constants";
import { getFrameDimensions } from "./geometry/dimensions";
import { drawFrame } from "./rendering/frame";
import { drawTennisCourtLines } from "./rendering/court";
import { drawClayTexture } from "./rendering/texture";
import { RolandGarrosAnimation } from "./animation/RolandGarrosAnimation";

function initializeCanvas() {
  const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvasElement) return;

  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  const ctx = canvasElement.getContext("2d");
  if (!ctx) return;

  const frame = getFrameDimensions(canvasElement);

  ctx.fillStyle = COLORS.white;
  ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  drawFrame(canvasElement);

  ctx.save();
  ctx.beginPath();
  ctx.rect(
    frame.startX + frame.thickness,
    frame.startY + frame.thickness,
    frame.width - 2 * frame.thickness,
    frame.height - 2 * frame.thickness
  );
  ctx.clip();

  drawClayTexture(
    ctx,
    frame.startX + frame.thickness,
    frame.startY + frame.thickness,
    frame.width - 2 * frame.thickness,
    frame.height - 2 * frame.thickness
  );

  drawTennisCourtLines(canvasElement, true, 1);
  ctx.restore();

  const animation = new RolandGarrosAnimation(canvasElement);
  animation.start();
}

function handleResize() {
  initializeCanvas();
}

document.addEventListener("DOMContentLoaded", initializeCanvas);
window.addEventListener("resize", handleResize);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCanvas);
} else {
  initializeCanvas();
}
