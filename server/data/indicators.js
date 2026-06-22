// Technical indicators calculation

function calculateRSI(prices, period = 14) {
  if (prices.length < period + 1) return 50;

  let gains = 0, losses = 0;
  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses += Math.abs(change);
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  const rs = avgGain / (avgLoss || 1);
  return 100 - (100 / (1 + rs));
}

function calculateMACD(prices, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (prices.length < slowPeriod) return { macd: 0, signal: 0, histogram: 0 };

  const emaFast = calculateEMA(prices, fastPeriod);
  const emaSlow = calculateEMA(prices, slowPeriod);
  const macd = emaFast - emaSlow;

  // Simplified signal line
  const signal = macd * 0.9;
  return { macd, signal, histogram: macd - signal };
}

function calculateEMA(prices, period) {
  if (prices.length === 0) return 0;
  const multiplier = 2 / (period + 1);
  let ema = prices[0];
  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * multiplier + ema * (1 - multiplier);
  }
  return ema;
}

function calculateBollingerBands(prices, period = 20, stdDev = 2) {
  if (prices.length < period) return { upper: 0, middle: 0, lower: 0 };

  const slice = prices.slice(-period);
  const sma = slice.reduce((a, b) => a + b) / period;
  const variance = slice.reduce((a, b) => a + Math.pow(b - sma, 2)) / period;
  const std = Math.sqrt(variance);

  return {
    upper: sma + std * stdDev,
    middle: sma,
    lower: sma - std * stdDev
  };
}

function calculateATR(highs, lows, closes, period = 14) {
  if (highs.length < period) return 0;
  let tr = 0;
  for (let i = 0; i < period; i++) {
    const h = highs[highs.length - period + i];
    const l = lows[lows.length - period + i];
    const c = closes[closes.length - period + i - 1] || l;
    tr += Math.max(h - l, Math.abs(h - c), Math.abs(l - c));
  }
  return tr / period;
}

module.exports = {
  calculateRSI,
  calculateMACD,
  calculateEMA,
  calculateBollingerBands,
  calculateATR
};
