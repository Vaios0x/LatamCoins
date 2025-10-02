import { NextResponse } from 'next/server';

// Función para verificar DexScreener
async function checkDexScreener() {
  try {
    const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/b3tr9tdcpqdtkah6hou2ut3u4udv1na75oe6r4femumt', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'LATAMCOINS/1.0'
      }
    });
    
    return {
      name: 'DexScreener',
      status: response.ok ? 'success' : 'error',
      message: response.ok ? 'Conectado' : `Error ${response.status}`,
      lastChecked: new Date().toISOString()
    };
  } catch {
    return {
      name: 'DexScreener',
      status: 'error',
      message: 'Sin conexión',
      lastChecked: new Date().toISOString()
    };
  }
}

// Función para verificar CoinMarketCap
async function checkCoinMarketCap() {
  try {
    const apiKey = '191d98e9-46f6-4d78-a2aa-5c5d5382724b';
    const response = await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=BTC', {
      method: 'GET',
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      return {
        name: 'CoinMarketCap',
        status: 'success',
        message: 'Conectado',
        lastChecked: new Date().toISOString()
      };
    } else {
      return {
        name: 'CoinMarketCap',
        status: 'error',
        message: `Error ${response.status}`,
        lastChecked: new Date().toISOString()
      };
    }
  } catch {
    return {
      name: 'CoinMarketCap',
      status: 'error',
      message: 'Sin conexión',
      lastChecked: new Date().toISOString()
    };
  }
}

// Función para verificar Jupiter
async function checkJupiter() {
  try {
    // Verificar si hay API key configurada
    const apiKey = process.env.NEXT_PUBLIC_JUPITER_API_KEY;
    
    if (!apiKey) {
      // Usar el plan gratuito de Jupiter (1 RPS, sin API key)
      const response = await fetch('https://lite-api.jup.ag/price/v2?ids=So11111111111111111111111111111111111111112', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'LATAMCOINS/1.0'
        }
      });
      
      if (response.ok) {
        return {
          name: 'Jupiter',
          status: 'success',
          message: 'Conectado (Plan gratuito)',
          lastChecked: new Date().toISOString()
        };
      } else {
        return {
          name: 'Jupiter',
          status: 'error',
          message: `Error ${response.status}`,
          lastChecked: new Date().toISOString()
        };
      }
    }
    
    // Usar el endpoint api.jup.ag para usuarios con API key (según docs oficiales)
    const response = await fetch('https://api.jup.ag/price/v3?ids=So11111111111111111111111111111111111111112', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'x-api-key': apiKey,
        'User-Agent': 'LATAMCOINS/1.0'
      }
    });
    
    if (response.ok) {
      return {
        name: 'Jupiter',
        status: 'success',
        message: 'Conectado (API premium)',
        lastChecked: new Date().toISOString()
      };
    } else {
      return {
        name: 'Jupiter',
        status: 'error',
        message: `Error ${response.status}`,
        lastChecked: new Date().toISOString()
      };
    }
  } catch {
    return {
      name: 'Jupiter',
      status: 'error',
      message: 'Sin conexión',
      lastChecked: new Date().toISOString()
    };
  }
}

export async function GET() {
  try {
    console.log('🔍 Checking API status...');
    
    // Verificar todas las APIs en paralelo
    const [dexScreener, coinMarketCap, jupiter] = await Promise.all([
      checkDexScreener(),
      checkCoinMarketCap(),
      checkJupiter()
    ]);
    
    const apiStatuses = [dexScreener, coinMarketCap, jupiter];
    const workingApis = apiStatuses.filter(api => api.status === 'success' || api.status === 'warning').length;
    const totalApis = apiStatuses.length;
    
    console.log(`✅ API Status: ${workingApis}/${totalApis} APIs working`);
    
    return NextResponse.json({
      success: true,
      apis: apiStatuses,
      summary: {
        working: workingApis,
        total: totalApis,
        lastChecked: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking API status:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check API status',
        message: 'Error al verificar estado de APIs'
      },
      { status: 500 }
    );
  }
}
