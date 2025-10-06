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

interface RealCandlestickChartProps {
  token: Token;
  timeframe?: string;
  height?: number;
}

interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

export function RealCandlestickChart({ 
  token, 
  timeframe = '15m',
  height = 400 
}: RealCandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<string>('loading');

  // Cargar velas reales
  const fetchCandles = async () => {
    if (!token.contract) {
      setError('No contract address available');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(
        `/api/candles?address=${token.contract}&timeframe=${timeframe}&limit=200`
      );
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch candles');
      }

      const candles: CandlestickData[] = result.data;
      setDataSource(result.source || 'unknown');
      
      console.log(`📊 Loaded ${candles.length} candles from ${result.source}`);

      // Crear gráfico si no existe
      if (!chartRef.current) {
        await initChart();
      }

      // Actualizar datos
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(candles);
      }

      if (volumeSeriesRef.current && candles[0]?.volume) {
        const volumeData = candles.map(candle => ({
          time: candle.time,
          value: candle.volume,
          color: candle.close >= candle.open ? '#00ff41' : '#ff0040'
        }));
        volumeSeriesRef.current.setData(volumeData);
      }

      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching candles:', err);
      setError('Failed to load chart data');
      setIsLoading(false);
    }
  };

  const initChart = async () => {
    if (!chartContainerRef.current) return;

    try {
      // Importación dinámica robusta de lightweight-charts (compat ESM/CJS/Turbopack)
      const LW: any = await import('lightweight-charts');
      const lwCreateChart = (LW && (LW.createChart || LW.default)) as any;
      const ColorType = LW?.ColorType || { Solid: 0 } as any;
      if (!lwCreateChart) {
        throw new Error('lightweight-charts createChart not available');
      }

      // Configuración del tema oscuro
      const chartOptions = {
        layout: {
          background: { type: ColorType.Solid, color: '#0a0a0a' },
          textColor: '#ffffff',
          fontSize: 12,
          fontFamily: 'Inter, system-ui, sans-serif'
        },
        grid: {
          vertLines: { color: '#1a1a2e', style: 1 },
          horzLines: { color: '#1a1a2e', style: 1 }
        },
        crosshair: {
          mode: 1,
          vertLine: {
            color: '#00ff41',
            width: 1,
            style: 3,
            labelBackgroundColor: '#00ff41'
          },
          horzLine: {
            color: '#00ff41',
            width: 1,
            style: 3,
            labelBackgroundColor: '#00ff41'
          }
        },
        rightPriceScale: {
          borderColor: '#1a1a2e',
          textColor: '#ffffff',
          scaleMargins: {
            top: 0.1,
            bottom: 0.1
          }
        },
        timeScale: {
          borderColor: '#1a1a2e',
          textColor: '#ffffff',
          timeVisible: true,
          secondsVisible: false
        },
        watermark: {
          color: 'rgba(0, 255, 65, 0.1)',
          visible: true,
          text: `${token.symbol}/USD`,
          fontSize: 24,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontStyle: 'bold'
        }
      };

      // Crear el gráfico
      const chart: any = lwCreateChart(chartContainerRef.current, {
        ...chartOptions,
        width: chartContainerRef.current.clientWidth,
        height: height
      });

      // Crear serie de velas japonesas
      const candlestickSeries = chart.addCandlestickSeries
        ? chart.addCandlestickSeries({
        upColor: '#00ff41',
        downColor: '#ff0040',
        borderUpColor: '#00ff41',
        borderDownColor: '#ff0040',
        wickUpColor: '#00ff41',
        wickDownColor: '#ff0040',
        priceFormat: {
          type: 'price',
          precision: 8,
          minMove: 0.00000001
        }
        })
        // Fallback a serie de líneas si por alguna razón falta el método
        : chart.addLineSeries({ color: '#ff6b35' });

      // Crear serie de volumen
      const volumeSeries = chart.addHistogramSeries ? chart.addHistogramSeries({
        color: '#00ff41',
        priceFormat: {
          type: 'volume'
        },
        priceScaleId: 'volume'
      }) : null;

      // Configurar escala de volumen
      if (volumeSeries && chart.priceScale) {
        chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.8,
          bottom: 0
        }
        });
      }

      // Configurar responsividad
      const handleResize = () => {
        if (chartContainerRef.current) {
          chart.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: height
          });
        }
      };

      window.addEventListener('resize', handleResize);

      // Guardar referencias
      chartRef.current = chart;
      candlestickSeriesRef.current = candlestickSeries;
      volumeSeriesRef.current = volumeSeries;

    } catch (error) {
      console.error('Error creating chart:', error);
      setError('Failed to initialize chart');
    }
  };

  useEffect(() => {
    fetchCandles();
  }, [token.contract, timeframe]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="flex items-center space-x-2 text-white/60">
          <div className="w-4 h-4 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin"></div>
          <span>Cargando velas reales...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="text-center">
          <div className="text-red-400 mb-2">⚠️</div>
          <div className="text-white/60 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={chartContainerRef} 
        className="w-full"
        style={{ height }}
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
        <div className="text-xs text-white/60 mt-1">
          Fuente: {dataSource === 'birdeye' ? 'Birdeye' : 'Simulado'}
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
