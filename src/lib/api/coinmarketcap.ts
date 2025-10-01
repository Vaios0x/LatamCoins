/**
 * API de CoinMarketCap para LATAMCOINS
 * Integración con CoinMarketCap API para datos de mercado
 */

// Configuración de CoinMarketCap
const CMC_API_URL = 'https://pro-api.coinmarketcap.com/v1';
const CMC_API_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY;

// Tipos para datos de CoinMarketCap
export interface CMCQuote {
  price: number;
  volume_24h: number;
  market_cap: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d: number;
  last_updated: string;
}

export interface CMCData {
  id: number;
  name: string;
  symbol: string;
  slug: string;
  quote: {
    USD: CMCQuote;
  };
}

export interface CMCResponse {
  data: CMCData[];
  status: {
    timestamp: string;
    error_code: number;
    error_message: string;
  };
}

/**
 * Obtiene datos de tokens desde CoinMarketCap
 */
export async function getCMCTokenData(symbols: string[]): Promise<CMCData[]> {
  if (!CMC_API_KEY) {
    console.warn('CoinMarketCap API key not found');
    return [];
  }

  try {
    const response = await fetch(
      `${CMC_API_URL}/cryptocurrency/quotes/latest?symbol=${symbols.join(',')}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data: CMCResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching CoinMarketCap data:', error);
    return [];
  }
}

/**
 * Obtiene datos de un token específico
 */
export async function getCMCToken(symbol: string): Promise<CMCData | null> {
  const data = await getCMCTokenData([symbol]);
  return data[0] || null;
}

/**
 * Obtiene datos de mercado global
 */
export async function getCMCGlobalMetrics(): Promise<{ quote: { USD: { total_market_cap: number; total_volume_24h: number; btc_dominance: number; eth_dominance: number } } } | null> {
  if (!CMC_API_KEY) {
    console.warn('CoinMarketCap API key not found');
    return null;
  }

  try {
    const response = await fetch(
      `${CMC_API_URL}/global-metrics/quotes/latest`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching global metrics:', error);
    return null;
  }
}

/**
 * Busca tokens por nombre o símbolo
 */
export async function searchCMCTokens(query: string): Promise<CMCData[]> {
  if (!CMC_API_KEY) {
    console.warn('CoinMarketCap API key not found');
    return [];
  }

  try {
    const response = await fetch(
      `${CMC_API_URL}/cryptocurrency/quotes/latest?symbol=${query}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': CMC_API_KEY,
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinMarketCap API error: ${response.status}`);
    }

    const data: CMCResponse = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error searching tokens:', error);
    return [];
  }
}
