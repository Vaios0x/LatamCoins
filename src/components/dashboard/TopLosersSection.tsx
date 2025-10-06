'use client';

import { useState, useEffect, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';

interface TokenLoser {
  rank: number;
  name: string;
  subtitle: string;
  price: number;
  change24h: number;
  symbol: string;
  volume24h: number;
}

/**
 * Componente para mostrar el Top 5 de tokens perdedores 24h
 */
export function TopLosersSection() {
  const { t } = useI18n();
  const [tokens, setTokens] = useState<TokenLoser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar datos (reales o mock)
  const fetchRealData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Datos mock por defecto
    const mockData: TokenLoser[] = [
      {
        rank: 1,
        name: 'TOKEN1',
        subtitle: 'Example Token 1',
        price: 0.00012345,
        change24h: -45.67,
        symbol: 'TK1',
        volume24h: 12345.67
      },
      {
        rank: 2,
        name: 'TOKEN2',
        subtitle: 'Example Token 2',
        price: 0.00098765,
        change24h: -32.45,
        symbol: 'TK2',
        volume24h: 98765.43
      },
      {
        rank: 3,
        name: 'TOKEN3',
        subtitle: 'Example Token 3',
        price: 0.00045678,
        change24h: -28.90,
        symbol: 'TK3',
        volume24h: 45678.90
      },
      {
        rank: 4,
        name: 'TOKEN4',
        subtitle: 'Example Token 4',
        price: 0.00023456,
        change24h: -15.23,
        symbol: 'TK4',
        volume24h: 23456.78
      },
      {
        rank: 5,
        name: 'TOKEN5',
        subtitle: 'Example Token 5',
        price: 0.00034567,
        change24h: -8.76,
        symbol: 'TK5',
        volume24h: 34567.89
      }
    ];

    try {
      console.log('🔄 Fetching real losers data...');
      
      const response = await fetch('/api/tokens', {
        cache: 'no-store',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log('🔍 API Response data:', result.data);
        console.log('🔍 Tokens with change24h:', result.data.map((t: any) => ({ 
          symbol: t.symbol, 
          change24h: t.change24h, 
          price: t.price 
        })));
        
        // Filtrar tokens con cambio negativo y ordenar por peor rendimiento
        const allTokens = result.data;
        const negativeTokens = allTokens.filter((token: any) => {
          const change = token.change24h;
          console.log(`🔍 Token ${token.symbol}: change24h = ${change} (type: ${typeof change})`);
          return change < 0;
        });
        
        console.log(`🔍 Found ${negativeTokens.length} tokens with negative change out of ${allTokens.length} total`);
        
        const losers = negativeTokens
          .sort((a: any, b: any) => a.change24h - b.change24h) // Ordenar de menor a mayor (más negativo primero)
          .slice(0, 5) // Top 5 perdedores
          .map((token: any, index: number) => ({
            rank: index + 1,
            name: token.symbol || 'Unknown',
            subtitle: token.name || 'Unknown Token',
            price: token.price || 0,
            change24h: token.change24h || 0,
            symbol: token.symbol || 'UNK',
            volume24h: token.volume24h || 0
          }));
        
        console.log('🔍 Final losers array:', losers);
        
        // Si hay perdedores reales, usarlos; si no, mostrar mensaje
        if (losers.length > 0) {
          setTokens(losers);
          console.log(`✅ Loaded ${losers.length} losers from real data`);
        } else {
          setTokens([]);
          setError(t('sections.top_losers.no_losers'));
          console.log('⚠️ No real losers found - all tokens are in profit');
        }
      } else {
        throw new Error('API response not successful');
      }
    } catch (err) {
      console.error('❌ Error fetching real losers data:', err);
      setError('Error al cargar datos reales - mostrando datos de ejemplo');
      setTokens(mockData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRealData();
  }, [fetchRealData]);

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
    return `${change.toFixed(2)}%`;
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
            {t('sections.top_losers.title')}
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
            {t('sections.top_losers.subtitle')}
          </p>
        </div>
        
        <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-white/10 rounded-xl p-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ff0040]"></div>
            <span className='ml-3 text-white/70'>{t('sections.top_losers.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
      <div className="text-center mb-8 sm:mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="w-8 h-8 bg-[#ff0040]/20 rounded-lg flex items-center justify-center mr-3">
            <svg className="w-4 h-4 text-[#ff0040]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
            {t('sections.top_losers.title')}
          </h2>
        </div>
        <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
          {t('sections.top_losers.subtitle')}
        </p>
        {error && (
          <div className="mt-4 p-4 bg-[#00ff41]/10 border border-[#00ff41]/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-[#00ff41]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-[#00ff41] text-sm font-medium">
                🎉 {error}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
        {tokens.length > 0 ? (
          <div className="divide-y divide-white/10">
            {tokens.map((token, index) => (
              <div 
                key={token.symbol}
                className="p-4 sm:p-6 hover:bg-white/5 transition-colors duration-200"
                tabIndex={0}
                role="button"
                aria-label={`Token ${token.name} en posición ${token.rank} de perdedores`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                    {/* Badge de ranking */}
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#ff0040] rounded-full flex items-center justify-center">
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
                  
                  {/* Precio, cambio y volumen */}
                  <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-end space-x-4 sm:space-x-0 sm:space-y-1">
                    <div className="text-sm sm:text-lg font-semibold text-white text-right">
                      <span className="block sm:hidden text-xs text-white/60 mb-1">{t('sections.top_losers.price_label')}</span>
                      {formatPrice(token.price)}
                    </div>
                    <div className="text-xs sm:text-sm text-[#ff0040] font-medium">
                      {formatChange(token.change24h)}
                    </div>
                    <div className="text-xs text-white/60 hidden sm:block">
                      {t('sections.top_losers.volume_label')} {formatVolume(token.volume24h)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-[#00ff41]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {t('sections.top_losers.good_news')}
            </h3>
            <p className="text-white/70 text-sm">
              {t('sections.top_losers.all_profitable')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
