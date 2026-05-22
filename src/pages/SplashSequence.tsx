import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { animate, motion, useMotionValue } from 'framer-motion';
import { SplashLayout, StatusBar } from '../components/SplashLayout';
import { createGoldPulse, Duration, Easings, SpringConfigs } from '../lib/animations_prototype';
import ShieldImg from '../assests/K logo.png';
import WordmarkImg from '../assests/K logo text.png';

const STAGE_MS = {
  hold1: Duration.xslow,
  move: 700,
  holdFinal: Duration.splash1,
} as const;

export default function SplashSequence() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<1 | 2 | 3 | 4 | 5>(1);
  const shieldY = useMotionValue(-220);
  const lockupX = useMotionValue(0);
  const wordmarkClip = useMotionValue(0);
  const pulse = createGoldPulse();

  useEffect(() => {
    let cancelled = false;
    const timers: number[] = [];

    const queue = (ms: number, fn: () => void) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    queue(STAGE_MS.hold1, () => {
      setStage(2);
      animate(shieldY, 0, { type: 'spring', ...SpringConfigs.splash2 });
    });

    queue(STAGE_MS.hold1 + STAGE_MS.move + 180, () => {
      setStage(3);
      animate(lockupX, -18, { type: 'spring', ...SpringConfigs.splash3 });
    });

    queue(STAGE_MS.hold1 + STAGE_MS.move + 180 + 350, () => {
      setStage(4);
      animate(wordmarkClip, 200, { duration: Duration.slow / 1000, ease: Easings.spring });
    });

    queue(STAGE_MS.hold1 + STAGE_MS.move + 180 + 350 + Duration.slow, () => {
      setStage(5);
    });

    queue(STAGE_MS.hold1 + STAGE_MS.move + 180 + 350 + Duration.slow + STAGE_MS.holdFinal, () => {
      navigate('/onboarding', { replace: true });
    });

    return () => {
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, [navigate, lockupX, shieldY, wordmarkClip]);

  return (
    <SplashLayout>
      <StatusBar />

      <motion.div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center px-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: Easings.gentle }}
        style={{ x: lockupX, width: 390 }}
      >
        <motion.div
          className="relative shrink-0"
          style={{ y: shieldY }}
          initial={false}
          animate={stage === 1 ? pulse.animate : { scale: 1 }}
          transition={stage === 1 ? pulse.transition : { duration: Duration.fast / 1000, ease: Easings.standard }}
        >
          <img src={ShieldImg} alt="Karatly shield" width={100} height={121.25} style={{ display: 'block' }} />
        </motion.div>

        <motion.div
          className="relative shrink-0 overflow-hidden"
          initial={false}
          style={{ width: 224, height: 50.37, marginLeft: 3 }}
          animate={{ opacity: stage >= 4 ? 1 : 0 }}
          transition={{ duration: 0.25, ease: Easings.standard }}
        >
          <motion.div style={{ width: wordmarkClip, overflow: 'hidden' }}>
            <img src={WordmarkImg} alt="Karatly wordmark" width={200} height={50.37} style={{ display: 'block' }} />
          </motion.div>
        </motion.div>
      </motion.div>
    </SplashLayout>
  );
}
