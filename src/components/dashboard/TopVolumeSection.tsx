'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

interface TokenVolume {
  rank: number;
  name: string;
  subtitle: string;
  volume24h: number;
  change24h: number;
  symbol: string;
}

/**
 * Componente para mostrar el Top 5 de tokens por volumen 24h
 */
export function TopVolumeSection() {
  const { t } = useI18n();
  const [tokens, setTokens] = useState<TokenVolume[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo basados en la imagen
  const mockData: TokenVolume[] = [
    {
      rank: 1,
      name: 'DOGGY',
      subtitle: 'HOLDER',
      volume24h: 915267.41,
      change24h: 812.00,
      symbol: 'DOGGY'
    },
    {
      rank: 2,
      name: 'QRA',
      subtitle: 'Quira',
      volume24h: 43307.13,
      change24h: 21.65,
      symbol: 'QRA'
    },
    {
      rank: 3,
      name: 'Darrkito',
      subtitle: 'Darrkito Strategic Reserve',
      volume24h: 6737.73,
      change24h: 30.35,
      symbol: 'Darrkito'
    },
    {
      rank: 4,
      name: 'MAD',
      subtitle: 'MAD COIN',
      volume24h: 3159.43,
      change24h: 8.37,
      symbol: 'MAD'
    },
    {
      rank: 5,
      name: 'HUMO',
      subtitle: 'HUMO',
      volume24h: 2432.9,
      change24h: 3.02,
      symbol: 'HUMO'
    }
  ];

  useEffect(() => {
    // Simular carga de datos
    const timer = setTimeout(() => {
      setTokens(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    }
    return `$${volume.toFixed(2)}`;
  };

  const formatChange = (change: number) => {
    return `${change > 0 ? '+' : ''}${change.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            {t('sections.top_volume.title')}
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
            {t('sections.top_volume.subtitle')}
          </p>
        </div>
        
        <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00ff41]"></div>
            <span className="ml-3 text-white/70">{t('sections.top_volume.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-[#00ff41]/20 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-[#00ff41]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {t('sections.top_volume.title')}
          </h2>
        </div>
        <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
          {t('sections.top_volume.subtitle')}
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
              aria-label={`Token ${token.name} en posición ${token.rank}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                  {/* Badge de ranking */}
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#8B4513] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs sm:text-sm">
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
                
                {/* Volumen y cambio */}
                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end space-x-4 sm:space-x-0 sm:space-y-1">
                  <div className="text-sm sm:text-lg font-semibold text-white text-right">
                    <span className="block sm:hidden text-xs text-white/60 mb-1">{t('sections.top_volume.volume_label')}</span>
                    {formatVolume(token.volume24h)}
                  </div>
                  <div className="text-xs sm:text-sm text-[#00ff41] font-medium">
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
