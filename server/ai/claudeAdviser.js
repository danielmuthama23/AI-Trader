const Anthropic = require("@anthropic-ai/sdk");
const { HederaLogger } = require("../blockchain/hedera");
const { sendAlertEmail } = require("../alerts/email");

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const hedera = new HederaLogger();

const MCP_TOOLS = [
  { name: "get_live_price", description: "Get real-time price", inputSchema: { type: "object", properties: { symbol: { type: "string" } }, required: ["symbol"] } },
  { name: "get_indicators", description: "Get RSI/MACD/BB",    inputSchema: { type: "object", properties: { symbol: { type: "string" } }, required: ["symbol"] } },
  { name: "query_rag",      description: "Query knowledge base",inputSchema: { type: "object", properties: { query:  { type: "string" } }, required: ["query"]  } },
];

async function askAdviser(message, context) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6", max_tokens: 1000, tools: MCP_TOOLS,
    messages: [{ role: "user", content: `Expert AI trading adviser.\nContext: ${JSON.stringify(context)}\nQuestion: ${message}\nProvide actionable advice: signal, entry, SL, TP, confidence %, strategy.` }],
  });
  const text = response.content.filter(b => b.type === "text").map(b => b.text).join("\n");
  await hedera.logDecision({ message, response: text, timestamp: Date.now() });
  if (text.toLowerCase().includes("strong buy") || text.toLowerCase().includes("strong sell"))
    await sendAlertEmail({ subject: "High Confidence Signal", body: text });
  return text;
}

async function analyzeAndSignal(marketData) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6", max_tokens: 300,
    messages: [{ role: "user", content: `Analyze tick, return ONLY JSON:\n${JSON.stringify(marketData)}\nJSON: {"action":"BUY|SELL|HOLD","confidence":0-100,"sl":0,"tp":0,"reasoning":"...","strategy":"..."}` }],
  });
  return JSON.parse(response.content[0].text.replace(/```json|```/g, "").trim());
}

module.exports = { askAdviser, analyzeAndSignal };
