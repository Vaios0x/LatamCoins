# Jupiter API Key - Configuración Requerida

## 🔑 **API Key de Jupiter Requerida**

Jupiter ya no es "opcional" - necesita tu API key para funcionar correctamente.

## 🚀 **Pasos para Configurar:**

### **1. Obtener API Key de Jupiter:**
1. **Ir a**: [https://portal.jup.ag/](https://portal.jup.ag/)
2. **Registrarse** con email
3. **Seleccionar plan** (Lite es gratuito)
4. **Obtener API key**

### **2. Configurar en LATAMCOINS:**
```bash
# Agregar a .env.local
NEXT_PUBLIC_JUPITER_API_KEY=tu_api_key_aqui
```

### **3. Reiniciar la aplicación:**
```bash
npm run dev
```

## 📊 **Configuración Actualizada:**

### **✅ Prioridad de APIs:**
1. **Jupiter API** (si hay API key) - **PRIORITARIO**
2. **DexScreener** (fallback)
3. **CoinMarketCap** (fallback)
4. **Datos simulados** (último recurso)

### **✅ Estado del Dashboard:**
| API | Estado | Mensaje |
|-----|--------|---------|
| **DexScreener** | ✅ Conectado | "Conectado" |
| **CoinMarketCap** | ✅ Conectado | "Conectado" |
| **Jupiter** | ⚠️ Requiere API key | "API key requerida" |

## 🎯 **Beneficios de Jupiter API:**

### **✅ Datos Específicos de Jupiter:**
- **Precios de tokens** de Jupiter
- **Datos de liquidez** específicos
- **Información de DEX** de Solana
- **Análisis de mercado** avanzado

### **✅ Tokens Soportados:**
- **DOGGY**: `BS7HxRitaY5ipGfbek1nmatWLbaS9yoWRSEQzCb3pump`
- **MAD**: `CZbkRyauV5b9Q4xNwKGUtEBEggzqWpC6KMVp2oRppump`
- **QUIRA**: `DsMWZg6mkheTV2XTkbUtWcsXaajTzEkk1TC7o6Fmpump`
- **DARRKITO**: `9Uxjbn2TyfEmjaYs1qXiLt3FbE3VDa5UMkvQGZwQpump`
- **HUMO**: `9RLoB3YZwk9sK78ZhmiSAj8CtPhssuJR1pVR326Vpump`

## 🔧 **Configuración Final:**

### **Archivo .env.local:**
```bash
# APIs de Cryptocurrency
NEXT_PUBLIC_CMC_API_KEY=191d98e9-46f6-4d78-a2aa-5c5d5382724b
NEXT_PUBLIC_CMC_API_URL=https://pro-api.coinmarketcap.com/v1

# DexScreener API (gratuita)
NEXT_PUBLIC_DEXSCREENER_API_URL=https://api.dexscreener.com/latest

# Jupiter API (requiere API key)
NEXT_PUBLIC_JUPITER_API_URL=https://lite-api.jup.ag/price/v3
NEXT_PUBLIC_JUPITER_API_KEY=tu_api_key_aqui
```

## 📈 **Resultado Esperado:**

Una vez configurado, el dashboard mostrará:

| API | Estado | Mensaje |
|-----|--------|---------|
| **DexScreener** | ✅ Conectado | "Conectado" |
| **CoinMarketCap** | ✅ Conectado | "Conectado" |
| **Jupiter** | ✅ Conectado | "Conectado" |

## 🎯 **Recomendación:**

**Configura Jupiter API para obtener datos completos de todos los tokens LATAM.**

- ✅ **Datos 100% reales** desde Jupiter
- ✅ **Cobertura completa** de tokens
- ✅ **Información específica** de Solana
- ✅ **Análisis avanzado** de mercado

---

**Estado**: ⚠️ **REQUIERE API KEY**
**Dificultad**: 🟢 **FÁCIL** (5 minutos)
**Costo**: 🟢 **GRATIS** (plan Lite)
