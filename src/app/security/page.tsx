'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Activity, Eye, Lock, Database } from 'lucide-react';
import Link from 'next/link';

interface SecurityStatus {
  security: {
    status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
    lastCheck: string;
    uptime: number;
    version: string;
  };
  rateLimiting: {
    active: number;
    blocked: number;
    total: number;
  };
  events: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    last24Hours: number;
  };
  compliance: {
    gdprEvents: number;
    dataExports: number;
    dataDeletions: number;
    consentChanges: number;
    unauthorizedAccess: number;
  };
  topThreats: Array<{
    type: string;
    count: number;
  }>;
  recentCriticalEvents: Array<{
    id: string;
    timestamp: string;
    type: string;
    severity: string;
    description: string;
    ipAddress: string;
  }>;
}

/**
 * Página de Dashboard de Seguridad
 * Monitoreo en tiempo real del estado de seguridad
 */
export default function SecurityPage() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fetchSecurityStatus();
    
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchSecurityStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityStatus = async () => {
    try {
      const response = await fetch('/api/security/status');
      const data = await response.json();
      
      if (data.success) {
        setSecurityStatus(data.data);
        setLastUpdate(new Date().toLocaleTimeString());
      } else {
        setError('Error al cargar estado de seguridad');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return 'text-[#00ff41]';
      case 'WARNING':
        return 'text-[#ffaa00]';
      case 'CRITICAL':
        return 'text-[#ff0040]';
      default:
        return 'text-white/60';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'HEALTHY':
        return <CheckCircle className="w-5 h-5 text-[#00ff41]" />;
      case 'WARNING':
        return <AlertTriangle className="w-5 h-5 text-[#ffaa00]" />;
      case 'CRITICAL':
        return <AlertTriangle className="w-5 h-5 text-[#ff0040]" />;
      default:
        return <Activity className="w-5 h-5 text-white/60" />;
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          <GlassCard className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white/60">Cargando estado de seguridad...</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          <GlassCard className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-[#ff0040] mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Error de Conexión</h2>
            <p className="text-white/60 mb-4">{error}</p>
            <GlassButton onClick={fetchSecurityStatus}>
              Reintentar
            </GlassButton>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <GlassButton variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </GlassButton>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="w-8 h-8 text-[#00ff41]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Dashboard de Seguridad
            </h1>
          </div>
          
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            Monitoreo en tiempo real del estado de seguridad de CoinLatamCap.
            Última actualización: {lastUpdate}
          </p>
        </div>

        {securityStatus && (
          <>
            {/* Estado General */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <GlassCard className="p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  {getStatusIcon(securityStatus.security.status)}
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Estado del Sistema</h3>
                <p className={`text-sm font-medium ${getStatusColor(securityStatus.security.status)}`}>
                  {securityStatus.security.status}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  v{securityStatus.security.version}
                </p>
              </GlassCard>

              <GlassCard className="p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Activity className="w-5 h-5 text-[#00ff41]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Uptime</h3>
                <p className="text-white font-mono text-sm">
                  {formatUptime(securityStatus.security.uptime)}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Última verificación: {new Date(securityStatus.security.lastCheck).toLocaleTimeString()}
                </p>
              </GlassCard>

              <GlassCard className="p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5 text-[#00ff41]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Rate Limiting</h3>
                <p className="text-white font-mono text-sm">
                  {securityStatus.rateLimiting.active} activos
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {securityStatus.rateLimiting.blocked} bloqueados
                </p>
              </GlassCard>

              <GlassCard className="p-4 sm:p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Database className="w-5 h-5 text-[#00ff41]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Eventos 24h</h3>
                <p className="text-white font-mono text-sm">
                  {securityStatus.events.last24Hours}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {securityStatus.events.total} total
                </p>
              </GlassCard>
            </div>

            {/* Eventos de Seguridad */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-[#ff0040]" />
                  <h2 className="text-xl font-semibold text-white">Eventos de Seguridad</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Críticos</span>
                    <span className="text-[#ff0040] font-mono font-bold">
                      {securityStatus.events.critical}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Altos</span>
                    <span className="text-[#ffaa00] font-mono font-bold">
                      {securityStatus.events.high}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Medios</span>
                    <span className="text-[#ffaa00] font-mono font-bold">
                      {securityStatus.events.medium}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Bajos</span>
                    <span className="text-[#00ff41] font-mono font-bold">
                      {securityStatus.events.low}
                    </span>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Eye className="w-6 h-6 text-[#00ff41]" />
                  <h2 className="text-xl font-semibold text-white">Compliance GDPR</h2>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Exportaciones</span>
                    <span className="text-white font-mono">
                      {securityStatus.compliance.dataExports}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Eliminaciones</span>
                    <span className="text-white font-mono">
                      {securityStatus.compliance.dataDeletions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Cambios de Consentimiento</span>
                    <span className="text-white font-mono">
                      {securityStatus.compliance.consentChanges}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Accesos No Autorizados</span>
                    <span className="text-[#ff0040] font-mono">
                      {securityStatus.compliance.unauthorizedAccess}
                    </span>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Eventos Críticos Recientes */}
            {securityStatus.recentCriticalEvents.length > 0 && (
              <GlassCard className="p-6 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-[#ff0040]" />
                  <h2 className="text-xl font-semibold text-white">Eventos Críticos Recientes</h2>
                </div>
                
                <div className="space-y-3">
                  {securityStatus.recentCriticalEvents.map((event) => (
                    <div key={event.id} className="p-3 bg-[#ff0040]/10 border border-[#ff0040]/30 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[#ff0040] font-medium text-sm">
                          {event.type}
                        </span>
                        <span className="text-white/60 text-xs">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white/80 text-sm mb-1">{event.description}</p>
                      <p className="text-white/60 text-xs">IP: {event.ipAddress}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Top Amenazas */}
            {securityStatus.topThreats.length > 0 && (
              <GlassCard className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Shield className="w-6 h-6 text-[#00ff41]" />
                  <h2 className="text-xl font-semibold text-white">Top Amenazas</h2>
                </div>
                
                <div className="space-y-2">
                  {securityStatus.topThreats.map((threat, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-white/80 text-sm">{threat.type}</span>
                      <span className="text-[#00ff41] font-mono text-sm">{threat.count}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}
          </>
        )}

        {/* Botón de actualización */}
        <div className="text-center mt-8">
          <GlassButton onClick={fetchSecurityStatus} loading={loading}>
            <Activity className="w-4 h-4 mr-2" />
            Actualizar Estado
          </GlassButton>
        </div>
      </div>
    </div>
  );
}
