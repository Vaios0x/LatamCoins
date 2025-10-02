'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ArrowLeft, Shield, CheckCircle, AlertCircle, Database, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { ConsentManager } from '@/components/gdpr/ConsentManager';
import { DataPortability } from '@/components/gdpr/DataPortability';
import { RightToErasure } from '@/components/gdpr/RightToErasure';

/**
 * Página principal de GDPR Compliance
 * Gestión completa de derechos de datos del usuario
 */
export default function GDPRPage() {
  const [activeTab, setActiveTab] = useState<'consent' | 'export' | 'delete'>('consent');
  const [userId] = useState('user-123'); // En producción, esto vendría del auth

  const tabs = [
    {
      id: 'consent',
      label: 'Consentimiento',
      icon: CheckCircle,
      description: 'Gestiona tus consentimientos de datos'
    },
    {
      id: 'export',
      label: 'Exportar Datos',
      icon: Download,
      description: 'Descarga todos tus datos'
    },
    {
      id: 'delete',
      label: 'Eliminar Datos',
      icon: Trash2,
      description: 'Derecho al olvido'
    }
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'consent':
        return <ConsentManager userId={userId} />;
      case 'export':
        return <DataPortability userId={userId} />;
      case 'delete':
        return <RightToErasure userId={userId} />;
      default:
        return <ConsentManager userId={userId} />;
    }
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
            <Shield className="w-8 h-8 text-[#00ff41]" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Protección de Datos GDPR
            </h1>
          </div>
          
          <p className="text-white/70 max-w-3xl text-base sm:text-lg">
            Gestiona tus datos personales según el Reglamento General de Protección de Datos (GDPR). 
            Tienes control total sobre cómo se procesan y almacenan tus datos.
          </p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <GlassCard className="p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <CheckCircle className="w-6 h-6 text-[#00ff41]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Datos Encriptados</h3>
            <p className="text-white/60 text-sm">AES-256</p>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <Database className="w-6 h-6 text-[#00ff41]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Control Total</h3>
            <p className="text-white/60 text-sm">Exportar/Eliminar</p>
          </GlassCard>

          <GlassCard className="p-4 sm:p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-[#00ff41]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Transparencia</h3>
            <p className="text-white/60 text-sm">100% Compliant</p>
          </GlassCard>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <GlassButton
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  variant={activeTab === tab.id ? 'primary' : 'ghost'}
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </GlassButton>
              );
            })}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="mb-8">
          {renderActiveTab()}
        </div>

        {/* GDPR Information */}
        <GlassCard className="p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">
            Tus Derechos bajo GDPR
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#00ff41] mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Derecho de Acceso</h3>
                  <p className="text-white/70 text-sm">
                    Puedes solicitar una copia de todos los datos personales que tenemos sobre ti.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#00ff41] mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Derecho de Rectificación</h3>
                  <p className="text-white/70 text-sm">
                    Puedes corregir datos inexactos o incompletos en cualquier momento.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#00ff41] mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Derecho de Eliminación</h3>
                  <p className="text-white/70 text-sm">
                    Puedes solicitar la eliminación de tus datos personales en ciertas circunstancias.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#00ff41] mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Derecho de Portabilidad</h3>
                  <p className="text-white/70 text-sm">
                    Puedes exportar tus datos en un formato estructurado y legible.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#00ff41] mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Derecho de Oposición</h3>
                  <p className="text-white/70 text-sm">
                    Puedes oponerte al procesamiento de tus datos para ciertos fines.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-[#00ff41] mt-0.5" />
                <div>
                  <h3 className="text-white font-medium mb-1">Derecho de Limitación</h3>
                  <p className="text-white/70 text-sm">
                    Puedes solicitar que limitemos el procesamiento de tus datos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Contact Information */}
        <div className="text-center mt-8">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              ¿Tienes preguntas sobre tus datos?
            </h2>
            <p className="text-white/70 mb-4">
              Nuestro equipo de privacidad está disponible para ayudarte con cualquier consulta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <GlassButton size="lg">
                  Contactar Privacidad
                </GlassButton>
              </Link>
              <Link href="/privacy">
                <GlassButton variant="secondary" size="lg">
                  Ver Política de Privacidad
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
