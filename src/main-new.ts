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

  // Dessiner le fond blanc
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

  // Dessiner le cadre
  drawFrame(canvasElement);

  // Masquer pour dessiner uniquement dans le cadre
  ctx.save();
  ctx.beginPath();
  ctx.rect(
    frame.startX + frame.thickness,
    frame.startY + frame.thickness,
    frame.width - 2 * frame.thickness,
    frame.height - 2 * frame.thickness
  );
  ctx.clip();

  // Dessiner la texture terre battue
  drawClayTexture(
    ctx,
    frame.startX + frame.thickness,
    frame.startY + frame.thickness,
    frame.width - 2 * frame.thickness,
    frame.height - 2 * frame.thickness
  );

  // Dessiner les lignes du terrain
  drawTennisCourtLines(canvasElement, true, 1);
  ctx.restore();

  // Démarrer l'animation
  const animation = new RolandGarrosAnimation(canvasElement);
  animation.start();
}

// Gestion du redimensionnement
function handleResize() {
  initializeCanvas();
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", initializeCanvas);
window.addEventListener("resize", handleResize);

// Initialisation immédiate si le DOM est déjà chargé
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeCanvas);
} else {
  initializeCanvas();
}
