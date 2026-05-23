import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Routes, AutoAdvanceDelays } from '../lib/routes';
import { useGoldFlow } from '../store/GoldFlowContext';
import { TopBar } from '../components/TopBar';
import { StepIndicator } from '../components/StepIndicator';
import { GoldTypeChip } from '../components/GoldTypeChip';
import { AmountSelector } from '../components/AmountSelector';
import { BrandCard } from '../components/BrandCard';
import { LoadingScreen } from '../components/LoadingScreen';
import { mockData } from '../data/mockData';
import { transitions, variants, createGoldPulse, Easings, Duration, SpringConfigs } from '../lib/animations';
import { ArrowLeft, Coins, Lock, ShieldCheck, Sparkles } from 'lucide-react';
import { fetchLiveGoldRateSnapshot, getAugmontUser, createAugmontBuyOrder } from '../api/augmontApi';
import { getUserProfile } from '../api/authApi';
import { buildMobileDobUniqueId } from '../lib/uniqueId';
import { useToast } from '@/hooks/use-toast';
import { validateToken } from '../api/authApi';

const NON_KYC_LIMIT = 5000;

export function Buy1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const { toast } = useToast();
  const activeGoldPulse = createGoldPulse();
  const liveRate = state.buyState.rate || 0;
  const [rateLoading, setRateLoading] = useState(!liveRate);
  const [mode, setMode] = useState<'amount' | 'weight'>('amount');
  const [amountInput, setAmountInput] = useState(String(state.buyState.amount ?? 1000));
  const [weightInput, setWeightInput] = useState('1');
  const [panVerified, setPanVerified] = useState(false);
  const [showKycModal, setShowKycModal] = useState(false);

  useEffect(() => {
    validateToken().catch(() => {});
    const profile = getUserProfile() || {};
    setPanVerified(Boolean(profile?.panVerified));
  }, []);

  const parsedAmount = parseFloat(amountInput);
  const parsedWeight = parseFloat(weightInput);
  const pricePerGram = liveRate || 0;
  const amount = mode === 'weight' ? (pricePerGram > 0 ? Math.round(parsedWeight * pricePerGram) : 0) : (isNaN(parsedAmount) ? 0 : parsedAmount);
  const needsKyc = amount > NON_KYC_LIMIT && !panVerified;

  const locationState = location.state as { backgroundLocation?: typeof location; metalType?: string } | null;
  const backgroundLocation = locationState?.backgroundLocation;
  const metalType = locationState?.metalType || state.buyState.metalType || 'gold';

  const isGold = metalType === 'gold';

  useEffect(() => {
    const profile = getUserProfile() || {};
    const augmontUser = getAugmontUser() || {};
    const mobileNumber = String(profile?.mobileNumber || augmontUser?.mobileNumber || '').replace(/\D/g, '').slice(-10);
    const dateOfBirth = String(profile?.dateOfBirth || profile?.dob || augmontUser?.dateOfBirth || '');
    const uniqueId = augmontUser?.uniqueId || profile?.uniqueId || profile?.augmontUniqueId || buildMobileDobUniqueId({ mobileNumber, dateOfBirth }) || '';

    dispatch({ type: 'SET_BUY_STATE', payload: { uniqueId, rate: 0, blockId: '', metalType } });

    setRateLoading(true);
    fetchLiveGoldRateSnapshot({ force: true }).then((res) => {
      if (res?.ok) {
        const buyPrice = metalType === 'silver' ? (res.snapshot?.silver?.buyPrice || 0) : (res.snapshot?.buyPrice || 0);
        if (buyPrice > 0) {
          dispatch({ type: 'SET_BUY_STATE', payload: { rate: buyPrice, blockId: res.blockId || res.snapshot.blockId || '' } });
        }
      }
    }).finally(() => setRateLoading(false));
  }, [metalType]);

  const approxGrams = pricePerGram > 0 ? (amount / pricePerGram).toFixed(4) : '0';
  const payableNow = amount + Math.round(amount * 0.03);

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
              onClick={() => navigate(backgroundLocation?.pathname || Routes.DASHBOARD, { replace: true })}
              aria-label="Back"
              className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-white"
            >
              <ArrowLeft size={24} strokeWidth={1.8} />
            </button>

            <h1 className="text-[16px] font-semibold leading-[24px] text-white">{isGold ? 'Buy Gold' : 'Buy Silver'}</h1>

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
                  <div className="text-[12px] leading-[18px] text-[#A1A1A1]">{isGold ? '24K · 999.9 Pure' : '99.9% Pure Silver'}</div>
                  <motion.div
                    animate={activeGoldPulse.animate}
                    transition={activeGoldPulse.transition}
                    className="mt-1 text-[24px] font-semibold leading-[36px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent"
                  >
                    {rateLoading ? 'Loading...' : pricePerGram > 0 ? `₹${pricePerGram.toLocaleString('en-IN')}/g` : 'Unavailable'}
                  </motion.div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] leading-[15px] text-[#0EA300]">
                    <Sparkles size={12} strokeWidth={1.9} />
                    <span>{rateLoading ? 'Fetching live rate...' : 'Live · from Augmont'}</span>
                  </div>
                </div>

                <div className="mt-1 grid h-[60px] w-[60px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE27A_0%,#F5BF31_34%,#C98900_100%)] shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08)]">
                  <div className="grid h-[52px] w-[52px] place-items-center rounded-full border border-[#E8B438]/40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(180deg,#F8D862_0%,#D59B12_100%)] text-[12px] font-semibold tracking-[0.08em] text-[#C89111]">
                    KARATLY
                  </div>
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
                  Buy Amount (₹)
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

            {needsKyc && (
              <div className="mt-2 rounded-[10px] border border-[#E8B438]/30 bg-[#E8B438]/10 px-4 py-3 flex items-start justify-between gap-3">
                <span className="text-[10px] leading-[14px] text-[#F7CD57]/80">⚠ Non-KYC users are limited to ₹5,000 per financial year. Complete KYC to unlock higher limits.</span>
                <button type="button" onClick={() => navigate(Routes.KYC_VERIFICATION)}
                  className="shrink-0 rounded-[6px] bg-[#E8B438]/20 px-3 py-1 text-[10px] font-semibold text-[#F7CD57] hover:bg-[#E8B438]/30 transition">Complete KYC →</button>
              </div>
            )}
            <section className="mt-2 rounded-[20px] border border-[#4E4E4E] bg-[#21211A] px-4 py-3">
              <div className="text-center text-[12px] font-medium leading-[18px] text-[#7E7E7E]">YOU PAY</div>
              <div className="mx-auto mt-4 flex h-[40px] w-[200px] items-center justify-center rounded-[20px] border border-[#5E5E5E] bg-[#37372E]">
                {mode === 'weight' ? (
                  <input type="number" inputMode="decimal" step="0.0001" min="0" value={weightInput}
                    onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setWeightInput(v); }}
                    className="w-[100px] bg-transparent text-right text-[24px] font-semibold leading-[36px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent outline-none" />
                ) : (
                  <input type="number" inputMode="numeric" min="0" step="100" value={amountInput}
                    onChange={(e) => { const v = e.target.value; if (/^\d*\.?\d*$/.test(v)) setAmountInput(v); }}
                    className="w-[130px] bg-transparent text-right text-[24px] font-semibold leading-[36px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent outline-none" />
                )}
                <span className="ml-1 text-[24px] font-semibold leading-[36px] text-[#BCBCBC]">{mode === 'weight' ? 'g' : ''}</span>
              </div>
              <div className="mt-4 text-center text-[10px] leading-[15px] text-[#7E7E7E]">
                {mode === 'weight' ? `≈ ₹${amount.toLocaleString('en-IN')}` : `≈ ${approxGrams} g`} {rateLoading ? '(loading rate...)' : ''}
              </div>

              <div className="mt-6 grid grid-cols-4 gap-2">
                {(mode === 'weight' ? [0.5, 1, 2, 5] : [500, 1000, 5000, 10000]).map((preset) => (
                  <button key={preset} type="button"
                    onClick={() => {
                      if (mode === 'weight') setWeightInput(String(preset));
                      else setAmountInput(String(preset));
                    }}
                    className={`h-[30px] rounded-[20px] border px-3 text-[12px] leading-[18px] ${(mode === 'weight' ? weightInput === String(preset) : amountInput === String(preset)) ? 'border-[#5E5E5E] bg-[#262521] text-white' : 'border-[#4E4E4E] bg-[#262521] text-white'}`}
                  >
                    {mode === 'weight' ? `${preset}g` : `₹${preset}`}
                  </button>
                ))}
              </div>
            </section>

            <div className="mt-2 grid grid-cols-3 gap-3">
              <FeatureChip icon={<ShieldCheck size={16} strokeWidth={2} />} label="Insured 100%" />
              <FeatureChip icon={<Lock size={16} strokeWidth={2} />} label="BIS Vault" />
              <FeatureChip icon={<Coins size={16} strokeWidth={2} />} label="999.9 Pure" />
            </div>
          </div>

          <div className="mt-1 shrink-0">
            <div className="relative rounded-[20px] border border-[#2E2E2E] bg-[#19160F] px-5 py-4">
              <div className="text-[10px] leading-[15px] text-[#9E9E9E]">Payable now (incl. GST)</div>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px] font-semibold leading-[24px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                ₹ {payableNow.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => {
                  dispatch({ type: 'SET_BUY_STATE', payload: { amount } });
                  if (needsKyc) { setShowKycModal(true); return; }
                  navigate(Routes.BUY_2, { state: { backgroundLocation } });
                }}
                disabled={rateLoading || pricePerGram <= 0}
                whileTap={{ scale: 0.98, transition: SpringConfigs.buttonPress }}
                className="h-10 w-full rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-medium leading-[19px] text-black disabled:opacity-50"
              >
                {rateLoading ? 'Loading rate...' : pricePerGram <= 0 ? 'Rate unavailable' : 'Continue →'}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>

      {showKycModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(0,0,0,0.6)] px-6 backdrop-blur-[6px]"
          onClick={() => setShowKycModal(false)}>
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-[340px] rounded-[20px] border border-[#E8B438] bg-[#1A1710] px-6 pb-6 pt-8 text-center shadow-[0_0_40px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto grid h-[72px] w-[72px] place-items-center rounded-full bg-[linear-gradient(180deg,#FBBF42_0%,#E59700_100%)]">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M12 3L4 7V12C4 17.3 7.6 22 12 23C16.4 22 20 17.3 20 12V7L12 3Z" fill="black" />
                <path d="M9 12L11.5 14.5L16 10" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="mt-4 text-[18px] font-bold text-white">KYC Verification Required</h2>
            <p className="mt-2 text-[12px] leading-[16px] text-[#9E9E9E]">
              Purchases above ₹5,000 require KYC verification. Complete your KYC to unlock higher limits up to ₹5,00,000.
            </p>
            <div className="mt-6 space-y-3">
              <button type="button" onClick={() => { setShowKycModal(false); navigate(Routes.KYC_VERIFICATION); }}
                className="h-11 w-full rounded-[12px] bg-[linear-gradient(90deg,#FED75D_0%,#ECB000_50.48%,#D48D00_100%)] text-[14px] font-bold text-black">
                Complete KYC →
              </button>
              <button type="button" onClick={() => setShowKycModal(false)}
                className="h-11 w-full rounded-[12px] border border-[#4E4E4E] bg-transparent text-[12px] text-[#9E9E9E]">
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
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

export function Buy2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const amount = state.buyState.amount ?? 1000;
  const pricePerGram = state.buyState.rate || 0;
  const preTax = amount / 1.03;
  const gstAmt = amount - preTax;
  const quantity = pricePerGram > 0 ? (preTax / pricePerGram).toFixed(4) : '0';
  const total = amount;

  useEffect(() => {
    dispatch({ type: 'SET_BUY_STATE', payload: { preTax, gst: gstAmt, grams: Number(quantity) } });
  }, [preTax, gstAmt, quantity, dispatch]);

  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

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
              onClick={() => navigate(backgroundLocation?.pathname || Routes.DASHBOARD, { replace: true })}
              aria-label="Back"
              className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-white"
            >
              <ArrowLeft size={24} strokeWidth={1.8} />
            </button>

            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Review Order</h1>

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
            <section className="mt-2 rounded-[30px] border border-[#3E3522] bg-[#302715] px-6 py-6 text-center">
              <div className="mx-auto mb-6 grid h-[90px] w-[90px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE27A_0%,#F5BF31_34%,#C98900_100%)] shadow-[inset_0_0_0_4px_rgba(255,255,255,0.08)]">
                <div className="grid h-[74px] w-[74px] place-items-center rounded-full border border-[#E8B438]/40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_35%),linear-gradient(180deg,#F8D862_0%,#D59B12_100%)] text-[14px] font-semibold tracking-[0.08em] text-[#C89111]">
                  KARATLY
                </div>
              </div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#8D8B87]">YOU&apos;RE BUYING</div>
              <div className="mt-3 text-[52px] font-semibold leading-none text-[#F7CD57]">{quantity} g</div>
              <div className="mt-3 text-[16px] font-medium text-[#8D8B87]">{state.buyState.type || '24K'} · 999.9 Pure Gold</div>
            </section>

            <section className="mt-4 rounded-[30px] border border-[#444135] bg-[#191812] px-6 py-6">
              <div className="space-y-4 text-[14px] text-[#8D8B87]">
                <div className="flex items-center justify-between">
                  <span>Pre-tax amount</span>
                  <span className="font-semibold text-white">₹{preTax.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST (3%)</span>
                  <span className="font-semibold text-white">₹{gstAmt.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Buy rate</span>
                  <span className="font-semibold text-white">{pricePerGram > 0 ? `₹${pricePerGram.toLocaleString('en-IN')}/g` : 'Unavailable'}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#33312A] pt-4 text-[16px] font-semibold">
                  <span className="text-white">You get</span>
                  <span className="text-[#F7CD57]">{quantity} g</span>
                </div>
                <div className="flex items-center justify-between text-[18px] font-semibold">
                  <span className="text-white">Total paid</span>
                  <span className="text-[#F7CD57]">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </section>

            <section className="mt-4 flex items-center gap-4 rounded-[20px] border border-[#3D3A2F] bg-[#211D12] px-4 py-4">
              <div className="grid h-[54px] w-[54px] place-items-center rounded-full bg-[#4A3C12] text-[#F7CD57]">
                <ShieldCheck size={24} strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-white">Stored in BIS-certified vault</div>
                <div className="mt-1 text-[12px] leading-[14px] text-[#8D8B87]">Your gold is 100% insured &amp; redeemable as coins or cash anytime.</div>
              </div>
            </section>
          </div>

          <div className="mt-2 shrink-0">
            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => navigate(Routes.BUY_3, { state: { backgroundLocation } })}
                whileTap={{ scale: 0.98, transition: SpringConfigs.buttonPress }}
                className="h-10 w-full rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-medium leading-[19px] text-black"
              >
                Proceed to Pay →
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function Buy3() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useGoldFlow();
  const amount = state.buyState.amount ?? 1000;
  const total = amount;
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;
  const paymentMethods: Array<{ title: string; subtitle: string; active: boolean; badge?: string; icon: string }> = [
    { title: 'UPI', subtitle: 'Pay via any UPI app', active: true, badge: 'Instant', icon: 'circum:mobile-3' },
    { title: 'Credit / Debit Card', subtitle: 'Visa, Mastercard, Rupay', active: false, icon: 'majesticons:creditcard-line' },
    { title: 'Netbanking', subtitle: 'All major banks', active: false, icon: 'ri:bank-line' },
    { title: 'Karatly Wallet', subtitle: 'Balance ₹2,480.00', active: false, badge: '1% Cashback', icon: 'solar:wallet-outline' },
  ];

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
              onClick={() => navigate(backgroundLocation?.pathname || Routes.DASHBOARD, { replace: true })}
              aria-label="Back"
              className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-white"
            >
              <ArrowLeft size={24} strokeWidth={1.8} />
            </button>

            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Payment</h1>

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
            <section className="mt-2 rounded-[20px] border border-[#3E3522] bg-[#201B0F] px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[12px] font-medium leading-[18px] text-[#7E7E7E]">TOTAL PAYABLE (incl. GST)</div>
                  <div className="mt-1 text-[32px] font-bold leading-[48px] text-[#F8CF59]">₹{total.toLocaleString('en-IN')}</div>
                </div>
                <div className="rounded-[30px] bg-[#1A301E] px-5 py-2 text-[12px] font-semibold text-[#15EE01]">Secure</div>
              </div>
            </section>

            <div className="mt-4 text-[12px] font-medium uppercase tracking-[0.08em] text-[#7E7E7E]">Choose Payment Method</div>

            <div className="mt-3 space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.title}
                  type="button"
                  className={`flex h-[50px] items-center rounded-[40px] border bg-[#201B0F] px-4 ${method.active ? 'border-[#F8CF59]' : 'border-[#2E2E2E]'}`}
                >
                  <div className="grid h-[30px] w-[30px] place-items-center rounded-full bg-[linear-gradient(142.88deg,#FBCB43_16.1%,#DD9A00_70.59%)] text-[#000000]">
                    <span className="text-[14px]">◉</span>
                  </div>
                  <div className="ml-4 text-left">
                    <div className="flex items-center gap-2 text-[14px] font-semibold text-white">
                      <span>{method.title}</span>
                      {method.badge && <span className="rounded-full bg-[#263938] px-2 py-[2px] text-[6px] font-semibold text-[#6DD6FF]">{method.badge}</span>}
                    </div>
                    <div className="text-[10px] leading-[15px] text-[#7E7E7E]">{method.subtitle}</div>
                  </div>
                  <div className="ml-auto grid h-[20px] w-[20px] place-items-center rounded-full border border-[#3E3E3E] bg-[#201B0F]">
                    {method.active ? <div className="h-3 w-3 rounded-full bg-[#F8CF59]" /> : null}
                  </div>
                </button>
              ))}

              <div className="flex items-center gap-2 rounded-[20px] border border-[#2E2E2E] bg-[#201B0F] px-4 py-2 text-[10px] text-[#7E7E7E]">
                <span className="text-[#15EE01]">🔒</span>
                <span>Encrypted with 256-bit SSL · PCI DSS compliant</span>
              </div>
            </div>
          </div>

          <div className="mt-2 shrink-0">
            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => navigate(Routes.BUY_4, { state: { backgroundLocation } })}
                whileTap={{ scale: 0.98, transition: SpringConfigs.buttonPress }}
                className="h-10 w-full rounded-[50px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-medium leading-[19px] text-black"
              >
                Pay ₹{total.toLocaleString('en-IN')} →
              </motion.button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function Buy4() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const { toast } = useToast();
  const amount = state.buyState.amount ?? 0;
  const rate = state.buyState.rate || 0;
  const blockId = state.buyState.blockId || '';
  const metalType = state.buyState.metalType || 'gold';
  const profile = getUserProfile() || {};
  const augmontUser = getAugmontUser() || {};
  const mobileNumber = String(profile?.mobileNumber || augmontUser?.mobileNumber || '').replace(/\D/g, '').slice(-10);
  const dateOfBirth = String(profile?.dateOfBirth || profile?.dob || augmontUser?.dateOfBirth || '');
  const uniqueId = state.buyState.uniqueId || augmontUser?.uniqueId || profile?.uniqueId || profile?.augmontUniqueId || buildMobileDobUniqueId({ mobileNumber, dateOfBirth }) || '';
  const [statusMsg, setStatusMsg] = useState('Validating session...');
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  useEffect(() => {
    let cancelled = false;
    const placeOrder = async () => {
      const missing = [];
      if (!amount) missing.push('amount');
      if (!rate) missing.push('rate');
      if (!uniqueId) missing.push('uniqueId');
      if (missing.length > 0) {
        toast({ variant: 'destructive', title: 'Error', description: `Missing: ${missing.join(', ')}. Please start again.` });
        navigate(backgroundLocation?.pathname || Routes.DASHBOARD, { replace: true });
        return;
      }

      setStatusMsg('Fetching live rate...');
      const rateRes = await fetchLiveGoldRateSnapshot({ force: true });
      if (cancelled) return;
      const liveRate = metalType === 'silver'
        ? (rateRes?.snapshot?.silver?.buyPrice || rateRes?.snapshot?.silver?.currentPrice || 0)
        : (rateRes?.snapshot?.buyPrice || 0);
      if (!rateRes?.ok || !liveRate) {
        toast({ variant: 'destructive', title: 'Rate Error', description: rateRes?.message || 'Failed to fetch live rate.' });
        navigate(Routes.BUY_1, { replace: true, state: { backgroundLocation } });
        return;
      }
      const liveBlockId = rateRes.blockId || rateRes.snapshot.blockId || '';
      dispatch({ type: 'SET_BUY_STATE', payload: { rate: liveRate, blockId: liveBlockId } });

      setStatusMsg('Placing buy order...');
      const merchantTransactionId = `KTL-BUY-${Date.now()}`;
      const res = await createAugmontBuyOrder({
        request: {
          merchantTransactionId,
          uniqueId,
          lockPrice: liveRate.toFixed(2),
          metalType,
          amount: amount.toFixed(2),
          modeOfPayment: 'wallet',
          blockId: liveBlockId
        }
      });

      if (cancelled) return;

      if (res?.ok) {
        const orderResult = {
          transactionId: (res?.order as Record<string, unknown>)?.transactionId as string || merchantTransactionId,
          merchantTransactionId,
        };
        dispatch({ type: 'SET_BUY_STATE', payload: orderResult });
        navigate(Routes.BUY_5, { replace: true, state: { backgroundLocation } });
      } else {
        toast({ variant: 'destructive', title: 'Order Failed', description: res?.message || 'Unable to place buy order.' });
        navigate(backgroundLocation?.pathname || Routes.DASHBOARD, { replace: true });
      }
    };

    placeOrder();
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
            <button
              type="button"
              onClick={() => navigate(backgroundLocation?.pathname || Routes.DASHBOARD, { replace: true })}
              aria-label="Back"
              className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-white"
            >
              <ArrowLeft size={24} strokeWidth={1.8} />
            </button>

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
            <LoadingScreen text={statusMsg} />
          </div>

          <div className="pb-1 text-center text-[12px] leading-[18px] text-[#7E7E7E]">{statusMsg}</div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function Buy5() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const amount = state.buyState.amount ?? 0;
  const rate = state.buyState.rate || 0;
  const grams = state.buyState.grams || 0;
  const transactionId = state.buyState.transactionId || '';
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

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
              onClick={() => navigate(backgroundLocation?.pathname || Routes.DASHBOARD, { replace: true })}
              aria-label="Back"
              className="absolute left-0 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center text-white"
            >
              <ArrowLeft size={24} strokeWidth={1.8} />
            </button>

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
            <section className="mt-2 rounded-[30px] border border-[#3E3522] bg-[#302715] px-6 py-6 text-center">
              <div className="mx-auto mb-6 grid h-[130px] w-[130px] place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#FFE27A_0%,#F5BF31_34%,#C98900_100%)] shadow-[0_0_40px_rgba(247,205,87,0.18)]">
                <div className="grid h-[100px] w-[100px] place-items-center rounded-full bg-[#F7CD57] text-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.15)]">
                  <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>
              <div className="text-[16px] font-semibold text-white">Payment Successful</div>
              <div className="mt-2 text-[12px] leading-[18px] text-[#7E7E7E]">{grams ? `${grams.toFixed(4)}g` : ''} of 24K gold added to your vault</div>
            </section>

            <section className="mt-4 rounded-[30px] border border-[#444135] bg-[#191812] px-6 py-6">
              <div className="space-y-4 text-[14px] text-[#8D8B87]">
                <div className="flex items-center justify-between">
                  <span>Amount paid</span>
                  <span className="font-semibold text-white">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gold Purchased</span>
                  <span className="font-semibold text-white">{grams ? `${grams.toFixed(4)} g` : '---'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rate</span>
                  <span className="font-semibold text-white">{rate > 0 ? `₹${rate.toLocaleString('en-IN')}/g` : '---'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Order ID</span>
                  <span className="font-semibold text-white">#{transactionId ? transactionId.slice(0, 12) : '---'}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#33312A] pt-4 text-[18px] font-semibold">
                  <span className="text-white">Status</span>
                  <span className="text-[#15EE01]">Completed</span>
                </div>
              </div>
            </section>

            <div className="mt-4 flex items-center gap-4 rounded-[20px] border border-[#3D3A2F] bg-[#211D12] px-4 py-4">
              <div className="grid h-[54px] w-[54px] place-items-center rounded-full bg-[#4A3C12] text-[#F7CD57]">
                <ShieldCheck size={24} strokeWidth={1.8} />
              </div>
              <div>
                <div className="text-[16px] font-semibold text-white">Stored in BIS-certified vault</div>
                <div className="mt-1 text-[12px] leading-[14px] text-[#8D8B87]">Your gold is 100% insured &amp; redeemable as coins or cash anytime.</div>
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
                onClick={() => navigate(Routes.BUY_1, { replace: true, state: { backgroundLocation } })}
                className="h-[56px] rounded-[28px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[16px] font-semibold text-black"
              >
                Buy more →
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
