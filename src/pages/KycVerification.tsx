import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, ShieldCheck, User, Camera } from 'lucide-react';
import { Routes } from '../lib/routes';

function TickCircle() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#4CD676" />
      <path d="M7 12.5L10.5 16L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IdCardIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="#E5AF35" strokeWidth="1.2" />
      <path d="M5.5 6.5H10.5" stroke="#E5AF35" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.5 9H8.5" stroke="#E5AF35" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3L4 7V12C4 17.3 7.6 22 12 23C16.4 22 20 17.3 20 12V7L12 3Z" fill="black" stroke="black" strokeWidth="2" />
      <path d="M9 12L11.5 14.5L16 10" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function KycVerification() {
  const navigate = useNavigate();
  const location = useLocation();

  const checklistItems = [
    { icon: <User size={16} />, title: 'Personal Details', subtitle: 'Name, DOB, Address' },
    { icon: <IdCardIcon />, title: 'PAN Card', subtitle: 'ABCD****1P' },
    { icon: <IdCardIcon />, title: 'Aadhaar e-KYC', subtitle: 'OTP Verified' },
    { icon: <Camera size={16} />, title: 'Live Selfie', subtitle: 'Face match passed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-full bg-black text-white"
      style={{
        background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)',
        fontFamily: 'Lato, sans-serif',
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
            <span className="text-[14px] font-normal leading-[21px]">KYC Verification</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-6 items-center gap-2 rounded-[20px] border border-[#0C9100] bg-[#032101] px-3 text-[10px] text-[#15EE01]">
              <ShieldCheck size={10} />
              <span>Verified</span>
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
          </div>
        </section>

        {/* KYC Status Card */}
        <section className="mx-6 mt-6">
          <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(30.18deg,#1E2A28_64.48%,#6C5123_96.45%)] px-6 pb-4 pt-8">
            <div className="flex flex-col items-center text-center">
              <div className="grid h-[80px] w-[80px] place-items-center rounded-full bg-[linear-gradient(180deg,#FBBF42_0%,#E59700_100%)]">
                <ShieldIcon />
              </div>
              <div className="mt-4 text-[24px] font-bold leading-[29px] text-[#F0AB21]">Fully Verified</div>
              <div className="mt-1 text-[10px] leading-[12px] text-[#7E7E7E]">Your account meets all SEBI and RBI compliance requirements.</div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-[10px] border border-[#2E2E2E] bg-[#16181A] py-3 text-center">
                <div className="text-[16px] font-bold leading-[19px] text-[#F7CD57]">Tier II</div>
                <div className="mt-1 text-[12px] leading-[14px] text-[#7E7E7E]">Level</div>
              </div>
              <div className="rounded-[10px] border border-[#2E2E2E] bg-[#16181A] py-3 text-center">
                <div className="text-[16px] font-bold leading-[19px] text-[#F7CD57]">₹10L</div>
                <div className="mt-1 text-[12px] leading-[14px] text-[#7E7E7E]">Limit</div>
              </div>
              <div className="rounded-[10px] border border-[#2E2E2E] bg-[#16181A] py-3 text-center">
                <div className="text-[16px] font-bold leading-[19px] text-[#F7CD57]">2026</div>
                <div className="mt-1 text-[12px] leading-[14px] text-[#7E7E7E]">Valid</div>
              </div>
            </div>
          </div>
        </section>

        {/* Verification Checklist */}
        <section className="mx-6 mt-6">
          <h2 className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">VERIFICATION CHECKLIST</h2>
          <div className="mt-3 space-y-3">
            {checklistItems.map((item, index) => (
              <div
                key={index}
                className="flex items-center rounded-[15px] border border-[#2E2E2E] bg-[#0F1416] px-4 py-4"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-black">
                  <div className="text-[#E5AF35]">{item.icon}</div>
                </div>
                <div className="ml-4 flex-1">
                  <div className="text-[14px] font-bold leading-[17px] text-white">{item.title}</div>
                  <div className="mt-1 text-[10px] leading-[12px] text-[#7E7E7E]">{item.subtitle}</div>
                </div>
                <TickCircle />
              </div>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
