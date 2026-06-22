const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/trading'
});

pool.on('error', (err) => console.error('Unexpected pool error:', err));

module.exports = pool;
