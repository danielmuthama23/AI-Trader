-- Initialize PostgreSQL database schema

CREATE TABLE IF NOT EXISTS signals (
  id SERIAL PRIMARY KEY,
  pair VARCHAR(20) NOT NULL,
  signal VARCHAR(10) NOT NULL CHECK (signal IN ('BUY', 'SELL', 'HOLD')),
  confidence INT CHECK (confidence >= 0 AND confidence <= 100),
  reasoning TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_pair_time (pair, created_at)
);

CREATE TABLE IF NOT EXISTS trades (
  id SERIAL PRIMARY KEY,
  pair VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('BUY', 'SELL')),
  entry_price DECIMAL(20, 5) NOT NULL,
  exit_price DECIMAL(20, 5),
  pnl DECIMAL(20, 2),
  strategy VARCHAR(50),
  confidence INT CHECK (confidence >= 0 AND confidence <= 100),
  mt4_ticket INT,
  hedera_txid VARCHAR(100),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP,
  INDEX idx_pair_status (pair, status),
  INDEX idx_created_at (created_at)
);

CREATE TABLE IF NOT EXISTS alerts (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_history (
  id SERIAL PRIMARY KEY,
  user_message TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_created_at (created_at)
);

-- Insert sample broker data (optional)
CREATE TABLE IF NOT EXISTS brokers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  type VARCHAR(50),
  min_deposit INT,
  spread DECIMAL(5, 2),
  leverage INT,
  regulation TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO brokers (name, type, min_deposit, spread, leverage, regulation) VALUES
('IC Markets', 'ECN/STP', 200, 0.0, 500, ARRAY['ASIC', 'CySEC']),
('Pepperstone', 'ECN', 200, 0.0, 500, ARRAY['ASIC', 'FCA']),
('OANDA', 'Market Maker', 0, 1.2, 50, ARRAY['FCA', 'NFA'])
ON CONFLICT (name) DO NOTHING;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
