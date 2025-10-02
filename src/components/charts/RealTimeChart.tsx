'use client';

import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { defaultChartOptions, latamColors, latamGradients } from '@/lib/chartjs/config';
import { ChartOptions } from 'chart.js';

interface RealTimeChartProps {
  data: number[];
  labels?: string[];
  title?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

export function RealTimeChart({ 
  data, 
  labels, 
  title = "Precio en Tiempo Real",
  height = 300,
  showGrid = true,
  showLegend = false
}: RealTimeChartProps) {
  const [chartData, setChartData] = useState({
    labels: labels || data.map((_, index) => index.toString()),
    datasets: [
      {
        label: 'Precio',
        data: data,
        borderColor: latamColors.primary,
        backgroundColor: latamGradients.primary,
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: latamColors.primary,
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
      },
    ],
  });

  useEffect(() => {
    setChartData(prev => ({
      ...prev,
      labels: labels || data.map((_, index) => index.toString()),
      datasets: [
        {
          ...prev.datasets[0],
          data: data,
        },
      ],
    }));
  }, [data, labels]);

  const options: ChartOptions<'line'> = {
    ...defaultChartOptions,
    plugins: {
      ...defaultChartOptions.plugins,
      legend: {
        ...defaultChartOptions.plugins?.legend,
        display: showLegend,
      },
      title: {
        display: !!title,
        text: title,
        color: '#ffffff',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
      tooltip: {
        ...defaultChartOptions.plugins?.tooltip,
        callbacks: {
          label: function(context: { parsed: { y: number } }) {
            return `Precio: $${context.parsed.y.toFixed(8)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ...defaultChartOptions.scales?.x,
        display: showGrid,
        ticks: {
          ...defaultChartOptions.scales?.x?.ticks,
          maxTicksLimit: 8,
          callback: function(value: string | number, index: number) {
            // Mostrar solo algunos labels para evitar saturación
            if (index % Math.ceil(chartData.labels.length / 6) === 0) {
              return chartData.labels[index] || '';
            }
            return '';
          },
        },
      },
      y: {
        ...defaultChartOptions.scales?.y,
        display: showGrid,
        ticks: {
          ...defaultChartOptions.scales?.y?.ticks,
          callback: (value: string | number) => {
            const numValue = typeof value === 'number' ? value : parseFloat(value.toString());
            return `$${numValue.toFixed(8)}`;
          },
        },
      },
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  };

  return (
    <div className="w-full" style={{ height: `${height}px` }}>
      <Line data={chartData} options={options} />
    </div>
  );
}

/**
 * Mini chart component for sparklines
 */
export function MiniChart({ 
  data, 
  height = 40,
  color = '#00ff41'
}: { 
  data: number[]; 
  height?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate dimensions
    const width = canvas.width;
    const height = canvas.height;
    const padding = 2;

    // Find min and max values
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    data.forEach((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((value - min) / range) * (height - 2 * padding);
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Fill area under line
    ctx.fillStyle = `${color}20`;
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(padding, height - padding);
    ctx.closePath();
    ctx.fill();

  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      width={120}
      height={height}
      className="w-full h-full"
    />
  );
}
