const express = require('express');
const { askAdviser } = require('../ai/claudeAdviser');
const db = require('../db/pool');
const ragClient = require('../ai/ragClient');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;

    // Get RAG context
    const ragContext = await ragClient.query(message, 5);

    // Ask Claude
    const response = await askAdviser(message, { ...context, ragContext });

    // Store in chat history
    await db.query(
      'INSERT INTO chat_history (user_message, assistant_response, context) VALUES ($1, $2, $3)',
      [message, response, JSON.stringify(context)]
    );

    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM chat_history ORDER BY created_at DESC LIMIT 20'
    );
    res.json({ history: result.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
