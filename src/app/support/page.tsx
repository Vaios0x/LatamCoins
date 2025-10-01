'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, HelpCircle, MessageSquare, Mail, Phone, Clock, CheckCircle, AlertCircle, Info, Search, Filter, Send } from 'lucide-react';
import Link from 'next/link';

/**
 * Página de Soporte
 * Centro de ayuda y soporte técnico para LATAMCOINS
 */
export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supportCategories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'general', label: 'General' },
    { value: 'technical', label: 'Técnico' },
    { value: 'account', label: 'Cuenta' },
    { value: 'api', label: 'API' },
    { value: 'billing', label: 'Facturación' }
  ];

  const faqItems = [
    {
      id: 'what-is-latamcoins',
      category: 'general',
      question: '¿Qué es LATAMCOINS?',
      answer: 'LATAMCOINS es una plataforma de tracking en tiempo real de tokens latinoamericanos en Solana y Pump.fun. Proporcionamos datos actualizados, gráficos interactivos y análisis del mercado crypto latinoamericano.',
      tags: ['general', 'plataforma']
    },
    {
      id: 'how-to-use-api',
      category: 'api',
      question: '¿Cómo usar la API de LATAMCOINS?',
      answer: 'Estamos desarrollando una API REST que te permitirá acceder a datos de tokens, precios, volúmenes y estadísticas. Incluirá autenticación JWT, rate limiting y soporte WebSocket para datos en tiempo real. La documentación estará disponible próximamente.',
      tags: ['api', 'desarrollo']
    },
    {
      id: 'supported-tokens',
      category: 'technical',
      question: '¿Qué tokens están soportados?',
      answer: 'Actualmente trackeamos 5+ tokens latinoamericanos en Solana: HOLDER (DOGGY), MAD COIN (MAD), Quira (QRA), HUMO (HUMO) y Darrkito Strategic Reserve. Estamos agregando nuevos tokens regularmente.',
      tags: ['tokens', 'solana']
    },
    {
      id: 'data-updates',
      category: 'technical',
      question: '¿Con qué frecuencia se actualizan los datos?',
      answer: 'Los precios se actualizan cada segundo a través de WebSocket. Los datos de volumen y market cap se actualizan cada 5 segundos. Nuestro sistema garantiza 99.9% de uptime.',
      tags: ['datos', 'tiempo-real']
    },
    {
      id: 'account-creation',
      category: 'account',
      question: '¿Cómo crear una cuenta?',
      answer: 'Actualmente LATAMCOINS es de acceso público. Para funciones avanzadas como API keys personalizadas, contacta a nuestro equipo a través de /contact.',
      tags: ['cuenta', 'registro']
    },
    {
      id: 'api-pricing',
      category: 'billing',
      question: '¿Cuáles serán los precios de la API?',
      answer: 'Estamos desarrollando planes de API que incluirán un plan gratuito con 100 requests/hora, planes Pro ($29/mes) con 1,000 requests/hora y planes Enterprise con límites personalizados. Los precios se anunciarán próximamente.',
      tags: ['precios', 'api']
    },
    {
      id: 'mobile-app',
      category: 'general',
      question: '¿Hay una aplicación móvil?',
      answer: 'LATAMCOINS es una PWA (Progressive Web App) que puedes instalar en tu dispositivo móvil. Funciona como una app nativa con notificaciones push y funcionamiento offline.',
      tags: ['móvil', 'pwa']
    },
    {
      id: 'data-sources',
      category: 'technical',
      question: '¿De dónde vienen los datos?',
      answer: 'Nuestros datos provienen de múltiples fuentes verificadas: DexScreener API, Pump.fun API, y nodos de Solana. Todos los datos son validados y actualizados en tiempo real.',
      tags: ['datos', 'fuentes']
    }
  ];

  const supportChannels = [
    {
      icon: MessageSquare,
      title: 'Discord',
      description: 'Comunidad activa 24/7',
      link: 'https://discord.gg/latamcoins',
      responseTime: 'Inmediato',
      color: 'text-[#00ff41]'
    },
    {
      icon: Mail,
      title: 'Email',
      description: 'Soporte técnico profesional',
      link: 'mailto:support@latamcoins.com',
      responseTime: '24 horas',
      color: 'text-[#00ff41]'
    },
    {
      icon: HelpCircle,
      title: 'Centro de Ayuda',
      description: 'Documentación completa',
      link: '/docs',
      responseTime: 'Siempre disponible',
      color: 'text-[#00ff41]'
    }
  ];

  const ticketTypes = [
    { value: 'bug', label: 'Reportar Bug' },
    { value: 'feature', label: 'Solicitar Feature' },
    { value: 'technical', label: 'Soporte Técnico' },
    { value: 'billing', label: 'Facturación' },
    { value: 'general', label: 'Consulta General' }
  ];

  const [ticketData, setTicketData] = useState({
    type: 'general',
    subject: '',
    description: '',
    email: '',
    priority: 'medium'
  });

  // Filtrar FAQ por categoría y búsqueda
  const filteredFaq = faqItems.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío de ticket
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitted(true);
    setIsSubmitting(false);
  };

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
            <HelpCircle className="w-8 h-8 text-[#00ff41]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Centro de Soporte
            </h1>
          </div>
          
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            Encuentra respuestas rápidas, reporta problemas y obtén ayuda de nuestro equipo técnico.
          </p>
        </div>

        {/* Canales de Soporte */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            ¿Cómo podemos ayudarte?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => {
              const Icon = channel.icon;
              return (
                <GlassCard key={index} className="p-6 text-center hover:scale-105 transition-transform duration-300">
                  <Icon className={`w-8 h-8 ${channel.color} mx-auto mb-4`} />
                  <h3 className="text-lg font-semibold text-white mb-2">{channel.title}</h3>
                  <p className="text-white/70 text-sm mb-3">{channel.description}</p>
                  <p className="text-[#00ff41] text-xs font-medium mb-4">{channel.responseTime}</p>
                  <Link href={channel.link} target={channel.link.startsWith('http') ? '_blank' : undefined}>
                    <GlassButton size="sm" className="w-full">
                      Acceder
                    </GlassButton>
                  </Link>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Preguntas Frecuentes
          </h2>
          
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#00ff41]/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar en FAQ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                />
              </div>
            </div>
            <div className="sm:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
              >
                {supportCategories.map((category) => (
                  <option key={category.value} value={category.value} className="bg-[#0a0e27]">
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFaq.map((item) => (
              <GlassCard key={item.id} className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-[#00ff41]/20 text-[#00ff41] rounded-full">
                      {supportCategories.find(cat => cat.value === item.category)?.label}
                    </span>
                  </div>
                  <p className="text-white/80 leading-relaxed">{item.answer}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-[#00ff41]/10 text-[#00ff41]/80 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {filteredFaq.length === 0 && (
            <GlassCard className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-[#ff0040] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No se encontraron resultados</h3>
              <p className="text-white/70">Intenta con otros términos de búsqueda o contacta a nuestro equipo.</p>
            </GlassCard>
          )}
        </div>

        {/* Ticket de Soporte */}
        <div className="mb-12">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              ¿No encontraste lo que buscabas?
            </h2>
            
            {!isSubmitted ? (
              <form onSubmit={handleTicketSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Tipo de consulta
                    </label>
                    <select
                      value={ticketData.type}
                      onChange={(e) => setTicketData({...ticketData, type: e.target.value})}
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                    >
                      {ticketTypes.map((type) => (
                        <option key={type.value} value={type.value} className="bg-[#0a0e27]">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Email de contacto
                    </label>
                    <input
                      type="email"
                      value={ticketData.email}
                      onChange={(e) => setTicketData({...ticketData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Asunto
                  </label>
                  <input
                    type="text"
                    value={ticketData.subject}
                    onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                    className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                    placeholder="Describe brevemente tu consulta"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Descripción detallada
                  </label>
                  <textarea
                    value={ticketData.description}
                    onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300 resize-none"
                    placeholder="Proporciona todos los detalles relevantes para ayudarte mejor..."
                    required
                  />
                </div>
                
                <div className="flex justify-end">
                  <GlassButton
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
                    <Send className="w-4 h-4 ml-2" />
                  </GlassButton>
                </div>
              </form>
            ) : (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-[#00ff41] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">¡Ticket enviado exitosamente!</h3>
                <p className="text-white/70 mb-6">
                  Hemos recibido tu consulta y te responderemos en las próximas 24 horas.
                </p>
                <GlassButton onClick={() => {
                  setIsSubmitted(false);
                  setTicketData({
                    type: 'general',
                    subject: '',
                    description: '',
                    email: '',
                    priority: 'medium'
                  });
                }}>
                  Enviar otro ticket
                </GlassButton>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Información de Contacto */}
        <div className="text-center">
          <GlassCard className="p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              ¿Necesitas ayuda inmediata?
            </h2>
            <p className="text-white/80 mb-6">
              Nuestro equipo está disponible para ayudarte con cualquier consulta técnica o comercial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <GlassButton size="lg">
                  Contactar Equipo
                </GlassButton>
              </Link>
              <Link href="/docs">
                <GlassButton variant="secondary" size="lg">
                  Ver Documentación
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
