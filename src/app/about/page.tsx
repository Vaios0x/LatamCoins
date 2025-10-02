'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Users, Target, Zap, Globe, Shield, Heart, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

/**
 * Página Acerca de CoinLatamCap
 * Información sobre la plataforma, misión y equipo
 */
export default function AboutPage() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const copyToClipboard = async (address: string, type: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(type);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };
  const features = [
    {
      icon: Zap,
      title: 'Tiempo Real',
      description: 'Datos actualizados cada segundo para mantenerte al día con el mercado crypto latinoamericano.'
    },
    {
      icon: Target,
      title: 'Enfoque LATAM',
      description: 'Especializados exclusivamente en tokens y proyectos de Latinoamérica, conociendo nuestro mercado.'
    },
    {
      icon: Globe,
      title: 'Acceso Global',
      description: 'Disponible en cualquier parte del mundo, conectando la comunidad crypto latina globalmente.'
    },
    {
      icon: Shield,
      title: 'Transparencia',
      description: 'Datos verificados y fuentes confiables para que tomes decisiones informadas.'
    }
  ];

  const team = [
    {
      name: 'Equipo CoinLatamCap',
      role: 'Fundadores',
      description: 'Apasionados por la tecnología blockchain y el potencial de Latinoamérica en el ecosistema crypto.',
      image: '/team/placeholder.jpg'
    }
  ];

  const stats = [
    { label: 'Tokens Tracked', value: '5+', icon: Target },
    { label: 'Países Cubiertos', value: '20+', icon: Globe },
    { label: 'Usuarios Activos', value: '1K+', icon: Users },
    { label: 'Uptime', value: '99.9%', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
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
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-white">Acerca de</span>
            <span className="text-[#00ff41] neon-text animate-neon-pulse ml-2">LATAMCOINS</span>
          </h1>
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            La plataforma líder para el tracking de criptomonedas latinoamericanas. 
            Conectamos la comunidad crypto de Latinoamérica con datos en tiempo real.
          </p>
        </div>

        {/* Misión */}
        <div className="mb-12 sm:mb-16">
          <GlassCard className="p-6 sm:p-8">
            <div className="text-center">
              <Heart className="w-12 h-12 text-[#00ff41] mx-auto mb-4" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Nuestra Misión</h2>
              <p className="text-white/80 text-lg leading-relaxed max-w-4xl mx-auto">
                Democratizar el acceso a información crypto de calidad en Latinoamérica. 
                Creemos que cada persona en nuestra región merece tener acceso a datos 
                precisos y actualizados sobre el ecosistema crypto local, sin barreras 
                de idioma, conocimiento técnico o recursos económicos.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Características */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            ¿Por qué elegir LATAMCOINS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={index} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-[#00ff41] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Estadísticas */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            Números que nos respaldan
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={index} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-[#00ff41] mx-auto mb-3" />
                  <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Equipo */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            Nuestro Equipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className="w-20 h-20 bg-[#00ff41]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-[#00ff41]" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{member.name}</h3>
                <div className="text-[#00ff41] text-sm mb-3">{member.role}</div>
                <p className="text-white/70 text-sm">{member.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Tecnología */}
        <div className="mb-12 sm:mb-16">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 text-center">
              Tecnología de Vanguardia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Stack Tecnológico</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">Next.js 15 con App Router</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">TypeScript para tipado estático</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">TailwindCSS para estilos</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">Solana Web3.js para blockchain</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">WebSocket para datos en tiempo real</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Características Técnicas</h3>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">PWA para instalación móvil</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">Responsive design optimizado</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">Efectos visuales avanzados</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">Deploy automático en Vercel</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                    <span className="text-white/80">Optimización SEO completa</span>
                  </li>
                </ul>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Sección de Donaciones */}
        <div className="mb-12 sm:mb-16">
          <GlassCard className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <Heart className="w-8 h-8 text-[#00ff41] mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Apoya el Proyecto
              </h2>
              <p className="text-white/70 text-sm max-w-2xl mx-auto">
                Si LATAMCOINS te ha sido útil, considera hacer una donación para ayudar 
                a mantener y mejorar la plataforma.
              </p>
            </div>
            
            <div className="flex justify-center max-w-2xl mx-auto">
              {/* Solana */}
              <div className="bg-gradient-to-br from-[#9945FF]/10 to-[#14F195]/10 border border-[#9945FF]/20 rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 text-center">Solana</h3>
                <div className="bg-black/20 rounded-lg p-3 mb-4">
                  <code className="text-[#00ff41] text-xs break-all">
                    3S8EEWxgFTpoAPip78CBanP7xjNuUQK5Yb3Ezin4pFxF
                  </code>
                </div>
                <button
                  onClick={() => copyToClipboard('3S8EEWxgFTpoAPip78CBanP7xjNuUQK5Yb3Ezin4pFxF', 'sol')}
                  className="w-full bg-[#9945FF]/20 hover:bg-[#9945FF]/30 border border-[#9945FF]/30 rounded-lg px-4 py-2 text-white text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  {copiedAddress === 'sol' ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Dirección</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <p className="text-white/50 text-xs">
                Gracias por tu apoyo. Cada donación nos ayuda a mantener LATAMCOINS gratuito y accesible.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <GlassCard className="p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              ¿Listo para unirte a la revolución crypto latina?
            </h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Únete a miles de usuarios que ya confían en LATAMCOINS para 
              mantenerse informados sobre el mercado crypto latinoamericano.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <GlassButton size="lg">
                  Explorar Tokens
                </GlassButton>
              </Link>
              <Link href="/contact">
                <GlassButton variant="secondary" size="lg">
                  Contactar Equipo
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

