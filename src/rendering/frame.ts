import { COLORS } from "../constants";
import { getFrameDimensions } from "../geometry/dimensions";

export function drawFrame(canvas: HTMLCanvasElement) {
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
  ctx.fillRect(frame.startX + 2, frame.startY + 2, frame.width - 4, bevelWidth);
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
