const Anthropic = require('@anthropic-ai/sdk');
const axios = require('axios');

const client = new Anthropic();

const TOOLS = [
  {
    name: 'get_live_price',
    description: 'Get current price for a trading pair',
    input_schema: {
      type: 'object',
      properties: {
        pair: { type: 'string', description: 'Trading pair (e.g., EUR/USD)' }
      },
      required: ['pair']
    }
  },
  {
    name: 'get_indicators',
    description: 'Get technical indicators for a pair',
    input_schema: {
      type: 'object',
      properties: {
        pair: { type: 'string' }
      },
      required: ['pair']
    }
  },
  {
    name: 'query_rag',
    description: 'Query RAG knowledge base for trading patterns',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        topK: { type: 'number' }
      },
      required: ['query']
    }
  }
];

async function askAdviser(message, context) {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      tools: TOOLS,
      messages: [{
        role: 'user',
        content: `You are a professional trading adviser. Market context:\n${JSON.stringify(context)}\n\nUser question: ${message}`
      }]
    });
    
    return response.content[0]?.text || 'Unable to generate response';
  } catch (error) {
    console.error('Claude API error:', error);
    return `Error: ${error.message}`;
  }
}

async function analyzeAndSignal(marketData) {
  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: `Analyze this market data and generate a trading signal. Return JSON only:\n${JSON.stringify(marketData)}\n\nReturn: {"action":"BUY|SELL|HOLD","confidence":0-100,"sl":0,"tp":0,"reasoning":"...","strategy":"..."}`
      }]
    });
    
    const text = response.content[0]?.text || '{"action":"HOLD","confidence":50}';
    return JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
  } catch (error) {
    console.error('Signal generation error:', error);
    return { action: 'HOLD', confidence: 0, reasoning: error.message };
  }
}

module.exports = { askAdviser, analyzeAndSignal };
