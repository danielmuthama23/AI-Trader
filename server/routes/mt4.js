const express = require('express');
const { analyzeAndSignal } = require('../ai/claudeAdviser');
const hedera = require('../blockchain/hedera');

const router = express.Router();

router.post('/signal', async (req, res) => {
  try {
    const signal = await analyzeAndSignal(req.body);
    signal.timestamp = new Date().toISOString();
    res.json(signal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', (req, res) => {
  res.json({ status: 'ok', bridge: 'MT4/MT5 ZeroMQ Bridge Active' });
});

router.post('/close-all', async (req, res) => {
  try {
    await hedera.logDecision({
      type: 'CLOSE_ALL_ORDERS',
      timestamp: Date.now()
    });
    res.json({ status: 'Emergency close initiated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
