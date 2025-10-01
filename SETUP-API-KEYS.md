# 🔑 Configuración de API Keys - LATAMCOINS

## 📋 Instrucciones para Configurar Datos Reales

### 1. **Crear archivo `.env.local`**

Crea un archivo llamado `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
# LATAMCOINS - Variables de Entorno
# Configura tu API key de CoinMarketCap aquí

# CoinMarketCap API (requerido para datos reales)
COINMARKETCAP_API_KEY=tu_api_key_aqui

# Configuración de la aplicación
NEXT_PUBLIC_USE_REAL_DATA=true
NEXT_PUBLIC_CACHE_TIMEOUT=30000
```

### 2. **Obtener API Key de CoinMarketCap**

1. Ve a [CoinMarketCap API](https://coinmarketcap.com/api/)
2. Regístrate para una cuenta gratuita
3. Obtén tu API key gratuita
4. Reemplaza `tu_api_key_aqui` con tu API key real

### 3. **Configuración Automática**

La aplicación ahora funciona con **3 niveles de datos**:

#### 🥇 **Nivel 1: CoinMarketCap (Mejor)**
- ✅ Datos más precisos y confiables
- ✅ Requiere API key gratuita
- ✅ Límites generosos para uso básico

#### 🥈 **Nivel 2: CoinGecko (Fallback)**
- ✅ Datos reales sin API key
- ✅ Funciona automáticamente
- ✅ Límites de rate más estrictos

#### 🥉 **Nivel 3: Datos Simulados (Último recurso)**
- ✅ Funciona siempre
- ❌ Datos no reales
- ✅ Solo para desarrollo

### 4. **Verificar Configuración**

Una vez configurado el `.env.local`, reinicia el servidor:

```bash
npm run dev
# o
pnpm dev
```

### 5. **Logs de Verificación**

En la consola del servidor verás:

```
🚀 Starting REAL token data fetch from CoinMarketCap...
✅ Got real data from CoinMarketCap for SOL using symbol SOL
✅ Got real data from CoinMarketCap for BTC using symbol BTC
Final results: 5 real-time tokens, 0 simulated tokens
```

### 6. **Sin API Key**

Si no tienes API key de CoinMarketCap, la aplicación automáticamente usará CoinGecko:

```
⚠️ No CoinMarketCap API key found, using CoinGecko fallback
✅ Got fallback data from CoinGecko for SOL
```

## 🎯 **Resultado Final**

### ✅ **Con API Key de CoinMarketCap:**
- 📊 Datos 100% reales y precisos
- ⚡ Actualización cada 30-60 segundos
- 🔗 Enlaces correctos a DexScreener y Pump.fun
- 📈 Gráficos interactivos con datos reales

### ✅ **Sin API Key (CoinGecko):**
- 📊 Datos reales de CoinGecko
- ⚡ Actualización cada 30-60 segundos
- 🔗 Enlaces correctos a DexScreener y Pump.fun
- 📈 Gráficos interactivos con datos reales

### ❌ **Solo datos simulados:**
- 📊 Datos mockup (no reales)
- ⚡ Actualización instantánea
- 🔗 Enlaces correctos a DexScreener y Pump.fun
- 📈 Gráficos con datos simulados

---

## 🚀 **¡Configuración Completada!**

**LATAMCOINS ahora funciona con datos reales usando CoinMarketCap (preferido) o CoinGecko (fallback) como respaldo.**
