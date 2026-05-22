import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Plus, Trash2 } from 'lucide-react';
import { Routes } from '../lib/routes';

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="12" width="14" height="9" rx="2" stroke="#15EE01" strokeWidth="1.5" />
      <path d="M8 12V8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8V12" stroke="#15EE01" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="#15EE01" />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="10" width="18" height="12" rx="1" stroke="#9E9E9E" strokeWidth="1.5" />
      <path d="M3 10L12 3L21 10" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 14H16" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MobileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="6" y="2" width="12" height="20" rx="3" stroke="#9E9E9E" strokeWidth="1.5" />
      <circle cx="12" cy="18" r="1" fill="#9E9E9E" />
      <path d="M10 6H14" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function PaymentMethods() {
  const navigate = useNavigate();
  const location = useLocation();

  const savedAccounts = [
    {
      icon: <BankIcon />,
      name: 'HDFC BANK ** 4421',
      type: 'Savings · IMPS Instant',
      isDefault: true,
    },
    {
      icon: <MobileIcon />,
      name: 'hari@oksbi',
      type: 'UPI · Instant Credit',
      isDefault: false,
    },
  ];

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
            <span className="text-[14px] font-normal leading-[21px]">Payment Methods</span>
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

        {/* Auto Debit Card */}
        <section className="mx-6 mt-6">
          <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(30.18deg,#1E2A28_64.48%,#6C5123_96.45%)] px-6 py-5">
            <div className="text-[12px] leading-[14px] text-[#B4B0B0]">Auto Debit</div>
            <div className="mt-1 text-[16px] font-bold leading-[19px] text-white">SIP via UPI Mandate</div>
            <div className="mt-1 text-[12px] leading-[14px] text-[#B4B0B0]">Next charge ₹2,500 on 5 Jun · aarav@okhdfc</div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                className="h-[30px] rounded-[5px] bg-[linear-gradient(90deg,#F7CD57_0%,#AA7702_100%)] px-4 text-[12px] font-semibold leading-[14px] text-black"
              >
                Manage Mandate
              </button>
              <button
                type="button"
                className="h-[30px] rounded-[5px] border border-[#4E4E4E] bg-[#0F1416] px-4 text-[12px] font-semibold leading-[14px] text-[#F7CD57]"
              >
                Pause
              </button>
            </div>
          </div>
        </section>

        {/* Saved Accounts */}
        <section className="mx-6 mt-6">
          <h2 className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">SAVED ACCOUNTS</h2>
          <div className="mt-3 space-y-3">
            {savedAccounts.map((account, index) => (
              <div
                key={index}
                className="flex items-center rounded-[20px] border border-[#2E2E2E] bg-[#0F1416] px-4 py-4"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2A2923]">
                  {account.icon}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium leading-[21px] text-white">{account.name}</span>
                    {account.isDefault && (
                      <span className="rounded-[5px] bg-[#263938] px-3 py-1 text-[8px] font-semibold leading-[12px] text-[#F7CD57]">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">{account.type}</div>
                </div>
                {!account.isDefault && (
                  <button type="button" aria-label="Delete" className="text-[#7E7E7E]">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}

            {/* Add new account */}
            <button
              type="button"
              className="flex w-full items-center rounded-[20px] border border-[#2E2E2E] bg-[#0F1416] px-4 py-4 text-left"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2A2923]">
                <PlusIcon />
              </div>
              <div className="ml-4 flex-1">
                <div className="text-[14px] font-medium leading-[21px] text-white">Add new account</div>
                <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">Bank or UPI</div>
              </div>
            </button>
          </div>
        </section>

        {/* Security notice */}
        <section className="mx-6 mt-6">
          <div className="flex items-center gap-2 rounded-[40px] border border-[#2E2E2E] bg-[#0F1416] px-4 py-2">
            <LockIcon />
            <span className="text-[10px] leading-[15px] text-[#7E7E7E]">Verified beneficiary · Encrypted with 256-bit SSL</span>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
