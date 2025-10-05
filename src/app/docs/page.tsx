'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Book, Code, Zap, Database, Globe, Shield, Users, ExternalLink, Key, Settings } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

/**
 * Página de Documentación
 * Guía completa para desarrolladores y usuarios de CoinLatamCap
 */
export default function DocsPage() {
  const { t } = useI18n();
  const quickStart = [
    {
      step: 1,
      title: 'Registro de API',
      description: 'Obtén tu API key gratuita para acceder a los datos de CoinLatamCap',
      icon: Key
    },
    {
      step: 2,
      title: 'Configuración',
      description: 'Configura tu cliente con la URL base y headers necesarios',
      icon: Settings
    },
    {
      step: 3,
      title: 'Primera Consulta',
      description: 'Realiza tu primera llamada a la API para obtener datos de tokens',
      icon: Zap
    }
  ];

  const apiEndpoints = [
    {
      method: 'GET',
      endpoint: '/api/tokens',
      description: 'Obtener lista de todos los tokens latinoamericanos',
      example: 'curl -X GET "https://api.coinlatamcap.com/tokens"'
    },
    {
      method: 'GET',
      endpoint: '/api/tokens/{symbol}',
      description: 'Obtener información detallada de un token específico',
      example: 'curl -X GET "https://api.coinlatamcap.com/tokens/DOGGY"'
    },
    {
      method: 'GET',
      endpoint: '/api/market/stats',
      description: 'Obtener estadísticas globales del mercado LATAM',
      example: 'curl -X GET "https://api.coinlatamcap.com/market/stats"'
    },
    {
      method: 'GET',
      endpoint: '/api/tokens/{symbol}/price',
      description: 'Obtener precio actual de un token',
      example: 'curl -X GET "https://api.coinlatamcap.com/tokens/DOGGY/price"'
    }
  ];

  const features = [
    {
      icon: Database,
      title: 'Datos en Tiempo Real',
      description: 'WebSocket para actualizaciones instantáneas de precios y volúmenes',
      code: 'const ws = new WebSocket("wss://api.coinlatamcap.com/ws");'
    },
    {
      icon: Globe,
      title: 'REST API Completa',
      description: 'Endpoints RESTful para todas las funcionalidades de la plataforma',
      code: 'GET /api/tokens\nGET /api/market/stats\nGET /api/tokens/{symbol}'
    },
    {
      icon: Shield,
      title: 'Autenticación Segura',
      description: 'API keys con rate limiting y autenticación JWT',
      code: 'Authorization: Bearer YOUR_API_KEY'
    },
    {
      icon: Zap,
      title: 'Webhooks',
      description: 'Notificaciones automáticas para cambios de precio y volumen',
      code: 'POST /webhooks/price-alerts'
    }
  ];

  const sdks = [
    {
      name: 'JavaScript/TypeScript',
      language: 'js',
      description: 'SDK oficial para Node.js y navegadores',
      install: 'npm install @coinlatamcap/sdk',
      example: 'import { CoinLatamCapAPI } from "@coinlatamcap/sdk";'
    },
    {
      name: 'Python',
      language: 'python',
      description: 'SDK para Python con soporte asíncrono',
      install: 'pip install coinlatamcap',
      example: 'from coinlatamcap import CoinLatamCapAPI'
    },
    {
      name: 'Go',
      language: 'go',
      description: 'SDK para Go con tipos seguros',
      install: 'go get github.com/coinlatamcap/go-sdk',
      example: 'import "github.com/coinlatamcap/go-sdk"'
    }
  ];

  const tutorials = [
    {
      title: 'Integración Básica',
      description: 'Aprende a integrar CoinLatamCap en tu aplicación',
      duration: '5 min',
      level: 'Principiante'
    },
    {
      title: 'WebSocket en Tiempo Real',
      description: 'Implementa actualizaciones en tiempo real con WebSocket',
      duration: '10 min',
      level: 'Intermedio'
    },
    {
      title: 'Análisis de Datos',
      description: 'Analiza tendencias del mercado crypto latinoamericano',
      duration: '15 min',
      level: 'Avanzado'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center space-x-4 mb-6">
            <Link href="/">
              <GlassButton variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('common.back')}
              </GlassButton>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <Book className="w-8 h-8 text-[#00ff41]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              {t('docs.title')}
            </h1>
          </div>
          
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            {t('docs.subtitle')}
          </p>
        </div>

        {/* Quick Start */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            {t('docs.quick_start')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickStart.map((step, index) => {
              const Icon = step.icon;
              return (
                <GlassCard key={index} className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-8 h-8 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                      <span className="text-[#00ff41] font-bold text-sm">{step.step}</span>
                    </div>
                    <Icon className="w-5 h-5 text-[#00ff41]" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/70 text-sm">{step.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* API Endpoints */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            {t('docs.endpoints')}
          </h2>
          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 text-xs font-bold rounded ${
                      endpoint.method === 'GET' 
                        ? 'bg-[#00ff41]/20 text-[#00ff41]' 
                        : 'bg-[#ff0040]/20 text-[#ff0040]'
                    }`}>
                      {endpoint.method}
                    </span>
                    <code className="text-white font-mono text-sm">{endpoint.endpoint}</code>
                  </div>
                </div>
                <p className="text-white/80 mb-3">{endpoint.description}</p>
                <div className="bg-[#0a0e27]/50 rounded-lg p-3">
                  <code className="text-white/70 text-sm font-mono">{endpoint.example}</code>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Características */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            {t('docs.features_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={index} className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon className="w-6 h-6 text-[#00ff41]" />
                    <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  </div>
                  <p className="text-white/80 mb-4">{feature.description}</p>
                  <div className="bg-[#0a0e27]/50 rounded-lg p-3">
                    <code className="text-white/70 text-sm font-mono">{feature.code}</code>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* SDKs */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            {t('docs.sdks_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sdks.map((sdk, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Code className="w-6 h-6 text-[#00ff41]" />
                  <h3 className="text-lg font-semibold text-white">{sdk.name}</h3>
                </div>
                <p className="text-white/80 mb-4">{sdk.description}</p>
                <div className="space-y-2">
                  <div className="bg-[#0a0e27]/50 rounded-lg p-3">
                    <code className="text-white/70 text-sm font-mono">{sdk.install}</code>
                  </div>
                  <div className="bg-[#0a0e27]/50 rounded-lg p-3">
                    <code className="text-white/70 text-sm font-mono">{sdk.example}</code>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Tutoriales */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            {t('docs.tutorials_title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tutorials.map((tutorial, index) => (
              <GlassCard key={index} className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">{tutorial.title}</h3>
                <p className="text-white/80 mb-4">{tutorial.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">{tutorial.duration}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    tutorial.level === 'Principiante' 
                      ? 'bg-[#00ff41]/20 text-[#00ff41]'
                      : tutorial.level === 'Intermedio'
                      ? 'bg-[#ffaa00]/20 text-[#ffaa00]'
                      : 'bg-[#ff0040]/20 text-[#ff0040]'
                  }`}>
                    {tutorial.level}
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Recursos adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">{t('docs.more_resources')}</h3>
            <div className="space-y-3">
              <a
                href="https://github.com/coinlatamcap/examples"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-white/80 hover:text-[#00ff41] transition-colors duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('docs.examples')}</span>
              </a>
              <a
                href="https://status.coinlatamcap.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-white/80 hover:text-[#00ff41] transition-colors duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t('docs.status')}</span>
              </a>
              <a
                href="/contact"
                className="flex items-center space-x-3 text-white/80 hover:text-[#00ff41] transition-colors duration-300"
              >
                <Users className="w-4 h-4" />
                <span>{t('docs.support')}</span>
              </a>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">{t('docs.community')}</h3>
            <div className="space-y-3">
              <a
                href="https://discord.gg/coinlatamcap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-white/80 hover:text-[#00ff41] transition-colors duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Discord</span>
              </a>
              <a
                href="https://github.com/coinlatamcap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-white/80 hover:text-[#00ff41] transition-colors duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href="https://twitter.com/coinlatamcap"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-white/80 hover:text-[#00ff41] transition-colors duration-300"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Twitter</span>
              </a>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
