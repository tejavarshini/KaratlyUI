import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Duration, Easings, SpringConfigs, createGoldPulse, variants } from '../lib/animations';
import KaratlyCoin from '../assests/karatlycoin.png';
import FirstOnboarding from '../assests/firstOnboarding.png';

const GOLD_GRADIENT = 'linear-gradient(90deg, #F7CD57 0%, #E5AF35 50.96%, #B57F23 100%)';
const CARD_BG = '#2D2517';
const GOLD_BORDER = '#E8B438';

const screenVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    scale: 0.98,
  }),
};

const slideInLeft = (delay: number, spring = SpringConfigs.splash3) => ({
  initial: { x: -60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring' as const, ...spring, delay },
});

const slideInRight = (delay: number, spring = SpringConfigs.splash5) => ({
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  transition: { type: 'spring' as const, ...spring, delay },
});

const directionalEnter = ({
  x = 0,
  y = 0,
  delay = 0,
  spring = SpringConfigs.splash3,
}: {
  x?: number;
  y?: number;
  delay?: number;
  spring?: (typeof SpringConfigs)[keyof typeof SpringConfigs];
}) => ({
  initial: { x, y, opacity: 0 },
  animate: { x: 0, y: 0, opacity: 1 },
  transition: { type: 'spring' as const, ...spring, delay },
});

const stagger = (i: number) => ({
  initial: { y: 24, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { delay: 0.18 + i * 0.09, duration: Duration.medium / 1000, ease: Easings.gentle },
});

const goldPulse = createGoldPulse();

function ChevronArrow() {
  return (
    <motion.span
      animate={{ x: [0, 4, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: Easings.standard }}
      className="inline-flex items-center"
      aria-hidden="true"
    >
      →
    </motion.span>
  );
}

function TagChip({ children, delay = 0, align = 'left', animated = true }: { children: React.ReactNode; delay?: number; align?: 'left' | 'center'; animated?: boolean }) {
  const classes = `inline-flex items-center rounded-full border border-[#E8B438] bg-[rgba(45,37,23,0.96)] px-4 py-2 text-[13px] font-semibold tracking-[0.02em] text-[#FFF6D9] shadow-[0_8px_20px_rgba(0,0,0,0.22)] ${align === 'center' ? 'mx-auto' : ''}`;

  if (!animated) {
    return (
      <div className={classes} style={{ fontFamily: 'Lato, sans-serif' }}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      {...slideInLeft(delay)}
      className={classes}
      style={{ fontFamily: 'Lato, sans-serif' }}
    >
      {children}
    </motion.div>
  );
}

function Headline({
  children,
  delay = 0,
  align = 'left',
  animated = true,
}: {
  children: React.ReactNode;
  delay?: number;
  align?: 'left' | 'center';
  animated?: boolean;
}) {
  const classes = `text-[48px] font-bold leading-[52px] text-white ${align === 'center' ? 'text-center' : 'text-left'}`;

  if (!animated) {
    return (
      <h1 className={classes} style={{ fontFamily: 'Playfair Display, serif' }}>
        {children}
      </h1>
    );
  }

  return (
    <motion.h1
      {...slideInLeft(delay)}
      className={classes}
      style={{ fontFamily: 'Playfair Display, serif' }}
    >
      {children}
    </motion.h1>
  );
}

function Body({
  children,
  delay = 0,
  align = 'left',
  animated = true,
}: {
  children: React.ReactNode;
  delay?: number;
  align?: 'left' | 'center';
  animated?: boolean;
}) {
  const classes = `text-[18px] leading-[26px] text-[#FFF6D9]/100 ${align === 'center' ? 'text-center' : 'text-left'}`;

  if (!animated) {
    return (
      <p className={classes} style={{ fontFamily: 'Lato, sans-serif', color: 'rgba(255, 246, 217, 0.98)' }}>
        {children}
      </p>
    );
  }

  return (
    <motion.p
      {...slideInLeft(delay)}
      className={classes}
      style={{ fontFamily: 'Lato, sans-serif', color: 'rgba(255, 246, 217, 0.98)' }}
    >
      {children}
    </motion.p>
  );
}

function CTAButton({
  children,
  onClick,
  delay = 0,
  right = false,
  outline = false,
  animated = true,
}: {
  children: React.ReactNode;
  onClick: () => void;
  delay?: number;
  right?: boolean;
  outline?: boolean;
  animated?: boolean;
}) {
  const motionProps = right ? slideInRight(delay) : slideInLeft(delay);

  return (
    <motion.button
      {...(animated ? motionProps : {})}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.02 }}
      transition={animated ? { ...motionProps.transition, type: 'spring', ...SpringConfigs.buttonPress } : { type: 'spring', ...SpringConfigs.buttonPress }}
      onClick={onClick}
      className={`flex h-[60px] w-[342px] items-center justify-center gap-3 rounded-full px-6 text-[18px] font-bold ${outline ? 'border border-[#CB952B] bg-transparent text-[#FFF6D9]' : 'text-black'} `}
      style={{
        fontFamily: 'Lato, sans-serif',
        background: outline ? 'transparent' : GOLD_GRADIENT,
        boxShadow: outline ? 'none' : '0 10px 30px -10px rgba(229,175,53,0.55)',
      }}
    >
      <span>{children}</span>
      <ChevronArrow />
    </motion.button>
  );
}

function ProgressDots({ index }: { index: number }) {
  return (
    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2">
      {[0, 1, 2, 3].map((dot) => {
        const active = dot === index;
        return (
          <motion.span
            key={dot}
            className="block rounded-full"
            animate={{ width: active ? 40 : 8, opacity: active ? 1 : 0.72 }}
            transition={{ type: 'spring', ...SpringConfigs.modalReveal }}
            style={{
              height: 8,
              background: active ? GOLD_GRADIENT : '#333333',
            }}
          />
        );
      })}
    </div>
  );
}

function PriceTile({ title, subtitle, active = false, delay = 0, animated = true }: { title: string; subtitle: string; active?: boolean; delay?: number; animated?: boolean }) {
  const tileClasses = 'rounded-[18px] border px-3 py-3 text-center';
  const tileStyle = {
    background: active ? 'rgba(45,37,23,0.96)' : 'rgba(25,21,13,0.95)',
    borderColor: active ? GOLD_BORDER : 'rgba(232,180,56,0.35)',
  };

  const content = (
    <>
      <div className="text-[12px] font-bold tracking-[0.08em]" style={{ fontFamily: 'Lato, sans-serif', color: active ? '#FFF6D9' : '#C9BFA0' }}>
        {title}
      </div>
      <div className="mt-1 text-[14px] font-semibold text-white" style={{ fontFamily: 'Lato, sans-serif' }}>
        {subtitle}
      </div>
    </>
  );

  if (!animated) {
    return (
      <div className={tileClasses} style={tileStyle}>
        {content}
      </div>
    );
  }

  return (
    <motion.div
      {...stagger(delay * 10)}
      className={tileClasses}
      style={tileStyle}
    >
      {content}
    </motion.div>
  );
}

function FeatureRow({
  icon,
  title,
  subtitle,
  delay,
  animated = true,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay: number;
  animated?: boolean;
}) {
  const rowContent = (
    <>
      <div className="mt-1 text-[#E5AF35]">{icon}</div>
      <div>
        <div className="text-[17px] font-semibold text-white" style={{ fontFamily: 'Lato, sans-serif' }}>
          {title}
        </div>
        <div className="mt-1 text-[15px] leading-[22px] text-[#FFF6D9]/90" style={{ fontFamily: 'Lato, sans-serif' }}>
          {subtitle}
        </div>
      </div>
    </>
  );

  if (!animated) {
    return <div className="flex items-start gap-3 rounded-[18px] border border-[#E8B438]/30 bg-[rgba(45,37,23,0.88)] px-4 py-3">{rowContent}</div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay, duration: 0.25, ease: Easings.gentle }} className="flex items-start gap-3 rounded-[18px] border border-[#E8B438]/30 bg-[rgba(45,37,23,0.88)] px-4 py-3">
      {rowContent}
    </motion.div>
  );
}

function TagItalic({ children }: { children: React.ReactNode }) {
  return (
    <span className="italic bg-clip-text text-transparent" style={{ backgroundImage: GOLD_GRADIENT }}>
      {children}
    </span>
  );
}

function Coin({ size = 240, variant = 'hero' }: { size?: number; variant?: 'hero' | 'top' | 'final' }) {
  const gold = goldPulse;
  const ringSize = variant === 'final' ? size : size * 0.78;

  return (
    <motion.div
      animate={variant === 'final' ? { scale: [1, 1.08, 1], rotate: [0, 6, -6, 0] } : gold.animate}
      transition={variant === 'final' ? { duration: 3.2, ease: Easings.gentle, repeat: Infinity } : { duration: 2.4, ease: Easings.standard, repeat: Infinity }}
      className="relative"
      style={{ width: size, height: size }}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            variant === 'final'
              ? 'radial-gradient(circle at 35% 30%, #FFF0BF 0%, #F7CD57 28%, #E5AF35 54%, #8B5D16 100%)'
              : 'radial-gradient(circle at 35% 30%, #FFF3C8 0%, #F7CD57 30%, #E5AF35 58%, #7B4E10 100%)',
          boxShadow: '0 16px 40px rgba(229,175,53,0.18), inset 0 0 0 4px rgba(255,255,255,0.08)',
        }}
      />
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 30% 24%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.1) 12%, rgba(255,255,255,0) 25%)',
        }}
      />
      <div
        className="absolute inset-0 grid place-items-center rounded-full text-black"
        style={{
          clipPath: 'circle(50% at 50% 50%)',
        }}
      >
        <div
          className="rounded-full border border-black/10"
          style={{ width: ringSize * 0.58, height: ringSize * 0.58, background: 'rgba(0,0,0,0.04)' }}
        />
      </div>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: '1px solid rgba(255,255,255,0.18)',
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.06)',
        }}
      />
    </motion.div>
  );
}

function CinematicCoin({ size, className = '', final = false }: { size: number; className?: string; final?: boolean }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.92, y: final ? 18 : 14 }}
      animate={{ opacity: 1, scale: 1, y: final ? [0, -8, 0] : [0, -5, 0], rotate: final ? [0, 6, -6, 0] : [0, 2, -2, 0] }}
      transition={{
        opacity: { duration: 0.6, ease: Easings.gentle },
        scale: { duration: 0.9, ease: Easings.gentle },
        y: { duration: final ? 9 : 7, repeat: Infinity, ease: Easings.gentle },
        rotate: { duration: final ? 9 : 8, repeat: Infinity, ease: Easings.gentle },
      }}
      style={{ width: size, height: size }}
    >
      <img
        src={KaratlyCoin}
        alt="Karatly coin"
        width={size}
        height={size}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          filter: 'drop-shadow(0 18px 30px rgba(0,0,0,0.36))',
        }}
      />
    </motion.div>
  );
}

function HeroArtwork() {
  return (
    <motion.div className="absolute left-0 top-0 h-[600px] w-full overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: Duration.slow / 1000, ease: Easings.gentle }}>
      <motion.img
        src={FirstOnboarding}
        alt="Onboarding hero"
        initial={{ scale: 1.02, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: Easings.gentle }}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition: 'center top' }}
      />
    </motion.div>
  );
}

function ChartCard({ animated = true }: { animated?: boolean }) {
  const cardContent = (
    <>
      <div className="flex items-center justify-between text-[#FFF6D9]">
        <div className="text-[14px] font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
          Today&apos;s Trend
        </div>
        <div className="text-[12px] tracking-[0.08em] text-[#E5AF35]" style={{ fontFamily: 'Lato, sans-serif' }}>
          24H
        </div>
      </div>
      <svg viewBox="0 0 320 150" className="mt-4 h-[150px] w-full" aria-hidden="true">
        <defs>
          <linearGradient id="chartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F7CD57" />
            <stop offset="50%" stopColor="#E5AF35" />
            <stop offset="100%" stopColor="#B57F23" />
          </linearGradient>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(247,205,87,0.34)" />
            <stop offset="100%" stopColor="rgba(247,205,87,0)" />
          </linearGradient>
        </defs>
        <motion.path
          d="M12 116C36 108 54 104 74 108C92 112 110 92 130 82C152 70 166 90 184 78C204 64 220 50 244 52C264 54 282 40 308 28"
          fill="none"
          stroke="url(#chartLine)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: Easings.gentle }}
        />
        <motion.path
          d="M12 116C36 108 54 104 74 108C92 112 110 92 130 82C152 70 166 90 184 78C204 64 220 50 244 52C264 54 282 40 308 28V150H12Z"
          fill="url(#chartFill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.6, ease: Easings.decelerate }}
        />
      </svg>
    </>
  );

  if (!animated) {
    return (
      <div className="overflow-hidden rounded-[22px] border p-4" style={{ background: CARD_BG, borderColor: GOLD_BORDER, boxShadow: '0 18px 34px rgba(0,0,0,0.18)' }}>
        {cardContent}
      </div>
    );
  }

  return (
    <motion.div
      {...stagger(2.1)}
      className="overflow-hidden rounded-[22px] border p-4"
      style={{ background: CARD_BG, borderColor: GOLD_BORDER, boxShadow: '0 18px 34px rgba(0,0,0,0.18)' }}
    >
      {cardContent}
    </motion.div>
  );
}

function SunHalo() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45, delay: 0.15, ease: Easings.gentle }}
      className="absolute right-[-10px] top-[-2px] h-[160px] w-[160px] rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(247,205,87,0.28) 0%, rgba(229,175,53,0.16) 34%, rgba(0,0,0,0) 72%)',
      }}
    >
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 grid place-items-center text-[#E5AF35]">
        <SparklesIcon size={64} />
      </motion.div>
    </motion.div>
  );
}

function SparklesIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.5L13.7 7.2L18.5 9L13.7 10.8L12 15.5L10.3 10.8L5.5 9L10.3 7.2L12 2.5Z" fill="currentColor" />
      <path d="M4 13.5L4.8 15.7L7 16.5L4.8 17.3L4 19.5L3.2 17.3L1 16.5L3.2 15.7L4 13.5Z" fill="currentColor" opacity="0.86" />
    </svg>
  );
}

function TrendingUpIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 15L10 10L13 13L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 7H19V11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BadgeCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.75L14.8 4.2L17.9 4.7L18.4 7.8L19.75 10.5L18.4 13.2L17.9 16.3L14.8 16.8L12 18.25L9.2 16.8L6.1 16.3L5.6 13.2L4.25 10.5L5.6 7.8L6.1 4.7L9.2 4.2L12 2.75Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.7 10.8L11 13.1L15.4 8.7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2.9L18 5.5V10.3C18 14.4 15.7 17.8 12 20.6C8.3 17.8 6 14.4 6 10.3V5.5L12 2.9Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.3 11.7L11.2 13.6L14.8 10.2" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ScreenChrome({
  index,
  navigate,
  onBack,
}: {
  index: number;
  navigate: (to: string) => void;
  onBack: () => void;
}) {
  return (
    <>
      {index < 3 && (
        <motion.button
          initial="hidden"
          animate="visible"
          variants={variants.fadeIn}
          transition={{ delay: Duration.xslow / 1000, duration: Duration.normal / 1000 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/signup')}
          className="absolute right-4 top-4 z-20 rounded-full border border-[#E8B438]/40 bg-[rgba(0,0,0,0.24)] px-4 py-2 text-[13px] font-semibold text-[#FFF6D9]"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          Skip
        </motion.button>
      )}

      {index > 0 && (
        <motion.button
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: Duration.medium / 1000, ease: Easings.gentle, delay: Duration.medium / 1000 }}
          whileTap={{ scale: 0.96 }}
          onClick={onBack}
          className="absolute left-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full border border-[#E8B438]/40 bg-[rgba(0,0,0,0.24)] text-[#FFF6D9]"
          aria-label="Go back"
        >
          ←
        </motion.button>
      )}
    </>
  );
}

function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-black px-6 pt-14 font-sans" style={{ fontFamily: 'Lato, sans-serif' }}>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(83.05% 31.89% at 2.45% 0%, rgba(74,58,30,0.32) 0%, rgba(0,0,0,0) 58%)',
        }}
      />
      {children}
    </div>
  );
}

function Os1({ goTo, navigate }: { goTo: (next: number) => void; navigate?: (to: string) => void }) {
  return (
    <ScreenWrapper>
      <HeroArtwork />

      <div className="absolute bottom-9 left-0 right-0 px-6">
        <TagChip delay={0}>Welcome Karatly</TagChip>
        <Headline delay={0.08}>
          Invest in <TagItalic>Timeless value</TagItalic>
        </Headline>
        <Body delay={0.16}>Buy and invest in certified gold, silver, and diamonds with complete trust and transparency.</Body>
        <CTAButton delay={0.24} onClick={() => goTo(1)}>
          Explore Now
        </CTAButton>
        <motion.button
          {...slideInLeft(0.32)}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate?.('/login')}
          className="mt-4 text-left text-[16px] leading-[19px] text-[#FAEFCF]"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          Already have an account? <span className="font-semibold text-[#E5AF35]">Login</span>
        </motion.button>
      </div>
    </ScreenWrapper>
  );
}

function Os2({ goTo, screenIndex }: { goTo: (next: number) => void; screenIndex: number }) {
  return (
    <ScreenWrapper>
      <div className="absolute bottom-9 left-0 right-0 px-6">
        <motion.div key={`os2-tag-${screenIndex}`} {...directionalEnter({ x: -60, delay: 0, spring: SpringConfigs.splash3 })}>
          <TagChip animated={false}>Live Market</TagChip>
        </motion.div>

        <motion.div key={`os2-headline-${screenIndex}`} {...directionalEnter({ x: -60, delay: 0.07, spring: SpringConfigs.splash3 })}>
          <Headline animated={false}>
            Real Time <TagItalic>Metal Prices</TagItalic>
          </Headline>
        </motion.div>

        <motion.div key={`os2-body-${screenIndex}`} {...directionalEnter({ x: -60, delay: 0.14, spring: SpringConfigs.splash3 })}>
          <Body animated={false}>Track the latest gold and silver movement in a clear, elegant view built for fast decisions.</Body>
        </motion.div>

        <motion.div key={`os2-chart-${screenIndex}`} {...directionalEnter({ x: -60, delay: 0.21, spring: SpringConfigs.splash3 })}>
          <ChartCard animated={false} />
        </motion.div>

        <motion.div key={`os2-tiles-${screenIndex}`} {...directionalEnter({ x: -60, delay: 0.28, spring: SpringConfigs.splash3 })} className="grid grid-cols-3 gap-2">
          <PriceTile title="GOLD 24K" subtitle="₹6,450/g" active delay={0.0} animated={false} />
          <PriceTile title="SILVER" subtitle="₹78.4/g" delay={0.04} animated={false} />
          <PriceTile title="DIAMOND" subtitle="Live rate" delay={0.08} animated={false} />
        </motion.div>

        <motion.div key={`os2-cta-${screenIndex}`} {...directionalEnter({ x: -60, delay: 0.35, spring: SpringConfigs.splash3 })}>
          <CTAButton animated={false} onClick={() => goTo(2)}>
            Continue
          </CTAButton>
        </motion.div>
      </div>
    </ScreenWrapper>
  );
}

function Os3({ goTo, screenIndex, isExitingBack }: { goTo: (next: number) => void; screenIndex: number; isExitingBack: boolean }) {
  return (
    <ScreenWrapper>
      <motion.div
        key={`os3-illustration-${screenIndex}`}
        className="absolute right-[10px] top-[36px] h-[160px] w-[160px] rounded-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={
          isExitingBack
            ? { opacity: 0, y: 30, scale: 0.95, transition: { duration: Duration.fast / 1000, ease: Easings.accelerate } }
            : { opacity: 1, y: 0, scale: 1, transition: { duration: Duration.normal / 1000, delay: 0.15, ease: Easings.gentle } }
        }
        style={{ background: 'radial-gradient(circle, rgba(247,205,87,0.3) 0%, rgba(229,175,53,0.12) 35%, rgba(0,0,0,0) 74%)' }}
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: 'linear' }} className="absolute inset-0 grid place-items-center text-[#E5AF35]">
          <SparklesIcon size={64} />
        </motion.div>
      </motion.div>

      <div className="absolute bottom-9 left-0 right-0 px-6">
        <motion.div
          key={`os3-tag-${screenIndex}`}
          {...directionalEnter({ x: -60, delay: 0, spring: SpringConfigs.splash3 })}
          animate={isExitingBack ? { x: -80, opacity: 0, transition: { duration: Duration.normal / 1000, ease: Easings.accelerate } } : { x: 0, opacity: 1 }}
        >
          <TagChip animated={false}>Investment</TagChip>
        </motion.div>

        <motion.div
          key={`os3-copy-${screenIndex}`}
          {...directionalEnter({ x: -60, delay: 0.08, spring: SpringConfigs.splash3 })}
          animate={isExitingBack ? { x: -80, opacity: 0, transition: { duration: Duration.normal / 1000, ease: Easings.accelerate } } : { x: 0, opacity: 1 }}
        >
          <Headline animated={false}>
            Buy Smart. <TagItalic>Invest Smarter</TagItalic>
          </Headline>
          <Body animated={false}>Choose a smarter path with disciplined gold investing, strong protection and flexible savings.</Body>
        </motion.div>

        <div className="mt-6 space-y-3">
          <motion.div
            key={`os3-card-1-${screenIndex}`}
            initial="hidden"
            animate={isExitingBack ? 'hidden' : 'visible'}
            variants={variants.fadeIn}
            transition={
              isExitingBack
                ? { duration: Duration.fast / 1000, ease: Easings.accelerate }
                : { delay: 0.18, duration: Duration.normal / 1000 }
            }
          >
            <FeatureRow delay={0.18} icon={<TrendingUpIcon />} title="Daily SIP in Gold" subtitle="Auto-invest from ₹100/day" animated={false} />
          </motion.div>

          <motion.div
            key={`os3-card-2-${screenIndex}`}
            initial="hidden"
            animate={isExitingBack ? 'hidden' : 'visible'}
            variants={variants.fadeIn}
            transition={
              isExitingBack
                ? { duration: Duration.fast / 1000, ease: Easings.accelerate }
                : { delay: 0.22, duration: Duration.normal / 1000 }
            }
          >
            <FeatureRow delay={0.22} icon={<BadgeCheckIcon />} title="Certified Purity" subtitle="999.9 fine, lab tested" animated={false} />
          </motion.div>

          <motion.div
            key={`os3-card-3-${screenIndex}`}
            initial={{ opacity: 0 }}
            animate={
              isExitingBack
                ? { opacity: 0, y: 30, transition: { duration: Duration.fast / 1000, ease: Easings.accelerate } }
                : { opacity: 1, y: 0, transition: { delay: 0.26, duration: Duration.normal / 1000, ease: Easings.gentle } }
            }
          >
            <FeatureRow delay={0.26} icon={<ShieldCheckIcon />} title="Secure Vault" subtitle="Insured by partners" animated={false} />
          </motion.div>
        </div>

        <motion.div
          key={`os3-cta-${screenIndex}`}
          {...directionalEnter({ x: 60, delay: 0.3, spring: SpringConfigs.splash5 })}
          animate={isExitingBack ? { x: 80, opacity: 0, transition: { duration: Duration.normal / 1000, ease: Easings.accelerate } } : { x: 0, opacity: 1 }}
        >
          <CTAButton animated={false} right onClick={() => goTo(3)}>
            Continue
          </CTAButton>
        </motion.div>
      </div>
    </ScreenWrapper>
  );
}

function Os4({ screenIndex, navigate }: { goTo: (next: number) => void; screenIndex: number; navigate?: (to: string) => void }) {
  return (
    <ScreenWrapper>
      <motion.div
        key={`os4-hero-${screenIndex}`}
        className="absolute left-1/2 top-[74px] -translate-x-1/2"
        {...directionalEnter({ x: -40, y: 20, delay: 0.1, spring: SpringConfigs.splash4 })}
      >
        <CinematicCoin size={224} final className="relative" />
      </motion.div>

      <div className="absolute bottom-9 left-0 right-0 px-6 text-center">
        <motion.div key={`os4-tag-${screenIndex}`} {...directionalEnter({ x: -60, delay: 0, spring: SpringConfigs.splash3 })}>
          <TagChip animated={false} delay={0} align="center">
            Final Step
          </TagChip>
        </motion.div>

        <motion.div
          key={`os4-trusted-${screenIndex}`}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', ...SpringConfigs.successBounce, delay: 0.15 }}
          className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full border border-[#E8B438]/40 bg-[rgba(45,37,23,0.92)] px-4 py-2 text-[14px] font-semibold text-[#FFF6D9]"
          style={{ fontFamily: 'Lato, sans-serif' }}
        >
          ★ Trusted By 50k+ Investors
        </motion.div>

        <motion.div key={`os4-headline-${screenIndex}`} {...directionalEnter({ x: -40, delay: 0.2, spring: SpringConfigs.splash3 })}>
          <Headline animated={false} align="center">
            Start Your <TagItalic>Golden Journey</TagItalic>
          </Headline>
        </motion.div>

        <motion.div key={`os4-body-${screenIndex}`} {...directionalEnter({ x: -40, delay: 0.27, spring: SpringConfigs.splash3 })}>
          <Body animated={false} align="center">
            Create your account and begin with a premium investing flow designed for confidence, clarity and growth.
          </Body>
        </motion.div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <motion.div key={`os4-create-${screenIndex}`} {...directionalEnter({ x: 60, delay: 0.32, spring: SpringConfigs.splash5 })}>
            <CTAButton animated={false} right onClick={() => navigate?.('/signup')}>
              Create Account
            </CTAButton>
          </motion.div>

          <motion.div key={`os4-login-${screenIndex}`} {...directionalEnter({ x: -60, delay: 0.38, spring: SpringConfigs.splash5 })}>
            <CTAButton animated={false} outline onClick={() => navigate?.('/login')}>
              Login
            </CTAButton>
          </motion.div>
        </div>
      </div>
    </ScreenWrapper>
  );
}

export default function OnboardingFlow() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [os3ExitingBack, setOs3ExitingBack] = useState(false);
  const os3BackTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (os3BackTimerRef.current !== null) {
        window.clearTimeout(os3BackTimerRef.current);
      }
    };
  }, []);

  const goTo = (next: number) => {
    setDir(next > index ? 1 : -1);
    setIndex(next);
  };

  const handleBack = () => {
    if (index <= 0) return;

    if (index === 2) {
      if (os3ExitingBack) return;

      setOs3ExitingBack(true);
      os3BackTimerRef.current = window.setTimeout(() => {
        setOs3ExitingBack(false);
        goTo(1);
      }, Duration.normal);
      return;
    }

    goTo(index - 1);
  };

  const screens = [
    <Os1 key={`os1-${index}`} goTo={goTo} navigate={navigate} />,
    <Os2 key={`os2-${index}`} goTo={goTo} screenIndex={index} />,
    <Os3 key={`os3-${index}`} goTo={goTo} screenIndex={index} isExitingBack={os3ExitingBack} />,
    <Os4 key={`os4-final-${index}`} goTo={goTo} screenIndex={index} navigate={navigate} />,
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative h-[844px] w-[390px] overflow-hidden bg-black" style={{ fontFamily: 'Lato, sans-serif' }}>
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(83.05% 31.89% at 2.45% 0%, rgba(74,58,30,0.28) 0%, rgba(0,0,0,0) 60%)' }} />

        <ScreenChrome index={index} navigate={navigate} onBack={handleBack} />

        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={`screen-${index}`}
            custom={dir}
            variants={screenVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', ...SpringConfigs.modalReveal }}
            className="absolute inset-0"
          >
            {screens[index]}
          </motion.div>
        </AnimatePresence>

        <ProgressDots index={index} />

        {index === 0 && (
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 opacity-0"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
