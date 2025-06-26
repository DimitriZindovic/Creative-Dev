import { COLORS } from "../constants";
import { fastNoise, fractalNoise } from "../utils";

let clayTextureCache: Map<string, HTMLCanvasElement> = new Map();

export function createClayTexture(
  width: number,
  height: number
): HTMLCanvasElement {
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

export function drawClayTexture(
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
