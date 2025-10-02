'use client';

import { Token } from '@/lib/constants/tokens';
import { formatPercentage } from '@/lib/utils/formatters';
import { GlassCard } from '@/components/ui/GlassCard';
import { useCurrency } from '@/components/ui/CurrencySelector';

interface StatsGridProps {
  token: Token;
}

/**
 * Grid de estadísticas del token
 * Muestra métricas clave en tarjetas
 */
export function StatsGrid({ token }: StatsGridProps) {
  // Usar el hook de moneda
  const { formatPrice } = useCurrency();
  
  const stats = [
    {
      label: 'Market Cap',
      value: formatPrice(token.marketCap),
      change: token.change24h,
    },
    {
      label: 'Volumen 24h',
      value: formatPrice(token.volume24h),
      change: 0, // No hay cambio para volumen
    },
    {
      label: 'ATH',
      value: formatPrice(token.ath),
      change: ((token.price - token.ath) / token.ath) * 100,
    },
    {
      label: 'ATL',
      value: formatPrice(token.atl),
      change: ((token.price - token.atl) / token.atl) * 100,
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4">
      {stats.map((stat) => (
        <GlassCard key={stat.label} className="p-3 sm:p-4">
          <div className="space-y-1 sm:space-y-2">
            <div className="text-xs sm:text-sm text-white/60 uppercase tracking-wide">
              {stat.label}
            </div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">
              {stat.value}
            </div>
            {stat.change !== 0 && (
              <div className={`text-xs sm:text-sm font-medium ${
                stat.change >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'
              }`}>
                {formatPercentage(stat.change)}
              </div>
            )}
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
