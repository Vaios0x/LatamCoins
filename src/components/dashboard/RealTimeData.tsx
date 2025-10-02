'use client';

import { useState, useEffect, useCallback } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatPrice, formatLargeNumber, formatPercentage } from '@/lib/utils/formatters';
import { PriceChange } from '@/components/ui/PriceChange';
import { Activity, TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

interface RealTimeDataProps {
  tokenAddress: string;
  tokenSymbol: string;
  tokenName?: string;
}

interface DexScreenerData {
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  liquidity: number;
  fdv: number;
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  lastUpdated: string;
  isRealTime: boolean;
}

export function RealTimeData({ tokenAddress, tokenSymbol, tokenName }: RealTimeDataProps) {
  const [data, setData] = useState<DexScreenerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  const fetchRealTimeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log(`🔄 Fetching real-time data for ${tokenSymbol} (${tokenAddress})`);
      
      const response = await fetch(`/api/tokens`, {
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
        const tokenData = result.data.find((t: { contract: string; symbol: string; id: string }) => 
          t.contract === tokenAddress || t.symbol === tokenSymbol || t.id === tokenAddress
        );
        
        if (tokenData) {
          console.log(`✅ Found real-time data for ${tokenSymbol} from ${tokenData.source}`);
          
          setData({
            price: tokenData.price || 0,
            change24h: tokenData.change24h || 0,
            volume24h: tokenData.volume24h || 0,
            marketCap: tokenData.marketCap || 0,
            liquidity: tokenData.liquidity || 0,
            fdv: tokenData.fdv || 0,
            priceChange: tokenData.priceChange || {
              m5: 0,
              h1: 0,
              h6: 0,
              h24: 0
            },
            lastUpdated: tokenData.lastUpdated || new Date().toISOString(),
            isRealTime: tokenData.isRealTime || false
          });
          setLastUpdate(new Date());
        } else {
          console.warn(`⚠️ Token ${tokenSymbol} not found in API response`);
          setError(`Token ${tokenSymbol} no encontrado en los datos`);
        }
      } else {
        console.error('❌ API response not successful:', result);
        setError('Error al obtener datos de la API');
      }
    } catch (err) {
      console.error('❌ Error fetching real-time data:', err);
      setError('Error de conexión con la API');
    } finally {
      setIsLoading(false);
    }
  }, [tokenAddress, tokenSymbol]);

  useEffect(() => {
    fetchRealTimeData();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchRealTimeData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchRealTimeData]);

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Cargando datos en tiempo real...</p>
        </div>
      </GlassCard>
    );
  }

  if (error || !data) {
    return (
      <GlassCard className="p-6">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-white mb-2">Error de Datos</h3>
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={fetchRealTimeData}
            className="px-4 py-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] rounded-lg transition-all duration-300"
          >
            Reintentar
          </button>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estado en tiempo real */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">
              {tokenName || tokenSymbol} ({tokenSymbol})
            </h3>
            <p className="text-sm text-white/60">Datos en Tiempo Real</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${data.isRealTime ? 'bg-[#00ff41]' : 'bg-[#ff0040]'} animate-pulse`} />
            <span className="text-sm text-white/60">
              {data.isRealTime ? 'LIVE' : 'Simulado'}
            </span>
          </div>
        </div>
        
        <div className="text-center">
          <div className="text-4xl font-mono text-white mb-2">
            {formatPrice(data.price)}
          </div>
          <div className="flex items-center justify-center space-x-4">
            <PriceChange change={data.change24h} size="lg" />
            <span className="text-white/60">
              {formatPercentage(data.change24h)} en 24h
            </span>
          </div>
          
          {/* Contract Address */}
          <div className="mt-4 p-3 bg-black/20 rounded-lg border border-white/10">
            <p className="text-xs text-white/60 mb-1">Contract Address (CA)</p>
            <p className="text-sm font-mono text-white/80 break-all">
              {tokenAddress}
            </p>
          </div>
          
          {/* Enlaces útiles */}
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <a 
              href={`https://dexscreener.com/solana/${tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] text-xs rounded-lg transition-all duration-300"
            >
              📊 DexScreener
            </a>
            <a 
              href={`https://pump.fun/coin/${tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 bg-[#ff6b35]/20 hover:bg-[#ff6b35]/30 border border-[#ff6b35]/50 text-[#ff6b35] text-xs rounded-lg transition-all duration-300"
            >
              🚀 Pump.fun
            </a>
          </div>
          
          <p className="text-sm text-white/60 mt-2">
            Última actualización: {new Date(data.lastUpdated).toLocaleString()}
          </p>
        </div>
      </GlassCard>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Market Cap</h4>
            <DollarSign className="w-5 h-5 text-[#00ff41]" />
          </div>
          <div className="text-2xl font-mono text-white mb-2">
            {formatLargeNumber(data.marketCap)}
          </div>
          <div className="flex items-center space-x-2">
            {data.change24h >= 0 ? (
              <TrendingUp className="w-4 h-4 text-[#00ff41]" />
            ) : (
              <TrendingDown className="w-4 h-4 text-[#ff0040]" />
            )}
            <span className={`text-sm ${data.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
              {formatPercentage(data.change24h)}
            </span>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white">Volumen 24h</h4>
            <BarChart3 className="w-5 h-5 text-[#00ff41]" />
          </div>
          <div className="text-2xl font-mono text-white mb-2">
            {formatLargeNumber(data.volume24h)}
          </div>
          <div className="text-sm text-white/60">
            Últimas 24 horas
          </div>
        </GlassCard>

        {data.liquidity > 0 && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">Liquidez</h4>
              <Activity className="w-5 h-5 text-[#00ff41]" />
            </div>
            <div className="text-2xl font-mono text-white mb-2">
              {formatLargeNumber(data.liquidity)}
            </div>
            <div className="text-sm text-white/60">
              Liquidez total
            </div>
          </GlassCard>
        )}

        {data.fdv > 0 && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-white">FDV</h4>
              <TrendingUp className="w-5 h-5 text-[#00ff41]" />
            </div>
            <div className="text-2xl font-mono text-white mb-2">
              {formatLargeNumber(data.fdv)}
            </div>
            <div className="text-sm text-white/60">
              Fully Diluted Valuation
            </div>
          </GlassCard>
        )}
      </div>

      {/* Cambios de precio detallados */}
      <GlassCard className="p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Cambios de Precio</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm text-white/60 mb-1">5 minutos</div>
            <div className={`text-lg font-mono ${data.priceChange.m5 >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
              {formatPercentage(data.priceChange.m5)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-white/60 mb-1">1 hora</div>
            <div className={`text-lg font-mono ${data.priceChange.h1 >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
              {formatPercentage(data.priceChange.h1)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-white/60 mb-1">6 horas</div>
            <div className={`text-lg font-mono ${data.priceChange.h6 >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
              {formatPercentage(data.priceChange.h6)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-white/60 mb-1">24 horas</div>
            <div className={`text-lg font-mono ${data.priceChange.h24 >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
              {formatPercentage(data.priceChange.h24)}
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Información de actualización */}
      <GlassCard className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-[#00ff41]" />
            <span className="text-sm text-white/60">
              Actualización automática cada 30 segundos
            </span>
          </div>
          <div className="text-sm text-white/60">
            Próxima actualización: {new Date(lastUpdate.getTime() + 30000).toLocaleTimeString()}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
