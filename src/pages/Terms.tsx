import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell } from 'lucide-react';
import { Routes } from '../lib/routes';

const termsText = `1. About Karatly
Karatly is a digital platform that enables users to buy, sell, store, and manage digital gold, silver, diamonds, and related precious metal products through secure and technology-enabled services.

2. Eligibility
To use Karatly Services, you must:
• Be at least 18 years old;
• Have the legal capacity to enter into a binding agreement;
• Provide accurate and complete registration information;
• Comply with all applicable laws and regulations.
Karatly reserves the right to suspend or terminate accounts that violate these Terms.

3. Account Registration & Security
Users are responsible for maintaining the confidentiality of their account credentials. You agree to:
• Provide accurate and updated information;
• Maintain the security of your login credentials;
• Notify Karatly immediately of any unauthorized access or suspicious activity.
Karatly will not be liable for losses arising from unauthorized use of your account.

4. KYC & Verification
Karatly may require Know Your Customer (KYC) verification in accordance with applicable laws and regulatory requirements. Users agree to provide valid identity documents and any additional information requested for verification purposes. Failure to complete verification may result in limited access to Services.

5. Digital Gold, Silver & Diamond Transactions
5.1 Pricing
Prices of gold, silver, and diamonds displayed on Karatly are market-linked and may fluctuate in real time. The final transaction price will be the price displayed at the time the transaction is successfully confirmed.
5.2 Buy Transactions
Users may purchase digital precious metals subject to minimum and maximum transaction limits set by Karatly.
5.3 Sell Transactions
Users may sell eligible holdings through the platform at prevailing market rates. Settlement timelines may vary depending on banking and operational processing.
5.4 Storage
Purchased digital assets may be securely stored with Karatly's authorized vaulting and storage partners.
5.5 Delivery
Physical delivery options, if available, are subject to additional charges, verification requirements, delivery timelines, and geographic limitations.

6. Payments
Users agree that:
• Payments must be made using authorized payment methods;
• Transactions are subject to payment gateway approvals and banking processes;
• Karatly is not responsible for delays caused by payment providers or financial institutions.
Failed or reversed payments may result in cancellation of transactions.

7. Fees & Charges
Karatly may charge:
• Transaction fees;
• Storage fees;
• Delivery charges;
• Taxes and statutory levies.
Applicable charges will be displayed before confirmation of transactions.

8. User Responsibilities
Users agree not to:
• Use the platform for unlawful activities;
• Engage in fraudulent or misleading transactions;
• Attempt unauthorized access to systems or data;
• Interfere with platform operations;
• Misuse promotional offers or referral programs.
Violation may result in suspension or legal action.

9. Intellectual Property
All content, branding, logos, designs, software, and technology associated with Karatly are the intellectual property of Karatly or its licensors. Users may not reproduce, distribute, modify, or commercially exploit any content without prior written consent.

10. Risk Disclosure
Users acknowledge that:
• Precious metal and diamond prices are subject to market fluctuations;
• Past performance does not guarantee future returns;
• Investments in precious metals carry market and liquidity risks.
Karatly does not provide financial, investment, or tax advice. Users are advised to consult professional advisors before making investment decisions.

11. Third-Party Services
Karatly may integrate third-party services including payment gateways, vaulting providers, logistics partners, and verification services. Karatly is not responsible for the acts, delays, or failures of third-party providers.

12. Service Availability
Karatly strives to maintain uninterrupted Services but does not guarantee continuous availability. Services may be temporarily suspended for:
• Maintenance;
• System upgrades;
• Technical issues;
• Regulatory compliance;
• Security reasons.

13. Limitation of Liability
To the maximum extent permitted by law, Karatly shall not be liable for:
• Indirect or consequential damages;
• Loss of profits or business opportunities;
• Delays caused by third parties;
• Market losses due to price fluctuations;
• Unauthorized access resulting from user negligence.
Karatly's total liability shall not exceed the amount directly related to the disputed transaction.

14. Indemnification
Users agree to indemnify and hold harmless Karatly, its directors, employees, partners, and affiliates from any claims, damages, liabilities, or expenses arising from:
• Violation of these Terms;
• Misuse of Services;
• Fraudulent or unlawful activities.

15. Privacy
User information is handled in accordance with Karatly's Privacy Policy. By using the platform, users consent to the collection, storage, and processing of data as described in the Privacy Policy.

16. Suspension & Termination
Karatly reserves the right to suspend or terminate accounts:
• For violations of these Terms;
• For suspicious or fraudulent activity;
• To comply with legal or regulatory obligations.
Termination does not affect obligations or liabilities accrued before termination.

17. Governing Law & Jurisdiction
These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts located in [Insert City], India.

18. Amendments
Karatly reserves the right to update or modify these Terms at any time. Updated Terms will be posted on the platform with a revised effective date. Continued use of Services after updates constitutes acceptance of the revised Terms.

19. Contact Information
For any questions, concerns, or support requests, please contact:
Karatly Support Team
Email: [Insert Email Address]
Phone: [Insert Phone Number]
Website: [Insert Website URL]

20. Acceptance
By accessing or using Karatly Services, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.`;

export function Terms() {
  const navigate = useNavigate();

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
        {/* Status Bar */}
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

        {/* Header */}
        <section className="flex items-center justify-between px-6 pt-10">
          <div className="flex items-center gap-2 text-[#F7CD57]">
            <button type="button" onClick={() => navigate(-1)} aria-label="Back" className="grid h-6 w-6 place-items-center">
              <ArrowLeft size={18} />
            </button>
            <span className="text-[14px] font-normal leading-[21px]">Terms & Condition</span>
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

        {/* Info Card */}
        <section className="mx-6 mt-4">
          <div className="flex items-center gap-4 overflow-hidden rounded-[20px] bg-[linear-gradient(30.18deg,#1E2A28_64.48%,#6C5123_96.45%)] px-6 py-5">
            <div className="grid h-[60px] w-[60px] shrink-0 place-items-center rounded-full bg-[linear-gradient(180deg,#F3C751_0%,#BE8928_100%)] text-[10px] font-bold leading-[12px] tracking-[0.05em] text-black">
              KARATLY
            </div>
            <div>
              <div className="text-[16px] font-bold leading-[19px] text-white">Karatly Legal v2.6</div>
              <div className="mt-1 text-[12px] leading-[14px] text-[#BFBFBF]">Last updated 12 May 2026</div>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-6 mt-4">
          <p className="text-[12px] leading-[14px] text-[#BFBFBF]">
            Welcome to Karatly. These Terms & Conditions ("Terms") govern your access to and use of the Karatly platform, website, mobile application, products, and services ("Services"). By accessing or using Karatly, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use our Services.
          </p>
        </section>

        {/* Terms Heading */}
        <section className="mx-6 mt-6">
          <h2 className="text-[16px] font-bold leading-[19px] text-white">TERMS AND CONDITIONS:</h2>
        </section>

        {/* Scrollable Terms */}
        <section className="mx-6 mt-3">
          <div className="h-[325px] overflow-y-scroll rounded-[20px] border border-[#2E2E2E] bg-[#0F1416] p-4">
            <div className="whitespace-pre-line text-[12px] font-bold leading-[14px] text-white">
              {termsText}
            </div>
          </div>
        </section>
      </main>
    </motion.div>
  );
}
