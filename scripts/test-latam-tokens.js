#!/usr/bin/env node

/**
 * Script para probar los tokens LATAM específicos
 * Ejecutar con: node scripts/test-latam-tokens.js
 */

const https = require('https');

// Tokens LATAM específicos
const LATAM_TOKENS = [
  {
    name: 'HUMO',
    address: 'b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt',
    url: 'https://dexscreener.com/solana/b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt'
  },
  {
    name: 'DOGGY',
    address: '6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df',
    url: 'https://dexscreener.com/solana/6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df'
  },
  {
    name: 'MAD',
    address: 'cb4plxp969uyqrzlk8zwpbbxmhqybhwgzofzjozfghy',
    url: 'https://dexscreener.com/solana/cb4plxp969uyqrzlk8zwpbbxmhqybhwgzofzjozfghy'
  },
  {
    name: 'QRA',
    address: '3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru',
    url: 'https://dexscreener.com/solana/3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru'
  },
  {
    name: 'Darrkito',
    address: '9Uxjbn2TyfEmjaYs1qXiLt3FbE3VDa5UMkvQGZwQpump',
    url: 'https://dexscreener.com/solana/9uxjbn2tyfemjays1qxiLt3FbE3VDa5UMkvQGZwQpump'
  }
];

// Función para hacer peticiones HTTP
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'LATAMCOINS/1.0',
        'Accept': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Invalid JSON response'));
        }
      });
    });
    
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Probar cada token LATAM
async function testLatamTokens() {
  console.log('🚀 LATAMCOINS - Prueba de Tokens LATAM\n');
  console.log('=====================================\n');
  
  for (const token of LATAM_TOKENS) {
    try {
      console.log(`🔍 Probando ${token.name} (${token.address})`);
      console.log(`URL: ${token.url}`);
      
      const apiUrl = `https://api.dexscreener.com/latest/dex/tokens/${token.address}`;
      console.log(`API URL: ${apiUrl}\n`);
      
      const data = await makeRequest(apiUrl);
      
      if (data && data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0];
        console.log(`✅ ${token.name} encontrado:`);
        console.log(`   - Precio: $${parseFloat(pair.priceUsd || 0).toFixed(8)}`);
        console.log(`   - Cambio 24h: ${parseFloat(pair.priceChange?.h24 || 0).toFixed(2)}%`);
        console.log(`   - Volumen 24h: $${parseFloat(pair.volume?.h24 || 0).toLocaleString()}`);
        console.log(`   - Market Cap: $${parseFloat(pair.marketCap || 0).toLocaleString()}`);
        console.log(`   - Liquidez: $${parseFloat(pair.liquidity?.usd || 0).toLocaleString()}`);
        console.log(`   - Base Token: ${pair.baseToken?.symbol || 'N/A'}`);
        console.log(`   - Quote Token: ${pair.quoteToken?.symbol || 'N/A'}`);
        console.log(`   - Dex: ${pair.dexId || 'N/A'}`);
        console.log('');
      } else {
        console.log(`❌ No se encontraron datos para ${token.name}`);
        console.log(`Respuesta:`, JSON.stringify(data, null, 2));
        console.log('');
      }
    } catch (error) {
      console.log(`❌ Error para ${token.name}: ${error.message}`);
      console.log('');
    }
  }
}

// Función principal
async function main() {
  await testLatamTokens();
  
  console.log('=====================================');
  console.log('✅ Prueba completada');
  console.log('\n📝 Notas:');
  console.log('- Si ves errores, verifica que las direcciones de tokens sean correctas');
  console.log('- DexScreener puede tener límites de rate limiting');
  console.log('- Algunos tokens pueden no estar disponibles en DexScreener');
}

// Ejecutar
main().catch(console.error);
