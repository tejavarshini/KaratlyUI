import React, { useEffect, useState } from 'react';
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

export function Buy1() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
  const activeGoldPulse = createGoldPulse();
  const selectedPurity = (state.buyState.type || '24K') as keyof typeof mockData.goldPrices;
  const amount = state.buyState.amount ?? 1000;
  const pricePerGram = 7421.5;
  const approxGrams = (amount / pricePerGram).toFixed(4);
  const payableNow = amount + Math.round(amount * 0.03);
  const [mode, setMode] = useState<'amount' | 'weight'>('amount');

  useEffect(() => {
    if (!state.buyState.type || !state.buyState.amount) {
      dispatch({ type: 'SET_BUY_STATE', payload: { type: state.buyState.type || '24K', amount: amount || 1000 } });
    }
  }, [amount, dispatch, state.buyState.amount, state.buyState.type]);

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

            <h1 className="text-[16px] font-semibold leading-[24px] text-white">Buy Gold</h1>

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
                  <div className="text-[12px] leading-[18px] text-[#A1A1A1]">24K · 999.9 Pure</div>
                  <motion.div
                    animate={activeGoldPulse.animate}
                    transition={activeGoldPulse.transition}
                    className="mt-1 text-[24px] font-semibold leading-[36px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent"
                  >
                    ₹7,421.5/g
                  </motion.div>
                  <div className="mt-1 flex items-center gap-1 text-[10px] leading-[15px] text-[#0EA300]">
                    <Sparkles size={12} strokeWidth={1.9} />
                    <span>Live · refreshed 2s ago</span>
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

            <section className="mt-2 rounded-[20px] border border-[#4E4E4E] bg-[#21211A] px-4 py-3">
              <div className="text-center text-[12px] font-medium leading-[18px] text-[#7E7E7E]">YOU PAY</div>
              <div className="mx-auto mt-4 flex h-[40px] w-[200px] items-center justify-center rounded-[20px] border border-[#5E5E5E] bg-[#37372E] text-[24px] font-semibold leading-[36px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                ₹ {amount.toLocaleString('en-IN')}
              </div>
              <div className="mt-4 text-center text-[10px] leading-[15px] text-[#7E7E7E]">≈ {approxGrams} g</div>

              <div className="mt-6 grid grid-cols-4 gap-2">
                {[500, 1000, 5000, 10000].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_BUY_STATE', payload: { amount: preset } })}
                    className={`h-[30px] rounded-[20px] border px-3 text-[12px] leading-[18px] ${amount === preset ? 'border-[#5E5E5E] bg-[#262521] text-white' : 'border-[#4E4E4E] bg-[#262521] text-white'}`}
                  >
                    ₹{preset}
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
              <div className="text-[10px] leading-[15px] text-[#9E9E9E]">Payable now</div>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-[16px] font-semibold leading-[24px] bg-[linear-gradient(180deg,#F7CD57_22.28%,#917833_100%)] bg-clip-text text-transparent">
                ₹ {payableNow.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="relative mt-1">
              <div className="absolute left-[-25px] top-1/2 h-[60px] w-[20px] -translate-y-1/2 rounded-full bg-white/60 blur-[16.5px]" />
              <motion.button
                type="button"
                onClick={() => navigate(Routes.BUY_2, { state: { backgroundLocation } })}
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
  const { state } = useGoldFlow();
  const amount = state.buyState.amount ?? 1000;
  const pricePerGram = 7421.5;
  const quantity = (amount / pricePerGram).toFixed(4);
  const subtotal = amount;
  const gst = Math.round(amount * 0.03);
  const total = subtotal + gst;
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
                  <span>Gold Price</span>
                  <span className="font-semibold text-white">₹{pricePerGram.toLocaleString('en-IN')}/g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Quantity</span>
                  <span className="font-semibold text-white">{quantity} g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Sub total</span>
                  <span className="font-semibold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>GST (3%)</span>
                  <span className="font-semibold text-white">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[#33312A] pt-4 text-[18px] font-semibold">
                  <span className="text-white">Total Payable</span>
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
  const total = amount + Math.round(amount * 0.03);
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
                  <div className="text-[12px] font-medium leading-[18px] text-[#7E7E7E]">TOTAL PAYABLE</div>
                  <div className="mt-1 text-[32px] font-bold leading-[48px] text-[#F8CF59]">₹{total.toLocaleString('en-IN')}.00</div>
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
                Pay ₹{total.toLocaleString('en-IN')}.00 →
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
  const { state } = useGoldFlow();
  const amount = state.buyState.amount ?? 1000;
  const total = amount + Math.round(amount * 0.03);
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;

  useEffect(() => {
    const timer = setTimeout(() => navigate(Routes.BUY_5, { replace: true, state: { backgroundLocation } }), AutoAdvanceDelays.BUY_4);
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
            <LoadingScreen text="Payment Processing" />
          </div>

          <div className="pb-1 text-center text-[12px] leading-[18px] text-[#7E7E7E]">Securing your gold in the vault...</div>
        </div>
      </motion.section>
    </motion.div>
  );
}

export function Buy5() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useGoldFlow();
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
              <div className="mt-2 text-[12px] leading-[18px] text-[#7E7E7E]">0.1347g of 24K gold added to your vault</div>
            </section>

            <section className="mt-4 rounded-[30px] border border-[#444135] bg-[#191812] px-6 py-6">
              <div className="space-y-4 text-[14px] text-[#8D8B87]">
                <div className="flex items-center justify-between">
                  <span>Amount paid</span>
                  <span className="font-semibold text-white">₹{((state.buyState.amount ?? 1000) + Math.round((state.buyState.amount ?? 1000) * 0.03)).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gold Purchased</span>
                  <span className="font-semibold text-white">{((state.buyState.amount ?? 1000) / 7421.5).toFixed(4)} g</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Order ID</span>
                  <span className="font-semibold text-white">#AUR-8421906</span>
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
