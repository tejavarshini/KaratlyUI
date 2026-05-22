import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  User,
  Search,
  Filter,
  Sparkles,
  Wallet,
  TrendingUp,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ChevronRight,
  Rocket,
  Gift,
  CreditCard,
  Shield,
  LogOut,
  CheckCircle2,
  CircleHelp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Routes } from '../lib/routes';
import { mockData } from '../data/mockData';
import { useAuth } from '../store/AuthContext';
import { useCart } from '../store/CartContext';
import { TopBar } from '../components/TopBar';
import { BrandCard } from '../components/BrandCard';
import { CategoryCard } from '../components/CategoryCard';

export function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const quickActions = [
    { label: 'Buy Gold', icon: 'cart', bg: 'bg-[#3D3214]', fg: 'text-[#F7CD57]' },
    { label: 'Sell Gold', icon: 'wallet', bg: 'bg-[#233737]', fg: 'text-[#6DD6FF]' },
    { label: 'SIP', icon: 'swap', bg: 'bg-[#3D3214]', fg: 'text-[#F7CD57]' },
    { label: 'History', icon: 'history', bg: 'bg-[#233737]', fg: 'text-[#6DD6FF]' },
  ] as const;

  const transactions = [
    { title: 'Gold', amount: '₹12,400', meta: '0.82g · ₹15,121/g · Today · 4:32 PM', status: 'Completed', type: 'BUY', tone: 'gold', icon: '↙' },
    { title: 'Gold', amount: '₹3,250', meta: '42.0g · ₹77.4/g · Yesterday · 11:18 AM', status: 'Completed', type: 'SELL', tone: 'teal', icon: '↗' },
    { title: 'Gold (SIP)', amount: '₹5,000', meta: '0.33g · ₹15,082/g · May 06 · 9:00 AM', status: 'Completed', type: 'BUY', tone: 'gold', icon: '⇆' },
    { title: 'Gold', amount: '₹25,000', meta: '1.65g · ₹15,150/g · May 04 · 2:14 PM', status: 'Pending', type: 'BUY', tone: 'gold', icon: '↙' },
  ] as const;

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
            <button type="button" aria-label="Back" className="grid h-6 w-6 place-items-center">
              <ArrowLeft size={18} />
            </button>
            <span className="text-[14px] font-normal leading-[21px]">Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-6 items-center gap-2 rounded-[20px] border border-[#0C9100] bg-[#032101] px-3 text-[10px] text-[#15EE01]">
              <ArrowUpRight size={12} />
              <span>12.6%</span>
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

        <section className="relative mt-9 px-6">
          <div className="relative h-[200px] overflow-hidden rounded-[20px] border border-[#B28A3B] bg-[linear-gradient(244.67deg,#6C5123_0%,#1E2A28_44.59%)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(247,205,87,0.16),transparent_24%),radial-gradient(circle_at_18%_80%,rgba(122,160,166,0.08),transparent_25%)]" />

            <div className="relative px-5 pt-5">
              <p className="text-[12px] leading-[14px] tracking-[0.14em] text-[#BCBCBC]">PORTFOLIO VALUE</p>
              <div className="mt-4 flex items-start gap-2">
                <span className="mt-[3px] text-[30px] leading-none text-[#FFDB77]">₹</span>
                <span className="text-[32px] font-bold leading-[38px] text-[#FFDB77]">4,82,640</span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-4 items-center gap-1 rounded-[20px] border border-[#0C9100] bg-[#032101] px-2 text-[8px] text-[#15EE01]">
                  <ArrowUpRight size={10} />
                  <span>+6,420</span>
                </div>
                <span className="text-[12px] leading-[14px] text-[#BCBCBC]">Today.+1,34%</span>
              </div>

              <div className="absolute right-4 top-4 h-[100px] w-[100px] rounded-full border border-[#E8B438] bg-[radial-gradient(circle_at_35%_30%,#FFE27A_0%,#F5BF31_34%,#C98900_100%)] shadow-[inset_0_0_0_5px_rgba(255,255,255,0.08)]">
                <div className="absolute inset-0 grid place-items-center text-[22px] font-semibold tracking-[0.12em] text-[#D69B1A]">KARATLY</div>
              </div>

              <div className="absolute inset-x-0 bottom-0 h-[88px] px-4 pb-4">
                <svg viewBox="0 0 300 90" className="h-full w-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="homeAreaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="8%" stopColor="rgba(247,205,87,0.5)" />
                      <stop offset="100%" stopColor="rgba(30,42,40,0.92)" />
                    </linearGradient>
                  </defs>
                  <polyline points="10,78 34,66 58,66 82,50 108,56 132,38 156,42 180,24 204,36 226,18 252,22 276,8" fill="none" stroke="#84CBD1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points="10,78 34,66 58,66 82,50 108,56 132,38 156,42 180,24 204,36 226,18 252,22 276,8 276,90 10,90" fill="url(#homeAreaFill)" opacity="0.7" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-4 gap-2 px-6 pt-8 text-center">
          {quickActions.map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={action.label === 'Buy Gold' ? () => navigate(Routes.BUY_1, { state: { backgroundLocation: location } }) : action.label === 'Sell Gold' ? () => navigate(Routes.SELL_1, { state: { backgroundLocation: location } }) : action.label === 'SIP' ? () => navigate(Routes.SIP_1, { state: { backgroundLocation: location } }) : action.label === 'History' ? () => navigate(Routes.ORDERS) : undefined}
              className="flex flex-col items-center"
            >
              <div className={`grid h-[52px] w-[52px] place-items-center rounded-full ${action.bg}`}>
                {action.icon === 'cart' && <span className={`text-[22px] ${action.fg}`}>🛒</span>}
                {action.icon === 'wallet' && <Wallet size={22} className={action.fg} />}
                {action.icon === 'swap' && <span className={`text-[22px] ${action.fg}`}>⇄</span>}
                {action.icon === 'history' && <span className={`text-[22px] ${action.fg}`}>↺</span>}
              </div>
              <span className="mt-2 text-[12px] leading-[14px] text-[#8C8B8B]">{action.label}</span>
            </button>
          ))}
        </section>

        <section className="px-6 pt-16">
          <h2 className="text-[16px] font-bold leading-[19px] text-white">Asset Overview</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <article className="rounded-[20px] border border-[#B28A3B] bg-[#1A1710] px-3 pb-4 pt-4">
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#3D3214] text-[#F7CD57]">
                  <span className="text-[18px]">◉</span>
                </div>
                <span className="text-[10px] leading-[15px] text-[#15EE01]">+3.2%</span>
              </div>
              <p className="mt-8 text-[12px] leading-[14px] text-[#BCBCBC]">Gold Holdings</p>
              <p className="mt-1 text-[16px] font-bold leading-[19px] text-white">24.82g</p>
              <svg viewBox="0 0 120 34" className="mt-4 h-[34px] w-full" aria-hidden="true">
                <polyline points="2,24 18,16 34,22 50,12 66,16 82,6 98,14 118,4" fill="none" stroke="#F8CF59" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </article>

            <article className="rounded-[20px] border border-[#B28A3B] bg-[#1A1710] px-3 pb-4 pt-4">
              <div className="flex items-start justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#233737] text-[#3AC7FF]">
                  <span className="text-[18px]">◈</span>
                </div>
                <span className="text-[10px] leading-[15px] text-[#15EE01]">+1.8%</span>
              </div>
              <p className="mt-8 text-[12px] leading-[14px] text-[#BCBCBC]">Silver Holdings</p>
              <p className="mt-1 text-[16px] font-bold leading-[19px] text-white">182.4g</p>
              <svg viewBox="0 0 120 34" className="mt-4 h-[34px] w-full" aria-hidden="true">
                <polyline points="2,28 18,10 34,20 50,4 66,8 82,2 98,10 118,1" fill="none" stroke="#3AC7FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </article>
          </div>
        </section>

        <section className="px-6 pt-8">
          <div className="rounded-[20px] border border-[#B28A3B] bg-[#1A1710] px-4 pb-4 pt-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-[16px] font-bold leading-[19px] text-white">Rate Analytics</h3>
                <p className="mt-1 text-[12px] leading-[14px] text-[#BCBCBC]">Buy &amp; Sell rate trend</p>
              </div>

              <div className="flex h-[40px] rounded-[30px] bg-[#24201A] p-[2px] text-[12px] leading-[14px]">
                <button type="button" className="rounded-[28px] bg-[linear-gradient(124.73deg,#FED55C_14.43%,#DA9500_86.04%)] px-4 font-bold text-black">Gold</button>
                <button type="button" className="px-4 font-normal text-[#8C8B8B]">Silver</button>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between px-6 text-[12px] font-bold leading-[14px] text-[#8B8787]">
              <span>1D</span>
              <span>1W</span>
              <span className="rounded-[30px] border border-[#B17B21] bg-[#38342C] px-5 py-1 text-[#F7CD57]">1M</span>
              <span>3M</span>
              <span>1Y</span>
            </div>

            <div className="relative mt-6 h-[165px] overflow-hidden rounded-[20px] bg-[#15120F] px-1 pt-4">
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-3">
                {[100, 90, 110, 80, 85, 105, 90, 95, 70, 90].map((height, index) => (
                  <div key={index} className="w-[15px] rounded-[10px] bg-[linear-gradient(180deg,#B57F23_0%,#302A1B_100%)]" style={{ height: `${height}px` }} />
                ))}
              </div>

              <svg viewBox="0 0 280 96" className="absolute left-2 right-2 top-4 h-[92px] w-[calc(100%-16px)]" aria-hidden="true">
                <polyline points="8,60 42,68 76,48 110,74 144,66 178,44 212,64 246,56 278,46" fill="none" stroke="#3AC7FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="absolute right-4 top-5 rounded-[30px] border border-[#777777] bg-[#38342C] px-4 py-2 text-center shadow-[0_0_0_1px_rgba(0,0,0,0.2)]">
                <div className="text-[12px] leading-[14px] text-[#BCBCBC]">May 9, 2026</div>
                <div className="mt-1 text-[16px] font-bold leading-[19px] text-[#F7CD57]">15,792</div>
              </div>

              <div className="absolute left-4 bottom-4 flex items-center gap-6 text-[12px] leading-[14px] text-[#BCBCBC]">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#F8CF59]" />Buy</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#3AC7FF]" />Sell</span>
              </div>
            </div>
          </div>
        </section>

        <section className="px-6 pt-8">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-[16px] font-bold leading-[19px] text-white">AI INSIGHT</h3>
              <p className="mt-2 text-[16px] font-semibold leading-[19px] text-white">Gold prices expected to rise</p>
              <p className="mt-1 text-[12px] font-semibold leading-[14px] text-[#F7CD57]">2.4% this week</p>
            </div>
            <div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[linear-gradient(138.37deg,#FBCE49_21.78%,#D79200_73.79%)] text-black">
              <Sparkles size={24} />
            </div>
          </div>

          <div className="flex items-center justify-between pb-3">
            <h3 className="text-[16px] font-bold leading-[19px] text-white">Recent Transactions</h3>
            <span className="text-[12px] leading-[14px] text-[#8C8B8B]">All &gt;</span>
          </div>

          <div className="space-y-4">
            {transactions.map((item) => (
              <article key={`${item.title}-${item.amount}`} className="rounded-[20px] bg-[#1A1710] px-4 py-4">
                <div className="flex items-start gap-4">
                  <div className={`grid h-[50px] w-[50px] place-items-center rounded-full ${item.tone === 'teal' ? 'bg-[#213435]' : 'bg-[#3D3214]'}`}>
                    <span className="text-[24px] leading-none text-[#F7CD57]">{item.icon}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold leading-[17px] text-white">{item.title}</span>
                      <span className={`rounded-[2px] px-2 py-[2px] text-[10px] font-bold leading-[12px] ${item.type === 'SELL' ? 'bg-[#223436] text-[#6DD6FF]' : 'bg-[#4C4433] text-[#F7CD57]'}`}>{item.type}</span>
                    </div>
                    <p className="mt-1 text-[10px] leading-[12px] text-[#8B8B8B]">{item.meta}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-[14px] font-bold leading-[17px] text-white">{item.amount}</div>
                    <div className={`mt-1 text-[10px] font-medium leading-[12px] ${item.status === 'Pending' ? 'text-[#FFCD0F]' : 'text-[#15EE01]'}`}>{item.status}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
      const statCards = [
        { label: 'PORTFOLIO', value: '₹ 0.00', icon: 'wallet' },
        { label: 'GOLD HOLDING', value: '0.000g', icon: 'growth' },
        { label: 'TOTAL INVESTED', value: '₹ 0.00', icon: 'secure' },
      ] as const;

      const quickActions = [
        { label: 'Buy Gold', caption: 'Instant', icon: 'buy' },
        { label: 'Sell Gold', caption: 'Anytime', icon: 'sell' },
      ] as const;

      const benefits = ['24K Digital Gold', 'Secure Valut Storage', 'Buy/Sell Anytime', 'Instant Liquidity'] as const;

      const products = [
        { title: '1G Gold', subtitle: 'Starter unit for disciplined investing' },
        { title: '5G Gold', subtitle: 'Balanced accumulation for growing wealth' },
        { title: '10G Gold', subtitle: 'Premium Holding for serious investors' },
        { title: 'Custom', subtitle: 'Choose the amount that fits your goal' },
      ] as const;

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

            <section className="relative px-6 pt-10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="relative h-10 w-10 rounded-[10px] bg-[linear-gradient(360deg,#F5C953_0%,#B98324_100%)]">
                    <div className="absolute inset-[7px] rounded-[8px] bg-[radial-gradient(circle_at_30%_30%,#FBE39A_0%,#D89A2B_34%,#9A6718_100%)] opacity-90" />
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border border-[#E1AC34] bg-black">
                      <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,#F7CD57_0%,#917833_100%)]" />
                    </div>
                  </div>
                  <div>
                    <div className="font-['Playfair_Display'] text-[16px] font-bold leading-[21px] text-white">Karatly</div>
                    <div className="text-[12px] leading-[14px] tracking-[0.05em] text-[#C1C1C1]">PREMIUM GOLD</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    aria-label="Notifications"
                    onClick={() => navigate(Routes.NOTIFICATIONS)}
                    className="relative grid h-6 w-6 place-items-center rounded-full border border-[#E8B438] bg-[#1D170D] text-[#C1C1C1]"
                  >
                    <Bell size={14} />
                    <span className="absolute right-[2px] top-[2px] h-[5px] w-[5px] rounded-full bg-[#EE0105]" />
                  </button>

                  <div className="flex h-6 items-center gap-2 rounded-[20px] border border-[#E8B438] bg-[#1D170D] px-3 text-[12px] leading-[14px] text-[#BCBCBC]">
                    <span className="h-[5px] w-[5px] rounded-full bg-[#DDA832]" />
                    <span>Gold Platform</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-6 px-6">
              <div className="rounded-[30px] border border-[#F7CD57] bg-[radial-gradient(87.68%_316.53%_at_8.17%_91.09%,#3C3217_0%,#000000_100%)] px-6 pb-6 pt-7 shadow-[0_0_0_1px_rgba(232,180,56,0.06)]">
                <div className="text-[10px] leading-[12px] tracking-[0.05em] text-[#E1AC34]">
                  ✨ POWERED BY AUGMONT GOLD
                </div>

                <div className="mt-10 text-[20px] font-bold leading-[24px] tracking-[0.05em] text-white">
                  Welcome to <span className="text-[#F7CD57]">Karatly</span> ✨
                </div>
                <div className="mt-2 text-[12px] leading-[14px] tracking-[0.05em] text-[#BCBCBC]">
                  Track Invest. Grow your digital gold wealth
                </div>

                <div className="mt-10 flex gap-4">
                  <button type="button" onClick={() => navigate(Routes.BUY_1, { state: { backgroundLocation: location } })} className="h-10 flex-1 rounded-[15px] bg-[linear-gradient(90deg,#F5C953_0%,#BB8525_100%)] text-[14px] font-bold tracking-[0.05em] text-black">
                    Buy Gold
                  </button>
                  <button type="button" onClick={() => navigate(Routes.HOME)} className="h-10 flex-1 rounded-[15px] border border-[#E8B438] bg-[#242320] text-[14px] font-bold tracking-[0.05em] text-white">
                    View Portfolio
                  </button>
                </div>
              </div>
            </section>

            <section className="mt-10 grid grid-cols-3 gap-4 px-6">
              {statCards.map((item) => (
                <article key={item.label} className="min-h-[100px] rounded-[10px] border border-[#E8B438] bg-[#1D1A15] px-3 py-4">
                  <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[15px] bg-[#423513] text-[#DDA832]">
                    {item.icon === 'wallet' && <span className="text-[16px]">◔</span>}
                    {item.icon === 'growth' && <span className="text-[16px]">↗</span>}
                    {item.icon === 'secure' && <span className="text-[16px]">✓</span>}
                  </div>
                  <div className="mt-6 text-[8px] leading-[10px] text-[#BCBCBC]">{item.label}</div>
                  <div className="mt-2 text-[20px] font-bold leading-[24px] text-white">{item.value}</div>
                </article>
              ))}
            </section>

            <section className="px-6 pt-[34px]">
              <div className="text-[12px] leading-[14px] text-[#E1AC34]">QUICK ACTIONS</div>
              <div className="mt-2 text-[16px] font-semibold leading-[19px] text-white">Move faster with one click</div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {quickActions.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={item.label === 'Buy Gold' ? () => navigate(Routes.BUY_1, { state: { backgroundLocation: location } }) : () => navigate(Routes.SELL_1, { state: { backgroundLocation: location } })}
                    className="rounded-[10px] border border-[#E8B438] bg-[#1D1A15] px-4 py-4 text-left"
                  >
                    <div className="text-[10px] leading-[12px] text-[#BCBCBC]">{item.caption}</div>
                    <div className="mt-1 text-[20px] font-bold leading-[24px] text-white">{item.label}</div>
                    <div className="mt-2 flex justify-end">
                      <div className={`grid h-[50px] w-[50px] place-items-center rounded-full ${item.icon === 'buy' ? 'bg-[linear-gradient(180deg,#F3C751_0%,#BE8928_100%)] text-black' : 'border-2 border-[#E8B438] text-[#E8B438]'}`}>
                        {item.icon === 'buy' ? <span className="text-[22px]">↗</span> : <span className="text-[22px]">↘</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section className="px-6 pt-10">
              <div className="rounded-[10px] border border-[#E8B438] bg-[#000000] px-4 pb-4 pt-4">
                <div className="text-[16px] font-bold leading-[19px] text-[#E1AC34]">Karatly <span className="text-white">Gold Platform</span></div>
                <p className="mt-2 text-[12px] leading-[14px] tracking-[0.05em] text-[#BCBCBC]">
                  A premium digital gold experiences - own, store and trade 24K gold in seconds.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-y-4 gap-x-6">
                  {benefits.map((item) => (
                    <div key={item} className="flex items-center gap-2 text-[12px] leading-[14px] text-white">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#38311D] text-[#F7CD57]">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <button type="button" className="mt-6 h-10 w-full rounded-[15px] bg-[linear-gradient(90deg,#F8CF59_0%,#F5C953_30%,#BB8525_80%)] text-[14px] font-bold tracking-[0.05em] text-black">
                  Explore Platform
                </button>
              </div>
            </section>

            <section className="px-6 pt-10">
              <div className="text-[12px] leading-[14px] text-[#E1AC34]">PRODUCTS</div>
              <div className="mt-2 text-[16px] font-semibold leading-[19px] text-white">Explore our Products</div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                {products.map((product) => (
                  <article key={product.title} className="rounded-[10px] border border-[#E8B438] bg-[#15120F] px-4 py-4">
                    <div className="text-[16px] font-semibold leading-[19px] text-white">{product.title}</div>
                    <p className="mt-4 max-w-[140px] text-[10px] leading-[12px] text-[#BCBCBC]">{product.subtitle}</p>
                  </article>
                ))}
              </div>
            </section>
          </main>
        </motion.div>
      );
}

export function Market() {
  const navigate = useNavigate();
  const movers = [
    { id: 1, name: 'Gold 24K', unit: 'AU · per gram', price: '₹15,792', change: '+1.34%', up: true },
    { id: 2, name: 'Silver', unit: 'AG · per gram', price: '₹77.40', change: '+0.62%', up: true },
    { id: 3, name: 'Gold 22K', unit: 'AU22 · per gram', price: '₹14,476', change: '-0.18%', up: false },
    { id: 4, name: 'Platinum', unit: 'PT · per gram', price: '₹3,210', change: '+1.34%', up: true },
    { id: 5, name: 'Palladium', unit: 'PD · per gram', price: '₹2,860', change: '-1.04%', up: false },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full bg-black text-white" style={{ background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)', fontFamily: 'Lato, sans-serif' }}>
      <main className="mx-auto w-full max-w-[390px] pb-[110px]">
        <section className="px-6 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#F7CD57]"><button type="button" onClick={() => navigate(-1)} aria-label="Back" className="grid h-6 w-6 place-items-center text-[#F7CD57]"><ArrowLeft size={20} /></button><span className="text-[14px] leading-[21px]">Market</span></div>
            <div className="flex items-center gap-4"><div className="flex h-6 items-center gap-2 rounded-[20px] border border-[#0C9100] bg-[#032101] px-3 text-[10px] text-[#15EE01]"><ArrowUpRight size={13} /><span>Live</span></div><button type="button" onClick={() => navigate(Routes.NOTIFICATIONS)} className="relative grid h-6 w-6 place-items-center rounded-full border border-[#E8B438] bg-[#1D170D] text-[#C1C1C1]" aria-label="Notifications"><Bell size={14} /><span className="absolute right-[2px] top-[2px] h-[5px] w-[5px] rounded-full bg-[#EE0105]" /></button></div>
          </div>
        </section>
        <section className="mt-4 px-6"><div className="rounded-[20px] border border-[#B28A3B] bg-[linear-gradient(45deg,#1E2A28_61.54%,#6C5123_97.21%)] p-4"><div className="flex items-start justify-between"><div><p className="text-[12px] text-[#7E7E7E]">Spot Rate Gold</p><p className="mt-1 bg-[linear-gradient(90deg,#F8CF59_0%,#B68024_100%)] bg-clip-text text-[24px] font-extrabold leading-[29px] text-transparent">₹15,792 /g</p><p className="mt-1 text-[10px] text-[#15EE01]">↗ +1.34% today</p></div><div className="flex h-[30px] w-[100px] rounded-[30px] bg-[#24201A]"><div className="flex h-full w-1/2 items-center justify-center rounded-[30px] bg-[linear-gradient(124.73deg,#FED55C_14.43%,#DA9500_86.04%)] text-[12px] font-bold text-black">Gold</div><div className="flex h-full w-1/2 items-center justify-center text-[12px] text-[#8C8B8B]">Silver</div></div></div><div className="mt-8 flex items-center justify-between px-2 text-[12px] font-bold text-[#8B8787]"><span>1D</span><span>1W</span><span className="rounded-[30px] border border-[#B17B21] bg-[#38342C] px-5 py-1 text-[#F7CD57]">1M</span><span>3M</span><span>1Y</span></div><div className="relative mt-4 h-[180px] rounded-[10px] bg-[#15120F] p-3"><div className="absolute inset-x-3 bottom-4 flex items-end justify-between">{[100, 90, 110, 80, 85, 105, 90, 95, 70, 90].map((height, i) => <div key={i} className="w-[15px] rounded-[10px] bg-[linear-gradient(180deg,#B57F23_0%,#302A1B_100%)]" style={{ height }} />)}</div><svg viewBox="0 0 280 96" className="absolute left-3 right-3 top-8 h-[90px]" aria-hidden="true"><polyline points="8,58 42,66 76,46 110,72 144,64 178,42 212,62 246,54 278,44" fill="none" stroke="#3AC7FF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg><div className="absolute right-4 top-10 rounded-[30px] border border-[#777777] bg-[#38342C] px-5 py-2 text-center"><div className="text-[12px] text-[#BCBCBC]">May 9, 2026</div><div className="text-[16px] font-bold text-[#F7CD57]">15,792</div></div><div className="absolute bottom-4 left-3 flex items-center gap-6 text-[12px] text-[#BCBCBC]"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#F8CF59]" />Buy</span><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#3AC7FF]" />Sell</span></div></div></div></section>
        <section className="mt-6 px-6"><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#4E4E4E]" /><input type="text" placeholder="Search assets, coins, jewellry" className="h-10 w-full rounded-[20px] border border-[#8E742F] bg-[#1A1710] pl-12 pr-4 text-[12px] text-[#BCBCBC] placeholder:text-[#4E4E4E] focus:outline-none" /></div></section>
        <section className="mt-8 px-6"><h2 className="text-[18px] leading-[22px] text-white">Top Movers</h2><div className="mt-6 space-y-4">{movers.map((item, index) => <article key={item.id} className="flex items-center justify-between rounded-[20px] border border-[#4E4E4E] bg-[#1A1710] px-4 py-4"><div className="flex items-center gap-4"><div className="grid h-[50px] w-[50px] place-items-center rounded-full bg-[linear-gradient(180deg,#F7CD57_0%,#AA7702_100%)] text-[20px] font-bold text-black">{index === 1 ? 'AG' : '₹'}</div><div><div className="text-[16px] font-semibold text-white">{item.name}</div><div className="text-[12px] text-[#6E6E6E]">{item.unit}</div></div></div><div className="text-right"><div className="text-[16px] font-semibold text-white">{item.price}</div><div className={`text-[12px] ${item.up ? 'text-[#15EE01]' : 'text-[#FF3700]'}`}>{item.up ? '↗ ' : '↘ '}{item.change}</div></div></article>)}</div></section>
      </main>
    </motion.div>
  );
}

export function Orders() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = React.useState('All');
  const filters = ['All', 'Buy', 'Sell', 'SIP'] as const;
  const entries = [
    { id: 1, type: 'BUY', name: 'Gold', amount: '₹12,400', meta: '0.82g · ₹15,121/g · Today · 4:32 PM', status: 'Completed', circleBg: 'bg-[linear-gradient(180deg,#F7CD57_0%,#AA7702_100%)]', badgeBg: 'bg-[#38342C]', badgeText: 'text-[#F7CD57]' },
    { id: 2, type: 'SELL', name: 'Gold', amount: '₹3,250', meta: '0.82g · ₹15,121/g · Today · 4:32 PM', status: 'Completed', circleBg: 'bg-[#2E5250]', badgeBg: 'bg-[#243736]', badgeText: 'text-[#6DD6FF]' },
    { id: 3, type: 'BUY', name: 'Gold (SIP)', amount: '₹5,000', meta: '0.82g · ₹15,121/g · Today · 4:32 PM', status: 'Completed', circleBg: 'bg-[linear-gradient(180deg,#F7CD57_0%,#AA7702_100%)]', badgeBg: 'bg-[#38342C]', badgeText: 'text-[#F7CD57]' },
    { id: 4, type: 'BUY', name: 'Gold', amount: '₹11,300', meta: '0.82g · ₹15,121/g · Today · 4:32 PM', status: 'Completed', circleBg: 'bg-[linear-gradient(180deg,#F7CD57_0%,#AA7702_100%)]', badgeBg: 'bg-[#38342C]', badgeText: 'text-[#F7CD57]' },
    { id: 5, type: 'BUY', name: 'Silver', amount: '₹12,400', meta: '0.82g · ₹15,121/g · Today · 4:32 PM', status: 'Completed', circleBg: 'bg-[linear-gradient(180deg,#F7CD57_0%,#AA7702_100%)]', badgeBg: 'bg-[#38342C]', badgeText: 'text-[#F7CD57]' },
    { id: 6, type: 'SELL', name: 'Gold', amount: '₹12,400', meta: '0.82g · ₹15,121/g · Today · 4:32 PM', status: 'Completed', circleBg: 'bg-[#2E5250]', badgeBg: 'bg-[#243736]', badgeText: 'text-[#6DD6FF]' },
    { id: 7, type: 'BUY', name: 'Gold (SIP)', amount: '₹12,400', meta: '0.82g · ₹15,121/g · Today · 4:32 PM', status: 'Completed', circleBg: 'bg-[linear-gradient(180deg,#F7CD57_0%,#AA7702_100%)]', badgeBg: 'bg-[#38342C]', badgeText: 'text-[#F7CD57]' },
    { id: 8, type: 'BUY', name: 'Silver', amount: '₹12,400', meta: '0.82g · ₹15,121/g · Today · 4:32 PM', status: 'Completed', circleBg: 'bg-[linear-gradient(180deg,#F7CD57_0%,#AA7702_100%)]', badgeBg: 'bg-[#38342C]', badgeText: 'text-[#F7CD57]' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full bg-black text-white" style={{ background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)', fontFamily: 'Lato, sans-serif' }}>
      <main className="mx-auto w-full max-w-[390px] pb-[110px]">
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

        <section className="flex items-center justify-between px-6 pt-[17.5px]">
          <div className="flex items-center gap-2 text-[#F7CD57]">
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="grid h-6 w-6 place-items-center text-[#F7CD57]">
              <ArrowLeft size={20} />
            </button>
            <span className="font-['Poppins'] text-[14px] leading-[21px]">Orders</span>
          </div>
          <button type="button" onClick={() => navigate(Routes.NOTIFICATIONS)} className="relative grid h-6 w-6 place-items-center rounded-full border border-[#E8B438] bg-[#1D170D] text-[#C1C1C1]" aria-label="Notifications">
            <Bell size={14} />
            <span className="absolute right-[2px] top-[2px] h-[5px] w-[5px] rounded-full bg-[#EE0105]" />
          </button>
        </section>

        <section className="mt-[34.5px] px-6">
          <div className="rounded-[20px] border border-[#B28A3B] bg-[linear-gradient(30.18deg,#1E2A28_64.48%,#6C5123_96.45%)] px-4 pb-5 pt-[19px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] leading-[14px] text-[#7E7E7E]">THIS MONTH</p>
                <p className="mt-1 bg-[linear-gradient(90deg,#F8CF59_0%,#B68024_100%)] bg-clip-text text-[32px] font-extrabold leading-[38px] text-transparent">₹61,444</p>
                <p className="mt-[6px] text-[12px] leading-[14px] text-[#7E7E7E]">Total invested · 6 orders</p>
              </div>
              <div className="grid h-[100px] w-[100px] place-items-center rounded-full border-2 border-[#E8B438] bg-[linear-gradient(180deg,#F7CD57_0%,#AA7702_100%)] text-[16px] font-bold text-[#D59D22] shadow-[inset_0_0_0_3px_rgba(0,0,0,0.18)]">KARATLY</div>
            </div>
            <div className="mt-[15px] grid grid-cols-3 gap-4">
              {[
                { value: '24', label: 'BUY' },
                { value: '16', label: 'SELL' },
                { value: '3', label: 'SIP' },
              ].map((item) => (
                <div key={item.label} className="rounded-[10px] border border-[#4E4E4E] bg-[#1A1710] py-[10px] text-center">
                  <div className="bg-[linear-gradient(90deg,#F8CF59_0%,#B68024_100%)] bg-clip-text text-[28px] font-extrabold leading-[34px] text-transparent">{item.value}</div>
                  <div className="text-[12px] leading-[14px] text-white">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-[18px] px-6">
          <div className="flex h-10 items-center rounded-[20px] border border-[#4E4E4E] bg-[#1A1710] p-[2px] text-[16px] leading-[19px] text-[#9E9E9E]">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`flex h-full flex-1 items-center justify-center rounded-[18px] transition-colors ${activeFilter === f ? 'bg-[linear-gradient(90deg,#FED75D_0%,#ECB000_50.48%,#D48D00_100%)] text-black' : 'bg-transparent text-[#9E9E9E]'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-4 px-6">
          <div className="flex max-h-[456px] flex-col gap-4 overflow-y-auto">
            {entries.map((item) => (
              <article key={item.id} className="flex h-[60px] items-center rounded-[20px] border border-[#4E4E4E] bg-[#1A1710] px-[10px]">
                <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${item.circleBg}`}>
                  <span className="text-[16px] font-bold text-black">
                    {item.type === 'SELL' ? <ArrowUpRight size={16} className="text-[#6DD6FF]" /> : <ArrowDownLeft size={16} className="text-black" />}
                  </span>
                </div>
                <div className="ml-3 min-w-0 flex-1">
                  <div className="flex items-center gap-[6px]">
                    <span className="text-[12px] font-semibold leading-[14px] text-white">{item.name}</span>
                    <span className={`flex h-3 items-center rounded-[3px] ${item.badgeBg} px-[5px] text-[8px] font-semibold leading-[10px] ${item.badgeText}`}>{item.type}</span>
                  </div>
                  <p className="mt-[2px] text-[8px] leading-[10px] text-[#6E6E6E]">{item.meta}</p>
                </div>
                <div className="ml-auto shrink-0 text-right">
                  <div className="text-[12px] font-semibold leading-[14px] text-white">{item.amount}</div>
                  <div className="mt-[2px] text-[8px] leading-[10px] text-[#15EE01]">{item.status}</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </motion.div>
  );
}

function Divider() { return <div className="mx-4 h-px bg-[#2E2E2E]" />; }

function ProfileMetric({ icon, value, label, tone }: { icon: React.ReactNode; value: string; label: string; tone: 'gold' | 'blue' | 'green' }) {
  const valueColor = tone === 'blue' ? 'text-[#6DD6FF]' : tone === 'green' ? 'text-[#15EE01]' : 'text-[#E8B438]';
  return <article className="relative rounded-[10px] border border-[#2E2E2E] bg-[#16181A] px-4 py-4"><div className="mb-3 grid h-6 w-6 place-items-center rounded-full bg-[#000000] text-[#FFCD0F]">{icon}</div><div className={`text-[14px] font-bold leading-[17px] ${valueColor}`}>{value}</div><div className="text-[8px] leading-[10px] text-[#7E7E7E]">{label}</div></article>;
}

function ProfileRow({ icon, title, subtitle, right }: { icon: React.ReactNode; title: string; subtitle: string; right?: React.ReactNode }) {
  return <div className="flex items-center px-4 py-4"><div className={`grid h-10 w-10 place-items-center rounded-full ${title === 'KYC Verification' || title === 'Rewards & Referrals' ? 'bg-[#2D2513]' : 'bg-[#1F2124]'}`}>{icon}</div><div className="ml-4 min-w-0 flex-1"><div className="text-[14px] font-bold text-white">{title}</div><div className="text-[10px] leading-[12px] text-[#7E7E7E]">{subtitle}</div></div>{right || <ChevronRight size={16} className="text-[#BCBCBC]" />}</div>;
}

export function Categories() { return <Market />; }

export function Brands() {
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24"><TopBar title="Trusted Brands" showBack={false} /><div className="px-4 mb-6 mt-2 flex gap-2"><div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" /><input type="text" placeholder="Search brands..." className="w-full bg-card border border-border rounded-xl py-3 pl-10 pr-4 text-foreground focus:border-primary focus:outline-none" /></div><button className="w-12 h-12 rounded-xl bg-card border border-border flex items-center justify-center text-foreground"><Filter size={20} /></button></div><div className="grid grid-cols-2 gap-4 px-4">{mockData.brands.map((brand) => <BrandCard key={brand.id} name={brand.name} trustScore={brand.trustScore} verified={brand.verified} colorClass={brand.color} />)}</div></motion.div>;
}

export function Cart() {
  const { state } = useCart();
  const navigate = useNavigate();
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 min-h-[100dvh] flex flex-col"><TopBar title="Your Cart" showBack={false} />{state.items.length === 0 ? <div className="flex-1 flex flex-col items-center justify-center p-6 text-center"><div className="w-24 h-24 rounded-full bg-card border border-border flex items-center justify-center mb-6 text-muted-foreground"><Search size={40} /></div><h2 className="font-serif text-xl font-semibold mb-2">Cart is Empty</h2><p className="text-muted-foreground mb-8">Looks like you haven't added any gold to your cart yet.</p><button onClick={() => navigate(Routes.HOME)} className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold">Start Investing</button></div> : <div className="p-4 flex-1 flex flex-col"><div className="space-y-4 flex-1">{state.items.map((item) => <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-card border border-border"><div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-700 to-black border border-accent/20" /><div className="flex-1"><h4 className="font-semibold text-sm text-foreground">{item.name}</h4><p className="text-xs text-muted-foreground">{item.weight}g • 24K</p><p className="font-semibold text-accent mt-2">₹{item.price.toLocaleString('en-IN')}</p></div></div>)}</div><div className="mt-8 p-4 rounded-xl bg-card border border-border"><h4 className="font-semibold mb-4">Order Summary</h4><div className="space-y-2 text-sm"><div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>₹{state.total.toLocaleString('en-IN')}</span></div><div className="flex justify-between text-muted-foreground"><span>GST (3%)</span><span>₹{(state.total * 0.03).toLocaleString('en-IN')}</span></div><div className="flex justify-between text-muted-foreground"><span>Making Charges</span><span>₹500</span></div><div className="pt-2 mt-2 border-t border-border flex justify-between font-semibold text-foreground text-base"><span>Total</span><span className="text-accent">₹{(state.total * 1.03 + 500).toLocaleString('en-IN')}</span></div></div><button className="w-full mt-6 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-[0_0_20px_rgba(151,71,255,0.3)]">Proceed to Checkout</button></div></div>}</motion.div>;
}


export function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useAuth();
  const [notificationsOn, setNotificationsOn] = React.useState(true);
  const displayName = state.user?.name || 'Hariprasanth';
  const displayEmail = (state.user as { email?: string } | undefined)?.email || 'hariprasanth@karatly.in';

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
        <section className="flex items-center justify-between px-6 pb-1 pt-[3px] text-[12px] leading-[18px] text-white"><span>9:30</span><div className="flex items-center gap-2 text-white"><svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true"><rect x="1" y="8" width="3" height="4" rx="1" fill="currentColor" /><rect x="6" y="5" width="3" height="7" rx="1" fill="currentColor" /><rect x="11" y="2" width="3" height="10" rx="1" fill="currentColor" /></svg><svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true"><path d="M7 1C4 1 1.5 3.3 1 6.5H13C12.5 3.3 10 1 7 1Z" fill="currentColor" opacity="0.95" /></svg><svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true"><rect x="1" y="1" width="21" height="10" rx="3" stroke="currentColor" strokeWidth="1" /><rect x="3" y="3" width="15" height="6" rx="1" fill="currentColor" /><path d="M24 4V8C24 8 25 7.5 25 6C25 4.5 24 4 24 4Z" fill="currentColor" /></svg></div></section>
        <section className="flex items-center justify-between px-6 pt-10"><div className="flex items-center gap-2 text-[#F7CD57]"><button type="button" aria-label="Back" className="grid h-6 w-6 place-items-center"><ArrowLeft size={18} /></button><span className="text-[14px] font-normal leading-[21px]">Profile</span></div><div className="flex items-center gap-3"><div className="flex h-6 items-center gap-2 rounded-[20px] border border-[#0C9100] bg-[#032101] px-3 text-[10px] text-[#15EE01]"><ArrowUpRight size={12} /><span>12.6%</span></div><button type="button" aria-label="Notifications" onClick={() => navigate(Routes.NOTIFICATIONS)} className="relative grid h-6 w-6 place-items-center rounded-full border border-[#E8B438] bg-[#1D170D] text-[#C1C1C1]"><Bell size={14} /><span className="absolute right-[2px] top-[2px] h-[5px] w-[5px] rounded-full bg-[#EE0105]" /></button></div></section>
        <section className="mt-6 px-6"><div className="relative overflow-hidden rounded-[10px] border border-[#E8B438] bg-black"><div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(247,205,87,0.18),transparent_30%),radial-gradient(circle_at_85%_15%,rgba(247,205,87,0.08),transparent_18%),linear-gradient(135deg,rgba(255,98,0,0.08),transparent_30%)]" /><div className="relative min-h-[170px] px-4 pb-4 pt-5"><div className="flex items-start gap-4"><div className="relative"><div className="grid h-[60px] w-[60px] place-items-center rounded-full bg-[linear-gradient(180deg,#F7CD57_0%,#E8B438_100%)] text-[20px] font-bold text-black shadow-[0_0_10px_10px_rgba(247,205,87,0.25)]">{displayName.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || 'HP'}</div><div className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border border-black bg-[#0FB300] text-black"><CheckCircle2 size={14} strokeWidth={2.4} /></div></div><div className="pt-1"><div className="text-[16px] font-bold leading-[19px] text-white">{displayName}</div><div className="text-[12px] leading-[14px] text-[#9E9E9E]">{displayEmail}</div><div className="mt-2 inline-flex items-center gap-2 rounded-[20px] bg-[#1C1A17] px-4 py-1 text-[12px] leading-[14px] text-[#F7CD57]"><Shield size={12} /><span>Gold Member · Tier II</span></div></div></div><div className="mt-6 grid grid-cols-3 gap-3"><ProfileMetric icon={<Wallet size={14} />} value="24.82g" label="Gold" tone="gold" /><ProfileMetric icon={<Sparkles size={14} />} value="182g" label="Silver" tone="blue" /><ProfileMetric icon={<ShieldCheck size={14} />} value="₹4.8L" label="Portfolio Value" tone="green" /></div></div></div></section>
        <section className="mt-6 px-6"><div className="flex items-center rounded-[10px] border border-[#2E2E2E] bg-[linear-gradient(100.54deg,#866117_-20.03%,#000000_38.57%)] px-4 py-4"><div className="grid h-[60px] w-[60px] place-items-center rounded-full bg-[linear-gradient(138.56deg,#9C7423_17.67%,#36280C_81.26%)] text-[#E8B438]"><Rocket size={28} /></div><div className="ml-4 flex-1"><div className="text-[14px] font-semibold leading-[17px] text-white">Boost Your tier</div><div className="text-[10px] leading-[12px] text-[#7E7E7E]">Invest ₹17,360 more this month to reach Tier III.</div></div><button type="button" className="rounded-[6px] bg-[linear-gradient(270deg,#DB9600_0%,#F7CD57_100%)] px-4 py-2 text-[10px] font-bold text-black">Invest Now</button></div></section>
        <section className="mt-8 px-6"><div className="text-[14px] font-semibold leading-[17px] text-[#9E9E9E]">ACCOUNT</div><div className="mt-3 overflow-hidden rounded-[10px] border border-[#2E2E2E] bg-[#0F1416]">              <button type="button" onClick={() => navigate(Routes.KYC_VERIFICATION)} className="w-full text-left"><ProfileRow icon={<Shield size={16} />} title="KYC Verification" subtitle="Your Identity is Verified" right={<span className="rounded-[5px] bg-[#1A301E] px-4 py-1 text-[10px] text-[#15EE01]">Verified</span>} /></button><Divider />              <button type="button" onClick={() => navigate(Routes.PAYMENT_METHODS)} className="w-full text-left"><ProfileRow icon={<CreditCard size={16} />} title="Payment Methods" subtitle="3 Saved methods" /></button><Divider /><button type="button" onClick={() => navigate(Routes.REWARDS)} className="w-full text-left"><ProfileRow icon={<Gift size={16} />} title="Rewards & Referrals" subtitle="You’ve earned ₹420" /></button></div></section>
        <section className="mt-8 px-6"><div className="text-[14px] font-semibold leading-[17px] text-[#9E9E9E]">PREFERENCES</div><div className="mt-3 overflow-hidden rounded-[10px] border border-[#2E2E2E] bg-[#0F1416]"><div className="flex items-center px-4 py-4"><div className="grid h-10 w-10 place-items-center rounded-full bg-[#202326] text-[#BFBFBF]"><Bell size={16} /></div><div className="ml-4 flex-1"><div className="text-[14px] font-bold text-white">Notification</div><div className="text-[10px] leading-[12px] text-[#7E7E7E]">Stay updated with Important alerts</div></div><button type="button" role="switch" aria-checked={notificationsOn} onClick={() => setNotificationsOn(!notificationsOn)} className={`relative flex h-5 w-10 items-center rounded-full p-[3px] transition-colors ${notificationsOn ? 'bg-[#E8B438]' : 'bg-[#A2A2A2]'}`}><div className={`h-[14px] w-[14px] rounded-full bg-[#D9D9D9] transition-transform ${notificationsOn ? 'translate-x-5' : 'translate-x-0'}`} /></button></div><Divider /><button type="button" onClick={() => navigate(Routes.SECURITY)} className="w-full text-left"><ProfileRow icon={<ShieldCheck size={16} />} title="Security" subtitle="Manage passwords and privacy" /></button><Divider /><button type="button" onClick={() => navigate(Routes.HELP_CENTER)} className="w-full text-left"><ProfileRow icon={<CircleHelp size={16} />} title="Help & Support" subtitle="FAQs and Contact Support" /></button><Divider /><button type="button" onClick={() => navigate(Routes.TERMS)} className="w-full text-left"><ProfileRow icon={<User size={16} />} title="Terms & Condition" subtitle="Regulations of company" /></button></div></section>
        <section className="px-6 pt-6 text-center text-[10px] leading-[12px] text-[#9E9E9E]">Karatly v2.6.0 · Made with care</section>
        <section className="mt-4 px-6"><button type="button" onClick={() => { dispatch({ type: 'LOGOUT' }); navigate(Routes.LOGIN, { replace: true }); }} className="flex h-[50px] w-full items-center justify-center gap-2 rounded-[10px] border border-[#2E2E2E] bg-[#0F1416] text-[14px] font-bold text-[#FF3700]"><LogOut size={16} /><span>Sign Out</span></button></section>
      </main>
    </motion.div>
  );
}