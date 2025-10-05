'use client';

import { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Rocket, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { useI18n } from '@/lib/i18n';

interface FormData {
  projectName: string;
  tokenSymbol: string;
  tokenName: string;
  contractAddress: string;
  website: string;
  twitter: string;
  telegram: string;
  discord: string;
  description: string;
  latamFocus: boolean;
  liquidity: string;
  teamInfo: string;
  contactEmail: string;
  contactName: string;
  additionalInfo: string;
}

export default function ListingPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState<FormData>({
    projectName: '',
    tokenSymbol: '',
    tokenName: '',
    contractAddress: '',
    website: '',
    twitter: '',
    telegram: '',
    discord: '',
    description: '',
    latamFocus: false,
    liquidity: '',
    teamInfo: '',
    contactEmail: '',
    contactName: '',
    additionalInfo: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envío del formulario
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const requirements = [
    {
      title: 'Token en Solana o Pump.fun',
      description: 'Debe estar desplegado en la blockchain de Solana o en la plataforma Pump.fun',
      icon: '⚡'
    },
    {
      title: 'Enfoque en LATAM',
      description: 'El proyecto debe tener una conexión clara con Latinoamérica',
      icon: '🌎'
    },
    {
      title: 'Liquidez mínima',
      description: 'Mínimo $10,000 USD en liquidez para garantizar estabilidad',
      icon: '💰'
    },
    {
      title: 'Información verificada',
      description: 'Información del equipo y proyecto debe ser verificable',
      icon: '✅'
    }
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
          <GlassCard className="p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-[#00ff41]/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-[#00ff41]" />
              </div>
              <h1 className="text-3xl font-bold text-white">¡Solicitud Enviada!</h1>
              <p className="text-white/70 text-lg">
                Hemos recibido tu solicitud de enlistado. Nuestro equipo la revisará y te contactaremos en las próximas 24-48 horas.
              </p>
              <div className="space-y-4">
                <div className="bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg p-4">
                  <h3 className="text-white font-semibold mb-2">Próximos pasos:</h3>
                  <ul className="text-white/70 text-sm space-y-1 text-left">
                    <li>• Revisión de la información proporcionada</li>
                    <li>• Verificación de requisitos técnicos</li>
                    <li>• Evaluación del enfoque LATAM</li>
                    <li>• Contacto con el equipo del proyecto</li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/"
                    className="px-6 py-3 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] rounded-lg transition-all duration-300 hover:scale-105 transform"
                  >
                    Volver al Inicio
                  </Link>
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg transition-all duration-300 hover:scale-105 transform"
                  >
                    Contactar Soporte
                  </Link>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-[#00ff41] hover:text-[#00ff41]/80 transition-colors duration-300 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-[#00ff41]/20 rounded-full flex items-center justify-center">
              <Rocket className="w-6 h-6 text-[#00ff41]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              {t('listing.title')}
            </h1>
          </div>
          
          <p className="text-white/70 text-lg max-w-3xl">
            {t('listing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Requisitos */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Requisitos para Enlistado</h2>
              <div className="space-y-4">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-[#00ff41]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm">{req.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{req.title}</h3>
                      <p className="text-white/60 text-xs mt-1">{req.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-[#ff6b35]/10 border border-[#ff6b35]/30 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-[#ff6b35] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium text-sm">Importante</h4>
                    <p className="text-white/70 text-xs mt-1">
                      El proceso de revisión puede tomar de 24 a 48 horas. Asegúrate de proporcionar información completa y veraz.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información del Token */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Información del Token</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Nombre del Proyecto *
                      </label>
                      <input
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="Ej: Mi Proyecto LATAM"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Símbolo del Token *
                      </label>
                      <input
                        type="text"
                        name="tokenSymbol"
                        value={formData.tokenSymbol}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="Ej: LATAM"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Nombre Completo del Token *
                    </label>
                    <input
                      type="text"
                      name="tokenName"
                      value={formData.tokenName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                      placeholder="Ej: Latin America Token"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Dirección del Contrato *
                    </label>
                    <input
                      type="text"
                      name="contractAddress"
                      value={formData.contractAddress}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                      placeholder="Ej: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                    />
                  </div>
                </div>

                {/* Enlaces y Redes Sociales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Enlaces y Redes Sociales</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Sitio Web
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="https://mi-proyecto.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Twitter/X
                      </label>
                      <input
                        type="url"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="https://x.com/mi-proyecto"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Telegram
                      </label>
                      <input
                        type="url"
                        name="telegram"
                        value={formData.telegram}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="https://t.me/mi-proyecto"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Discord
                      </label>
                      <input
                        type="url"
                        name="discord"
                        value={formData.discord}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="https://discord.gg/mi-proyecto"
                      />
                    </div>
                  </div>
                </div>

                {/* Descripción del Proyecto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Descripción del Proyecto</h3>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Descripción del Proyecto *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                      placeholder="Describe tu proyecto, su propósito y cómo beneficia a la comunidad LATAM..."
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="latamFocus"
                      checked={formData.latamFocus}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-[#00ff41] bg-[#0a0e27] border-white/20 rounded focus:ring-[#00ff41]/50 focus:ring-2"
                    />
                    <label className="text-white/80 text-sm">
                      Este proyecto tiene un enfoque específico en Latinoamérica
                    </label>
                  </div>
                </div>

                {/* Información Técnica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Información Técnica</h3>
                  
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Liquidez Actual (USD) *
                    </label>
                    <input
                      type="number"
                      name="liquidity"
                      value={formData.liquidity}
                      onChange={handleInputChange}
                      required
                      min="10000"
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                      placeholder="10000"
                    />
                    <p className="text-white/60 text-xs mt-1">Mínimo requerido: $10,000 USD</p>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Información del Equipo
                    </label>
                    <textarea
                      name="teamInfo"
                      value={formData.teamInfo}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                      placeholder="Información sobre el equipo fundador, experiencia, etc..."
                    />
                  </div>
                </div>

                {/* Información de Contacto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Información de Contacto</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Nombre de Contacto *
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Email de Contacto *
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Información Adicional
                    </label>
                    <textarea
                      name="additionalInfo"
                      value={formData.additionalInfo}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-[#0a0e27]/50 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#00ff41]/50 focus:border-[#00ff41]/40 transition-all duration-300"
                      placeholder="Cualquier información adicional que consideres relevante..."
                    />
                  </div>
                </div>

                {/* Botón de envío */}
                <div className="pt-6 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 hover:border-[#00ff41]/70 text-[#00ff41] font-semibold rounded-lg transition-all duration-300 hover:scale-105 transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin" />
                        <span>Enviando Solicitud...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        <span>Enviar Solicitud de Enlistado</span>
                      </>
                    )}
                  </button>
                  
                  <p className="text-white/60 text-xs text-center mt-4">
                    Al enviar este formulario, aceptas que revisemos tu proyecto según nuestros criterios de enlistado.
                  </p>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
