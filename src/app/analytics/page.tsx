'use client';

import { useState, useMemo, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target, Search } from 'lucide-react';
import { formatLargeNumber } from '@/lib/utils/formatters';
import { GlassCard } from '@/components/ui/GlassCard';
import { RealTimePriceChart } from '@/components/analytics/RealTimePriceChart';
import { useCurrency } from '@/components/ui/CurrencySelector';
import { CurrencySelector } from '@/components/ui/CurrencySelector';

// Interface para datos reales de tokens
interface RealTokenData {
  id: string;
  symbol: string;
  name: string;
  contract: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  fdv: number;
  rank: number;
  lastUpdated: string;
  source: string;
  isRealTime: boolean;
  dexScreenerUrl: string;
  pumpUrl: string;
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
}

/**
 * Página de análisis con métricas avanzadas
 * Gráficos, estadísticas y tendencias del mercado
 */
export default function AnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [tokens, setTokens] = useState<RealTokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Usar el hook de moneda
  const { formatPrice } = useCurrency();

  // Cargar datos reales de tokens
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
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
          setTokens(result.data);
          // Seleccionar el primer token por defecto si no hay uno seleccionado
          if (!selectedToken && result.data.length > 0) {
            setSelectedToken(result.data[0].id);
          }
        } else {
          throw new Error('Error al obtener datos de tokens');
        }
      } catch (err) {
        console.error('Error fetching tokens:', err);
        setError('Error al cargar los datos de tokens');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchTokens, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Calcular métricas del mercado
  const marketMetrics = useMemo(() => {
    if (tokens.length === 0) {
      return {
        totalMarketCap: 0,
        totalVolume: 0,
        gainers: 0,
        losers: 0,
        avgChange: 0,
        topGainer: null,
        topLoser: null,
      };
    }

    const totalMarketCap = tokens.reduce((sum, token) => sum + token.marketCap, 0);
    const totalVolume = tokens.reduce((sum, token) => sum + token.volume24h, 0);
    const gainers = tokens.filter(token => token.change24h > 0).length;
    const losers = tokens.filter(token => token.change24h < 0).length;
    const avgChange = tokens.reduce((sum, token) => sum + token.change24h, 0) / tokens.length;
    
    const topGainer = tokens.reduce((max, token) => 
      token.change24h > max.change24h ? token : max
    );
    
    const topLoser = tokens.reduce((min, token) => 
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
  }, [tokens]);

  // Filtrar tokens por búsqueda
  const filteredTokens = useMemo(() => {
    if (!searchQuery.trim()) return tokens;
    
    const query = searchQuery.toLowerCase().trim();
    
    return tokens.filter(token => 
      token.name.toLowerCase().includes(query) ||
      token.symbol.toLowerCase().includes(query) ||
      token.contract.toLowerCase().includes(query)
    );
  }, [tokens, searchQuery]);

  // Obtener token seleccionado
  const currentToken = useMemo(() => {
    return tokens.find(token => token.id === selectedToken) || tokens[0];
  }, [tokens, selectedToken]);

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
          <p className="text-white/70 max-w-3xl text-base sm:text-lg mb-4">
            Análisis profundo del mercado crypto latinoamericano. Tendencias, patrones y oportunidades.
          </p>
          
          {/* Indicador de datos reales */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
            <span className="text-sm text-[#00ff41] font-medium">
              Solo datos reales de APIs - Sin datos simulados
            </span>
          </div>
          
          {/* Controles de análisis */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Selector de token */}
            <div className="flex-1 max-w-md">
              <label className="block text-white/60 text-sm mb-2">Seleccionar Token para Análisis</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff41]/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar token por nombre o símbolo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                />
              </div>
            </div>
            
            {/* Selector de moneda */}
            <CurrencySelector showLabel={true} size="md" />
          </div>
          
          {/* Botones de tokens disponibles */}
          <div className="mt-4">
            <label className="block text-white/60 text-sm mb-3">Tokens Disponibles</label>
            
            {/* Top 4 tokens destacados */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {tokens.slice(0, 4).map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    selectedToken === token.id
                      ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-[#00ff41]">
                        {token.symbol.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-medium">{token.symbol}</div>
                      <div className="text-xs text-white/60 truncate">{token.name}</div>
                    </div>
                  </div>
                  <div className="mt-2 text-center">
                    <div className="text-xs font-mono">{formatPrice(token.price)}</div>
                    <div className={`text-xs ${token.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Tokens adicionales en formato compacto */}
            <div className="flex flex-wrap gap-2">
              {tokens.slice(4, 12).map((token) => (
                <button
                  key={token.id}
                  onClick={() => setSelectedToken(token.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
                    selectedToken === token.id
                      ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40'
                      : 'bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20'
                  }`}
                >
                  <div className="w-6 h-6 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-[#00ff41]">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">{token.symbol}</div>
                    <div className="text-xs text-white/60">{token.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono">{formatPrice(token.price)}</div>
                    <div className={`text-xs ${token.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                    </div>
                  </div>
                </button>
              ))}
              
              {/* Botón para ver más tokens */}
              {tokens.length > 12 && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/20 transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-xs">+</span>
                  </div>
                  <div className="text-sm">
                    +{tokens.length - 12} más
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* Lista de tokens filtrados */}
          {searchQuery && (
            <div className="mt-4 max-h-48 overflow-y-auto bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-lg p-2">
              {filteredTokens.length > 0 ? (
                <div className="space-y-1">
                  {filteredTokens.map((token) => (
                    <button
                      key={token.id}
                      onClick={() => {
                        setSelectedToken(token.id);
                        setSearchQuery('');
                      }}
                      className={`w-full text-left p-2 rounded-lg transition-all duration-300 ${
                        selectedToken === token.id
                          ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/40'
                          : 'hover:bg-white/10 text-white/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-[#00ff41]">
                            {token.symbol.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{token.name}</div>
                          <div className="text-xs text-white/60">{token.symbol}</div>
                        </div>
                        <div className="ml-auto text-right">
                          <div className="text-sm font-mono">{formatPrice(token.price)}</div>
                          <div className={`text-xs ${token.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
                            {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center text-white/60 py-4">
                  No se encontraron tokens que coincidan con &quot;{searchQuery}&quot;
                </div>
              )}
            </div>
          )}
        </div>

        {/* Estados de carga y error */}
        {isLoading && (
          <GlassCard className="p-8 text-center mb-8">
            <div className="text-white/60 text-lg mb-4">Cargando análisis de mercado...</div>
            <div className="animate-spin w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full mx-auto"></div>
          </GlassCard>
        )}

        {error && (
          <GlassCard className="p-8 text-center mb-8">
            <div className="text-[#ff0040] text-lg mb-4">Error al cargar datos</div>
            <p className="text-white/60 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] rounded-lg transition-all duration-300"
            >
              Reintentar
            </button>
          </GlassCard>
        )}

        {/* Métricas principales */}
        {!isLoading && !error && (
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
        )}

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

        {/* Gráfico principal del token seleccionado */}
        {!isLoading && !error && currentToken && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <GlassCard className="lg:col-span-2">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    Análisis de {currentToken.name} ({currentToken.symbol})
                  </h3>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${currentToken.isRealTime ? 'bg-[#00ff41]' : 'bg-[#ff0040]'} animate-pulse`} />
                    <span className="text-sm text-white/60">
                      {currentToken.isRealTime ? 'Datos Reales' : 'Datos Históricos'}
                    </span>
                  </div>
                </div>
                
                {/* Información del token */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-xs text-white/60 mb-1">Precio Actual</div>
                    <div className="text-lg font-mono text-white">{formatPrice(currentToken.price)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/60 mb-1">Cambio 24h</div>
                    <div className={`text-lg font-mono ${currentToken.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
                      {currentToken.change24h >= 0 ? '+' : ''}{currentToken.change24h.toFixed(2)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/60 mb-1">Market Cap</div>
                    <div className="text-lg font-mono text-white">{formatPrice(currentToken.marketCap)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-white/60 mb-1">Volumen 24h</div>
                    <div className="text-lg font-mono text-white">{formatPrice(currentToken.volume24h)}</div>
                  </div>
                </div>
                
                <div className="h-64 sm:h-80">
                  <RealTimePriceChart 
                    token={{
                      id: currentToken.id,
                      symbol: currentToken.symbol,
                      name: currentToken.name,
                      price: currentToken.price,
                      change24h: currentToken.change24h,
                      volume24h: currentToken.volume24h,
                      marketCap: currentToken.marketCap,
                      rank: currentToken.rank,
                      platform: 'Solana',
                      chain: 'Solana',
                      logo: `/tokens/${currentToken.symbol.toLowerCase()}.svg`,
                      ath: 0,
                      atl: 0,
                      sparkline: [],
                      contract: currentToken.contract,
                      supply: 0
                    }} 
                    timeframe={selectedTimeframe}
                  />
                </div>
                
                {/* Enlaces del token */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {currentToken.dexScreenerUrl && (
                    <a
                      href={currentToken.dexScreenerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] text-xs rounded-lg transition-all duration-300"
                    >
                      📊 Ver en DexScreener
                    </a>
                  )}
                  {currentToken.pumpUrl && (
                    <a
                      href={currentToken.pumpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-[#ff6b35]/20 hover:bg-[#ff6b35]/30 border border-[#ff6b35]/50 text-[#ff6b35] text-xs rounded-lg transition-all duration-300"
                    >
                      🚀 Ver en Pump.fun
                    </a>
                  )}
                  <div className="px-3 py-1 bg-white/10 text-white/60 text-xs rounded-lg">
                    Fuente: {currentToken.source}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Top performers */}
        {!isLoading && !error && marketMetrics.topGainer && marketMetrics.topLoser && (
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
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Fuente</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#00ff41]/20 text-[#00ff41]">
                      {marketMetrics.topGainer.source}
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
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Fuente</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-[#ff6b35]/20 text-[#ff6b35]">
                      {marketMetrics.topLoser.source}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Analytics comparativos */}
        {!isLoading && !error && tokens.length > 0 && (
          <div className="mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
              Comparación de Tokens
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Top 5 tokens por market cap */}
              <GlassCard>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-[#00ff41]" />
                    <h3 className="text-lg font-semibold text-white">Top 5 por Market Cap</h3>
                  </div>
                  <div className="space-y-3">
                    {tokens
                      .sort((a, b) => b.marketCap - a.marketCap)
                      .slice(0, 5)
                      .map((token, index) => (
                        <div key={token.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors duration-300">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-[#00ff41]">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium text-white">{token.symbol}</div>
                              <div className="text-xs text-white/60">{token.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono text-white">{formatPrice(token.marketCap)}</div>
                            <div className={`text-xs ${token.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </GlassCard>

              {/* Top 5 tokens por volumen */}
              <GlassCard>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Activity className="w-5 h-5 text-[#00ff41]" />
                    <h3 className="text-lg font-semibold text-white">Top 5 por Volumen 24h</h3>
                  </div>
                  <div className="space-y-3">
                    {tokens
                      .sort((a, b) => b.volume24h - a.volume24h)
                      .slice(0, 5)
                      .map((token, index) => (
                        <div key={token.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors duration-300">
                          <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-[#ff6b35]/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-[#ff6b35]">{index + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium text-white">{token.symbol}</div>
                              <div className="text-xs text-white/60">{token.name}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-mono text-white">{formatPrice(token.volume24h)}</div>
                            <div className={`text-xs ${token.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
                              {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        )}

        {/* Análisis de distribución */}
        {!isLoading && !error && tokens.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <GlassCard className="lg:col-span-2">
              <div className="p-4 sm:p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <PieChart className="w-5 h-5 text-[#00ff41]" />
                  <h3 className="text-lg font-semibold text-white">Distribución por Market Cap</h3>
                </div>
                <div className="space-y-4">
                  {tokens.map((token) => {
                    const percentage = marketMetrics.totalMarketCap > 0 ? (token.marketCap / marketMetrics.totalMarketCap) * 100 : 0;
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
                            <span className="text-xs px-2 py-1 rounded-full bg-white/20 text-white/60">
                              {token.source}
                            </span>
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
                      {tokens.length}
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
                      {formatLargeNumber(tokens.length > 0 ? marketMetrics.totalVolume / tokens.length : 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/60 text-sm">Datos en Tiempo Real</span>
                    <span className="text-[#00ff41] font-mono font-bold">
                      {tokens.filter(token => token.isRealTime).length}/{tokens.length}
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
