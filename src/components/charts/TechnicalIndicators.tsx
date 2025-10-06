'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

interface TechnicalIndicatorsProps {
  className?: string;
}

interface Indicator {
  name: string;
  value: number;
  change: number;
  status: 'bullish' | 'bearish' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
}

export function TechnicalIndicators({ className = '' }: TechnicalIndicatorsProps) {
  const [activeIndicator, setActiveIndicator] = useState<string | null>(null);

  const indicators: Indicator[] = [
    {
      name: 'RSI',
      value: 65.4,
      change: 2.3,
      status: 'bullish',
      icon: TrendingUp
    },
    {
      name: 'MACD',
      value: 0.0012,
      change: 0.0003,
      status: 'bullish',
      icon: Activity
    },
    {
      name: 'BB Position',
      value: 0.8,
      change: -0.1,
      status: 'neutral',
      icon: Target
    },
    {
      name: 'Volume',
      value: 1250000,
      change: 15.2,
      status: 'bullish',
      icon: TrendingUp
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'bullish': return 'text-[#00ff41]';
      case 'bearish': return 'text-[#ff0040]';
      default: return 'text-[#ff6b35]';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'bullish': return 'bg-[#00ff41]/10 border-[#00ff41]/30';
      case 'bearish': return 'bg-[#ff0040]/10 border-[#ff0040]/30';
      default: return 'bg-[#ff6b35]/10 border-[#ff6b35]/30';
    }
  };

  const formatValue = (name: string, value: number) => {
    if (name === 'Volume') {
      return value >= 1000000 
        ? `${(value / 1000000).toFixed(1)}M`
        : `${(value / 1000).toFixed(0)}K`;
    }
    return value.toFixed(4);
  };

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2 ${className}`}>
      {indicators.map((indicator) => {
        const Icon = indicator.icon;
        const isActive = activeIndicator === indicator.name;
        
        return (
          <button
            key={indicator.name}
            onClick={() => setActiveIndicator(isActive ? null : indicator.name)}
            className={`
              flex flex-col items-center p-3 rounded-lg border transition-all duration-200
              ${isActive ? 'scale-105 shadow-lg' : 'hover:scale-105'}
              ${getStatusBg(indicator.status)}
            `}
          >
            <div className="flex items-center space-x-2 mb-1">
              <Icon className={`w-4 h-4 ${getStatusColor(indicator.status)}`} />
              <span className="text-xs font-medium text-white/80">{indicator.name}</span>
            </div>
            
            <div className="text-center">
              <div className={`text-sm font-mono font-bold ${getStatusColor(indicator.status)}`}>
                {formatValue(indicator.name, indicator.value)}
              </div>
              <div className={`text-xs flex items-center ${
                indicator.change >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'
              }`}>
                {indicator.change >= 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(indicator.change).toFixed(1)}%
              </div>
            </div>

            {/* Tooltip expandido */}
            {isActive && (
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-10">
                <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-3 min-w-[200px]">
                  <div className="text-xs text-white/60 mb-2">{indicator.name} Analysis</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-white/60">Current:</span>
                      <span className="text-white">{formatValue(indicator.name, indicator.value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Change:</span>
                      <span className={indicator.change >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}>
                        {indicator.change >= 0 ? '+' : ''}{indicator.change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Signal:</span>
                      <span className={getStatusColor(indicator.status)}>
                        {indicator.status === 'bullish' ? 'Buy' : 
                         indicator.status === 'bearish' ? 'Sell' : 'Hold'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
