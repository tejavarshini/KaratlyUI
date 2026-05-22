import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface BrandCardProps {
  name: string;
  trustScore: number;
  verified: boolean;
  colorClass: string;
  onClick?: () => void;
}

export function BrandCard({ name, trustScore, verified, colorClass, onClick }: BrandCardProps) {
  return (
    <div 
      onClick={onClick}
      className="flex-shrink-0 w-36 rounded-xl border border-border bg-card p-3 overflow-hidden relative cursor-pointer active:scale-95 transition-transform"
    >
      <div className={`w-full h-16 rounded-lg ${colorClass} flex items-center justify-center mb-3 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className="font-serif font-bold text-white relative z-10">{name.charAt(0)}</span>
      </div>
      
      <div className="flex items-start justify-between">
        <h3 className="font-semibold text-sm truncate pr-1">{name}</h3>
        {verified && <BadgeCheck size={14} className="text-accent flex-shrink-0 mt-0.5" />}
      </div>
      
      <div className="mt-2">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
          <span>Trust Score</span>
          <span className="text-foreground">{trustScore}%</span>
        </div>
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent rounded-full" 
            style={{ width: `${trustScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}
