const db = require('./pool');

const migrations = [
  {
    name: '001_create_signals_table',
    sql: `
      CREATE TABLE IF NOT EXISTS signals (
        id SERIAL PRIMARY KEY,
        pair VARCHAR(20) NOT NULL,
        signal VARCHAR(10) NOT NULL,
        confidence INT CHECK (confidence >= 0 AND confidence <= 100),
        reasoning TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        INDEX idx_pair_time (pair, created_at)
      );
    `
  },
  {
    name: '002_create_trades_table',
    sql: `
      CREATE TABLE IF NOT EXISTS trades (
        id SERIAL PRIMARY KEY,
        pair VARCHAR(20) NOT NULL,
        type VARCHAR(10) NOT NULL,
        entry_price DECIMAL(20, 5) NOT NULL,
        exit_price DECIMAL(20, 5),
        pnl DECIMAL(20, 2),
        strategy VARCHAR(50),
        confidence INT,
        mt4_ticket INT,
        hedera_txid VARCHAR(100),
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW(),
        closed_at TIMESTAMP,
        INDEX idx_pair_status (pair, status)
      );
    `
  },
  {
    name: '003_create_alerts_table',
    sql: `
      CREATE TABLE IF NOT EXISTS alerts (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        subscribed BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `
  },
  {
    name: '004_create_chat_history_table',
    sql: `
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_message TEXT NOT NULL,
        assistant_response TEXT NOT NULL,
        context JSONB,
        created_at TIMESTAMP DEFAULT NOW(),
        INDEX idx_created_at (created_at)
      );
    `
  }
];

async function runMigrations() {
  console.log('🔧 Running database migrations...');
  try {
    for (const migration of migrations) {
      try {
        await db.query(migration.sql);
        console.log(`✓ ${migration.name}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⊘ ${migration.name} (table exists)`);
        } else {
          throw error;
        }
      }
    }
    console.log('✓ All migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

module.exports = { runMigrations };
