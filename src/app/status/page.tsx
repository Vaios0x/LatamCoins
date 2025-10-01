'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Activity, CheckCircle, AlertTriangle, XCircle, Clock, RefreshCw, Server, Database, Globe, Zap, Shield } from 'lucide-react';
import Link from 'next/link';

/**
 * Página de Estado del Sistema
 * Monitoreo en tiempo real del estado de LATAMCOINS
 */
export default function StatusPage() {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados del sistema (simulados)
  const [systemStatus, setSystemStatus] = useState({
    overall: 'operational' as 'operational' | 'degraded' | 'outage',
    uptime: '99.9%',
    responseTime: '45ms',
    lastIncident: '2024-01-15T10:30:00Z'
  });

  const services = [
    {
      id: 'api',
      name: 'API REST',
      status: 'operational' as 'operational' | 'degraded' | 'outage',
      uptime: '99.95%',
      responseTime: '42ms',
      description: 'API principal para datos de tokens',
      lastCheck: new Date(Date.now() - 30000)
    },
    {
      id: 'websocket',
      name: 'WebSocket',
      status: 'operational' as 'operational' | 'degraded' | 'outage',
      uptime: '99.8%',
      responseTime: '12ms',
      description: 'Conexiones en tiempo real',
      lastCheck: new Date(Date.now() - 15000)
    },
    {
      id: 'database',
      name: 'Base de Datos',
      status: 'operational' as 'operational' | 'degraded' | 'outage',
      uptime: '99.99%',
      responseTime: '8ms',
      description: 'Almacenamiento de datos históricos',
      lastCheck: new Date(Date.now() - 10000)
    },
    {
      id: 'solana-rpc',
      name: 'Solana RPC',
      status: 'operational' as 'operational' | 'degraded' | 'outage',
      uptime: '99.7%',
      responseTime: '156ms',
      description: 'Conexión con la blockchain de Solana',
      lastCheck: new Date(Date.now() - 20000)
    },
    {
      id: 'pump-api',
      name: 'Pump.fun API',
      status: 'operational' as 'operational' | 'degraded' | 'outage',
      uptime: '99.6%',
      responseTime: '89ms',
      description: 'Integración con Pump.fun',
      lastCheck: new Date(Date.now() - 25000)
    },
    {
      id: 'dex-screener',
      name: 'DexScreener API',
      status: 'operational' as 'operational' | 'degraded' | 'outage',
      uptime: '99.5%',
      responseTime: '234ms',
      description: 'Datos de precios y volúmenes',
      lastCheck: new Date(Date.now() - 18000)
    }
  ];

  const incidents = [
    {
      id: 'incident-001',
      title: 'Mantenimiento programado de la API',
      status: 'resolved' as 'investigating' | 'identified' | 'monitoring' | 'resolved',
      severity: 'minor' as 'critical' | 'major' | 'minor',
      startTime: '2024-01-15T02:00:00Z',
      endTime: '2024-01-15T03:30:00Z',
      description: 'Mantenimiento programado para actualizaciones de seguridad. La API estuvo temporalmente no disponible.',
      affectedServices: ['API REST', 'WebSocket']
    },
    {
      id: 'incident-002',
      title: 'Degradación en Solana RPC',
      status: 'resolved' as 'investigating' | 'identified' | 'monitoring' | 'resolved',
      severity: 'minor' as 'critical' | 'major' | 'minor',
      startTime: '2024-01-10T14:20:00Z',
      endTime: '2024-01-10T15:45:00Z',
      description: 'Latencia aumentada en las consultas a Solana. Los datos se actualizaron con retraso.',
      affectedServices: ['Solana RPC', 'Base de Datos']
    }
  ];

  const metrics = [
    {
      name: 'Requests por minuto',
      value: '2,847',
      change: '+12%',
      trend: 'up',
      icon: Activity
    },
    {
      name: 'Usuarios activos',
      value: '1,234',
      change: '+8%',
      trend: 'up',
      icon: Globe
    },
    {
      name: 'Tiempo de respuesta promedio',
      value: '45ms',
      change: '-5ms',
      trend: 'down',
      icon: Zap
    },
    {
      name: 'Disponibilidad',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: Shield
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-[#00ff41]" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-[#ffaa00]" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-[#ff0040]" />;
      default:
        return <Clock className="w-5 h-5 text-white/60" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-[#00ff41]';
      case 'degraded':
        return 'text-[#ffaa00]';
      case 'outage':
        return 'text-[#ff0040]';
      default:
        return 'text-white/60';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-[#ff0040]/20 text-[#ff0040] border-[#ff0040]/30';
      case 'major':
        return 'bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]/30';
      case 'minor':
        return 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/30';
      default:
        return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const refreshStatus = async () => {
    setIsRefreshing(true);
    
    // Simular actualización de estado
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLastUpdate(new Date());
    setIsRefreshing(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, []);

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
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-[#00ff41]" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Estado del Sistema
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white/60 text-sm">Última actualización</p>
                <p className="text-white font-mono text-sm">
                  {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <GlassButton
                onClick={refreshStatus}
                loading={isRefreshing}
                size="sm"
                variant="ghost"
              >
                <RefreshCw className="w-4 h-4" />
              </GlassButton>
            </div>
          </div>
          
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            Monitoreo en tiempo real del estado de todos los servicios de LATAMCOINS.
          </p>
        </div>

        {/* Estado General */}
        <div className="mb-12">
          <GlassCard className="p-6 sm:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Estado General
              </h2>
              <div className="flex items-center space-x-2">
                {getStatusIcon(systemStatus.overall)}
                <span className={`font-semibold ${getStatusColor(systemStatus.overall)}`}>
                  {systemStatus.overall === 'operational' ? 'Operacional' : 
                   systemStatus.overall === 'degraded' ? 'Degradado' : 'Fuera de servicio'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-white/60 text-sm mb-1">Uptime</p>
                <p className="text-2xl font-bold text-[#00ff41]">{systemStatus.uptime}</p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm mb-1">Tiempo de respuesta</p>
                <p className="text-2xl font-bold text-white">{systemStatus.responseTime}</p>
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm mb-1">Último incidente</p>
                <p className="text-sm font-mono text-white/80">
                  {new Date(systemStatus.lastIncident).toLocaleDateString()}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Métricas */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Métricas en Tiempo Real
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <GlassCard key={index} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-[#00ff41] mx-auto mb-4" />
                  <h3 className="text-sm font-medium text-white/60 mb-2">{metric.name}</h3>
                  <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                  <div className={`text-sm font-medium ${
                    metric.trend === 'up' ? 'text-[#00ff41]' : 'text-[#ff0040]'
                  }`}>
                    {metric.change}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Servicios */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Estado de Servicios
          </h2>
          <div className="space-y-4">
            {services.map((service) => (
              <GlassCard key={service.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                    </div>
                    <p className="text-white/60 text-sm">{service.description}</p>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-white/60 text-xs">Uptime</p>
                      <p className="text-[#00ff41] font-mono text-sm">{service.uptime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">Response</p>
                      <p className="text-white font-mono text-sm">{service.responseTime}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/60 text-xs">Última verificación</p>
                      <p className="text-white/80 font-mono text-xs">
                        {service.lastCheck.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Incidentes Recientes */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Incidentes Recientes
          </h2>
          
          {incidents.length > 0 ? (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <GlassCard key={incident.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{incident.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded border ${getSeverityColor(incident.severity)}`}>
                            {incident.severity === 'critical' ? 'Crítico' :
                             incident.severity === 'major' ? 'Mayor' : 'Menor'}
                          </span>
                        </div>
                        <p className="text-white/80 mb-3">{incident.description}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-white/60 text-sm">Servicios afectados:</span>
                          {incident.affectedServices.map((service, index) => (
                            <span key={index} className="px-2 py-1 bg-[#00ff41]/10 text-[#00ff41] text-xs rounded">
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <div>
                        <span className="font-medium">Inicio:</span> {new Date(incident.startTime).toLocaleString()}
                      </div>
                      <div>
                        <span className="font-medium">Fin:</span> {new Date(incident.endTime).toLocaleString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-[#00ff41]" />
                        <span className="text-[#00ff41] font-medium">Resuelto</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          ) : (
            <GlassCard className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-[#00ff41] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Sin incidentes recientes</h3>
              <p className="text-white/70">Todos los sistemas están funcionando correctamente.</p>
            </GlassCard>
          )}
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Server className="w-5 h-5 text-[#00ff41] mr-2" />
              Infraestructura
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Servidores</span>
                <span className="text-white">3 nodos activos</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Región</span>
                <span className="text-white">América Latina (São Paulo)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">CDN</span>
                <span className="text-white">Cloudflare</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Monitoreo</span>
                <span className="text-white">24/7 activo</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Database className="w-5 h-5 text-[#00ff41] mr-2" />
              Datos
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Actualización</span>
                <span className="text-white">Cada segundo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Retención</span>
                <span className="text-white">2 años</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Backup</span>
                <span className="text-white">Diario automático</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Encriptación</span>
                <span className="text-white">AES-256</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <GlassCard className="p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              ¿Experimentas algún problema?
            </h2>
            <p className="text-white/80 mb-6">
              Si notas algún comportamiento inusual, reporta el problema a nuestro equipo de soporte.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/support">
                <GlassButton size="lg">
                  Reportar Problema
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="secondary" size="lg">
                  Contactar Soporte
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
