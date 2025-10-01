'use client';

import { useState, useEffect, useCallback } from 'react';
import { LATAM_TOKENS, Token } from '@/lib/constants/tokens';
import { getMultipleRealTokens, RealTokenData } from '@/lib/services/tokenService';

/**
 * Hook para manejar precios en tiempo real
 * Combina datos reales con fallback a mock
 */
export function usePrices() {
  const [tokens, setTokens] = useState<Token[]>(LATAM_TOKENS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [useRealData, setUseRealData] = useState(true);
  const [dataSource, setDataSource] = useState<'real' | 'mock'>('mock');
  const [apiErrors, setApiErrors] = useState<string[]>([]);
  const [showApiNotification, setShowApiNotification] = useState(false);

  // Direcciones de contratos de los tokens LATAM
  const tokenAddresses = LATAM_TOKENS.map(token => token.contract);

  // Función para cargar datos reales
  const loadRealData = useCallback(async () => {
    if (!useRealData) return;

    setIsLoading(true);
    setApiErrors([]);
    
    try {
      // Obtener datos reales de múltiples tokens
      const realTokens = await getMultipleRealTokens(tokenAddresses);
      
      if (realTokens.length > 0) {
        // Convertir datos reales al formato de Token
        const convertedTokens: Token[] = realTokens.map((realToken: RealTokenData) => ({
          id: realToken.id,
          symbol: realToken.symbol,
          name: realToken.name,
          price: realToken.price,
          change24h: realToken.change24h,
          volume24h: realToken.volume24h,
          marketCap: realToken.marketCap,
          platform: realToken.platform,
          chain: realToken.chain,
          contract: realToken.contract,
          logo: realToken.logo,
          ath: realToken.ath,
          atl: realToken.atl,
          supply: realToken.supply,
          rank: realToken.rank,
          sparkline: realToken.sparkline,
        }));

        setTokens(convertedTokens);
        setDataSource('real');
        setLastUpdate(new Date());
        
        // Si algunos tokens fallaron, mostrar notificación
        if (realTokens.length < tokenAddresses.length) {
          setApiErrors(['Algunos tokens no pudieron cargarse desde las APIs']);
          setShowApiNotification(true);
        }
      } else {
        // Si no se obtuvieron datos reales, usar mock
        setDataSource('mock');
        setApiErrors(['No se pudieron obtener datos reales, usando datos simulados']);
        setShowApiNotification(true);
      }
    } catch (error) {
      console.error('Error loading real data:', error);
      setDataSource('mock');
      setApiErrors(['Error al cargar datos reales, usando datos simulados']);
      setShowApiNotification(true);
    } finally {
      setIsLoading(false);
    }
  }, [useRealData, tokenAddresses]);

  // Cargar datos reales al montar el componente
  useEffect(() => {
    loadRealData();
  }, [loadRealData]); // Incluir loadRealData en dependencias

  // Actualizar datos cada 30 segundos si se usan datos reales
  useEffect(() => {
    if (!useRealData) return;

    const interval = setInterval(() => {
      loadRealData();
    }, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, [useRealData, loadRealData]); // Incluir loadRealData en dependencias

  // Función para actualizar precios manualmente
  const refreshPrices = async () => {
    setIsLoading(true);
    
    try {
      if (useRealData) {
        await loadRealData();
      } else {
        // Simular datos mock
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setTokens(prevTokens => 
          prevTokens.map(token => {
            const changePercent = (Math.random() - 0.5) * 0.1;
            const newPrice = token.price * (1 + changePercent);
            const newChange24h = (Math.random() - 0.5) * 20;
            const volumeChange = (Math.random() - 0.5) * 0.2;
            const newVolume = token.volume24h * (1 + volumeChange);
            const newMarketCap = newPrice * token.supply;

            return {
              ...token,
              price: Math.max(newPrice, token.atl),
              change24h: newChange24h,
              volume24h: Math.max(newVolume, 0),
              marketCap: newMarketCap,
            };
          })
        );
        
        setDataSource('mock');
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error refreshing prices:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para alternar entre datos reales y mock
  const toggleDataSource = () => {
    setUseRealData(!useRealData);
  };

  // Función para obtener token por símbolo
  const getTokenBySymbol = (symbol: string): Token | undefined => {
    return tokens.find(token => token.symbol.toLowerCase() === symbol.toLowerCase());
  };

  // Función para obtener token por ID
  const getTokenById = (id: string): Token | undefined => {
    return tokens.find(token => token.id === id);
  };

  // Calcular estadísticas globales
  const globalStats = {
    totalMarketCap: tokens.reduce((sum, token) => sum + token.marketCap, 0),
    totalVolume24h: tokens.reduce((sum, token) => sum + token.volume24h, 0),
    tokensTracked: tokens.length,
    averageChange24h: tokens.reduce((sum, token) => sum + token.change24h, 0) / tokens.length,
  };

  return {
    tokens,
    isLoading,
    lastUpdate,
    refreshPrices,
    getTokenBySymbol,
    getTokenById,
    globalStats,
    useRealData,
    dataSource,
    toggleDataSource,
    apiErrors,
    showApiNotification,
    setShowApiNotification,
  };
}
