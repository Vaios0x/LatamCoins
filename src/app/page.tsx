'use client';

import { useState } from 'react';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { TokenTable } from '@/components/dashboard/TokenTable';
import { RealTimeData } from '@/components/dashboard/RealTimeData';
import { CurrencySelector } from '@/components/ui/CurrencySelector';

/**
 * Página principal de CoinLatamCap
 * Dashboard con estadísticas globales y tabla de tokens
 */
export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'memecoins' | 'utility'>('memecoins');

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      {/* Sección hero con estadísticas globales */}
      <HeroSection />
      
      {/* Pestañas de tokens */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Tokens Latinoamericanos
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
            Tracking en tiempo real de los tokens más importantes de Latinoamérica
          </p>
        </div>
        
        {/* Controles superiores */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          {/* Pestañas */}
          <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-white/10 rounded-xl p-1 flex">
            <button
              onClick={() => setActiveTab('memecoins')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'memecoins'
                  ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              🚀 MemeCoins
            </button>
            <button
              onClick={() => setActiveTab('utility')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === 'utility'
                  ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              💎 Utility Tokens
            </button>
          </div>
          
          {/* Selector de moneda */}
          <CurrencySelector showLabel={true} size="md" />
        </div>
        
        {/* Contenido de las pestañas */}
        {activeTab === 'memecoins' && <TokenTable />}
        {activeTab === 'utility' && (
          <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-white/10 rounded-xl p-12 text-center">
            <div className="text-6xl mb-4">⏳</div>
            <h3 className="text-xl font-bold text-white mb-2">Esperando Nuevos Lanzamientos</h3>
            <p className="text-white/70">
              Los utility tokens estarán disponibles próximamente
            </p>
          </div>
        )}
      </div>

      {/* Sección de estado de APIs */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Estado de APIs
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
            Monitoreo en tiempo real de las fuentes de datos
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Control de Datos</h3>
            <div className="space-y-4">
              <button 
                onClick={() => window.location.reload()} 
                className="w-full bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 hover:border-[#00ff41]/70 text-[#00ff41] font-semibold py-3 px-4 rounded-lg transition-all duration-300"
              >
                🔄 Forzar Actualización de Datos
              </button>
              <p className="text-xs text-white/60">
                Si los precios no se actualizan, haz clic en este botón para recargar los datos reales.
              </p>
            </div>
          </div>
          <div className="bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Fuentes de Datos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white/80">DexScreener</span>
                <span className="text-[#00ff41] text-sm">Datos de Solana DEX</span>
              </div>
            </div>
            <div className="mt-6 text-sm text-white/60">
              <p>DexScreener proporciona datos en tiempo real de tokens de Solana.</p>
              <p>Los datos se actualizan automáticamente cada 30 segundos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de datos en tiempo real */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Datos en Tiempo Real
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
            Información actualizada desde múltiples fuentes cada 30 segundos
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RealTimeData 
            tokenAddress="b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt"
            tokenSymbol="DOGGY"
            tokenName="HOLDER"
          />
          <RealTimeData 
            tokenAddress="6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df"
            tokenSymbol="MAD"
            tokenName="MAD COIN"
          />
          <RealTimeData 
            tokenAddress="3wmgnvepzkptlxldyej4epzib2xsvbq8twbpicgzkfxr"
            tokenSymbol="QRA"
            tokenName="Quira"
          />
          <RealTimeData 
            tokenAddress="3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru"
            tokenSymbol="Darrkito"
            tokenName="Darrkito Strategic Reserve"
          />
        </div>
      </div>
    </div>
  );
}