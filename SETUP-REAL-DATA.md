# 🚀 LATAMCOINS - Configuración de Datos Reales

## 📋 Pasos para Configurar Datos Reales

### 1. Crear archivo de variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```bash
# LATAMCOINS - Variables de Entorno
# Configura tu API key de CoinMarketCap aquí

# CoinMarketCap API (requerido para datos reales)
COINMARKETCAP_API_KEY=tu_api_key_aqui

# Solana RPC (opcional, usa el público por defecto)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Configuración de la aplicación
NEXT_PUBLIC_USE_REAL_DATA=true
NEXT_PUBLIC_CACHE_TIMEOUT=30000

# URLs de APIs externas
NEXT_PUBLIC_JUPITER_API_URL=https://price.jup.ag/v4/price
NEXT_PUBLIC_SOLSCAN_API_URL=https://public-api.solscan.io
NEXT_PUBLIC_DEXSCREENER_API_URL=https://api.dexscreener.com/latest/dex/tokens
```

### 2. Obtener API Key de CoinMarketCap

1. Ve a [CoinMarketCap API](https://coinmarketcap.com/api/)
2. Crea una cuenta gratuita
3. Obtén tu API key
4. Reemplaza `tu_api_key_aqui` con tu API key real

### 3. Tokens LATAM Configurados

Los siguientes tokens están configurados para obtener datos reales:

- **DOGGY (HOLDER)**: `6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df`
- **MAD COIN**: `cb4plxp969uyqrzlk8zwpbbxmhqybhwgzofzjozfghy`
- **QRA (Quira)**: `3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru`
- **HUMO**: `b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt`
- **Darrkito**: `9Uxjbn2TyfEmjaYs1qXiLt3FbE3VDa5UMkvQGZwQpump`

### 4. Fuentes de Datos

El sistema intentará obtener datos en este orden:

1. **DexScreener** (primera opción)
2. **CoinMarketCap** (respaldo)
3. **Datos simulados** (último recurso)

### 5. Verificar Funcionamiento

1. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

2. Visita `http://localhost:3000/api/tokens` para ver los datos en formato JSON

3. Verifica que los datos muestren `"isRealTime": true` para tokens con datos reales

### 6. Indicadores Visuales

- 🟢 **LIVE**: Datos reales de DexScreener o CoinMarketCap
- 🔴 **Simulado**: Datos simulados (cuando no hay datos reales disponibles)

### 7. Solución de Problemas

#### Si todos los tokens aparecen como "Simulado":

1. Verifica que tu API key de CoinMarketCap sea correcta
2. Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto
3. Reinicia el servidor de desarrollo

#### Si algunos tokens aparecen como "LIVE":

- ✅ Los datos reales están funcionando correctamente
- Los tokens que aparecen como "Simulado" no están disponibles en las APIs externas

### 8. URLs de Referencia

- [DexScreener - HUMO](https://dexscreener.com/solana/b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt)
- [DexScreener - DOGGY](https://dexscreener.com/solana/6pwwjc9t5vmlqiswr4h7ux6il1eixmjfjhe1ekwsa7df)
- [DexScreener - MAD](https://dexscreener.com/solana/cb4plxp969uyqrzlk8zwpbbxmhqybhwgzofzjozfghy)
- [DexScreener - QRA](https://dexscreener.com/solana/3al1hm9mcktrv8vkztvmaxnhtvqzhmmqfxhx9k7daeru)
- [DexScreener - Darrkito](https://dexscreener.com/solana/9uxjbn2tyfemjays1qxiLt3FbE3VDa5UMkvQGZwQpump)

### 9. Notas Importantes

- Los tokens LATAM pueden no estar disponibles en todas las APIs
- DexScreener es la fuente preferida para tokens de Solana
- CoinMarketCap es el respaldo para tokens más establecidos
- Los datos se actualizan automáticamente cada 60 segundos

---

**¡Configuración completada!** 🎉

Una vez configurado, tu aplicación mostrará datos reales cuando estén disponibles y datos simulados realistas cuando no lo estén.
