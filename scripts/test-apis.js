#!/usr/bin/env node

/**
 * Script para probar las APIs de datos reales
 * Ejecutar con: node scripts/test-apis.js
 */

const https = require('https');

// Configuración
const DEXSCREENER_API = 'https://api.dexscreener.com/latest/dex/tokens/';
const TEST_TOKENS = [
  '6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df', // DOGGY
  'cb4plxp969uyqrzlk8zwpbbxmhqybhwgzofzjozfghy', // MAD
  '3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru', // QRA
];

// Función para hacer peticiones HTTP
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
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
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Probar DexScreener API
async function testDexScreener() {
  console.log('🔍 Probando DexScreener API...\n');
  
  for (const tokenAddress of TEST_TOKENS) {
    try {
      console.log(`Testing token: ${tokenAddress}`);
      const url = `${DEXSCREENER_API}${tokenAddress}`;
      const data = await makeRequest(url);
      
      if (data && data.pairs && data.pairs.length > 0) {
        const pair = data.pairs[0];
        console.log(`✅ Token encontrado:`);
        console.log(`   - Precio: $${parseFloat(pair.priceUsd).toFixed(8)}`);
        console.log(`   - Cambio 24h: ${parseFloat(pair.priceChange?.h24 || 0).toFixed(2)}%`);
        console.log(`   - Volumen 24h: $${parseFloat(pair.volume?.h24 || 0).toLocaleString()}`);
        console.log(`   - Market Cap: $${parseFloat(pair.marketCap || 0).toLocaleString()}`);
        console.log(`   - Liquidez: $${parseFloat(pair.liquidity?.usd || 0).toLocaleString()}`);
        console.log('');
      } else {
        console.log(`❌ No se encontraron datos para ${tokenAddress}`);
        console.log('');
      }
    } catch (error) {
      console.log(`❌ Error para ${tokenAddress}: ${error.message}`);
      console.log('');
    }
  }
}

// Función principal
async function main() {
  console.log('🚀 LATAMCOINS - Prueba de APIs\n');
  console.log('=====================================\n');
  
  await testDexScreener();
  
  console.log('=====================================');
  console.log('✅ Prueba completada');
  console.log('\n📝 Notas:');
  console.log('- Si ves errores, verifica que las direcciones de tokens sean correctas');
  console.log('- DexScreener puede tener límites de rate limiting');
  console.log('- Algunos tokens pueden no estar disponibles en DexScreener');
}

// Ejecutar
main().catch(console.error);
