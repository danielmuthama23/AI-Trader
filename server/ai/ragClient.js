const axios = require('axios');

const RAG_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8001';

class RAGClient {
  async query(queryText, topK = 5) {
    try {
      const response = await axios.post(`${RAG_SERVICE_URL}/rag/query`, {
        query: queryText,
        top_k: topK
      });
      return response.data.result || [];
    } catch (error) {
      console.error('RAG query error:', error.message);
      return [];
    }
  }

  async ingestTrades(trades) {
    try {
      const documents = trades.map(t => ({
        content: `Trade ${t.id}: ${t.pair} ${t.type} → ${t.result} | P&L: ${t.pnl} | Strategy: ${t.strategy} | Confidence: ${t.confidence}%`,
        metadata: { pair: t.pair, result: t.result, strategy: t.strategy }
      }));

      const response = await axios.post(`${RAG_SERVICE_URL}/rag/ingest`, {
        documents
      });
      console.log('Trades ingested to RAG:', documents.length);
      return response.data;
    } catch (error) {
      console.error('RAG ingest error:', error.message);
    }
  }

  async getSignal(marketData) {
    try {
      const response = await axios.post(`${RAG_SERVICE_URL}/signal`, marketData);
      return response.data;
    } catch (error) {
      console.error('Signal generation error:', error.message);
      return { action: 'HOLD', confidence: 0 };
    }
  }
}

module.exports = new RAGClient();
