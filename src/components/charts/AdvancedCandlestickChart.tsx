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

interface AdvancedCandlestickChartProps {
  token: Token;
  timeframe?: string;
  height?: number;
}

interface CandlestickDataPoint {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export function AdvancedCandlestickChart({ 
  token, 
  timeframe = '15m',
  height = 400 
}: AdvancedCandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generar datos de velas japonesas simulados
  const generateCandlestickData = (): CandlestickDataPoint[] => {
    const data: CandlestickDataPoint[] = [];
    const now = Date.now();
    const intervalMs = getIntervalMs(timeframe);
    const basePrice = token.price;
    
    // Generar 100 puntos de datos
    for (let i = 100; i >= 0; i--) {
      const time = (now - (i * intervalMs)) as UTCTimestamp;
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

  const generateVolumeData = (candlestickData: CandlestickDataPoint[]) => {
    return candlestickData.map((candle, index) => ({
      time: candle.time,
      value: Math.random() * token.volume24h * 0.01, // Volumen simulado
      color: candle.close >= candle.open ? '#00ff41' : '#ff0040'
    }));
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Importación dinámica de lightweight-charts
    const initChart = async () => {
      try {
        const { createChart, ColorType } = await import('lightweight-charts');
        
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
    const chart = createChart(chartContainerRef.current, {
      ...chartOptions,
      width: chartContainerRef.current.clientWidth,
      height: height
    });

    // Crear serie de velas japonesas
    const candlestickSeries = chart.addCandlestickSeries({
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
    });

    // Crear serie de volumen
    const volumeSeries = chart.addHistogramSeries({
      color: '#00ff41',
      priceFormat: {
        type: 'volume'
      },
      priceScaleId: 'volume'
    });

    // Configurar escala de volumen
    chart.priceScale('volume').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0
      }
    });

    // Generar y cargar datos
    const candlestickData = generateCandlestickData();
    const volumeData = generateVolumeData(candlestickData);

    candlestickSeries.setData(candlestickData);
    volumeSeries.setData(volumeData);

    // Agregar líneas de referencia
    const avgPrice = candlestickData.reduce((sum, candle) => sum + candle.close, 0) / candlestickData.length;
    
    // Línea de precio promedio
    candlestickSeries.createPriceLine({
      price: avgPrice,
      color: '#ff6b35',
      lineWidth: 1,
      lineStyle: 2, // Dotted
      axisLabelVisible: true,
      title: 'Avg Entry'
    });

    // Línea de precio actual
    candlestickSeries.createPriceLine({
      price: token.price,
      color: '#00ff41',
      lineWidth: 2,
      lineStyle: 0, // Solid
      axisLabelVisible: true,
      title: 'Current Price'
    });

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

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading lightweight-charts:', error);
        setIsLoading(false);
      }
    };

    // Llamar a la función async
    initChart();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [token, timeframe, height]);

  // Actualizar datos cuando cambie el timeframe
  useEffect(() => {
    if (candlestickSeriesRef.current && volumeSeriesRef.current) {
      const newData = generateCandlestickData();
      const newVolumeData = generateVolumeData(newData);
      
      candlestickSeriesRef.current.setData(newData);
      volumeSeriesRef.current.setData(newVolumeData);
    }
  }, [timeframe, token.price]);

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
