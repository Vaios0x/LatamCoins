'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Trash2, AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';

interface RightToErasureProps {
  userId: string;
}

/**
 * Componente para derecho al olvido GDPR
 */
export function RightToErasure({ userId }: RightToErasureProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'warning'>('warning');

  const requiredText = 'ELIMINAR MIS DATOS';
  const isConfirmationValid = confirmationText === requiredText;

  const handleDeleteData = async () => {
    if (!isConfirmationValid) {
      setMessage('Debes escribir exactamente: "ELIMINAR MIS DATOS"');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/gdpr/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          confirmDeletion: true
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Datos eliminados exitosamente. Tu cuenta será desactivada.');
        setMessageType('success');
        setShowConfirmation(false);
      } else {
        setMessage(`Eliminación parcial: ${data.data?.errors?.join(', ') || 'Error desconocido'}`);
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error de conexión al eliminar datos');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const getMessageIcon = () => {
    switch (messageType) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-[#00ff41]" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-[#ff0040]" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-[#ffaa00]" />;
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'success':
        return 'text-[#00ff41]';
      case 'error':
        return 'text-[#ff0040]';
      default:
        return 'text-[#ffaa00]';
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Trash2 className="w-6 h-6 text-[#ff0040]" />
          <h2 className="text-xl font-semibold text-white">Derecho al Olvido</h2>
        </div>

        {!showConfirmation ? (
          <div className="space-y-4">
            <div className="p-4 bg-[#ff0040]/10 border border-[#ff0040]/30 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-[#ff0040] mt-0.5" />
                <div>
                  <h3 className="text-[#ff0040] font-medium mb-2">⚠️ Acción Irreversible</h3>
                  <p className="text-white/80 text-sm">
                    Esta acción eliminará <strong>permanentemente</strong> todos tus datos de LATAMCOINS:
                  </p>
                  <ul className="text-white/70 text-sm mt-2 space-y-1">
                    <li>• Perfil y información personal</li>
                    <li>• Historial de trading y transacciones</li>
                    <li>• Preferencias y configuraciones</li>
                    <li>• Datos de analytics y uso</li>
                    <li>• Registros de consentimiento</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#0a0e27]/30 rounded-lg border border-white/10">
              <h3 className="text-white font-medium mb-2">¿Qué se mantiene?</h3>
              <p className="text-white/70 text-sm">
                Por razones de compliance y auditoría, se mantendrán registros anonimizados 
                de transacciones para cumplir con regulaciones financieras.
              </p>
            </div>

            <div className="p-4 bg-[#ffaa00]/10 border border-[#ffaa00]/30 rounded-lg">
              <h3 className="text-[#ffaa00] font-medium mb-2">Alternativas</h3>
              <p className="text-white/80 text-sm">
                Antes de eliminar todo, considera:
              </p>
              <ul className="text-white/70 text-sm mt-2 space-y-1">
                <li>• Exportar tus datos primero</li>
                <li>• Desactivar notificaciones</li>
                <li>• Contactar soporte para dudas</li>
              </ul>
            </div>

            <GlassButton
              variant="danger"
              size="lg"
              onClick={() => setShowConfirmation(true)}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Proceder con la Eliminación
            </GlassButton>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[#ff0040]/10 border border-[#ff0040]/30 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-5 h-5 text-[#ff0040]" />
                <h3 className="text-[#ff0040] font-medium">Confirmación Final</h3>
              </div>
              <p className="text-white/80 text-sm mb-4">
                Para confirmar la eliminación de todos tus datos, escribe exactamente:
              </p>
              <div className="p-3 bg-black/20 rounded-lg border border-[#ff0040]/30">
                <code className="text-[#ff0040] font-mono text-lg">ELIMINAR MIS DATOS</code>
              </div>
            </div>

            <div>
              <label className="block text-white/80 text-sm mb-2">
                Confirmación:
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Escribe: ELIMINAR MIS DATOS"
                className="w-full px-4 py-3 bg-[#0a0e27]/50 backdrop-blur-lg border border-[#ff0040]/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[#ff0040]/50 focus:border-[#ff0040]/40 transition-all duration-300"
              />
            </div>

            <div className="flex space-x-3">
              <GlassButton
                variant="ghost"
                onClick={() => {
                  setShowConfirmation(false);
                  setConfirmationText('');
                  setMessage('');
                }}
                className="flex-1"
              >
                Cancelar
              </GlassButton>
              
              <GlassButton
                variant="danger"
                onClick={handleDeleteData}
                loading={loading}
                disabled={!isConfirmationValid}
                className="flex-1"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar Definitivamente
              </GlassButton>
            </div>

            {message && (
              <div className={`flex items-center space-x-2 p-3 rounded-lg ${
                messageType === 'success' ? 'bg-[#00ff41]/10 border border-[#00ff41]/30' :
                messageType === 'error' ? 'bg-[#ff0040]/10 border border-[#ff0040]/30' :
                'bg-[#ffaa00]/10 border border-[#ffaa00]/30'
              }`}>
                {getMessageIcon()}
                <p className={`text-sm ${getMessageColor()}`}>{message}</p>
              </div>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
