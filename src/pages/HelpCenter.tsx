import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Search, ChevronRight, MessageCircle, Phone, Mail } from 'lucide-react';
import { Routes } from '../lib/routes';

function HelpIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="black" />
      <path d="M9.5 9.5C9.5 8.1 10.6 7 12 7C13.4 7 14.5 8.1 14.5 9.5C14.5 10.7 13.7 11.7 12.6 12.1C12.2 12.2 12 12.5 12 12.9V13.5" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="black" />
    </svg>
  );
}

const contactMethods = [
  { icon: <MessageCircle size={16} />, title: 'Live Chat', subtitle: 'Avg 2 min' },
  { icon: <Phone size={16} />, title: 'Call Us', subtitle: '1800-123-4567' },
  { icon: <Mail size={16} />, title: 'Email', subtitle: 'help@karatly.in' },
];

const popularTopics = [
  'How is gold price calculated?',
  'When does SIP debit happen?',
  'How to redeem physical gold',
  'What are storage fee?',
  'How do i withdraw funds?',
];

export function HelpCenter() {
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
            <span className="text-[14px] font-normal leading-[21px]">Help Center</span>
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

        {/* Search Card */}
        <section className="mx-6 mt-4">
          <div className="flex flex-col items-center overflow-hidden rounded-[20px] border border-[#2E2E2E] bg-[#0F1416] px-6 pb-6 pt-4">
            <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[linear-gradient(180deg,#FBBF42_0%,#E59700_100%)]">
              <HelpIcon />
            </div>
            <div className="mt-2 text-[16px] font-bold leading-[19px] text-white">How can we help?</div>
            <div className="mt-4 flex w-full items-center rounded-[40px] border border-[#2E2E2E] bg-black px-4 py-2">
              <Search size={18} className="text-[#4E4E4E]" />
              <span className="ml-3 text-[10px] leading-[12px] text-[#4E4E4E]">Search articles...</span>
            </div>
          </div>
        </section>

        {/* Contact Us */}
        <section className="mx-6 mt-6">
          <h2 className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">CONTACT US</h2>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {contactMethods.map((method) => (
              <button
                key={method.title}
                type="button"
                className="flex flex-col items-center rounded-[10px] border border-[#2E2E2E] bg-[#16181A] py-4"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2A2923] text-[#E5AF35]">
                  {method.icon}
                </div>
                <div className="mt-2 text-[14px] font-semibold leading-[17px] text-white">{method.title}</div>
                <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">{method.subtitle}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Popular Topics */}
        <section className="mx-6 mt-6">
          <h2 className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">POPULAR TOPICS</h2>
          <div className="mt-3 overflow-hidden rounded-[20px] border border-[#2E2E2E] bg-[#0F1416]">
            {popularTopics.map((topic, index) => (
              <React.Fragment key={topic}>
                <button type="button" className="flex w-full items-center px-6 py-3 text-left">
                  <span className="flex-1 text-[14px] leading-[17px] text-[#D5D5D5]">{topic}</span>
                  <ChevronRight size={16} className="text-[#BCBCBC]" />
                </button>
                {index < popularTopics.length - 1 && <div className="mx-6 h-px bg-[#2E2E2E]" />}
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}
