import React from 'react';

interface GoldTypeChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

export function GoldTypeChip({ label, selected, onClick }: GoldTypeChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${
        selected 
          ? 'bg-accent/20 border-accent text-accent shadow-[0_0_10px_rgba(212,175,55,0.3)]' 
          : 'bg-card border-border text-muted-foreground hover:border-accent/50 hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}
