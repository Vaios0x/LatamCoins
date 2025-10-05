'use client';

import { useEffect, useMemo, useState } from 'react';
import { LATAM_TOKENS } from '@/lib/constants/tokens';
import { PriceChange } from '@/components/ui/PriceChange';
import { cn } from '@/lib/utils';
import { useCurrency } from '@/components/ui/CurrencySelector';
import { useRealPrices } from '@/lib/hooks/useRealPrices';

/**
 * Barra de ticker con scroll horizontal infinito
 * Muestra precios y cambios de tokens en tiempo real
 */
export function TickerBar() {
  const [isPaused, setIsPaused] = useState(false);
  const [supportsHover, setSupportsHover] = useState(false);
  
  // Usar el hook de moneda
  const { formatPrice } = useCurrency();
  const { tokens } = useRealPrices();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(hover: hover)');
      setSupportsHover(mq.matches);
    }
  }, []);

  // Duplicar tokens para scroll infinito
  const liveData = useMemo(() => {
    // Estructura esperada: { symbol, price, change24h }
    if (Array.isArray(tokens) && tokens.length > 0) return tokens as any[];
    return LATAM_TOKENS as any[];
  }, [tokens]);

  const tickerData = useMemo(() => [...liveData, ...liveData], [liveData]);

  return (
    <div className="relative overflow-hidden bg-[#0a0e27]/80 backdrop-blur-lg border-b border-[#00ff41]/20">
      <div
        className={cn(
          'inline-flex items-center space-x-4 sm:space-x-6 md:space-x-8 py-1 sm:py-2 min-w-max',
          isPaused ? 'animate-pause' : 'animate-ticker-scroll'
        )}
        onMouseEnter={() => supportsHover && setIsPaused(true)}
        onMouseLeave={() => supportsHover && setIsPaused(false)}
      >
        {tickerData.map((token, index) => (
          <div
            key={`${token.symbol}-${index}`}
            className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 whitespace-nowrap"
          >
            {/* Logo del token */}
            <div className="flex items-center space-x-1 sm:space-x-2">
              <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-[#00ff41]">
                  {token.symbol.charAt(0)}
                </span>
              </div>
              <span className="text-white font-medium text-xs sm:text-sm md:text-base">{token.symbol}</span>
            </div>

            {/* Precio */}
            <span className="text-[#00ff41] font-mono text-xs sm:text-sm">
              {formatPrice(token.price)}
            </span>

            {/* Cambio porcentual */}
            <PriceChange 
              change={token.change24h} 
              size="sm"
              showSign={true}
            />

            {/* Separador */}
            <div className="w-px h-3 sm:h-4 bg-[#00ff41]/30" />
          </div>
        ))}
      </div>

      {/* Efecto de fade en los bordes */}
      <div className="absolute left-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-gradient-to-r from-[#0a0e27] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-4 sm:w-6 md:w-8 bg-gradient-to-l from-[#0a0e27] to-transparent pointer-events-none" />
    </div>
  );
}

