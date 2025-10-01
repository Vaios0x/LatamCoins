'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface ApiStatus {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
  lastChecked: Date;
}

interface ApiStatusNotificationProps {
  className?: string;
}

export function ApiStatusNotification({ className = '' }: ApiStatusNotificationProps) {
  const [apiStatuses, setApiStatuses] = useState<ApiStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  const checkApiStatus = async () => {
    setIsLoading(true);
    
    try {
      // Usar nuestro endpoint de verificación de APIs
      const response = await fetch('/api/status', {
        method: 'GET',
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.apis) {
          setApiStatuses(data.apis);
          setLastUpdate(new Date());
        } else {
          throw new Error('Invalid API response');
        }
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      // Fallback a estado de error
      setApiStatuses([
        {
          name: 'DexScreener',
          status: 'error',
          message: 'Error de verificación',
          lastChecked: new Date()
        },
        {
          name: 'CoinMarketCap',
          status: 'error',
          message: 'Error de verificación',
          lastChecked: new Date()
        },
        {
          name: 'Jupiter',
          status: 'warning',
          message: 'Requiere API key',
          lastChecked: new Date()
        }
      ]);
      setLastUpdate(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    checkApiStatus();
    
    // Verificar cada 5 minutos
    const interval = setInterval(checkApiStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[#00ff41]" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-[#ff0040]" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-[#ffaa00]" />;
      case 'loading':
        return <RefreshCw className="w-4 h-4 text-[#00ff41] animate-spin" />;
      default:
        return <AlertCircle className="w-4 h-4 text-white/60" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-[#00ff41]';
      case 'error':
        return 'text-[#ff0040]';
      case 'warning':
        return 'text-[#ffaa00]';
      case 'loading':
        return 'text-[#00ff41]';
      default:
        return 'text-white/60';
    }
  };

  const workingApis = apiStatuses.filter(api => api.status === 'success').length;
  const totalApis = apiStatuses.length;

  // Evitar hidratación mismatch
  if (!mounted) {
    return (
      <GlassCard className={`p-4 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Estado de APIs</h3>
          <div className="w-8 h-8 bg-[#00ff41]/20 rounded-lg animate-pulse"></div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-white/20 rounded animate-pulse"></div>
              <span className="text-white font-medium">Cargando...</span>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/60">Verificando...</div>
              <div className="text-xs text-white/40">--:--:--</div>
            </div>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className={`p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Estado de APIs</h3>
        <button
          onClick={checkApiStatus}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3 py-1 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 rounded-lg transition-all duration-300 disabled:opacity-50"
          aria-label="Verificar estado de APIs"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="text-sm text-white">Verificar</span>
        </button>
      </div>

      <div className="space-y-3">
        {apiStatuses.map((api, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getStatusIcon(api.status)}
              <span className="text-white font-medium">{api.name}</span>
            </div>
            <div className="text-right">
              <div className={`text-sm font-medium ${getStatusColor(api.status)}`}>
                {api.message}
              </div>
            <div className="text-xs text-white/60">
              {mounted ? new Date(api.lastChecked).toLocaleTimeString() : '--:--:--'}
            </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-[#00ff41]/20">
        <div className="flex items-center justify-between">
          <div className="text-sm text-white/60">
            APIs funcionando: {workingApis}/{totalApis}
          </div>
          <div className="text-xs text-white/40">
            Última verificación: {mounted && lastUpdate ? lastUpdate.toLocaleTimeString() : '--:--:--'}
          </div>
        </div>
        
        {workingApis > 0 && (
          <div className="mt-2 text-xs text-[#00ff41]">
            ✅ Datos en tiempo real disponibles
          </div>
        )}
        
        {workingApis === 0 && (
          <div className="mt-2 text-xs text-[#ff0040]">
            ⚠️ Solo datos simulados disponibles
          </div>
        )}
      </div>
    </GlassCard>
  );
}