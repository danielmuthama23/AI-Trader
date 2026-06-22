const axios = require('axios');
const redis = require('../db/redis');

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_KEY;
const PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD', 'US30', 'NAS100', 'OIL/USD'];

const BASE_PRICES = {
  'EUR/USD': 1.08542,
  'GBP/USD': 1.27381,
  'USD/JPY': 149.842,
  'XAU/USD': 2341.50,
  'BTC/USD': 67420.0,
  'US30': 38950.0,
  'NAS100': 17820.0,
  'OIL/USD': 78.42
};

async function fetchPrices() {
  for (const pair of PAIRS) {
    try {
      // Simulate price with small random movement
      const basePrice = BASE_PRICES[pair];
      const change = (Math.random() - 0.5) * basePrice * 0.001;
      const newPrice = basePrice + change;

      // Cache price
      await redis.setex(`price:${pair}`, 300, newPrice.toString());
      console.log(`📊 ${pair}: ${newPrice.toFixed(5)}`);
    } catch (error) {
      console.error(`Price fetch error for ${pair}:`, error.message);
    }
  }
}

function startPriceFeed(callback) {
  // Fetch prices every 3 seconds
  const interval = setInterval(async () => {
    try {
      await fetchPrices();

      // Emit tick via callback
      for (const pair of PAIRS) {
        const price = await redis.get(`price:${pair}`);
        if (price && callback) {
          callback({
            symbol: pair,
            price: parseFloat(price),
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Price feed error:', error);
    }
  }, 3000);

  return interval;
}

module.exports = { startPriceFeed, fetchPrices };
