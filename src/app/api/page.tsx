'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Code, Zap, Database, Globe, Shield, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Página de API
 * Información sobre la API de LATAMCOINS y ejemplos de uso
 */
export default function APIPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const apiExamples = [
    {
      id: 'tokens',
      title: 'Obtener Todos los Tokens',
      description: 'Lista completa de tokens latinoamericanos con precios y estadísticas',
      method: 'GET',
      endpoint: '/api/tokens',
      code: `curl -X GET "https://api.latamcoins.com/tokens" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
      response: `{
  "success": true,
  "data": [
    {
      "id": "holder-doggy",
      "symbol": "DOGGY",
      "name": "HOLDER",
      "price": 0.0000234,
      "change24h": 15.67,
      "volume24h": 125000,
      "marketCap": 2340000,
      "platform": "Pump.fun",
      "chain": "Solana"
    }
  ],
  "timestamp": 1699123456789
}`
    },
    {
      id: 'token-detail',
      title: 'Información de Token Específico',
      description: 'Datos detallados de un token incluyendo gráfico y estadísticas',
      method: 'GET',
      endpoint: '/api/tokens/{symbol}',
      code: `curl -X GET "https://api.latamcoins.com/tokens/DOGGY" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      response: `{
  "success": true,
  "data": {
    "id": "holder-doggy",
    "symbol": "DOGGY",
    "name": "HOLDER",
    "price": 0.0000234,
    "change24h": 15.67,
    "volume24h": 125000,
    "marketCap": 2340000,
    "ath": 0.0000456,
    "atl": 0.0000012,
    "supply": 1000000000,
    "contract": "BS7HxRitaY5ipGfbek1nmatWLbaS9yoWRSEQzCb3pump",
    "sparkline": [0.0000012, 0.0000015, ...]
  }
}`
    },
    {
      id: 'market-stats',
      title: 'Estadísticas del Mercado',
      description: 'Métricas globales del mercado crypto latinoamericano',
      method: 'GET',
      endpoint: '/api/market/stats',
      code: `curl -X GET "https://api.latamcoins.com/market/stats" \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
      response: `{
  "success": true,
  "data": {
    "totalMarketCap": 8040000,
    "totalVolume24h": 350900,
    "tokensTracked": 5,
    "averageChange24h": 4.6,
    "topGainer": {
      "symbol": "QRA",
      "change24h": 23.45
    },
    "topLoser": {
      "symbol": "HUMO",
      "change24h": -12.78
    }
  }
}`
    },
    {
      id: 'price-alert',
      title: 'Configurar Alerta de Precio',
      description: 'Crear alertas personalizadas para cambios de precio',
      method: 'POST',
      endpoint: '/api/alerts',
      code: `curl -X POST "https://api.latamcoins.com/alerts" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "DOGGY",
    "condition": "above",
    "price": 0.00003,
    "webhook": "https://your-app.com/webhook"
  }'`,
      response: `{
  "success": true,
  "data": {
    "alertId": "alert_123456",
    "token": "DOGGY",
    "condition": "above",
    "price": 0.00003,
    "status": "active",
    "createdAt": "2025-09-15T10:30:00Z"
  }
}`
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Tiempo Real',
      description: 'Datos actualizados cada segundo con WebSocket',
      color: 'text-[#00ff41]'
    },
    {
      icon: Database,
      title: 'Alta Disponibilidad',
      description: '99.9% uptime con redundancia global',
      color: 'text-[#00ff41]'
    },
    {
      icon: Shield,
      title: 'Seguro',
      description: 'Autenticación JWT y rate limiting',
      color: 'text-[#00ff41]'
    },
    {
      icon: Globe,
      title: 'Global',
      description: 'CDN global para latencia mínima',
      color: 'text-[#00ff41]'
    }
  ];

  const rateLimits = [
    { plan: 'Free', requests: '100/hour', price: 'Gratis' },
    { plan: 'Pro', requests: '1,000/hour', price: '$29/mes' },
    { plan: 'Enterprise', requests: '10,000/hour', price: 'Contactar' }
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
                Volver
              </GlassButton>
            </Link>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <Code className="w-8 h-8 text-[#00ff41]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              API LATAMCOINS
            </h1>
          </div>
          
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            API REST completa para acceder a datos de criptomonedas latinoamericanas. 
            Integra precios, volúmenes, estadísticas y alertas en tiempo real.
          </p>
        </div>

        {/* Características */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            ¿Por qué elegir nuestra API?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={index} className="p-6 text-center">
                  <Icon className={`w-8 h-8 ${feature.color} mx-auto mb-4`} />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Ejemplos de API */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Ejemplos de Uso
          </h2>
          <div className="space-y-8">
            {apiExamples.map((example, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${
                        example.method === 'GET' 
                          ? 'bg-[#00ff41]/20 text-[#00ff41]' 
                          : 'bg-[#ff0040]/20 text-[#ff0040]'
                      }`}>
                        {example.method}
                      </span>
                      <code className="text-white font-mono text-sm">{example.endpoint}</code>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{example.title}</h3>
                    <p className="text-white/80">{example.description}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-white/80 mb-2">Request:</h4>
                    <div className="relative">
                      <div className="bg-[#0a0e27]/50 rounded-lg p-4 overflow-x-auto">
                        <code className="text-white/70 text-sm font-mono whitespace-pre">{example.code}</code>
                      </div>
                      <button
                        onClick={() => copyToClipboard(example.code, example.id)}
                        className="absolute top-2 right-2 p-1 text-white/60 hover:text-[#00ff41] transition-colors duration-300"
                      >
                        {copiedCode === example.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-white/80 mb-2">Response:</h4>
                    <div className="bg-[#0a0e27]/50 rounded-lg p-4 overflow-x-auto">
                      <code className="text-white/70 text-sm font-mono whitespace-pre">{example.response}</code>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Rate Limits */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Planes y Límites
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rateLimits.map((plan, index) => (
              <GlassCard key={index} className={`p-6 text-center ${
                plan.plan === 'Pro' ? 'border-[#00ff41]/40' : ''
              }`}>
                <h3 className="text-xl font-bold text-white mb-2">{plan.plan}</h3>
                <div className="text-2xl font-bold text-[#00ff41] mb-2">{plan.price}</div>
                <div className="text-white/80 mb-4">{plan.requests}</div>
                <GlassButton 
                  variant={plan.plan === 'Pro' ? 'primary' : 'ghost'}
                  className="w-full"
                >
                  {plan.plan === 'Enterprise' ? 'Contactar' : 'Comenzar'}
                </GlassButton>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* WebSocket */}
        <div className="mb-12">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              WebSocket en Tiempo Real
            </h2>
            <p className="text-white/80 mb-6">
              Conecta a nuestro WebSocket para recibir actualizaciones instantáneas de precios, 
              volúmenes y cambios de mercado.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-white/80 mb-2">Conexión:</h4>
                <div className="bg-[#0a0e27]/50 rounded-lg p-4">
                  <code className="text-white/70 text-sm font-mono">
                    wss://api.latamcoins.com/ws?token=YOUR_API_KEY
                  </code>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white/80 mb-2">Ejemplo JavaScript:</h4>
                <div className="bg-[#0a0e27]/50 rounded-lg p-4">
                  <code className="text-white/70 text-sm font-mono whitespace-pre">{`const ws = new WebSocket('wss://api.latamcoins.com/ws?token=YOUR_API_KEY');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Price update:', data);
};`}</code>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <GlassCard className="p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              ¿Listo para empezar?
            </h2>
            <p className="text-white/80 mb-6">
              Obtén tu API key gratuita y comienza a integrar datos de criptomonedas 
              latinoamericanas en tu aplicación.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/docs">
                <GlassButton size="lg">
                  Ver Documentación
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="secondary" size="lg">
                  Obtener API Key
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
