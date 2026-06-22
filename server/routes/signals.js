const express = require('express');
const db = require('../db/pool');
const ragClient = require('../ai/ragClient');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM signals ORDER BY created_at DESC LIMIT 50'
    );
    res.json({ signals: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:pair', async (req, res) => {
  try {
    const { pair } = req.params;
    const result = await db.query(
      'SELECT * FROM signals WHERE pair = $1 ORDER BY created_at DESC LIMIT 20',
      [pair]
    );
    res.json({ signals: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/generate', async (req, res) => {
  try {
    const { pair, price } = req.body;
    const signal = await ragClient.getSignal({
      pair,
      price,
      rsi: Math.floor(Math.random() * 100),
      macd: Math.random() - 0.5,
      bb: 'mid'
    });

    await db.query(
      'INSERT INTO signals (pair, signal, confidence, reasoning) VALUES ($1, $2, $3, $4)',
      [pair, signal.action, signal.confidence, signal.reasoning]
    );

    res.json(signal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
