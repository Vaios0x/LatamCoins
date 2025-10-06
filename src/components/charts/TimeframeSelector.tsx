'use client';

import { useState } from 'react';
import { Clock, TrendingUp, BarChart3 } from 'lucide-react';

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onTimeframeChange: (timeframe: string) => void;
  className?: string;
}

const timeframes = [
  { value: '1m', label: '1m', icon: Clock },
  { value: '5m', label: '5m', icon: Clock },
  { value: '15m', label: '15m', icon: TrendingUp },
  { value: '1h', label: '1h', icon: BarChart3 },
  { value: '4h', label: '4h', icon: BarChart3 },
  { value: '1d', label: '1d', icon: BarChart3 }
];

export function TimeframeSelector({ 
  selectedTimeframe, 
  onTimeframeChange,
  className = '' 
}: TimeframeSelectorProps) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {timeframes.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          onClick={() => onTimeframeChange(value)}
          className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            selectedTimeframe === value
              ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50 shadow-lg'
              : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
          }`}
        >
          <Icon className="w-3 h-3" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
