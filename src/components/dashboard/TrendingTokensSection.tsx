'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

interface TrendingToken {
  rank: number;
  name: string;
  subtitle: string;
  price: number;
  change24h: number;
  symbol: string;
  mentions: number;
  socialScore: number;
}

/**
 * Componente para mostrar tokens trending/populares
 */
export function TrendingTokensSection() {
  const { t } = useI18n();
  const [tokens, setTokens] = useState<TrendingToken[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo con tokens trending
  const mockData: TrendingToken[] = [
    {
      rank: 1,
      name: 'DOGGY',
      subtitle: 'HOLDER',
      price: 0.00270800,
      change24h: 812.00,
      symbol: 'DOGGY',
      mentions: 15420,
      socialScore: 95
    },
    {
      rank: 2,
      name: 'QRA',
      subtitle: 'Quira',
      price: 0.00028580,
      change24h: 21.65,
      symbol: 'QRA',
      mentions: 8930,
      socialScore: 87
    },
    {
      rank: 3,
      name: 'MAD',
      subtitle: 'MAD COIN',
      price: 0.00007734,
      change24h: 8.37,
      symbol: 'MAD',
      mentions: 6720,
      socialScore: 82
    },
    {
      rank: 4,
      name: 'Darrkito',
      subtitle: 'Darrkito Strategic Reserve',
      price: 0.00002090,
      change24h: 30.35,
      symbol: 'Darrkito',
      mentions: 5430,
      socialScore: 78
    },
    {
      rank: 5,
      name: 'HUMO',
      subtitle: 'HUMO',
      price: 0.00004197,
      change24h: 3.02,
      symbol: 'HUMO',
      mentions: 4210,
      socialScore: 73
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setTokens(mockData);
      setLoading(false);
    }, 900);

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

  const formatMentions = (mentions: number) => {
    if (mentions >= 1000000) {
      return `${(mentions / 1000000).toFixed(1)}M`;
    } else if (mentions >= 1000) {
      return `${(mentions / 1000).toFixed(1)}K`;
    }
    return mentions.toString();
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            {t('sections.trending.title')}
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
            {t('sections.trending.subtitle')}
          </p>
        </div>
        
        <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff6b35]"></div>
            <span className='ml-3 text-white/70'>{t('sections.trending.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-[#ff6b35]/20 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-[#ff6b35]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {t('sections.trending.title')}
          </h2>
        </div>
        <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
          {t('sections.trending.subtitle')}
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
              aria-label={`Token trending ${token.name} en posición ${token.rank}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  {/* Badge de ranking con fuego */}
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#ff6b35] to-[#ff8c42] rounded-full flex items-center justify-center">
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
                        <span className="text-xs bg-[#ff6b35]/20 text-[#ff6b35] px-2 py-1 rounded-full">
                          🔥 {token.socialScore}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-white/70 truncate">
                      {token.subtitle} • {formatMentions(token.mentions)} {t('sections.trending.mentions')}
                    </p>
                  </div>
                </div>
                
                {/* Precio y cambio */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end space-x-4 sm:space-x-0 sm:space-y-1">
                  <div className="text-sm sm:text-lg font-semibold text-white text-right">
                    <span className="block sm:hidden text-xs text-white/60 mb-1">{t('sections.trending.price_label')}</span>
                    {formatPrice(token.price)}
                  </div>
                  <div className={`text-xs sm:text-sm font-medium ${
                    token.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'
                  }`}>
                    {formatChange(token.change24h)}
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
