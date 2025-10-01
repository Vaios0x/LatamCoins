'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Users, Zap } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { formatLargeNumber, formatPercentage } from '@/lib/utils/formatters';

interface GlobalMetricsData {
  totalMarketCap: number;
  totalVolume24h: number;
  totalTokens: number;
  activeUsers: number;
  fearGreedIndex: number;
  marketDominance: {
    topToken: string;
    topTokenPercentage: number;
  };
  correlationMatrix: {
    strongest: string;
    weakest: string;
    average: number;
  };
}

/**
 * Métricas globales del mercado crypto LATAM
 * Dashboard principal con KPIs clave
 */
export function GlobalMetrics() {
  const [data, setData] = useState<GlobalMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos
    const loadData = async () => {
      setLoading(true);
      
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData({
        totalMarketCap: 12500000000, // $12.5B
        totalVolume24h: 450000000, // $450M
        totalTokens: 127,
        activeUsers: 45000,
        fearGreedIndex: 65, // 0-100 scale
        marketDominance: {
          topToken: 'DOGGY',
          topTokenPercentage: 23.4
        },
        correlationMatrix: {
          strongest: 'DOGGY-MAD',
          weakest: 'QRA-HUMO',
          average: 0.67
        }
      });
      
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <GlassCard key={i} className="p-4 sm:p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-white/20 rounded mb-2"></div>
              <div className="h-6 bg-white/30 rounded"></div>
            </div>
          </GlassCard>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const metrics = [
    {
      label: 'Market Cap Total',
      value: formatLargeNumber(data.totalMarketCap),
      change: 5.2,
      icon: DollarSign,
      color: 'text-[#00ff41]'
    },
    {
      label: 'Volumen 24h',
      value: formatLargeNumber(data.totalVolume24h),
      change: -2.1,
      icon: Activity,
      color: 'text-[#ff0040]'
    },
    {
      label: 'Tokens Activos',
      value: data.totalTokens.toString(),
      change: 8.3,
      icon: TrendingUp,
      color: 'text-[#00ff41]'
    },
    {
      label: 'Usuarios Activos',
      value: formatLargeNumber(data.activeUsers),
      change: 12.7,
      icon: Users,
      color: 'text-[#00ff41]'
    },
    {
      label: 'Fear & Greed',
      value: `${data.fearGreedIndex}/100`,
      change: 0,
      icon: Zap,
      color: data.fearGreedIndex > 50 ? 'text-[#00ff41]' : 'text-[#ff0040]'
    },
    {
      label: 'Dominancia',
      value: `${data.marketDominance.topTokenPercentage}%`,
      change: -1.2,
      icon: TrendingDown,
      color: 'text-[#ff0040]'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <GlassCard key={index} className="p-4 sm:p-6 text-center">
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2">
                  <Icon className="w-4 h-4 text-[#00ff41]" />
                  <span className="text-xs font-medium text-white/60 uppercase tracking-wide">
                    {metric.label}
                  </span>
                </div>
                <div className={`text-lg sm:text-xl font-bold font-mono ${metric.color}`}>
                  {metric.value}
                </div>
                {metric.change !== 0 && (
                  <div className={`text-xs font-medium ${
                    metric.change >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'
                  }`}>
                    {formatPercentage(metric.change)}
                  </div>
                )}
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Dominancia del Mercado</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Token Líder</span>
              <span className="text-white font-medium">{data.marketDominance.topToken}</span>
            </div>
            <div className="w-full bg-[#00ff41]/10 rounded-full h-2">
              <div 
                className="bg-[#00ff41] h-2 rounded-full transition-all duration-500"
                style={{ width: `${data.marketDominance.topTokenPercentage}%` }}
              />
            </div>
            <div className="text-xs text-white/60">
              {data.marketDominance.topTokenPercentage}% del market cap total
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Correlación de Tokens</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Correlación Más Fuerte</span>
              <span className="text-[#00ff41] font-medium">{data.correlationMatrix.strongest}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Correlación Más Débil</span>
              <span className="text-[#ff0040] font-medium">{data.correlationMatrix.weakest}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/60 text-sm">Promedio General</span>
              <span className="text-white font-medium">{data.correlationMatrix.average.toFixed(2)}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
