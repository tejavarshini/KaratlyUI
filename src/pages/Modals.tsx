import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Routes } from '../lib/routes';
import { TopBar } from '../components/TopBar';
import { mockData } from '../data/mockData';
import { transitions } from '../lib/animations';
import { Bell, MapPin, Share2, Copy, ArrowLeft, ChevronRight, TriangleAlert } from 'lucide-react';

export function Notifications() {
  const navigate = useNavigate();
  const tabs = ['All', 'Prices', 'Orders', 'Rewards', 'Account'] as const;
  const todayItems = [
    {
      title: 'Gold up 1.8% today',
      message: '₹15,121/g · Your portfolio gained ₹2,840.',
      time: '4:32 PM',
      icon: 'trend',
      unread: true,
    },
    {
      title: 'Order Confirmed',
      message: '0.82g gold purchased at ₹15,121/g.',
      time: '4:30 PM',
      icon: 'order',
      unread: true,
    },
    {
      title: '₹250 referral bonus',
      message: 'Riya joined Karatly using your code AARAV24.',
      time: '01:10 PM',
      icon: 'gift',
      unread: true,
    },
    {
      title: 'SIP Executed',
      message: 'Monthly SIP of ₹5,000 added 0.33g gold.',
      time: '09:00 AM',
      icon: 'swap',
      unread: false,
    },
  ] as const;

  const yesterdayItems = [
    {
      title: 'Silver dipped 0.6%',
      message: '₹15,121/g · Your portfolio gained ₹2,840.',
      time: '08:42 PM',
      icon: 'trend-down',
      unread: true,
    },
    {
      title: 'New device signed in',
      message: '0.82g gold purchased at ₹15,121/g.',
      time: '07:11 PM',
      icon: 'security',
      unread: false,
    },
    {
      title: 'Daily streak: 7 days',
      message: 'Riya joined Karatly using your code AARAV24.',
      time: '08:02 AM',
      icon: 'gift',
      unread: false,
    },
  ] as const;

  const earlierItems = [
    {
      title: 'KYC Verified',
      message: 'Your account is fully verified. Unlimited limits unlocked.',
      time: 'May 13',
      icon: 'security',
      unread: false,
    },
    {
      title: 'Gold target hit',
      message: 'Your alert at ₹15,000/g triggered.',
      time: 'May 11',
      icon: 'trend',
      unread: false,
    },
  ] as const;

  return (
    <motion.div
      {...transitions.fadeTransition}
      className="min-h-[100dvh] bg-black text-white"
      style={{
        background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)',
        fontFamily: 'Lato, sans-serif',
      }}
    >
      <main className="mx-auto min-h-[100dvh] w-full max-w-[390px] pb-6">
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

        <section className="flex items-center justify-between px-6 pt-10">
          <div className="flex items-center gap-2 text-[#F7CD57]">
            <button type="button" aria-label="Back" onClick={() => navigate(-1)} className="grid h-6 w-6 place-items-center">
              <ArrowLeft size={18} />
            </button>
            <span className="text-[14px] font-normal leading-[21px]">Notification</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-6 items-center gap-1 rounded-[20px] border border-[#0C9100] bg-[#032101] px-3 text-[10px] text-[#15EE01]">
              <span className="text-[12px] leading-none">•</span>
              <span>3 New</span>
            </div>
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-6 w-6 place-items-center rounded-full border border-[#E8B438] bg-[#1D170D] text-[#C1C1C1]"
            >
              <Bell size={14} />
              <span className="absolute right-[2px] top-[2px] h-[5px] w-[5px] rounded-full bg-[#EE0105]" />
            </button>
          </div>
        </section>

        <section className="mt-10 px-6">
          <div className="flex items-center gap-4 rounded-[20px] border border-[#2E2E2E] bg-[#0F1416] px-5 py-5">
            <div className="grid h-[100px] w-[100px] place-items-center rounded-full bg-[linear-gradient(180deg,#FBD14F_0%,#D69000_100%)] text-[#000000] shadow-[0_0_0_1px_rgba(0,0,0,0.14)]">
              <Bell size={36} strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <div className="text-[16px] font-bold leading-[19px] text-white">Stay in Loop</div>
              <div className="mt-2 max-w-[160px] text-[12px] leading-[14px] text-[#B4B0B0]">Prices moves, Orders, Rewards &amp; Security</div>
            </div>
          </div>
        </section>

        <section className="px-6 pt-8">
          <div className="flex items-center rounded-[20px] border border-[#4E4E4E] bg-[#1A1710] p-[2px] text-center text-[12px] leading-[14px]">
            {tabs.map((tab, index) => (
              <div
                key={tab}
                className={`flex-1 rounded-[18px] px-2 py-[13px] ${index === 0 ? 'bg-[linear-gradient(270deg,#D89300_0%,#FCD352_100%)] text-black' : 'bg-transparent text-[#9E9E9E]'}`}
              >
                {tab}
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 pt-10">
          <div className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">TODAY</div>
          <div className="mt-5 rounded-[15px] border border-[#3E3E3E] bg-[#0F1416] px-4 py-1">
            {todayItems.map((item, index) => (
              <NotificationRow key={item.title} item={item} showDivider={index !== todayItems.length - 1} />
            ))}
          </div>
        </section>

        <section className="px-6 pt-8">
          <div className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">YESTERDAY</div>
          <div className="mt-5 rounded-[15px] border border-[#3E3E3E] bg-[#0F1416] px-4 py-1">
            {yesterdayItems.map((item, index) => (
              <NotificationRow key={item.title} item={item} showDivider={index !== yesterdayItems.length - 1} />
            ))}
          </div>
        </section>

        <section className="px-6 pt-8">
          <div className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">EARLIER</div>
          <div className="mt-5 rounded-[15px] border border-[#3E3E3E] bg-[#0F1416] px-4 py-1">
            {earlierItems.map((item, index) => (
              <NotificationRow key={item.title} item={item} showDivider={index !== earlierItems.length - 1} />
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}

function NotificationRow({ item, showDivider }: { item: { title: string; message: string; time: string; icon: string; unread: boolean }; showDivider: boolean }) {
  return (
    <div>
      <div className="flex items-start gap-3 py-4">
        <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-full border border-[#2E2E2E] bg-black text-[#BFBFBF]">
          {item.icon === 'trend' && <ArrowLeft size={18} className="rotate-45" />}
          {item.icon === 'trend-down' && <ArrowLeft size={18} className="-rotate-45" />}
          {item.icon === 'order' && <span className="text-[16px]">◻</span>}
          {item.icon === 'gift' && <span className="text-[16px]">🎁</span>}
          {item.icon === 'swap' && <span className="text-[16px]">⇄</span>}
          {item.icon === 'security' && <span className="text-[16px]">◈</span>}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="min-w-0 text-[12px] font-semibold leading-[14px] text-white">{item.title}</div>
            {item.unread && <span className="h-1.5 w-1.5 rounded-full bg-[#EE0105]" />}
          </div>
          <div className="mt-1 text-[8px] leading-[10px] text-[#6E6E6E]">{item.message}</div>
        </div>

        <div className="flex-shrink-0 text-right text-[8px] leading-[10px] text-[#6E6E6E]">{item.time}</div>
      </div>
      {showDivider && <div className="h-px bg-[#2E2E2E]" />}
    </div>
  );
}

export function Partner() {
  const referralCode = "KARAT-89X2";
  
  return (
    <motion.div {...transitions.slideFromBottom} className="flex flex-col min-h-[100dvh] bg-background">
      <TopBar title="Partner Program" />
      <div className="p-4 flex-1 flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent to-yellow-600 mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.4)]">
          <Share2 size={32} className="text-background" />
        </div>
        
        <h2 className="font-serif text-2xl font-semibold mb-2">Refer & Earn Gold</h2>
        <p className="text-muted-foreground text-center mb-8">
          Get 0.5g of 24K Gold for every friend who signs up and makes their first purchase of ₹5,000 or more.
        </p>

        <div className="w-full p-4 rounded-xl border border-dashed border-accent bg-accent/5 flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Your Referral Code</p>
            <p className="font-bold text-xl tracking-wider text-foreground">{referralCode}</p>
          </div>
          <button className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
            <Copy size={20} />
          </button>
        </div>

        <button className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-[0_0_20px_rgba(151,71,255,0.4)]">
          Share Invite Link
        </button>
      </div>
    </motion.div>
  );
}

export function Nearby() {
  return (
    <motion.div {...transitions.slideFromBottom} className="flex flex-col min-h-[100dvh] bg-background">
      <TopBar title="Nearby Dealers" />
      <div className="flex-1 bg-muted/20 relative">
        <div className="absolute inset-0 bg-card/50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-primary rounded-full border-4 border-background flex items-center justify-center shadow-lg z-10">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border rounded-t-3xl z-20">
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-4">Trusted Partners Near You</h3>
          
          <div className="space-y-3">
            {[
              { name: 'Karatly Vault Hub', dist: '1.2 km', address: 'MG Road, City Center' },
              { name: 'Secure Logistics Partner', dist: '3.4 km', address: 'Industrial Area Phase 1' }
            ].map(loc => (
              <div key={loc.name} className="p-3 rounded-xl border border-border bg-card flex gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{loc.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{loc.address}</p>
                </div>
                <div className="ml-auto text-xs font-semibold text-primary">{loc.dist}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
