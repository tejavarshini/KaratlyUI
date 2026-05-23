import React, { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Routes } from '../lib/routes';
import { useAuth } from '../store/AuthContext';
import { createFadeIn, createGoldPulse, createProgressBar, Duration, Easings } from '../lib/animations';

const SPLASH_FONT = { fontFamily: 'Poppins, sans-serif' } as const;
const SPLASH_BG =
  'radial-gradient(circle at 100% 0%, #4A3A1E 0%, #231A0B 24%, #080808 46%, #000000 70%)';

const SPLASH_TIMINGS = {
  splash1: 800,
  splash2: 500,
  splash3: 350,
  splash4: 500,
  splash5: 4000,
} as const;

function useTimedNavigation(duration: number, nextRoute: string) {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate(nextRoute, { replace: true }), duration);
    return () => clearTimeout(timer);
  }, [navigate, nextRoute, duration]);
}

const SPLASH_BG_DECORATIVE =
  'https://s3-alpha-sig.figma.com/img/0080/d0fd/d7c37b68d9cd1ac7b59ce43f383e68a7?Expires=1779667200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=G~UTzqWyCR1jUiaMtGV0b~DY-oMSbeNP4-ztMEVFMcbryTvacfy9SOnELMfnh3DRwlgZXdwJrDPwPff~tDHWGaDaRuFG8nXKTuAFfe5voD01-FVNd1m9uNJo1l-x5Fd1fCKUlTy5enfSV7Aa~cTYenFNhINntT8KYxRcPTQlmciphGn761y1zbnAkvVeZJL-IW-zq9f74VXEnJalE~uR5Gyih5Y8MSBqdeK~fXWtWahGqKF5UiYgsNZYRZeT4EAmeXm9hxZg91TjVWAXF9G1u2hXx8-UvEY0EWtQygPiGew40~Iv3kDcd6-QgiPTXLOwXjAQua8Lpceq78Tn8hHSbw__';

const SPLASH_BG_DECORATIVE_2 =
  'https://s3-alpha-sig.figma.com/img/02ac/0d54/fd4d802c571b0290a9275e251689c025?Expires=1779667200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=bz7Anq8xtpKjdXK~ddZmMQr-yY1dXKlp7qWcnhBuemoh7cBRCVIjNbRLymNrs52rJxVfKYJ10IFfq76q9xGNwABH4degdqHPGDHQC3nAp3Ypt796Czbbj7e-v1HL83wBw~DXqwIC~FyiDottydk2e95FbapXFqYRRdIxdG42hLkodn5VtgJtFVS6pFxlXIypcq9lnoPGWULEjnyTNYYQxn24ymgt5k9B-L7OiMfVQhk8K9zHU4gGf38gs1z00kcfuPKharLbh30K6TBzCGY6ji0mqmF8ReE819Bci7cApSAACDmVohc3gyxS5pfjwGnaVzGSd49tR81VTIeoS3t4Eg__';

function SplashShell({ children, opacity = 1, transition }: { children: React.ReactNode; opacity?: number; transition?: { duration: number; ease: readonly [number, number, number, number] | 'linear' } }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity }}
      exit={{ opacity: 0 }}
      transition={transition ?? { duration: 0.4, ease: Easings.standard }}
      className="relative h-[100dvh] w-full overflow-hidden bg-black"
      style={SPLASH_FONT}
    >
      <div className="absolute inset-0" style={{ background: SPLASH_BG }} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,201,90,0.08),transparent_42%)]" />
      <div className="absolute inset-0">{children}</div>
    </motion.div>
  );
}

function StatusBar() {
  return (
    <>
      <div
        className="absolute left-[24px] top-[3px] text-white"
        style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', lineHeight: '16px', fontWeight: 400 }}
      >
        9:30
      </div>
      <div className="absolute left-[320px] top-[4px] text-white">
        <SignalIcon />
      </div>
      <div className="absolute left-[337px] top-[4px] text-white">
        <WifiIcon />
      </div>
      <div className="absolute left-[354px] top-[3px] text-white">
        <BatteryIcon />
      </div>
    </>
  );
}

function SignalIcon() {
  return (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" aria-hidden="true">
      <rect x="0.5" y="7.25" width="1.8" height="4.25" rx="0.9" fill="currentColor" />
      <rect x="3.7" y="5.4" width="1.8" height="6.1" rx="0.9" fill="currentColor" />
      <rect x="6.9" y="3.05" width="1.8" height="8.45" rx="0.9" fill="currentColor" />
      <rect x="10.1" y="0.45" width="1.8" height="11.05" rx="0.9" fill="currentColor" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M8 9.2C8.8 9.2 9.45 9.84 9.45 10.62C9.45 11.39 8.8 12 8 12C7.2 12 6.55 11.39 6.55 10.62C6.55 9.84 7.2 9.2 8 9.2Z" fill="currentColor" />
      <path d="M4.15 6.25C5.25 5.18 6.55 4.64 8 4.64C9.45 4.64 10.75 5.18 11.85 6.25" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M2.1 4.05C3.86 2.37 5.86 1.53 8 1.53C10.14 1.53 12.14 2.37 13.9 4.05" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M0.6 1.8C2.72 0.1 5.14 -0.75 8 0.02C10.86 -0.75 13.28 0.1 15.4 1.8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" opacity="0.95" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="20.5" height="10" rx="2.6" stroke="currentColor" strokeWidth="1" />
      <rect x="3" y="3" width="14" height="6" rx="1.2" fill="currentColor" />
      <rect x="22" y="4" width="2" height="4" rx="1" fill="currentColor" />
    </svg>
  );
}

function GoldMark({ size = 100 }: { size?: number }) {
  const gradientId = useId().replace(/:/g, '');
  const innerId = `${gradientId}-inner`;
  const height = size * 1.2125;

  return (
    <svg width={size} height={height} viewBox="0 0 100 121.25" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="18" y1="8" x2="82" y2="112" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBE39A" />
          <stop offset="0.45" stopColor="#D8AA43" />
          <stop offset="1" stopColor="#6D4710" />
        </linearGradient>
        <linearGradient id={innerId} x1="28" y1="22" x2="72" y2="92" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF4CC" />
          <stop offset="0.5" stopColor="#F2D06B" />
          <stop offset="1" stopColor="#B57D1E" />
        </linearGradient>
      </defs>
      <path
        d="M50 7L75.5 17.3V41.1C75.5 62.4 65.1 79.5 50 88.9C34.9 79.5 24.5 62.4 24.5 41.1V17.3L50 7Z"
        fill={`url(#${gradientId})`}
        stroke="#F7E7AD"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M50 14.4L69.2 22.2V41C69.2 57.8 61.1 71.1 50 79.1C38.9 71.1 30.8 57.8 30.8 41V22.2L50 14.4Z"
        fill={`url(#${innerId})`}
        opacity="0.9"
      />
      <path d="M26.8 13.7L50 4.8L73.2 13.7L50 22.9L26.8 13.7Z" fill="#C8912B" opacity="0.9" />
      <path d="M30.3 12.8L50 5.5L69.7 12.8L50 20.4L30.3 12.8Z" fill="#FBE39B" opacity="0.8" />
      <path d="M34 38.5L42.2 47.3L50 38.5L57.8 47.3L66 38.5" stroke="#FFF5D0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M34 51.5L42.2 60.3L50 51.5L57.8 60.3L66 51.5" stroke="#FFF5D0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <div
      className={className}
      style={{
        fontFamily: 'Georgia, serif',
        fontWeight: 700,
        letterSpacing: '0.03em',
        background: 'linear-gradient(180deg, #FFF3B8 0%, #E1B95A 42%, #A56C1B 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: '#E4C463',
        textShadow: '0 0 12px rgba(255, 225, 132, 0.12)',
      }}
    >
      KARATLY
    </div>
  );
}

function Shelf({ width, height, top, leftOffset = 0, ellipseHeight, opacity = 1, transition }: { width: number; height: number; top: number; leftOffset?: number; ellipseHeight: number; opacity?: number; transition?: { duration: number; ease: readonly [number, number, number, number] | 'linear' } }) {
  return (
    <motion.div
      className="absolute left-1/2"
      style={{ top, transform: `translateX(calc(-50% + ${leftOffset}px))` }}
      initial={false}
      animate={{ opacity }}
      transition={transition ?? { duration: Duration.slow / 1000, ease: Easings.decelerate }}
    >
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        initial={false}
        animate={{ width, height, opacity }}
        transition={transition ?? { duration: Duration.slow / 1000, ease: Easings.decelerate }}
        style={{
          background: '#D9D9D9',
          borderRadius: '2px',
          opacity: 0.14,
        }}
      />
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        initial={false}
        animate={{ width, height: ellipseHeight, opacity }}
        transition={transition ?? { duration: Duration.slow / 1000, ease: Easings.decelerate }}
        style={{
          top: height - ellipseHeight / 2,
          borderRadius: '9999px',
          background: 'radial-gradient(ellipse at center, rgba(217,217,217,0.82) 0%, rgba(217,217,217,0.46) 45%, rgba(217,217,217,0) 100%)',
          filter: 'blur(0.2px)',
          opacity: 0.4,
        }}
      />
    </motion.div>
  );
}

function ShieldLogo({ x = 0, y = 0, pulse = false }: { x?: number; y?: number; pulse?: boolean }) {
  const pulseMotion = createGoldPulse();

  return (
    <motion.div
      className="absolute left-1/2 top-0"
      style={{
        width: 100,
        height: 121.25,
        left: `calc(50% - 50px + ${x}px)`,
        top: y,
      }}
      initial={false}
      animate={pulse ? pulseMotion.animate : { scale: 1 }}
      transition={pulse ? pulseMotion.transition : { duration: Duration.fast / 1000, ease: Easings.standard }}
    >
      <GoldMark size={100} />
    </motion.div>
  );
}

function WordmarkReveal({ width, show, x = 0, top = 396 }: { width: number; show: boolean; x?: number; top?: number }) {
  return (
    <motion.div
      className="absolute overflow-hidden"
      style={{ left: `calc(50% - 100px + ${x}px)`, top, width: 200, height: 50.37 }}
      initial={false}
      animate={{ width: show ? width : 0 }}
      transition={{ duration: Duration.slow / 1000, ease: Easings.spring }}
    >
      <Wordmark className="flex h-[50.37px] w-[200px] items-center text-[29px] leading-none" />
    </motion.div>
  );
}

function Divider({ width, left, top, opacity = 1 }: { width: number; left: number; top: number; opacity?: number }) {
  return (
    <motion.div
      className="absolute bg-[#FFFFFF]"
      style={{ left, top, width: 1, height: 50 }}
      initial={false}
      animate={{ width, opacity }}
      transition={{ duration: Duration.fast / 1000, ease: Easings.decelerate }}
    />
  );
}

export function Splash1() {
  useTimedNavigation(SPLASH_TIMINGS.splash1, Routes.SPLASH2);

  return (
    <SplashShell>
      <StatusBar />
      <ShieldLogo y={236} pulse />
    </SplashShell>
  );
}

export function Splash2() {
  useTimedNavigation(SPLASH_TIMINGS.splash2, Routes.SPLASH3);

  return (
    <SplashShell>
      <StatusBar />
      <Shelf
        width={200}
        height={220}
        top={238.5}
        ellipseHeight={15}
        opacity={1}
        transition={{ duration: Duration.slow / 1000, ease: Easings.decelerate }}
      />
      <ShieldLogo y={346} pulse={false} />
      <Divider width={1} left={135} top={406} opacity={1} />
    </SplashShell>
  );
}

export function Splash3() {
  useTimedNavigation(SPLASH_TIMINGS.splash3, Routes.SPLASH4);

  return (
    <SplashShell>
      <StatusBar />
      <Shelf
        width={306}
        height={292}
        top={238.5}
        leftOffset={-0.64}
        ellipseHeight={19.91}
        opacity={1}
        transition={{ duration: Duration.medium / 1000, ease: Easings.standard }}
      />
      <ShieldLogo y={346} pulse={false} />
    </SplashShell>
  );
}

export function Splash4() {
  useTimedNavigation(SPLASH_TIMINGS.splash4, Routes.SPLASH5);

  return (
    <SplashShell>
      <StatusBar />
      <Shelf
        width={306}
        height={292}
        top={238.5}
        leftOffset={-0.64}
        ellipseHeight={19.91}
        opacity={1}
        transition={{ duration: Duration.medium / 1000, ease: Easings.standard }}
      />
      <motion.div
        className="absolute bg-[#FFFFFF]"
        style={{ left: 135, top: 406, width: 1, height: 50 }}
        initial={false}
        animate={{ opacity: 1, width: 1 }}
        transition={{ duration: Duration.fast / 1000, ease: Easings.decelerate }}
      />
      <ShieldLogo y={346} pulse={false} />
      <Divider width={200} left={135} top={406} opacity={1} />
      <WordmarkReveal width={200} show x={100} top={396} />
    </SplashShell>
  );
}

export function Splash5() {
  const navigate = useNavigate();
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setFadeOut(true), SPLASH_TIMINGS.splash5 - Duration.slow);
    const navigateTimer = window.setTimeout(() => navigate(Routes.ONBOARDING, { replace: true }), SPLASH_TIMINGS.splash5);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(navigateTimer);
    };
  }, [navigate]);

  return (
    <SplashShell
      opacity={fadeOut ? 0 : 1}
      transition={{ duration: Duration.slow / 1000, ease: Easings.gentle }}
    >
      <StatusBar />
      <Shelf
        width={306}
        height={292}
        top={238.5}
        leftOffset={-0.64}
        ellipseHeight={19.91}
        opacity={1}
        transition={{ duration: Duration.medium / 1000, ease: Easings.standard }}
      />
      <Divider width={200} left={135} top={406} opacity={1} />
      <ShieldLogo x={-100} y={346} pulse={false} />
      <WordmarkReveal width={200} show x={100} top={396} />
    </SplashShell>
  );
}

export function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const content = [
    { title: "24K Digital Gold", desc: "Buy 99.9% pure gold starting from just ₹100. Fully insured and stored in secure vaults." },
    { title: "Physical Delivery", desc: "Convert your digital gold to physical coins or jewelry and get it delivered to your doorstep." },
    { title: "Gold SIPs", desc: "Automate your wealth creation with daily, weekly, or monthly gold investments." }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18, ease: Easings.standard }} className="flex flex-col min-h-[100dvh] bg-background p-6">
      <div className="flex-1 flex flex-col justify-center items-center text-center mt-12">
        <div className="w-64 h-64 rounded-full bg-accent/10 mb-12 flex items-center justify-center relative">
          <div className="absolute inset-0 border border-accent/30 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-accent to-yellow-700 shadow-[0_0_30px_rgba(212,175,55,0.3)]" />
        </div>
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-4">{content[step].title}</h2>
          <p className="text-muted-foreground">{content[step].desc}</p>
        </motion.div>
      </div>
      
      <div className="pb-8">
        <div className="flex justify-center gap-2 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-accent' : 'w-2 bg-muted'}`} />
          ))}
        </div>
        <button 
          onClick={() => step < 2 ? setStep(s => s + 1) : navigate(Routes.LOGIN)}
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-[0_0_20px_rgba(151,71,255,0.4)]"
        >
          {step < 2 ? "Next" : "Get Started"}
        </button>
      </div>
    </motion.div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className="absolute left-[24px] top-[24px] grid h-[48px] w-[48px] place-items-center rounded-full border-2 border-white bg-transparent text-white"
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.8" />
        <path d="M15.8 9.6L11.4 14L15.8 18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

function SparklesIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 0.75L6.96 3.04L9.25 4L6.96 4.96L6 7.25L5.04 4.96L2.75 4L5.04 3.04L6 0.75Z" fill="currentColor" />
      <path d="M2 6.75L2.56 8.1L3.9 8.66L2.56 9.21L2 10.57L1.44 9.21L0.1 8.66L1.44 8.1L2 6.75Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function SecureIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 1.2L10.3 2.9V6.2C10.3 8.8 8.8 10.9 6 11.8C3.2 10.9 1.7 8.8 1.7 6.2V2.9L6 1.2Z" stroke="#E8B438" strokeWidth="0.9" />
      <path d="M4.2 6.1L5.4 7.3L7.9 4.8" stroke="#E8B438" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FingerprintIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" aria-hidden="true">
      <path d="M26 12.5C19 12.5 13.5 18 13.5 25C13.5 36.1 18.6 43.5 26 43.5" stroke="#111111" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M26 18.2C22 18.2 19 21.2 19 25.2C19 31.8 21.9 36.2 26 40" stroke="#111111" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M26 24C24 24 22.6 25.7 22.6 27.7C22.6 30.9 23.8 33.5 26 35.8" stroke="#111111" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M26 8.5C16.4 8.5 8.5 16.4 8.5 26C8.5 38.8 14.7 47.5 26 47.5C37.3 47.5 43.5 38.8 43.5 26C43.5 16.4 35.6 8.5 26 8.5Z" stroke="#111111" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M30.2 14.8C35 16.4 38 20.8 38 26.8" stroke="#111111" strokeWidth="4.2" strokeLinecap="round" />
      <path d="M16.2 26.1C16.2 31.9 18.3 36.4 22.1 39.2" stroke="#111111" strokeWidth="4.2" strokeLinecap="round" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      <circle cx="9.5" cy="9.5" r="3.8" stroke="#111111" strokeWidth="2.1" />
      <path d="M13 9.5H23.5V13.2H21.1V15.2H18.7V17.2H15.9" stroke="#111111" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AuthLoadingOverlay({ label, progress }: { label: string; progress: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-black/35 px-6"
      style={{ backdropFilter: 'blur(3px)' }}
    >
      <div className="w-full max-w-[300px] rounded-[22px] border border-[#7D5800]/70 bg-[#161000]/95 px-5 py-4 shadow-[0_22px_60px_rgba(0,0,0,0.45)]">
        <div className="mb-3 flex items-center justify-between text-[11px] tracking-[0.22em] text-[#FFF6D9]">
          <span>{label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-[10px] overflow-hidden rounded-full bg-[#2A1F10]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#F7CD57] via-[#E5AF35] to-[#B57F23] transition-[width] duration-75"
            style={{ width: `${Math.max(4, progress)}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

function SparkleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 0.75L6.96 3.04L9.25 4L6.96 4.96L6 7.25L5.04 4.96L2.75 4L5.04 3.04L6 0.75Z" fill="currentColor" />
      <path d="M2 6.75L2.56 8.1L3.9 8.66L2.56 9.21L2 10.57L1.44 9.21L0.1 8.66L1.44 8.1L2 6.75Z" fill="currentColor" opacity="0.9" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <path d="M14 18.5L19.2 24L25 16L30.8 24L36 18.5L33.8 31H16.2L14 18.5Z" fill="#000000" />
      <rect x="17" y="33" width="16" height="3.4" fill="#000000" />
      <circle cx="14" cy="18" r="4" fill="#000000" />
      <circle cx="25" cy="14" r="4" fill="#000000" />
      <circle cx="36" cy="18" r="4" fill="#000000" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 50 50" fill="none" aria-hidden="true">
      <path d="M25 8L38.5 13.4V23.3C38.5 31.4 33.9 37.7 25 42C16.1 37.7 11.5 31.4 11.5 23.3V13.4L25 8Z" fill="#000000" />
      <path d="M19.8 24.5L23.7 28.4L31 21.2" stroke="#F7CD57" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HeroDivider() {
  return (
    <div className="absolute left-1/2 top-[383px] flex w-[102px] -translate-x-1/2 items-center justify-center">
      <span className="h-px w-[39px] bg-[#6A511C]" />
      <span className="mx-3 h-[8px] w-[8px] rotate-45 bg-[#B57F23]" />
      <span className="h-px w-[39px] bg-[#6A511C]" />
    </div>
  );
}

function GoldInput({ className = '', placeholder, type = 'text', inputMode, value, onChange }: { className?: string; placeholder: string; type?: string; inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']; value: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; }) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`rounded-[10px] border border-[#666666] bg-[#1A1510] px-5 text-[16px] font-normal text-[#FFF6D9] outline-none placeholder:text-[#5E5B5B] ${className}`}
    />
  );
}

export function Login() {
  const navigate = useNavigate();
  const { sendOtp } = useAuth();
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const canSend = email.trim().length > 0 && mobile.trim().replace(/\D/g, '').length >= 10;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSend || isSending) return;
    setIsSending(true);
    setError('');

    const normalizedMobile = mobile.replace(/\D/g, '').slice(0, 10);
    const response = await sendOtp({ mobileNumber: normalizedMobile, email, type: 'login' });

    setIsSending(false);
    if (response?.ok) {
      navigate(Routes.OTP, { replace: true });
    } else {
      setError(response?.message || 'Failed to send OTP');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: Easings.standard }}
      className="relative h-[100dvh] w-full overflow-hidden text-white"
      style={{
        background: 'radial-gradient(125.11% 64.66% at 97.55% 0%, #4A3A1E 0%, #000000 99.45%)',
        fontFamily: 'Lato, sans-serif',
      }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Back"
        className="absolute left-[24px] top-[24px] grid h-[28px] w-[28px] place-items-center text-white"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.8" />
          <path d="M15.8 9.6L11.4 14L15.8 18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute left-1/2 top-[93px] -translate-x-1/2">
        <div className="relative h-[100px] w-[100px]">
          <div className="absolute inset-0 rounded-full bg-[#B37D22]" />
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_166.49deg_at_82.04%_52.28%,#3D2600_0deg,#B17B21_360deg)]" />
          <div className="absolute left-[10px] top-[10px] grid h-[80px] w-[80px] place-items-center rounded-full bg-[#FFD357]">
            <FingerprintIcon />
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-[217px] -translate-x-1/2">
        <div className="flex h-[30px] w-[123px] items-center gap-2 rounded-[20px] border border-[#7D5800] bg-[#161000] px-3 text-white shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]">
          <SparklesIcon />
          <span className="text-[12px] font-normal leading-[14px] tracking-[0.01em]">VAULT ACCESS</span>
        </div>
      </div>

      <div className="absolute left-1/2 top-[263px] -translate-x-1/2 text-[12px] font-normal uppercase tracking-[0.25em] text-[#999999]">
        STEP 1 OF 2
      </div>

      <div className="absolute left-1/2 top-[301px] w-[349.06px] -translate-x-1/2 text-center text-[32px] font-bold leading-[37px] text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
        Welcome back to <span className="text-[#D9A639]">Karatly</span>
      </div>

      <div className="absolute left-1/2 top-[383px] flex w-[102px] -translate-x-1/2 items-center justify-center">
        <span className="h-px w-[39px] bg-[#C7C7C7]" />
        <span className="mx-3 h-[8px] w-[8px] rotate-45 bg-[#B57F23]" />
        <span className="h-px w-[39px] bg-[#C7C7C7]" />
      </div>

      <div className="absolute left-1/2 top-[411px] w-[315.89px] -translate-x-1/2 text-center text-[12px] leading-[14px] text-[#FFF6D9]">
        Sign in with your registered email and mobile to continue your precious-metals journey
      </div>

      {error && (
        <div className="absolute left-1/2 top-[438px] w-[342px] -translate-x-1/2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="absolute inset-0">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email Address *"
          className="absolute left-1/2 top-[471px] h-[50px] w-[342px] -translate-x-1/2 rounded-[10px] border border-[#666666] bg-[#1A1510] px-5 text-[16px] text-[#FFF6D9] placeholder:text-[#5E5B5B] outline-none"
          autoComplete="email"
        />

        <input
          value={mobile}
          onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
          type="tel"
          placeholder="Mobile number *"
          className="absolute left-1/2 top-[553px] h-[50px] w-[342px] -translate-x-1/2 rounded-[10px] border border-[#666666] bg-[#1A1510] px-5 text-[16px] text-[#FFF6D9] placeholder:text-[#5E5B5B] outline-none"
          autoComplete="tel"
          inputMode="numeric"
        />

        <button
          type="submit"
          disabled={!canSend || isSending}
          className="absolute left-1/2 top-[635px] flex h-[60px] w-[342px] -translate-x-1/2 items-center justify-center rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[20px] font-medium text-black disabled:opacity-70"
        >
          <span className="mr-3">{isSending ? 'Sending...' : 'Send OTP'}</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12H19M13 6L19 12L13 18" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="absolute left-[-30px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 bg-white blur-[16.5px]" />
        </button>
      </form>

      <div className="absolute left-1/2 top-[715px] flex w-[342px] -translate-x-1/2 items-center">
        <span className="h-px w-[117px] bg-[#C1C1C1]" />
        <span className="flex-1 text-center text-[12px] font-medium leading-[14px] text-[#BABAB7]">SECURE LOGIN</span>
        <span className="h-px w-[123px] bg-[#C1C1C1]" />
      </div>

      <div className="absolute left-1/2 top-[745px] flex -translate-x-1/2 items-center gap-2 text-[12px] font-normal leading-[14px] text-[#9C9C9B]">
        <SecureIcon />
        <span>256-bit encrypted - BIS verified platform</span>
      </div>

      <div className="absolute left-1/2 top-[791px] -translate-x-1/2 text-center text-[16px] font-medium leading-[19px] text-[#FFF6D9]">
        New to Karatly?{" "}
        <button type="button" onClick={() => navigate(Routes.SIGNUP)} className="text-[#E8B438]">create account</button>
      </div>
    </motion.div>
  );
}

export function OTP() {
  const navigate = useNavigate();
  const { state, verifyOtp } = useAuth();
  const [digits, setDigits] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [sessionError, setSessionError] = useState('');

  const maskedPhone = state.phoneNumber
    ? `+91 ${state.phoneNumber.slice(0, 2)}*****${state.phoneNumber.slice(-2)}`
    : '+91 98*****10';

  const handleDigitChange = (index: number, value: string) => {
    const nextValue = value.replace(/\D/g, '').slice(-1);
    setDigits((current) => {
      const nextDigits = [...current];
      nextDigits[index] = nextValue;
      return nextDigits;
    });

    if (nextValue) {
      const nextInput = document.querySelector<HTMLInputElement>(`[data-otp-index="${index + 1}"]`);
      nextInput?.focus();
    }
  };

  const handleVerify = async () => {
    if (isVerifying || digits.some((digit) => !digit)) return;

    setIsVerifying(true);
    setSessionError('');

    const otp = digits.join('');
    const response = await verifyOtp({
      mobileNumber: state.phoneNumber || '',
      otp,
      email: state.email || '',
      fullName: state.fullName || undefined,
      dateOfBirth: state.dateOfBirth || undefined,
      type: state.authType
    });

    setIsVerifying(false);

    if (response?.ok) {
      if (state.authType === 'register') {
        navigate(Routes.LOGIN, { replace: true });
      } else {
        navigate(Routes.DASHBOARD, { replace: true });
      }
    } else if (response?.code === 'SESSION_EXISTS') {
      setSessionError(response.message || '');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: Easings.standard }}
      className="relative h-[100dvh] w-full overflow-hidden text-white"
      style={{
        background:
          'radial-gradient(125.11% 64.66% at 97.55% 0%, #4A3A1E 0%, #000000 99.45%)',
        fontFamily: 'Lato, sans-serif',
      }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Back"
        className="absolute left-[24px] top-[24px] grid h-[28px] w-[28px] place-items-center text-white"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.8" />
          <path d="M15.8 9.6L11.4 14L15.8 18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute left-1/2 top-[93px] -translate-x-1/2">
        <div className="relative h-[100px] w-[100px]">
          <div className="absolute inset-0 rounded-full bg-[#B37D22]" />
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_166.49deg_at_82.04%_52.28%,#3D2600_0deg,#B17B21_360deg)]" />
          <div className="absolute left-[10px] top-[10px] grid h-[80px] w-[80px] place-items-center rounded-full bg-[#FFD357] text-[#000000]">
            <KeyIcon />
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-[217px] -translate-x-1/2">
        <div className="flex h-[30px] w-[167px] items-center gap-[10px] rounded-[20px] border border-[#7D5800] bg-[#161000] px-[17px] text-white">
          <span className="grid h-[12px] w-[12px] place-items-center">
            <SparklesIcon />
          </span>
          <span className="text-[12px] font-normal leading-[14px]">ONE TIME PASSWORD</span>
        </div>
      </div>

      <div className="absolute left-1/2 top-[263px] -translate-x-1/2 text-[12px] font-normal uppercase tracking-[0.25em] text-[#999999]">
        ALMOST THERE
      </div>

      <div className="absolute left-1/2 top-[301px] w-[265.67px] -translate-x-1/2 text-center text-[32px] font-bold leading-[37px] text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
        Unlock your <span className="italic text-[#D9A639]">Gold</span>
        <br />
        Vault
      </div>

      <HeroDivider />

      <div className="absolute left-1/2 top-[411px] w-[263.95px] -translate-x-1/2 text-center text-[12px] leading-[14px] text-[#FFF6D9]">
        A 4-digit secure code was sent to
        <br />
        {maskedPhone || '+91 98•••••10'}
      </div>

      {sessionError && (
        <div className="absolute left-1/2 top-[438px] w-[342px] -translate-x-1/2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 text-center">
          {sessionError}
        </div>
      )}

      <div className="absolute left-1/2 top-[471px] flex -translate-x-1/2 gap-[16px]">
        {digits.map((digit, index) => (
          <input
            key={index}
            data-otp-index={index}
            value={digit}
            onChange={(e) => handleDigitChange(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !digit) {
                const previousInput = document.querySelector<HTMLInputElement>(`[data-otp-index="${index - 1}"]`);
                previousInput?.focus();
              }
            }}
            inputMode="numeric"
            maxLength={1}
            className={`h-[80px] w-[70px] rounded-[20px] border-2 bg-[#1B1611] text-center text-[20px] font-medium text-[#FFF6D9] outline-none transition-colors ${
              index === 0 ? 'border-[#F7CD57] bg-black' : 'border-[#3C351F]'
            }`}
          />
        ))}
      </div>

      <div className="absolute left-1/2 top-[575px] -translate-x-1/2 text-center text-[16px] font-medium leading-[19px] text-[#9C9C9B]">
        Didn&apos;t receive code?{" "}
        <button type="button" onClick={() => { setDigits(['', '', '', '']); setSessionError(''); }} className="text-[#E8B438]">
          Resend
        </button>
      </div>

      <button
        type="button"
        onClick={handleVerify}
        disabled={digits.some((digit) => !digit) || isVerifying}
        className="absolute left-[24px] top-[644px] flex h-[60px] w-[342px] items-center justify-center rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[20px] font-medium text-black disabled:opacity-70"
      >
        <span>{isVerifying ? 'Verifying...' : 'Verify & Continue'}</span>
        <svg className="ml-3" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12H19M13 6L19 12L13 18" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="absolute left-[-30px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 bg-white blur-[16.5px]" />
      </button>

      <div className="absolute left-1/2 top-[736px] -translate-x-1/2 text-[16px] font-medium leading-[19px] text-[#7C7B79]">
        Change email or mobile
      </div>
    </motion.div>
  );
}

export function Signup() {
  const navigate = useNavigate();
  const { sendOtp } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    uniqueId: '',
    mobileNumber: '',
    dateOfBirth: '',
    email: '',
    state: '',
    city: '',
    address: '',
    landmark: '',
    pinCode: '',
  });

  const handleChange = (field: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = field === 'mobileNumber' || field === 'pinCode' ? event.target.value.replace(/\D/g, '') : event.target.value;
    setForm((current) => ({ ...current, [field]: value }));
  };
  
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSending) return;
    setIsSending(true);
    setError('');

    const normalizedMobile = form.mobileNumber.replace(/\D/g, '').slice(0, 10);
    const response = await sendOtp({
      mobileNumber: normalizedMobile,
      email: form.email,
      fullName: form.fullName,
      dateOfBirth: form.dateOfBirth,
      type: 'register'
    });

    setIsSending(false);
    if (response?.ok) {
      navigate(Routes.OTP, { replace: true });
    } else {
      setError(response?.message || 'Failed to send OTP');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18, ease: Easings.standard }}
      className="relative h-[100dvh] w-full overflow-hidden text-white"
      style={{
        background: 'radial-gradient(125.11% 64.66% at 97.55% 0%, #4A3A1E 0%, #000000 99.45%)',
        fontFamily: 'Lato, sans-serif',
      }}
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Back"
        className="absolute left-[24px] top-[24px] grid h-[28px] w-[28px] place-items-center text-white"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <circle cx="14" cy="14" r="13" stroke="currentColor" strokeWidth="1.8" />
          <path d="M15.8 9.6L11.4 14L15.8 18.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="absolute left-1/2 top-[93px] -translate-x-1/2">
        <div className="relative h-[100px] w-[100px]">
          <div className="absolute inset-0 rounded-full bg-[#B37D22]" />
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_166.49deg_at_82.04%_52.28%,#3D2600_0deg,#B17B21_360deg)]" />
          <div className="absolute left-[10px] top-[10px] grid h-[80px] w-[80px] place-items-center rounded-full bg-[#FFD357]">
            <CrownIcon />
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-[217px] -translate-x-1/2">
        <div className="flex h-[30px] w-[167px] items-center gap-[10px] rounded-[20px] border border-[#7D5800] bg-[#161000] px-[17px] text-white">
          <span className="grid h-[12px] w-[12px] place-items-center">
            <SparklesIcon />
          </span>
          <span className="text-[12px] font-normal leading-[14px]">BECOME A MEMBER</span>
        </div>
      </div>

      <div className="absolute left-1/2 top-[263px] -translate-x-1/2 text-[12px] font-normal uppercase tracking-[0.25em] text-[#999999]">
        OPEN YOUR GOLD ACCOUNT
      </div>

      <div className="absolute left-1/2 top-[301px] w-[266px] -translate-x-1/2 text-center text-[32px] font-bold leading-[37px] text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
        Start Your <span className="italic text-[#D9A639]">Golden</span>
        <br />
        Story
      </div>

      <HeroDivider />

      <div className="absolute left-1/2 top-[411px] w-[264px] -translate-x-1/2 text-center text-[12px] leading-[14px] text-[#FFF6D9]">
        Set up your Karatly profile to invest, store and
        <br />
        grow your wealth in certified precious metals
      </div>

      {error && (
        <div className="absolute left-1/2 top-[438px] w-[342px] -translate-x-1/2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300 text-center">
          {error}
        </div>
      )}

      <div className="absolute left-[24px] top-[471px] h-[373px] w-[342px] overflow-hidden">
        <form onSubmit={handleSignup} className="h-full w-full">
          <div className="h-full w-full overflow-y-auto overscroll-contain no-scrollbar pb-6">
            <div className="grid w-full grid-cols-2 gap-x-[22px] gap-y-[16px]">
              <GoldInput placeholder="Full Name *" className="col-span-2 h-[50px] w-full" value={form.fullName} onChange={handleChange('fullName')} />
              <GoldInput placeholder="Mobile Number *" className="h-[50px] w-full" value={form.mobileNumber} onChange={handleChange('mobileNumber')} inputMode="numeric" type="tel" />
              <GoldInput placeholder="Date of Birth *" className="h-[50px] w-full" value={form.dateOfBirth} onChange={handleChange('dateOfBirth')} />
              <GoldInput placeholder="Email *" className="col-span-2 h-[50px] w-full" value={form.email} onChange={handleChange('email')} type="email" />
              <GoldInput placeholder="State *" className="h-[50px] w-full" value={form.state} onChange={handleChange('state')} />
              <GoldInput placeholder="City *" className="h-[50px] w-full" value={form.city} onChange={handleChange('city')} />
              <GoldInput placeholder="Address *" className="col-span-2 h-[50px] w-full" value={form.address} onChange={handleChange('address')} />
              <GoldInput placeholder="Landmark *" className="h-[50px] w-full" value={form.landmark} onChange={handleChange('landmark')} />
              <GoldInput placeholder="Pin Code *" className="h-[50px] w-full" value={form.pinCode} onChange={handleChange('pinCode')} inputMode="numeric" />

              <button
                type="submit"
                disabled={isSending}
                className="col-span-2 mt-[10px] flex h-[60px] w-full items-center justify-center rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[20px] font-medium text-black disabled:opacity-70"
              >
                <span className="mr-3">{isSending ? 'Sending...' : 'Send OTP'}</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12H19M13 6L19 12L13 18" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="absolute left-[-30px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 bg-white blur-[16.5px]" />
              </button>

              <div className="col-span-2 mt-[8px] text-center text-[12px] leading-[14px] text-[#7C7B79]">
                By continuing you agree to Karatly&apos;s Terms and Privacy Policy.
              </div>

              <div className="col-span-2 text-center text-[16px] font-medium leading-[19px] text-[#FFF6D9]">
                Already have an account?{' '}
                <button type="button" onClick={() => navigate(Routes.LOGIN, { replace: true })} className="text-[#FFF6D9]">
                  Login
                </button>
              </div>

              <div className="col-span-2 h-[80px] w-full bg-black" />
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
