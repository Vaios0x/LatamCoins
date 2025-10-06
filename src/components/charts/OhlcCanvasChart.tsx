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

interface OhlcCanvasChartProps {
  token: Token;
  timeframe?: string;
  height?: number;
  className?: string;
}

interface Candle {
  time: number; // ms
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export function OhlcCanvasChart({
  token,
  timeframe = '15m',
  height = 400,
  className = ''
}: OhlcCanvasChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);

  const draw = (data: Candle[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const width = containerRef.current?.clientWidth || 800;
    const cssHeight = height;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = cssHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, cssHeight);

    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = cssHeight - padding * 2;

    if (data.length === 0) return;

    const prices: number[] = [];
    data.forEach(c => {
      prices.push(c.open, c.high, c.low, c.close);
    });
    let minP = Math.min(...prices);
    let maxP = Math.max(...prices);
    if (maxP - minP < 1e-12) {
      maxP += 1e-8; minP -= 1e-8;
    }
    const range = maxP - minP;

    // grid
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 1;
    ctx.setLineDash([2,2]);
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartH / 5) * i;
      ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      const x = padding + (chartW / 10) * i;
      ctx.beginPath(); ctx.moveTo(x, padding); ctx.lineTo(x, cssHeight - padding); ctx.stroke();
    }
    ctx.setLineDash([]);

    const spacing = chartW / data.length;
    const candleW = Math.max(1, spacing * 0.65);

    data.forEach((c, idx) => {
      const x = padding + idx * spacing + (spacing - candleW) / 2;
      const isGreen = c.close >= c.open;
      ctx.strokeStyle = isGreen ? '#00ff41' : '#ff0040';
      ctx.fillStyle = isGreen ? '#00ff41' : '#ff0040';

      const yOpen = padding + chartH - ((c.open - minP) / range) * chartH;
      const yClose = padding + chartH - ((c.close - minP) / range) * chartH;
      const yHigh = padding + chartH - ((c.high - minP) / range) * chartH;
      const yLow = padding + chartH - ((c.low - minP) / range) * chartH;

      // wick
      ctx.beginPath();
      ctx.moveTo(x + candleW / 2, yHigh);
      ctx.lineTo(x + candleW / 2, yLow);
      ctx.stroke();

      // body
      const bodyY = Math.min(yOpen, yClose);
      const bodyH = Math.max(1, Math.abs(yClose - yOpen));
      ctx.fillRect(x, bodyY, candleW, bodyH);
    });

    // current price line
    const current = token.price;
    const yCur = padding + chartH - ((current - minP) / range) * chartH;
    ctx.setLineDash([5,5]);
    ctx.strokeStyle = '#00ff41';
    ctx.beginPath(); ctx.moveTo(padding, yCur); ctx.lineTo(width - padding, yCur); ctx.stroke();
    ctx.setLineDash([]);
  };

  useEffect(() => {
    const load = async () => {
      if (!token.contract) { setError('No token contract'); setIsLoading(false); return; }
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/candles?address=${token.contract}&timeframe=${timeframe}&limit=200`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || 'Error loading candles');
        const c: Candle[] = (json.data || []).map((d: any) => ({
          time: d.time,
          open: Number(d.open),
          high: Number(d.high),
          low: Number(d.low),
          close: Number(d.close),
          volume: Number(d.volume || 0)
        }));
        setCandles(c);
        draw(c);
        setIsLoading(false);
      } catch (e: any) {
        console.error('Canvas OHLC error:', e);
        setError(e?.message || 'Error');
        setIsLoading(false);
      }
    };
    load();

    const onResize = () => draw(candles);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [token.contract, timeframe]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} style={{ height }}>
      <canvas ref={canvasRef} className="block" />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center space-x-2 text-white/60">
            <div className="w-4 h-4 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin"></div>
            <span>Cargando velas...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/70 text-sm">{error}</div>
        </div>
      )}
    </div>
  );
}


