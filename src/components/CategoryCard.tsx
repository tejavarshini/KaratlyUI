import React from 'react';
import * as Icons from 'lucide-react';

interface CategoryCardProps {
  name: string;
  count: number;
  iconName: string;
  purity: string;
  onClick?: () => void;
}

export function CategoryCard({ name, count, iconName, purity, onClick }: CategoryCardProps) {
  const Icon = (Icons as any)[iconName] || Icons.Box;

  return (
    <div 
      onClick={onClick}
      className="rounded-xl border border-border bg-card p-4 relative overflow-hidden cursor-pointer group active:scale-95 transition-all"
    >
      <div className="absolute -right-4 -top-4 w-20 h-20 bg-accent/5 rounded-full blur-xl group-hover:bg-accent/10 transition-colors" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="w-10 h-10 rounded-full bg-secondary/30 text-secondary-foreground flex items-center justify-center border border-secondary">
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-semibold px-2 py-1 rounded-md bg-accent/10 text-accent border border-accent/20">
          {purity}
        </span>
      </div>
      
      <div>
        <h3 className="font-semibold text-sm text-foreground mb-1">{name}</h3>
        <p className="text-xs text-muted-foreground">{count} items</p>
      </div>
    </div>
  );
}
