'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Download, FileText, Database, AlertCircle, CheckCircle } from 'lucide-react';

interface DataPortabilityProps {
  userId: string;
}

/**
 * Componente para exportación de datos GDPR
 */
export function DataPortability({ userId }: DataPortabilityProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info');

  const handleExport = async (format: 'json' | 'csv') => {
    setLoading(true);
    setMessage('');
    setMessageType('info');

    try {
      const response = await fetch(`/api/gdpr/export?userId=${userId}&format=${format}`);
      
      if (format === 'csv') {
        // Descargar archivo CSV
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `user-data-${userId}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage('Archivo CSV descargado exitosamente');
        setMessageType('success');
      } else {
        // Mostrar datos JSON
        const data = await response.json();
        
        if (data.success) {
          // Crear y descargar archivo JSON
          const jsonString = JSON.stringify(data.data, null, 2);
          const blob = new Blob([jsonString], { type: 'application/json' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `user-data-${userId}.json`;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          setMessage('Archivo JSON descargado exitosamente');
          setMessageType('success');
        } else {
          setMessage('Error al exportar datos');
          setMessageType('error');
        }
      }
    } catch (error) {
      setMessage('Error de conexión al exportar datos');
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
        return <AlertCircle className="w-4 h-4 text-[#ff0040]" />;
      default:
        return <Database className="w-4 h-4 text-white/60" />;
    }
  };

  const getMessageColor = () => {
    switch (messageType) {
      case 'success':
        return 'text-[#00ff41]';
      case 'error':
        return 'text-[#ff0040]';
      default:
        return 'text-white/60';
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Download className="w-6 h-6 text-[#00ff41]" />
          <h2 className="text-xl font-semibold text-white">Exportar Mis Datos</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-[#0a0e27]/30 rounded-lg border border-white/10">
            <h3 className="text-white font-medium mb-2">¿Qué datos se exportan?</h3>
            <ul className="text-white/70 text-sm space-y-1">
              <li>• Información personal (nombre, email, fecha de registro)</li>
              <li>• Historial de trading y transacciones</li>
              <li>• Preferencias y configuraciones</li>
              <li>• Historial de consentimientos GDPR</li>
              <li>• Datos de uso de la plataforma</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0a0e27]/30 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3 mb-3">
                <FileText className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-white font-medium">Formato JSON</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Datos estructurados en formato JSON, ideal para desarrolladores y análisis técnico.
              </p>
              <GlassButton
                size="sm"
                onClick={() => handleExport('json')}
                loading={loading}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar JSON
              </GlassButton>
            </div>

            <div className="p-4 bg-[#0a0e27]/30 rounded-lg border border-white/10">
              <div className="flex items-center space-x-3 mb-3">
                <Database className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-white font-medium">Formato CSV</h3>
              </div>
              <p className="text-white/70 text-sm mb-4">
                Datos en formato CSV, compatible con Excel y herramientas de análisis.
              </p>
              <GlassButton
                size="sm"
                variant="secondary"
                onClick={() => handleExport('csv')}
                loading={loading}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar CSV
              </GlassButton>
            </div>
          </div>

          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              messageType === 'success' ? 'bg-[#00ff41]/10 border border-[#00ff41]/30' :
              messageType === 'error' ? 'bg-[#ff0040]/10 border border-[#ff0040]/30' :
              'bg-white/10 border border-white/20'
            }`}>
              {getMessageIcon()}
              <p className={`text-sm ${getMessageColor()}`}>{message}</p>
            </div>
          )}

          <div className="p-3 bg-[#ffaa00]/10 border border-[#ffaa00]/30 rounded-lg">
            <p className="text-[#ffaa00] text-sm">
              <strong>Nota:</strong> La exportación puede tomar unos minutos dependiendo de la cantidad de datos. 
              Los archivos se descargarán automáticamente a tu dispositivo.
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
