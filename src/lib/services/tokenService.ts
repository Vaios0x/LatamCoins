/**
 * Servicio principal de tokens para LATAMCOINS
 * Combina datos de múltiples APIs para obtener información completa
 */

import { getTokenData } from '@/lib/api/solana';
import { getCMCTokenData, getCMCGlobalMetrics } from '@/lib/api/coinmarketcap';
// import { getPumpFunTokenData, getMultiplePumpFunTokens } from '@/lib/api/pumpfun';
import { Token } from '@/lib/constants/tokens';

// Tipos para datos combinados
export interface RealTokenData extends Omit<Token, 'sparkline'> {
  sparkline?: number[];
  lastUpdated: string;
  source: 'jupiter' | 'cmc' | 'pumpfun' | 'combined';
  isRealTime: boolean;
}

export interface TokenServiceConfig {
  useJupiter: boolean;
  useCMC: boolean;
  usePumpFun: boolean;
  fallbackToMock: boolean;
  cacheTimeout: number; // en milisegundos
}

// Configuración por defecto
const DEFAULT_CONFIG: TokenServiceConfig = {
  useJupiter: true,
  useCMC: true,
  usePumpFun: true,
  fallbackToMock: true,
  cacheTimeout: 30000, // 30 segundos
};

// Cache simple en memoria
const tokenCache = new Map<string, { data: RealTokenData; timestamp: number }>();

/**
 * Obtiene datos reales de un token
 */
export async function getRealTokenData(
  tokenAddress: string,
  config: Partial<TokenServiceConfig> = {}
): Promise<RealTokenData | null> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Verificar cache
  const cached = tokenCache.get(tokenAddress);
  if (cached && Date.now() - cached.timestamp < finalConfig.cacheTimeout) {
    return cached.data;
  }

  try {
    let tokenData: RealTokenData | null = null;
    const apiErrors: string[] = [];

    // Intentar obtener datos de múltiples fuentes
    if (finalConfig.useJupiter) {
      try {
        const jupiterData = await getTokenData(tokenAddress);
        if (jupiterData) {
          tokenData = {
            id: tokenAddress,
            symbol: jupiterData.symbol,
            name: jupiterData.name,
            price: jupiterData.price || 0,
            change24h: 0, // Jupiter no proporciona cambio 24h
            volume24h: 0,
            marketCap: jupiterData.marketCap || 0,
            platform: 'Solana',
            chain: 'Solana',
            contract: tokenAddress,
            logo: jupiterData.logoURI || '/tokens/default.svg',
            ath: 0,
            atl: 0,
            supply: 0,
            rank: 0,
            lastUpdated: new Date().toISOString(),
            source: 'jupiter',
            isRealTime: true,
          };
        }
      } catch (error) {
        apiErrors.push('Jupiter API failed');
        console.warn('Jupiter API failed:', error);
      }
    }

    // Si no hay datos de Jupiter, intentar CoinMarketCap
    if (!tokenData && finalConfig.useCMC) {
      try {
        const cmcData = await getCMCTokenData([tokenAddress]);
        if (cmcData.length > 0) {
          const token = cmcData[0];
          tokenData = {
            id: tokenAddress,
            symbol: token.symbol,
            name: token.name,
            price: token.quote.USD.price,
            change24h: token.quote.USD.percent_change_24h,
            volume24h: token.quote.USD.volume_24h,
            marketCap: token.quote.USD.market_cap,
            platform: 'CoinMarketCap',
            chain: 'Solana',
            contract: tokenAddress,
            logo: '/tokens/default.svg',
            ath: 0,
            atl: 0,
            supply: 0,
            rank: token.id,
            lastUpdated: new Date().toISOString(),
            source: 'cmc',
            isRealTime: true,
          };
        }
      } catch (error) {
        apiErrors.push('CoinMarketCap API failed');
        console.warn('CoinMarketCap API failed:', error);
      }
    }

    // Si no hay datos reales y se permite fallback, usar datos mock
    if (!tokenData && finalConfig.fallbackToMock) {
      console.warn(`Using mock data for token: ${tokenAddress}. API errors: ${apiErrors.join(', ')}`);
      tokenData = {
        id: tokenAddress,
        symbol: 'MOCK',
        name: 'Mock Token',
        price: Math.random() * 0.001,
        change24h: (Math.random() - 0.5) * 100,
        volume24h: Math.random() * 100000,
        marketCap: Math.random() * 1000000,
        platform: 'Mock',
        chain: 'Solana',
        contract: tokenAddress,
        logo: '/tokens/default.svg',
        ath: 0,
        atl: 0,
        supply: 0,
        rank: 0,
        lastUpdated: new Date().toISOString(),
        source: 'jupiter',
        isRealTime: false,
      };
    }

    // Guardar en cache
    if (tokenData) {
      tokenCache.set(tokenAddress, {
        data: tokenData,
        timestamp: Date.now(),
      });
    }

    return tokenData;
  } catch (error) {
    console.error('Error fetching real token data:', error);
    return null;
  }
}

/**
 * Obtiene datos de múltiples tokens
 */
export async function getMultipleRealTokens(
  tokenAddresses: string[],
  config: Partial<TokenServiceConfig> = {}
): Promise<RealTokenData[]> {
  try {
    const promises = tokenAddresses.map(address => getRealTokenData(address, config));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<RealTokenData> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  } catch (error) {
    console.error('Error fetching multiple real tokens:', error);
    return [];
  }
}

/**
 * Obtiene métricas globales reales
 */
export async function getRealGlobalMetrics(): Promise<{ totalMarketCap: number; totalVolume24h: number; btcDominance: number; ethDominance: number } | null> {
  try {
    const cmcMetrics = await getCMCGlobalMetrics();
    if (cmcMetrics) {
      return {
        totalMarketCap: cmcMetrics.quote.USD.total_market_cap,
        totalVolume24h: cmcMetrics.quote.USD.total_volume_24h,
        activeCryptocurrencies: cmcMetrics.active_cryptocurrencies,
        lastUpdated: new Date().toISOString(),
        source: 'cmc',
      };
    }
  } catch (error) {
    console.error('Error fetching real global metrics:', error);
  }

  // Fallback a datos mock
  return {
    totalMarketCap: 2500000000000, // $2.5T
    totalVolume24h: 100000000000, // $100B
    activeCryptocurrencies: 10000,
    lastUpdated: new Date().toISOString(),
    source: 'mock',
  };
}

/**
 * Limpia el cache de tokens
 */
export function clearTokenCache(): void {
  tokenCache.clear();
}

/**
 * Obtiene estadísticas del cache
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: tokenCache.size,
    keys: Array.from(tokenCache.keys()),
  };
}
