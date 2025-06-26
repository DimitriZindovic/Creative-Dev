import { ANIMATION_CONFIG, COLORS } from "../constants";
import { easeInOutSine } from "../utils";
import {
  getFrameDimensions,
  getCourtDimensions,
  getServiceBoxDimensions,
} from "../geometry/dimensions";
import { drawFrame } from "../rendering/frame";
import { drawTennisCourtLines } from "../rendering/court";
import { drawClayTexture } from "../rendering/texture";
import type {
  FrameDimensions,
  CourtDimensions,
  ServiceBoxDimensions,
} from "../types";

export class RolandGarrosAnimation {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private frame: FrameDimensions;
  private court: CourtDimensions;
  private animationProgress = 0;
  private startTime: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Impossible d'obtenir le contexte 2D");

    this.ctx = ctx;
    this.frame = getFrameDimensions(canvas);
    this.court = getCourtDimensions(canvas, this.frame);
    this.startTime = Date.now();
  }

  start() {
    this.drawInitialState();
    setTimeout(() => this.animate(), 2000);
  }

  private drawInitialState() {
    drawFrame(this.canvas);

    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(
      this.frame.startX + this.frame.thickness,
      this.frame.startY + this.frame.thickness,
      this.frame.width - 2 * this.frame.thickness,
      this.frame.height - 2 * this.frame.thickness
    );
    this.ctx.clip();

    drawClayTexture(
      this.ctx,
      this.frame.startX + this.frame.thickness,
      this.frame.startY + this.frame.thickness,
      this.frame.width - 2 * this.frame.thickness,
      this.frame.height - 2 * this.frame.thickness
    );

    drawTennisCourtLines(this.canvas, true, 1);
    this.ctx.restore();
  }

  private animate() {
    const currentTime = Date.now();
    const elapsed = currentTime - this.startTime;
    this.animationProgress = Math.min(elapsed / ANIMATION_CONFIG.duration, 1);

    const easedProgress = easeInOutSine(this.animationProgress);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    drawFrame(this.canvas);
    this.drawCourtBackground();

    if (easedProgress > ANIMATION_CONFIG.zoomStartRatio) {
      this.drawZoomPhase(easedProgress);
    } else {
      this.drawDoorPhase(easedProgress);
    }

    if (this.animationProgress < 1) {
      requestAnimationFrame(() => this.animate());
    }
  }

  private drawCourtBackground() {
    drawClayTexture(
      this.ctx,
      this.frame.startX + this.frame.thickness,
      this.frame.startY + this.frame.thickness,
      this.frame.width - 2 * this.frame.thickness,
      this.frame.height - 2 * this.frame.thickness
    );

    drawTennisCourtLines(this.canvas, true, 1);

    const serviceBox = getServiceBoxDimensions(this.court);
    this.ctx.fillStyle = COLORS.white;

    this.ctx.fillRect(
      this.court.startX + this.court.serviceLineDistance,
      this.court.singleStartY,
      serviceBox.width,
      serviceBox.height * 2
    );

    this.ctx.fillRect(
      this.court.centerX,
      this.court.singleStartY,
      serviceBox.width,
      serviceBox.height * 2
    );
  }

  private drawDoorPhase(easedProgress: number) {
    const doorProgress = Math.min(
      easedProgress / ANIMATION_CONFIG.doorPhaseRatio,
      1
    );

    const serviceBox = getServiceBoxDimensions(this.court);
    const maxSlideDistance = serviceBox.width * 0.85;
    const currentSlideDistance = doorProgress * maxSlideDistance;

    this.drawServiceBoxDoor("left", currentSlideDistance, serviceBox);
    this.drawServiceBoxDoor("right", currentSlideDistance, serviceBox);
  }

  private drawServiceBoxDoor(
    side: "left" | "right",
    slideDistance: number,
    serviceBox: ServiceBoxDimensions
  ) {
    const doorWidth = serviceBox.width;
    const doorHeight = serviceBox.height * 2;

    let doorX: number;
    if (side === "left") {
      doorX =
        this.court.startX + this.court.serviceLineDistance - slideDistance;
    } else {
      doorX = this.court.centerX + slideDistance;
    }

    const doorY = this.court.singleStartY;
    const isVisible =
      side === "left"
        ? doorX + doorWidth > this.court.startX + this.court.serviceLineDistance
        : doorX < this.court.centerX + serviceBox.width;

    if (isVisible) {
      drawClayTexture(this.ctx, doorX, doorY, doorWidth, doorHeight);

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(doorX, doorY, doorWidth, doorHeight);
      this.ctx.clip();
      drawTennisCourtLines(this.canvas, true, 1);
      this.ctx.restore();

      this.ctx.strokeStyle = COLORS.white;
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);

      this.ctx.beginPath();
      this.ctx.moveTo(doorX, this.court.centerY);
      this.ctx.lineTo(doorX + doorWidth, this.court.centerY);
      this.ctx.stroke();
    }
  }

  private drawZoomPhase(easedProgress: number) {
    const zoomProgress =
      (easedProgress - ANIMATION_CONFIG.zoomStartRatio) /
      (1 - ANIMATION_CONFIG.zoomStartRatio);
    const smoothZoomProgress = easeInOutSine(zoomProgress);
    const zoomFactor = 1 + smoothZoomProgress * ANIMATION_CONFIG.maxZoomFactor;

    this.ctx.save();
    this.ctx.translate(this.court.centerX, this.court.centerY);
    this.ctx.scale(zoomFactor, zoomFactor);
    this.ctx.translate(-this.court.centerX, -this.court.centerY);

    drawClayTexture(
      this.ctx,
      this.frame.startX + this.frame.thickness,
      this.frame.startY + this.frame.thickness,
      this.frame.width - 2 * this.frame.thickness,
      this.frame.height - 2 * this.frame.thickness
    );

    drawTennisCourtLines(this.canvas, true, 1);

    const serviceBox = getServiceBoxDimensions(this.court);
    this.ctx.fillStyle = COLORS.white;
    this.ctx.fillRect(
      this.court.startX + this.court.serviceLineDistance,
      this.court.singleStartY,
      serviceBox.width,
      serviceBox.height * 2
    );
    this.ctx.fillRect(
      this.court.centerX,
      this.court.singleStartY,
      serviceBox.width,
      serviceBox.height * 2
    );

    if (zoomProgress < 0.9) {
      const doorOpacity = Math.max(0, 1 - zoomProgress / 0.9);
      const doorProgress = Math.min(
        easedProgress / ANIMATION_CONFIG.doorPhaseRatio,
        1
      );
      const serviceBox = getServiceBoxDimensions(this.court);
      const slideDistance = doorProgress * serviceBox.width * 0.85;

      this.ctx.globalAlpha = doorOpacity;
      this.drawServiceBoxDoor("left", slideDistance, serviceBox);
      this.drawServiceBoxDoor("right", slideDistance, serviceBox);
      this.ctx.globalAlpha = 1;
    }

    this.ctx.restore();
  }
}
