const express = require('express');

const router = express.Router();

const BROKERS = [
  {
    id: 1,
    name: 'IC Markets',
    type: 'ECN/STP',
    minDeposit: 200,
    spread: 0.0,
    leverage: 500,
    regulation: ['ASIC', 'CySEC']
  },
  {
    id: 2,
    name: 'Pepperstone',
    type: 'ECN',
    minDeposit: 200,
    spread: 0.0,
    leverage: 500,
    regulation: ['ASIC', 'FCA']
  },
  {
    id: 3,
    name: 'OANDA',
    type: 'Market Maker',
    minDeposit: 0,
    spread: 1.2,
    leverage: 50,
    regulation: ['FCA', 'NFA']
  }
];

router.get('/', (req, res) => {
  res.json({ brokers: BROKERS });
});

router.get('/:id', (req, res) => {
  const broker = BROKERS.find(b => b.id === parseInt(req.params.id));
  if (!broker) return res.status(404).json({ error: 'Broker not found' });
  res.json(broker);
});

router.get('/best/:type', (req, res) => {
  const filtered = BROKERS.filter(b => b.type.includes(req.params.type));
  res.json({ brokers: filtered });
});

module.exports = router;
