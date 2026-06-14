CREATE TABLE IF NOT EXISTS trades (
  id          SERIAL PRIMARY KEY,
  pair        VARCHAR(20), type VARCHAR(10), entry_price NUMERIC(18,5),
  exit_price  NUMERIC(18,5), lot_size NUMERIC(10,2), pnl NUMERIC(12,2),
  strategy    VARCHAR(50), confidence INT, ai_signal VARCHAR(10),
  result      VARCHAR(10), hedera_tx VARCHAR(100), mt_ticket INT,
  opened_at   TIMESTAMPTZ DEFAULT NOW(), closed_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS signals (
  id          SERIAL PRIMARY KEY, pair VARCHAR(20), action VARCHAR(10),
  confidence  INT, sl NUMERIC(18,5), tp NUMERIC(18,5),
  reasoning   TEXT, strategy VARCHAR(50), created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS alert_subscribers (
  id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE, active BOOLEAN DEFAULT TRUE, created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX ON trades(pair);
CREATE INDEX ON signals(pair, created_at DESC);
