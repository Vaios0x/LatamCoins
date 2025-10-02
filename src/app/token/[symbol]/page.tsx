'use client';

import { useRealPrices } from '@/lib/hooks/useRealPrices';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatPercentage } from '@/lib/utils/formatters';
import { useCurrency } from '@/components/ui/CurrencySelector';
import { PriceChange } from '@/components/ui/PriceChange';
import { RealTimePriceChart } from '@/components/analytics/RealTimePriceChart';
import { ArrowLeft, ExternalLink, TrendingUp, TrendingDown, DollarSign, BarChart3, Activity } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { TokenChatBot } from '@/components/chat/TokenChatBot';
import { useState } from 'react';

export default function TokenDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  const { tokens, isLoading, hasError } = useRealPrices();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7D');
  const { formatPrice, formatLargeNumber } = useCurrency();
  
  const token = tokens.find((t: { symbol: string }) => t.symbol.toLowerCase() === symbol.toLowerCase());
  
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
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="inline-flex items-center px-4 py-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] rounded-lg transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Link>
          
          <div className="flex items-center space-x-4">
            {tokenData.dexScreenerUrl && (
              <a
                href={tokenData.dexScreenerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#ff6b35]/20 hover:bg-[#ff6b35]/30 border border-[#ff6b35]/50 text-[#ff6b35] rounded-lg transition-all duration-300"
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
                className="inline-flex items-center px-4 py-2 bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 border border-[#8b5cf6]/50 text-[#8b5cf6] rounded-lg transition-all duration-300"
              >
                <Activity className="w-4 h-4 mr-2" />
                Pump.fun
                <ExternalLink className="w-3 h-3 ml-2" />
              </a>
            )}
          </div>
        </div>

        {/* Token Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-[#00ff41]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl font-bold text-[#00ff41]">
              {token.symbol.charAt(0)}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{token.name}</h1>
          <p className="text-xl text-white/60 mb-6">{token.symbol}</p>
          
          {/* Precio Principal */}
          <div className="text-center mb-8">
            <div className="text-5xl md:text-7xl font-mono text-white mb-4">
              {formatPrice(token.price)}
            </div>
            <div className="flex items-center justify-center space-x-4">
              <PriceChange change={token.change24h} size="lg" />
              <span className="text-lg text-white/60">
                {formatPercentage(token.change24h)} en 24h
              </span>
            </div>
          </div>
        </div>

        {/* Gráfico Principal */}
        <GlassCard className="p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Gráfico de Precio</h2>
            <p className="text-white/60">Datos en tiempo real desde DexScreener</p>
          </div>
          
          <div className="h-96 mb-6">
            <RealTimePriceChart token={token} timeframe={selectedTimeframe} />
          </div>
          
          {/* Selectores de tiempo */}
          <div className="flex justify-center space-x-2">
            {['1H', '24H', '7D', '30D', '1Y', 'ALL'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedTimeframe(period)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  period === selectedTimeframe
                    ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50' 
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Métricas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Market Cap</h3>
              <DollarSign className="w-5 h-5 text-[#00ff41]" />
            </div>
            <div className="text-2xl font-mono text-white mb-2">
              {formatLargeNumber(token.marketCap)}
            </div>
            <div className="flex items-center space-x-2">
              {token.change24h >= 0 ? (
                <TrendingUp className="w-4 h-4 text-[#00ff41]" />
              ) : (
                <TrendingDown className="w-4 h-4 text-[#ff0040]" />
              )}
              <span className={`text-sm ${token.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
                {formatPercentage(token.change24h)}
              </span>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Volumen 24h</h3>
              <BarChart3 className="w-5 h-5 text-[#00ff41]" />
            </div>
            <div className="text-2xl font-mono text-white mb-2">
              {formatLargeNumber(token.volume24h)}
            </div>
            <div className="text-sm text-white/60">
              Últimas 24 horas
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">ATH</h3>
              <TrendingUp className="w-5 h-5 text-[#00ff41]" />
            </div>
            <div className="text-2xl font-mono text-white mb-2">
              {formatPrice(token.ath)}
            </div>
            <div className="text-sm text-[#ff0040]">
              -{formatPercentage(((token.ath - token.price) / token.ath) * 100)} desde ATH
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">ATL</h3>
              <TrendingDown className="w-5 h-5 text-[#ff0040]" />
            </div>
            <div className="text-2xl font-mono text-white mb-2">
              {formatPrice(token.atl)}
            </div>
            <div className="text-sm text-[#00ff41]">
              +{formatPercentage(((token.price - token.atl) / token.atl) * 100)} desde ATL
            </div>
          </GlassCard>
        </div>

        {/* Información Adicional */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Información del Token</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white/60">Símbolo:</span>
                <span className="text-white font-mono">{token.symbol}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Nombre:</span>
                <span className="text-white">{token.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Plataforma:</span>
                <span className="text-white">{token.platform}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Cadena:</span>
                <span className="text-white">{token.chain}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Ranking:</span>
                <span className="text-white">#{token.rank}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Suministro:</span>
                <span className="text-white">{formatLargeNumber(token.supply)}</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-bold text-white mb-6">Datos de DexScreener</h3>
            <div className="space-y-4">
              {tokenData.liquidity && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Liquidez:</span>
                  <span className="text-white">{formatLargeNumber(tokenData.liquidity)}</span>
                </div>
              )}
              {tokenData.fdv && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">FDV:</span>
                  <span className="text-white">{formatLargeNumber(tokenData.fdv)}</span>
                </div>
              )}
              {tokenData.source && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Fuente:</span>
                  <span className="text-white">{tokenData.source}</span>
                </div>
              )}
              {tokenData.isRealTime && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Tiempo Real:</span>
                  <span className="text-[#00ff41]">✅ Activo</span>
                </div>
              )}
              {tokenData.lastUpdated && (
                <div className="flex justify-between items-center">
                  <span className="text-white/60">Última Actualización:</span>
                  <span className="text-white text-sm">
                    {new Date(tokenData.lastUpdated).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </GlassCard>
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