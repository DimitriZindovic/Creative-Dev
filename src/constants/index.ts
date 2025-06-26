import type { AnimationConfig } from "../types";

export const COLORS = {
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

export const ANIMATION_CONFIG: AnimationConfig = {
  duration: 9000,
  doorPhaseRatio: 0.7,
  zoomStartRatio: 0.4,
  netStartRatio: 0.6,
  maxZoomFactor: 20,
  textStartRatio: 0.8,
};
