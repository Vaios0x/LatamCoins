'use client';

import { useState, useEffect } from 'react';
import { LATAM_TOKENS, Token } from '@/lib/constants/tokens';

/**
 * Hook para manejar precios en tiempo real
 * Simula actualizaciones de precios cada 5 segundos
 */
export function usePrices() {
  const [tokens, setTokens] = useState<Token[]>(LATAM_TOKENS);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simular actualizaciones de precios
  useEffect(() => {
    const interval = setInterval(() => {
      setTokens(prevTokens => 
        prevTokens.map(token => {
          // Simular cambio de precio aleatorio (-5% a +5%)
          const changePercent = (Math.random() - 0.5) * 0.1; // -5% a +5%
          const newPrice = token.price * (1 + changePercent);
          
          // Calcular nuevo cambio 24h
          const newChange24h = (Math.random() - 0.5) * 20; // -10% a +10%
          
          // Simular cambio de volumen
          const volumeChange = (Math.random() - 0.5) * 0.2; // -20% a +20%
          const newVolume = token.volume24h * (1 + volumeChange);
          
          // Calcular nuevo market cap
          const newMarketCap = newPrice * token.supply;

          return {
            ...token,
            price: Math.max(newPrice, token.atl), // No menor que ATL
            change24h: newChange24h,
            volume24h: Math.max(newVolume, 0),
            marketCap: newMarketCap,
          };
        })
      );
      setLastUpdate(new Date());
    }, 5000); // Actualizar cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  // Función para actualizar precios manualmente
  const refreshPrices = async () => {
    setIsLoading(true);
    
    // Simular delay de API
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
    
    setLastUpdate(new Date());
    setIsLoading(false);
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
  };
}
