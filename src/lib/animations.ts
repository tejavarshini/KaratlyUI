import { useEffect, useRef, useState } from 'react';

export const Duration = {
  instant: 0,
  fast: 150,
  normal: 250,
  medium: 350,
  slow: 500,
  xslow: 800,
  splash1: 4000,
  splash2: 8000,
  loading: 3000,
  success: 4000,
  popup: 5000,
} as const;

export const durations = { fast: 0.15, normal: 0.25, slow: 0.5, splash: 4.0, loading: 3.0, popup: 5.0 };

export const Easings = {
  standard: [0.4, 0.0, 0.2, 1] as const,
  decelerate: [0.0, 0.0, 0.2, 1] as const,
  accelerate: [0.4, 0.0, 1.0, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  gentle: [0.25, 0.46, 0.45, 0.94] as const,
  splashSmart: [1, 0.01, 0.03, 1] as const,
  linear: 'linear' as const,
};

export const SpringConfigs = {
  buttonPress: {
    damping: 15,
    stiffness: 300,
    mass: 0.8,
  },
  modalReveal: {
    damping: 20,
    stiffness: 180,
    mass: 1.0,
  },
  successBounce: {
    damping: 10,
    stiffness: 200,
    mass: 0.8,
  },
  ticker: {
    damping: 25,
    stiffness: 400,
    mass: 0.5,
  },
  splash2: {
    mass: 1,
    stiffness: 45,
    damping: 15,
  },
  splash3: {
    mass: 1,
    stiffness: 64,
    damping: 12,
  },
  splash4: {
    mass: 1,
    stiffness: 16,
    damping: 6,
  },
  splash5: {
    mass: 1,
    stiffness: 100,
    damping: 15,
  },
} as const;

export const transitions = {
  slideFromRight: { initial: { x: '100%', opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: '-100%', opacity: 0 } },
  slideFromBottom: { initial: { y: '100%', opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: '100%', opacity: 0 } },
  fadeTransition: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

export const variants = {
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.25 } } },
  slideUpFade: { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.3 } } },
  successEntrance: { hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 200, damping: 15 } } },
};

export function createFadeIn() {
  const [opacity, setOpacity] = useState(0);

  const start = () => {
    setOpacity(0);
    requestAnimationFrame(() => setOpacity(1));
  };

  return { opacity, start };
}

export function createProgressBar(duration: number) {
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);

  const reset = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setProgress(0);
  };

  const start = (onComplete?: () => void) => {
    reset();

    const startedAt = performance.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min(100, (elapsed / duration) * 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        reset();
        onComplete?.();
      }
    }, 16);
  };

  useEffect(() => reset, []);

  return { progress, start, reset };
}

export function createGoldPulse() {
  return {
    animate: { scale: [1, 1.08, 1] },
    transition: {
      duration: Duration.xslow / 1000,
      ease: Easings.standard,
      repeat: Infinity,
    },
    stop: {},
  };
}
