/**
 * Utilidades de formateo para LATAMCOINS
 * Formateo de números, precios, porcentajes y fechas
 */

/**
 * Formatea un número como precio en USD
 */
export const formatPrice = (price: number): string => {
  if (price === 0) return '$0.00';
  
  // Para precios muy pequeños, mostrar más decimales
  if (price < 0.000001) {
    return `$${price.toExponential(4)}`;
  }
  
  // Para precios pequeños, mostrar 6 decimales
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  }
  
  // Para precios normales, mostrar 2 decimales
  if (price < 1000) {
    return `$${price.toFixed(2)}`;
  }
  
  // Para precios grandes, usar separadores de miles
  return `$${price.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

/**
 * Formatea un número como porcentaje
 */
export const formatPercentage = (percentage: number, decimals: number = 2): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(decimals)}%`;
};

/**
 * Formatea un número como volumen o market cap
 */
export const formatLargeNumber = (num: number): string => {
  if (num === 0) return '$0';
  
  const absNum = Math.abs(num);
  
  if (absNum >= 1e9) {
    return `$${(num / 1e9).toFixed(2)}B`;
  }
  
  if (absNum >= 1e6) {
    return `$${(num / 1e6).toFixed(2)}M`;
  }
  
  if (absNum >= 1e3) {
    return `$${(num / 1e3).toFixed(2)}K`;
  }
  
  return `$${num.toFixed(2)}`;
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

/**
 * Formatea un timestamp como tiempo relativo
 */
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) {
    return `${days}d ago`;
  }
  
  if (hours > 0) {
    return `${hours}h ago`;
  }
  
  if (minutes > 0) {
    return `${minutes}m ago`;
  }
  
  return 'Just now';
};

/**
 * Formatea una dirección de contrato (truncar)
 */
export const formatAddress = (address: string, start: number = 6, end: number = 4): string => {
  if (address.length <= start + end) {
    return address;
  }
  
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

/**
 * Formatea un número como ranking
 */
export const formatRank = (rank: number): string => {
  return `#${rank}`;
};

/**
 * Formatea un cambio de precio con color
 */
export const formatPriceChange = (change: number): {
  formatted: string;
  isPositive: boolean;
  color: string;
} => {
  const isPositive = change >= 0;
  const formatted = formatPercentage(change);
  const color = isPositive ? '#00ff41' : '#ff0040';
  
  return {
    formatted,
    isPositive,
    color,
  };
};

/**
 * Formatea un volumen con unidad apropiada
 */
export const formatVolume = (volume: number): string => {
  return formatLargeNumber(volume);
};

/**
 * Formatea un market cap
 */
export const formatMarketCap = (marketCap: number): string => {
  return formatLargeNumber(marketCap);
};

/**
 * Formatea un supply de tokens
 */
export const formatSupply = (supply: number): string => {
  if (supply >= 1e9) {
    return `${(supply / 1e9).toFixed(2)}B`;
  }
  
  if (supply >= 1e6) {
    return `${(supply / 1e6).toFixed(2)}M`;
  }
  
  if (supply >= 1e3) {
    return `${(supply / 1e3).toFixed(2)}K`;
  }
  
  return supply.toLocaleString();
};

/**
 * Formatea un precio para mostrar en ticker
 */
export const formatTickerPrice = (price: number): string => {
  if (price < 0.000001) {
    return `$${price.toExponential(2)}`;
  }
  
  if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  }
  
  return `$${price.toFixed(4)}`;
};

/**
 * Formatea un porcentaje para mostrar en ticker
 */
export const formatTickerPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

/**
 * Formatea datos para tooltip de gráfico
 */
export const formatChartTooltip = (value: number, label: string): string => {
  return `${label}: ${formatPrice(value)}`;
};

/**
 * Formatea un timestamp para eje de gráfico
 */
export const formatChartTime = (timestamp: number, timeframe: string): string => {
  const date = new Date(timestamp);
  
  switch (timeframe) {
    case '1H':
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    
    case '24H':
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    
    case '7D':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    
    case '30D':
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    
    case '1Y':
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
    
    default:
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
  }
};
