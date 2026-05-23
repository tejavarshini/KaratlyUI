import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Plus, Trash2, Pencil, Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Routes } from '../lib/routes';
import { fetchAugmontUserBanks, createAugmontUserBank, updateAugmontUserBank, deleteAugmontUserBank, setPrimaryAugmontUserBank, getAugmontUser } from '../api/augmontApi';
import { getUserProfile } from '../api/authApi';
import { transbankValidateBankAccount } from '../api/transbankApi';
import { useAuth } from '../store/AuthContext';
import { useToast } from '@/hooks/use-toast';

const MAX_BANKS = 3;
const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="12" width="14" height="9" rx="2" stroke="#15EE01" strokeWidth="1.5" />
      <path d="M8 12V8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8V12" stroke="#15EE01" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1.5" fill="#15EE01" />
    </svg>
  );
}

function getBankId(bank: Record<string, unknown>): string {
  return String(bank?.provider_bank_id || bank?.userBankId || bank?.bankId || bank?.id || '');
}

function isValidAccountNumber(acc: string): boolean {
  return /^\d{9,18}$/.test(acc.replace(/\s/g, ''));
}

function detectIfscMismatch(existingBanks: Array<Record<string, unknown>>, newAccountNumber: string, newIfsc: string): string | null {
  const match = existingBanks.find(
    (b) => String(b.accountNumber || '').replace(/\s/g, '') === String(newAccountNumber).replace(/\s/g, '')
  );
  if (!match) return null;
  const matchIfsc = String(match.ifscCode || match.ifsc_code || '').toUpperCase();
  if (matchIfsc !== newIfsc.toUpperCase()) {
    return `Account ${newAccountNumber} is already registered with IFSC ${matchIfsc}. Please verify the IFSC code.`;
  }
  return null;
}

export function PaymentMethods() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  const [banks, setBanks] = useState<Array<Record<string, unknown>>>([]);
  const [banksLoading, setBanksLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBank, setEditingBank] = useState<Record<string, unknown> | null>(null);
  const [formData, setFormData] = useState({ accountName: '', accountNumber: '', ifscCode: '' });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const resolveUniqueId = useCallback(() => {
    const profile = getUserProfile() || {};
    const augmontUser = getAugmontUser() || {};
    return augmontUser?.uniqueId || profile?.uniqueId || profile?.augmontUniqueId || '';
  }, []);

  const loadBanks = useCallback(async () => {
    const uniqueId = resolveUniqueId();
    if (!uniqueId) { setBanksLoading(false); return; }
    const res = await fetchAugmontUserBanks(uniqueId);
    if (res?.ok) {
      setBanks(res.banks || []);
    }
    setBanksLoading(false);
  }, [resolveUniqueId]);

  useEffect(() => { loadBanks(); }, [loadBanks]);

  const openAddForm = () => {
    setEditingBank(null);
    setFormData({ accountName: '', accountNumber: '', ifscCode: '' });
    setFormErrors({});
    setShowForm(true);
  };

  const openEditForm = (bank: Record<string, unknown>) => {
    setEditingBank(bank);
    setFormData({
      accountName: String(bank.accountName || bank.account_holder_name || ''),
      accountNumber: String(bank.accountNumber || bank.account_number || ''),
      ifscCode: String(bank.ifscCode || bank.ifsc_code || ''),
    });
    setFormErrors({});
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingBank(null);
    setFormData({ accountName: '', accountNumber: '', ifscCode: '' });
    setFormErrors({});
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.accountName.trim()) errors.accountName = 'Account holder name required';
    if (!isValidAccountNumber(formData.accountNumber)) errors.accountNumber = 'Enter a valid account number (9-18 digits)';
    if (!IFSC_REGEX.test(formData.ifscCode.toUpperCase())) errors.ifscCode = 'Enter a valid IFSC (e.g. SBIN0001234)';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);

    const uniqueId = resolveUniqueId();
    if (!uniqueId) {
      toast({ variant: 'destructive', title: 'Error', description: 'User session not found. Please login again.' });
      setSubmitting(false);
      return;
    }

    const accountName = formData.accountName.trim();
    const accountNumber = formData.accountNumber.replace(/\s/g, '');
    const ifscCode = formData.ifscCode.toUpperCase();

    if (!editingBank) {
      const mismatch = detectIfscMismatch(banks, accountNumber, ifscCode);
      if (mismatch) {
        toast({ variant: 'destructive', title: 'Validation Error', description: mismatch });
        setSubmitting(false);
        return;
      }
    }

    const validateRes = await transbankValidateBankAccount({ accountName, accountNumber, ifscCode });
    if (!validateRes?.ok || validateRes?.isValid === false) {
      toast({ variant: 'destructive', title: 'Validation Failed', description: validateRes?.message || 'Bank account validation failed. Please check your details.' });
      setSubmitting(false);
      return;
    }

    if (editingBank) {
      const bankId = getBankId(editingBank);
      const res = await updateAugmontUserBank({
        uniqueId,
        userBankId: bankId,
        request: { accountNumber, accountName, ifscCode, status: 'active' },
      });
      if (res?.ok) {
        toast({ title: 'Success', description: 'Bank account updated successfully.' });
        closeForm();
        loadBanks();
      } else {
        toast({ variant: 'destructive', title: 'Update Failed', description: res?.message || 'Failed to update bank account.' });
      }
    } else {
      const res = await createAugmontUserBank({
        uniqueId,
        request: { accountNumber, accountName, ifscCode },
      });
      if (res?.ok) {
        toast({ title: 'Success', description: 'Bank account added successfully.' });
        closeForm();
        const latestRes = await fetchAugmontUserBanks(uniqueId);
        const latestBanks = latestRes?.ok ? (latestRes.banks || []) : banks;
        setBanks(latestBanks);
        const hasPrimary = latestBanks.some((b) => Boolean(b?.isPrimary || b?.is_primary));
        if (!hasPrimary && latestBanks.length > 0) {
          const firstBankId = getBankId(latestBanks[0]);
          await setPrimaryAugmontUserBank({ uniqueId, userBankId: firstBankId }).catch(() => null);
          loadBanks();
        }
      } else {
        toast({ variant: 'destructive', title: 'Add Failed', description: res?.message || 'Failed to add bank account.' });
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (bank: Record<string, unknown>) => {
    const bankId = getBankId(bank);
    const uniqueId = resolveUniqueId();
    if (!uniqueId || !bankId) return;
    const res = await deleteAugmontUserBank({ uniqueId, userBankId: bankId });
    if (res?.ok) {
      toast({ title: 'Deleted', description: 'Bank account removed.' });
      loadBanks();
    } else {
      toast({ variant: 'destructive', title: 'Delete Failed', description: res?.message || 'Failed to delete bank account.' });
    }
  };

  const handleSetPrimary = async (bank: Record<string, unknown>) => {
    const bankId = getBankId(bank);
    const uniqueId = resolveUniqueId();
    if (!uniqueId || !bankId) return;
    const res = await setPrimaryAugmontUserBank({ uniqueId, userBankId: bankId });
    if (res?.ok) {
      toast({ title: 'Updated', description: 'Primary bank account changed.' });
      loadBanks();
    } else {
      toast({ variant: 'destructive', title: 'Failed', description: res?.message || 'Failed to set primary bank.' });
    }
  };

  const maskAccount = (acc: string) => {
    const cleaned = acc.replace(/\s/g, '');
    if (cleaned.length < 4) return `****${cleaned}`;
    return `****${cleaned.slice(-4)}`;
  };

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
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="grid h-6 w-6 place-items-center">
              <ArrowLeft size={18} />
            </button>
            <span className="text-[14px] font-normal leading-[21px]">Payment Methods</span>
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

        <section className="mx-6 mt-6">
          <h2 className="text-[14px] font-bold leading-[17px] text-[#BFBFBF]">SAVED BANK ACCOUNTS</h2>

          {banksLoading ? (
            <div className="mt-4 flex items-center justify-center py-8 text-[12px] text-[#7E7E7E]">Loading...</div>
          ) : banks.length === 0 ? (
            <div className="mt-4 rounded-[20px] border border-[#2E2E2E] bg-[#0F1416] px-4 py-6 text-center text-[12px] text-[#7E7E7E]">
              No bank accounts added yet
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {banks.map((bank, i) => {
                const bankId = getBankId(bank);
                const isPrimary = Boolean(bank?.isPrimary || bank?.is_primary);
                const accName = String(bank.accountName || bank.account_holder_name || 'Bank Account');
                const accNum = String(bank.accountNumber || bank.account_number || '');
                const ifsc = String(bank.ifscCode || bank.ifsc_code || '');
                const bankName = String(bank.bankName || bank.bank_name || '');

                return (
                  <div key={bankId || i} className="flex items-center rounded-[20px] border border-[#2E2E2E] bg-[#0F1416] px-4 py-4">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2A2923]">
                      <Building2 size={16} className="text-[#9E9E9E]" />
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-[14px] font-medium leading-[21px] text-white">{accName}</span>
                        {isPrimary && (
                          <span className="shrink-0 rounded-[5px] bg-[#263938] px-3 py-1 text-[8px] font-semibold leading-[12px] text-[#6DD6FF]">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] leading-[15px] text-[#7E7E7E]">
                        <span className="font-mono">{maskAccount(accNum)}</span>
                        <span>·</span>
                        <span>{ifsc}</span>
                        {bankName && <><span>·</span><span>{bankName}</span></>}
                      </div>
                    </div>
                    <div className="ml-2 flex shrink-0 items-center gap-2">
                      {!isPrimary && (
                        <button
                          type="button"
                          onClick={() => handleSetPrimary(bank)}
                          className="grid h-8 w-8 place-items-center rounded-full bg-[#1A301E] text-[#15EE01]"
                          title="Set as primary"
                        >
                          <CheckCircle2 size={14} />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => openEditForm(bank)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-[#2A2923] text-[#7E7E7E]"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(bank)}
                        className="grid h-8 w-8 place-items-center rounded-full bg-[#3D1A1A] text-[#FF4444]"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!showForm && banks.length < MAX_BANKS && (
            <button
              type="button"
              onClick={openAddForm}
              className="mt-3 flex w-full items-center rounded-[20px] border border-[#2E2E2E] bg-[#0F1416] px-4 py-4 text-left"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#2A2923]">
                <Plus size={20} className="text-white" />
              </div>
              <div className="ml-4 flex-1">
                <div className="text-[14px] font-medium leading-[21px] text-white">Add bank account</div>
                <div className="mt-1 text-[10px] leading-[15px] text-[#7E7E7E]">Savings or Current</div>
              </div>
              <span className="text-[10px] text-[#7E7E7E]">{banks.length}/{MAX_BANKS}</span>
            </button>
          )}

          {showForm && (
            <div className="mt-3 rounded-[20px] border border-[#B28A3B] bg-[#1A1710] px-4 py-5">
              <h3 className="text-[14px] font-bold leading-[17px] text-white">
                {editingBank ? 'Edit Bank Account' : 'Add Bank Account'}
              </h3>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-[10px] leading-[12px] text-[#7E7E7E]">Account Holder Name</label>
                  <input
                    type="text"
                    value={formData.accountName}
                    onChange={(e) => { setFormData({ ...formData, accountName: e.target.value }); setFormErrors({ ...formErrors, accountName: '' }); }}
                    placeholder="Enter name as on bank account"
                    className={`mt-1 h-10 w-full rounded-[10px] border bg-[#0F1416] px-3 text-[12px] text-white outline-none placeholder:text-[#4E4E4E] ${formErrors.accountName ? 'border-[#FF4444]' : 'border-[#2E2E2E]'}`}
                  />
                  {formErrors.accountName && <p className="mt-1 text-[10px] text-[#FF4444]">{formErrors.accountName}</p>}
                </div>

                <div>
                  <label className="text-[10px] leading-[12px] text-[#7E7E7E]">Account Number</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formData.accountNumber}
                    onChange={(e) => { setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') }); setFormErrors({ ...formErrors, accountNumber: '' }); }}
                    placeholder="Enter 9-18 digit account number"
                    maxLength={18}
                    className={`mt-1 h-10 w-full rounded-[10px] border bg-[#0F1416] px-3 text-[12px] text-white outline-none placeholder:text-[#4E4E4E] ${formErrors.accountNumber ? 'border-[#FF4444]' : 'border-[#2E2E2E]'}`}
                  />
                  {formErrors.accountNumber && <p className="mt-1 text-[10px] text-[#FF4444]">{formErrors.accountNumber}</p>}
                </div>

                <div>
                  <label className="text-[10px] leading-[12px] text-[#7E7E7E]">IFSC Code</label>
                  <input
                    type="text"
                    value={formData.ifscCode}
                    onChange={(e) => { setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() }); setFormErrors({ ...formErrors, ifscCode: '' }); }}
                    placeholder="e.g. SBIN0001234"
                    maxLength={11}
                    className={`mt-1 h-10 w-full rounded-[10px] border bg-[#0F1416] px-3 text-[12px] text-white outline-none placeholder:text-[#4E4E4E] ${formErrors.ifscCode ? 'border-[#FF4444]' : 'border-[#2E2E2E]'}`}
                  />
                  {formErrors.ifscCode && <p className="mt-1 text-[10px] text-[#FF4444]">{formErrors.ifscCode}</p>}
                </div>

                {!editingBank && formData.accountNumber && formData.ifscCode.length >= 4 && (() => {
                  const warn = detectIfscMismatch(banks, formData.accountNumber, formData.ifscCode);
                  return warn ? (
                    <div className="flex items-start gap-2 rounded-[10px] border border-red-500/20 bg-red-500/10 px-3 py-2">
                      <AlertCircle size={13} className="mt-0.5 shrink-0 text-red-400" />
                      <span className="text-[10px] leading-[13px] text-red-300">{warn}</span>
                    </div>
                  ) : null;
                })()}
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={closeForm}
                  className="h-10 flex-1 rounded-[15px] border border-[#2E2E2E] bg-[#0F1416] text-[12px] font-semibold text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex h-10 flex-1 items-center justify-center rounded-[15px] bg-[linear-gradient(90deg,#F7CD57_0%,#E5AF35_50.96%,#B57F23_100%)] text-[12px] font-semibold text-black disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={14} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editingBank ? 'Update' : 'Add Account'
                  )}
                </button>
              </div>
            </div>
          )}
        </section>

        <section className="mx-6 mt-6">
          <div className="flex items-center gap-2 rounded-[40px] border border-[#2E2E2E] bg-[#0F1416] px-4 py-2">
            <LockIcon />
            <span className="text-[10px] leading-[15px] text-[#7E7E7E]">Verified beneficiary · Encrypted with 256-bit SSL</span>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
