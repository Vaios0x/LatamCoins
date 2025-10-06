'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

interface MostActiveToken {
  rank: number;
  name: string;
  subtitle: string;
  price: number;
  change24h: number;
  symbol: string;
  trades24h: number;
  volume24h: number;
  activity: number;
}

/**
 * Componente para mostrar tokens más activos
 */
export function MostActiveSection() {
  const { t } = useI18n();
  const [tokens, setTokens] = useState<MostActiveToken[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo con tokens más activos
  const mockData: MostActiveToken[] = [
    {
      rank: 1,
      name: 'DOGGY',
      subtitle: 'HOLDER',
      price: 0.00270800,
      change24h: 812.00,
      symbol: 'DOGGY',
      trades24h: 15420,
      volume24h: 915267.41,
      activity: 98
    },
    {
      rank: 2,
      name: 'QRA',
      subtitle: 'Quira',
      price: 0.00028580,
      change24h: 21.65,
      symbol: 'QRA',
      trades24h: 8930,
      volume24h: 43307.13,
      activity: 87
    },
    {
      rank: 3,
      name: 'MAD',
      subtitle: 'MAD COIN',
      price: 0.00007734,
      change24h: 8.37,
      symbol: 'MAD',
      trades24h: 6720,
      volume24h: 3159.43,
      activity: 82
    },
    {
      rank: 4,
      name: 'Darrkito',
      subtitle: 'Darrkito Strategic Reserve',
      price: 0.00002090,
      change24h: 30.35,
      symbol: 'Darrkito',
      trades24h: 5430,
      volume24h: 6737.73,
      activity: 78
    },
    {
      rank: 5,
      name: 'HUMO',
      subtitle: 'HUMO',
      price: 0.00004197,
      change24h: 3.02,
      symbol: 'HUMO',
      trades24h: 4210,
      volume24h: 2432.9,
      activity: 73
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setTokens(mockData);
      setLoading(false);
    }, 1400);

    return () => clearTimeout(timer);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 1) {
      return `$${price.toFixed(2)}`;
    } else if (price >= 0.01) {
      return `$${price.toFixed(4)}`;
    } else if (price >= 0.0001) {
      return `$${price.toFixed(6)}`;
    } else {
      return `$${price.toFixed(8)}`;
    }
  };

  const formatChange = (change: number) => {
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  const formatTrades = (trades: number) => {
    if (trades >= 1000000) {
      return `${(trades / 1000000).toFixed(1)}M`;
    } else if (trades >= 1000) {
      return `${(trades / 1000).toFixed(1)}K`;
    }
    return trades.toString();
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    }
    return `$${volume.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            {t('sections.most_active.title')}
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
            {t('sections.most_active.subtitle')}
          </p>
        </div>
        
        <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8b5cf6]"></div>
            <span className='ml-3 text-white/70'>{t('sections.most_active.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-[#8b5cf6]/20 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-[#8b5cf6]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {t('sections.most_active.title')}
          </h2>
        </div>
        <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
          {t('sections.most_active.subtitle')}
        </p>
      </div>
      
      <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
        <div className="divide-y divide-white/10">
          {tokens.map((token, index) => (
            <div 
              key={token.symbol}
              className="p-4 sm:p-6 hover:bg-white/5 transition-colors duration-200"
              tabIndex={0}
              role="button"
              aria-label={`Token activo ${token.name} con ${formatTrades(token.trades24h)} trades`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  {/* Badge de ranking púrpura */}
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">
                        {token.rank}
                      </span>
                    </div>
                  </div>
                  
                  {/* Información del token */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                        {token.name}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs bg-[#8b5cf6]/20 text-[#8b5cf6] px-2 py-1 rounded-full">
                          {token.activity}%
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-white/70 truncate">
                      {token.subtitle} • {formatTrades(token.trades24h)} {t('sections.most_active.trades')}
                    </p>
                  </div>
                </div>
                
                {/* Precio, cambio y volumen */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end space-x-4 sm:space-x-0 sm:space-y-1">
                  <div className="text-sm sm:text-lg font-semibold text-white text-right">
                    <span className="block sm:hidden text-xs text-white/60 mb-1">{t('sections.most_active.price_label')}</span>
                    {formatPrice(token.price)}
                  </div>
                  <div className="text-xs sm:text-sm text-[#00ff41] font-medium">
                    {formatChange(token.change24h)}
                  </div>
                  <div className="text-xs text-white/60 hidden sm:block">
                    {t('sections.most_active.volume_label')} {formatVolume(token.volume24h)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
