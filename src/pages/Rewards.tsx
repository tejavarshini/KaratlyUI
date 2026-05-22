import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Copy, Share2 } from 'lucide-react';
import { Routes } from '../lib/routes';

function GiftIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="9" width="18" height="5" rx="1" stroke="black" strokeWidth="1.5" />
      <path d="M12 9V20" stroke="black" strokeWidth="1.5" />
      <path d="M7 4.5C7 3.1 8.1 2 9.5 2C11.5 2 12 4.5 12 4.5C12 4.5 12.5 2 14.5 2C15.9 2 17 3.1 17 4.5C17 6 16 7 12 9" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const earnings = [
  { name: 'Priya.s', date: '12 May', amount: '+₹100' },
  { name: 'Rohan.K', date: '08 May', amount: '+₹100' },
  { name: 'Diya.M', date: '06 May', amount: '+₹100' },
];

export function Rewards() {
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
            <span className="text-[14px] font-normal leading-[21px]">Rewards & Refferals</span>
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

        {/* Earnings Card */}
        <section className="mx-6 mt-6">
          <div className="relative flex flex-col items-center overflow-hidden rounded-[20px] bg-[linear-gradient(30.18deg,#1E2A28_64.48%,#6C5123_96.45%)] px-6 pb-6 pt-8">
            <div className="grid h-[80px] w-[80px] place-items-center rounded-full bg-[linear-gradient(180deg,#FBBF42_0%,#E59700_100%)]">
              <GiftIcon />
            </div>
            <div className="mt-4 text-[14px] leading-[17px] text-[#B4B0B0]">Total Earnings</div>
            <div className="mt-1 text-[32px] font-extrabold leading-[38px] text-[#F7CD57]">₹420</div>
            <div className="mt-1 text-[14px] leading-[17px] text-[#B4B0B0]">≈ 0.064g gold equivalent</div>
          </div>
        </section>

        {/* Stats Row */}
        <section className="mx-6 mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-[10px] border border-[#2E2E2E] bg-[#16181A] py-3 text-center">
            <div className="text-[14px] font-semibold leading-[17px] text-white">3</div>
            <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">Friends</div>
          </div>
          <div className="rounded-[10px] border border-[#2E2E2E] bg-[#16181A] py-3 text-center">
            <div className="text-[14px] font-bold leading-[17px] text-white">₹300</div>
            <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">This Month</div>
          </div>
          <div className="rounded-[10px] border border-[#2E2E2E] bg-[#16181A] py-3 text-center">
            <div className="text-[14px] font-bold leading-[17px] text-white">Gold</div>
            <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">Tier</div>
          </div>
        </section>

        {/* Referral Code */}
        <section className="mx-6 mt-4 rounded-[20px] border border-[#2E2E2E] bg-[#0F1416] px-6 py-5">
          <div className="text-[12px] leading-[14px] text-[#B4B0B0]">Your referral code</div>
          <div className="mt-4 flex items-center rounded-[40px] border border-[#2E2E2E] bg-black px-4 py-2">
            <span className="flex-1 text-[14px] font-semibold leading-[17px] text-white">HARI10KAR</span>
            <button type="button" aria-label="Copy" className="grid h-6 w-6 place-items-center rounded-full bg-[#2A2923]">
              <Copy size={13} className="text-[#E5AF35]" />
            </button>
            <button type="button" aria-label="Share" className="ml-2 grid h-6 w-6 place-items-center rounded-full bg-[#2A2923]">
              <Share2 size={12} className="text-[#E5AF35]" />
            </button>
          </div>
          <div className="mt-3 text-[12px] leading-[14px] text-[#B4B0B0]">Friend gets ₹50 · You get ₹100 when they invest ₹500+</div>
        </section>

        {/* Earning History */}
        <section className="mx-6 mt-6">
          <h2 className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">EARNING HISTORY</h2>
          <div className="mt-3 rounded-[20px] border border-[#2E2E2E] bg-[#0F1416]">
            {earnings.map((item, index) => (
              <React.Fragment key={item.name}>
                <div className="flex items-center px-6 py-4">
                  <div>
                    <div className="text-[14px] font-bold leading-[17px] text-white">{item.name}</div>
                    <div className="mt-1 text-[10px] leading-[12px] text-[#7E7E7E]">{item.date}</div>
                  </div>
                  <div className="ml-auto text-[14px] font-bold leading-[17px] text-[#0FA902]">{item.amount}</div>
                </div>
                {index < earnings.length - 1 && <div className="mx-6 h-px bg-[#2E2E2E]" />}
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
