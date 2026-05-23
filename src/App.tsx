import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { Routes as AppRoutes } from './lib/routes';

// Import Pages
import { Splash2, Splash3, Splash4, Splash5, Login, OTP, Signup } from './pages/AuthFlow';
import SplashSequence from './pages/SplashSequence';
import OnboardingFlow from './pages/OnboardingFlow';
import { Home, Dashboard, Market, Orders, Categories, Brands, Cart, Profile } from './pages/MainTabs';
import { Buy1, Buy2, Buy3, Buy4, Buy5 } from './pages/BuyFlow';
import { Sell1, Sell2, Sell3, Sell4, Sell5 } from './pages/SellFlow';
import { SIP1, SIP2, SIP3, SIP4, SIP5 } from './pages/SIPFlow';
import { Notifications, Partner, Nearby } from './pages/Modals';
import { BankVerify, BankVerifyLoading } from './pages/BankVerifyFlow';
import { KycVerification } from './pages/KycVerification';
import { PaymentMethods } from './pages/PaymentMethods';
import { Rewards } from './pages/Rewards';
import { Security } from './pages/Security';
import { HelpCenter } from './pages/HelpCenter';
import { Terms } from './pages/Terms';

import { AuthProvider, useAuth } from './store/AuthContext';
import { CartProvider } from './store/CartContext';
import { GoldFlowProvider } from './store/GoldFlowContext';
import { AnimatePresence, LayoutGroup } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';

const TAB_PATHS = [AppRoutes.HOME, AppRoutes.DASHBOARD, AppRoutes.MARKET, AppRoutes.ORDERS, AppRoutes.CATEGORIES, AppRoutes.BRANDS, AppRoutes.CART, AppRoutes.PROFILE, AppRoutes.KYC_VERIFICATION, AppRoutes.PAYMENT_METHODS, AppRoutes.REWARDS, AppRoutes.SECURITY, AppRoutes.HELP_CENTER, AppRoutes.TERMS];

function AppContent() {
  const location = useLocation();
  const locationState = location.state as { backgroundLocation?: typeof location } | null;
  const backgroundLocation = locationState?.backgroundLocation;
  const isBuySheetRoute = location.pathname === AppRoutes.BUY_1 || location.pathname === AppRoutes.BUY_2 || location.pathname === AppRoutes.BUY_3 || location.pathname === AppRoutes.BUY_4 || location.pathname === AppRoutes.BUY_5;
  const isSellSheetRoute = location.pathname === AppRoutes.SELL_1 || location.pathname === AppRoutes.SELL_2 || location.pathname === AppRoutes.SELL_3 || location.pathname === AppRoutes.SELL_4 || location.pathname === AppRoutes.SELL_5;
  const isSipSheetRoute = location.pathname === AppRoutes.SIP_1 || location.pathname === AppRoutes.SIP_2 || location.pathname === AppRoutes.SIP_3 || location.pathname === AppRoutes.SIP_4 || location.pathname === AppRoutes.SIP_5;
  const isSheetRoute = isBuySheetRoute || isSellSheetRoute || isSipSheetRoute;
  const sheetFallbackLocation = backgroundLocation ?? (isSheetRoute ? { pathname: AppRoutes.DASHBOARD, search: '', hash: '', state: null, key: 'sheet-fallback' } as typeof location : undefined);
  const baseLocation = sheetFallbackLocation ?? location;
  const showBottomNav = !isSheetRoute && TAB_PATHS.includes(baseLocation.pathname as typeof TAB_PATHS[number]);

  return (
    <>
      <MobileFrame>
        <LayoutGroup id="karatly-splash-sequence">
          <AnimatePresence mode="wait">
            <Routes location={baseLocation} key={baseLocation.pathname}>
              <Route path={AppRoutes.HOME} element={<Home />} />
              <Route path={AppRoutes.DASHBOARD} element={<Dashboard />} />
              <Route path={AppRoutes.SPLASH1} element={<SplashSequence />} />
              <Route path={AppRoutes.SPLASH2} element={<Splash2 />} />
              <Route path={AppRoutes.SPLASH3} element={<Splash3 />} />
              <Route path={AppRoutes.SPLASH4} element={<Splash4 />} />
              <Route path={AppRoutes.SPLASH5} element={<Splash5 />} />
              <Route path={AppRoutes.ONBOARDING} element={<OnboardingFlow />} />
              <Route path={AppRoutes.LOGIN} element={<Login />} />
              <Route path={AppRoutes.OTP} element={<OTP />} />
              <Route path={AppRoutes.SIGNUP} element={<Signup />} />

             
             
              <Route path={AppRoutes.MARKET} element={<Market />} />
              <Route path={AppRoutes.ORDERS} element={<Orders />} />
              <Route path={AppRoutes.CATEGORIES} element={<Categories />} />
              <Route path={AppRoutes.BRANDS} element={<Brands />} />
              <Route path={AppRoutes.CART} element={<Cart />} />
              <Route path={AppRoutes.PROFILE} element={<Profile />} />
              <Route path={AppRoutes.KYC_VERIFICATION} element={<KycVerification />} />
              <Route path={AppRoutes.PAYMENT_METHODS} element={<PaymentMethods />} />
              <Route path={AppRoutes.REWARDS} element={<Rewards />} />
              <Route path={AppRoutes.SECURITY} element={<Security />} />
              <Route path={AppRoutes.HELP_CENTER} element={<HelpCenter />} />
              <Route path={AppRoutes.TERMS} element={<Terms />} />

              <Route path={AppRoutes.BUY_1} element={<Buy1 />} />
              <Route path={AppRoutes.BUY_2} element={<Buy2 />} />
              <Route path={AppRoutes.BUY_3} element={<Buy3 />} />
              <Route path={AppRoutes.BUY_4} element={<Buy4 />} />
              <Route path={AppRoutes.BUY_5} element={<Buy5 />} />

              <Route path={AppRoutes.SELL_1} element={<Sell1 />} />
              <Route path={AppRoutes.SELL_2} element={<Sell2 />} />
              <Route path={AppRoutes.SELL_3} element={<Sell3 />} />
              <Route path={AppRoutes.SELL_4} element={<Sell4 />} />
              <Route path={AppRoutes.SELL_5} element={<Sell5 />} />

              <Route path={AppRoutes.SIP_1} element={<SIP1 />} />
              <Route path={AppRoutes.SIP_2} element={<SIP2 />} />
              <Route path={AppRoutes.SIP_3} element={<SIP3 />} />
              <Route path={AppRoutes.SIP_4} element={<SIP4 />} />
              <Route path={AppRoutes.SIP_5} element={<SIP5 />} />

              <Route path={AppRoutes.NOTIFICATIONS} element={<Notifications />} />
              <Route path={AppRoutes.PARTNER} element={<Partner />} />
              <Route path={AppRoutes.NEARBY} element={<Nearby />} />

              <Route path={AppRoutes.BANK_VERIFY} element={<BankVerify />} />
              <Route path={AppRoutes.BANK_VERIFY_LOADING} element={<BankVerifyLoading />} />

              <Route path="/" element={<Navigate to={AppRoutes.SPLASH1} replace />} />
              <Route path="*" element={<Navigate to={AppRoutes.SPLASH1} replace />} />
            </Routes>
          </AnimatePresence>

          {isSheetRoute && (
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path={AppRoutes.BUY_1} element={<Buy1 />} />
                <Route path={AppRoutes.BUY_2} element={<Buy2 />} />
                <Route path={AppRoutes.BUY_3} element={<Buy3 />} />
                <Route path={AppRoutes.BUY_4} element={<Buy4 />} />
                <Route path={AppRoutes.BUY_5} element={<Buy5 />} />
                <Route path={AppRoutes.SELL_1} element={<Sell1 />} />
                <Route path={AppRoutes.SELL_2} element={<Sell2 />} />
                <Route path={AppRoutes.SELL_3} element={<Sell3 />} />
                <Route path={AppRoutes.SELL_4} element={<Sell4 />} />
                <Route path={AppRoutes.SELL_5} element={<Sell5 />} />
                <Route path={AppRoutes.SIP_1} element={<SIP1 />} />
                <Route path={AppRoutes.SIP_2} element={<SIP2 />} />
                <Route path={AppRoutes.SIP_3} element={<SIP3 />} />
                <Route path={AppRoutes.SIP_4} element={<SIP4 />} />
                <Route path={AppRoutes.SIP_5} element={<SIP5 />} />
              </Routes>
            </AnimatePresence>
          )}
        </LayoutGroup>
      </MobileFrame>

      {showBottomNav && <BottomNav />}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <GoldFlowProvider>
          <AppContent />
          <Toaster />
        </GoldFlowProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
