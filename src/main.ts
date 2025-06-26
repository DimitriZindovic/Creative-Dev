import "normalize.css";
import "./style.css";

// ==================== TYPES ET CONSTANTES ====================

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
}

const COLORS = {
  clay: "#C95917",
  grass: "#00503C",
  white: "#FFFFFF",
  frameGold: "#D4AF37",
  frameShadow: "#B8860B",
} as const;

const ANIMATION_CONFIG: AnimationConfig = {
  duration: 7000,
  doorPhaseRatio: 0.9,
  zoomStartRatio: 0.5,
  netStartRatio: 0.7,
  maxZoomFactor: 20,
};

// ==================== UTILITAIRES ====================

function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
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

// ==================== FONCTIONS DE DESSIN ====================

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

  // Contours du terrain
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
  // Ligne centrale (filet)
  ctx.beginPath();
  ctx.moveTo(court.centerX, court.startY);
  ctx.lineTo(court.centerX, court.startY + court.height);
  ctx.stroke();

  // Lignes de service
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

  // Ligne centrale de service
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
  // Ligne centrale évitant les zones vertes
  ctx.beginPath();
  ctx.moveTo(court.centerX, court.startY);
  ctx.lineTo(court.centerX, court.singleStartY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(court.centerX, court.singleStartY + court.singleCourtHeight);
  ctx.lineTo(court.centerX, court.startY + court.height);
  ctx.stroke();

  // Lignes de service partielles
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

  // Lignes de service gauche et droite (parties haute et basse)
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

  // Ligne centrale de service (extrémités seulement)
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

// ==================== ANIMATION PRINCIPALE ====================

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

    this.ctx.fillStyle = COLORS.clay;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
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

    this.drawGreenBackground();

    if (easedProgress > ANIMATION_CONFIG.zoomStartRatio) {
      this.drawZoomPhase(easedProgress);
    } else {
      this.drawDoorPhase(easedProgress);
    }

    if (this.animationProgress < 1) {
      requestAnimationFrame(() => this.animate());
    }
  }

  private drawGreenBackground() {
    // Dessiner d'abord le fond orange (terre battue) sur toute la zone du cadre
    this.ctx.fillStyle = COLORS.clay;
    this.ctx.fillRect(
      this.frame.startX + this.frame.thickness,
      this.frame.startY + this.frame.thickness,
      this.frame.width - 2 * this.frame.thickness,
      this.frame.height - 2 * this.frame.thickness
    );

    // Dessiner le terrain de tennis avec toutes les lignes
    drawTennisCourtLines(this.canvas, true, 1);

    // Puis dessiner les zones vertes spécifiquement dans les carrés de service
    const serviceBox = getServiceBoxDimensions(this.court);
    this.ctx.fillStyle = COLORS.grass;

    // Carré de service gauche (haut et bas)
    this.ctx.fillRect(
      this.court.startX + this.court.serviceLineDistance,
      this.court.singleStartY,
      serviceBox.width,
      serviceBox.height * 2
    );

    // Carré de service droit (haut et bas)
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

    // Calculer les dimensions des carrés de service
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
    const doorHeight = serviceBox.height * 2; // Couvre les deux carrés de service (haut et bas)

    let doorX: number;
    if (side === "left") {
      doorX =
        this.court.startX + this.court.serviceLineDistance - slideDistance;
    } else {
      doorX = this.court.centerX + slideDistance;
    }

    const doorY = this.court.singleStartY;

    // Vérifier si la porte est encore visible
    const isVisible =
      side === "left"
        ? doorX + doorWidth > this.court.startX + this.court.serviceLineDistance
        : doorX < this.court.centerX + serviceBox.width;

    if (isVisible) {
      // Dessiner la porte orange avec le terrain de tennis
      this.ctx.fillStyle = COLORS.clay;
      this.ctx.fillRect(doorX, doorY, doorWidth, doorHeight);

      // Sauvegarder le contexte pour dessiner le terrain dans la porte
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.rect(doorX, doorY, doorWidth, doorHeight);
      this.ctx.clip();

      // Dessiner les lignes du terrain de tennis dans la zone de la porte
      drawTennisCourtLines(this.canvas, true, 1);

      this.ctx.restore();

      // Bordure de la porte
      this.ctx.strokeStyle = COLORS.white;
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(doorX, doorY, doorWidth, doorHeight);

      // Ligne de séparation au milieu (entre les deux carrés de service)
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

    // Dessiner le fond orange et le terrain complet
    this.ctx.fillStyle = COLORS.clay;
    this.ctx.fillRect(
      this.frame.startX + this.frame.thickness,
      this.frame.startY + this.frame.thickness,
      this.frame.width - 2 * this.frame.thickness,
      this.frame.height - 2 * this.frame.thickness
    );

    // Dessiner le terrain de tennis avec toutes les lignes pendant le zoom
    drawTennisCourtLines(this.canvas, true, 1);

    // Dessiner les zones vertes par-dessus
    const serviceBox = getServiceBoxDimensions(this.court);
    this.ctx.fillStyle = COLORS.grass;
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

    // Dessiner les portes avec opacité décroissante
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

    // Dessiner le filet
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
    }
  }
}

// ==================== INITIALISATION ====================

function animateDoorOpening(canvas: HTMLCanvasElement) {
  const animation = new RolandGarrosAnimation(canvas);
  animation.start();
}

function drawFrame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const frame = getFrameDimensions(canvas);

  // Dessiner le mur blanc autour du cadre
  ctx.fillStyle = COLORS.white;

  // Murs autour du cadre
  ctx.fillRect(0, 0, canvas.width, frame.startY); // Haut
  ctx.fillRect(
    0,
    frame.startY + frame.height,
    canvas.width,
    canvas.height - (frame.startY + frame.height)
  ); // Bas
  ctx.fillRect(0, frame.startY, frame.startX, frame.height); // Gauche
  ctx.fillRect(
    frame.startX + frame.width,
    frame.startY,
    canvas.width - (frame.startX + frame.width),
    frame.height
  ); // Droite

  // Cadre principal (bordure dorée)
  ctx.strokeStyle = COLORS.frameGold;
  ctx.lineWidth = frame.thickness;
  ctx.strokeRect(frame.startX, frame.startY, frame.width, frame.height);

  // Cadre intérieur (ombre)
  ctx.strokeStyle = COLORS.frameShadow;
  ctx.lineWidth = 8;
  ctx.strokeRect(
    frame.startX + frame.thickness / 2,
    frame.startY + frame.thickness / 2,
    frame.width - frame.thickness,
    frame.height - frame.thickness
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
    startY: (canvasHeight - canvasHeight * 0.2) / 2,
    bandHeight: 12,
    sagAmount: 8,
    centralBandWidth: 8,
    meshSize: 15,
  };

  ctx.save();

  const easeProgress = easeInOutCubic(animationProgress);
  ctx.globalAlpha = easeProgress;

  // Transformation d'échelle progressive
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

  ctx.fillStyle = COLORS.white;
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
  ctx.fillStyle = COLORS.white;
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

  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 2;
  ctx.globalAlpha = easeProgress * meshProgress;

  // Lignes verticales
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

  // Lignes horizontales
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
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 4;

  // Contour supérieur
  ctx.beginPath();
  ctx.moveTo(config.startX, config.startY);
  ctx.quadraticCurveTo(
    centerX,
    config.startY + config.sagAmount,
    config.startX + config.width,
    config.startY
  );
  ctx.stroke();

  // Contour inférieur
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

const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
if (canvasElement) {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  // Initialiser avec le rendu initial
  const ctx = canvasElement.getContext("2d");
  if (ctx) {
    const frame = getFrameDimensions(canvasElement);

    drawFrame(canvasElement);

    // Masque pour le rendu initial
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      frame.startX + frame.thickness,
      frame.startY + frame.thickness,
      frame.width - 2 * frame.thickness,
      frame.height - 2 * frame.thickness
    );
    ctx.clip();

    ctx.fillStyle = COLORS.clay;
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    drawTennisCourtLines(canvasElement, true, 1);

    ctx.restore();
  }

  // Démarrer l'animation
  animateDoorOpening(canvasElement);
  drawFrame(canvasElement);
}
