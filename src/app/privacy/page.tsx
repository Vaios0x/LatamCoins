'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';

/**
 * Página de Política de Privacidad
 * Información sobre cómo LATAMCOINS maneja los datos de los usuarios
 */
export default function PrivacyPage() {
  const lastUpdated = 'Septiembre 2025';

  const dataTypes = [
    {
      icon: Eye,
      title: 'Datos de Navegación',
      content: 'Información sobre cómo interactúa con nuestro sitio web, incluyendo páginas visitadas, tiempo de permanencia y patrones de uso.'
    },
    {
      icon: Database,
      title: 'Datos Técnicos',
      content: 'Información técnica como dirección IP, tipo de navegador, sistema operativo y datos de dispositivo para optimizar el servicio.'
    },
    {
      icon: UserCheck,
      title: 'Preferencias',
      content: 'Configuraciones de usuario, tokens favoritos, alertas configuradas y otras preferencias personalizadas.'
    }
  ];

  const rights = [
    {
      title: 'Acceso a sus Datos',
      content: 'Puede solicitar una copia de todos los datos personales que tenemos sobre usted.'
    },
    {
      title: 'Rectificación',
      content: 'Puede solicitar la corrección de datos inexactos o incompletos.'
    },
    {
      title: 'Eliminación',
      content: 'Puede solicitar la eliminación de sus datos personales en ciertas circunstancias.'
    },
    {
      title: 'Portabilidad',
      content: 'Puede solicitar que sus datos sean transferidos a otro servicio.'
    },
    {
      title: 'Limitación del Procesamiento',
      content: 'Puede solicitar que limitemos el procesamiento de sus datos.'
    },
    {
      title: 'Oposición',
      content: 'Puede oponerse al procesamiento de sus datos para ciertos fines.'
    }
  ];

  const securityMeasures = [
    {
      icon: Lock,
      title: 'Cifrado SSL/TLS',
      content: 'Toda la comunicación entre su navegador y nuestros servidores está cifrada.'
    },
    {
      icon: Shield,
      title: 'Protección de Datos',
      content: 'Implementamos medidas técnicas y organizativas para proteger sus datos.'
    },
    {
      icon: AlertCircle,
      title: 'Monitoreo de Seguridad',
      content: 'Monitoreamos continuamente nuestros sistemas para detectar y prevenir accesos no autorizados.'
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
            <Shield className="w-8 h-8 text-[#00ff41]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Política de Privacidad
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
              Su Privacidad es Nuestra Prioridad
            </h2>
            <p className="text-white/80 leading-relaxed">
              En LATAMCOINS, nos comprometemos a proteger su privacidad y datos personales. 
              Esta política explica cómo recopilamos, usamos y protegemos su información 
              cuando utiliza nuestra plataforma.
            </p>
          </div>
        </GlassCard>

        {/* Información que recopilamos */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Información que Recopilamos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {dataTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <GlassCard key={index} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-[#00ff41] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-3">{type.title}</h3>
                  <p className="text-white/70 text-sm">{type.content}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Cómo usamos la información */}
        <div className="mb-12">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              Cómo Utilizamos su Información
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Proporcionar el servicio:</strong> Para mostrarle información actualizada sobre criptomonedas y tokens latinoamericanos.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Mejorar la experiencia:</strong> Para personalizar el contenido y optimizar la funcionalidad de la plataforma.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Análisis y estadísticas:</strong> Para entender cómo los usuarios interactúan con nuestro servicio y mejorarlo.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Comunicación:</strong> Para enviarle actualizaciones importantes sobre el servicio (solo si se suscribe).
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Compartir información */}
        <div className="mb-12">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              Compartir Información
            </h2>
            <p className="text-white/80 mb-4">
              No vendemos, alquilamos ni compartimos su información personal con terceros, excepto en las siguientes circunstancias:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar la plataforma (hosting, analytics).
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o para proteger nuestros derechos.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Consentimiento:</strong> Cuando usted nos dé su consentimiento explícito.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Medidas de seguridad */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Medidas de Seguridad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {securityMeasures.map((measure, index) => {
              const Icon = measure.icon;
              return (
                <GlassCard key={index} className="p-6 text-center">
                  <Icon className="w-8 h-8 text-[#00ff41] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-3">{measure.title}</h3>
                  <p className="text-white/70 text-sm">{measure.content}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>

        {/* Derechos del usuario */}
        <div className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8">
            Sus Derechos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rights.map((right, index) => (
              <GlassCard key={index} className="p-6">
                <h3 className="text-lg font-semibold text-white mb-3">{right.title}</h3>
                <p className="text-white/80">{right.content}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Cookies */}
        <div className="mb-12">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              Uso de Cookies
            </h2>
            <p className="text-white/80 mb-4">
              Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro sitio web:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Cookies esenciales:</strong> Necesarias para el funcionamiento básico del sitio.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Cookies de rendimiento:</strong> Para analizar cómo utiliza nuestro sitio y mejorarlo.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-[#00ff41] rounded-full mt-2"></div>
                <p className="text-white/80">
                  <strong>Cookies de funcionalidad:</strong> Para recordar sus preferencias y configuraciones.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Cambios en la política */}
        <div className="mb-12">
          <GlassCard className="p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
              Cambios en esta Política
            </h2>
            <p className="text-white/80">
              Podemos actualizar esta política de privacidad ocasionalmente. Le notificaremos 
              sobre cambios significativos publicando la nueva política en esta página y 
              actualizando la fecha de &quot;última modificación&quot;. Le recomendamos revisar esta 
              política periódicamente.
            </p>
          </GlassCard>
        </div>

        {/* Contacto */}
        <div className="text-center">
          <GlassCard className="p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              ¿Tienes preguntas sobre privacidad?
            </h2>
            <p className="text-white/80 mb-6">
              Si tienes alguna pregunta sobre esta política de privacidad o sobre 
              cómo manejamos tus datos, contáctanos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <GlassButton size="lg">
                  Contactar Privacidad
                </GlassButton>
              </Link>
              <Link href="/terms">
                <GlassButton variant="secondary" size="lg">
                  Ver Términos y Condiciones
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>

        {/* Footer legal */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            © 2025 LATAMCOINS. Todos los derechos reservados.
          </p>
          <p className="text-white/40 text-xs mt-2">
            Esta política de privacidad está sujeta a cambios sin previo aviso.
          </p>
        </div>
      </div>
    </div>
  );
}
