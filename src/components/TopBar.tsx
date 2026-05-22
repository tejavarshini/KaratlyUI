import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAppNavigation } from '../lib/navigation';

interface TopBarProps {
  title: string;
  rightAction?: React.ReactNode;
  showBack?: boolean;
}

export function TopBar({ title, rightAction, showBack = true }: TopBarProps) {
  const { goBack } = useAppNavigation();

  return (
    <div className="flex items-center justify-between px-4 py-4 z-40 bg-background sticky top-0">
      <div className="w-10">
        {showBack && (
          <button onClick={goBack} className="p-2 -ml-2 rounded-full hover:bg-muted active:bg-muted text-foreground transition-colors">
            <ChevronLeft size={24} />
          </button>
        )}
      </div>
      <h1 className="font-serif text-lg font-semibold tracking-wide text-foreground">{title}</h1>
      <div className="w-10 flex justify-end">
        {rightAction}
      </div>
    </div>
  );
}
