'use client';

import { useMemo, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Token } from '@/lib/constants/tokens';
import { defaultChartOptions, latamColors, latamGradients } from '@/lib/chartjs/config';
import { ChartOptions } from 'chart.js';
import { useCurrency } from '@/components/ui/CurrencySelector';

interface RealTimePriceChartProps {
  token: Token;
  timeframe?: string;
}

// Función para obtener datos históricos reales de DexScreener
async function fetchRealHistoricalData(tokenContract: string, timeframe: string): Promise<{ data: number[]; labels: string[] }> {
  try {
    console.log(`🔍 Obteniendo datos históricos reales para ${tokenContract} desde septiembre 2025...`);
    
    // Obtener datos históricos de DexScreener
    const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${tokenContract}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LATAMCOINS/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    const dexData = await response.json();
    
    if (dexData.pairs && dexData.pairs.length > 0) {
      const pair = dexData.pairs[0];
      console.log('📊 Par encontrado en DexScreener:', pair);
      
      // Si hay datos de precio histórico, usarlos
      if (pair.priceHistory && pair.priceHistory.length > 0) {
        console.log(`✅ Datos históricos reales encontrados: ${pair.priceHistory.length} puntos`);
        
        // Filtrar datos según el timeframe
        let filteredData = pair.priceHistory;
        const now = Date.now();
        
        switch (timeframe) {
          case '1H':
            // Última hora
            filteredData = pair.priceHistory.filter((p: { timestamp: number }) => 
              now - p.timestamp <= 60 * 60 * 1000
            );
            break;
          case '24H':
            // Últimas 24 horas
            filteredData = pair.priceHistory.filter((p: { timestamp: number }) => 
              now - p.timestamp <= 24 * 60 * 60 * 1000
            );
            break;
          case '7D':
            // Últimos 7 días
            filteredData = pair.priceHistory.filter((p: { timestamp: number }) => 
              now - p.timestamp <= 7 * 24 * 60 * 60 * 1000
            );
            break;
          case '30D':
            // Últimos 30 días
            filteredData = pair.priceHistory.filter((p: { timestamp: number }) => 
              now - p.timestamp <= 30 * 24 * 60 * 60 * 1000
            );
            break;
          case '1Y':
            // Último año
            filteredData = pair.priceHistory.filter((p: { timestamp: number }) => 
              now - p.timestamp <= 365 * 24 * 60 * 60 * 1000
            );
            break;
        }
        
        if (filteredData.length > 0) {
          const data = filteredData.map((p: { price: string }) => parseFloat(p.price));
          const labels = filteredData.map((p: { timestamp: number }) => {
            const date = new Date(p.timestamp);
            if (timeframe === '1H') {
              return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
            } else if (timeframe === '24H') {
              return date.toLocaleTimeString('es-ES', { hour: '2-digit' });
            } else if (timeframe === '7D') {
              return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
            } else if (timeframe === '30D') {
              return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
            } else if (timeframe === '1Y') {
              return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
            } else {
              return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
            }
          });
          
          console.log(`📈 Datos históricos reales procesados: ${data.length} puntos`);
          return { data, labels };
        }
      }
      
      // Si no hay datos históricos, intentar obtener datos de CoinGecko como fallback
      console.log('🔄 No hay datos históricos en DexScreener, intentando CoinGecko...');
      return await fetchCoinGeckoHistoricalData(tokenContract, timeframe);
    }
    
    throw new Error('No se encontraron pares en DexScreener');
  } catch (error) {
    console.warn('❌ Error obteniendo datos históricos reales:', error);
    throw error;
  }
}

// Función para obtener datos históricos de CoinGecko como fallback
async function fetchCoinGeckoHistoricalData(tokenContract: string, timeframe: string): Promise<{ data: number[]; labels: string[] }> {
  try {
    console.log(`🔍 Intentando obtener datos históricos de CoinGecko para ${tokenContract}...`);
    
    // Mapear contratos a IDs de CoinGecko si es necesario
    const coinGeckoId = getCoinGeckoId(tokenContract);
    
    if (!coinGeckoId) {
      throw new Error('Token no soportado en CoinGecko');
    }
    
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinGeckoId}/market_chart?vs_currency=usd&days=${getCoinGeckoDays(timeframe)}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LATAMCOINS/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.prices && data.prices.length > 0) {
      const prices = data.prices.map((p: [number, number]) => p[1]);
      const labels = data.prices.map((p: [number, number]) => {
        const date = new Date(p[0]);
        if (timeframe === '1H') {
          return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        } else if (timeframe === '24H') {
          return date.toLocaleTimeString('es-ES', { hour: '2-digit' });
        } else if (timeframe === '7D') {
          return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
        } else if (timeframe === '30D') {
          return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        } else if (timeframe === '1Y') {
          return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
        } else {
          return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
        }
      });
      
      console.log(`📈 Datos históricos de CoinGecko obtenidos: ${prices.length} puntos`);
      return { data: prices, labels };
    }
    
    throw new Error('No hay datos históricos en CoinGecko');
  } catch (error) {
    console.warn('❌ Error obteniendo datos de CoinGecko:', error);
    throw error;
  }
}

// Función para mapear contratos a IDs de CoinGecko
function getCoinGeckoId(contract: string): string | null {
  const contractMap: { [key: string]: string } = {
    'b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt': 'holder-doggy', // DOGGY
    '6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df': 'mad-coin', // MAD
    '3wmgnvepzkptlxldyej4epzib2xsvbq8twbpicgzkfxr': 'quira', // QRA
    'cb4plxp969uyqrzlk8zwpbbxmhqybhwgzofzjozfghy': 'humo', // HUMO
    '3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru': 'darrkito' // Darrkito
  };
  
  return contractMap[contract] || null;
}

// Función para obtener días de CoinGecko según timeframe
function getCoinGeckoDays(timeframe: string): string {
  switch (timeframe) {
    case '1H': return '1';
    case '24H': return '1';
    case '7D': return '7';
    case '30D': return '30';
    case '1Y': return '365';
    default: return '7';
  }
}

/**
 * Gráfico de precio SOLO con datos reales de APIs
 * NO genera datos simulados - solo muestra datos reales o mensaje de error
 */
export function RealTimePriceChart({ token, timeframe = '7D' }: RealTimePriceChartProps) {
  const [chartData, setChartData] = useState<{ data: number[]; labels: string[] }>({ data: [], labels: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasRealData, setHasRealData] = useState(false);
  
  // Usar el hook de moneda
  const { formatPrice } = useCurrency();

  // Obtener datos reales del token
  useEffect(() => {
    const fetchRealChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        setHasRealData(false);

        // Obtener datos del token desde nuestra API
        const response = await fetch('/api/tokens');
        const result = await response.json();

        if (result.success && result.data) {
                 const tokenData = result.data.find((t: { symbol: string; id: string }) =>
                   t.symbol === token.symbol || t.id === token.id
                 );

          if (tokenData) {
            // SOLO usar datos reales - NO generar datos simulados
            if (tokenData.sparkline && tokenData.sparkline.length > 0) {
              const data = tokenData.sparkline;
              const labels = data.map((_: number, index: number) => {
                const date = new Date(Date.now() - (data.length - index - 1) * 24 * 60 * 60 * 1000);
                if (timeframe === '1H') {
                  return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                } else if (timeframe === '24H') {
                  return date.toLocaleTimeString('es-ES', { hour: '2-digit' });
                } else if (timeframe === '7D') {
                  return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
                } else if (timeframe === '30D') {
                  return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                } else {
                  return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
                }
              });
              setChartData({ data, labels });
              setHasRealData(true);
            } else {
              // Intentar obtener datos históricos desde DexScreener directamente
              try {
                console.log(`🔍 Buscando datos reales para ${token.symbol} en DexScreener...`);
                const dexScreenerResponse = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${token.contract}`);
                const dexScreenerData = await dexScreenerResponse.json();
                
                console.log('📊 Respuesta DexScreener:', dexScreenerData);
                
                if (dexScreenerData.pairs && dexScreenerData.pairs.length > 0) {
                  const pair = dexScreenerData.pairs[0];
                  console.log('📈 Par encontrado:', pair);
                  
                         if (pair.priceHistory && pair.priceHistory.length > 0) {
                           console.log('✅ Datos históricos encontrados:', pair.priceHistory.length, 'puntos');
                           const data = pair.priceHistory.map((p: { price: string }) => parseFloat(p.price));
                           const labels = pair.priceHistory.map((p: { timestamp: number }) => {
                      const date = new Date(p.timestamp);
                      if (timeframe === '1H') {
                        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                      } else if (timeframe === '24H') {
                        return date.toLocaleTimeString('es-ES', { hour: '2-digit' });
                      } else if (timeframe === '7D') {
                        return date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });
                      } else if (timeframe === '30D') {
                        return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
                      } else {
                        return date.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' });
                      }
                    });
                    setChartData({ data, labels });
                    setHasRealData(true);
                  } else {
                    console.log('❌ No hay priceHistory en el par');
                    // Intentar obtener datos históricos reales de CoinGecko
                    console.log('📊 Intentando obtener datos históricos reales de CoinGecko...');
                    try {
                      const historicalData = await fetchCoinGeckoHistoricalData(token.contract, timeframe);
                      setChartData(historicalData);
                      setHasRealData(true);
                    } catch (coinGeckoError) {
                      console.warn('❌ Error obteniendo datos de CoinGecko:', coinGeckoError);
                      setError('No hay datos históricos reales disponibles para este token');
                    }
                  }
                } else {
                  console.log('❌ No se encontraron pares en DexScreener');
                  // Intentar obtener datos históricos reales de CoinGecko
                  console.log('📊 Intentando obtener datos históricos reales de CoinGecko...');
                  try {
                    const historicalData = await fetchCoinGeckoHistoricalData(token.contract, timeframe);
                    setChartData(historicalData);
                    setHasRealData(true);
                  } catch (coinGeckoError) {
                    console.warn('❌ Error obteniendo datos de CoinGecko:', coinGeckoError);
                    setError('No hay datos históricos reales disponibles para este token');
                  }
                }
              } catch (dexError) {
                console.warn('❌ Error fetching DexScreener data:', dexError);
                // Como último recurso, intentar CoinGecko
                console.log('📊 Intentando CoinGecko como último recurso...');
                try {
                  const historicalData = await fetchCoinGeckoHistoricalData(token.contract, timeframe);
                  setChartData(historicalData);
                  setHasRealData(true);
                } catch (coinGeckoError) {
                  console.warn('❌ Error obteniendo datos de CoinGecko:', coinGeckoError);
                  setError('No hay datos históricos reales disponibles para este token');
                }
              }
            }
          } else {
            console.log('❌ Token no encontrado en nuestra API, intentando obtener datos históricos reales...');
            // Intentar obtener datos históricos reales
            try {
              const historicalData = await fetchRealHistoricalData(token.contract, timeframe);
              setChartData(historicalData);
              setHasRealData(true);
            } catch (historicalError) {
              console.warn('❌ Error obteniendo datos históricos reales:', historicalError);
              setError('No hay datos históricos reales disponibles para este token');
            }
          }
        } else {
          console.log('❌ Error en nuestra API, intentando obtener datos históricos reales...');
          // Intentar obtener datos históricos reales
          try {
            const historicalData = await fetchRealHistoricalData(token.contract, timeframe);
            setChartData(historicalData);
            setHasRealData(true);
          } catch (historicalError) {
            console.warn('❌ Error obteniendo datos históricos reales:', historicalError);
            setError('No hay datos históricos reales disponibles para este token');
          }
        }
      } catch (err) {
        console.error('Error fetching chart data:', err);
        // Como último recurso absoluto, intentar obtener datos históricos reales
        console.log('📊 Último recurso: intentando obtener datos históricos reales...');
        try {
          const historicalData = await fetchRealHistoricalData(token.contract, timeframe);
          setChartData(historicalData);
          setHasRealData(true);
        } catch (finalError) {
          console.warn('❌ Error final obteniendo datos históricos reales:', finalError);
          setError('No hay datos históricos reales disponibles para este token');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRealChartData();
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
            return formatPrice(numValue);
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

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00ff41] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Cargando datos reales del gráfico...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <p className="text-white/60 mb-2">{error}</p>
          <p className="text-xs text-white/40">
            Solo se muestran datos reales de las APIs - No se generan datos simulados
          </p>
        </div>
      </div>
    );
  }

  if (chartData.data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📈</div>
          <div className="text-white/60 mb-2">No hay datos históricos reales</div>
          <p className="text-xs text-white/40">
            Este token no tiene datos históricos disponibles en las APIs
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      {/* Indicador de datos reales */}
      {hasRealData && (
        <div className="absolute top-2 right-2 z-10 bg-[#00ff41]/20 backdrop-blur-sm border border-[#00ff41]/30 rounded-lg px-2 py-1">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse"></div>
            <span className="text-xs text-[#00ff41] font-medium">Datos Reales</span>
          </div>
        </div>
      )}
      
      <Line data={data} options={options} />
    </div>
  );
}
