'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { defaultChartOptions, latamColors, latamGradients } from '@/lib/chartjs/config';
import { ChartOptions } from 'chart.js';

interface SparklineProps {
  data: number[];
  className?: string;
}

/**
 * Componente de sparkline para mostrar mini gráficos con Chart.js
 * Gráfico de línea simple para tendencias de 7 días
 */
export function Sparkline({ data, className }: SparklineProps) {
  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Si no hay datos reales, mostrar línea plana
      return { data: [0], labels: [''] };
    }
    
    // Usar datos reales
    const processedData = data.map(value => value || 0);
    const labels = processedData.map((_, index) => index.toString());
    
    return { data: processedData, labels };
  }, [data]);

  // Determinar color basado en la tendencia
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
        enabled: false,
      },
    },
    scales: {
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 0,
      },
    },
  };

  const dataConfig = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Sparkline',
        data: chartData.data,
        borderColor: lineColor,
        backgroundColor: fillColor,
        borderWidth: 1.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  return (
    <div className={`w-full h-full ${className}`}>
      <Line data={dataConfig} options={options} />
    </div>
  );
}
