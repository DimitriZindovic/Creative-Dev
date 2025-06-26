import "normalize.css";
import "./style.css";

let rolandGarrosLogo: HTMLImageElement | null = null;

interface FrameDimensions {
  width: number;
  height: number;
  startX: number;
  startY: number;
  thickness: number;
}

interface CourtDimensions {
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

interface ServiceBoxDimensions {
  width: number;
  height: number;
}

interface AnimationConfig {
  duration: number;
  doorPhaseRatio: number;
  zoomStartRatio: number;
  netStartRatio: number;
  maxZoomFactor: number;
  textStartRatio: number;
}

const COLORS = {
  clay: "#C95917",
  clayDark: "#A04B14",
  clayLight: "#D66B1A",
  clayVeryDark: "#8B3F10",
  clayVeryLight: "#E87D20",
  white: "#FFFFFF",
  frameBlack: "#1a1a1a",
  frameDark: "#0d0d0d",
  frameHighlight: "#2d2d2d",
  shadowDark: "rgba(0, 0, 0, 0.4)",
  shadowLight: "rgba(0, 0, 0, 0.2)",
} as const;

const ANIMATION_CONFIG: AnimationConfig = {
  duration: 9000,
  doorPhaseRatio: 0.7,
  zoomStartRatio: 0.4,
  netStartRatio: 0.6,
  maxZoomFactor: 20,
  textStartRatio: 0.8,
};

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function loadRolandGarrosLogo(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      rolandGarrosLogo = img;
      resolve(img);
    };
    img.src = "/roland-garros-logo.png";
  });
}

function getFrameDimensions(canvas: HTMLCanvasElement): FrameDimensions {
  return {
    width: canvas.width * 0.9,
    height: canvas.height * 0.8,
    startX: (canvas.width - canvas.width * 0.9) / 2,
    startY: (canvas.height - canvas.height * 0.8) / 2,
    thickness: 20,
  };
}

function getCourtDimensions(
  canvas: HTMLCanvasElement,
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

function getServiceBoxDimensions(court: CourtDimensions): ServiceBoxDimensions {
  return {
    width: court.centerX - (court.startX + court.serviceLineDistance),
    height: court.centerY - court.singleStartY,
  };
}

function drawTennisCourtLines(
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

class RolandGarrosAnimation {
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

    if (zoomProgress > ANIMATION_CONFIG.netStartRatio) {
      const netProgress =
        (zoomProgress - ANIMATION_CONFIG.netStartRatio) /
        (1 - ANIMATION_CONFIG.netStartRatio);
      const smoothNetProgress = 1 - Math.pow(1 - netProgress, 3);
      drawTennisNet(
        this.ctx,
        this.canvas.width,
        this.canvas.height,
        smoothNetProgress
      );

      if (smoothNetProgress > 0.8) {
        const textProgress = (smoothNetProgress - 0.8) / 0.2;
        this.drawRolandGarrosText(textProgress);
      }
    }
  }

  private drawRolandGarrosText(textProgress: number) {
    this.ctx.save();

    const easedTextProgress = easeInOutSine(textProgress);
    this.ctx.globalAlpha = easedTextProgress;

    const text = "ROLAND GARROS";
    const x = this.canvas.width / 2;
    const baseY = this.canvas.height * 0.4 + (1 - easedTextProgress) * 30;

    if (rolandGarrosLogo) {
      const logoScale = 0.15;
      const logoWidth = rolandGarrosLogo.width * logoScale;
      const logoHeight = rolandGarrosLogo.height * logoScale;
      const logoX = x - logoWidth / 2;
      const logoY = this.canvas.height * 0.12 + (1 - easedTextProgress) * 20;

      this.ctx.drawImage(rolandGarrosLogo, logoX, logoY, logoWidth, logoHeight);
    }

    this.ctx.font = "bold 58px Montserrat, Arial, sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    this.ctx.fillStyle = COLORS.clay;
    this.ctx.fillText(text, x, baseY);

    this.ctx.font = "bold 32px Montserrat, Arial, sans-serif";
    const yearY = baseY + 50;
    this.ctx.fillText("2025", x, yearY);

    this.ctx.restore();
  }
}

function animateDoorOpening(canvas: HTMLCanvasElement) {
  loadRolandGarrosLogo().catch((error) => {
    console.warn("Logo non chargé, animation sans logo:", error);
  });

  const animation = new RolandGarrosAnimation(canvas);
  animation.start();
}

function drawFrame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const frame = getFrameDimensions(canvas);

  ctx.fillStyle = COLORS.white;

  ctx.fillRect(0, 0, canvas.width, frame.startY);
  ctx.fillRect(
    0,
    frame.startY + frame.height,
    canvas.width,
    canvas.height - (frame.startY + frame.height)
  );
  ctx.fillRect(0, frame.startY, frame.startX, frame.height);
  ctx.fillRect(
    frame.startX + frame.width,
    frame.startY,
    canvas.width - (frame.startX + frame.width),
    frame.height
  );

  const shadowOffset = 12;
  const shadowBlur = 8;

  ctx.save();
  ctx.shadowColor = COLORS.shadowDark;
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = shadowOffset;
  ctx.shadowOffsetY = shadowOffset;

  ctx.fillStyle = COLORS.frameBlack;
  ctx.fillRect(frame.startX, frame.startY, frame.width, frame.height);

  ctx.restore();

  ctx.fillStyle = COLORS.frameBlack;
  ctx.fillRect(frame.startX, frame.startY, frame.width, frame.thickness);
  ctx.fillRect(
    frame.startX,
    frame.startY + frame.height - frame.thickness,
    frame.width,
    frame.thickness
  );
  ctx.fillRect(frame.startX, frame.startY, frame.thickness, frame.height);
  ctx.fillRect(
    frame.startX + frame.width - frame.thickness,
    frame.startY,
    frame.thickness,
    frame.height
  );

  const bevelWidth = 6;

  ctx.fillStyle = COLORS.frameHighlight;
  ctx.fillRect(frame.startX + 2, frame.startY + 2, frame.width - 4, bevelWidth); // Haut intérieur
  ctx.fillRect(
    frame.startX + 2,
    frame.startY + 2,
    bevelWidth,
    frame.height - 4
  );

  ctx.fillStyle = COLORS.frameDark;
  ctx.fillRect(
    frame.startX + 2,
    frame.startY + frame.height - frame.thickness + 2,
    frame.width - 4,
    bevelWidth
  );
  ctx.fillRect(
    frame.startX + frame.width - frame.thickness + 2,
    frame.startY + 2,
    bevelWidth,
    frame.height - 4
  );

  ctx.strokeStyle = COLORS.frameDark;
  ctx.lineWidth = 2;
  ctx.strokeRect(
    frame.startX + frame.thickness - 1,
    frame.startY + frame.thickness - 1,
    frame.width - 2 * frame.thickness + 2,
    frame.height - 2 * frame.thickness + 2
  );

  ctx.strokeStyle = COLORS.frameHighlight;
  ctx.lineWidth = 1;
  ctx.strokeRect(
    frame.startX + 1,
    frame.startY + 1,
    frame.width - 2,
    frame.height - 2
  );
}

function drawTennisNet(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  animationProgress: number = 1
) {
  const netConfig = {
    width: canvasWidth,
    height: canvasHeight * 0.2,
    startX: 0,
    startY: (canvasHeight - canvasHeight * 0.2) / 2 + canvasHeight * 0.1,
    bandHeight: 12,
    sagAmount: 8,
    centralBandWidth: 8,
    meshSize: 15,
  };

  ctx.save();

  const easeProgress = easeInOutCubic(animationProgress);
  ctx.globalAlpha = easeProgress;

  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  const scaleProgress = 0.3 + easeProgress * 0.7;
  ctx.scale(scaleProgress, scaleProgress);
  ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

  drawNetBand(ctx, netConfig);
  drawNetCentralBand(ctx, netConfig);

  if (animationProgress > 0.3) {
    drawNetMesh(ctx, netConfig, animationProgress, easeProgress);
  }

  drawNetContours(ctx, netConfig, easeProgress);

  ctx.restore();
}

function drawNetBand(ctx: CanvasRenderingContext2D, config: any) {
  const centerX = config.startX + config.width / 2;

  ctx.fillStyle = COLORS.clay;
  ctx.beginPath();
  ctx.moveTo(config.startX, config.startY);
  ctx.quadraticCurveTo(
    centerX,
    config.startY + config.sagAmount,
    config.startX + config.width,
    config.startY
  );
  ctx.lineTo(
    config.startX + config.width,
    config.startY + config.bandHeight + config.sagAmount / 2
  );
  ctx.quadraticCurveTo(
    centerX,
    config.startY + config.bandHeight + config.sagAmount + config.sagAmount / 2,
    config.startX,
    config.startY + config.bandHeight + config.sagAmount / 2
  );
  ctx.closePath();
  ctx.fill();
}

function drawNetCentralBand(ctx: CanvasRenderingContext2D, config: any) {
  const centralBandX = config.startX + config.width / 2;
  ctx.fillStyle = COLORS.clay;
  ctx.fillRect(
    centralBandX - config.centralBandWidth / 2,
    config.startY,
    config.centralBandWidth,
    config.height
  );
}

function drawNetMesh(
  ctx: CanvasRenderingContext2D,
  config: any,
  animationProgress: number,
  easeProgress: number
) {
  const meshStartY = config.startY + config.bandHeight + config.sagAmount / 2;
  const meshHeight = config.height - config.bandHeight - config.sagAmount / 2;
  const meshProgress = Math.min((animationProgress - 0.3) / 0.7, 1);
  const centerX = config.startX + config.width / 2;
  const centralBandX = config.startX + config.width / 2;

  ctx.strokeStyle = COLORS.clay;
  ctx.lineWidth = 2;
  ctx.globalAlpha = easeProgress * meshProgress;

  for (
    let x = config.startX;
    x <= config.startX + config.width;
    x += config.meshSize
  ) {
    if (Math.abs(x - centralBandX) > config.centralBandWidth / 2) {
      const progress = (x - config.startX) / config.width;
      const curveOffset = config.sagAmount * Math.sin(progress * Math.PI);

      ctx.beginPath();
      ctx.moveTo(x, meshStartY + curveOffset);
      ctx.lineTo(x, meshStartY + meshHeight + curveOffset);
      ctx.stroke();
    }
  }

  for (let y = meshStartY; y <= meshStartY + meshHeight; y += config.meshSize) {
    ctx.beginPath();
    ctx.moveTo(config.startX, y);
    ctx.quadraticCurveTo(
      centerX,
      y + config.sagAmount / 2,
      config.startX + config.width,
      y
    );
    ctx.stroke();
  }
}

function drawNetContours(
  ctx: CanvasRenderingContext2D,
  config: any,
  easeProgress: number
) {
  const centerX = config.startX + config.width / 2;

  ctx.globalAlpha = easeProgress;
  ctx.strokeStyle = COLORS.clay;
  ctx.lineWidth = 4;

  ctx.beginPath();
  ctx.moveTo(config.startX, config.startY);
  ctx.quadraticCurveTo(
    centerX,
    config.startY + config.sagAmount,
    config.startX + config.width,
    config.startY
  );
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(config.startX, config.startY + config.height);
  ctx.quadraticCurveTo(
    centerX,
    config.startY + config.height + config.sagAmount,
    config.startX + config.width,
    config.startY + config.height
  );
  ctx.stroke();
}

let clayTextureCache: Map<string, HTMLCanvasElement> = new Map();

function fastNoise(x: number, y: number, seed: number = 12345): number {
  let n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

function fractalNoise(x: number, y: number, octaves: number = 4): number {
  let value = 0;
  let amplitude = 1;
  let frequency = 1;
  let maxValue = 0;

  for (let i = 0; i < octaves; i++) {
    value += fastNoise(x * frequency, y * frequency, i) * amplitude;
    maxValue += amplitude;
    amplitude *= 0.6;
    frequency *= 2.2;
  }

  const normalizedValue = value / maxValue;
  return Math.sign(normalizedValue) * Math.pow(Math.abs(normalizedValue), 0.75);
}

function createClayTexture(width: number, height: number): HTMLCanvasElement {
  const tileSize = 256;
  const actualWidth = Math.min(width, tileSize);
  const actualHeight = Math.min(height, tileSize);

  const canvas = document.createElement("canvas");
  canvas.width = actualWidth;
  canvas.height = actualHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const imageData = ctx.createImageData(actualWidth, actualHeight);
  const data = imageData.data;

  const baseColor = { r: 201, g: 89, b: 23 };
  const lightColor = { r: 214, g: 107, b: 26 };
  const darkColor = { r: 160, g: 75, b: 20 };
  const veryLightColor = { r: 232, g: 125, b: 32 };
  const veryDarkColor = { r: 139, g: 63, b: 16 };

  for (let y = 0; y < actualHeight; y++) {
    for (let x = 0; x < actualWidth; x++) {
      const index = (y * actualWidth + x) * 4;

      const scale1 = 0.015;
      const scale2 = 0.07;
      const scale3 = 0.3;
      const scale4 = 0.8;

      const noise1 = fractalNoise(x * scale1, y * scale1, 3) * 1.2;
      const noise2 = fractalNoise(x * scale2, y * scale2, 2) * 0.8;
      const noise3 = fractalNoise(x * scale3, y * scale3, 2) * 0.5;
      const noise4 = fractalNoise(x * scale4, y * scale4, 1) * 0.3;

      const totalNoise = noise1 + noise2 + noise3 + noise4;

      let r, g, b;

      if (totalNoise > 0.25) {
        const factor = Math.min(totalNoise * 1.5, 1.2);
        r = baseColor.r + (veryLightColor.r - baseColor.r) * factor * 0.8;
        g = baseColor.g + (veryLightColor.g - baseColor.g) * factor * 0.8;
        b = baseColor.b + (veryLightColor.b - baseColor.b) * factor * 0.8;
      } else if (totalNoise > 0.1) {
        const factor = Math.min((totalNoise - 0.1) * 2.0, 1.0);
        r = baseColor.r + (lightColor.r - baseColor.r) * factor;
        g = baseColor.g + (lightColor.g - baseColor.g) * factor;
        b = baseColor.b + (lightColor.b - baseColor.b) * factor;
      } else if (totalNoise < -0.25) {
        const factor = Math.min(Math.abs(totalNoise + 0.25) * 1.5, 1.2);
        r = baseColor.r + (veryDarkColor.r - baseColor.r) * factor * 0.8;
        g = baseColor.g + (veryDarkColor.g - baseColor.g) * factor * 0.8;
        b = baseColor.b + (veryDarkColor.b - baseColor.b) * factor * 0.8;
      } else if (totalNoise < -0.1) {
        const factor = Math.min(Math.abs(totalNoise + 0.1) * 2.0, 1.0);
        r = baseColor.r + (darkColor.r - baseColor.r) * factor;
        g = baseColor.g + (darkColor.g - baseColor.g) * factor;
        b = baseColor.b + (darkColor.b - baseColor.b) * factor;
      } else {
        const variation = totalNoise * 40;
        r = baseColor.r + variation;
        g = baseColor.g + variation * 0.8;
        b = baseColor.b + variation * 0.6;
      }

      const grain = fastNoise(x * 0.4, y * 0.4, 999) * 25;
      r += grain;
      g += grain * 0.8;
      b += grain * 0.6;

      data[index] = Math.max(0, Math.min(255, Math.round(r)));
      data[index + 1] = Math.max(0, Math.min(255, Math.round(g)));
      data[index + 2] = Math.max(0, Math.min(255, Math.round(b)));
      data[index + 3] = 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  addOrganicDetails(ctx, actualWidth, actualHeight);

  return canvas;
}

function addOrganicDetails(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  ctx.save();

  ctx.globalAlpha = 0.15;
  const numSpots = Math.min(35, (width * height) / 7000);

  for (let i = 0; i < numSpots; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = Math.random() * 4 + 1.5;
    const opacity = Math.random() * 0.3 + 0.1;

    ctx.globalAlpha = opacity;
    const colorChoice = Math.random();
    if (colorChoice > 0.6) {
      ctx.fillStyle = COLORS.clayLight;
    } else if (colorChoice > 0.4) {
      ctx.fillStyle = COLORS.clayDark;
    } else {
      ctx.fillStyle =
        Math.random() > 0.5 ? COLORS.clayVeryLight : COLORS.clayVeryDark;
    }
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.1;
  ctx.strokeStyle = COLORS.clayDark;
  ctx.lineWidth = 1;

  const numLines = Math.min(20, width / 50);
  for (let i = 0; i < numLines; i++) {
    const startX = Math.random() * width;
    const startY = Math.random() * height;
    const length = Math.random() * 25 + 8;
    const angle = Math.random() * Math.PI * 2;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(
      startX + Math.cos(angle) * length,
      startY + Math.sin(angle) * length
    );
    ctx.stroke();
  }

  ctx.restore();
}

function drawClayTexture(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) {
  const cacheKey = `${Math.min(width, 256)}_${Math.min(height, 256)}`;

  if (!clayTextureCache.has(cacheKey)) {
    clayTextureCache.set(cacheKey, createClayTexture(width, height));
  }

  const texture = clayTextureCache.get(cacheKey)!;

  const textureWidth = texture.width;
  const textureHeight = texture.height;

  for (let tileY = y; tileY < y + height; tileY += textureHeight) {
    for (let tileX = x; tileX < x + width; tileX += textureWidth) {
      const drawWidth = Math.min(textureWidth, x + width - tileX);
      const drawHeight = Math.min(textureHeight, y + height - tileY);

      ctx.drawImage(
        texture,
        0,
        0,
        drawWidth,
        drawHeight,
        tileX,
        tileY,
        drawWidth,
        drawHeight
      );
    }
  }
}

const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
if (canvasElement) {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  const ctx = canvasElement.getContext("2d");
  if (ctx) {
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
  }

  animateDoorOpening(canvasElement);
}
