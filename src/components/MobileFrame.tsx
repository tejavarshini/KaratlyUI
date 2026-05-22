import React from 'react';
import { useLocation } from 'react-router-dom';

export function MobileFrame({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isSplash = location.pathname.startsWith('/splash');
  const isAuth = ['/login', '/otp', '/signup'].includes(location.pathname);
  const hasCustomTopChrome = ['/home', '/dashboard', '/market', '/orders'].includes(location.pathname);
  const hideStatusBar = isSplash || isAuth || hasCustomTopChrome;
  const isDashboardArea = ['/home', '/dashboard', '/market', '/orders', '/categories', '/brands', '/cart', '/profile'].includes(location.pathname);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#030303] px-0">
      <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col overflow-hidden bg-background text-foreground shadow-2xl">
        {/* Status Bar Mock */}
        {!hideStatusBar && <div className="h-12 w-full flex items-center justify-between px-6 text-[13px] font-medium z-50 bg-background/80 backdrop-blur-md absolute top-0 left-0 right-0">
          <span>9:30</span>
          <div className="flex items-center gap-2">
            <svg width="18" height="12" viewBox="0 0 18 12" fill="none"><rect x="1" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="6" y="5" width="3" height="7" rx="1" fill="currentColor"/><rect x="11" y="2" width="3" height="10" rx="1" fill="currentColor"/><rect x="16" y="0" width="3" height="12" rx="1" fill="currentColor opacity-30"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 0C3.58172 0 0 3.58172 0 8H16C16 3.58172 12.4183 0 8 0Z" fill="currentColor"/></svg>
            <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="1" y="1" width="21" height="10" rx="3" stroke="currentColor" strokeWidth="1"/><rect x="3" y="3" width="15" height="6" rx="1" fill="currentColor"/><path d="M24 4V8C24 8 25 7.5 25 6C25 4.5 24 4 24 4Z" fill="currentColor"/></svg>
          </div>
        </div>}
        <div className={`relative flex-1 overflow-y-auto overflow-x-hidden no-scrollbar ${hideStatusBar ? '' : 'pt-12'} ${isDashboardArea ? 'px-4 pt-[16px] pb-[100px]' : 'px-0 pb-20'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
