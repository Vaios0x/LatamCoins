'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Activity, Wifi, WifiOff, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';

interface ApiStatus {
  name: string;
  url: string;
  status: 'connected' | 'disconnected' | 'checking';
  lastCheck: string;
  responseTime?: number;
  error?: string;
}

export default function StatusPage() {
  const [apis, setApis] = useState<ApiStatus[]>([
    {
      name: 'DexScreener',
      url: 'https://api.dexscreener.com',
      status: 'checking',
      lastCheck: 'Verificando...'
    }
  ]);
  const [isChecking, setIsChecking] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const checkApiStatus = async (api: ApiStatus): Promise<ApiStatus> => {
    const startTime = Date.now();
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(api.url, {
        method: 'HEAD',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LATAMCOINS/1.0'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;
      
      return {
        ...api,
        status: response.ok ? 'connected' : 'disconnected',
        lastCheck: new Date().toLocaleTimeString('es-ES'),
        responseTime,
        error: response.ok ? undefined : `HTTP ${response.status}`
      };
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      return {
        ...api,
        status: 'disconnected',
        lastCheck: new Date().toLocaleTimeString('es-ES'),
        responseTime,
        error: error.name === 'AbortError' ? 'Timeout' : error.message
      };
    }
  };

  const checkAllApis = async () => {
    setIsChecking(true);
    setLastUpdate(new Date().toLocaleTimeString('es-ES'));
    
    const updatedApis = await Promise.all(
      apis.map(api => checkApiStatus(api))
    );
    
    setApis(updatedApis);
    setIsChecking(false);
  };

  useEffect(() => {
    checkAllApis();
    
    // Verificar cada 5 minutos
    const interval = setInterval(checkAllApis, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-[#00ff41]" />;
      case 'disconnected':
        return <XCircle className="w-5 h-5 text-[#ff0040]" />;
      case 'checking':
        return <RefreshCw className="w-5 h-5 text-[#ffaa00] animate-spin" />;
      default:
        return <Clock className="w-5 h-5 text-white/60" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected':
        return 'Conectado';
      case 'disconnected':
        return 'Desconectado';
      case 'checking':
        return 'Verificando...';
      default:
        return 'Desconocido';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'text-[#00ff41]';
      case 'disconnected':
        return 'text-[#ff0040]';
      case 'checking':
        return 'text-[#ffaa00]';
      default:
        return 'text-white/60';
    }
  };

  const connectedApis = apis.filter(api => api.status === 'connected').length;
  const totalApis = apis.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Estado del Sistema
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Monitoreo en tiempo real de las conexiones y servicios de la plataforma
          </p>
        </div>

        {/* Resumen del estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Activity className="w-8 h-8 text-[#00ff41]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {connectedApis}/{totalApis}
            </h3>
            <p className="text-white/60">APIs Conectadas</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Wifi className="w-8 h-8 text-[#00ff41]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {connectedApis === totalApis ? '100%' : `${Math.round((connectedApis / totalApis) * 100)}%`}
            </h3>
            <p className="text-white/60">Disponibilidad</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {lastUpdate || 'N/A'}
            </h3>
            <p className="text-white/60">Última Verificación</p>
          </GlassCard>
        </div>

        {/* Lista de APIs */}
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Estado de Conexiones</h2>
              <button
                onClick={checkAllApis}
                disabled={isChecking}
                className="flex items-center space-x-2 px-4 py-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] rounded-lg transition-all duration-300 disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                <span>Verificar</span>
              </button>
            </div>

            <div className="space-y-4">
              {apis.map((api, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-[#0a0e27]/30 rounded-lg border border-white/10">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(api.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{api.name}</h3>
                      <p className="text-white/60 text-sm">{api.url}</p>
                      {api.error && (
                        <p className="text-[#ff0040] text-xs mt-1">{api.error}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-medium ${getStatusColor(api.status)}`}>
                      {getStatusText(api.status)}
                    </div>
                    <div className="text-white/60 text-sm">
                      {api.lastCheck}
                    </div>
                    {api.responseTime && (
                      <div className="text-white/60 text-xs">
                        {api.responseTime}ms
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-sm text-white/60">
                <div>
                  <p>Las APIs se verifican automáticamente cada 5 minutos.</p>
                  <p>Los datos se actualizan cada 30 segundos cuando están disponibles.</p>
                </div>
                <div className="text-right">
                  <p>Última verificación: {lastUpdate}</p>
                  <p>Próxima verificación: {lastUpdate ? new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString('es-ES') : 'N/A'}</p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}