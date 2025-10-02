'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Token } from '@/lib/constants/tokens';
import { formatPrice } from '@/lib/utils/formatters';
import { defaultChartOptions, latamColors, latamGradients } from '@/lib/chartjs/config';
import { ChartOptions } from 'chart.js';

interface PriceChartProps {
  token: Token;
  timeframe?: string;
}

/**
 * Gráfico de precio interactivo con Chart.js
 * Muestra la evolución del precio del token
 */
export function PriceChart({ token, timeframe = '7D' }: PriceChartProps) {

  // Generar datos mock para el gráfico
  const chartData = useMemo(() => {
    const data = [];
    const labels = [];
    const now = Date.now();
    const days = timeframe === '1H' ? 1 : timeframe === '24H' ? 1 : timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : 365;
    const points = timeframe === '1H' ? 24 : timeframe === '24H' ? 24 : 50;
    
    for (let i = 0; i < points; i++) {
      const timestamp = now - (days * 24 * 60 * 60 * 1000 * (points - i) / points);
      const basePrice = token.price;
      const volatility = 0.1; // 10% de volatilidad
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + randomChange);
      
      data.push(Math.max(price, token.atl)); // No menor que ATL
      
      // Generar labels para el eje X
      const date = new Date(timestamp);
      if (timeframe === '1H') {
        labels.push(date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
      } else if (timeframe === '24H') {
        labels.push(date.toLocaleTimeString('es-ES', { hour: '2-digit' }));
      } else if (timeframe === '7D') {
        labels.push(date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }));
      } else if (timeframe === '30D') {
        labels.push(date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }));
      } else {
        labels.push(date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' }));
      }
    }
    
    return { data, labels };
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

  if (chartData.data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white/60">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Line data={data} options={options} />
    </div>
  );
}
