# AI Trading Agent

Full-stack AI-powered trading dashboard with real-time market analysis, signal generation, MT4/MT5 integration, Hedera audit logging, and email alerts.

## Stack
- **Frontend**: React 18 + Tailwind CSS
- **API**: Node.js + Express
- **AI Service**: Python FastAPI + LangChain
- **AI Brain**: Claude Sonnet 4.6 (Anthropic)
- **RAG**: Fabric IQ + ChromaDB
- **Blockchain**: Hedera Hashgraph (HCS)
- **MT4/MT5**: ZeroMQ Expert Advisor bridge
- **Alerts**: SendGrid
- **DB**: PostgreSQL + Redis
- **Deploy**: Docker Compose

## Quick Start
```bash
cp .env.example .env
# Fill in your API keys
docker-compose up --build
```

Open http://localhost:3000

## MT4/MT5 Setup
1. Copy `mt-bridge/AITradingAgent.mq4` into MetaEditor
2. Install ZeroMQ library (Zmq.mqh)
3. Attach EA to chart, set ServerAddress to your machine IP
4. Start bridge: `cd mt-bridge && node index.js`
# AI-Trader
