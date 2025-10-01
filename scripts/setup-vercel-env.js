#!/usr/bin/env node

/**
 * Script para configurar variables de entorno en Vercel
 */

const { execSync } = require('child_process');

console.log('🚀 Configurando variables de entorno en Vercel...\n');

const envVars = [
  {
    name: 'NEXT_PUBLIC_CMC_API_KEY',
    value: '191d98e9-46f6-4d78-a2aa-5c5d5382724b',
    description: 'CoinMarketCap API Key'
  },
  {
    name: 'NEXT_PUBLIC_DEXSCREENER_API_URL',
    value: 'https://api.dexscreener.com/latest',
    description: 'DexScreener API URL'
  },
  {
    name: 'NEXT_PUBLIC_JUPITER_API_URL',
    value: 'https://lite-api.jup.ag/price/v3',
    description: 'Jupiter API URL'
  },
  {
    name: 'NEXT_PUBLIC_JUPITER_API_KEY',
    value: 'your_jupiter_api_key_here',
    description: 'Jupiter API Key (opcional)'
  }
];

async function setupVercelEnv() {
  try {
    console.log('📋 Variables a configurar:');
    envVars.forEach((env, index) => {
      console.log(`${index + 1}. ${env.name} = ${env.value}`);
      console.log(`   ${env.description}\n`);
    });

    console.log('⚠️  IMPORTANTE:');
    console.log('1. Asegúrate de estar logueado en Vercel CLI: vercel login');
    console.log('2. Ejecuta este comando para cada variable:');
    console.log('   vercel env add <NOMBRE_VARIABLE>');
    console.log('3. O usa el dashboard web de Vercel para configurar todas de una vez\n');

    console.log('🔧 Comandos para ejecutar:');
    envVars.forEach(env => {
      console.log(`vercel env add ${env.name}`);
    });

    console.log('\n✅ Después de configurar las variables:');
    console.log('1. Ve a tu proyecto en Vercel Dashboard');
    console.log('2. Ve a Settings → Environment Variables');
    console.log('3. Verifica que todas las variables estén configuradas');
    console.log('4. Haz un redeploy del proyecto');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupVercelEnv();
