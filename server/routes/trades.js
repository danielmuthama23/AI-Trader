const express = require('express');
const db = require('../db/pool');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { pair, limit = 20 } = req.query;
    let query = 'SELECT * FROM trades';
    let params = [];
    if (pair) {
      query += ' WHERE pair = $1';
      params.push(pair);
    }
    query += ` ORDER BY created_at DESC LIMIT ${limit}`;
    const result = await db.query(query, params);
    res.json({ trades: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COUNT(*) as total_trades,
        SUM(CASE WHEN pnl > 0 THEN 1 ELSE 0 END)::float / COUNT(*) * 100 as win_rate,
        SUM(pnl) as total_pnl,
        AVG(confidence) as avg_confidence
      FROM trades
      WHERE status = 'closed'
    `);
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { pair, type, entry_price, strategy, confidence } = req.body;
    const result = await db.query(
      'INSERT INTO trades (pair, type, entry_price, strategy, confidence, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [pair, type, entry_price, strategy, confidence, 'open']
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id/close', async (req, res) => {
  try {
    const { id } = req.params;
    const { exit_price } = req.body;
    const result = await db.query(
      'UPDATE trades SET exit_price = $1, pnl = exit_price - entry_price, status = $2, closed_at = NOW() WHERE id = $3 RETURNING *',
      [exit_price, 'closed', id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
