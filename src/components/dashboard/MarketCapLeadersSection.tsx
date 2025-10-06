'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

interface MarketCapLeader {
  rank: number;
  name: string;
  subtitle: string;
  price: number;
  change24h: number;
  symbol: string;
  marketCap: number;
  volume24h: number;
}

/**
 * Componente para mostrar líderes por capitalización de mercado
 */
export function MarketCapLeadersSection() {
  const { t } = useI18n();
  const [tokens, setTokens] = useState<MarketCapLeader[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo con líderes de market cap
  const mockData: MarketCapLeader[] = [
    {
      rank: 1,
      name: 'DOGGY',
      subtitle: 'HOLDER',
      price: 0.00270800,
      change24h: 812.00,
      symbol: 'DOGGY',
      marketCap: 25000000,
      volume24h: 915267.41
    },
    {
      rank: 2,
      name: 'QRA',
      subtitle: 'Quira',
      price: 0.00028580,
      change24h: 21.65,
      symbol: 'QRA',
      marketCap: 15000000,
      volume24h: 43307.13
    },
    {
      rank: 3,
      name: 'MAD',
      subtitle: 'MAD COIN',
      price: 0.00007734,
      change24h: 8.37,
      symbol: 'MAD',
      marketCap: 8000000,
      volume24h: 3159.43
    },
    {
      rank: 4,
      name: 'Darrkito',
      subtitle: 'Darrkito Strategic Reserve',
      price: 0.00002090,
      change24h: 30.35,
      symbol: 'Darrkito',
      marketCap: 5000000,
      volume24h: 6737.73
    },
    {
      rank: 5,
      name: 'HUMO',
      subtitle: 'HUMO',
      price: 0.00004197,
      change24h: 3.02,
      symbol: 'HUMO',
      marketCap: 3000000,
      volume24h: 2432.9
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setTokens(mockData);
      setLoading(false);
    }, 1300);

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

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    } else if (marketCap >= 1000) {
      return `$${(marketCap / 1000).toFixed(2)}K`;
    }
    return `$${marketCap.toFixed(2)}`;
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
            {t('sections.market_cap_leaders.title')}
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
            {t('sections.market_cap_leaders.subtitle')}
          </p>
        </div>
        
        <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ffd700]"></div>
            <span className='ml-3 text-white/70'>{t('sections.market_cap_leaders.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-[#ffd700]/20 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-[#ffd700]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {t('sections.market_cap_leaders.title')}
          </h2>
        </div>
        <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
          {t('sections.market_cap_leaders.subtitle')}
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
              aria-label={`Token líder ${token.name} con market cap ${formatMarketCap(token.marketCap)}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  {/* Badge de ranking dorado */}
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#ffd700] to-[#ffed4e] rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-xs sm:text-sm">
                        {token.rank}
                      </span>
                    </div>
                  </div>
                  
                  {/* Información del token */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base sm:text-lg font-semibold text-white truncate">
                        {token.name}
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-white/70 truncate">
                      {token.subtitle}
                    </p>
                  </div>
                </div>
                
                {/* Precio, cambio, market cap y volumen */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end space-x-4 sm:space-x-0 sm:space-y-1">
                  <div className="text-sm sm:text-lg font-semibold text-white text-right">
                    <span className="block sm:hidden text-xs text-white/60 mb-1">{t('sections.market_cap_leaders.price_label')}</span>
                    {formatPrice(token.price)}
                  </div>
                  <div className="text-xs sm:text-sm text-[#00ff41] font-medium">
                    {formatChange(token.change24h)}
                  </div>
                  <div className="text-xs text-[#ffd700] font-medium hidden sm:block">
                    {t('sections.market_cap_leaders.market_cap_label')} {formatMarketCap(token.marketCap)}
                  </div>
                  <div className="text-xs text-white/60 hidden sm:block">
                    {t('sections.market_cap_leaders.volume_label')} {formatVolume(token.volume24h)}
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
