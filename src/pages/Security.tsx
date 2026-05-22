import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell } from 'lucide-react';
import { Routes } from '../lib/routes';

function Toggle({ enabled }: { enabled: boolean }) {
  return (
    <div
      className={`relative h-5 w-10 rounded-full ${enabled ? 'bg-[#E8B438]' : 'bg-[#A2A2A2]'}`}
      style={enabled ? {} : { border: '1px solid #FFFFFF' }}
    >
      <div
        className={`absolute top-[3px] h-[14px] w-[14px] rounded-full ${enabled ? 'left-[23px] bg-black' : 'left-[3px] bg-[#D9D9D9]'}`}
      />
    </div>
  );
}

function Divider() {
  return <div className="mx-6 h-px bg-[#2E2E2E]" />;
}

interface SecurityRowProps {
  title: string;
  subtitle: string;
  right?: React.ReactNode;
  subtitleRight?: string;
}

function SecurityRow({ title, subtitle, right, subtitleRight }: SecurityRowProps) {
  const subRight = subtitleRight && (
    <span className="text-[10px] leading-[12px] text-[#7E7E7E]">{subtitleRight}</span>
  );
  return (
    <div className="flex items-center px-6 py-4">
      <div className="flex-1">
        <div className="text-[14px] font-bold leading-[17px] text-white">{title}</div>
        <div className="mt-1 text-[10px] leading-[12px] text-[#7E7E7E]">{subtitle}</div>
      </div>
      {subtitleRight && (
        <div className="mr-3">
          {subRight}
        </div>
      )}
      {right || null}
    </div>
  );
}

export function Security() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full bg-black text-white"
      style={{
        background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <main className="mx-auto w-full max-w-[390px] pb-[110px]">
        {/* Status Bar */}
        <section className="flex items-center justify-between px-6 pb-1 pt-[3px] text-[12px] leading-[18px] text-white">
          <span>9:30</span>
          <div className="flex items-center gap-2 text-white">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true">
              <rect x="1" y="8" width="3" height="4" rx="1" fill="currentColor" />
              <rect x="6" y="5" width="3" height="7" rx="1" fill="currentColor" />
              <rect x="11" y="2" width="3" height="10" rx="1" fill="currentColor" />
            </svg>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true">
              <path d="M7 1C4 1 1.5 3.3 1 6.5H13C12.5 3.3 10 1 7 1Z" fill="currentColor" opacity="0.95" />
            </svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="21" height="10" rx="3" stroke="currentColor" strokeWidth="1" />
              <rect x="3" y="3" width="15" height="6" rx="1" fill="currentColor" />
              <path d="M24 4V8C24 8 25 7.5 25 6C25 4.5 24 4 24 4Z" fill="currentColor" />
            </svg>
          </div>
        </section>

        {/* Header */}
        <section className="flex items-center justify-between px-6 pt-10">
          <div className="flex items-center gap-2 text-[#F7CD57]">
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="grid h-6 w-6 place-items-center">
              <ArrowLeft size={18} />
            </button>
            <span className="text-[14px] font-normal leading-[21px]">Security</span>
          </div>

          <button
            type="button"
            aria-label="Notifications"
            onClick={() => navigate(Routes.NOTIFICATIONS)}
            className="relative grid h-6 w-6 place-items-center rounded-full border border-[#E8B438] bg-[#1D170D] text-[#C1C1C1]"
          >
            <Bell size={14} />
            <span className="absolute right-[2px] top-[2px] h-[5px] w-[5px] rounded-full bg-[#EE0105]" />
          </button>
        </section>

        {/* AUTHENTICATION */}
        <section className="mx-6 mt-6">
          <h2 className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">AUTHENTICATION</h2>
          <div className="mt-3 overflow-hidden rounded-[20px] border border-[#2E2E2E] bg-[#0F1416]">
            <SecurityRow title="Biometric login" subtitle="Fingerprint Enabled" right={<Toggle enabled />} />
            <Divider />
            <SecurityRow title="Two-Factor Auth" subtitle="OTP Via SMS" right={<Toggle enabled />} />
            <Divider />
            <SecurityRow title="App Lock" subtitle="PIN on every launch" right={<Toggle enabled={false} />} />
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="mx-6 mt-6">
          <h2 className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">ACCOUNT</h2>
          <div className="mt-3 overflow-hidden rounded-[20px] border border-[#2E2E2E] bg-[#0F1416]">
            <SecurityRow title="Change Password" subtitle="Last Updated 28d ago" subtitleRight="Last Updated 28d ago" />
            <Divider />
            <SecurityRow title="Login Devices" subtitle="View 12 sessions" subtitleRight="View 12 sessions" />
            <Divider />
            <SecurityRow title="Trusted Devices" subtitle="2 Devices" subtitleRight="2 Devices" />
          </div>
        </section>
      </main>
    </motion.div>
  );
}
