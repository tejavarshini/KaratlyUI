import React from 'react';

export function SplashLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Playfair+Display:wght@600;700&display=swap"
      />
      <div
        className="relative h-[844px] w-[390px] overflow-hidden bg-black"
        style={{ fontFamily: 'Poppins, sans-serif' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: '#000000',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(83.05% 31.89% at 2.45% 0%, rgba(74,58,30,0.34) 0%, rgba(74,58,30,0.12) 24%, rgba(0,0,0,0) 62%)',
          }}
        />
        {children}
      </div>
    </div>
  );
}

function SignalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="1.5" y="7.5" width="1.5" height="3.75" rx="0.75" fill="white" />
      <rect x="4.5" y="5.25" width="1.5" height="6" rx="0.75" fill="white" />
      <rect x="7.5" y="2.25" width="1.5" height="9" rx="0.75" fill="white" />
      <rect x="10.5" y="0" width="1.5" height="11.25" rx="0.75" fill="white" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M6 9C6.6 9 7.08 9.48 7.08 10.08C7.08 10.66 6.6 11.12 6 11.12C5.4 11.12 4.92 10.66 4.92 10.08C4.92 9.48 5.4 9 6 9Z" fill="white" />
      <path d="M3.12 6.25C3.94 5.44 4.91 5.02 6 5.02C7.09 5.02 8.06 5.44 8.88 6.25" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M1.58 4.05C2.9 2.81 4.4 2.17 6 2.17C7.6 2.17 9.1 2.81 10.42 4.05" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M0.45 1.8C2.04 0.45 3.86 -0.2 6 0.1C8.14 -0.2 9.96 0.45 11.55 1.8" stroke="white" strokeWidth="1.1" strokeLinecap="round" opacity="0.95" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="0.5" y="2.5" width="9" height="7" rx="1.5" stroke="white" strokeWidth="0.8" />
      <rect x="1.5" y="3.5" width="7" height="5" rx="0.8" fill="white" />
      <rect x="10" y="4.5" width="1.5" height="3" rx="0.5" fill="white" />
    </svg>
  );
}

export function StatusBar() {
  return (
    <div className="absolute left-0 top-0 h-[24px] w-[390px]">
      <span
        className="absolute left-[24px] top-[3px] text-white"
        style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', lineHeight: '18px', fontWeight: 400 }}
      >
        9:30
      </span>
      <div className="absolute left-[320px] top-[6px]">
        <SignalIcon />
      </div>
      <div className="absolute left-[337px] top-[6px]">
        <WifiIcon />
      </div>
      <div className="absolute left-[354px] top-[7px]">
        <BatteryIcon />
      </div>
    </div>
  );
}

export default SplashLayout;
