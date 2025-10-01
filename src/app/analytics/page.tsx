'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target } from 'lucide-react';
import { LATAM_TOKENS } from '@/lib/constants/tokens';
import { formatPrice, formatLargeNumber } from '@/lib/utils/formatters';
import { GlassCard } from '@/components/ui/GlassCard';
import { PriceChart } from '@/components/token-detail/PriceChart';

/**
 * Página de análisis con métricas avanzadas
 * Gráficos, estadísticas y tendencias del mercado
 */
export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');

  // Calcular métricas del mercado
  const marketMetrics = useMemo(() => {
    const totalMarketCap = LATAM_TOKENS.reduce((sum, token) => sum + token.marketCap, 0);
    const totalVolume = LATAM_TOKENS.reduce((sum, token) => sum + token.volume24h, 0);
    const gainers = LATAM_TOKENS.filter(token => token.change24h > 0).length;
    const losers = LATAM_TOKENS.filter(token => token.change24h < 0).length;
    const avgChange = LATAM_TOKENS.reduce((sum, token) => sum + token.change24h, 0) / LATAM_TOKENS.length;
    
    const topGainer = LATAM_TOKENS.reduce((max, token) => 
      token.change24h > max.change24h ? token : max
    );
    
    const topLoser = LATAM_TOKENS.reduce((min, token) => 
      token.change24h < min.change24h ? token : min
    );

    return {
      totalMarketCap,
      totalVolume,
      gainers,
      losers,
      avgChange,
      topGainer,
      topLoser,
    };
  }, []);

  const timeframes = [
    { label: '1H', value: '1H' },
    { label: '24H', value: '24H' },
    { label: '7D', value: '7D' },
    { label: '30D', value: '30D' },
    { label: '1Y', value: '1Y' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        {/* Header de la página */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-white">Análisis</span>
            <span className="text-[#00ff41] neon-text animate-neon-pulse ml-2">LATAM</span>
          </h1>
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            Análisis profundo del mercado crypto latinoamericano. Tendencias, patrones y oportunidades.
          </p>
        </div>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <GlassCard className="text-center p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <BarChart3 className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">
                  Market Cap Total
                </h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                {formatLargeNumber(marketMetrics.totalMarketCap)}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="text-center p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Activity className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">
                  Volumen 24h
                </h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white font-mono">
                {formatLargeNumber(marketMetrics.totalVolume)}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="text-center p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <TrendingUp className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">
                  Tokens en Verde
                </h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#00ff41] font-mono">
                {marketMetrics.gainers}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="text-center p-4 sm:p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <TrendingDown className="w-5 h-5 text-[#ff0040]" />
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wide">
                  Tokens en Rojo
                </h3>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-[#ff0040] font-mono">
                {marketMetrics.losers}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Selector de timeframe */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40'
                    : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
                aria-label={`Seleccionar timeframe ${timeframe.label}`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gráfico principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          <GlassCard className="lg:col-span-2">
            <div className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">
                Tendencias del Mercado LATAM
              </h3>
              <div className="h-64 sm:h-80">
                <PriceChart 
                  token={LATAM_TOKENS[0]} 
                  timeframe={selectedTimeframe}
                />
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Top performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Top Gainer */}
          <GlassCard>
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-lg font-semibold text-white">Mayor Ganador</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-[#00ff41]">
                      {marketMetrics.topGainer.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{marketMetrics.topGainer.name}</div>
                    <div className="text-sm text-white/60">{marketMetrics.topGainer.symbol}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Cambio 24h</span>
                  <span className="text-[#00ff41] font-mono font-bold">
                    +{marketMetrics.topGainer.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Precio</span>
                  <span className="text-white font-mono">
                    {formatPrice(marketMetrics.topGainer.price)}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Top Loser */}
          <GlassCard>
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingDown className="w-5 h-5 text-[#ff0040]" />
                <h3 className="text-lg font-semibold text-white">Mayor Perdedor</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#ff0040]/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-[#ff0040]">
                      {marketMetrics.topLoser.symbol.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-white">{marketMetrics.topLoser.name}</div>
                    <div className="text-sm text-white/60">{marketMetrics.topLoser.symbol}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Cambio 24h</span>
                  <span className="text-[#ff0040] font-mono font-bold">
                    {marketMetrics.topLoser.change24h.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Precio</span>
                  <span className="text-white font-mono">
                    {formatPrice(marketMetrics.topLoser.price)}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Análisis de distribución */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <GlassCard className="lg:col-span-2">
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <PieChart className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-lg font-semibold text-white">Distribución por Market Cap</h3>
              </div>
              <div className="space-y-4">
                {LATAM_TOKENS.map((token) => {
                  const percentage = (token.marketCap / marketMetrics.totalMarketCap) * 100;
                  return (
                    <div key={token.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-[#00ff41]">
                              {token.symbol.charAt(0)}
                            </span>
                          </div>
                          <span className="text-white font-medium">{token.name}</span>
                        </div>
                        <span className="text-white/60 text-sm">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-[#00ff41]/10 rounded-full h-2">
                        <div 
                          className="bg-[#00ff41] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-4 sm:p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Target className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-lg font-semibold text-white">Métricas Clave</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Cambio Promedio</span>
                  <span className={`font-mono font-bold ${
                    marketMetrics.avgChange >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'
                  }`}>
                    {marketMetrics.avgChange >= 0 ? '+' : ''}{marketMetrics.avgChange.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Tokens Totales</span>
                  <span className="text-white font-mono font-bold">
                    {LATAM_TOKENS.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Ratio Verde/Rojo</span>
                  <span className="text-white font-mono font-bold">
                    {marketMetrics.gainers}:{marketMetrics.losers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Volumen Promedio</span>
                  <span className="text-white font-mono font-bold">
                    {formatLargeNumber(marketMetrics.totalVolume / LATAM_TOKENS.length)}
                  </span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
