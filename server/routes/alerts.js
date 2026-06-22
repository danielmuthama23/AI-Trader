const express = require('express');
const emailService = require('../alerts/email');
const db = require('../db/pool');

const router = express.Router();

router.post('/config', async (req, res) => {
  try {
    const { email } = req.body;
    await db.query(
      'INSERT INTO alerts (email) VALUES ($1) ON CONFLICT (email) DO UPDATE SET subscribed = TRUE',
      [email]
    );
    await emailService.subscribeEmail(email);
    res.json({ status: 'subscribed', email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/config', async (req, res) => {
  try {
    const { email } = req.body;
    await db.query(
      'UPDATE alerts SET subscribed = FALSE WHERE email = $1',
      [email]
    );
    await emailService.unsubscribeEmail(email);
    res.json({ status: 'unsubscribed', email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/test', async (req, res) => {
  try {
    const { email } = req.body;
    await emailService.sendTestAlert(email);
    res.json({ status: 'test email sent', email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.module = router;
