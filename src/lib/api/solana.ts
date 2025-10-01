/**
 * API de Solana para LATAMCOINS
 * Integración con RPC de Solana y APIs de precios
 */

// Configuración de endpoints
// const SOLANA_RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const JUPITER_API_URL = 'https://price.jup.ag/v4/price';
const SOLSCAN_API_URL = 'https://public-api.solscan.io';

// Tipos para datos de Solana
export interface SolanaTokenData {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
  price?: number;
  marketCap?: number;
  volume24h?: number;
  change24h?: number;
}

export interface JupiterPriceData {
  id: string;
  mintSymbol: string;
  vsToken: string;
  vsTokenSymbol: string;
  price: number;
}

/**
 * Obtiene datos de tokens desde Jupiter API
 */
export async function getJupiterPrices(tokenAddresses: string[]): Promise<JupiterPriceData[]> {
  try {
    const response = await fetch(`${JUPITER_API_URL}?ids=${tokenAddresses.join(',')}`);
    
    if (!response.ok) {
      throw new Error(`Jupiter API error: ${response.status}`);
    }
    
    const data = await response.json();
    return Object.values(data.data || {});
  } catch (error) {
    console.error('Error fetching Jupiter prices:', error);
    return [];
  }
}

/**
 * Obtiene información de token desde Solscan
 */
export async function getTokenInfo(address: string): Promise<SolanaTokenData | null> {
  try {
    const response = await fetch(`${SOLSCAN_API_URL}/token/meta?tokenAddress=${address}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Token not found on Solscan: ${address}`);
        return null;
      }
      throw new Error(`Solscan API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      address: data.address,
      symbol: data.symbol,
      name: data.name,
      decimals: data.decimals,
      logoURI: data.logoURI,
    };
  } catch (error) {
    console.error('Error fetching token info:', error);
    return null;
  }
}

/**
 * Obtiene datos de mercado desde DexScreener
 */
export async function getDexScreenerData(pairAddress: string): Promise<{ priceUsd: string; priceChange: { h24: string }; volume: { h24: string }; marketCap: string; liquidity: { usd: string }; fdv: string } | null> {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${pairAddress}`);
    
    if (!response.ok) {
      throw new Error(`DexScreener API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.pair;
  } catch (error) {
    console.error('Error fetching DexScreener data:', error);
    return null;
  }
}

/**
 * Obtiene datos completos de un token
 */
export async function getTokenData(address: string): Promise<SolanaTokenData | null> {
  try {
    // Obtener información básica del token
    const tokenInfo = await getTokenInfo(address);
    if (!tokenInfo) return null;

    // Obtener precio desde Jupiter
    const prices = await getJupiterPrices([address]);
    const priceData = prices[0];
    
    if (priceData) {
      tokenInfo.price = priceData.price;
    }

    return tokenInfo;
  } catch (error) {
    console.error('Error fetching complete token data:', error);
    return null;
  }
}

/**
 * Obtiene múltiples tokens en paralelo
 */
export async function getMultipleTokens(addresses: string[]): Promise<SolanaTokenData[]> {
  try {
    const promises = addresses.map(address => getTokenData(address));
    const results = await Promise.allSettled(promises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<SolanaTokenData> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);
  } catch (error) {
    console.error('Error fetching multiple tokens:', error);
    return [];
  }
}
