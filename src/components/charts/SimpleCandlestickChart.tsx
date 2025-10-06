'use client';

import { useEffect, useRef, useState } from 'react';

interface Token {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  contract?: string;
}

interface SimpleCandlestickChartProps {
  token: Token;
  timeframe?: string;
  height?: number;
}

interface CandlestickDataPoint {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function SimpleCandlestickChart({ 
  token, 
  timeframe = '15m',
  height = 400 
}: SimpleCandlestickChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generar datos de velas japonesas simulados
  const generateCandlestickData = (): CandlestickDataPoint[] => {
    const data: CandlestickDataPoint[] = [];
    const now = Date.now();
    const intervalMs = getIntervalMs(timeframe);
    const basePrice = token.price;
    
    // Generar 50 puntos de datos
    for (let i = 50; i >= 0; i--) {
      const time = now - (i * intervalMs);
      const randomFactor = (Math.random() - 0.5) * 0.1; // ±5% variación
      const priceVariation = basePrice * randomFactor;
      
      const open = basePrice + priceVariation;
      const close = open + (Math.random() - 0.5) * basePrice * 0.02;
      const high = Math.max(open, close) + Math.random() * basePrice * 0.01;
      const low = Math.min(open, close) - Math.random() * basePrice * 0.01;
      
      data.push({
        time,
        open: Number(open.toFixed(8)),
        high: Number(high.toFixed(8)),
        low: Number(low.toFixed(8)),
        close: Number(close.toFixed(8))
      });
    }
    
    return data;
  };

  const getIntervalMs = (tf: string): number => {
    switch (tf) {
      case '1m': return 60 * 1000;
      case '5m': return 5 * 60 * 1000;
      case '15m': return 15 * 60 * 1000;
      case '1h': return 60 * 60 * 1000;
      case '4h': return 4 * 60 * 60 * 1000;
      case '1d': return 24 * 60 * 60 * 1000;
      default: return 15 * 60 * 1000;
    }
  };

  const drawCandlestickChart = (data: CandlestickDataPoint[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const padding = 40;
    const chartWidth = canvasWidth - (padding * 2);
    const chartHeight = canvasHeight - (padding * 2);

    // Limpiar canvas
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Encontrar min y max de precios
    const prices = data.flatMap(d => [d.open, d.high, d.low, d.close]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;

    // Dibujar grid
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    // Líneas horizontales
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvasWidth - padding, y);
      ctx.stroke();
    }

    // Líneas verticales
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartWidth / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvasHeight - padding);
      ctx.stroke();
    }

    ctx.setLineDash([]);

    // Dibujar velas japonesas
    const candleWidth = chartWidth / data.length * 0.8;
    const candleSpacing = chartWidth / data.length;

    data.forEach((candle, index) => {
      const x = padding + (candleSpacing * index) + (candleSpacing - candleWidth) / 2;
      const isGreen = candle.close >= candle.open;
      
      // Color de la vela
      ctx.fillStyle = isGreen ? '#00ff41' : '#ff0040';
      ctx.strokeStyle = isGreen ? '#00ff41' : '#ff0040';
      ctx.lineWidth = 1;

      // Calcular posiciones Y
      const openY = padding + chartHeight - ((candle.open - minPrice) / priceRange) * chartHeight;
      const closeY = padding + chartHeight - ((candle.close - minPrice) / priceRange) * chartHeight;
      const highY = padding + chartHeight - ((candle.high - minPrice) / priceRange) * chartHeight;
      const lowY = padding + chartHeight - ((candle.low - minPrice) / priceRange) * chartHeight;

      // Dibujar mecha superior
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, Math.min(openY, closeY));
      ctx.lineTo(x + candleWidth / 2, highY);
      ctx.stroke();

      // Dibujar mecha inferior
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, Math.max(openY, closeY));
      ctx.lineTo(x + candleWidth / 2, lowY);
      ctx.stroke();

      // Dibujar cuerpo de la vela
      const bodyHeight = Math.abs(closeY - openY);
      const bodyY = Math.min(openY, closeY);
      
      if (bodyHeight > 0) {
        ctx.fillRect(x, bodyY, candleWidth, bodyHeight);
      } else {
        // Línea horizontal para velas doji
        ctx.beginPath();
        ctx.moveTo(x, openY);
        ctx.lineTo(x + candleWidth, openY);
        ctx.stroke();
      }
    });

    // Dibujar precio actual
    const currentPrice = token.price;
    const currentY = padding + chartHeight - ((currentPrice - minPrice) / priceRange) * chartHeight;
    
    ctx.strokeStyle = '#00ff41';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(padding, currentY);
    ctx.lineTo(canvasWidth - padding, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dibujar etiquetas de precio
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`$${currentPrice.toFixed(8)}`, canvasWidth - padding + 5, currentY + 4);

    // Dibujar etiquetas de tiempo
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Inter, system-ui, sans-serif';
    
    const timeLabels = data.filter((_, index) => index % 10 === 0);
    timeLabels.forEach((candle, index) => {
      const x = padding + (chartWidth / timeLabels.length) * index;
      const date = new Date(candle.time);
      const timeStr = date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      ctx.fillText(timeStr, x, canvasHeight - padding + 20);
    });
  };

  useEffect(() => {
    const data = generateCandlestickData();
    drawCandlestickChart(data);
    setIsLoading(false);
  }, [token, timeframe]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="flex items-center space-x-2 text-white/60">
          <div className="w-4 h-4 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando gráfico avanzado...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef}
        width={800}
        height={height}
        className="w-full h-full"
        style={{ maxWidth: '100%', height: 'auto' }}
      />
      
      {/* Overlay con información del token */}
      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="text-white font-semibold text-sm">
          {token.symbol}/USD
        </div>
        <div className="text-[#00ff41] font-mono text-xs">
          ${token.price.toFixed(8)}
        </div>
        <div className={`text-xs ${token.change24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff0040]'}`}>
          {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
        </div>
      </div>

      {/* Indicadores técnicos overlay */}
      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 border border-white/10">
        <div className="text-white text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-white/60">RSI:</span>
            <span className="text-[#00ff41]">65.4</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">MACD:</span>
            <span className="text-[#ff6b35]">+0.0012</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/60">BB:</span>
            <span className="text-[#8b5cf6]">Upper</span>
          </div>
        </div>
      </div>
    </div>
  );
}
