'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Mail, MessageSquare, Send, MapPin, Clock, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * Página de Contacto
 * Formulario de contacto y información de LATAMCOINS
 */
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const contactTypes = [
    { value: 'general', label: 'Consulta General' },
    { value: 'technical', label: 'Soporte Técnico' },
    { value: 'business', label: 'Asociaciones' },
    { value: 'media', label: 'Prensa y Medios' },
    { value: 'feedback', label: 'Sugerencias' }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'hola@latamcoins.com',
      description: 'Respuesta en 24 horas'
    },
    {
      icon: MessageSquare,
      title: 'Discord',
      content: 'discord.gg/latamcoins',
      description: 'Comunidad activa'
    },
    {
      icon: MapPin,
      title: 'Ubicación',
      content: 'Ciudad de México, México',
      description: 'Equipo LATAM'
    },
    {
      icon: Clock,
      title: 'Horarios',
      content: 'Lunes a Viernes',
      description: '9:00 - 18:00 CST'
    }
  ];

  const teamMembers = [
    {
      name: 'Equipo LATAMCOINS',
      role: 'Fundadores',
      description: 'Apasionados por blockchain y el potencial de Latinoamérica',
      image: '/team/placeholder.jpg'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 3000);
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
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            <span className="text-white">Contacto</span>
            <span className="text-[#00ff41] neon-text animate-neon-pulse ml-2">LATAMCOINS</span>
          </h1>
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            ¿Tienes preguntas, sugerencias o quieres colaborar con nosotros? 
            Estamos aquí para ayudarte y escuchar tu feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulario de contacto */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
                Envíanos un Mensaje
              </h2>
              
              {isSubmitted ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-[#00ff41] mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                  <p className="text-white/70">
                    Gracias por contactarnos. Te responderemos pronto.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-white/80 mb-2">
                      Tipo de Consulta
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                    >
                      {contactTypes.map((type) => (
                        <option key={type.value} value={type.value} className="bg-[#0a0e27]">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
                      Asunto *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                      placeholder="Resumen de tu consulta"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                      Mensaje *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#00ff41]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300 resize-none"
                      placeholder="Cuéntanos más detalles sobre tu consulta..."
                    />
                  </div>

                  <GlassButton
                    type="submit"
                    size="lg"
                    loading={isSubmitting}
                    className="w-full"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
                  </GlassButton>
                </form>
              )}
            </GlassCard>
          </div>

          {/* Información de contacto */}
          <div className="space-y-6">
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Información de Contacto</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <Icon className="w-5 h-5 text-[#00ff41] mt-0.5" />
                      <div>
                        <div className="text-white font-medium">{info.title}</div>
                        <div className="text-white/80 text-sm">{info.content}</div>
                        <div className="text-white/60 text-xs">{info.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Redes Sociales</h3>
              <div className="space-y-3">
                <a
                  href="https://twitter.com/latamcoins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-white/80 hover:text-[#00ff41] transition-colors duration-300"
                >
                  <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                  <span>Twitter</span>
                </a>
                <a
                  href="https://discord.gg/latamcoins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-white/80 hover:text-[#00ff41] transition-colors duration-300"
                >
                  <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                  <span>Discord</span>
                </a>
                <a
                  href="https://github.com/latamcoins"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 text-white/80 hover:text-[#00ff41] transition-colors duration-300"
                >
                  <div className="w-2 h-2 bg-[#00ff41] rounded-full"></div>
                  <span>GitHub</span>
                </a>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Equipo</h3>
              <div className="space-y-4">
                {teamMembers.map((member, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#00ff41]" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{member.name}</div>
                      <div className="text-white/60 text-sm">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* FAQ rápida */}
        <div className="mt-12">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
              Preguntas Frecuentes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">¿Cómo puedo sugerir un token?</h3>
                <p className="text-white/70 text-sm">
                  Envía un mensaje con el tipo &quot;Sugerencias&quot; incluyendo información del token y su relevancia para LATAM.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">¿Ofrecen soporte técnico?</h3>
                <p className="text-white/70 text-sm">
                  Sí, nuestro equipo técnico responde consultas sobre funcionalidades y problemas de la plataforma.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">¿Puedo colaborar con el proyecto?</h3>
                <p className="text-white/70 text-sm">
                  ¡Absolutamente! Estamos abiertos a colaboraciones, asociaciones y contribuciones de la comunidad.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">¿Los datos son en tiempo real?</h3>
                <p className="text-white/70 text-sm">
                  Sí, utilizamos APIs de alta frecuencia para mantener los datos actualizados cada segundo.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
