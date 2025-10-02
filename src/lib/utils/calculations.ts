/**
 * Utilidades de cálculos para CoinLatamCap
 * Cálculos de precios, cambios, estadísticas
 */

/**
 * Calcula el cambio porcentual entre dos precios
 */
export const calculatePercentageChange = (oldPrice: number, newPrice: number): number => {
  if (oldPrice === 0) return 0;
  return ((newPrice - oldPrice) / oldPrice) * 100;
};

/**
 * Calcula el cambio absoluto entre dos precios
 */
export const calculateAbsoluteChange = (oldPrice: number, newPrice: number): number => {
  return newPrice - oldPrice;
};

/**
 * Calcula el market cap basado en precio y supply
 */
export const calculateMarketCap = (price: number, supply: number): number => {
  return price * supply;
};

/**
 * Calcula el volumen total en 24h
 */
export const calculateTotalVolume24h = (volumes: number[]): number => {
  return volumes.reduce((sum, volume) => sum + volume, 0);
};

/**
 * Calcula el market cap total
 */
export const calculateTotalMarketCap = (marketCaps: number[]): number => {
  return marketCaps.reduce((sum, cap) => sum + cap, 0);
};

/**
 * Calcula el cambio promedio en 24h
 */
export const calculateAverageChange24h = (changes: number[]): number => {
  if (changes.length === 0) return 0;
  return changes.reduce((sum, change) => sum + change, 0) / changes.length;
};

/**
 * Calcula el ranking de un token basado en market cap
 */
export const calculateRanking = (marketCap: number, allMarketCaps: number[]): number => {
  const sortedCaps = [...allMarketCaps].sort((a, b) => b - a);
  return sortedCaps.indexOf(marketCap) + 1;
};

/**
 * Calcula el ATH (All Time High) de una serie de precios
 */
export const calculateATH = (prices: number[]): number => {
  return Math.max(...prices);
};

/**
 * Calcula el ATL (All Time Low) de una serie de precios
 */
export const calculateATL = (prices: number[]): number => {
  return Math.min(...prices);
};

/**
 * Calcula la distancia desde ATH
 */
export const calculateDistanceFromATH = (currentPrice: number, ath: number): number => {
  if (ath === 0) return 0;
  return ((currentPrice - ath) / ath) * 100;
};

/**
 * Calcula la distancia desde ATL
 */
export const calculateDistanceFromATL = (currentPrice: number, atl: number): number => {
  if (atl === 0) return 0;
  return ((currentPrice - atl) / atl) * 100;
};

/**
 * Calcula la volatilidad de una serie de precios
 */
export const calculateVolatility = (prices: number[]): number => {
  if (prices.length < 2) return 0;
  
  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance) * 100; // Volatilidad como porcentaje
};

/**
 * Calcula el RSI (Relative Strength Index) de una serie de precios
 */
export const calculateRSI = (prices: number[], period: number = 14): number => {
  if (prices.length < period + 1) return 50;
  
  const gains = [];
  const losses = [];
  
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  const avgGain = gains.slice(-period).reduce((sum, gain) => sum + gain, 0) / period;
  const avgLoss = losses.slice(-period).reduce((sum, loss) => sum + loss, 0) / period;
  
  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
};

/**
 * Calcula el precio promedio ponderado por volumen
 */
export const calculateVolumeWeightedAveragePrice = (prices: number[], volumes: number[]): number => {
  if (prices.length !== volumes.length || prices.length === 0) return 0;
  
  let totalVolume = 0;
  let weightedSum = 0;
  
  for (let i = 0; i < prices.length; i++) {
    weightedSum += prices[i] * volumes[i];
    totalVolume += volumes[i];
  }
  
  return totalVolume > 0 ? weightedSum / totalVolume : 0;
};

/**
 * Calcula el rendimiento de un token en un período
 */
export const calculatePerformance = (startPrice: number, endPrice: number): number => {
  if (startPrice === 0) return 0;
  return ((endPrice - startPrice) / startPrice) * 100;
};

/**
 * Calcula la correlación entre dos series de precios
 */
export const calculateCorrelation = (prices1: number[], prices2: number[]): number => {
  if (prices1.length !== prices2.length || prices1.length < 2) return 0;
  
  const n = prices1.length;
  const mean1 = prices1.reduce((sum, price) => sum + price, 0) / n;
  const mean2 = prices2.reduce((sum, price) => sum + price, 0) / n;
  
  let numerator = 0;
  let sumSq1 = 0;
  let sumSq2 = 0;
  
  for (let i = 0; i < n; i++) {
    const diff1 = prices1[i] - mean1;
    const diff2 = prices2[i] - mean2;
    
    numerator += diff1 * diff2;
    sumSq1 += diff1 * diff1;
    sumSq2 += diff2 * diff2;
  }
  
  const denominator = Math.sqrt(sumSq1 * sumSq2);
  return denominator === 0 ? 0 : numerator / denominator;
};

/**
 * Calcula el índice de dominancia de un token
 */
export const calculateDominance = (tokenMarketCap: number, totalMarketCap: number): number => {
  if (totalMarketCap === 0) return 0;
  return (tokenMarketCap / totalMarketCap) * 100;
};

/**
 * Calcula el ratio de Sharpe (simplificado)
 */
export const calculateSharpeRatio = (returns: number[], riskFreeRate: number = 0): number => {
  if (returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const excessReturn = avgReturn - riskFreeRate;
  
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length;
  const volatility = Math.sqrt(variance);
  
  return volatility === 0 ? 0 : excessReturn / volatility;
};

/**
 * Calcula el máximo drawdown de una serie de precios
 */
export const calculateMaxDrawdown = (prices: number[]): number => {
  if (prices.length === 0) return 0;
  
  let maxPrice = prices[0];
  let maxDrawdown = 0;
  
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > maxPrice) {
      maxPrice = prices[i];
    } else {
      const drawdown = ((maxPrice - prices[i]) / maxPrice) * 100;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
  }
  
  return maxDrawdown;
};
