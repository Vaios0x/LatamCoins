'use client';

// import { GLOBAL_STATS } from '@/lib/constants/tokens';
import { formatPercentage } from '@/lib/utils/formatters';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRealPrices } from '@/lib/hooks/useRealPrices';
import { useCurrency } from '@/components/ui/CurrencySelector';
// import { ApiStatusNotification } from '@/components/ui/ApiStatusNotification';

/**
 * Sección hero del dashboard
 * Estadísticas globales y título principal
 */
export function HeroSection() {
  const { 
    globalStats, 
    isLoading, 
    hasError
  } = useRealPrices();
  
  // Usar el hook de moneda
  const { formatPrice } = useCurrency();
  
  const stats = [
    {
      label: 'Total Market Cap',
      value: formatPrice(globalStats.totalMarketCap),
      change: globalStats.averageChange24h,
    },
    {
      label: '24h Volume',
      value: formatPrice(globalStats.totalVolume24h),
      change: 0, // No hay cambio para volumen
    },
    {
      label: 'Tokens Tracked',
      value: globalStats.tokensTracked.toString(),
      change: 0, // No hay cambio para cantidad
    },
  ];

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Título principal */}
        <div className="text-center mb-12 sm:mb-16 md:mb-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-6 sm:mb-8">
            <span className="text-white">Coin</span>
            <span className="text-[#00ff41] neon-text animate-neon-pulse">LatamCap</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/80 max-w-4xl mx-auto mb-4">
            El futuro de las crypto latinas en tiempo real
          </p>
          <p className="text-base sm:text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-4">
            Tracking exclusivo de tokens latinoamericanos en Solana y Pump.fun
          </p>
          
          {/* Indicador de estado de datos */}
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-2 h-2 rounded-full ${
              hasError ? 'bg-[#ff0040]' : 'bg-[#00ff41]'
            } ${isLoading ? 'animate-pulse' : ''}`} />
            <span className="text-sm text-white/60">
              {isLoading ? 'Cargando datos de DexScreener...' : 
               hasError ? 'Error cargando datos' : 'Datos en tiempo real desde DexScreener'}
            </span>
          </div>
        </div>

        {/* Estadísticas globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {stats.map((stat) => (
            <GlassCard key={stat.label} className="text-center p-4 sm:p-6">
              <div className="space-y-2">
                <h3 className="text-xs sm:text-sm font-medium text-white/60 uppercase tracking-wide">
                  {stat.label}
                </h3>
                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white font-mono">
                  {stat.value}
                </div>
                {stat.change !== 0 && (
                  <div className={`text-xs sm:text-sm font-medium ${
                    stat.change >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'
                  }`}>
                    {formatPercentage(stat.change)}
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Efectos de partículas */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[#00ff41]/30 rounded-full animate-float" />
        <div className="absolute top-32 right-20 w-1 h-1 bg-[#00ff41]/40 rounded-full animate-float delay-1000" />
        <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-[#00ff41]/25 rounded-full animate-float delay-2000" />
        <div className="absolute bottom-32 right-1/3 w-1 h-1 bg-[#00ff41]/35 rounded-full animate-float delay-3000" />
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-[#00ff41]/20 rounded-full animate-float delay-4000" />
      </div>

      {/* Notificación de error si hay problemas */}
      {hasError && (
        <div className="fixed top-4 right-4 z-50 max-w-sm">
          <div className="bg-[#ff0040]/20 backdrop-blur-xl border border-[#ff0040]/30 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-5 h-5 text-[#ff0040]">⚠️</div>
              <div>
                <h4 className="text-sm font-medium text-white">Error de Conexión</h4>
                <p className="text-xs text-white/80">No se pudieron cargar los datos reales</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
