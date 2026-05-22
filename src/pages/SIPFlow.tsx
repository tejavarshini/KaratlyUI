import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Routes, AutoAdvanceDelays } from '../lib/routes';
import { useGoldFlow } from '../store/GoldFlowContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { transitions, Easings, Duration, SpringConfigs } from '../lib/animations';
import { ArrowLeft, ShieldCheck, Sparkles, Coins } from 'lucide-react';

export function SIP1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;
  const amount = state.sipState.amount ?? 1000;

  const presets = [500, 1000, 2000, 5000];

  return (
    <motion.div
      {...transitions.fadeTransition}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.34)] px-0 pb-12 backdrop-blur-[10px]"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <motion.section
        {...transitions.slideFromBottom}
        transition={{ duration: Duration.fast / 1000, ease: Easings.standard }}
        className="relative w-full max-w-[390px] overflow-hidden rounded-t-[60px] bg-black text-white shadow-[0_-24px_60px_rgba(0,0,0,0.5)]"
        style={{ background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0.1)_18%,rgba(0,0,0,0.35)_100%)]" />
        <div className="relative z-10 flex flex-col px-6 pb-2 pt-2">
          <div className="mx-auto h-[10px] w-[100px] rounded-full bg-[#3E3E3E]" />

          <header className="relative mt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate(backgroundLocation?.pathname || Routes.HOME, { replace: true })}
              aria-label="Back"
              className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-white"
            >
              <ArrowLeft size={24} strokeWidth={1.8} />
            </button>
            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Gold SIP</h1>
            <div className="absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#3B3935] text-[#15EE01]">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StepRail label="Amount" active />
            <StepRail label="Plan" />
            <StepRail label="Review" />
          </div>

          <div className="mt-2 pb-1">
            <section className="rounded-[10px] border border-[#E8B438] bg-[linear-gradient(244.67deg,#6C5123_0%,#1E2A28_44.59%)] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[12px] leading-[18px] text-[#A1A1A1]">GOLD SIP</div>
                  <motion.div className="mt-1 text-[14px] font-semibold leading-[21px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                    Auto-invest in 24K gold
                  </motion.div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] leading-[15px] text-[#0EA300]">
                    <Sparkles size={12} strokeWidth={1.9} />
                    <span>Start small, grow big</span>
                  </div>
                </div>
                <div className="mt-1 grid h-[60px] w-[60px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE27A_0%,#F5BF31_34%,#C98900_100%)] shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08)]">
                  <div className="grid h-[52px] w-[52px] place-items-center rounded-full border border-[#E8B438]/40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(180deg,#F8D862_0%,#D59B12_100%)] text-[12px] font-semibold tracking-[0.08em] text-[#C89111]">
                    SIP
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-2 rounded-[20px] border border-[#4E4E4E] bg-[#21211A] px-4 py-3">
              <div className="text-center text-[12px] font-medium leading-[18px] text-[#7E7E7E]">INVESTMENT AMOUNT</div>
              <div className="mx-auto mt-4 flex h-[40px] w-[200px] items-center justify-center rounded-[20px] border border-[#5E5E5E] bg-[#37372E] text-[24px] font-semibold leading-[36px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                ₹ {amount.toLocaleString('en-IN')}
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_SIP_STATE', payload: { amount: preset } })}
                    className={`h-[30px] rounded-[20px] border px-3 text-[12px] leading-[18px] ${amount === preset ? 'border-[#5E5E5E] bg-[#262521] text-white' : 'border-[#4E4E4E] bg-[#262521] text-white'}`}
                  >
                    ₹{preset}
                  </button>
                ))}
              </div>
            </section>

            <div className="mt-2 grid grid-cols-3 gap-3">
              <FeatureChip icon={<ShieldCheck size={16} strokeWidth={2} />} label="Auto Invest" />
              <FeatureChip icon={<Coins size={16} strokeWidth={2} />} label="24K Gold" />
              <FeatureChip icon={<Sparkles size={16} strokeWidth={2} />} label="No Lock-in" />
            </div>
          </div>

          <div className="mt-1 shrink-0">
            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => navigate(Routes.SIP_2, { state: { backgroundLocation } })}
                whileTap={{ scale: 0.98, transition: SpringConfigs.buttonPress }}
                className="h-10 w-full rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-medium leading-[19px] text-black"
              >
                Continue →
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function SIP2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  const amount = state.sipState.amount ?? 500;
  const totalCycles = 6;
  const totalInvested = amount * totalCycles;
  const pricePerGram = 7421.5;
  const estimatedGold = (totalInvested / pricePerGram).toFixed(3);
  const returns = Math.round(totalInvested * 0.124);
  const projectedValue = totalInvested + returns;
  const frequency = state.sipState.frequency || 'Monthly';
  const debitDate = state.sipState.date || 5;

  return (
    <motion.div
      {...transitions.fadeTransition}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.34)] px-0 pb-12 backdrop-blur-[10px]"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <motion.section
        {...transitions.slideFromBottom}
        transition={{ duration: Duration.fast / 1000, ease: Easings.standard }}
        className="relative w-full max-w-[390px] overflow-hidden rounded-t-[60px] bg-black text-white shadow-[0_-24px_60px_rgba(0,0,0,0.5)]"
        style={{ background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0.1)_18%,rgba(0,0,0,0.35)_100%)]" />
        <div className="relative z-10 flex flex-col px-6 pb-2 pt-2">
          <div className="mx-auto h-[10px] w-[100px] rounded-full bg-[#3E3E3E]" />

          <header className="relative mt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate(backgroundLocation?.pathname || Routes.HOME, { replace: true })}
              aria-label="Back"
              className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-white"
            >
              <ArrowLeft size={24} strokeWidth={1.8} />
            </button>
            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Review Plan</h1>
            <div className="absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#3B3935] text-[#15EE01]">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StepRail label="Amount" active />
            <StepRail label="Plan" active />
            <StepRail label="Mandate" />
          </div>

          <div className="mt-2 pb-1">
            <section className="rounded-[20px] bg-[#302916] px-6 py-6 text-center">
              <div className="text-[12px] font-medium leading-[18px] text-[#7E7E7E]">PROJECTED VALUE IN 6 MONTHS</div>
              <div className="mt-3 text-[32px] font-semibold leading-[48px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                ₹{projectedValue.toLocaleString('en-IN')}
              </div>
              <div className="mt-1 text-[12px] font-medium leading-[18px] text-[#15EE01]">+₹{returns} returns</div>

              <div className="relative mx-auto mt-6 h-[54px] w-[270px]">
                <div className="absolute inset-0 rounded-[80px] border-3 border-[#F8CF59] bg-[#F8CF59]" />
              </div>
            </section>

            <section className="mt-2 rounded-[20px] border border-[#3E3E3E] bg-[#1A1912] px-6 py-5">
              <div className="space-y-3 text-[12px] leading-[18px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Investment Per Cycle</span>
                  <span className="font-semibold text-white">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Frequency</span>
                  <span className="font-semibold text-white">{frequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Debit day</span>
                  <span className="font-semibold text-white">{debitDate}th every month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Total Cycles</span>
                  <span className="font-semibold text-white">{totalCycles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Total Invested</span>
                  <span className="font-semibold text-white">₹{totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Estimated Gold</span>
                  <span className="font-semibold text-white">{estimatedGold}g</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#3E3E3E] pt-3 text-[14px] leading-[21px] font-semibold">
                  <span className="text-white">Projected Value</span>
                  <span className="text-[#F8CF59]">₹{projectedValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-1 shrink-0">
            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => navigate(Routes.SIP_3, { state: { backgroundLocation } })}
                whileTap={{ scale: 0.98, transition: SpringConfigs.buttonPress }}
                className="h-10 w-full rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-medium leading-[19px] text-black"
              >
                Set Auto Debit →
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function SIP3() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;
  const amount = state.sipState.amount ?? 500;
  const totalInvested = amount * 6;
  const pricePerGram = 7421.5;
  const estimatedGold = (totalInvested / pricePerGram).toFixed(3);
  const returns = Math.round(totalInvested * 0.124);
  const projectedValue = totalInvested + returns;
  const frequency = state.sipState.frequency || 'Monthly';
  const debitDate = state.sipState.date || 5;

  return (
    <motion.div
      {...transitions.fadeTransition}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.34)] px-0 pb-12 backdrop-blur-[10px]"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <motion.section
        {...transitions.slideFromBottom}
        transition={{ duration: Duration.fast / 1000, ease: Easings.standard }}
        className="relative w-full max-w-[390px] overflow-hidden rounded-t-[60px] bg-black text-white shadow-[0_-24px_60px_rgba(0,0,0,0.5)]"
        style={{ background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0.1)_18%,rgba(0,0,0,0.35)_100%)]" />
        <div className="relative z-10 flex flex-col px-6 pb-2 pt-2">
          <div className="mx-auto h-[10px] w-[100px] rounded-full bg-[#3E3E3E]" />

          <header className="relative mt-2 flex items-center justify-center">
            <button
              type="button"
              onClick={() => navigate(backgroundLocation?.pathname || Routes.HOME, { replace: true })}
              aria-label="Back"
              className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-white"
            >
              <ArrowLeft size={24} strokeWidth={1.8} />
            </button>
            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Set Auto Debit</h1>
            <div className="absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#3B3935] text-[#15EE01]">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StepRail label="Amount" active />
            <StepRail label="Plan" active />
            <StepRail label="Mandate" active />
          </div>

          <div className="mt-2 pb-1">
            <section className="rounded-[20px] border border-[#3E3522] bg-[#302715] px-6 py-6 text-center">
              <div className="mx-auto mb-4 grid h-[80px] w-[80px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE27A_0%,#F5BF31_34%,#C98900_100%)] shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08)]">
                <div className="grid h-[66px] w-[66px] place-items-center rounded-full border border-[#E8B438]/40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(180deg,#F8D862_0%,#D59B12_100%)] text-[14px] font-semibold tracking-[0.08em] text-[#C89111]">
                  SIP
                </div>
              </div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8D8B87]">SIP SUMMARY</div>
              <div className="mt-2 text-[12px] leading-[18px] text-[#7E7E7E]">₹{amount.toLocaleString('en-IN')} · {frequency} · {debitDate}th</div>
              <div className="mt-1 text-[14px] font-semibold leading-[21px] text-[#F7CD57]">Projected: ₹{projectedValue.toLocaleString('en-IN')}</div>
            </section>

            <section className="mt-2 flex items-center gap-4 rounded-[20px] border border-[#3D3A2F] bg-[#211D12] px-4 py-4">
              <div className="grid h-[54px] w-[54px] place-items-center rounded-full bg-[#4A3C12] text-[#F7CD57]">
                <ShieldCheck size={24} strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[12px] font-semibold leading-[18px] text-white">AutoPay via UPI</div>
                <div className="mt-1 text-[10px] leading-[12px] text-[#8D8B87]">Set up UPI AutoPay. Amount auto-debited every {frequency.toLowerCase()}.</div>
              </div>
            </section>

            <div className="mt-2 flex items-center gap-2 rounded-[40px] border border-[#2E2E2E] bg-[#201B0F] px-3 py-2 text-[10px] leading-[15px] text-[#7E7E7E]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" stroke="#15EE01" strokeWidth="1.5" />
                <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke="#15EE01" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>256-bit encrypted · BIS verified platform</span>
            </div>
          </div>

          <div className="mt-1 shrink-0">
            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => navigate(Routes.SIP_4, { state: { backgroundLocation } })}
                whileTap={{ scale: 0.98, transition: SpringConfigs.buttonPress }}
                className="h-10 w-full rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-medium leading-[19px] text-black"
              >
                Authorize AutoPay →
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function SIP4() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useGoldFlow();
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  useEffect(() => {
    const timer = setTimeout(() => navigate(Routes.SIP_5, { replace: true, state: { backgroundLocation } }), AutoAdvanceDelays.SIP_4);
    return () => clearTimeout(timer);
  }, [backgroundLocation, navigate]);

  return (
    <motion.div
      {...transitions.fadeTransition}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.34)] px-0 pb-12 backdrop-blur-[10px]"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <motion.section
        {...transitions.slideFromBottom}
        transition={{ duration: Duration.fast / 1000, ease: Easings.standard }}
        className="relative w-full max-w-[390px] overflow-hidden rounded-t-[60px] bg-black text-white shadow-[0_-24px_60px_rgba(0,0,0,0.5)]"
        style={{ background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0.1)_18%,rgba(0,0,0,0.35)_100%)]" />
        <div className="relative z-10 flex flex-col px-6 pb-2 pt-2">
          <div className="mx-auto h-[10px] w-[100px] rounded-full bg-[#3E3E3E]" />
          <header className="relative mt-2 flex items-center justify-center">
            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Processing</h1>
            <div className="absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#3B3935] text-[#15EE01]">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StepRail label="Amount" active />
            <StepRail label="Plan" active />
            <StepRail label="Mandate" active />
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <LoadingScreen text="Registering SIP Mandate..." />
          </div>
          <div className="pb-1 text-center text-[12px] leading-[18px] text-[#7E7E7E]">Setting up your recurring investment plan</div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function SIP5() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch, state } = useGoldFlow();
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  const amount = state.sipState.amount ?? 1000;
  const totalInvested = amount * 12;

  return (
    <motion.div
      {...transitions.fadeTransition}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(0,0,0,0.34)] px-0 pb-12 backdrop-blur-[10px]"
      style={{ fontFamily: 'Poppins, sans-serif' }}
    >
      <motion.section
        {...transitions.slideFromBottom}
        transition={{ duration: Duration.fast / 1000, ease: Easings.standard }}
        className="relative w-full max-w-[390px] overflow-hidden rounded-t-[60px] bg-black text-white shadow-[0_-24px_60px_rgba(0,0,0,0.5)]"
        style={{ background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)' }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0.1)_18%,rgba(0,0,0,0.35)_100%)]" />
        <div className="relative z-10 flex flex-col px-6 pb-2 pt-2">
          <div className="mx-auto h-[10px] w-[100px] rounded-full bg-[#3E3E3E]" />

          <header className="relative mt-2 flex items-center justify-center">
            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Success</h1>
            <div className="absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#3B3935] text-[#15EE01]">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StepRail label="Amount" active />
            <StepRail label="Plan" active />
            <StepRail label="Mandate" active />
          </div>

          <div className="mt-2 pb-1">
            <section className="rounded-[30px] border border-[#3E3522] bg-[#302715] px-6 py-6 text-center">
              <div className="mx-auto mb-6 grid h-[130px] w-[130px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE27A_0%,#F5BF31_34%,#C98900_100%)] shadow-[0_0_40px_rgba(247,205,87,0.18)]">
                <div className="grid h-[100px] w-[100px] place-items-center rounded-full bg-[#F7CD57] text-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <div className="text-[16px] font-semibold text-white">SIP Activated!</div>
              <div className="mt-2 text-[12px] leading-[18px] text-[#7E7E7E]">Your {state.sipState.frequency?.toLowerCase() || 'monthly'} SIP of ₹{amount.toLocaleString('en-IN')} is now active</div>
            </section>

            <section className="mt-4 rounded-[30px] border border-[#444135] bg-[#191812] px-6 py-6">
              <div className="space-y-4 text-[14px] leading-[18px] text-[#8D8B87]">
                <div className="flex items-center justify-between">
                  <span>SIP Amount</span>
                  <span className="font-semibold text-white">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Frequency</span>
                  <span className="font-semibold text-white">{state.sipState.frequency || 'Monthly'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Debit Day</span>
                  <span className="font-semibold text-white">{state.sipState.date || 5}th every month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Yearly Investment</span>
                  <span className="font-semibold text-[#F7CD57]">₹{totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#33312A] pt-4 text-[18px] font-semibold">
                  <span className="text-white">Status</span>
                  <span className="text-[#15EE01]">Active</span>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-2 shrink-0">
            <div className="relative mt-1 grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => {
                  dispatch({ type: 'CLEAR_ALL' });
                  navigate(Routes.HOME);
                }}
                className="h-[56px] rounded-[28px] border border-[#3E3E3E] bg-[#191812] text-[16px] font-semibold text-white"
              >
                Go Home
              </button>
              <button
                type="button"
                onClick={() => navigate(Routes.SIP_1, { replace: true, state: { backgroundLocation } })}
                className="h-[56px] rounded-[28px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-semibold text-black"
              >
                New SIP →
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

function StepRail({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="relative">
      <div className={`h-[5px] rounded-full ${active ? 'bg-[linear-gradient(90deg,#FFE9AA_0%,#F7CD57_50%,#CA9B14_100%)]' : 'bg-[#3E3E3E]'}`} />
      <div className={`mt-1 text-[12px] leading-[18px] ${active ? 'text-[#F7CD57]' : 'text-[#515151]'}`}>{label}</div>
    </div>
  );
}

function FeatureChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex h-[50px] items-center gap-3 rounded-[39px] border border-[#3E3E3E] bg-[#16140F] px-4 text-[#5E5E5E]">
      <div className="grid h-6 w-6 place-items-center text-[#B57F23]">{icon}</div>
      <span className="text-[10px] leading-[15px]">{label}</span>
    </div>
  );
}
