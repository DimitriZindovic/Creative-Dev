export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function fastNoise(x: number, y: number, seed: number = 12345): number {
  let n = Math.sin(x * 12.9898 + y * 78.233 + seed * 37.719) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

export function fractalNoise(
  x: number,
  y: number,
  octaves: number = 4
): number {
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
