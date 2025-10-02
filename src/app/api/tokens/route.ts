import { NextResponse } from 'next/server';

// Tokens LATAM específicos - Solo estos tokens con datos reales
const LATAM_TOKENS = [
  {
    id: 'holder-doggy',
    symbol: 'DOGGY',
    name: 'HOLDER',
    contract: 'b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt',
    dexScreenerUrl: 'https://dexscreener.com/solana/b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt',
    pumpUrl: 'https://pump.fun/coin/BS7HxRitaY5ipGfbek1nmatWLbaS9yoWRSEQzCb3pump',
    jupiterUrl: 'https://jup.ag/tokens/BS7HxRitaY5ipGfbek1nmatWLbaS9yoWRSEQzCb3pump',
    // Símbolos alternativos para CoinMarketCap
    cmcSymbols: ['DOGGY', 'HOLDER']
  },
  {
    id: 'mad-coin',
    symbol: 'MAD',
    name: 'MAD COIN',
    contract: '6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df',
    dexScreenerUrl: 'https://dexscreener.com/solana/6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df',
    pumpUrl: 'https://pump.fun/coin/CZbkRyauV5b9Q4xNwKGUtEBEggzqWpC6KMVp2oRppump',
    jupiterUrl: 'https://jup.ag/tokens/CZbkRyauV5b9Q4xNwKGUtEBEggzqWpC6KMVp2oRppump',
    cmcSymbols: ['MAD', 'MADCOIN']
  },
  {
    id: 'quira',
    symbol: 'QRA',
    name: 'Quira',
    contract: '3wmgnvepzkptlxldyej4epzib2xsvbq8twbpicgzkfxr',
    dexScreenerUrl: 'https://dexscreener.com/solana/3wmgnvepzkptlxldyej4epzib2xsvbq8twbpicgzkfxr',
    pumpUrl: 'https://pump.fun/coin/DsMWZg6mkheTV2XTkbUtWcsXaajTzEkk1TC7o6Fmpump',
    jupiterUrl: 'https://jup.ag/tokens/DsMWZg6mkheTV2XTkbUtWcsXaajTzEkk1TC7o6Fmpump',
    cmcSymbols: ['QRA', 'QUIRA']
  },
  {
    id: 'humo',
    symbol: 'HUMO',
    name: 'HUMO',
    contract: 'cb4plxp969uyqrzlk8zwpbbxmhqybhwgzofzjozfghy',
    dexScreenerUrl: 'https://dexscreener.com/solana/cb4plxp969uyqrzlk8zwpbbxmhqybhwgzofzjozfghy',
    pumpUrl: 'https://pump.fun/coin/9RLoB3YZwk9sK78ZhmiSAj8CtPhssuJR1pVR326Vpump',
    jupiterUrl: 'https://jup.ag/tokens/9RLoB3YZwk9sK78ZhmiSAj8CtPhssuJR1pVR326Vpump',
    cmcSymbols: ['HUMO']
  },
  {
    id: 'darrkito',
    symbol: 'Darrkito',
    name: 'Darrkito Strategic Reserve',
    contract: '3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru',
    dexScreenerUrl: 'https://dexscreener.com/solana/3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru',
    pumpUrl: 'https://pump.fun/coin/9Uxjbn2TyfEmjaYs1qXiLt3FbE3VDa5UMkvQGZwQpump',
    jupiterUrl: 'https://jup.ag/tokens/9Uxjbn2TyfEmjaYs1qXiLt3FbE3VDa5UMkvQGZwQpump',
    cmcSymbols: ['DARRKITO', 'DARRKITO']
  }
];

// Función para obtener datos de CoinMarketCap
async function fetchCoinMarketCapData(symbol: string) {
  try {
    // Usar la API key proporcionada directamente
    const apiKey = '191d98e9-46f6-4d78-a2aa-5c5d5382724b';
    
    const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn(`CoinMarketCap API error: ${response.status} for ${symbol}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.warn(`Error fetching CoinMarketCap data for ${symbol}:`, error);
    return null;
  }
}

// Función para obtener datos de DexScreener
async function fetchDexScreenerData(pairAddress: string) {
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/solana/${pairAddress}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LATAMCOINS/1.0'
      }
    });

    if (!response.ok) {
      console.warn(`DexScreener API error: ${response.status} for ${pairAddress}`);
      return null;
    }

    const data = await response.json();
    return data.pairs && data.pairs.length > 0 ? data.pairs[0] : null;
  } catch (error) {
    console.warn(`Error fetching DexScreener data for ${pairAddress}:`, error);
    return null;
  }
}


// Función para obtener datos de CoinGecko como fallback
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function fetchCoinGeckoData(coinIds: string[]) {
  try {
    const ids = coinIds.join(',');
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h%2C24h%2C7d`;
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LATAMCOINS/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching CoinGecko data:', error);
    return { success: false, data: [] };
  }
}

export async function GET() {
  try {
    console.log('🚀 Starting REAL token data fetch from multiple APIs...');
    
    const tokensWithRealData = [];
    let realTimeCount = 0;
    let simulatedCount = 0;
    
    // Obtener datos reales para cada token usando múltiples APIs
    for (const token of LATAM_TOKENS) {
      try {
        console.log(`Processing token: ${token.symbol} (${token.contract})`);
        let tokenData = null;
        let dataSource = 'simulated';
        let isRealTime = false;

        // 1. Intentar DexScreener primero (más confiable para tokens de Solana)
        console.log(`Trying DexScreener for ${token.symbol}`);
        // Usar las direcciones correctas de DexScreener
        const dexScreenerContract = token.contract;
        const dexScreenerData = await fetchDexScreenerData(dexScreenerContract);
        
        if (dexScreenerData) {
          tokenData = {
            ...token,
            price: parseFloat(dexScreenerData.priceUsd) || 0,
            change24h: parseFloat(dexScreenerData.priceChange?.h24) || 0,
            volume24h: parseFloat(dexScreenerData.volume?.h24) || 0,
            marketCap: parseFloat(dexScreenerData.marketCap) || 0,
            liquidity: parseFloat(dexScreenerData.liquidity?.usd) || 0,
            fdv: parseFloat(dexScreenerData.fdv) || 0,
            rank: tokensWithRealData.length + 1,
            lastUpdated: new Date().toISOString(),
            source: 'dexscreener',
            isRealTime: true,
            dexScreenerUrl: token.dexScreenerUrl,
            pumpUrl: token.pumpUrl,
            priceChange: {
              m5: parseFloat(dexScreenerData.priceChange?.m5) || 0,
              h1: parseFloat(dexScreenerData.priceChange?.h1) || 0,
              h6: parseFloat(dexScreenerData.priceChange?.h6) || 0,
              h24: parseFloat(dexScreenerData.priceChange?.h24) || 0
            }
          };
          dataSource = 'dexscreener';
          isRealTime = true;
          realTimeCount++;
          console.log(`✅ Got real data from DexScreener for ${token.symbol}`);
        }

        // 2. Si no hay datos de DexScreener, intentar CoinMarketCap
        if (!tokenData && token.cmcSymbols) {
          console.log(`Trying CoinMarketCap for ${token.symbol} with symbols: ${token.cmcSymbols.join(', ')}`);
          
          for (const symbol of token.cmcSymbols) {
            const cmcData = await fetchCoinMarketCapData(symbol);
            
            if (cmcData && cmcData.data && cmcData.data[symbol]) {
              const quote = cmcData.data[symbol].quote.USD;
              tokenData = {
                ...token,
                price: quote.price,
                change24h: quote.percent_change_24h || 0,
                volume24h: quote.volume_24h || 0,
                marketCap: quote.market_cap || 0,
                liquidity: 0,
                fdv: quote.market_cap || 0,
                rank: tokensWithRealData.length + 1,
                lastUpdated: new Date().toISOString(),
                source: 'coinmarketcap',
                isRealTime: true,
                dexScreenerUrl: token.dexScreenerUrl,
                pumpUrl: token.pumpUrl,
                priceChange: {
                  m5: 0,
                  h1: 0,
                  h6: 0,
                  h24: quote.percent_change_24h || 0
                }
              };
              dataSource = 'coinmarketcap';
              isRealTime = true;
              realTimeCount++;
              console.log(`✅ Got real data from CoinMarketCap for ${token.symbol} using symbol ${symbol}`);
              break; // Salir del loop si encontramos datos
            }
          }
        }

        // 3. Si aún no hay datos reales, usar datos simulados realistas
        if (!tokenData) {
          console.log(`Using simulated data for ${token.symbol}`);
          const basePrice: number = 0.000001 + (tokensWithRealData.length * 0.0000005);
          const volatility: number = 0.1 + (tokensWithRealData.length * 0.05);
          const currentPrice: number = basePrice * (1 + (Math.random() - 0.5) * volatility);
          
          // Crear algunos ganadores para mostrar en el filtro
          const isGainer: boolean = tokensWithRealData.length % 3 === 0; // Cada 3er token es ganador
          const change24h: number = isGainer ? 
            Math.random() * 30 + 5 : // Ganadores: +5% a +35%
            -(Math.random() * 25 + 5); // Perdedores: -5% a -30%
          
          tokenData = {
            ...token,
            price: currentPrice,
            change24h: change24h,
            volume24h: Math.random() * 100000 + 10000,
            marketCap: currentPrice * (1000000000 - tokensWithRealData.length * 100000000),
            liquidity: Math.random() * 50000 + 10000,
            fdv: currentPrice * 1000000000,
            rank: tokensWithRealData.length + 1,
            lastUpdated: new Date().toISOString(),
            source: 'simulated',
            isRealTime: false,
            dexScreenerUrl: token.dexScreenerUrl,
            pumpUrl: token.pumpUrl,
            priceChange: {
              m5: (Math.random() - 0.5) * 10,
              h1: (Math.random() - 0.5) * 20,
              h6: (Math.random() - 0.5) * 30,
              h24: change24h
            }
          };
          dataSource = 'simulated';
          isRealTime = false;
          simulatedCount++;
        }

        tokensWithRealData.push(tokenData);
        console.log(`Added ${token.symbol} with source: ${dataSource}, realTime: ${isRealTime}`);

      } catch (error) {
        console.warn(`Error processing token ${token.symbol}:`, error);
        // Continuar con el siguiente token
      }
    }

    // Ordenar por market cap
    tokensWithRealData.sort((a, b) => b.marketCap - a.marketCap);

    console.log(`Final results: ${realTimeCount} real-time tokens, ${simulatedCount} simulated tokens`);

    return NextResponse.json({
      success: true,
      data: tokensWithRealData,
      timestamp: new Date().toISOString(),
      source: realTimeCount > 0 ? 'mixed' : 'simulated',
      totalTokens: tokensWithRealData.length,
      totalMarketCap: tokensWithRealData.reduce((sum, token) => sum + token.marketCap, 0),
      totalVolume: tokensWithRealData.reduce((sum, token) => sum + token.volume24h, 0),
      realTimeTokens: realTimeCount,
      simulatedTokens: simulatedCount
    });

  } catch (error) {
    console.error('❌ Error fetching token data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch token data',
        message: 'Error al obtener datos de los tokens'
      },
      { status: 500 }
    );
  }
}
