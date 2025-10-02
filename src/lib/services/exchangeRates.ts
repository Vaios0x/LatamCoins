/**
 * Servicio de tipos de cambio para monedas latinoamericanas
 * Obtiene tipos de cambio reales y actualizados
 */

export interface ExchangeRate {
  code: string;
  name: string;
  symbol: string;
  rate: number; // Tasa de cambio respecto al USD
  flag: string;
  lastUpdated: string;
}

export interface ExchangeRatesResponse {
  success: boolean;
  data: ExchangeRate[];
  lastUpdated: string;
  source: string;
}

// Monedas latinoamericanas soportadas
export const LATAM_CURRENCIES: Omit<ExchangeRate, 'rate' | 'lastUpdated'>[] = [
  { code: 'USD', name: 'Dólar Estadounidense', symbol: '$', flag: '🇺🇸' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', flag: '🇲🇽' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', flag: '🇦🇷' },
  { code: 'UYU', name: 'Peso Uruguayo', symbol: '$', flag: '🇺🇾' },
  { code: 'BRL', name: 'Real Brasileño', symbol: 'R$', flag: '🇧🇷' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', flag: '🇨🇱' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', flag: '🇨🇴' },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', flag: '🇵🇪' },
  { code: 'VES', name: 'Bolívar Venezolano', symbol: 'Bs', flag: '🇻🇪' },
  { code: 'GTQ', name: 'Quetzal Guatemalteco', symbol: 'Q', flag: '🇬🇹' },
  { code: 'HNL', name: 'Lempira Hondureño', symbol: 'L', flag: '🇭🇳' },
  { code: 'NIO', name: 'Córdoba Nicaragüense', symbol: 'C$', flag: '🇳🇮' },
  { code: 'CRC', name: 'Colón Costarricense', symbol: '₡', flag: '🇨🇷' },
  { code: 'PAB', name: 'Balboa Panameño', symbol: 'B/.', flag: '🇵🇦' },
  { code: 'DOP', name: 'Peso Dominicano', symbol: '$', flag: '🇩🇴' },
  { code: 'CUP', name: 'Peso Cubano', symbol: '$', flag: '🇨🇺' },
  { code: 'JMD', name: 'Dólar Jamaiquino', symbol: '$', flag: '🇯🇲' },
  { code: 'TTD', name: 'Dólar de Trinidad y Tobago', symbol: '$', flag: '🇹🇹' },
  { code: 'BBD', name: 'Dólar de Barbados', symbol: '$', flag: '🇧🇧' },
  { code: 'XCD', name: 'Dólar del Caribe Oriental', symbol: '$', flag: '🇦🇬' },
];

// Cache para tipos de cambio
let exchangeRatesCache: ExchangeRate[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Obtiene tipos de cambio reales desde múltiples fuentes
 */
export async function getExchangeRates(): Promise<ExchangeRatesResponse> {
  try {
    // Verificar cache
    const now = Date.now();
    if (exchangeRatesCache && (now - cacheTimestamp) < CACHE_DURATION) {
      return {
        success: true,
        data: exchangeRatesCache,
        lastUpdated: new Date(cacheTimestamp).toISOString(),
        source: 'cache'
      };
    }

    // Intentar obtener datos desde ExchangeRate-API
    let rates: ExchangeRate[] = [];
    let source = 'fallback';

    try {
      // Usar ExchangeRate-API (gratuita)
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      
      if (data.rates) {
        rates = LATAM_CURRENCIES.map(currency => ({
          ...currency,
          rate: currency.code === 'USD' ? 1 : (data.rates[currency.code] || 1),
          lastUpdated: new Date().toISOString()
        }));
        source = 'exchangerate-api';
      }
    } catch (error) {
      console.warn('ExchangeRate-API failed, using fallback rates:', error);
    }

    // Fallback: usar tasas aproximadas si la API falla
    if (rates.length === 0) {
      rates = LATAM_CURRENCIES.map(currency => ({
        ...currency,
        rate: getFallbackRate(currency.code),
        lastUpdated: new Date().toISOString()
      }));
      source = 'fallback';
    }

    // Actualizar cache
    exchangeRatesCache = rates;
    cacheTimestamp = now;

    return {
      success: true,
      data: rates,
      lastUpdated: new Date().toISOString(),
      source
    };

  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return {
      success: false,
      data: [],
      lastUpdated: new Date().toISOString(),
      source: 'error'
    };
  }
}

/**
 * Tasas de cambio de fallback (aproximadas)
 */
function getFallbackRate(currencyCode: string): number {
  const fallbackRates: Record<string, number> = {
    'USD': 1,
    'MXN': 20.0,
    'ARS': 1000.0,
    'UYU': 40.0,
    'BRL': 5.0,
    'CLP': 900.0,
    'COP': 4000.0,
    'PEN': 3.7,
    'VES': 36.0,
    'GTQ': 7.8,
    'HNL': 24.7,
    'NIO': 36.8,
    'CRC': 520.0,
    'PAB': 1.0,
    'DOP': 56.0,
    'CUP': 24.0,
    'JMD': 155.0,
    'TTD': 6.8,
    'BBD': 2.0,
    'XCD': 2.7
  };
  
  return fallbackRates[currencyCode] || 1;
}

/**
 * Convierte un precio de USD a otra moneda
 */
export function convertPrice(priceUSD: number, targetCurrency: string, rates: ExchangeRate[]): number {
  if (targetCurrency === 'USD') return priceUSD;
  
  const rate = rates.find(r => r.code === targetCurrency);
  if (!rate) return priceUSD;
  
  return priceUSD * rate.rate;
}

/**
 * Formatea un precio según la moneda
 */
export function formatPrice(price: number, currency: string, rates: ExchangeRate[]): string {
  const currencyInfo = rates.find(r => r.code === currency);
  if (!currencyInfo) return `$${price.toFixed(8)}`;
  
  const { symbol, code } = currencyInfo;
  
  // Formatear según la moneda
  if (price >= 1) {
    return `${symbol}${price.toFixed(2)}`;
  } else if (price >= 0.01) {
    return `${symbol}${price.toFixed(4)}`;
  } else {
    return `${symbol}${price.toFixed(8)}`;
  }
}

/**
 * Obtiene la moneda seleccionada del localStorage
 */
export function getSelectedCurrency(): string {
  if (typeof window === 'undefined') return 'USD';
  return localStorage.getItem('selectedCurrency') || 'USD';
}

/**
 * Guarda la moneda seleccionada en localStorage
 */
export function setSelectedCurrency(currency: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('selectedCurrency', currency);
}
