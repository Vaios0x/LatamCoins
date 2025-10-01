'use client';

import { useState, useEffect, useCallback } from 'react';
import { LATAM_TOKENS, Token } from '@/lib/constants/tokens';
// Importar la API local

/**
 * Hook simplificado para datos reales únicamente
 * Solo usa CoinMarketCap API, sin fallback a mock
 */
export function useRealPrices() {
  const [tokens, setTokens] = useState<Token[]>(LATAM_TOKENS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [hasError, setHasError] = useState(false);

  // Función para cargar datos reales desde nuestra API
  const loadRealData = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    
    try {
      console.log('🔄 Loading real token data...');
      
      // Obtener datos de nuestra API route con timestamp para evitar cache
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const response = await fetch(`/api/tokens?t=${timestamp}&r=${randomId}`, {
        method: 'GET',
        cache: 'no-store', // Siempre obtener datos frescos
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        console.log(`✅ Loaded ${result.data.length} tokens, ${result.realTimeTokens} real-time, ${result.simulatedTokens} simulated`);
        
        // Mapear datos de la API a nuestros tokens
        const updatedTokens = LATAM_TOKENS.map((token) => {
          const apiToken = result.data.find((t: { id: string }) => t.id === token.id);
          
           if (apiToken) {
             console.log(`🔄 Updating ${token.symbol}: ${token.price} -> ${apiToken.price} (${apiToken.source})`);
             return {
               ...token,
               price: apiToken.price || 0,
               change24h: apiToken.change24h || 0,
               volume24h: apiToken.volume24h || 0,
               marketCap: apiToken.marketCap || 0,
               rank: apiToken.rank || 0,
               // Datos adicionales de APIs reales
               liquidity: apiToken.liquidity || 0,
               fdv: apiToken.fdv || 0,
               source: apiToken.source || 'unknown',
               isRealTime: apiToken.isRealTime || false,
               dexScreenerUrl: apiToken.dexScreenerUrl || token.dexScreenerUrl,
               pumpUrl: apiToken.pumpUrl || token.pumpUrl,
               pairAddress: apiToken.pairAddress,
               priceChange: apiToken.priceChange || {
                 m5: 0,
                 h1: 0,
                 h6: 0,
                 h24: 0
               },
               lastUpdated: apiToken.lastUpdated || new Date().toISOString()
             };
           } else {
             console.warn(`⚠️ No API data found for ${token.symbol}`);
             return token; // Mantener datos originales si no hay datos de API
           }
        });

        setTokens(updatedTokens);
        setLastUpdate(new Date());
        console.log('✅ Tokens updated successfully');
      } else {
        console.error('❌ API response not successful:', result);
        setHasError(true);
      }
    } catch (error) {
      console.error('❌ Error loading real data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar datos al montar
  useEffect(() => {
    // Forzar recarga inmediata
    loadRealData();
    
    // También cargar después de un pequeño delay para asegurar que se actualice
    const timeout = setTimeout(() => {
      loadRealData();
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [loadRealData]);

  // Actualizar cada 60 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadRealData();
    }, 60000); // Actualizar cada 60 segundos

    return () => clearInterval(interval);
  }, [loadRealData]);

  // Función para actualizar manualmente
  const refreshPrices = async () => {
    await loadRealData();
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
    hasError,
  };
}
