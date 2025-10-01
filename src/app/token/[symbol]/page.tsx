'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getTokenBySymbol } from '@/lib/constants/tokens';
import { formatPrice, formatLargeNumber, formatPercentage, formatAddress } from '@/lib/utils/formatters';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { PriceChange } from '@/components/ui/PriceChange';
import { PriceChart } from '@/components/token-detail/PriceChart';
import { TimeframeSelector } from '@/components/token-detail/TimeframeSelector';
import { StatsGrid } from '@/components/token-detail/StatsGrid';

/**
 * Página de detalle de token
 * Vista completa con gráfico, estadísticas y enlaces
 */
export default function TokenDetailPage() {
  const params = useParams();
  const symbol = params.symbol as string;
  
  const token = getTokenBySymbol(symbol);
  
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Token no encontrado</h1>
          <p className="text-white/70 mb-8">El token que buscas no existe en nuestra base de datos.</p>
          <Link href="/">
            <GlassButton>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Dashboard
            </GlassButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      {/* Header del token */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              href="/"
              className="flex items-center text-white/70 hover:text-[#00ff41] transition-colors duration-300 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              <span className="hidden xs:inline">LATAMCOINS</span>
              <span className="xs:hidden">LTC</span>
            </Link>
            <div className="text-white/40 text-sm sm:text-base">/</div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                <span className="text-sm sm:text-base md:text-lg font-bold text-[#00ff41]">
                  {token.symbol.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{token.name}</h1>
                <div className="text-white/60 text-sm sm:text-base">{token.symbol}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Información principal del token */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {/* Precio y cambio */}
          <GlassCard className="lg:col-span-2">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
                    {formatPrice(token.price)}
                  </div>
                  <div className="flex items-center space-x-2 sm:space-x-4 mt-2">
                    <PriceChange change={token.change24h} size="lg" />
                    <span className="text-white/60 text-xs sm:text-sm">en 24h</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-xs sm:text-sm">Ranking</div>
                  <div className="text-lg sm:text-xl font-bold text-[#00ff41]">#{token.rank}</div>
                </div>
              </div>

              {/* Gráfico de precio */}
              <div className="h-48 sm:h-56 md:h-64">
                <PriceChart token={token} />
              </div>

              {/* Selector de timeframe */}
              <TimeframeSelector />
            </div>
          </GlassCard>

          {/* Estadísticas */}
          <div className="space-y-4 sm:space-y-6">
            <StatsGrid token={token} />
            
            {/* Enlaces externos */}
            <GlassCard>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Enlaces</h3>
              <div className="space-y-2 sm:space-y-3">
                <a
                  href={`https://pump.fun/coin/${token.contract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 sm:p-3 bg-[#00ff41]/10 hover:bg-[#00ff41]/20 border border-[#00ff41]/30 hover:border-[#00ff41]/50 rounded-lg transition-all duration-300 group"
                  aria-label="Ver en Pump.fun"
                >
                  <span className="text-white group-hover:text-[#00ff41] transition-colors duration-300 text-sm sm:text-base">
                    Ver en Pump.fun
                  </span>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 group-hover:text-[#00ff41] transition-colors duration-300" />
                </a>
                
                <a
                  href={`https://solscan.io/token/${token.contract}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2 sm:p-3 bg-[#00ff41]/10 hover:bg-[#00ff41]/20 border border-[#00ff41]/30 hover:border-[#00ff41]/50 rounded-lg transition-all duration-300 group"
                  aria-label="Ver en Solscan"
                >
                  <span className="text-white group-hover:text-[#00ff41] transition-colors duration-300 text-sm sm:text-base">
                    Ver en Solscan
                  </span>
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-white/60 group-hover:text-[#00ff41] transition-colors duration-300" />
                </a>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Información detallada */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Información del contrato */}
          <GlassCard>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Información del Contrato</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-white/60 text-sm sm:text-base">Contrato:</span>
                <span className="text-white font-mono text-xs sm:text-sm">
                  {formatAddress(token.contract)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-white/60 text-sm sm:text-base">Plataforma:</span>
                <span className="text-white text-sm sm:text-base">{token.platform}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-white/60 text-sm sm:text-base">Blockchain:</span>
                <span className="text-white text-sm sm:text-base">{token.chain}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-white/60 text-sm sm:text-base">Supply Total:</span>
                <span className="text-white font-mono text-sm sm:text-base">
                  {formatLargeNumber(token.supply)}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Estadísticas adicionales */}
          <GlassCard>
            <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Estadísticas Adicionales</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-white/60 text-sm sm:text-base">ATH:</span>
                <span className="text-white font-mono text-sm sm:text-base">
                  {formatPrice(token.ath)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-white/60 text-sm sm:text-base">ATL:</span>
                <span className="text-white font-mono text-sm sm:text-base">
                  {formatPrice(token.atl)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-white/60 text-sm sm:text-base">Distancia desde ATH:</span>
                <span className="text-white font-mono text-sm sm:text-base">
                  {formatPercentage(((token.price - token.ath) / token.ath) * 100)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between space-y-1 sm:space-y-0">
                <span className="text-white/60 text-sm sm:text-base">Distancia desde ATL:</span>
                <span className="text-white font-mono text-sm sm:text-base">
                  {formatPercentage(((token.price - token.atl) / token.atl) * 100)}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
