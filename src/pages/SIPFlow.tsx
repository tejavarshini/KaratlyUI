import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Routes } from '../lib/routes';
import { useGoldFlow } from '../store/GoldFlowContext';
import { LoadingScreen } from '../components/LoadingScreen';
import { transitions, Easings, Duration, SpringConfigs } from '../lib/animations';
import { ArrowLeft, ShieldCheck, Sparkles, Coins, Loader2 } from 'lucide-react';
import { fetchAugmontSipRates, fetchLiveGoldRateSnapshot, createAugmontBuyOrder, getAugmontUser } from '../api/augmontApi';
import { getUserProfile } from '../api/authApi';
import { buildMobileDobUniqueId } from '../lib/uniqueId';
import { useToast } from '@/hooks/use-toast';

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

export function SIP1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const locationState = location.state as { backgroundLocation?: typeof location; metalType?: string } | null;
  const backgroundLocation = locationState?.backgroundLocation;
  const metalType = state.sipState.metalType || locationState?.metalType || 'gold';
  const amount = state.sipState.amount ?? 1000;
  const [sipRate, setSipRate] = useState(state.sipState.rate || 0);
  const [rateLoading, setRateLoading] = useState(true);

  const presets = [500, 1000, 2000, 5000];
  const isGold = metalType === 'gold';

  useEffect(() => {
    setRateLoading(true);
    fetchAugmontSipRates().then((res) => {
      if (res?.ok) {
        const rate = isGold ? (res.snapshot?.gold?.buyPrice || 0) : (res.snapshot?.silver?.buyPrice || 0);
        if (rate > 0) {
          setSipRate(rate);
          dispatch({ type: 'SET_SIP_STATE', payload: { rate, metalType } });
        }
      }
    }).finally(() => setRateLoading(false));
  }, [isGold, dispatch]);

  const approxGrams = sipRate > 0 ? (amount / sipRate).toFixed(4) : '0';
  const investmentValue = amount * 12;

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
            <h1 className="text-[16px] font-semibold leading-[24px] text-white">{isGold ? 'Gold SIP' : 'Silver SIP'}</h1>
            <div className="absolute right-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#3B3935] text-[#15EE01]">
              <ShieldCheck size={12} strokeWidth={2.4} />
            </div>
          </header>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <StepRail label="Amount" active />
            <StepRail label="Plan" />
            <StepRail label="Mandate" />
          </div>

          <div className="mt-2 pb-1">
            <section className="rounded-[10px] border border-[#E8B438] bg-[linear-gradient(244.67deg,#6C5123_0%,#1E2A28_44.59%)] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[12px] leading-[18px] text-[#A1A1A1]">{isGold ? 'GOLD SIP RATE' : 'SILVER SIP RATE'}</div>
                  <motion.div className="mt-1 text-[14px] font-semibold leading-[21px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                    {rateLoading ? 'Loading...' : sipRate > 0 ? `₹${sipRate.toLocaleString('en-IN')}/g` : 'Unavailable'}
                  </motion.div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] leading-[15px] text-[#0EA300]">
                    <Sparkles size={12} strokeWidth={1.9} />
                    <span>{rateLoading ? 'Fetching SIP rate...' : 'SIP Rate · Augmont'}</span>
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
              <div className="mx-auto mt-4 flex h-[40px] w-[200px] items-center justify-center rounded-[20px] border border-[#5E5E5E] bg-[#37372E]">
                <input
                  type="number"
                  inputMode="numeric"
                  min="100"
                  step="100"
                  value={amount}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v) && v >= 0) dispatch({ type: 'SET_SIP_STATE', payload: { amount: v } });
                  }}
                  className="w-[160px] bg-transparent text-center text-[24px] font-semibold leading-[36px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent outline-none"
                />
              </div>
              <div className="mt-2 text-center text-[10px] leading-[15px] text-[#7E7E7E]">≈ {approxGrams} g/cycle · ₹{investmentValue.toLocaleString('en-IN')}/yr</div>

              <div className="mt-3 grid grid-cols-4 gap-2">
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
              <FeatureChip icon={<Coins size={16} strokeWidth={2} />} label={isGold ? '24K Gold' : '99.9% Silver'} />
              <FeatureChip icon={<Sparkles size={16} strokeWidth={2} />} label="No Lock-in" />
            </div>
          </div>

          <div className="mt-1 shrink-0">
            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => navigate(Routes.SIP_2, { state: { backgroundLocation } })}
                disabled={rateLoading || sipRate <= 0 || amount < 100}
                whileTap={{ scale: 0.98, transition: SpringConfigs.buttonPress }}
                className="h-10 w-full rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-medium leading-[19px] text-black disabled:opacity-50"
              >
                {rateLoading ? 'Loading SIP rate...' : sipRate <= 0 ? 'Rate unavailable' : 'Continue →'}
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

  const amount = state.sipState.amount ?? 1000;
  const frequencies = ['Monthly', 'Weekly', 'Quarterly'];
  const frequency = state.sipState.frequency || 'Monthly';
  const debitDate = state.sipState.date || 5;
  const cycles = state.sipState.cycles || 12;

  const cycleMultiplier = frequency === 'Weekly' ? 52 : frequency === 'Quarterly' ? 4 : 12;
  const totalInvested = amount * cycles;

  useEffect(() => {
    if (!state.sipState.frequency) dispatch({ type: 'SET_SIP_STATE', payload: { frequency: 'Monthly', date: 5, cycles: 12 } });
  }, []);

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
            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Plan Details</h1>
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
              <div className="text-[12px] font-medium leading-[18px] text-[#7E7E7E]">TOTAL INVESTMENT</div>
              <div className="mt-3 text-[32px] font-semibold leading-[48px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                ₹{totalInvested.toLocaleString('en-IN')}
              </div>
              <div className="mt-1 text-[12px] font-medium leading-[18px] text-[#7E7E7E]">₹{amount.toLocaleString('en-IN')}/cycle · {cycles} cycles</div>
            </section>

            <section className="mt-2 rounded-[20px] border border-[#3E3E3E] bg-[#1A1912] px-6 py-5">
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] leading-[12px] text-[#7E7E7E]">FREQUENCY</div>
                  <div className="mt-2 flex gap-2">
                    {frequencies.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => dispatch({ type: 'SET_SIP_STATE', payload: { frequency: f } })}
                        className={`h-[30px] flex-1 rounded-[20px] border text-[12px] leading-[18px] ${frequency === f ? 'border-[#F8CF59] bg-[#302715] text-[#F8CF59]' : 'border-[#3E3E3E] bg-[#0F1416] text-[#7E7E7E]'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] leading-[12px] text-[#7E7E7E]">DEBIT DAY</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {frequency === 'Weekly' ? (
                      ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => dispatch({ type: 'SET_SIP_STATE', payload: { date: i + 1 } })}
                          className={`h-[30px] rounded-[20px] border px-3 text-[12px] leading-[18px] ${debitDate === i + 1 ? 'border-[#F8CF59] bg-[#302715] text-[#F8CF59]' : 'border-[#3E3E3E] bg-[#0F1416] text-[#7E7E7E]'}`}
                        >
                          {d}
                        </button>
                      ))
                    ) : (
                      [1, 5, 10, 15, 20, 25].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => dispatch({ type: 'SET_SIP_STATE', payload: { date: d } })}
                          className={`h-[30px] rounded-[20px] border px-3 text-[12px] leading-[18px] ${debitDate === d ? 'border-[#F8CF59] bg-[#302715] text-[#F8CF59]' : 'border-[#3E3E3E] bg-[#0F1416] text-[#7E7E7E]'}`}
                        >
                          {d}th
                        </button>
                      ))
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] leading-[12px] text-[#7E7E7E]">DURATION</div>
                  <div className="mt-2 flex gap-2">
                    {[3, 6, 12, 24].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => dispatch({ type: 'SET_SIP_STATE', payload: { cycles: c } })}
                        className={`h-[30px] flex-1 rounded-[20px] border text-[12px] leading-[18px] ${cycles === c ? 'border-[#F8CF59] bg-[#302715] text-[#F8CF59]' : 'border-[#3E3E3E] bg-[#0F1416] text-[#7E7E7E]'}`}
                      >
                        {c} {frequency === 'Weekly' ? 'weeks' : frequency === 'Quarterly' ? 'quarters' : 'months'}
                      </button>
                    ))}
                  </div>
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
                Continue →
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

  const amount = state.sipState.amount ?? 1000;
  const sipRate = state.sipState.rate || 0;
  const frequency = state.sipState.frequency || 'Monthly';
  const debitDate = state.sipState.date || 5;
  const cycles = state.sipState.cycles || 12;
  const totalInvested = amount * cycles;
  const estimatedGold = sipRate > 0 ? (totalInvested / sipRate).toFixed(3) : '0';
  const returns = Math.round(totalInvested * 0.12);
  const projectedValue = totalInvested + returns;

  const debitLabel = frequency === 'Weekly'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][(debitDate || 1) - 1] || 'Mon'
    : `${debitDate}th`;

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
            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Review & Confirm</h1>
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
            <section className="rounded-[20px] bg-[#302916] px-6 py-6 text-center">
              <div className="text-[12px] font-medium leading-[18px] text-[#7E7E7E]">PROJECTED VALUE</div>
              <div className="mt-3 text-[32px] font-semibold leading-[48px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                ₹{projectedValue.toLocaleString('en-IN')}
              </div>
              <div className="mt-1 text-[12px] font-medium leading-[18px] text-[#15EE01]">+₹{returns.toLocaleString('en-IN')} estimated returns</div>
            </section>

            <section className="mt-2 rounded-[20px] border border-[#3E3E3E] bg-[#1A1912] px-6 py-5">
              <div className="space-y-3 text-[12px] leading-[18px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">SIP Rate</span>
                  <span className="font-semibold text-white">{sipRate > 0 ? `₹${sipRate.toLocaleString('en-IN')}/g` : '---'}</span>
                </div>
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
                  <span className="font-semibold text-white">{debitLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Total Cycles</span>
                  <span className="font-semibold text-white">{cycles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Total Invested</span>
                  <span className="font-semibold text-white">₹{totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#7E7E7E]">Est. Gold Accumulated</span>
                  <span className="font-semibold text-white">{estimatedGold}g</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#3E3E3E] pt-3 text-[14px] leading-[21px] font-semibold">
                  <span className="text-white">Projected Value</span>
                  <span className="text-[#F8CF59]">₹{projectedValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
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
  const { state, dispatch } = useGoldFlow();
  const { toast } = useToast();
  const [statusMsg, setStatusMsg] = useState('Setting up SIP mandate...');
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  const amount = state.sipState.amount ?? 0;
  const sipRate = state.sipState.rate || 0;
  const metalType = state.sipState.metalType || 'gold';

  const resolveUniqueId = useCallback(() => {
    const profile = getUserProfile() || {};
    const augmontUser = getAugmontUser() || {};
    const mobileNumber = String(profile?.mobileNumber || augmontUser?.mobileNumber || '').replace(/\D/g, '').slice(-10);
    const dateOfBirth = String(profile?.dateOfBirth || profile?.dob || augmontUser?.dateOfBirth || '');
    return augmontUser?.uniqueId || profile?.uniqueId || profile?.augmontUniqueId || buildMobileDobUniqueId({ mobileNumber, dateOfBirth }) || '';
  }, []);

  useEffect(() => {
    let cancelled = false;
    const registerSip = async () => {
      const uniqueId = state.sipState.uniqueId || resolveUniqueId();
      if (!uniqueId) {
        toast({ variant: 'destructive', title: 'Error', description: 'User session not found. Please login again.' });
        navigate(backgroundLocation?.pathname || Routes.DASHBOARD, { replace: true });
        return;
      }
      dispatch({ type: 'SET_SIP_STATE', payload: { uniqueId } });

      setStatusMsg('Fetching live rate...');
      const rateRes = await fetchLiveGoldRateSnapshot({ force: true });
      if (cancelled) return;
      const liveBuyPrice = metalType === 'silver'
        ? (rateRes?.snapshot?.silver?.buyPrice || rateRes?.snapshot?.silver?.currentPrice || 0)
        : (rateRes?.snapshot?.buyPrice || 0);
      const liveBlockId = rateRes.blockId || rateRes.snapshot.blockId || '';
      if (!rateRes?.ok || !liveBuyPrice) {
        toast({ variant: 'destructive', title: 'Rate Error', description: rateRes?.message || 'Failed to fetch live rate.' });
        navigate(Routes.SIP_1, { replace: true, state: { backgroundLocation } });
        return;
      }

      setStatusMsg('Placing first cycle order...');
      const merchantTransactionId = `KTL-SIP-${Date.now()}`;
      const res = await createAugmontBuyOrder({
        request: {
          merchantTransactionId,
          uniqueId,
          lockPrice: liveBuyPrice.toFixed(2),
          metalType,
          amount: amount.toFixed(2),
          modeOfPayment: 'wallet',
          blockId: liveBlockId,
        }
      });

      if (cancelled) return;

      if (res?.ok) {
        const orderResult = {
          transactionId: (res?.order as Record<string, unknown>)?.transactionId as string || merchantTransactionId,
          merchantTransactionId,
        };
        dispatch({ type: 'SET_SIP_STATE', payload: orderResult });
        navigate(Routes.SIP_5, { replace: true, state: { backgroundLocation } });
      } else {
        toast({ variant: 'destructive', title: 'SIP Registration Failed', description: res?.message || 'Unable to place first cycle order.' });
        navigate(backgroundLocation?.pathname || Routes.DASHBOARD, { replace: true });
      }
    };

    registerSip();
    return () => { cancelled = true; };
  }, []);

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
            <LoadingScreen text={statusMsg} />
          </div>
          <div className="pb-1 text-center text-[12px] leading-[18px] text-[#7E7E7E]">{statusMsg}</div>
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
  const frequency = state.sipState.frequency || 'Monthly';
  const debitDate = state.sipState.date || 5;
  const cycles = state.sipState.cycles || 12;
  const totalInvested = amount * cycles;
  const transactionId = state.sipState.transactionId || '';

  const debitLabel = frequency === 'Weekly'
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][(debitDate || 1) - 1] || 'Mon'
    : `${debitDate}th`;

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
              <div className="mt-2 text-[12px] leading-[18px] text-[#7E7E7E]">Your {frequency.toLowerCase()} SIP of ₹{amount.toLocaleString('en-IN')} is now active</div>
            </section>

            <section className="mt-4 rounded-[30px] border border-[#444135] bg-[#191812] px-6 py-6">
              <div className="space-y-4 text-[14px] leading-[18px] text-[#8D8B87]">
                <div className="flex items-center justify-between">
                  <span>SIP Amount</span>
                  <span className="font-semibold text-white">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Frequency</span>
                  <span className="font-semibold text-white">{frequency}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Debit Day</span>
                  <span className="font-semibold text-white">{debitLabel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Cycles</span>
                  <span className="font-semibold text-white">{cycles}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total Investment</span>
                  <span className="font-semibold text-[#F7CD57]">₹{totalInvested.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Order ID</span>
                  <span className="font-semibold text-white">#{transactionId ? transactionId.slice(0, 12) : '---'}</span>
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
