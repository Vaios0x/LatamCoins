# 🚀 Configuración de Vercel para LATAMCOINS

## Variables de Entorno Requeridas

Para que todas las APIs funcionen correctamente en producción, configura estas variables en Vercel:

### 1. Jupiter API (Opcional pero recomendado)
```
NEXT_PUBLIC_JUPITER_API_KEY=tu_api_key_aqui
```

**Cómo obtener la API key:**
1. Ve a https://jup.ag/
2. Regístrate para obtener acceso a la API
3. Copia tu API key
4. Añádela en Vercel Dashboard > Settings > Environment Variables

### 2. Solana RPC (Opcional)
```
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## Configuración en Vercel Dashboard

1. **Ve a tu proyecto en Vercel**
2. **Settings > Environment Variables**
3. **Añade las variables:**
   - `NEXT_PUBLIC_JUPITER_API_KEY` = tu_api_key_de_jupiter
   - `NEXT_PUBLIC_SOLANA_RPC_URL` = https://api.mainnet-beta.solana.com

4. **Redeploy** el proyecto después de añadir las variables

## Estado de APIs Esperado

### Con API Keys configuradas:
- ✅ DexScreener: Conectado
- ✅ CoinMarketCap: Conectado  
- ✅ Jupiter: Conectado (API premium)

### Sin API Keys (fallback):
- ✅ DexScreener: Conectado
- ✅ CoinMarketCap: Conectado
- ⚠️ Jupiter: API pública limitada

## Solución de Problemas

### Si Jupiter muestra "API key requerida":
1. Verifica que `NEXT_PUBLIC_JUPITER_API_KEY` esté configurada
2. Asegúrate de que la variable sea pública (NEXT_PUBLIC_)
3. Redeploy el proyecto después de añadir la variable

### Si las APIs no responden:
1. Verifica la conectividad de red en Vercel
2. Revisa los logs de la función en Vercel Dashboard
3. Asegúrate de que las URLs de las APIs sean correctas

## URLs de APIs Utilizadas

- **DexScreener**: https://api.dexscreener.com/
- **CoinMarketCap**: https://pro-api.coinmarketcap.com/
- **Jupiter**: https://price.jup.ag/ (pública) o https://api.jup.ag/ (premium)
