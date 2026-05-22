import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Routes, AutoAdvanceDelays } from '../lib/routes';
import { useGoldFlow } from '../store/GoldFlowContext';
import { TopBar } from '../components/TopBar';
import { StepIndicator } from '../components/StepIndicator';
import { AmountSelector } from '../components/AmountSelector';
import { SuccessAnimation } from '../components/SuccessAnimation';
import { LoadingScreen } from '../components/LoadingScreen';
import { mockData } from '../data/mockData';
import { transitions, Easings, Duration, SpringConfigs } from '../lib/animations';
import { ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

export function Sell1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const [mode, setMode] = useState<'amount' | 'weight'>('weight');
  const [weight, setWeight] = useState(2);
  const pricePerGram = 7398.2;
  const holdingWeight = 12.4523;
  const holdingValue = 92125;
  const approxAmount = Math.round(weight * pricePerGram);
  const payoutAmount = approxAmount;

  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  const weightPresets = [0.5, 1, 2, Number(holdingWeight.toFixed(1))];

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

            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Sell Gold</h1>

            <div className="absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#3B3935] text-[#15EE01]">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StepRail label="Amount" active />
            <StepRail label="Review" />
            <StepRail label="Pay" />
          </div>

          <div className="mt-2 pb-1">
            <section className="rounded-[10px] border border-[#E8B438] bg-[linear-gradient(244.67deg,#6C5123_0%,#1E2A28_44.59%)] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[12px] leading-[18px] text-[#A1A1A1]">YOUR HOLDINGS</div>
                  <motion.div
                    className="mt-1 text-[24px] font-semibold leading-[36px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent"
                  >
                    {holdingWeight} g
                  </motion.div>
                  <div className="mt-1 text-[10px] leading-[15px] text-white">≈ ₹{holdingValue.toLocaleString('en-IN')}</div>
                </div>

                <div className="mt-1 grid h-[60px] w-[60px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE27A_0%,#F5BF31_34%,#C98900_100%)] shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08)]">
                  <div className="grid h-[52px] w-[52px] place-items-center rounded-full border border-[#E8B438]/40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(180deg,#F8D862_0%,#D59B12_100%)] text-[12px] font-semibold tracking-[0.08em] text-[#C89111]">
                    KARATLY
                  </div>
                </div>
              </div>
            </section>

            <section className="mt-2 flex items-center gap-3 rounded-[20px] border border-[#2E2E2E] bg-[#19160F] px-4 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#263938] text-[#6DD6FF]">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 8L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 4L14 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] leading-[18px] font-semibold text-white">Live Sell Rate</span>
                  <span className="text-[14px] font-semibold leading-[21px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                    ₹{pricePerGram.toLocaleString('en-IN')}/g
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-[10px] leading-[15px] text-[#0EA300]">
                  <Sparkles size={12} strokeWidth={1.9} />
                  <span>24K · 999.9 Pure</span>
                </div>
              </div>
            </section>

            <section className="mt-2 rounded-[20px] border border-[#2E2E2E] bg-[#19160F] p-[5px]">
              <div className="relative flex h-[30px] rounded-[20px] bg-transparent">
                {mode === 'amount' ? (
                  <motion.div
                    key="amount-pill"
                    {...transitions.slideFromRight}
                    transition={{ duration: Duration.fast / 1000, ease: Easings.standard }}
                    className="absolute inset-y-0 left-0 w-1/2 rounded-[20px] bg-[linear-gradient(90deg,#FFDA66_0%,#F0B700_48.08%,#D08700_100%)]"
                  />
                ) : (
                  <motion.div
                    key="weight-pill"
                    {...transitions.slideFromRight}
                    transition={{ duration: Duration.fast / 1000, ease: Easings.standard }}
                    className="absolute inset-y-0 right-0 w-1/2 rounded-[20px] bg-[linear-gradient(90deg,#FFDA66_0%,#F0B700_48.08%,#D08700_100%)]"
                  />
                )}

                <button
                  type="button"
                  onClick={() => setMode('amount')}
                  className={`relative z-10 w-1/2 rounded-[20px] text-[12px] font-semibold leading-[18px] transition-colors ${mode === 'amount' ? 'text-black' : 'text-[#7E7E7E]'}`}
                >
                  Sell Amount (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('weight')}
                  className={`relative z-10 w-1/2 rounded-[20px] text-[12px] font-medium leading-[18px] transition-colors ${mode === 'weight' ? 'text-black' : 'text-[#7E7E7E]'}`}
                >
                  By Weight (g)
                </button>
              </div>
            </section>

            <section className="mt-2 rounded-[20px] border border-[#4E4E4E] bg-[#21211A] px-4 py-3">
              <div className="text-center text-[12px] font-medium leading-[18px] text-[#7E7E7E]">YOU SELL</div>
              <div className="mx-auto mt-4 flex h-[40px] w-[200px] items-center justify-center rounded-[20px] border border-[#5E5E5E] bg-[#37372E]">
                <span className="text-[24px] font-semibold leading-[36px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                  {weight}
                </span>
                <span className="ml-1 text-[24px] font-semibold leading-[36px] text-[#BCBCBC]">g</span>
              </div>
              <div className="mt-2 text-center text-[10px] leading-[15px] text-[#7E7E7E]">≈ ₹{approxAmount.toLocaleString('en-IN')}</div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {weightPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWeight(preset)}
                    className={`h-[30px] rounded-[20px] border px-3 text-[12px] leading-[18px] ${weight === preset ? 'border-[#5E5E5E] bg-[#262521] text-white' : 'border-[#4E4E4E] bg-[#262521] text-white'}`}
                  >
                    {preset === weightPresets[3] ? 'Max' : `${preset}g`}
                  </button>
                ))}
              </div>
            </section>

            <div className="mt-2 flex items-center justify-between rounded-[20px] border border-[#2E2E2E] bg-[#19160F] px-5 py-3">
              <span className="text-[10px] leading-[15px] text-[#9E9E9E]">You&apos;ll Receive</span>
              <span className="text-[16px] font-semibold leading-[24px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                ₹ {payoutAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="mt-1 shrink-0">
            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => {
                  dispatch({ type: 'SET_SELL_STATE', payload: { amount: approxAmount } });
                  navigate(Routes.SELL_2, { state: { backgroundLocation } });
                }}
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

function StepRail({ label, active }: { label: string; active?: boolean }) {
  return (
    <div className="relative">
      <div className={`h-[5px] rounded-full ${active ? 'bg-[linear-gradient(90deg,#FFE9AA_0%,#F7CD57_50%,#CA9B14_100%)]' : 'bg-[#3E3E3E]'}`} />
      <div className={`mt-1 text-[12px] leading-[18px] ${active ? 'text-[#F7CD57]' : 'text-[#515151]'}`}>{label}</div>
    </div>
  );
}

export function Sell2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  const amount = state.sellState.amount || 14796;
  const pricePerGram = 7398.2;
  const quantity = (amount / pricePerGram).toFixed(4);
  const subTotal = amount;
  const platformFee = Math.round(amount * 0.005);
  const payoutAmount = subTotal - platformFee;

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

            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Review Sale</h1>

            <div className="absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#3B3935] text-[#15EE01]">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StepRail label="Amount" active />
            <StepRail label="Review" active />
            <StepRail label="Pay" />
          </div>

          <div className="mt-2 pb-1">
            <section className="rounded-[20px] bg-[#302916] px-6 py-8 text-center">
              <div className="mx-auto mb-6 grid h-[60px] w-[60px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE27A_0%,#F5BF31_34%,#C98900_100%)] shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08)]">
                <div className="grid h-[52px] w-[52px] place-items-center rounded-full border border-[#E8B438]/40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(180deg,#F8D862_0%,#D59B12_100%)] text-[12px] font-semibold tracking-[0.08em] text-[#C89111]">
                  KARATLY
                </div>
              </div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#7E7E7E]">YOU&apos;RE SELLING</div>
              <div className="mt-3 text-[32px] font-semibold leading-[48px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                {quantity} g
              </div>
              <div className="mt-3 text-[12px] font-medium leading-[18px] text-[#7E7E7E]">24K · 999.9 Pure Gold</div>
            </section>

            <section className="mt-2 rounded-[20px] border border-[#3E3E3E] bg-[#1A1912] px-6 py-5">
              <div className="space-y-3 text-[12px] leading-[18px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Sell Rate</span>
                  <span className="font-semibold text-white">₹{pricePerGram.toLocaleString('en-IN')}/g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Quantity</span>
                  <span className="font-semibold text-white">{quantity} g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Sub total</span>
                  <span className="font-semibold text-white">₹{subTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Platform fee (0.5%)</span>
                  <span className="font-semibold text-white">-₹{platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#3E3E3E] pt-3 text-[14px] leading-[21px] font-semibold">
                  <span className="text-white">You&apos;ll Receive</span>
                  <span className="text-[#F8CF59]">₹{payoutAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </section>

            <section className="mt-2 flex items-center gap-4 rounded-[15px] border border-[#3E3E3E] bg-[#16140F] px-4 py-4">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-[#263938]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M5 10L8 13L15 6" stroke="#6DD6FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="10" cy="10" r="9" stroke="#6DD6FF" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <div className="text-[12px] font-semibold leading-[18px] text-white">Settled in Seconds</div>
                <div className="mt-1 text-[8px] leading-[9px] text-[#9E9E9E]">Payouts hit your account instantly via IMPS / UPI.</div>
              </div>
            </section>
          </div>

          <div className="mt-1 shrink-0">
            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => {
                  dispatch({ type: 'SET_SELL_STATE', payload: { amount: subTotal } });
                  navigate(Routes.SELL_3, { state: { backgroundLocation } });
                }}
                whileTap={{ scale: 0.98, transition: SpringConfigs.buttonPress }}
                className="h-10 w-full rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-medium leading-[19px] text-black"
              >
                Confirm Sale →
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function Sell3() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  const amount = state.sellState.amount || 14796;
  const platformFee = Math.round(amount * 0.005);
  const payoutAmount = amount - platformFee;
  const [selectedMethod, setSelectedMethod] = useState<'bank' | 'upi'>('bank');

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

            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Pay Out</h1>

            <div className="absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#3B3935] text-[#15EE01]">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StepRail label="Amount" active />
            <StepRail label="Review" active />
            <StepRail label="Pay" active />
          </div>

          <div className="mt-2 pb-1">
            <section className="flex items-center justify-between rounded-[20px] border border-[#2E2E2E] bg-[#201B0F] px-5 py-4">
              <div>
                <div className="text-[12px] font-medium leading-[18px] text-[#7E7E7E]">YOU&apos;LL RECEIVE</div>
                <div className="mt-1 text-[32px] font-bold leading-[48px] text-[#F8CF59]">₹{payoutAmount.toLocaleString('en-IN')}</div>
              </div>
              <div className="flex h-[30px] items-center rounded-[30px] bg-[#1A301E] px-4 text-[12px] font-semibold leading-[18px] text-[#15EE01]">
                Instant
              </div>
            </section>

            <div className="mt-4 text-[12px] font-medium leading-[18px] text-[#7E7E7E]">PAYOUT DESTINATION</div>

            <div className="mt-2 space-y-3">
              <button
                type="button"
                onClick={() => setSelectedMethod('bank')}
                className={`flex h-[60px] w-full items-center rounded-[20px] border bg-[#201B0F] px-4 ${selectedMethod === 'bank' ? 'border-[#F8CF59]' : 'border-[#2E2E2E]'}`}
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[linear-gradient(142.88deg,#FBCB43_16.1%,#DD9A00_70.59%)] text-[#000000]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="2" y="6" width="20" height="4" rx="1" fill="currentColor" />
                    <path d="M4 10V20H20V10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 2L2 6V8H22V6L12 2Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="ml-4 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px] font-medium leading-[21px] text-white">HDFC BANK ** 4421</span>
                    <span className="rounded-[30px] bg-[#263938] px-2 py-[1px] text-[6px] font-semibold leading-[9px] text-[#6DD6FF]">Default</span>
                  </div>
                  <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">Savings · IMPS Instant</div>
                </div>
                <div className="grid h-5 w-5 place-items-center">
                  {selectedMethod === 'bank' ? (
                    <div className="h-5 w-5 rounded-full bg-[linear-gradient(142.88deg,#FBCB43_16.1%,#DD9A00_70.59%)] grid place-items-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M3 6L5 8L9 4" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-[#3E3E3E] bg-[#201B0F]" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedMethod('upi')}
                className={`flex h-[60px] w-full items-center rounded-[20px] border bg-[#201B0F] px-4 ${selectedMethod === 'upi' ? 'border-[#F8CF59]' : 'border-[#2E2E2E]'}`}
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2A2923]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="7" y="3" width="10" height="18" rx="3" stroke="#9E9E9E" strokeWidth="1.8" />
                    <circle cx="12" cy="17" r="1.5" fill="#9E9E9E" />
                  </svg>
                </div>
                <div className="ml-4 flex-1 text-left">
                  <div className="text-[14px] font-medium leading-[21px] text-white">hari@oksbi</div>
                  <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">UPI · Instant Credit</div>
                </div>
                <div className="grid h-5 w-5 place-items-center">
                  {selectedMethod === 'upi' ? (
                    <div className="h-5 w-5 rounded-full bg-[linear-gradient(142.88deg,#FBCB43_16.1%,#DD9A00_70.59%)] grid place-items-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path d="M3 6L5 8L9 4" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-5 w-5 rounded-full border border-[#3E3E3E] bg-[#201B0F]" />
                  )}
                </div>
              </button>

              <button
                type="button"
                className="flex h-[60px] w-full items-center rounded-[20px] border border-[#2E2E2E] bg-[#201B0F] px-4"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#2A2923]">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 5V19M5 12H19" stroke="#9E9E9E" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="ml-4 text-left">
                  <div className="text-[14px] font-medium leading-[21px] text-white">Add new account</div>
                  <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">Bank or UPI</div>
                </div>
              </button>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-[40px] border border-[#2E2E2E] bg-[#201B0F] px-3 py-2 text-[10px] leading-[15px] text-[#7E7E7E]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="11" width="16" height="10" rx="2" stroke="#15EE01" strokeWidth="1.5" />
                <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke="#15EE01" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Verified beneficiary · Encrypted with 256-bit SSL</span>
            </div>
          </div>

          <div className="mt-1 shrink-0">
            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => {
                  dispatch({ type: 'SET_SELL_STATE', payload: { bankAccount: selectedMethod === 'bank' ? 'HDFC-4421' : 'UPI-oksbi' } });
                  navigate(Routes.SELL_4, { state: { backgroundLocation } });
                }}
                whileTap={{ scale: 0.98, transition: SpringConfigs.buttonPress }}
                className="h-10 w-full rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-medium leading-[19px] text-black"
              >
                Receive ₹{payoutAmount.toLocaleString('en-IN')} →
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function Sell4() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useGoldFlow();
  const amount = state.sellState.amount || 0;
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  useEffect(() => {
    const timer = setTimeout(() => navigate(Routes.SELL_5, { replace: true, state: { backgroundLocation } }), AutoAdvanceDelays.SELL_4);
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
            <StepRail label="Review" active />
            <StepRail label="Pay" active />
          </div>

          <div className="flex flex-col items-center justify-center py-12">
            <LoadingScreen text="Processing Sell" />
          </div>
          <div className="pb-1 text-center text-[12px] leading-[18px] text-[#7E7E7E]">Processing your transaction...</div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function Sell5() {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch, state } = useGoldFlow();
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  const amount = state.sellState.amount || 14796;
  const platformFee = Math.round(amount * 0.005);
  const payoutAmount = amount - platformFee;

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
            <StepRail label="Review" active />
            <StepRail label="Pay" active />
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
              <div className="text-[16px] font-semibold text-white">Sell Successful</div>
              <div className="mt-2 text-[12px] leading-[18px] text-[#7E7E7E]">₹{payoutAmount.toLocaleString('en-IN')} credited to your bank</div>
            </section>

            <section className="mt-4 rounded-[30px] border border-[#444135] bg-[#191812] px-6 py-6">
              <div className="space-y-4 text-[14px] leading-[18px] text-[#8D8B87]">
                <div className="flex items-center justify-between">
                  <span>Sell Amount</span>
                  <span className="font-semibold text-white">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Platform fee (0.5%)</span>
                  <span className="font-semibold text-white">-₹{platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Amount Received</span>
                  <span className="font-semibold text-white">₹{payoutAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Order ID</span>
                  <span className="font-semibold text-white">#AUR-8421907</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#33312A] pt-4 text-[18px] font-semibold">
                  <span className="text-white">Status</span>
                  <span className="text-[#15EE01]">Completed</span>
                </div>
              </div>
            </section>

            <div className="mt-4 flex items-center gap-4 rounded-[20px] border border-[#3D3A2F] bg-[#211D12] px-4 py-4">
              <div className="grid h-[54px] w-[54px] place-items-center rounded-full bg-[#263938]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="#6DD6FF" strokeWidth="2" />
                  <path d="M8 12L11 15L16 9" stroke="#6DD6FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <div className="text-[16px] font-semibold text-white">Instant Settlement</div>
                <div className="mt-1 text-[12px] leading-[14px] text-[#8D8B87]">Amount credited to your account via IMPS. Reference: IMPS-23849102</div>
              </div>
            </div>
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
                onClick={() => navigate(Routes.SELL_1, { replace: true, state: { backgroundLocation } })}
                className="h-[56px] rounded-[28px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-semibold text-black"
              >
                Sell more →
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
