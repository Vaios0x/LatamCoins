'use client';

import { useMemo } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  className?: string;
}

/**
 * Componente de sparkline para mostrar mini gráficos
 * Gráfico de línea simple para tendencias de 7 días
 */
export function Sparkline({ data, className }: SparklineProps) {
  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      // Generar datos mock si no hay datos
      const mockData = [];
      for (let i = 0; i < 7; i++) {
        mockData.push({
          value: Math.random() * 100 + 50,
          index: i,
        });
      }
      return mockData;
    }
    
    return data.map((value, index) => ({
      value,
      index,
    }));
  }, [data]);

  // Determinar color basado en la tendencia
  const isPositive = useMemo(() => {
    if (chartData.length < 2) return true;
    return chartData[chartData.length - 1].value >= chartData[0].value;
  }, [chartData]);

  const lineColor = isPositive ? '#00ff41' : '#ff0040';

  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={false}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
