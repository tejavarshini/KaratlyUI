import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Routes } from '../lib/routes';

function HomeIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3 6.25L8 2L13 6.25V13.25C13 13.6642 12.6642 14 12.25 14H9.75V9.75H6.25V14H3.75C3.33579 14 3 13.6642 3 13.25V6.25Z"
        stroke={active ? '#F7CD57' : '#726D6D'}
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DashboardIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="1.5" y="1.5" width="5" height="5" rx="1.2" fill={active ? '#F7CD57' : '#726D6D'} />
      <rect x="1.5" y="9.5" width="5" height="5" rx="1.2" fill={active ? '#F7CD57' : '#726D6D'} />
      <rect x="9.5" y="1.5" width="5" height="5" rx="1.2" fill={active ? '#F7CD57' : '#726D6D'} />
      <path
        d="M9.6 11.7L11.2 13.3L14 10.5"
        stroke={active ? '#F7CD57' : '#726D6D'}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MarketIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="9.5" width="2" height="4.5" rx="1" fill={active ? '#F7CD57' : '#726D6D'} />
      <rect x="6.5" y="6.5" width="2" height="7.5" rx="1" fill={active ? '#F7CD57' : '#726D6D'} />
      <rect x="11" y="3.5" width="2" height="10.5" rx="1" fill={active ? '#F7CD57' : '#726D6D'} />
      <path d="M1.5 13.5H14.5" stroke={active ? '#F7CD57' : '#726D6D'} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function OrderIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="3.5" y="2.5" width="8" height="11" rx="1.2" stroke={active ? '#F7CD57' : '#726D6D'} strokeWidth="1.2" />
      <path d="M6 5.5H9.5" stroke={active ? '#F7CD57' : '#726D6D'} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M6 8H9.5" stroke={active ? '#F7CD57' : '#726D6D'} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.5 12.2H10.5" stroke={active ? '#F7CD57' : '#726D6D'} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function ProfileIcon({ active = false }: { active?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="5" r="2.5" stroke={active ? '#F7CD57' : '#726D6D'} strokeWidth="1.2" />
      <path
        d="M3.5 13C4.4 10.9 6.05 9.75 8 9.75C9.95 9.75 11.6 10.9 12.5 13"
        stroke={active ? '#F7CD57' : '#726D6D'}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BottomNav() {
  const location = useLocation();
  const currentPath = location.pathname;

  const tabs = [
    { name: 'Home', path: Routes.HOME, label: 'Home', icon: HomeIcon },
    { name: 'Dashboard', path: Routes.DASHBOARD, label: 'Dashboard', icon: DashboardIcon, exactActive: true },
    { name: 'Market', path: Routes.MARKET, label: 'Market', icon: MarketIcon },
    { name: 'Order', path: Routes.ORDERS, label: 'Order', icon: OrderIcon },
    { name: 'Profile', path: Routes.PROFILE, label: 'Profile', icon: ProfileIcon },
  ];

  return (
    <div className="fixed bottom-[16px] left-1/2 z-[1000] h-[56px] w-[342px] -translate-x-1/2 overflow-hidden rounded-[50px] bg-[#242320] shadow-[0_0_30px_20px_rgba(0,0,0,1)]">
      <div className="grid h-full grid-cols-5 items-center px-[8px]">
        {tabs.map((tab) => {
          const isActive = tab.exactActive ? currentPath === tab.path : currentPath === tab.path || (tab.path !== '/' && currentPath.startsWith(tab.path));
          return (
            <Link key={tab.label} to={tab.path} className="flex h-full flex-col items-center justify-center gap-[2px] text-center">
              <tab.icon active={isActive} />
              <span className={`text-[8px] font-normal leading-[12px] transition-colors ${isActive ? 'text-[#F7CD57]' : 'text-[#726D6D]'}`}>
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
