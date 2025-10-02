'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Shield, CheckCircle, XCircle, Download, Trash2, Eye } from 'lucide-react';

interface ConsentRecord {
  purpose: string;
  granted: boolean;
  timestamp: string;
  version: string;
}

interface ConsentManagerProps {
  userId: string;
}

/**
 * Componente para gestión de consentimiento GDPR
 */
export function ConsentManager({ userId }: ConsentManagerProps) {
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const consentPurposes = [
    {
      id: 'analytics',
      title: 'Análisis y Estadísticas',
      description: 'Recopilar datos de uso para mejorar la plataforma',
      required: false
    },
    {
      id: 'marketing',
      title: 'Marketing y Comunicaciones',
      description: 'Enviar notificaciones sobre nuevos tokens y features',
      required: false
    },
    {
      id: 'trading',
      title: 'Datos de Trading',
      description: 'Procesar y almacenar información de transacciones',
      required: true
    },
    {
      id: 'security',
      title: 'Seguridad y Prevención de Fraude',
      description: 'Monitorear actividad para proteger tu cuenta',
      required: true
    }
  ];

  useEffect(() => {
    fetchConsentHistory();
  }, [userId]);

  const fetchConsentHistory = async () => {
    try {
      const response = await fetch(`/api/gdpr/consent?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setConsents(data.data.consentHistory);
      }
    } catch (error) {
      console.error('Error fetching consent history:', error);
    }
  };

  const handleConsentChange = async (purpose: string, granted: boolean) => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/gdpr/consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          purpose,
          granted
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(granted ? 'Consentimiento otorgado' : 'Consentimiento retirado');
        fetchConsentHistory();
      } else {
        setMessage('Error al actualizar consentimiento');
      }
    } catch (error) {
      setMessage('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const getConsentStatus = (purpose: string) => {
    const consent = consents
      .filter(c => c.purpose === purpose)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    
    return consent?.granted || false;
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Shield className="w-6 h-6 text-[#00ff41]" />
          <h2 className="text-xl font-semibold text-white">Gestión de Consentimiento GDPR</h2>
        </div>

        <div className="space-y-4">
          {consentPurposes.map((purpose) => {
            const isGranted = getConsentStatus(purpose.id);
            const isRequired = purpose.required;

            return (
              <div key={purpose.id} className="flex items-center justify-between p-4 bg-[#0a0e27]/30 rounded-lg border border-white/10">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-white font-medium">{purpose.title}</h3>
                    {isRequired && (
                      <span className="px-2 py-1 text-xs bg-[#ff0040]/20 text-[#ff0040] rounded-full">
                        Requerido
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 text-sm">{purpose.description}</p>
                </div>

                <div className="flex items-center space-x-2">
                  {isGranted ? (
                    <CheckCircle className="w-5 h-5 text-[#00ff41]" />
                  ) : (
                    <XCircle className="w-5 h-5 text-[#ff0040]" />
                  )}
                  
                  {!isRequired && (
                    <GlassButton
                      size="sm"
                      variant={isGranted ? "danger" : "primary"}
                      onClick={() => handleConsentChange(purpose.id, !isGranted)}
                      loading={loading}
                    >
                      {isGranted ? 'Retirar' : 'Otorgar'}
                    </GlassButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {message && (
          <div className="mt-4 p-3 bg-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg">
            <p className="text-[#00ff41] text-sm">{message}</p>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
