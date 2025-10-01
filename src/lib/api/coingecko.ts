/**
 * CoinGecko API integration for real-time cryptocurrency data
 * Free tier: 10-50 calls/minute
 */

export interface CoinGeckoToken {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_1h: number;
  sparkline_in_7d: {
    price: number[];
  };
  image: string;
  last_updated: string;
}

export interface CoinGeckoResponse {
  data: CoinGeckoToken[];
  success: boolean;
  timestamp: string;
}

/**
 * Fetch real-time data from CoinGecko API
 */
export async function fetchCoinGeckoData(coinIds: string[]): Promise<CoinGeckoResponse> {
  try {
    const ids = coinIds.join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LATAMCOINS/1.0'
      },
      // Cache for 30 seconds to avoid rate limits
      next: { revalidate: 30 }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      data: data.map((coin: { id: string; symbol: string; name: string; current_price: number; market_cap: number; total_volume: number; price_change_percentage_24h: number; sparkline_in_7d: { price: number[] } }) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price || 0,
        market_cap: coin.market_cap || 0,
        total_volume: coin.total_volume || 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        price_change_percentage_7d: coin.price_change_percentage_7d || 0,
        price_change_percentage_1h: coin.price_change_percentage_1h || 0,
        sparkline_in_7d: {
          price: coin.sparkline_in_7d?.price || []
        },
        image: coin.image || '',
        last_updated: coin.last_updated || new Date().toISOString()
      })),
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    return {
      data: [],
      success: false,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Get Solana tokens data from CoinGecko
 */
export async function fetchSolanaTokens(): Promise<CoinGeckoResponse> {
  try {
    const url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=solana-ecosystem&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d';
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LATAMCOINS/1.0'
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      data: data.map((coin: { id: string; symbol: string; name: string; current_price: number; market_cap: number; total_volume: number; price_change_percentage_24h: number; sparkline_in_7d: { price: number[] } }) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price || 0,
        market_cap: coin.market_cap || 0,
        total_volume: coin.total_volume || 0,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        price_change_percentage_7d: coin.price_change_percentage_7d || 0,
        price_change_percentage_1h: coin.price_change_percentage_1h || 0,
        sparkline_in_7d: {
          price: coin.sparkline_in_7d?.price || []
        },
        image: coin.image || '',
        last_updated: coin.last_updated || new Date().toISOString()
      })),
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching Solana tokens:', error);
    return {
      data: [],
      success: false,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Search for specific tokens by name or symbol
 */
export async function searchTokens(query: string): Promise<CoinGeckoResponse> {
  try {
    const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LATAMCOINS/1.0'
      },
      next: { revalidate: 300 }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko search error: ${response.status}`);
    }

    const data = await response.json();
    
    // Get detailed data for found coins
    if (data.coins && data.coins.length > 0) {
      const coinIds = data.coins.slice(0, 10).map((coin: { id: string }) => coin.id);
      return await fetchCoinGeckoData(coinIds);
    }
    
    return {
      data: [],
      success: true,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error searching tokens:', error);
    return {
      data: [],
      success: false,
      timestamp: new Date().toISOString()
    };
  }
}
