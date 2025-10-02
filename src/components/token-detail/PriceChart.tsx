'use client';

import { useMemo, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Token } from '@/lib/constants/tokens';
import { defaultChartOptions, latamColors, latamGradients } from '@/lib/chartjs/config';
import { ChartOptions } from 'chart.js';
import { useCurrency } from '@/components/ui/CurrencySelector';

interface PriceChartProps {
  token: Token;
  timeframe?: string;
}

/**
 * Gráfico de precio interactivo con Chart.js
 * Muestra la evolución del precio del token con datos reales
 */
export function PriceChart({ token, timeframe = '7D' }: PriceChartProps) {
  const [chartData, setChartData] = useState<{ data: number[]; labels: string[] }>({ data: [], labels: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  
  // Usar el hook de moneda
  const { formatPrice } = useCurrency();

  // Función auxiliar para generar datos simulados
  const generateSimulatedData = (currentPrice: number) => {
    const data = Array.from({ length: 7 }, (_, i) => {
      const variation = (Math.random() - 0.5) * 0.2; // ±10% de variación
      return currentPrice * (1 + variation * (i / 7));
    });
    const labels = data.map((_, index) => {
      const date = new Date(Date.now() - (data.length - index - 1) * 24 * 60 * 60 * 1000);
      if (timeframe === '1H') {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      } else if (timeframe === '24H') {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit' });
      } else if (timeframe === '7D') {
        return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
      } else if (timeframe === '30D') {
        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
      } else {
        return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
      }
    });
    return { data, labels };
  };

  // Obtener datos reales del token
  useEffect(() => {
    const fetchRealChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener datos del token desde nuestra API
        const response = await fetch('/api/tokens');
        const result = await response.json();

        if (result.success && result.data) {
          const tokenData = result.data.find((t: any) => 
            t.symbol === token.symbol || t.id === token.id
          );

          if (tokenData) {
            // Usar datos reales si están disponibles
            if (tokenData.sparkline && tokenData.sparkline.length > 0) {
              const data = tokenData.sparkline;
              const labels = data.map((_: number, index: number) => {
                const date = new Date(Date.now() - (data.length - index - 1) * 24 * 60 * 60 * 1000);
                if (timeframe === '1H') {
                  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                } else if (timeframe === '24H') {
                  return date.toLocaleTimeString('es-ES', { hour: '2-digit' });
                } else if (timeframe === '7D') {
                  return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
                } else if (timeframe === '30D') {
                  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                } else {
                  return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
                }
              });
              setChartData({ data, labels });
              setIsSimulated(false); // Datos reales
            } else {
              // Si no hay sparkline, generar datos simulados basados en el precio actual
              console.warn(`No hay datos históricos para ${token.symbol}, generando datos simulados`);
              const currentPrice = tokenData.price || token.price;
              setChartData(generateSimulatedData(currentPrice));
              setIsSimulated(true); // Datos simulados
            }
          } else {
            // Si no se encuentra el token, generar datos simulados
            console.warn(`Token ${token.symbol} no encontrado en API, generando datos simulados`);
            setChartData(generateSimulatedData(token.price));
            setIsSimulated(true); // Datos simulados
          }
        } else {
          // Si hay error en la API, generar datos simulados
          console.warn('Error en API, generando datos simulados');
          setChartData(generateSimulatedData(token.price));
          setIsSimulated(true); // Datos simulados
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        // En caso de error, generar datos simulados
        console.warn('Error en fetch, generando datos simulados como fallback');
        setChartData(generateSimulatedData(token.price));
        setIsSimulated(true); // Datos simulados
        setError(null); // Limpiar error ya que tenemos datos simulados
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealChartData();
  }, [token, timeframe]);

  const isPositive = useMemo(() => {
    if (chartData.data.length < 2) return true;
    return chartData.data[chartData.data.length - 1] >= chartData.data[0];
  }, [chartData]);

  const lineColor = isPositive ? latamColors.primary : latamColors.danger;
  const fillColor = isPositive ? latamGradients.primary : latamGradients.danger;

  const options: ChartOptions<'line'> = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      legend: {
        display: false,
      },
      tooltip: {
        ...defaultChartOptions.plugins?.tooltip,
        borderColor: lineColor,
        callbacks: {
          label: function(context: { parsed: { y: number } }) {
            return `Precio: ${formatPrice(context.parsed.y)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(0, 255, 65, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 10,
          },
          maxTicksLimit: 6,
        },
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(0, 255, 65, 0.1)',
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 10,
          },
          callback: (value: string | number) => {
            const numValue = typeof value === 'number' ? value : parseFloat(value.toString());
            return `$${numValue.toFixed(6)}`;
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
        hoverBorderWidth: 2,
        hoverBorderColor: '#ffffff',
      },
    },
  };

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Precio',
        data: chartData.data,
        borderColor: lineColor,
        backgroundColor: fillColor,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: lineColor,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Cargando datos del gráfico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-white/60 mb-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#00ff41]/20 hover:bg-[#00ff41]/30 border border-[#00ff41]/50 text-[#00ff41] rounded-lg transition-all duration-300"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (chartData.data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white/60">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Indicador de datos simulados */}
      {isSimulated && (
        <div className="absolute top-2 right-2 z-10 bg-[#ffaa00]/20 backdrop-blur-sm border border-[#ffaa00]/30 rounded-lg px-2 py-1">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-[#ffaa00] rounded-full animate-pulse"></div>
            <span className="text-xs text-[#ffaa00] font-medium">Datos Simulados</span>
          </div>
        </div>
      )}
      
      <Line data={data} options={options} />
    </div>
  );
}
