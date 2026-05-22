import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { mockData } from '../data/mockData';

export function GoldPriceCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-card border border-accent/20 p-5 shadow-lg mx-4 mt-2">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/10 rounded-full blur-xl -ml-10 -mb-10" />
      
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm text-muted-foreground font-medium mb-1">Live 24K Price (1g)</p>
          <div className="flex items-baseline gap-1">
            <span className="text-accent font-semibold text-2xl">₹</span>
            <span className="font-serif text-4xl font-semibold text-foreground tracking-tight">
              {mockData.goldPrices['24K'].toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-md text-xs font-semibold border border-green-500/20">
          <ArrowUpRight size={14} />
          <span>0.8%</span>
        </div>
      </div>
      
      <div className="relative z-10 mt-4 h-[1px] w-full bg-gradient-to-r from-transparent via-border to-transparent" />
      
      <div className="relative z-10 mt-4 flex justify-between text-xs font-medium">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-muted-foreground">Market Open</span>
        </div>
        <span className="text-muted-foreground">Updates every 5s</span>
      </div>
    </div>
  );
}
