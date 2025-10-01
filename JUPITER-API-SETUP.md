# Jupiter API - Configuración

## 🎯 **Estado Actual:**
- ✅ **DexScreener**: Conectado
- ✅ **CoinMarketCap**: Conectado  
- ⚠️ **Jupiter**: Requiere API key

## 🚀 **Para Habilitar Jupiter API:**

### **Opción 1: QuickNode (Recomendado)**

#### **Paso 1: Registrarse en QuickNode**
1. Ve a [https://www.quicknode.com/](https://www.quicknode.com/)
2. Crea una cuenta gratuita
3. Selecciona "Solana" como blockchain
4. Elige el plan que necesites

#### **Paso 2: Obtener API Key**
1. En el dashboard de QuickNode
2. Ve a "Endpoints" 
3. Crea un nuevo endpoint de Solana
4. Copia la API key generada

#### **Paso 3: Configurar en LATAMCOINS**
```bash
# Agregar a .env.local
NEXT_PUBLIC_JUPITER_API_KEY=tu_quicknode_api_key_aqui
```

### **Opción 2: API Pública (Limitada)**

#### **Configuración:**
```bash
# En .env.local
NEXT_PUBLIC_JUPITER_API_KEY=public
NEXT_PUBLIC_JUPITER_API_URL=https://api.jup.ag/v4
```

**Limitaciones:**
- 10 requests por segundo
- Tarifa 0.2% en trades
- Sin soporte 24/7

## 🔧 **Configuración Automática:**

### **Archivo .env.local:**
```bash
# APIs de Cryptocurrency
NEXT_PUBLIC_CMC_API_KEY=191d98e9-46f6-4d78-a2aa-5c5d5382724b
NEXT_PUBLIC_CMC_API_URL=https://pro-api.coinmarketcap.com/v1

# DexScreener API (gratuita)
NEXT_PUBLIC_DEXSCREENER_API_URL=https://api.dexscreener.com/latest

# Jupiter API (requiere API key)
NEXT_PUBLIC_JUPITER_API_URL=https://api.jup.ag/v4
NEXT_PUBLIC_JUPITER_API_KEY=tu_api_key_aqui
```

## 📊 **Resultado Esperado:**

Una vez configurado, el dashboard mostrará:

| API | Estado | Mensaje |
|-----|--------|---------|
| **DexScreener** | ✅ Conectado | "Conectado" |
| **CoinMarketCap** | ✅ Conectado | "Conectado" |
| **Jupiter** | ✅ Conectado | "Conectado" |

## 🎯 **Beneficios de Jupiter API:**

### **✅ Datos Adicionales:**
- Precios de tokens de Solana
- Datos de liquidez
- Información de DEX
- Análisis de mercado

### **✅ Funcionalidades:**
- Comparación de precios
- Análisis de arbitraje
- Datos de trading
- Métricas avanzadas

## 🚀 **Pasos Rápidos:**

1. **Registrarse en QuickNode** (5 minutos)
2. **Crear endpoint de Solana** (2 minutos)
3. **Copiar API key** (1 minuto)
4. **Agregar a .env.local** (1 minuto)
5. **Reiniciar aplicación** (30 segundos)

## 📝 **Notas Importantes:**

- **QuickNode** es la opción más confiable
- **API pública** tiene limitaciones
- **Sin API key** = Jupiter deshabilitado
- **Con API key** = Jupiter habilitado automáticamente

---

**Estado**: ⚠️ **REQUIERE CONFIGURACIÓN**
**Dificultad**: 🟢 **FÁCIL** (5 minutos)
**Costo**: 🟢 **GRATIS** (plan básico)
