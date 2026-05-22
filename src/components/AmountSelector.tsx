import React, { useState } from 'react';

interface AmountSelectorProps {
  presets: number[];
  onSelect: (amount: number) => void;
  value?: number;
}

export function AmountSelector({ presets, onSelect, value }: AmountSelectorProps) {
  const [customAmount, setCustomAmount] = useState<string>('');

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    if (val) onSelect(Number(val));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              setCustomAmount('');
              onSelect(preset);
            }}
            className={`py-3 rounded-lg border text-sm font-semibold transition-all ${
              value === preset && !customAmount
                ? 'bg-accent/20 border-accent text-accent'
                : 'bg-card border-border text-foreground hover:border-accent/50'
            }`}
          >
            ₹{preset.toLocaleString('en-IN')}
          </button>
        ))}
      </div>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="text-muted-foreground font-semibold">₹</span>
        </div>
        <input
          type="text"
          value={customAmount}
          onChange={handleCustomChange}
          placeholder="Enter custom amount"
          className="w-full bg-card border border-border rounded-lg py-4 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all font-semibold"
        />
      </div>
    </div>
  );
}
