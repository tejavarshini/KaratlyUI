import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, ShieldCheck, CheckCircle2, AlertCircle, Loader2, CreditCard, Building2, User, ChevronDown, ChevronUp } from 'lucide-react';
import { Routes } from '../lib/routes';
import { useToast } from '../hooks/use-toast';
import { getUserProfile, setUserProfile, validateToken } from '../api/authApi';
import { fetchAugmontKycProfile, fetchAugmontUserBanks, updateAugmontKyc, createAugmontUserBank, getAugmontUser, setPrimaryAugmontUserBank } from '../api/augmontApi';
import { transbankValidatePan, transbankAadhaarGenerateOtp, transbankAadhaarSubmitOtp, transbankValidateBankAccount } from '../api/transbankApi';
import { buildMobileDobUniqueId } from '../lib/uniqueId';

const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
const PRIMARY_BANK_ID_KEY = 'primaryBankId';

const getBankId = (bank: Record<string, unknown>, fallback = '') =>
  String(bank?.provider_bank_id || bank?.userBankId || bank?.bankId || bank?.id || fallback).trim();

const storePrimaryBank = (bank: Record<string, unknown>, bankId = getBankId(bank)) => {
  if (!bankId) return;
  localStorage.setItem(PRIMARY_BANK_ID_KEY, bankId);
  localStorage.setItem('primaryBank', JSON.stringify({
    userBankId: bankId,
    accountName: bank?.accountName || '',
    accountNumber: bank?.accountNumber || '',
    ifscCode: bank?.ifscCode || ''
  }));
};

const ensureSingleBankPrimary = async (uniqueId: string, bankList: Array<Record<string, unknown>>) => {
  const banks = Array.isArray(bankList) ? bankList : [];
  const apiPrimaryBank = banks.find(b => b?.isPrimary || b?.is_primary);
  if (apiPrimaryBank) {
    const apiPrimaryBankId = getBankId(apiPrimaryBank);
    storePrimaryBank(apiPrimaryBank, apiPrimaryBankId);
    return banks.map(b => ({ ...b, isPrimary: getBankId(b) === apiPrimaryBankId }));
  }
  if (banks.length === 1) {
    const onlyBank = banks[0];
    const onlyBankId = getBankId(onlyBank);
    if (!onlyBankId) return banks;
    await setPrimaryAugmontUserBank({ uniqueId, userBankId: onlyBankId }).catch(() => null);
    storePrimaryBank(onlyBank, onlyBankId);
    return [{ ...onlyBank, isPrimary: true }];
  }
  return banks;
};

const resolveUniqueId = () => {
  const au = getAugmontUser();
  const pr = getUserProfile();
  return au?.uniqueId || pr?.uniqueId || pr?.augmontUniqueId || '';
};

const getCreatedBankId = (response: Record<string, unknown>) =>
  String(
    (response as Record<string, unknown>)?.data &&
    ((response.data as Record<string, unknown>)?.payload as Record<string, unknown>)?.result &&
    (((response.data as Record<string, unknown>)?.payload as Record<string, unknown>)?.result as Record<string, unknown>)?.data &&
    ((((response.data as Record<string, unknown>)?.payload as Record<string, unknown>)?.result as Record<string, unknown>)?.data as Record<string, unknown>)?.userBankId ||
    (((response.data as Record<string, unknown>)?.payload as Record<string, unknown>)?.result as Record<string, unknown>)?.userBankId ||
    ((response.raw as Record<string, unknown>)?.payload as Record<string, unknown>)?.result &&
    (((response.raw as Record<string, unknown>)?.payload as Record<string, unknown>)?.result as Record<string, unknown>)?.data &&
    ((((response.raw as Record<string, unknown>)?.payload as Record<string, unknown>)?.result as Record<string, unknown>)?.data as Record<string, unknown>)?.userBankId ||
    (((response.raw as Record<string, unknown>)?.payload as Record<string, unknown>)?.result as Record<string, unknown>)?.userBankId ||
    (response as Record<string, unknown>)?.bank &&
    ((response as Record<string, unknown>)?.bank as Record<string, unknown>)?.userBankId ||
    (response as Record<string, unknown>)?.userBankId ||
    ''
  ).trim();

function KycSection({ icon, title, subtitle, status, children, defaultOpen }: {
  icon: React.ReactNode; title: string; subtitle: string; status: 'verified' | 'pending'; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen || false);
  const verified = status === 'verified';
  return (
    <div className={`rounded-[15px] border transition-colors ${verified ? 'border-[#4CD676]/20 bg-[#4CD676]/5' : 'border-[#2E2E2E] bg-[#0F1416]'}`}>
      <button type="button" onClick={() => setOpen(o => !o)} className="flex w-full items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-[10px] ${verified ? 'bg-[#4CD676]/15 text-[#4CD676]' : 'bg-[#38342C] text-[#F7CD57]'}`}>
            {verified ? <CheckCircle2 size={18} /> : icon}
          </div>
          <div className="text-left">
            <p className="text-[14px] font-bold leading-[17px] text-white">{title}</p>
            <p className="mt-[2px] text-[10px] leading-[12px] text-[#7E7E7E]">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${verified ? 'bg-[#4CD676]/15 text-[#4CD676]' : 'bg-[#E8B438]/10 text-[#F7CD57]'}`}>
            {verified ? 'Verified' : 'Pending'}
          </span>
          {open ? <ChevronUp size={15} className="text-white/30" /> : <ChevronDown size={15} className="text-white/30" />}
        </div>
      </button>
      {open && <div className="border-t border-[#2E2E2E] px-4 pb-4 pt-3">{children}</div>}
    </div>
  );
}

function PanSection({ uniqueId, kycApproved, panNumber, onVerified }: {
  uniqueId: string; kycApproved: boolean; panNumber: string; onVerified: () => void
}) {
  const { toast } = useToast();
  const [pan, setPan] = useState(panNumber || '');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (kycApproved) return (
    <div className="flex items-center gap-2 text-[12px] text-[#4CD676]">
      <CheckCircle2 size={14} /> PAN {panNumber} verified with Augmont.
    </div>
  );

  const handleSubmit = async () => {
    const cleaned = pan.trim().toUpperCase();
    if (!panRegex.test(cleaned)) { setError('Enter a valid PAN (e.g. ABCDE1234F)'); return; }
    if (!name.trim()) { setError('Enter name as per PAN card'); return; }
    if (!dob) { setError('Select your date of birth'); return; }
    setLoading(true); setError('');

    const v = await transbankValidatePan({ panNumber: cleaned, name: name.trim(), mobile: getUserProfile()?.mobileNumber || '' });
    if (!v?.ok || !v?.isValid) { setLoading(false); setError(v?.message || 'PAN could not be verified.'); return; }

    const r = await updateAugmontKyc({ uniqueId, request: { panNumber: cleaned, nameAsPerPan: name.trim(), dateOfBirth: dob, status: 'approved' } });
    setLoading(false);
    if (!r?.ok) { setError(r?.message || 'PAN submission failed.'); return; }
    toast({ title: 'PAN Verified', description: 'PAN verified successfully' });
    onVerified();
  };

  return (
    <div className="space-y-3">
      <div className="rounded-[10px] border border-[#E8B438]/15 bg-[#E8B438]/5 px-3 py-2.5 text-[10px] text-[#F7CD57]/70">
        PAN is required for KYC compliance and purchases above ₹2,00,000.
      </div>
      <label className="block">
        <span className="mb-1 block text-[10px] font-medium text-white/50">PAN Number</span>
        <input value={pan} onChange={e => { setPan(e.target.value.toUpperCase()); setError(''); }} placeholder="ABCDE1234F" maxLength={10}
          className="h-10 w-full rounded-[10px] border border-[#4E4E4E] bg-[#1A1710] px-3 text-[12px] font-mono tracking-widest text-white placeholder:text-[#4E4E4E] focus:outline-none focus:border-[#E8B438]" />
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] font-medium text-white/50">Name as per PAN</span>
        <input value={name} onChange={e => { setName(e.target.value.toUpperCase()); setError(''); }} placeholder="FULL NAME AS ON PAN"
          className="h-10 w-full rounded-[10px] border border-[#4E4E4E] bg-[#1A1710] px-3 text-[12px] text-white placeholder:text-[#4E4E4E] focus:outline-none focus:border-[#E8B438]" />
      </label>
      <label className="block">
        <span className="mb-1 block text-[10px] font-medium text-white/50">Date of Birth</span>
        <input type="date" value={dob} onChange={e => { setDob(e.target.value); setError(''); }} max={new Date().toISOString().split('T')[0]}
          className="h-10 w-full rounded-[10px] border border-[#4E4E4E] bg-[#1A1710] px-3 text-[12px] text-white focus:outline-none focus:border-[#E8B438]" />
      </label>
      {error && <div className="flex items-center gap-2 rounded-[10px] border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-[11px] text-red-300"><AlertCircle size={12} />{error}</div>}
      <button type="button" onClick={handleSubmit} disabled={loading}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[linear-gradient(90deg,#FED75D_0%,#ECB000_50.48%,#D48D00_100%)] text-[12px] font-bold text-black disabled:opacity-60 transition">
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? 'Verifying...' : 'Verify & Submit PAN'}
      </button>
    </div>
  );
}

function AadhaarSection({ uniqueId, verified, onVerified }: {
  uniqueId: string; verified: boolean; onVerified: () => void
}) {
  const { toast } = useToast();
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [stage, setStage] = useState('enter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (verified) return (
    <div className="flex items-center gap-2 text-[12px] text-[#4CD676]">
      <CheckCircle2 size={14} /> Aadhaar verified successfully.
    </div>
  );

  const sendOtp = async () => {
    const c = aadhaar.replace(/\D/g, '');
    if (c.length !== 12) { setError('Enter a valid 12-digit Aadhaar'); return; }
    setLoading(true); setError('');
    const r = await transbankAadhaarGenerateOtp(c);
    setLoading(false);
    if (!r?.ok) { setError(r?.message || 'Could not send OTP.'); return; }
    setSessionId(r.sessionId || '');
    setStage('otp');
    toast({ title: 'OTP Sent', description: 'OTP sent to Aadhaar-linked mobile' });
  };

  const submitOtp = async () => {
    if (otp.replace(/\D/g, '').length !== 6) { setError('Enter the 6-digit OTP'); return; }
    setLoading(true); setError('');
    const r = await transbankAadhaarSubmitOtp(sessionId, otp.trim(), uniqueId, aadhaar.replace(/\D/g, ''));
    if (!r?.ok) { setLoading(false); setError(r?.message || 'OTP verification failed.'); return; }
    const photo = (r as Record<string, unknown>)?.raw &&
      ((r as Record<string, unknown>).raw as Record<string, unknown>)?.photo ||
      ((r as Record<string, unknown>)?.raw as Record<string, unknown>)?.data &&
      (((r as Record<string, unknown>)?.raw as Record<string, unknown>)?.data as Record<string, unknown>)?.photo ||
      null;
    if (photo) localStorage.setItem('profilePhoto', String(photo).startsWith('data:') ? String(photo) : `data:image/jpeg;base64,${photo}`);
    await updateAugmontKyc({ uniqueId, request: { aadharNumber: aadhaar.replace(/\D/g, '') } });
    setLoading(false);
    toast({ title: 'Aadhaar Verified', description: 'Aadhaar verified successfully' });
    onVerified();
  };

  return (
    <div className="space-y-3">
      <div className="rounded-[10px] border border-[#E8B438]/15 bg-[#E8B438]/5 px-3 py-2.5 text-[10px] text-[#F7CD57]/70">
        An OTP will be sent to the mobile number linked with your Aadhaar.
      </div>
      {stage === 'enter' ? (
        <>
          <label className="block">
            <span className="mb-1 block text-[10px] font-medium text-white/50">Aadhaar Number</span>
            <input value={aadhaar} onChange={e => { setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12)); setError(''); }} placeholder="123456789012" maxLength={12}
              className="h-10 w-full rounded-[10px] border border-[#4E4E4E] bg-[#1A1710] px-3 text-[12px] font-mono tracking-widest text-white placeholder:text-[#4E4E4E] focus:outline-none focus:border-[#E8B438]" />
          </label>
          {error && <div className="flex items-center gap-2 rounded-[10px] border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-[11px] text-red-300"><AlertCircle size={12} />{error}</div>}
          <button type="button" onClick={sendOtp} disabled={loading || aadhaar.replace(/\D/g, '').length !== 12}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[linear-gradient(90deg,#FED75D_0%,#ECB000_50.48%,#D48D00_100%)] text-[12px] font-bold text-black disabled:opacity-60 transition">
            {loading && <Loader2 size={14} className="animate-spin" />}{loading ? 'Sending...' : 'Send OTP'}
          </button>
        </>
      ) : (
        <>
          <div className="rounded-[10px] border border-[#4CD676]/20 bg-[#4CD676]/5 px-3 py-2.5 text-[11px] text-[#4CD676]">
            OTP sent to Aadhaar-linked mobile (****{aadhaar.slice(-4)})
          </div>
          <label className="block">
            <span className="mb-1 block text-[10px] font-medium text-white/50">Enter OTP</span>
            <input value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }} placeholder="6-digit OTP" maxLength={6}
              className="h-10 w-full rounded-[10px] border border-[#4E4E4E] bg-[#1A1710] px-3 text-[12px] font-mono tracking-widest text-white placeholder:text-[#4E4E4E] focus:outline-none focus:border-[#E8B438]" />
          </label>
          {error && <div className="flex items-center gap-2 rounded-[10px] border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-[11px] text-red-300"><AlertCircle size={12} />{error}</div>}
          <button type="button" onClick={submitOtp} disabled={loading || otp.replace(/\D/g, '').length !== 6}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[linear-gradient(90deg,#FED75D_0%,#ECB000_50.48%,#D48D00_100%)] text-[12px] font-bold text-black disabled:opacity-60 transition">
            {loading && <Loader2 size={14} className="animate-spin" />}{loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <div className="flex gap-4 text-center">
            <button type="button" onClick={async () => { const r = await transbankAadhaarGenerateOtp(aadhaar.replace(/\D/g, '')); if (r?.ok) toast({ title: 'OTP Resent' }); }} className="flex-1 text-[10px] text-white/30 hover:text-white/50 transition">Resend OTP</button>
            <button type="button" onClick={() => { setStage('enter'); setOtp(''); setError(''); }} className="flex-1 text-[10px] text-white/30 hover:text-white/50 transition">Change number</button>
            <button type="button" onClick={() => { toast({ title: 'Skipped', description: 'Aadhaar saved without OTP' }); onVerified(); }} className="flex-1 text-[10px] text-white/20 hover:text-white/40 transition">Skip OTP</button>
          </div>
        </>
      )}
    </div>
  );
}

function BankSection({ uniqueId, banks, onVerified }: {
  uniqueId: string; banks: Array<Record<string, unknown>>; onVerified: () => void
}) {
  const { toast } = useToast();
  const [form, setForm] = useState({ accountName: '', accountNumber: '', ifscCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!form.accountName.trim() || !form.accountNumber.trim()) { setError('Account name and number required'); return; }
    if (!ifscRegex.test(form.ifscCode.trim())) { setError('Enter a valid IFSC (e.g. SBIN0001234)'); return; }
    setLoading(true); setError('');

    const v = await transbankValidateBankAccount({ accountName: form.accountName.trim(), accountNumber: form.accountNumber.trim(), ifscCode: form.ifscCode.trim() });
    if (!v?.ok || !v?.isValid) { setLoading(false); setError(v?.message || 'Bank validation failed.'); return; }

    const r = await createAugmontUserBank({ uniqueId, request: { accountNumber: form.accountNumber.trim(), accountName: form.accountName.trim(), ifscCode: form.ifscCode.trim() } });
    setLoading(false);
    if (!r?.ok) { setError(r?.message || 'Could not add bank.'); return; }
    const createdBankId = getCreatedBankId(r as unknown as Record<string, unknown>);
    const isFirstBank = !Array.isArray(banks) || banks.length === 0;
    if (isFirstBank) {
      if (createdBankId) {
        await setPrimaryAugmontUserBank({ uniqueId, userBankId: createdBankId }).catch(() => null);
        storePrimaryBank(form, createdBankId);
      } else {
        const banksRes = await fetchAugmontUserBanks(uniqueId);
        const latestBanks = banksRes?.ok && Array.isArray(banksRes.banks) ? banksRes.banks : [];
        const matchedBank = latestBanks.find((b: Record<string, unknown>) =>
          String(b?.accountNumber || b?.account_number || '').replace(/\s/g, '') === form.accountNumber.trim() &&
          String(b?.ifscCode || b?.ifsc_code || '').toUpperCase() === form.ifscCode.trim().toUpperCase()
        );
        const matchedBankId = getBankId(matchedBank);
        if (matchedBankId) {
          await setPrimaryAugmontUserBank({ uniqueId, userBankId: matchedBankId }).catch(() => null);
          storePrimaryBank(matchedBank, matchedBankId);
        }
      }
    }
    toast({ title: 'Bank Verified', description: 'Bank verified and added' });
    onVerified();
  };

  return (
    <div className="space-y-3">
      {banks.length > 0 && (
        <div className="rounded-[10px] border border-[#4CD676]/20 bg-[#4CD676]/5 px-3 py-3">
          <p className="text-[10px] text-[#4CD676]/70 uppercase tracking-wider mb-2">Existing accounts</p>
          {banks.map((b, i) => (
            <div key={i} className="flex items-center justify-between py-1">
              <div>
                <p className="text-[12px] font-medium text-white">{b.accountName as string}</p>
                <p className="text-[10px] text-white/40">****{String(b.accountNumber).slice(-4)} · {b.ifscCode as string}</p>
              </div>
              <CheckCircle2 size={13} className="text-[#4CD676]" />
            </div>
          ))}
          <p className="text-[10px] text-white/30 mt-2">Add another account below</p>
        </div>
      )}
      <div className="rounded-[10px] border border-[#E8B438]/15 bg-[#E8B438]/5 px-3 py-2.5 text-[10px] text-[#F7CD57]/70">
        Bank account is verified in real-time before being added.
      </div>
      {[
        { key: 'accountName', label: 'Account Holder Name', ph: 'As per bank records' },
        { key: 'accountNumber', label: 'Account Number', ph: 'Enter account number' },
        { key: 'ifscCode', label: 'IFSC Code', ph: 'SBIN0001234' },
      ].map(({ key, label, ph }) => (
        <label key={key} className="block">
          <span className="mb-1 block text-[10px] font-medium text-white/50">{label}</span>
          <input value={form[key as keyof typeof form]} onChange={e => { setForm(p => ({ ...p, [key]: key === 'ifscCode' ? e.target.value.toUpperCase() : e.target.value })); setError(''); }} placeholder={ph}
            className="h-10 w-full rounded-[10px] border border-[#4E4E4E] bg-[#1A1710] px-3 text-[12px] text-white placeholder:text-[#4E4E4E] focus:outline-none focus:border-[#E8B438]" />
        </label>
      ))}
      {error && <div className="flex items-center gap-2 rounded-[10px] border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-[11px] text-red-300"><AlertCircle size={12} />{error}</div>}
      <button type="button" onClick={handleSubmit} disabled={loading}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[10px] bg-[linear-gradient(90deg,#FED75D_0%,#ECB000_50.48%,#D48D00_100%)] text-[12px] font-bold text-black disabled:opacity-60 transition">
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? 'Validating...' : 'Validate & Add Bank'}
      </button>
    </div>
  );
}

export function KycVerification() {
  const navigate = useNavigate();
  const uniqueId = resolveUniqueId();

  const [loading, setLoading] = useState(true);
  const [kycApproved, setKycApproved] = useState(false);
  const [panNumber, setPanNumber] = useState('');
  const [aadhaarVerified, setAadhaarVerified] = useState(false);
  const [banks, setBanks] = useState<Array<Record<string, unknown>>>([]);
  const [bankVerified, setBankVerified] = useState(false);

  useEffect(() => {
    if (!uniqueId) { setLoading(false); return; }
    const profile = getUserProfile();
    setAadhaarVerified(profile?.aadhaarVerified || !!localStorage.getItem('profilePhoto'));
    Promise.all([
      fetchAugmontKycProfile(uniqueId),
      fetchAugmontUserBanks(uniqueId),
    ]).then(async ([kycRes, banksRes]) => {
      if (kycRes?.ok) {
        setKycApproved((kycRes.kycProfile?.status || '').toLowerCase() === 'approved');
        setPanNumber(kycRes.kycProfile?.panNumber || '');
      }
      if (banksRes?.ok) {
        const normalizedBanks = await ensureSingleBankPrimary(uniqueId, banksRes.banks || []);
        setBanks(normalizedBanks);
        setBankVerified(normalizedBanks.length > 0);
      }
      setLoading(false);
    });
  }, [uniqueId]);

  const allDone = kycApproved && aadhaarVerified && bankVerified;

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <Loader2 className="h-8 w-8 animate-spin text-[#F7CD57]" />
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-full bg-black text-white"
      style={{ background: 'radial-gradient(103.89% 37.92% at 97.55% 0%, #4A3A1E 0%, #000000 100%)', fontFamily: 'Lato, sans-serif' }}>
      <main className="mx-auto w-full max-w-[390px] pb-[110px]">
        <section className="flex items-center justify-between px-6 pb-1 pt-[3px] text-[12px] leading-[18px] text-white">
          <span>9:30</span>
          <div className="flex items-center gap-2 text-white">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true"><rect x="1" y="8" width="3" height="4" rx="1" fill="currentColor" /><rect x="6" y="5" width="3" height="7" rx="1" fill="currentColor" /><rect x="11" y="2" width="3" height="10" rx="1" fill="currentColor" /></svg>
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none" aria-hidden="true"><path d="M7 1C4 1 1.5 3.3 1 6.5H13C12.5 3.3 10 1 7 1Z" fill="currentColor" opacity="0.95" /></svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true"><rect x="1" y="1" width="21" height="10" rx="3" stroke="currentColor" strokeWidth="1" /><rect x="3" y="3" width="15" height="6" rx="1" fill="currentColor" /><path d="M24 4V8C24 8 25 7.5 25 6C25 4.5 24 4 24 4Z" fill="currentColor" /></svg>
          </div>
        </section>

        <section className="flex items-center justify-between px-6 pt-10">
          <div className="flex items-center gap-2 text-[#F7CD57]">
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="grid h-6 w-6 place-items-center"><ArrowLeft size={18} /></button>
            <span className="text-[14px] font-normal leading-[21px]">KYC Verification</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex h-6 items-center gap-2 rounded-[20px] border px-3 text-[10px] ${allDone ? 'border-[#0C9100] bg-[#032101] text-[#15EE01]' : 'border-[#E8B438] bg-[#1D170D] text-[#F7CD57]'}`}>
              <ShieldCheck size={10} />
              <span>{allDone ? 'Verified' : 'Pending'}</span>
            </div>
            <button type="button" aria-label="Notifications" onClick={() => navigate(Routes.NOTIFICATIONS)}
              className="relative grid h-6 w-6 place-items-center rounded-full border border-[#E8B438] bg-[#1D170D] text-[#C1C1C1]">
              <Bell size={14} />
              <span className="absolute right-[2px] top-[2px] h-[5px] w-[5px] rounded-full bg-[#EE0105]" />
            </button>
          </div>
        </section>

        <section className="mx-6 mt-6 space-y-3">
          {allDone ? (
            <div className="rounded-[15px] border border-[#4CD676]/20 bg-[#4CD676]/5 px-4 py-3 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-[#4CD676] shrink-0" />
              <div>
                <p className="text-[13px] font-semibold text-[#4CD676]">All KYC steps completed</p>
                <p className="text-[10px] text-white/40 mt-[2px]">Your account is fully verified</p>
              </div>
            </div>
          ) : (
            <div className="rounded-[15px] border border-[#E8B438]/15 bg-[#E8B438]/5 px-4 py-3 text-[12px] text-[#F7CD57]/70">
              Complete the steps below in any order. Each step is independent — tap to expand.
            </div>
          )}

          <KycSection icon={<CreditCard size={18} />} title="PAN Verification" subtitle="Validate your PAN for KYC compliance" status={kycApproved ? 'verified' : 'pending'} defaultOpen={!kycApproved}>
            <PanSection uniqueId={uniqueId} kycApproved={kycApproved} panNumber={panNumber} onVerified={() => { setKycApproved(true); validateToken().catch(() => {}); }} />
          </KycSection>

          <KycSection icon={<User size={18} />} title="Aadhaar Verification" subtitle="Verify via OTP sent to Aadhaar-linked mobile" status={aadhaarVerified ? 'verified' : 'pending'} defaultOpen={!aadhaarVerified && kycApproved}>
            <AadhaarSection uniqueId={uniqueId} verified={aadhaarVerified} onVerified={() => { setAadhaarVerified(true); validateToken().catch(() => {}); }} />
          </KycSection>

          <KycSection icon={<Building2 size={18} />} title="Bank Account" subtitle="Required for gold sell payouts" status={bankVerified ? 'verified' : 'pending'} defaultOpen={!bankVerified && kycApproved && aadhaarVerified}>
            <BankSection uniqueId={uniqueId} banks={banks} onVerified={() => {
              validateToken().catch(() => {});
              fetchAugmontUserBanks(uniqueId).then(async r => {
                if (r?.ok) {
                  const normalizedBanks = await ensureSingleBankPrimary(uniqueId, r.banks || []);
                  setBanks(normalizedBanks);
                  setBankVerified(normalizedBanks.length > 0);
                }
              });
            }} />
          </KycSection>

          <button type="button" onClick={() => navigate(Routes.HOME)}
            className="w-full rounded-[10px] border border-[#4E4E4E] bg-[#1A1710] py-3 text-[12px] text-white/50 hover:text-white transition">
            {allDone ? 'Go to Dashboard →' : 'Complete later — Go to Dashboard'}
          </button>
        </section>
      </main>
    </motion.div>
  );
}
