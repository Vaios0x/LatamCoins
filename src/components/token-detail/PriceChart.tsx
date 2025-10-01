'use client';

import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Token } from '@/lib/constants/tokens';
import { formatPrice } from '@/lib/utils/formatters';

interface PriceChartProps {
  token: Token;
  timeframe?: string;
}

/**
 * Gráfico de precio interactivo
 * Muestra la evolución del precio del token
 */
export function PriceChart({ token, timeframe = '7D' }: PriceChartProps) {

  // Generar datos mock para el gráfico
  const chartData = useMemo(() => {
    const data = [];
    const now = Date.now();
    const days = timeframe === '1H' ? 1 : timeframe === '24H' ? 1 : timeframe === '7D' ? 7 : timeframe === '30D' ? 30 : 365;
    const points = timeframe === '1H' ? 24 : timeframe === '24H' ? 24 : 50;
    
    for (let i = 0; i < points; i++) {
      const timestamp = now - (days * 24 * 60 * 60 * 1000 * (points - i) / points);
      const basePrice = token.price;
      const volatility = 0.1; // 10% de volatilidad
      const randomChange = (Math.random() - 0.5) * volatility;
      const price = basePrice * (1 + randomChange);
      
      data.push({
        timestamp,
        price: Math.max(price, token.atl), // No menor que ATL
        date: new Date(timestamp).toISOString(),
      });
    }
    
    return data;
  }, [token, timeframe]);

  const isPositive = useMemo(() => {
    if (chartData.length < 2) return true;
    return chartData[chartData.length - 1].price >= chartData[0].price;
  }, [chartData]);

  const lineColor = isPositive ? '#00ff41' : '#ff0040';

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: number }) => {
    if (active && payload && payload.length && label) {
      return (
        <div className="bg-[#0a0e27]/90 backdrop-blur-xl border border-[#00ff41]/30 rounded-lg p-3 shadow-[0_8px_32px_0_rgba(0,255,65,0.1)]">
          <p className="text-white/60 text-sm">
            {new Date(label).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
          <p className="text-white font-mono">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-white/60">No hay datos disponibles</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            hide
          />
          <YAxis
            domain={['dataMin', 'dataMax']}
            hide
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke={lineColor}
            strokeWidth={2}
            dot={false}
            activeDot={{
              r: 4,
              fill: lineColor,
              stroke: '#ffffff',
              strokeWidth: 2,
            }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
