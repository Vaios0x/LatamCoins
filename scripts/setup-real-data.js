#!/usr/bin/env node

/**
 * Script de configuración para datos reales en LATAMCOINS
 * Configura automáticamente las variables de entorno y dependencias
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando LATAMCOINS para datos reales...\n');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    console.log('📋 Copiando archivo de variables de entorno...');
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Archivo .env.local creado');
  } else {
    console.log('⚠️  Archivo env.example no encontrado');
  }
} else {
  console.log('✅ Archivo .env.local ya existe');
}

// Verificar dependencias necesarias
console.log('\n📦 Verificando dependencias...');

const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredDeps = [
    '@tanstack/react-query',
    'zustand',
    'recharts'
  ];
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  );
  
  if (missingDeps.length > 0) {
    console.log('⚠️  Dependencias faltantes:', missingDeps.join(', '));
    console.log('💡 Ejecuta: npm install ' + missingDeps.join(' '));
  } else {
    console.log('✅ Todas las dependencias están instaladas');
  }
} else {
  console.log('⚠️  package.json no encontrado');
}

// Mostrar instrucciones
console.log('\n📋 INSTRUCCIONES:');
console.log('1. Edita el archivo .env.local con tu API key de CoinMarketCap');
console.log('2. Ejecuta: npm run dev');
console.log('3. Abre http://localhost:3000');
console.log('4. Usa el toggle para alternar entre datos reales y mock');

console.log('\n🔑 OBTENER API KEY:');
console.log('1. Ve a https://coinmarketcap.com/api/');
console.log('2. Regístrate y obtén tu API key');
console.log('3. Agrega la key a .env.local');

console.log('\n🎉 ¡Configuración completada!');
console.log('📖 Lee README-REAL-DATA.md para más detalles');
