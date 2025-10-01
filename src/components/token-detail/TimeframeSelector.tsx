'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const timeframes = [
  { label: '1H', value: '1H' },
  { label: '24H', value: '24H' },
  { label: '7D', value: '7D' },
  { label: '30D', value: '30D' },
  { label: '1Y', value: '1Y' },
  { label: 'ALL', value: 'ALL' },
];

/**
 * Selector de timeframe para el gráfico
 * Botones para cambiar el período de tiempo
 */
export function TimeframeSelector() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');

  return (
    <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto">
      {timeframes.map((timeframe) => (
        <button
          key={timeframe.value}
          onClick={() => setSelectedTimeframe(timeframe.value)}
          className={cn(
            'px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap',
            selectedTimeframe === timeframe.value
              ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40'
              : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
          )}
          aria-label={`Seleccionar timeframe ${timeframe.label}`}
        >
          {timeframe.label}
        </button>
      ))}
    </div>
  );
}
