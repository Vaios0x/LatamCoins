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
      // Si no hay datos reales, mostrar línea plana
      return [{ value: 0, index: 0 }];
    }
    
    // Usar datos reales de CoinGecko
    return data.map((value, index) => ({
      value: value || 0,
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
