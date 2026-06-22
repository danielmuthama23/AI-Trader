const { analyzeAndSignal } = require('./claudeAdviser');
const { logDecision } = require('../blockchain/hedera');
const db = require('../db/pool');
const redis = require('../db/redis');

const PAIRS = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'XAU/USD', 'BTC/USD', 'US30', 'NAS100', 'OIL/USD'];

async function scanAndGenerateSignals(io) {
  for (const pair of PAIRS) {
    try {
      // Get current price from cache
      const cachedPrice = await redis.get(`price:${pair}`);
      if (!cachedPrice) continue;

      const marketData = {
        pair,
        price: parseFloat(cachedPrice),
        rsi: Math.floor(Math.random() * 100),
        macd: Math.random() - 0.5,
        bb: ['Upper', 'Mid', 'Lower'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toISOString()
      };

      // Generate signal via Claude
      const signal = await analyzeAndSignal(marketData);
      signal.pair = pair;
      signal.timestamp = new Date().toISOString();

      // Log to database
      await db.query(
        `INSERT INTO signals (pair, signal, confidence, reasoning, created_at) 
         VALUES ($1, $2, $3, $4, NOW())`,
        [pair, signal.action, signal.confidence, signal.reasoning]
      );

      // Log to Hedera
      if (signal.confidence >= 70) {
        await logDecision({
          type: 'AI_SIGNAL',
          ...signal
        });
      }

      // Broadcast via WebSocket
      io.emit('signal', signal);
      console.log(`Signal generated: ${pair} - ${signal.action} (${signal.confidence}%)`);
    } catch (error) {
      console.error(`Error scanning ${pair}:`, error);
    }
  }
}

module.exports = { scanAndGenerateSignals };
