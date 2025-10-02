'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, FileText, Shield, AlertTriangle, Scale } from 'lucide-react';
import Link from 'next/link';

/**
 * Página de Términos y Condiciones
 * Términos de uso de la plataforma CoinLatamCap
 */
export default function TermsPage() {
  const lastUpdated = 'Septiembre 2025';

  const sections = [
    {
      title: '1. Aceptación de los Términos',
      content: 'Al acceder y utilizar CoinLatamCap, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro servicio.'
    },
    {
      title: '2. Descripción del Servicio',
      content: 'CoinLatamCap es una plataforma de información que proporciona datos sobre criptomonedas y tokens latinoamericanos. Nuestro servicio incluye, pero no se limita a: precios en tiempo real, gráficos, estadísticas de mercado, y enlaces a plataformas de trading.'
    },
    {
      title: '3. Uso Aceptable',
      content: 'Usted se compromete a utilizar CoinLatamCap únicamente para fines legales y de manera que no infrinja los derechos de terceros. Está prohibido: usar el servicio para actividades ilegales, intentar acceder a sistemas no autorizados, o interferir con el funcionamiento normal del servicio.'
    },
    {
      title: '4. Información Financiera',
      content: 'La información proporcionada en CoinLatamCap es únicamente para fines informativos y educativos. No constituye asesoramiento financiero, de inversión, legal o fiscal. Siempre consulte con profesionales calificados antes de tomar decisiones de inversión.'
    },
    {
      title: '5. Limitación de Responsabilidad',
      content: 'CoinLatamCap no se hace responsable por pérdidas financieras derivadas del uso de la información proporcionada. Los usuarios asumen toda la responsabilidad por sus decisiones de inversión y trading.'
    },
    {
      title: '6. Propiedad Intelectual',
      content: 'Todo el contenido de CoinLatamCap, incluyendo pero no limitado a textos, gráficos, logos, iconos, imágenes, y software, es propiedad de CoinLatamCap o sus licenciantes y está protegido por leyes de derechos de autor.'
    },
    {
      title: '7. Privacidad',
      content: 'El uso de CoinLatamCap está sujeto a nuestra Política de Privacidad, que describe cómo recopilamos, usamos y protegemos su información personal.'
    },
    {
      title: '8. Modificaciones',
      content: 'Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación en el sitio web.'
    },
    {
      title: '9. Terminación',
      content: 'Podemos terminar o suspender su acceso al servicio inmediatamente, sin previo aviso, por cualquier motivo, incluyendo la violación de estos términos.'
    },
    {
      title: '10. Ley Aplicable',
      content: 'Estos términos se rigen por las leyes de México. Cualquier disputa será resuelta en los tribunales competentes de Ciudad de México, México.'
    }
  ];

  const disclaimers = [
    {
      icon: AlertTriangle,
      title: 'Advertencia de Riesgo',
      content: 'Las criptomonedas son activos de alto riesgo. Los precios pueden fluctuar significativamente y puede perder todo su capital invertido.'
    },
    {
      icon: Shield,
      title: 'No es Asesoramiento',
      content: 'La información en LATAMCOINS no constituye asesoramiento financiero, legal o fiscal. Siempre haga su propia investigación.'
    },
    {
      icon: Scale,
      title: 'Cumplimiento Legal',
      content: 'Es responsabilidad del usuario cumplir con todas las leyes y regulaciones aplicables en su jurisdicción.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#000000] to-[#0a0e27]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16">
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
            <FileText className="w-8 h-8 text-[#00ff41]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Términos y Condiciones
            </h1>
          </div>
          
          <p className="text-white/70 text-base sm:text-lg">
            Última actualización: {lastUpdated}
          </p>
        </div>

        {/* Introducción */}
        <GlassCard className="p-6 sm:p-8 mb-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Bienvenido a LATAMCOINS
            </h2>
            <p className="text-white/80 leading-relaxed">
              Estos términos y condiciones rigen el uso de nuestra plataforma de tracking 
              de criptomonedas latinoamericanas. Al utilizar LATAMCOINS, usted acepta 
              cumplir con estos términos.
            </p>
          </div>
        </GlassCard>

        {/* Términos principales */}
        <div className="space-y-6 mb-12">
          {sections.map((section, index) => (
            <GlassCard key={index} className="p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">
                {section.title}
              </h3>
              <p className="text-white/80 leading-relaxed">
                {section.content}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* Advertencias importantes */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            Advertencias Importantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {disclaimers.map((disclaimer, index) => {
              const Icon = disclaimer.icon;
              return (
                <GlassCard key={index} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-[#ff0040] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-3">{disclaimer.title}</h3>
                  <p className="text-white/70 text-sm">{disclaimer.content}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Información de contacto */}
        <GlassCard className="p-6 sm:p-8">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              ¿Tienes preguntas sobre estos términos?
            </h2>
            <p className="text-white/80 mb-6">
              Si tienes alguna pregunta sobre estos términos y condiciones, 
              no dudes en contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <GlassButton size="lg">
                  Contactar Soporte
                </GlassButton>
              </Link>
              <Link href="/privacy">
                <GlassButton variant="secondary" size="lg">
                  Ver Política de Privacidad
                </GlassButton>
              </Link>
            </div>
          </div>
        </GlassCard>

        {/* Footer legal */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            © 2025 LATAMCOINS. Todos los derechos reservados.
          </p>
          <p className="text-white/40 text-xs mt-2">
            Estos términos están sujetos a cambios sin previo aviso.
          </p>
        </div>
      </div>
    </div>
  );
}
