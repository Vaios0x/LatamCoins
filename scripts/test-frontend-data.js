#!/usr/bin/env node

/**
 * Script para verificar que el frontend está recibiendo datos reales
 */

const fetch = require('node-fetch');

async function testFrontendData() {
  console.log('🔍 Verificando datos del frontend...\n');
  
  try {
    // Probar la API directamente
    const response = await fetch('http://localhost:3002/api/tokens');
    const data = await response.json();
    
    if (data.success && data.data) {
      console.log('✅ API funcionando correctamente');
      console.log(`📊 Total tokens: ${data.data.length}`);
      console.log(`🔄 Tokens en tiempo real: ${data.realTimeTokens}`);
      console.log(`📈 Market cap total: $${data.totalMarketCap.toLocaleString()}`);
      console.log(`💰 Volumen total: $${data.totalVolume.toLocaleString()}\n`);
      
      // Mostrar datos de cada token
      data.data.forEach((token, index) => {
        console.log(`${index + 1}. ${token.symbol} (${token.name})`);
        console.log(`   Precio: $${token.price.toFixed(8)}`);
        console.log(`   Cambio 24h: ${token.change24h.toFixed(2)}%`);
        console.log(`   Volumen: $${token.volume24h.toLocaleString()}`);
        console.log(`   Market Cap: $${token.marketCap.toLocaleString()}`);
        console.log(`   Fuente: ${token.source}`);
        console.log(`   Tiempo real: ${token.isRealTime ? '✅' : '❌'}`);
        console.log(`   Última actualización: ${new Date(token.lastUpdated).toLocaleString()}`);
        console.log('');
      });
      
      // Verificar si hay tokens simulados
      const simulatedTokens = data.data.filter(token => token.source === 'simulated');
      if (simulatedTokens.length > 0) {
        console.log('⚠️ ADVERTENCIA: Se encontraron tokens simulados:');
        simulatedTokens.forEach(token => {
          console.log(`   - ${token.symbol}: ${token.source}`);
        });
      } else {
        console.log('✅ Todos los tokens tienen datos reales');
      }
      
    } else {
      console.error('❌ Error en la respuesta de la API:', data);
    }
    
  } catch (error) {
    console.error('❌ Error al verificar datos:', error.message);
  }
}

// Ejecutar el test
testFrontendData();
