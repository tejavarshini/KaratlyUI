import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Routes, AutoAdvanceDelays } from '../lib/routes';
import { TopBar } from '../components/TopBar';
import { LoadingScreen } from '../components/LoadingScreen';
import { SuccessAnimation } from '../components/SuccessAnimation';
import { transitions } from '../lib/animations';
import { useAuth } from '../store/AuthContext';

export function BankVerify() {
  const navigate = useNavigate();
  const [account, setAccount] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [name, setName] = useState('');

  return (
    <motion.div {...transitions.slideFromRight} className="flex flex-col min-h-[100dvh] bg-background">
      <TopBar title="Verify Bank Account" />
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-muted-foreground text-sm mb-6">We will deposit ₹1 to verify your account details.</p>
        
        <div className="space-y-4 mb-8">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Account Number</label>
            <input 
              type="text" 
              value={account}
              onChange={(e) => setAccount(e.target.value.replace(/\\D/g, ''))}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">IFSC Code</label>
            <input 
              type="text" 
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Account Holder Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-input border border-border rounded-xl px-4 py-3 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-secondary/20 border border-secondary/30 flex items-start gap-3">
          <div className="text-secondary-foreground mt-0.5">ℹ</div>
          <p className="text-xs text-muted-foreground">The name on your bank account must match the name on your PAN card for successful KYC verification.</p>
        </div>

        <div className="mt-auto pt-8">
          <button 
            disabled={!account || !ifsc || !name}
            onClick={() => navigate(Routes.BANK_VERIFY_LOADING)}
            className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-[0_0_20px_rgba(151,71,255,0.4)] disabled:opacity-50"
          >
            Verify Account
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function BankVerifyLoading() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<'loading' | 'success'>('loading');
  const { dispatch, state } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setStage('success');
      // Update KYC status if needed
      if (state.user) {
        dispatch({ type: 'VERIFY_OTP', payload: { user: { ...state.user, kycStatus: 'Verified' } } });
      }
      setTimeout(() => navigate(Routes.PROFILE), 2000);
    }, AutoAdvanceDelays.BANK_VERIFY_LOAD);
    return () => clearTimeout(timer);
  }, [navigate, dispatch, state.user]);

  return (
    <motion.div {...transitions.fadeTransition} className="flex flex-col min-h-[100dvh] bg-background">
      <TopBar title="Verifying" showBack={false} />
      <div className="flex-1 flex items-center justify-center">
        {stage === 'loading' ? (
          <LoadingScreen text="Depositing ₹1 for verification..." />
        ) : (
          <div className="flex flex-col items-center">
            <SuccessAnimation text="Bank Verified!" />
            <p className="text-muted-foreground mt-2">Your account is ready for transactions.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
