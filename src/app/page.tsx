'use client';

import { HeroSection } from '@/components/dashboard/HeroSection';
import { TokenTable } from '@/components/dashboard/TokenTable';

/**
 * Página principal de LATAMCOINS
 * Dashboard con estadísticas globales y tabla de tokens
 */
export default function HomePage() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      {/* Sección hero con estadísticas globales */}
      <HeroSection />
      
      {/* Tabla de tokens */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        <div className="mb-8 sm:mb-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Tokens Latinoamericanos
          </h2>
          <p className="text-white/70 max-w-3xl mx-auto text-base sm:text-lg">
            Tracking en tiempo real de los tokens más importantes de Latinoamérica
          </p>
        </div>
        
        <TokenTable />
      </div>
    </div>
  );
}