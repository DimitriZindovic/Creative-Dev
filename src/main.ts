import "normalize.css";
import "./style.css";

function drawTennisCourtLines(
  canvas: HTMLCanvasElement,
  showAllLines: boolean = false,
  fadeProgress: number = 1
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Dimensions du cadre tableau
  const frameWidth = canvas.width * 0.9;
  const frameHeight = canvas.height * 0.8;
  const frameStartX = (canvas.width - frameWidth) / 2;
  const frameStartY = (canvas.height - frameHeight) / 2;

  const courtWidth = frameWidth * 0.85; // Terrain plus petit pour laisser place au cadre
  const courtHeight = frameHeight * 0.8;
  const startX = frameStartX + (frameWidth - courtWidth) / 2;
  const startY = frameStartY + (frameHeight - courtHeight) / 2;

  const singleCourtHeight = courtHeight * 0.77;
  const singleStartY = startY + (courtHeight - singleCourtHeight) / 2;
  const serviceLineDistance = courtWidth * 0.25;
  const centerX = startX + courtWidth / 2;
  const centerY = startY + courtHeight / 2;

  // Dessiner seulement les lignes (le cadre et la texture terre battue sont déjà appliqués)
  ctx.save();
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.globalAlpha = fadeProgress; // Appliquer l'opacité progressive

  // Contour extérieur du terrain
  ctx.strokeRect(startX, startY, courtWidth, courtHeight);

  // Contour du terrain simple
  ctx.strokeRect(startX, singleStartY, courtWidth, singleCourtHeight);

  if (showAllLines) {
    // Quand le terrain est entièrement orange, dessiner TOUTES les lignes

    // Ligne centrale (filet) - ligne complète
    ctx.beginPath();
    ctx.moveTo(centerX, startY);
    ctx.lineTo(centerX, startY + courtHeight);
    ctx.stroke();

    // Lignes de service - lignes complètes
    // Ligne de service gauche - complète
    ctx.beginPath();
    ctx.moveTo(startX + serviceLineDistance, singleStartY);
    ctx.lineTo(startX + serviceLineDistance, singleStartY + singleCourtHeight);
    ctx.stroke();

    // Ligne de service droite - complète
    ctx.beginPath();
    ctx.moveTo(startX + courtWidth - serviceLineDistance, singleStartY);
    ctx.lineTo(
      startX + courtWidth - serviceLineDistance,
      singleStartY + singleCourtHeight
    );
    ctx.stroke();

    // Ligne centrale de service - complète
    ctx.beginPath();
    ctx.moveTo(startX + serviceLineDistance, centerY);
    ctx.lineTo(startX + courtWidth - serviceLineDistance, centerY);
    ctx.stroke();
  } else {
    // Mode normal : éviter les zones vertes

    // Ligne centrale (filet) - éviter les zones vertes
    ctx.beginPath();
    ctx.moveTo(centerX, startY);
    ctx.lineTo(centerX, singleStartY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(centerX, singleStartY + singleCourtHeight);
    ctx.lineTo(centerX, startY + courtHeight);
    ctx.stroke();

    // Lignes de service - éviter les zones vertes
    // Ligne de service gauche - parties haute et basse seulement
    ctx.beginPath();
    ctx.moveTo(startX + serviceLineDistance, singleStartY);
    ctx.lineTo(startX + serviceLineDistance, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startX + serviceLineDistance, centerY);
    ctx.lineTo(startX + serviceLineDistance, singleStartY + singleCourtHeight);
    ctx.stroke();

    // Ligne de service droite - parties haute et basse seulement
    ctx.beginPath();
    ctx.moveTo(startX + courtWidth - serviceLineDistance, singleStartY);
    ctx.lineTo(startX + courtWidth - serviceLineDistance, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startX + courtWidth - serviceLineDistance, centerY);
    ctx.lineTo(
      startX + courtWidth - serviceLineDistance,
      singleStartY + singleCourtHeight
    );
    ctx.stroke();

    // Ligne centrale de service - éviter les zones vertes en ne dessinant que les extrémités
    ctx.beginPath();
    ctx.moveTo(startX + serviceLineDistance, centerY);
    ctx.lineTo(
      startX +
        serviceLineDistance +
        (centerX - (startX + serviceLineDistance)) * 0.1,
      centerY
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(
      centerX + (centerX - (startX + serviceLineDistance)) * 0.9,
      centerY
    );
    ctx.lineTo(startX + courtWidth - serviceLineDistance, centerY);
    ctx.stroke();
  }

  ctx.restore();
}

function animateDoorOpening(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Dimensions du cadre tableau
  const frameWidth = canvas.width * 0.9;
  const frameHeight = canvas.height * 0.8;
  const frameStartX = (canvas.width - frameWidth) / 2;
  const frameStartY = (canvas.height - frameHeight) / 2;

  // Calculer les dimensions du terrain
  const courtWidth = frameWidth * 0.85;
  const courtHeight = frameHeight * 0.8;
  const startX = frameStartX + (frameWidth - courtWidth) / 2;
  const startY = frameStartY + (frameHeight - courtHeight) / 2;
  const singleCourtHeight = courtHeight * 0.77;
  const singleStartY = startY + (courtHeight - singleCourtHeight) / 2;
  const serviceLineDistance = courtWidth * 0.25;
  const centerX = startX + courtWidth / 2;
  const centerY = startY + courtHeight / 2;
  const serviceBoxWidth = centerX - (startX + serviceLineDistance);
  const serviceBoxHeight = centerY - singleStartY;

  // TEXTURE TERRE BATTUE DÉSACTIVÉE
  // Créer seulement un fond de base uni sans texture terre battue
  const textureCanvas = document.createElement("canvas");
  textureCanvas.width = canvas.width;
  textureCanvas.height = canvas.height;
  const textureCtx = textureCanvas.getContext("2d");

  // Fond de base uni couleur terre battue (sans texture)
  if (textureCtx) {
    textureCtx.fillStyle = "#C95917"; // Couleur de base terre battue unie
    textureCtx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // Canvas vide pour remplacer la texture terre battue
  const clayTextureCanvas = document.createElement("canvas");
  clayTextureCanvas.width = canvas.width;
  clayTextureCanvas.height = canvas.height;
  // Laisser le canvas complètement transparent (pas de texture terre battue)

  // Créer les textures des portes une seule fois
  const leftDoorCanvas = document.createElement("canvas");
  leftDoorCanvas.width = serviceBoxWidth;
  leftDoorCanvas.height = serviceBoxHeight * 2;
  const leftDoorCtx = leftDoorCanvas.getContext("2d");

  const rightDoorCanvas = document.createElement("canvas");
  rightDoorCanvas.width = serviceBoxWidth;
  rightDoorCanvas.height = serviceBoxHeight * 2;
  const rightDoorCtx = rightDoorCanvas.getContext("2d");

  if (leftDoorCtx) {
    // TEXTURE TERRE BATTUE DÉSACTIVÉE SUR LES PORTES
    // Appliquer seulement un fond orange uni sans texture
    leftDoorCtx.fillStyle = "#C95917"; // Couleur orange unie
    leftDoorCtx.fillRect(0, 0, serviceBoxWidth, serviceBoxHeight * 2);
  }
  if (rightDoorCtx) {
    // TEXTURE TERRE BATTUE DÉSACTIVÉE SUR LES PORTES
    // Appliquer seulement un fond orange uni sans texture
    rightDoorCtx.fillStyle = "#C95917"; // Couleur orange unie
    rightDoorCtx.fillRect(0, 0, serviceBoxWidth, serviceBoxHeight * 2);
  }

  let animationProgress = 0;
  const animationDuration = 7000; // Durée encore plus augmentée pour animation plus lente
  const startTime = Date.now();

  function animate() {
    if (!ctx) return;

    const currentTime = Date.now();
    const elapsed = currentTime - startTime;
    animationProgress = Math.min(elapsed / animationDuration, 1);

    // Easing ultra-smooth pour le zoom avec courbe de Bézier
    const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

    const easedProgress = easeInOutSine(animationProgress);

    // Calculer les dimensions du terrain
    const frameWidth = canvas.width * 0.9;
    const frameHeight = canvas.height * 0.8;
    const frameStartX = (canvas.width - frameWidth) / 2;
    const frameStartY = (canvas.height - frameHeight) / 2;

    const courtWidth = frameWidth * 0.85;
    const courtHeight = frameHeight * 0.8;
    const startX = frameStartX + (frameWidth - courtWidth) / 2;
    const startY = frameStartY + (frameHeight - courtHeight) / 2;
    const singleCourtHeight = courtHeight * 0.77;
    const singleStartY = startY + (courtHeight - singleCourtHeight) / 2;
    const serviceLineDistance = courtWidth * 0.25;
    const centerX = startX + courtWidth / 2;
    const centerY = startY + courtHeight / 2;

    // Dimensions des carrés de service
    const serviceBoxWidth = centerX - (startX + serviceLineDistance);
    const serviceBoxHeight = centerY - singleStartY;

    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le cadre et le mur blanc
    drawFrame(canvas);

    // Dès le début de l'animation, créer les zones vertes
    // 1. D'abord dessiner le fond et les textures terre battue partout SAUF dans les zones vertes
    ctx.save();

    // Créer un chemin de découpe qui exclut les zones vertes
    ctx.beginPath();
    // Rectangle du canvas complet
    ctx.rect(0, 0, canvas.width, canvas.height);
    // Soustraire les zones vertes (holes dans le masque)
    ctx.rect(
      startX + serviceLineDistance,
      singleStartY,
      serviceBoxWidth,
      serviceBoxHeight * 2
    );
    ctx.rect(centerX, singleStartY, serviceBoxWidth, serviceBoxHeight * 2);
    ctx.clip("evenodd"); // evenodd permet les "trous"

    // Appliquer le fond de base orange (seulement dans les zones autorisées par le masque)
    if (textureCanvas) {
      ctx.drawImage(textureCanvas, 0, 0);
    }

    // Appliquer la texture terre battue (seulement dans les zones autorisées par le masque)
    if (clayTextureCanvas) {
      ctx.drawImage(clayTextureCanvas, 0, 0);
    }

    ctx.restore(); // Retirer le masque

    // 2. Dessiner les zones vertes avec couleur unie (sans texture)
    ctx.fillStyle = "#00503C"; // Vert uni
    ctx.fillRect(
      startX + serviceLineDistance,
      singleStartY,
      serviceBoxWidth,
      serviceBoxHeight * 2
    );
    ctx.fillRect(centerX, singleStartY, serviceBoxWidth, serviceBoxHeight * 2);

    // Redessiner le terrain de base - garder les lignes visibles seulement dans les zones orange
    // Dès le début de l'animation, éviter les lignes dans les zones vertes
    drawTennisCourtLines(canvas, false, 1);

    // Distance de glissement horizontal des portes (phase initiale très lente)
    const doorPhaseProgress = Math.min(easedProgress / 0.9, 1); // Étendre la phase des portes à 90% (très lent)
    const maxSlideDistance = serviceBoxWidth * 0.85; // Distance légèrement augmentée
    const currentSlideDistance = doorPhaseProgress * maxSlideDistance;

    // Si l'animation est avancée (plus de 50%), commencer le zoom avec une transition ultra-douce
    if (easedProgress > 0.5) {
      const zoomProgress = (easedProgress - 0.5) / 0.5; // Normaliser sur les 50% restants
      const smoothZoomProgress = easeInOutSine(zoomProgress); // Utiliser l'easing ultra-doux
      const zoomFactor = 1 + smoothZoomProgress * 20; // Zoom plus puissant jusqu'à 21x

      // Centre du zoom : milieu de la zone des carrés de service
      const zoomCenterX = centerX;
      const zoomCenterY = centerY;

      // Appliquer la transformation de zoom
      ctx.save();
      ctx.translate(zoomCenterX, zoomCenterY);
      ctx.scale(zoomFactor, zoomFactor);
      ctx.translate(-zoomCenterX, -zoomCenterY);

      // Redessiner tout le terrain avec le zoom appliqué
      // Maintenir les zones vertes pendant le zoom (après l'ouverture des portes)

      // 1. D'abord dessiner le fond et les textures terre battue partout SAUF dans les zones vertes
      ctx.save();

      // Créer un chemin de découpe qui exclut les zones vertes
      ctx.beginPath();
      // Rectangle du canvas complet
      ctx.rect(0, 0, canvas.width, canvas.height);
      // Soustraire les zones vertes (holes dans le masque)
      ctx.rect(
        startX + serviceLineDistance,
        singleStartY,
        serviceBoxWidth,
        serviceBoxHeight * 2
      );
      ctx.rect(centerX, singleStartY, serviceBoxWidth, serviceBoxHeight * 2);
      ctx.clip("evenodd"); // evenodd permet les "trous"

      // Appliquer le fond de base orange (seulement dans les zones autorisées par le masque)
      if (textureCanvas) {
        ctx.drawImage(textureCanvas, 0, 0);
      }

      // Appliquer la texture terre battue (seulement dans les zones autorisées par le masque)
      if (clayTextureCanvas) {
        ctx.drawImage(clayTextureCanvas, 0, 0);
      }

      ctx.restore(); // Retirer le masque

      // 2. Dessiner les zones vertes avec couleur unie (sans texture)
      ctx.fillStyle = "#00503C"; // Vert uni
      ctx.fillRect(
        startX + serviceLineDistance,
        singleStartY,
        serviceBoxWidth,
        serviceBoxHeight * 2
      );
      ctx.fillRect(
        centerX,
        singleStartY,
        serviceBoxWidth,
        serviceBoxHeight * 2
      );

      drawTennisCourtLines(canvas, false, 1); // Mode normal avec zones vertes, opacité complète

      // Dessiner les portes avec le zoom (transition ultra-progressive)
      if (zoomProgress < 0.9) {
        // Garder les portes visibles plus longtemps
        const doorSlideProgress = Math.min(easedProgress / 0.9, 1); // Phase des portes étendue à 90%
        const doorSlideDistance = doorSlideProgress * serviceBoxWidth * 0.85;

        // Facteur d'opacité progressive pour les portes
        const doorOpacity = Math.max(0, 1 - zoomProgress / 0.9);

        // PORTE GAUCHE avec opacité
        const leftDoorX = startX + serviceLineDistance - doorSlideDistance;
        if (leftDoorX + serviceBoxWidth > startX + serviceLineDistance) {
          ctx.globalAlpha = doorOpacity;
          // Utiliser la texture pré-créée de la porte gauche
          if (leftDoorCanvas) {
            ctx.drawImage(leftDoorCanvas, leftDoorX, singleStartY);
          }
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 3;
          ctx.strokeRect(
            leftDoorX,
            singleStartY,
            serviceBoxWidth,
            serviceBoxHeight * 2
          );
          ctx.beginPath();
          ctx.moveTo(leftDoorX, centerY);
          ctx.lineTo(leftDoorX + serviceBoxWidth, centerY);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // PORTE DROITE avec opacité
        const rightDoorX = centerX + doorSlideDistance;
        if (rightDoorX < centerX + serviceBoxWidth) {
          ctx.globalAlpha = doorOpacity;
          // Utiliser la texture pré-créée de la porte droite
          if (rightDoorCanvas) {
            ctx.drawImage(rightDoorCanvas, rightDoorX, singleStartY);
          }
          ctx.strokeStyle = "#FFFFFF";
          ctx.lineWidth = 3;
          ctx.strokeRect(
            rightDoorX,
            singleStartY,
            serviceBoxWidth,
            serviceBoxHeight * 2
          );
          ctx.beginPath();
          ctx.moveTo(rightDoorX, centerY);
          ctx.lineTo(rightDoorX + serviceBoxWidth, centerY);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }

      ctx.restore();

      // Dessiner le filet progressivement à partir de 70% de l'animation
      if (zoomProgress > 0.7) {
        const netProgress = (zoomProgress - 0.7) / 0.3; // Animation du filet sur les 30% finaux
        // Transition ultra-douce avec easing exponentiel
        const smoothNetProgress = 1 - Math.pow(1 - netProgress, 3);
        drawTennisNet(ctx, canvas.width, canvas.height, smoothNetProgress);
      }

      // Continuer l'animation si elle n'est pas terminée
      if (animationProgress < 1) {
        requestAnimationFrame(animate);
      }
      return;
    }

    // PORTE GAUCHE - Glisse vers la gauche
    // Position de la porte gauche (glisse vers la gauche)
    const leftDoorX = startX + serviceLineDistance - currentSlideDistance;
    const leftDoorY = singleStartY;
    const leftDoorWidth = serviceBoxWidth;
    const leftDoorHeight = serviceBoxHeight * 2;

    // Dessiner la porte gauche seulement si elle est encore visible
    if (leftDoorX + leftDoorWidth > startX + serviceLineDistance) {
      // Utiliser la texture pré-créée de la porte gauche
      if (leftDoorCanvas) {
        ctx.drawImage(leftDoorCanvas, leftDoorX, leftDoorY);
      }

      // Bordure de la porte gauche
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.strokeRect(leftDoorX, leftDoorY, leftDoorWidth, leftDoorHeight);

      // Ligne de séparation au milieu de la porte gauche
      ctx.beginPath();
      ctx.moveTo(leftDoorX, centerY);
      ctx.lineTo(leftDoorX + leftDoorWidth, centerY);
      ctx.stroke();
    }

    // PORTE DROITE - Glisse vers la droite
    // Position de la porte droite (glisse vers la droite)
    const rightDoorX = centerX + currentSlideDistance;
    const rightDoorY = singleStartY;
    const rightDoorWidth = serviceBoxWidth;
    const rightDoorHeight = serviceBoxHeight * 2;

    // Dessiner la porte droite seulement si elle est encore visible
    if (rightDoorX < centerX + serviceBoxWidth) {
      // Utiliser la texture pré-créée de la porte droite
      if (rightDoorCanvas) {
        ctx.drawImage(rightDoorCanvas, rightDoorX, rightDoorY);
      }

      // Bordure de la porte droite
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 3;
      ctx.strokeRect(rightDoorX, rightDoorY, rightDoorWidth, rightDoorHeight);

      // Ligne de séparation au milieu de la porte droite
      ctx.beginPath();
      ctx.moveTo(rightDoorX, centerY);
      ctx.lineTo(rightDoorX + rightDoorWidth, centerY);
      ctx.stroke();
    }

    // Continuer l'animation si elle n'est pas terminée
    if (animationProgress < 1) {
      requestAnimationFrame(animate);
    }
  }

  // Démarrer l'animation après un délai pour profiter de la vue tableau
  setTimeout(() => {
    animate();
  }, 2000);
}

function drawTennisNet(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number,
  animationProgress: number = 1
) {
  const netWidth = canvasWidth; // Prendre toute la largeur de l'écran
  const netHeight = canvasHeight * 0.2; // Filet un peu plus haut
  const startX = 0; // Commencer au bord gauche
  const startY = (canvasHeight - netHeight) / 2; // Centré verticalement

  ctx.save();

  // Animation ultra-douce avec transition progressive
  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const easeProgress = easeInOutCubic(animationProgress);

  // Opacité progressive très douce
  ctx.globalAlpha = easeProgress;

  // Transformation d'échelle progressive pour un effet d'apparition naturel
  ctx.translate(canvasWidth / 2, canvasHeight / 2);
  const scaleProgress = 0.3 + easeProgress * 0.7; // Commence à 30% de la taille et grandit progressivement
  ctx.scale(scaleProgress, scaleProgress);
  ctx.translate(-canvasWidth / 2, -canvasHeight / 2);

  // PAS DE POTEAUX - seulement le filet central

  // BANDE BLANCHE EN HAUT avec courbure réaliste
  const bandHeight = 12; // Bande moins épaisse
  const centerX = startX + netWidth / 2;
  const sagAmount = 8; // Affaissement au centre du filet (réaliste)

  ctx.fillStyle = "#FFFFFF";

  // Dessiner la bande courbe en utilisant une courbe quadratique
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(centerX, startY + sagAmount, startX + netWidth, startY);
  ctx.lineTo(startX + netWidth, startY + bandHeight + sagAmount / 2);
  ctx.quadraticCurveTo(
    centerX,
    startY + bandHeight + sagAmount + sagAmount / 2,
    startX,
    startY + bandHeight + sagAmount / 2
  );
  ctx.closePath();
  ctx.fill();

  // BANDE CENTRALE VERTICALE (caractéristique des filets de tennis)
  const centralBandWidth = 8;
  const centralBandX = startX + netWidth / 2; // Au milieu du filet
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(
    centralBandX - centralBandWidth / 2,
    startY,
    centralBandWidth,
    netHeight
  );

  // MAILLAGE SIMPLE EN DESSOUS qui suit la courbure (apparition progressive)
  if (animationProgress > 0.3) {
    // Le maillage n'apparaît qu'après 30% de l'animation
    const meshStartY = startY + bandHeight + sagAmount / 2;
    const meshHeight = netHeight - bandHeight - sagAmount / 2;
    const meshSize = 15; // Espacement du maillage
    const meshProgress = Math.min((animationProgress - 0.3) / 0.7, 1); // Normaliser la progression du maillage

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.globalAlpha = easeProgress * meshProgress; // Opacité du maillage progressive

    // Lignes verticales du maillage qui suivent la courbure du filet
    for (let x = startX; x <= startX + netWidth; x += meshSize) {
      // Éviter de dessiner sur la bande centrale verticale
      if (Math.abs(x - centralBandX) > centralBandWidth / 2) {
        const progress = (x - startX) / netWidth; // Position relative (0 à 1)
        const curveOffset = sagAmount * Math.sin(progress * Math.PI); // Courbure sinusoïdale

        ctx.beginPath();
        ctx.moveTo(x, meshStartY + curveOffset);
        ctx.lineTo(x, meshStartY + meshHeight + curveOffset);
        ctx.stroke();
      }
    }

    // Lignes horizontales du maillage qui suivent la courbure
    for (let y = meshStartY; y <= meshStartY + meshHeight; y += meshSize) {
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.quadraticCurveTo(centerX, y + sagAmount / 2, startX + netWidth, y);
      ctx.stroke();
    }
  }

  // Restaurer l'opacité pour les contours
  ctx.globalAlpha = easeProgress;

  // Contour du filet avec courbure (sans contours latéraux pour masquer les bords)
  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = 4;

  // Contour supérieur (courbe)
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(centerX, startY + sagAmount, startX + netWidth, startY);
  ctx.stroke();

  // Contour inférieur (courbe)
  ctx.beginPath();
  ctx.moveTo(startX, startY + netHeight);
  ctx.quadraticCurveTo(
    centerX,
    startY + netHeight + sagAmount,
    startX + netWidth,
    startY + netHeight
  );
  ctx.stroke();

  ctx.restore();
}

function drawFrame(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Dimensions du cadre tableau
  const frameWidth = canvas.width * 0.9;
  const frameHeight = canvas.height * 0.8;
  const frameStartX = (canvas.width - frameWidth) / 2;
  const frameStartY = (canvas.height - frameHeight) / 2;
  const frameThickness = 20;

  // Dessiner le mur blanc autour du cadre
  ctx.fillStyle = "#FFFFFF";

  // Mur supérieur
  ctx.fillRect(0, 0, canvas.width, frameStartY);

  // Mur inférieur
  ctx.fillRect(
    0,
    frameStartY + frameHeight,
    canvas.width,
    canvas.height - (frameStartY + frameHeight)
  );

  // Mur gauche
  ctx.fillRect(0, frameStartY, frameStartX, frameHeight);

  // Mur droite
  ctx.fillRect(
    frameStartX + frameWidth,
    frameStartY,
    canvas.width - (frameStartX + frameWidth),
    frameHeight
  );

  // Dessiner le cadre du tableau (bordure dorée)
  ctx.strokeStyle = "#D4AF37"; // Couleur dorée
  ctx.lineWidth = frameThickness;
  ctx.strokeRect(frameStartX, frameStartY, frameWidth, frameHeight);

  // Cadre intérieur (ombre)
  ctx.strokeStyle = "#B8860B"; // Doré plus foncé pour l'ombre
  ctx.lineWidth = 8;
  ctx.strokeRect(
    frameStartX + frameThickness / 2,
    frameStartY + frameThickness / 2,
    frameWidth - frameThickness,
    frameHeight - frameThickness
  );

  // Texte "ROLAND GARROS" supprimé
}

const canvasElement = document.getElementById("canvas") as HTMLCanvasElement;
if (canvasElement) {
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  // Créer le rendu initial avec terrain entièrement orange
  const ctx = canvasElement.getContext("2d");
  if (ctx) {
    // Dessiner le cadre et le mur blanc
    drawFrame(canvasElement);

    // Rendu initial : terrain entièrement orange (pas de zones vertes)
    ctx.fillStyle = "#C95917";
    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);

    drawTennisCourtLines(canvasElement, true, 1); // Rendu initial avec toutes les lignes visibles, opacité complète
  }

  animateDoorOpening(canvasElement);
  drawFrame(canvasElement);
}
