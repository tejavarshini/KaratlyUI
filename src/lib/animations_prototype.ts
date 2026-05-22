import { Duration as BaseDuration } from './animations';

export const Duration = {
  fast: 150,
  normal: 250,
  medium: 350,
  slow: 500,
  xslow: 800,
  splash1: 4000,
} as const;

export const durations = { fast: 0.15, normal: 0.25, slow: 0.5 } as const;

export const Easings = {
  standard: [0.4, 0, 0.2, 1] as const,
  decelerate: [0, 0, 0.2, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  gentle: [0.25, 0.46, 0.45, 0.94] as const,
} as const;

export const SpringConfigs = {
  buttonPress: { damping: 15, stiffness: 300, mass: 0.8 },
  splash2: { mass: 1, stiffness: 45, damping: 15 },
  splash3: { mass: 1, stiffness: 64, damping: 12 },
  splash4: { mass: 1, stiffness: 16, damping: 6 },
  splash5: { mass: 1, stiffness: 100, damping: 15 },
} as const;

export function createGoldPulse() {
  return {
    animate: { scale: [1, 1.08, 1] },
    transition: { duration: 0.8, ease: Easings.standard, repeat: Infinity },
  };
}

export default {
  Duration,
  durations,
  Easings,
  SpringConfigs,
  createGoldPulse,
};
