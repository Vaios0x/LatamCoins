'use client';

import { useRealPrices } from '@/lib/hooks/useRealPrices';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatPercentage } from '@/lib/utils/formatters';
import { useCurrency } from '@/components/ui/CurrencySelector';
import { PriceChange } from '@/components/ui/PriceChange';
import { RealTimePriceChart } from '@/components/analytics/RealTimePriceChart';
import { SimpleCandlestickChart } from '@/components/charts/SimpleCandlestickChart';
import { TimeframeSelector } from '@/components/charts/TimeframeSelector';
import { TechnicalIndicators } from '@/components/charts/TechnicalIndicators';
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, DollarSign, BarChart3, Activity, Star, Share2, Copy, CheckCircle, Users, Heart, Zap, Target, Globe, Clock, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TokenChatBot } from '@/components/chat/TokenChatBot';
import { useState } from 'react';

export default function TokenDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { tokens, isLoading, hasError } = useRealPrices();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { formatPrice, formatLargeNumber } = useCurrency();
  
  const token = tokens.find((t: { symbol: string }) => t.symbol.toLowerCase() === symbol.toLowerCase());
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Cargando datos del token...</p>
        </div>
      </div>
    );
  }

  if (hasError || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-white mb-2">Token no encontrado</h1>
          <p className="text-white/60 mb-6">El token {symbol} no está disponible</p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tokenData = token;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
      {/* Header Navigation */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pt-16 sm:pt-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <Link 
            href="/"
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] rounded-lg transition-all duration-300 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            {tokenData.dexScreenerUrl && (
              <a
                href={tokenData.dexScreenerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-[#ff6b35]/20 hover:bg-[#ff6b35]/30 border border-[#ff6b35]/50 text-[#ff6b35] rounded-lg transition-all duration-300 text-sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                DexScreener
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            )}
            {tokenData.pumpUrl && (
              <a
                href={tokenData.pumpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 sm:px-4 py-2 bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 border border-[#8b5cf6]/50 text-[#8b5cf6] rounded-lg transition-all duration-300 text-sm"
              >
                <Activity className="w-4 h-4 mr-2" />
                Pump.fun
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            )}
          </div>
        </div>

        {/* Main Layout - Responsive Design */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Left Panel - Token Info & Metrics */}
          <div className="xl:col-span-3 space-y-4 lg:space-y-6">
            {/* Token Profile Card */}
            <GlassCard className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#00ff41] to-[#00cc33] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl sm:text-2xl font-bold text-white">
                      {token.symbol.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-white truncate">{token.name}</h1>
                    <p className="text-white/60 text-sm sm:text-base">{token.symbol}</p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 mt-2">
                      <span className="text-xs sm:text-sm text-white/60">perrillo 20d ago</span>
                      <button className="text-xs bg-[#00ff41]/20 text-[#00ff41] px-2 py-1 rounded">
                        {token.contract?.slice(0, 4)}...{token.contract?.slice(-4)}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row sm:flex-col space-x-2 sm:space-x-0 sm:space-y-2 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none p-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4 text-[#00ff41] mx-auto" />
                  </button>
                  <button className="flex-1 sm:flex-none p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                    <Star className="w-4 h-4 text-white/60 mx-auto" />
                  </button>
                </div>
              </div>

              {/* Current Price */}
              <div className="mb-4 sm:mb-6">
                <div className="text-2xl sm:text-3xl font-mono text-white mb-2">
                  {formatPrice(token.price)}
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                  <PriceChange change={token.change24h} size="lg" />
                  <span className="text-xs sm:text-sm text-white/60">
                    {formatPercentage(token.change24h)} en 24h
                  </span>
                </div>
              </div>

              {/* Market Cap Progress */}
              <div className="mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 space-y-1 sm:space-y-0">
                  <span className="text-xs sm:text-sm text-white/60">Market Cap</span>
                  <span className="text-xs sm:text-sm text-white/60">ATH ${formatLargeNumber(token.ath * (token.supply || 1000000000))}</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#00ff41] to-[#00cc33] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min((token.marketCap / (token.ath * (token.supply || 1000000000))) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="text-lg sm:text-2xl font-bold text-white mt-2">
                  {formatLargeNumber(token.marketCap)}
                </div>
                <div className="text-xs sm:text-sm text-[#00ff41]">
                  +{formatLargeNumber(token.marketCap - (token.atl * (token.supply || 1000000000)))} (+{formatPercentage(token.change24h)})
                </div>
              </div>
            </GlassCard>

            {/* Key Metrics */}
            <GlassCard className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Métricas Clave</h3>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">MC</span>
                  <span className="text-xs sm:text-sm text-white font-mono truncate">{formatLargeNumber(token.marketCap)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">FDV</span>
                  <span className="text-xs sm:text-sm text-white font-mono truncate">{formatLargeNumber(token.fdv || token.marketCap)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Liquidez</span>
                  <span className="text-xs sm:text-sm text-white font-mono truncate">{formatLargeNumber(token.liquidity || 0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Holders</span>
                  <span className="text-xs sm:text-sm text-white font-mono">952</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Likes</span>
                  <span className="text-xs sm:text-sm text-white font-mono">3</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Org Score</span>
                  <span className="text-xs sm:text-sm text-white font-mono">70.0</span>
                </div>
              </div>
            </GlassCard>

            {/* Performance Changes */}
            <GlassCard className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Rendimiento</h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-xs sm:text-sm text-white/60">5m</div>
                  <div className="text-sm sm:text-lg font-mono text-[#ff0040]">-7.41%</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-xs sm:text-sm text-white/60">1h</div>
                  <div className="text-sm sm:text-lg font-mono text-[#00ff41]">+103.09%</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-xs sm:text-sm text-white/60">6h</div>
                  <div className="text-sm sm:text-lg font-mono text-[#00ff41]">12x</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded-lg">
                  <div className="text-xs sm:text-sm text-white/60">24h</div>
                  <div className="text-sm sm:text-lg font-mono text-[#00ff41]">11x</div>
                </div>
              </div>
            </GlassCard>

            {/* 24h Activity */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Actividad 24h</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/60">24h Vol</span>
                  <span className="text-white font-mono">{formatLargeNumber(token.volume24h)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Net Vol</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono">{formatLargeNumber(token.volume24h * 0.1)}</span>
                    <div className="w-16 bg-white/10 rounded-full h-1">
                      <div className="w-8 bg-[#00ff41] h-1 rounded-full"></div>
                    </div>
                    <span className="text-xs text-[#00ff41]">54% Buy</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">24h Traders</span>
                  <span className="text-white font-mono">497</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Net Buyers</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono">152</span>
                    <div className="w-16 bg-white/10 rounded-full h-1">
                      <div className="w-11 bg-[#ff6b35] h-1 rounded-full"></div>
                    </div>
                    <span className="text-xs text-[#ff6b35]">69% Sell</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Center Panel - Chart */}
          <div className="xl:col-span-6">
            <GlassCard className="p-4 sm:p-6">
              {/* Chart Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <TimeframeSelector 
                  selectedTimeframe={selectedTimeframe}
                  onTimeframeChange={setSelectedTimeframe}
                  className="flex-wrap gap-1 sm:gap-2"
                />
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-lg sm:text-2xl font-mono text-white">{formatPrice(token.price)}</div>
                  <div className="text-xs sm:text-sm text-white/60">
                    {formatPercentage(token.change24h)} ({formatPrice(token.price - (token.price / (1 + token.change24h / 100)))})
                  </div>
                </div>
              </div>

              {/* Simple Candlestick Chart */}
              <div className="h-64 sm:h-80 lg:h-96 mb-4 sm:mb-6">
                <SimpleCandlestickChart 
                  token={token} 
                  timeframe={selectedTimeframe}
                  height={400}
                />
              </div>

              {/* Technical Indicators */}
              <div className="mb-4 sm:mb-6">
                <TechnicalIndicators />
              </div>

              {/* Chart Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm text-white/60 space-y-1 sm:space-y-0">
                <div className="break-words">
                  {token.symbol}/USD Market Cap (USD) · {selectedTimeframe} · Pump O{formatLargeNumber(token.atl * (token.supply || 1000000000))} H{formatLargeNumber(token.ath * (token.supply || 1000000000))} L{formatLargeNumber(token.marketCap * 0.5)} C{formatLargeNumber(token.marketCap)} {formatLargeNumber(token.marketCap * 0.4)} (+{formatPercentage(token.change24h)})
                </div>
                <div className="text-xs sm:text-sm">Volume {formatLargeNumber(token.volume24h)}</div>
              </div>
            </GlassCard>
          </div>

          {/* Right Panel - Token Information & Links */}
          <div className="xl:col-span-3">
            {/* Token Information */}
            <GlassCard className="p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Información del Token</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Símbolo:</span>
                  <span className="text-xs sm:text-sm text-white font-mono">{token.symbol}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Nombre:</span>
                  <span className="text-xs sm:text-sm text-white truncate">{token.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Plataforma:</span>
                  <span className="text-xs sm:text-sm text-white">{token.platform}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Cadena:</span>
                  <span className="text-xs sm:text-sm text-white">{token.chain}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Ranking:</span>
                  <span className="text-xs sm:text-sm text-white">#{token.rank}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Suministro:</span>
                  <span className="text-xs sm:text-sm text-white font-mono truncate">{formatLargeNumber(token.supply)}</span>
                </div>
                {token.contract && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-white/60">Contrato:</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm text-white font-mono">
                        {token.contract.slice(0, 6)}...{token.contract.slice(-4)}
                      </span>
                      <button 
                        onClick={() => copyToClipboard(token.contract)}
                        className="p-1 hover:bg-white/10 rounded transition-colors"
                      >
                        {copied ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#00ff41]" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4 text-white/60" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* DexScreener Data */}
            <GlassCard className="p-4 sm:p-6 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Datos de DexScreener</h3>
              <div className="space-y-3 sm:space-y-4">
                {tokenData.liquidity && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-white/60">Liquidez:</span>
                    <span className="text-xs sm:text-sm text-white font-mono truncate">{formatLargeNumber(tokenData.liquidity)}</span>
                  </div>
                )}
                {tokenData.fdv && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-white/60">FDV:</span>
                    <span className="text-xs sm:text-sm text-white font-mono truncate">{formatLargeNumber(tokenData.fdv)}</span>
                  </div>
                )}
                {tokenData.source && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-white/60">Fuente:</span>
                    <span className="text-xs sm:text-sm text-white">{tokenData.source}</span>
                  </div>
                )}
                {tokenData.isRealTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-white/60">Tiempo Real:</span>
                    <span className="text-[#00ff41] flex items-center text-xs sm:text-sm">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      Activo
                    </span>
                  </div>
                )}
                {tokenData.lastUpdated && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs sm:text-sm text-white/60">Última Actualización:</span>
                    <span className="text-white text-xs sm:text-sm">
                      {new Date(tokenData.lastUpdated).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Trading Platforms */}
            <GlassCard className="p-4 sm:p-6 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Plataformas de Trading</h3>
              <div className="space-y-3 sm:space-y-4">
                {tokenData.dexScreenerUrl && (
                  <a
                    href={tokenData.dexScreenerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 sm:p-4 bg-[#ff6b35]/10 hover:bg-[#ff6b35]/20 border border-[#ff6b35]/30 rounded-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff6b35]" />
                      <div>
                        <div className="text-sm sm:text-base text-white font-medium">DexScreener</div>
                        <div className="text-xs sm:text-sm text-white/60">Análisis y gráficos</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 group-hover:text-[#ff6b35] transition-colors" />
                  </a>
                )}
                {tokenData.pumpUrl && (
                  <a
                    href={tokenData.pumpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 sm:p-4 bg-[#8b5cf6]/10 hover:bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 rounded-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b5cf6]" />
                      <div>
                        <div className="text-sm sm:text-base text-white font-medium">Pump.fun</div>
                        <div className="text-xs sm:text-sm text-white/60">Trading directo</div>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 group-hover:text-[#8b5cf6] transition-colors" />
                  </a>
                )}
                <div className="text-center text-xs sm:text-sm text-white/60 mt-3 sm:mt-4">
                  <p>💡 <strong>Nota:</strong> Este sitio es solo informativo</p>
                  <p>Para trading, visita las plataformas oficiales</p>
                </div>
              </div>
            </GlassCard>

            {/* Historical Data */}
            <GlassCard className="p-4 sm:p-6 mt-4 sm:mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Datos Históricos</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">ATH (All-Time High):</span>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm text-white font-mono">{formatPrice(token.ath)}</div>
                    <div className="text-xs sm:text-sm text-[#ff0040]">
                      -{formatPercentage(((token.ath - token.price) / token.ath) * 100)} desde ATH
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">ATL (All-Time Low):</span>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm text-white font-mono">{formatPrice(token.atl)}</div>
                    <div className="text-xs sm:text-sm text-[#00ff41]">
                      +{formatPercentage(((token.price - token.atl) / token.atl) * 100)} desde ATL
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Volumen 24h:</span>
                  <span className="text-xs sm:text-sm text-white font-mono truncate">{formatLargeNumber(token.volume24h)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm text-white/60">Market Cap:</span>
                  <span className="text-xs sm:text-sm text-white font-mono truncate">{formatLargeNumber(token.marketCap)}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
      
      {/* Chatbot específico para este token */}
      <TokenChatBot 
        tokenData={{
          symbol: tokenData.symbol,
          name: tokenData.name,
          price: tokenData.price,
          change24h: tokenData.change24h,
          marketCap: tokenData.marketCap,
          contract: tokenData.contract
        }}
      />
    </div>
  );
}