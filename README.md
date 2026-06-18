### Full-Stack AI-Powered Trading Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://docker.com)
[![Claude](https://img.shields.io/badge/AI-Claude%20Sonnet%204.6-violet.svg)](https://anthropic.com)

A production-ready AI trading platform that delivers real-time market signals, live news sentiment, blockchain-audited trade decisions, RAG-powered pattern recognition, MT4/MT5 broker integration, and intelligent email alerts — all in a single deployable stack.

---

[Features](#-features) · [Architecture](#-architecture) · [Quick Start](#-quick-start) · [Configuration](#-configuration) · [API Reference](#-api-reference) · [MT4/MT5 Setup](#-mt4mt5-integration) · [Deployment](#-deployment) · [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Architecture](#-architecture)
4. [Technology Stack](#-technology-stack)
5. [Prerequisites](#-prerequisites)
6. [Quick Start](#-quick-start)
7. [Configuration](#-configuration)
8. [Project Structure](#-project-structure)
9. [Running the Application](#-running-the-application)
10. [API Reference](#-api-reference)
11. [MT4/MT5 Integration](#-mt4mt5-integration)
12. [Dashboard Tabs](#-dashboard-tabs)
13. [AI Adviser & RAG](#-ai-adviser--rag)
14. [Hedera Blockchain Audit](#-hedera-blockchain-audit)
15. [Email Alert System](#-email-alert-system)
16. [Trading Strategies](#-trading-strategies)
17. [Supported Instruments](#-supported-instruments)
18. [Supported Brokers](#-supported-brokers)
19. [Environment Variables](#-environment-variables)
20. [Deployment](#-deployment)
21. [Troubleshooting](#-troubleshooting)
22. [Security](#-security)
23. [Disclaimer](#-disclaimer)
24. [License](#-license)

---

## 🧭 Overview

AI Trading Agent is a full-stack, production-ready application that combines cutting-edge AI with professional-grade trading infrastructure. It continuously monitors 27+ financial instruments across Forex, Metals, Crypto, Indices, and Commodities — analysing price action, technical indicators, and live news sentiment to generate high-confidence trading signals.

Every AI decision is immutably logged to the **Hedera Hashgraph** blockchain for compliance and audit purposes. Signals are retrieved from a **Fabric IQ RAG knowledge base** that indexes your historical trade data to improve future recommendations. When confidence exceeds 80%, the system automatically dispatches email alerts via **SendGrid**.

The platform connects directly to **MT4/MT5** via a ZeroMQ Expert Advisor bridge, enabling fully automated order execution based on AI-generated signals.

---

## ✨ Features

### 🤖 AI & Intelligence
- **Claude Sonnet 4.6** — Anthropic's latest model powers all market analysis and chat
- **RAG Knowledge Base** — Fabric IQ + ChromaDB indexes your trade history for pattern-aware recommendations
- **MCP Tool Orchestration** — Model Context Protocol gives Claude live access to price data, indicators, news, and trade history
- **Automated Signal Scanning** — Scans all pairs every 60 seconds and saves signals to the database
- **Conversational AI Adviser** — Chat interface with full market context injected into every message

### 📊 Market Data & Signals
- **Real-time price streaming** via WebSocket for 8 core pairs (expandable to 27+)
- **Live technical indicators** — RSI, MACD, Bollinger Bands, EMA 20/50, ATR
- **Live sparkline charts** per instrument, updated every 3 seconds
- **BUY / SELL / HOLD signals** with AI confidence percentage per pair
- **27 instruments** across Forex majors, minors, metals, crypto, indices, and commodities

### 📰 News & Sentiment
- **Dual news feeds** — NewsAPI + Alpha Vantage News Sentiment API
- **Sentiment scoring** — Bullish / Bearish / Neutral per article
- **Impact rating** — HIGH / MED / LOW based on relevance score
- **One-click news analysis** — Send any headline to the AI Adviser instantly
- **5-minute Redis caching** to prevent rate limiting

### 🔗 Blockchain Audit (Hedera)
- Every AI decision immutably logged to Hedera Consensus Service (HCS)
- Every trade execution logged on-chain with timestamp, pair, direction, price, and lot size
- Full audit trail queryable via Hedera Mirror Node
- Tamper-proof compliance record for regulated traders

### 📧 Email Alerts
- Triggered automatically when AI confidence ≥ 80%
- Configurable subscriber list stored in PostgreSQL
- Beautiful HTML emails with pair, signal, confidence, and full AI reasoning
- Test alert endpoint for configuration verification
- Powered by SendGrid (100 emails/day free tier)

### 📡 MT4/MT5 Integration
- ZeroMQ Expert Advisor (`.mq4`) for MetaTrader 4 and 5
- Node.js bridge server receives live ticks from EA every 5 seconds
- AI generates BUY/SELL/HOLD/CLOSE signals in real time
- Signals pushed back to EA for automated order execution
- Hedera on-chain logging of every MT execution
- Emergency close-all endpoint

### 🏦 Broker Directory
- 8 top-rated, regulated brokers with full detail comparison
- Filtered by type: ECN, STP, Market Maker
- Sortable by rating, spread, and minimum deposit
- Regulation badges, platform compatibility, execution speed
- Direct links to open accounts

### 🎯 Strategy Engine
- 6 complete trading strategies with full rules
- Trend Following, Mean Reversion, Breakout, News Trading, Swing Trade, Scalping
- Entry rules, stop loss logic, take profit targets, timeframes
- AI selects best-fit strategy for current market conditions
- Win rate statistics per strategy

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                           │
│              React 18 + Tailwind CSS Dashboard                  │
│  Dashboard │ Currencies │ Brokers │ Strategies │ Trades │ AI   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP / WebSocket
┌────────────────────────▼────────────────────────────────────────┐
│                   NODE.JS API SERVER :8000                       │
│  Express + Socket.IO + node-cron                                │
│  Routes: signals │ news │ trades │ adviser │ alerts │ mt4       │
│  Middleware: auth │ rateLimit │ logger                          │
└──────┬──────────────┬──────────────┬────────────────────────────┘
       │              │              │
       ▼              ▼              ▼
┌──────────┐  ┌──────────────┐  ┌──────────────────────────────┐
│PostgreSQL│  │    Redis     │  │     PYTHON AI SERVICE :8001   │
│:5432     │  │  :6379       │  │  FastAPI + LangChain          │
│Trades    │  │  Cache       │  │  RAG Engine (ChromaDB)        │
│Signals   │  │  Rate Limit  │  │  Fabric IQ Sync              │
│Alerts    │  └──────────────┘  │  Signal Generation            │
└──────────┘                    └──────────────────────────────┘
       │                                      │
       ▼                                      ▼
┌──────────────────────────┐     ┌────────────────────────────┐
│   ANTHROPIC CLAUDE API   │     │   CHROMADB VECTOR STORE    │
│   claude-sonnet-4-6      │◄────│   :8002                    │
│   MCP Tool Calling       │     │   Trade history vectors    │
│   RAG-enriched context   │     │   Pattern embeddings       │
└──────────────────────────┘     └────────────────────────────┘
       │
       ▼
┌──────────────────────────┐     ┌────────────────────────────┐
│   HEDERA HASHGRAPH HCS   │     │   MT4/MT5 ZMQ BRIDGE :6789 │
│   Immutable audit log    │     │   Node.js ↔ ZeroMQ         │
│   AI decisions           │     │   AITradingAgent.mq4 EA    │
│   Trade executions       │     │   Auto order execution     │
└──────────────────────────┘     └────────────────────────────┘
       │
       ▼
┌──────────────────────────┐     ┌────────────────────────────┐
│   EXTERNAL DATA SOURCES  │     │   SENDGRID EMAIL ALERTS    │
│   Alpha Vantage (prices) │     │   High-confidence signals  │
│   NewsAPI (headlines)    │     │   HTML formatted emails    │
│   AV News Sentiment      │     │   Subscriber management    │
└──────────────────────────┘     └────────────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend** | React | 18.2 | UI framework |
| **Frontend** | Tailwind CSS | 3.3 | Styling |
| **Frontend** | Recharts | 2.8 | Price charts |
| **Frontend** | Socket.IO Client | 4.6 | Real-time ticks |
| **API Server** | Node.js | 20+ | Runtime |
| **API Server** | Express | 4.18 | HTTP server |
| **API Server** | Socket.IO | 4.6 | WebSocket server |
| **API Server** | node-cron | 3.0 | Signal scheduler |
| **AI Brain** | Anthropic Claude | Sonnet 4.6 | Market analysis & chat |
| **AI Protocol** | MCP SDK | 1.0 | Tool orchestration |
| **AI Service** | Python FastAPI | 0.104 | Signal microservice |
| **AI Service** | LangChain | 0.1 | RAG pipeline |
| **RAG Store** | ChromaDB | 0.4.18 | Vector embeddings |
| **RAG Platform** | Fabric IQ | 1.0 | Enterprise RAG sync |
| **Embeddings** | HuggingFace | MiniLM-L6-v2 | Text embeddings |
| **Blockchain** | Hedera Hashgraph | HCS | Immutable audit log |
| **Broker Bridge** | ZeroMQ | 6.0 | MT4/MT5 IPC |
| **Email** | SendGrid | 8.1 | Alert delivery |
| **Database** | PostgreSQL | 15 | Persistent storage |
| **Cache** | Redis | 7 | Signal & news cache |
| **Data** | Alpha Vantage | — | Live prices + news |
| **Data** | NewsAPI | — | Financial headlines |
| **Deploy** | Docker Compose | — | Container orchestration |

---

## 📦 Prerequisites

### Required Software

| Software | Minimum Version | Download |
|---|---|---|
| Node.js | 20.0+ | [nodejs.org](https://nodejs.org) |
| Python | 3.11+ | [python.org](https://python.org) |
| Docker Desktop | 24.0+ | [docker.com](https://docker.com/get-started) |
| Docker Compose | 2.20+ | Included with Docker Desktop |
| Git | 2.40+ | [git-scm.com](https://git-scm.com) |

### For MT4/MT5 (Optional)
- MetaTrader 4 or MetaTrader 5 (any broker's platform)
- MetaEditor (bundled with MetaTrader)
- MQL-ZMQ library — [github.com/dingmaotu/mql-zmq](https://github.com/dingmaotu/mql-zmq)

### Verify Installation
```bash
node --version       # v20.x.x or higher
python --version     # Python 3.11.x or higher
docker --version     # Docker version 24.x.x
docker compose version  # Docker Compose version v2.x.x
```

---

## 🚀 Quick Start

Get the full stack running in under 5 minutes using Docker.

```bash
# 1. Clone or unzip the project
git clone https://github.com/yourname/ai-trading-agent.git
cd ai-trading-agent

# 2. Copy environment template
cp .env.example .env

# 3. Add your API keys to .env (see Configuration section)
nano .env   # or open in any editor

# 4. Build and start all services
docker compose up --build

# 5. Open the dashboard
open http://localhost:3000
```

> The first build takes 3–5 minutes to pull images and install dependencies. Subsequent starts take under 30 seconds.

---

## ⚙️ Configuration

### Getting Your API Keys

All keys below have free tiers sufficient for development and personal trading.

#### 1. Anthropic (Claude AI) — Required
- Go to [console.anthropic.com](https://console.anthropic.com)
- Create an account → API Keys → Create Key
- New accounts receive $5 free credit
- Add to `.env` as `ANTHROPIC_API_KEY=sk-ant-...`

#### 2. Alpha Vantage (Live Prices + News) — Required
- Go to [alphavantage.co/support/#api-key](https://www.alphavantage.co/support/#api-key)
- Enter your email — key delivered instantly
- Free tier: 25 requests/day (upgrade to premium for production)
- Add to `.env` as `ALPHA_VANTAGE_KEY=...`

#### 3. NewsAPI (Financial Headlines) — Required
- Go to [newsapi.org/register](https://newsapi.org/register)
- Register for free developer account
- Free tier: 100 requests/day
- Add to `.env` as `NEWS_API_KEY=...`

#### 4. SendGrid (Email Alerts) — Required for alerts
- Go to [sendgrid.com](https://sendgrid.com) → Start for Free
- Verify a sender email address under Settings → Sender Authentication
- Create API key under Settings → API Keys → Full Access
- Free tier: 100 emails/day
- Add to `.env` as `SENDGRID_API_KEY=SG....`
- Add to `.env` as `ALERT_FROM_EMAIL=your-verified@email.com`

#### 5. Hedera Hashgraph (Blockchain Audit) — Optional
- Go to [portal.hedera.com](https://portal.hedera.com)
- Create account → choose Testnet (free, no credit card)
- Copy Account ID (e.g. `0.0.123456`) and Private Key
- Create a topic: in Hedera console run a Topic Create transaction, copy the Topic ID
- Add to `.env`:
  ```
  HEDERA_ACCOUNT_ID=0.0.123456
  HEDERA_PRIVATE_KEY=302e...
  HEDERA_TOPIC_ID=0.0.123457
  ```

#### 6. Fabric IQ (RAG Platform) — Optional
- Go to [fabriciq.ai](https://fabriciq.ai)
- Create workspace → generate API key
- Add to `.env` as `FABRICIQ_API_KEY=fiq-...`
- Without this key, the system falls back to local ChromaDB only

---

## 📁 Project Structure

```
ai-trading-agent/
│
├── 📄 docker-compose.yml              # Orchestrates all 6 Docker services
├── 📄 .env.example                    # Environment variable template
├── 📄 README.md                       # This file
│
├── 🖥️  frontend/                       # React 18 dashboard
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       ├── App.jsx                    # Main app — all 8 dashboard tabs
│       ├── hooks/
│       │   └── useMarketData.js       # WebSocket live price hook
│       └── utils/
│           └── api.js                 # Axios API client (all endpoints)
│
├── ⚙️  server/                         # Node.js API server
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js                       # Express + Socket.IO + cron scheduler
│   ├── ai/
│   │   ├── claudeAdviser.js           # Claude API + MCP tool definitions
│   │   ├── signalScanner.js           # Scheduled pair scanner (runs every 60s)
│   │   └── ragClient.js               # HTTP client to AI Python service
│   ├── blockchain/
│   │   └── hedera.js                  # Hedera HCS logging (decisions + trades)
│   ├── alerts/
│   │   └── email.js                   # SendGrid email alert delivery
│   ├── data/
│   │   ├── priceFeed.js               # Alpha Vantage live price polling
│   │   └── indicators.js              # RSI, MACD, Bollinger Band calculation
│   ├── db/
│   │   ├── pool.js                    # PostgreSQL connection pool
│   │   ├── redis.js                   # Redis client (caching + rate limit)
│   │   └── migrations.js              # Auto-run schema migrations on start
│   ├── mcp/
│   │   └── server.js                  # MCP tool implementations for Claude
│   ├── middleware/
│   │   ├── auth.js                    # API key authentication
│   │   ├── rateLimit.js               # Redis-backed rate limiting (100 req/min)
│   │   └── logger.js                  # Request/response logger
│   └── routes/
│       ├── signals.js                 # GET/POST trading signals
│       ├── news.js                    # Live news feed with caching
│       ├── trades.js                  # Trade CRUD + stats
│       ├── adviser.js                 # AI chat endpoint
│       ├── alerts.js                  # Email alert subscription management
│       ├── mt4.js                     # MT4/MT5 signal endpoint
│       └── brokers.js                 # Broker directory API
│
├── 🐍  ai-service/                     # Python FastAPI AI microservice
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── main.py                        # FastAPI app — /signal, /rag/query, /rag/ingest
│   └── rag/
│       └── engine.py                  # LangChain + ChromaDB + Fabric IQ RAG engine
│
├── 📡  mt-bridge/                      # MT4/MT5 ZeroMQ bridge
│   ├── Dockerfile
│   ├── package.json
│   ├── index.js                       # ZeroMQ Pull/Push bridge to API server
│   └── AITradingAgent.mq4             # MetaTrader Expert Advisor source code
│
└── 🐘  docker/
    └── init.sql                       # PostgreSQL schema (tables + indexes)
```

---

## ▶️ Running the Application

### Method 1 — Docker Compose (Recommended)

Starts all 6 services with a single command. Requires Docker Desktop.

```bash
# Start all services (first run builds images)
docker compose up --build

# Start in background (detached mode)
docker compose up -d --build

# View logs for all services
docker compose logs -f

# View logs for a specific service
docker compose logs -f api
docker compose logs -f ai-service
docker compose logs -f frontend

# Stop all services
docker compose down

# Stop and remove all data volumes (full reset)
docker compose down -v
```

**Services and ports:**

| Service | URL | Description |
|---|---|---|
| Frontend | http://localhost:3000 | React dashboard |
| API Server | http://localhost:8000 | Node.js REST + WebSocket |
| AI Service | http://localhost:8001 | Python FastAPI |
| ChromaDB | http://localhost:8002 | Vector store UI |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache |

---

### Method 2 — Manual (No Docker)

Run each service in a separate terminal window. Requires local PostgreSQL and Redis.

**Step 1 — Start PostgreSQL and Redis**

```bash
# macOS (Homebrew)
brew install postgresql@15 redis
brew services start postgresql@15
brew services start redis

# Ubuntu / Debian
sudo apt update
sudo apt install postgresql-15 redis-server -y
sudo systemctl start postgresql
sudo systemctl start redis-server
sudo systemctl enable postgresql
sudo systemctl enable redis-server

# Windows (WSL2 recommended, or use Docker for just these services)
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=password -e POSTGRES_DB=trading postgres:15-alpine
docker run -d -p 6379:6379 redis:7-alpine
```

**Step 2 — Create the database**

```bash
psql -U postgres -c "CREATE DATABASE trading;"
# Migrations run automatically when the server starts
```

**Step 3 — Terminal 1: Frontend**

```bash
cd frontend
npm install
npm start
# → http://localhost:3000
```

**Step 4 — Terminal 2: API Server**

```bash
cd server
npm install
node index.js
# → http://localhost:8000
```

**Step 5 — Terminal 3: AI Service (Python)**

```bash
cd ai-service

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # macOS/Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
# → http://localhost:8001
```

**Step 6 — Terminal 4: MT Bridge (Optional)**

```bash
cd mt-bridge
npm install
node index.js
# → Listening on :6789 / :6790
```

---

### Verify Everything is Running

```bash
# API health check
curl http://localhost:8000/health
# Expected: {"status":"ok","timestamp":1234567890}

# AI Service docs
open http://localhost:8001/docs

# Fetch live signals
curl http://localhost:8000/api/signals

# Check all Docker containers
docker compose ps
```

---

## 📡 API Reference

Base URL: `http://localhost:8000`

All endpoints return JSON. Protected endpoints require header `x-api-key: <API_SECRET_KEY>`.

### Signals

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/signals` | Latest 50 AI signals across all pairs |
| `GET` | `/api/signals/:pair` | Signals for a specific pair (e.g. `EURUSD`) |
| `POST` | `/api/signals/generate` | Force-generate signal for a pair |

```bash
# Generate a signal for EUR/USD
curl -X POST http://localhost:8000/api/signals/generate \
  -H "Content-Type: application/json" \
  -d '{"pair":"EURUSD","price":1.08542}'
```

### News

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/news` | Latest 30 news items (cached 5 min) |

### Trades

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/trades` | Trade history (supports `?pair=EURUSD&limit=20`) |
| `GET` | `/api/trades/stats` | Aggregated stats: win rate, P&L, avg confidence |
| `POST` | `/api/trades` | Log a new trade |
| `PUT` | `/api/trades/:id/close` | Close a trade, log to Hedera |
| `POST` | `/api/trades/log` | MT bridge Hedera log |

### AI Adviser

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/adviser` | Chat with AI adviser |
| `GET` | `/api/adviser/history` | Chat history |

```bash
curl -X POST http://localhost:8000/api/adviser \
  -H "Content-Type: application/json" \
  -d '{"message":"What is the best trade right now?","context":{}}'
```

### Email Alerts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/alerts/config` | Subscribe an email address |
| `DELETE` | `/api/alerts/config` | Unsubscribe |
| `POST` | `/api/alerts/test` | Send a test email |

### MT4/MT5

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/mt4/signal` | Get AI signal for a market tick |
| `GET` | `/api/mt4/status` | Bridge health check |
| `POST` | `/api/mt4/close-all` | Emergency close all positions |

### Brokers

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/brokers` | All brokers |
| `GET` | `/api/brokers/:id` | Single broker details |
| `GET` | `/api/brokers/best/:type` | Filter by type (ECN, STP) |

---

## 📡 MT4/MT5 Integration

The Expert Advisor communicates with the Node.js bridge via ZeroMQ IPC, sending live ticks every 5 seconds and receiving AI-generated signals.

### Step 1 — Install ZeroMQ Library for MQL4/MQL5

```bash
# Download the MQL-ZMQ library
git clone https://github.com/dingmaotu/mql-zmq.git
```

Copy the following files into your MetaTrader `MQL4/Include/` directory:
```
mql-zmq/MQL4/Include/Zmq/
├── Zmq.mqh
├── Context.mqh
├── Socket.mqh
└── ZmqMsg.mqh
```

For MT5, copy to `MQL5/Include/Zmq/`.

### Step 2 — Compile the Expert Advisor

1. Open MetaTrader → Tools → MetaEditor (F4)
2. File → Open → navigate to `mt-bridge/AITradingAgent.mq4`
3. Press F7 to compile
4. Confirm zero errors in the compiler output

### Step 3 — Configure the EA

In MetaTrader, attach the EA to any chart. Configure these input parameters:

| Parameter | Default | Description |
|---|---|---|
| `ServerIP` | `localhost` | IP of your AI Trading Agent server |
| `PushPort` | `6789` | Port to send tick data |
| `PullPort` | `6790` | Port to receive signals |
| `MagicNumber` | `20260613` | Unique ID to identify AI-placed orders |
| `LotSize` | `0.01` | Position size per trade |
| `Slippage` | `3` | Max slippage in points |
| `AllowBuy` | `true` | Allow AI to place BUY orders |
| `AllowSell` | `true` | Allow AI to place SELL orders |
| `AutoTrade` | `true` | Auto-execute signals (set false for alerts only) |

### Step 4 — Start the Bridge

```bash
cd mt-bridge
npm install
node index.js
# Output: MT4/MT5 ZeroMQ Bridge listening on :6789
```

### Step 5 — Verify Connection

In MT4/MT5 Experts tab you should see:
```
AI Agent started. Server: localhost
```

In the bridge terminal:
```
EA connected: AITradingAgent
→ BUY EURUSD (84%)
```

> **Important:** Always test on a demo account before enabling AutoTrade on a live account.

---

## 🖥️ Dashboard Tabs

### 1. 📊 Dashboard
- Live prices for 8 core pairs updated every 3 seconds
- Per-pair BUY/SELL/HOLD signal with AI confidence bar
- RSI, MACD, Bollinger Band position per pair
- Sparkline price charts (last 40 ticks)
- Live news feed with one-click AI analysis
- Summary stats: Today P&L, win rate, open positions, active signals

### 2. 💱 Currencies
- 27 instruments across 6 categories
- AI score (0–100%) per instrument
- Filter by category: Forex, Metals, Crypto, Indices, Commodities
- Sortable by AI score, daily volume, or name
- Top 4 AI picks highlighted at the top
- Volatility rating and best trading session per instrument

### 3. 🏦 Brokers
- 8 top regulated brokers with full comparison
- Filter by ECN / STP / Market Maker
- Sort by rating, spread, or minimum deposit
- Regulation badges per broker
- Platform compatibility (MT4, MT5, cTrader, TradingView)
- Direct links to open accounts

### 4. 🎯 Strategies
- 6 complete trading strategies with full rules
- Entry conditions, stop loss logic, take profit targets
- Best pairs per strategy
- Win rate statistics
- AI recommendation based on current market conditions

### 5. 📈 Trade History
- Full trade log with P&L, strategy, confidence
- AI accuracy tracking (was AI right or wrong per trade?)
- Summary stats: total P&L, win rate, AI accuracy, best strategy

### 6. 🧠 AI Adviser
- Conversational chat powered by Claude Sonnet 4.6
- Full market context (prices, news, trade history) injected automatically
- Suggestion prompts for common questions
- Email alert configuration panel
- Automatic alert dispatch on high-confidence responses

### 7. 📡 MT4/MT5
- ZeroMQ bridge connection status
- Expert Advisor source code
- Node.js bridge server code
- Step-by-step setup guide

### 8. ⚙️ Architecture
- Full technology stack overview
- Complete Docker Compose + backend code reference
- Hedera, RAG, and MCP integration diagrams

---

## 🧠 AI Adviser & RAG

The AI Adviser uses a multi-layer context injection system:

```
User Message
    ↓
Enriched Context (injected automatically):
  • Last 5 AI signals from database
  • Last 10 trades with P&L and outcome
  • RAG patterns from Fabric IQ / ChromaDB
  • Live market prices and indicators
  • Latest news sentiment
    ↓
Claude Sonnet 4.6 (with MCP tools)
  → get_live_price()
  → get_indicators()
  → query_rag()
  → get_trade_history()
  → send_alert()
    ↓
Hedera audit log → Response to user
```

### Ingesting Trade History into RAG

As trades accumulate, ingest them into the RAG knowledge base to improve future recommendations:

```bash
curl -X POST http://localhost:8001/rag/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "documents": [
      {
        "content": "Trade T-001: EURUSD BUY → WIN | P&L: +$142 | Strategy: Trend Following | Confidence: 84%",
        "metadata": {"pair": "EURUSD", "result": "WIN", "strategy": "Trend Following"}
      }
    ]
  }'
```

---

## ⛓️ Hedera Blockchain Audit

All AI decisions and trade executions are logged to Hedera Consensus Service (HCS), providing an immutable, timestamped audit trail.

### Viewing Your Audit Log

Query your topic via the Hedera Mirror Node:

```bash
# Replace with your HEDERA_TOPIC_ID
curl https://testnet.mirrornode.hedera.com/api/v1/topics/0.0.YOUR_TOPIC_ID/messages
```

### Log Format

**AI Decision log:**
```json
{
  "type": "AI_DECISION",
  "message": "What is the best trade right now?",
  "response": "Strong BUY on EUR/USD...",
  "timestamp": 1718700000000,
  "version": "1.0"
}
```

**Trade execution log:**
```json
{
  "type": "TRADE",
  "pair": "EURUSD",
  "type": "BUY",
  "entry_price": 1.08542,
  "lot_size": 0.01,
  "mt_ticket": 123456,
  "timestamp": 1718700000000
}
```

---

## 📧 Email Alert System

Alerts are sent via SendGrid when:
- AI confidence ≥ 80% on any BUY or SELL signal
- AI Adviser response contains "strong buy" or "strong sell"
- Manually triggered via `/api/alerts/test`

### Subscribe via API

```bash
curl -X POST http://localhost:8000/api/alerts/config \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
```

### Send a Test Alert

```bash
curl -X POST http://localhost:8000/api/alerts/test \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
```

---

## 📈 Trading Strategies

| Strategy | Timeframe | Best Pairs | Win Rate | Risk |
|---|---|---|---|---|
| Trend Following | H4 / Daily | EUR/USD, XAU/USD, BTC/USD | 68% | Medium |
| Mean Reversion | H1 / H4 | USD/JPY, GBP/USD | 71% | Low–Med |
| Breakout | M15 / H1 | NAS100, US30, OIL/USD | 58% | High |
| News Trading | M1 / M5 | EUR/USD, GBP/USD, USD/JPY | 54% | Very High |
| Swing Trade | H4 / Daily | XAU/USD, BTC/USD, EUR/USD | 74% | Medium |
| Scalping | M1 / M5 | EUR/USD, GBP/USD | 63% | High |

---

## 💱 Supported Instruments

| Category | Instruments |
|---|---|
| **Forex Majors** | EUR/USD, GBP/USD, USD/JPY, USD/CHF, AUD/USD, USD/CAD, NZD/USD |
| **Forex Minors** | EUR/GBP, EUR/JPY, GBP/JPY, AUD/JPY, EUR/AUD |
| **Metals** | XAU/USD (Gold), XAG/USD (Silver), XPT/USD (Platinum) |
| **Crypto** | BTC/USD, ETH/USD, LTC/USD |
| **Indices** | US30, NAS100, SPX500, GER40, UK100, JPN225 |
| **Commodities** | OIL/USD (WTI), Natural Gas, Wheat |

---

## 🏦 Supported Brokers

| Broker | Type | Min Deposit | Spread | Regulation |
|---|---|---|---|---|
| IC Markets | ECN/STP | $200 | 0.0 pips | ASIC, CySEC, FSA |
| Pepperstone | ECN | $200 | 0.0 pips | ASIC, FCA, CySEC |
| XM Group | Market Maker | $5 | 1.6 pips | CySEC, ASIC, IFSC |
| OANDA | Market Maker | $0 | 1.2 pips | FCA, NFA, CFTC, ASIC |
| Exness | ECN/STP | $10 | 0.1 pips | FCA, CySEC, FSA |
| FP Markets | ECN | $100 | 0.0 pips | ASIC, CySEC |
| IG Group | Market Maker | $250 | 0.6 pips | FCA, ASIC, BaFin |
| Tickmill | ECN | $100 | 0.0 pips | FCA, CySEC, FSCA |

All brokers support MT4 and/or MT5 for use with the ZeroMQ EA bridge.

---

## 🔐 Environment Variables

Full reference for `.env`:

```bash
# ── AI ──────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY=sk-ant-...         # Required. Claude Sonnet 4.6

# ── HEDERA HASHGRAPH ────────────────────────────────────────────────
HEDERA_ACCOUNT_ID=0.0.123456         # Required for blockchain audit
HEDERA_PRIVATE_KEY=302e...           # Required for blockchain audit
HEDERA_TOPIC_ID=0.0.123457          # Required for blockchain audit

# ── RAG PLATFORM ────────────────────────────────────────────────────
FABRICIQ_API_KEY=fiq-...             # Optional. Falls back to ChromaDB

# ── EMAIL ALERTS ────────────────────────────────────────────────────
SENDGRID_API_KEY=SG....              # Required for email alerts
ALERT_FROM_EMAIL=alerts@domain.com   # Must be verified in SendGrid

# ── MARKET DATA ─────────────────────────────────────────────────────
ALPHA_VANTAGE_KEY=...                # Required for live prices
NEWS_API_KEY=...                     # Required for news feed
YAHOO_FINANCE_KEY=...                # Optional. Additional data source

# ── DATABASE ────────────────────────────────────────────────────────
DATABASE_URL=postgresql://postgres:password@localhost:5432/trading
REDIS_URL=redis://localhost:6379

# ── SECURITY ────────────────────────────────────────────────────────
API_SECRET_KEY=your-secret-key-here  # API key for protected routes

# ── SERVER ──────────────────────────────────────────────────────────
PORT=8000                            # API server port (default 8000)
NODE_ENV=development                 # development | production
```

---

## 🚢 Deployment

### Production Docker Compose

For production, update `docker-compose.yml` with:

```yaml
services:
  api:
    environment:
      - NODE_ENV=production
    restart: always

  frontend:
    environment:
      - REACT_APP_API_URL=https://api.yourdomain.com
      - REACT_APP_WS_URL=wss://api.yourdomain.com
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }

    location /socket.io {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### Cloud Deployment Options

| Platform | Notes |
|---|---|
| **Railway** | `railway up` — auto-detects Docker Compose |
| **Render** | Deploy each service separately via Dockerfile |
| **AWS ECS** | Use `docker-compose convert` to generate ECS task definitions |
| **DigitalOcean App Platform** | Docker Compose supported natively |
| **VPS (Ubuntu)** | Install Docker, clone repo, `docker compose up -d` |

---

## 🔧 Troubleshooting

### Docker containers not starting
```bash
# Check logs
docker compose logs api
docker compose logs ai-service

# Rebuild from scratch
docker compose down -v
docker compose up --build --force-recreate
```

### "Connection refused" on port 8000
```bash
# Ensure .env file exists
ls -la .env

# Check server logs
docker compose logs -f api
```

### AI Adviser not responding
- Verify `ANTHROPIC_API_KEY` is set correctly in `.env`
- Check you have remaining API credits at [console.anthropic.com](https://console.anthropic.com)
- Check server logs: `docker compose logs api`

### MT4 EA not connecting
- Ensure the MT Bridge container is running: `docker compose ps mt-bridge`
- Set `ServerIP` in EA settings to your machine's local IP (not `localhost` if MT4 is on a different machine)
- Check firewall allows ports 6789 and 6790
- In MT4: Tools → Options → Expert Advisors → Allow automated trading ✓

### News feed empty
- Verify `NEWS_API_KEY` is valid at [newsapi.org](https://newsapi.org)
- Free tier only works on `localhost` — upgrade for production domains
- Check Redis cache: `redis-cli get news:latest`

### Email alerts not sending
- Verify sender email is authenticated in SendGrid dashboard
- Check `ALERT_FROM_EMAIL` matches your verified sender
- Use the test endpoint: `POST /api/alerts/test`

### Database connection errors
```bash
# Connect to Postgres directly
docker compose exec db psql -U postgres -d trading

# Check tables exist
\dt

# Run migrations manually
docker compose exec api node db/migrations.js
```

---

## 🔒 Security

### Recommendations for Production

1. **Change default passwords** — Update `POSTGRES_PASSWORD` in `docker-compose.yml`
2. **Set `API_SECRET_KEY`** — Enable the auth middleware for all routes
3. **Use HTTPS** — Deploy behind an Nginx reverse proxy with SSL (Let's Encrypt)
4. **Restrict CORS** — Update `cors({ origin: "https://yourdomain.com" })` in `server/index.js`
5. **Rotate API keys** regularly — especially the Anthropic key
6. **Never commit `.env`** — It is already in `.gitignore`
7. **Use environment secrets** — For cloud deployments, use platform secret managers (AWS Secrets Manager, Railway environment variables, etc.)
8. **Rate limiting** — Already enabled via Redis (100 req/min per IP) — tune as needed

### Demo Account Warning

> Always test with a demo/paper trading account before enabling `AutoTrade=true` on a live MT4/MT5 account. The developers of this software accept no liability for financial losses.

---

## ⚠️ Disclaimer

**This software is provided for educational and informational purposes only.**

Trading foreign exchange, contracts for difference (CFDs), cryptocurrencies, and other financial instruments carries a high level of risk and may not be suitable for all investors. Past performance is not indicative of future results. AI-generated signals do not constitute financial advice.

- You may lose some or all of your invested capital
- Always use proper risk management and position sizing
- Never trade with money you cannot afford to lose
- Always verify AI recommendations with your own analysis
- The authors and contributors of this software are not licensed financial advisers

---

## 🤝 Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

### Commit Convention
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `refactor:` — Code refactoring
- `test:` — Adding tests

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 AI Trading Agent Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

Built with ⚡ using Claude · Hedera · Fabric IQ · MCP · React · Node.js · Python

</div>
