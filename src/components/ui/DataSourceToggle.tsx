'use client';

import { useState } from 'react';
import { Wifi, WifiOff, RefreshCw, Settings } from 'lucide-react';
import { GlassButton } from './GlassButton';

interface DataSourceToggleProps {
  useRealData: boolean;
  dataSource: 'real' | 'mock';
  isLoading: boolean;
  onToggle: () => void;
  onRefresh: () => void;
}

/**
 * Componente para alternar entre datos reales y mock
 * Muestra el estado de conexión y permite controlar la fuente de datos
 */
export function DataSourceToggle({ 
  useRealData, 
  dataSource, 
  isLoading, 
  onToggle, 
  onRefresh 
}: DataSourceToggleProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="relative">
      {/* Botón principal */}
      <div className="flex items-center space-x-2">
        <GlassButton
          onClick={onToggle}
          className="flex items-center space-x-2 px-3 py-2 text-sm"
          disabled={isLoading}
        >
          {dataSource === 'real' ? (
            <Wifi className="w-4 h-4 text-[#00ff41]" />
          ) : (
            <WifiOff className="w-4 h-4 text-[#ffaa00]" />
          )}
          <span>
            {dataSource === 'real' ? 'Datos Reales' : 'Datos Mock'}
          </span>
        </GlassButton>

        <GlassButton
          onClick={onRefresh}
          className="flex items-center space-x-2 px-3 py-2 text-sm"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </GlassButton>

        <GlassButton
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center space-x-2 px-3 py-2 text-sm"
        >
          <Settings className="w-4 h-4" />
          <span>Config</span>
        </GlassButton>
      </div>

      {/* Panel de configuración */}
      {showSettings && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#0a0e27]/90 backdrop-blur-xl border border-[#00ff41]/30 rounded-lg p-4 shadow-[0_8px_32px_0_rgba(0,255,65,0.1)] z-50">
          <h3 className="text-white font-semibold mb-3">Configuración de Datos</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Fuente de datos:</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => !useRealData && onToggle()}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    useRealData 
                      ? 'bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41]/50' 
                      : 'bg-white/10 text-white/60 border border-white/20'
                  }`}
                >
                  Reales
                </button>
                <button
                  onClick={() => useRealData && onToggle()}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    !useRealData 
                      ? 'bg-[#ffaa00]/20 text-[#ffaa00] border border-[#ffaa00]/50' 
                      : 'bg-white/10 text-white/60 border border-white/20'
                  }`}
                >
                  Mock
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Estado:</span>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  dataSource === 'real' ? 'bg-[#00ff41]' : 'bg-[#ffaa00]'
                } ${isLoading ? 'animate-pulse' : ''}`} />
                <span className="text-white/60 text-xs">
                  {isLoading ? 'Cargando...' : 
                   dataSource === 'real' ? 'Conectado' : 'Simulado'}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <p className="text-white/60 text-xs">
                {useRealData 
                  ? 'Obteniendo datos en tiempo real desde APIs externas'
                  : 'Usando datos simulados para desarrollo'
                }
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
