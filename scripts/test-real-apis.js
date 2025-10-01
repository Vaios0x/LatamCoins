/**
 * Script para probar las APIs reales de LATAMCOINS
 * Verifica que todas las APIs estén funcionando correctamente
 */

const fs = require('fs');
const path = require('path');

// Configuración de APIs
const APIS = {
  dexScreener: 'https://api.dexscreener.com/latest',
  jupiter: 'https://api.jup.ag/v4',
  coinMarketCap: 'https://pro-api.coinmarketcap.com/v1'
};

// Tokens de prueba con direcciones correctas de Jupiter
const TEST_TOKENS = [
  {
    id: 'holder-doggy',
    symbol: 'DOGGY',
    contract: 'BS7HxRitaY5ipGfbek1nmatWLbaS9yoWRSEQzCb3pump'
  },
  {
    id: 'mad-coin',
    symbol: 'MAD',
    contract: 'CZbkRyauV5b9Q4xNwKGUtEBEggzqWpC6KMVp2oRppump'
  },
  {
    id: 'quira',
    symbol: 'QRA',
    contract: 'DsMWZg6mkheTV2XTkbUtWcsXaajTzEkk1TC7o6Fmpump'
  },
  {
    id: 'humo',
    symbol: 'HUMO',
    contract: '9RLoB3YZwk9sK78ZhmiSAj8CtPhssuJR1pVR326Vpump'
  },
  {
    id: 'darrkito',
    symbol: 'DARRKITO',
    contract: '9Uxjbn2TyfEmjaYs1qXiLt3FbE3VDa5UMkvQGZwQpump'
  }
];

// Función para probar DexScreener API
async function testDexScreener(tokenContract) {
  try {
    console.log(`🔍 Testing DexScreener for ${tokenContract}...`);
    
    const response = await fetch(`${APIS.dexScreener}/dex/pairs/solana/${tokenContract}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.pairs && data.pairs.length > 0) {
      const pair = data.pairs[0];
      console.log(`✅ DexScreener: Found pair for ${tokenContract}`);
      console.log(`   Price: $${parseFloat(pair.priceUsd).toFixed(8)}`);
      console.log(`   Volume 24h: $${parseFloat(pair.volume?.h24 || 0).toLocaleString()}`);
      console.log(`   Market Cap: $${parseFloat(pair.marketCap || 0).toLocaleString()}`);
      return true;
    } else {
      console.log(`⚠️ DexScreener: No pairs found for ${tokenContract}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ DexScreener error for ${tokenContract}:`, error.message);
    return false;
  }
}

// Función para probar Jupiter API (plan Lite - gratuito)
async function testJupiter(tokenContract) {
  try {
    console.log(`🔍 Testing Jupiter for ${tokenContract}...`);
    
    // Usar Price API V3 (versión actual según documentación oficial)
    const response = await fetch(`https://lite-api.jup.ag/price/v3?ids=${tokenContract}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LATAMCOINS/1.0'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && data.data[tokenContract]) {
      const priceData = data.data[tokenContract];
      console.log(`✅ Jupiter: Found price for ${tokenContract}`);
      console.log(`   Price: $${parseFloat(priceData.price).toFixed(8)}`);
      console.log(`   Symbol: ${priceData.mintSymbol}`);
      return true;
    } else {
      console.log(`⚠️ Jupiter: No price data found for ${tokenContract}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Jupiter error for ${tokenContract}:`, error.message);
    return false;
  }
}

// Función para probar CoinMarketCap API
async function testCoinMarketCap(symbol) {
  try {
    console.log(`🔍 Testing CoinMarketCap for ${symbol}...`);
    
    const apiKey = '191d98e9-46f6-4d78-a2aa-5c5d5382724b';
    
    const response = await fetch(`${APIS.coinMarketCap}/cryptocurrency/quotes/latest?symbol=${symbol}`, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.data && data.data[symbol]) {
      const tokenData = data.data[symbol];
      console.log(`✅ CoinMarketCap: Found data for ${symbol}`);
      console.log(`   Price: $${tokenData.quote.USD.price}`);
      console.log(`   Market Cap: $${tokenData.quote.USD.market_cap?.toLocaleString()}`);
      console.log(`   Volume 24h: $${tokenData.quote.USD.volume_24h?.toLocaleString()}`);
      return true;
    } else {
      console.log(`⚠️ CoinMarketCap: No data found for ${symbol}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ CoinMarketCap error for ${symbol}:`, error.message);
    return false;
  }
}

// Función principal de prueba
async function runTests() {
  console.log('🚀 Starting API tests for LATAMCOINS...\n');
  
  const results = {
    dexScreener: 0,
    jupiter: 0,
    coinMarketCap: 0,
    total: 0
  };
  
  for (const token of TEST_TOKENS) {
    console.log(`\n📊 Testing token: ${token.symbol} (${token.contract})`);
    console.log('='.repeat(60));
    
    // Probar DexScreener
    if (await testDexScreener(token.contract)) {
      results.dexScreener++;
    }
    
    // Probar Jupiter
    if (await testJupiter(token.contract)) {
      results.jupiter++;
    }
    
    // Probar CoinMarketCap
    if (await testCoinMarketCap(token.symbol)) {
      results.coinMarketCap++;
    }
    
    results.total++;
    
    // Pausa entre requests para evitar rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Resumen de resultados
  console.log('\n📈 Test Results Summary:');
  console.log('='.repeat(40));
  console.log(`DexScreener: ${results.dexScreener}/${results.total} tokens`);
  console.log(`Jupiter: ${results.jupiter}/${results.total} tokens`);
  console.log(`CoinMarketCap: ${results.coinMarketCap}/${results.total} tokens`);
  
  const totalWorking = results.dexScreener + results.jupiter + results.coinMarketCap;
  const totalPossible = results.total * 3;
  
  console.log(`\nOverall: ${totalWorking}/${totalPossible} API calls successful`);
  
  if (totalWorking > 0) {
    console.log('✅ At least one API is working - LATAMCOINS can fetch real data!');
  } else {
    console.log('❌ No APIs are working - check your internet connection and API keys');
  }
  
  // Guardar resultados en archivo
  const reportPath = path.join(__dirname, 'api-test-results.json');
  const report = {
    timestamp: new Date().toISOString(),
    results,
    summary: {
      totalWorking,
      totalPossible,
      successRate: `${((totalWorking / totalPossible) * 100).toFixed(1)}%`
    }
  };
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 Detailed report saved to: ${reportPath}`);
}

// Ejecutar las pruebas
runTests().catch(console.error);
