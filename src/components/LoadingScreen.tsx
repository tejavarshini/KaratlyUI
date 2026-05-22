import React, { useEffect, useState } from 'react';

export function LoadingScreen({ text = "Processing..." }: { text?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.floor(Math.random() * 15) + 5;
      });
    }, 300);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 min-h-[50vh]">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div 
          className="absolute inset-0 rounded-full border-4 border-accent border-t-transparent animate-spin" 
          style={{ animationDuration: '1.5s' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-accent/20 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 bg-accent rounded-full shadow-[0_0_15px_rgba(212,175,55,0.8)]" />
          </div>
        </div>
      </div>
      
      <h3 className="font-semibold text-lg text-foreground mb-2">{text}</h3>
      <p className="text-muted-foreground text-sm font-mono mb-4">{Math.min(progress, 100)}%</p>
      
      <div className="w-48 h-1.5 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent transition-all duration-300 ease-out rounded-full shadow-[0_0_5px_rgba(212,175,55,0.5)]" 
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}
