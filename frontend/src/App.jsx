import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// ARCHITECTURE OVERVIEW (rendered in About tab)
// ============================================================
const ARCHITECTURE = {
  core: [
    { name: "Claude Sonnet 4.6", role: "AI Brain / RAG Adviser", icon: "🧠", desc: "Powers market analysis, signal interpretation, and trade recommendations via Anthropic API" },
    { name: "MCP (Model Context Protocol)", role: "Tool Orchestration", icon: "🔗", desc: "Connects AI to live market data tools, broker APIs, and news feeds in real-time" },
    { name: "Hedera Hashgraph", role: "Trade Ledger / Audit Trail", icon: "⛓️", desc: "Immutable on-chain logging of trade decisions, signals, and AI recommendations for compliance" },
    { name: "Fabric IQ", role: "RAG Knowledge Base", icon: "📚", desc: "Indexes your historical trades, news, and market data into a retrieval-augmented knowledge base" },
    { name: "MT4/MT5 Bridge", role: "Broker Execution", icon: "📡", desc: "ZeroMQ + REST bridge connects AI decisions directly to MetaTrader for order execution" },
    { name: "EmailJS / SendGrid", role: "Alert System", icon: "📧", desc: "Real-time email alerts when AI detects high-confidence trade opportunities" },
  ],
  stack: [
    "React 18 + Tailwind CSS — Frontend Dashboard",
    "Node.js + Express — API Gateway & MCP Server",
    "Python FastAPI — AI Model Service & RAG Engine",
    "Anthropic Claude API — AI Analysis & Decision Engine",
    "Hedera SDK (JS) — Blockchain Audit Logging",
    "ChromaDB / Pinecone — Vector Store for RAG",
    "LangChain — RAG Pipeline Orchestration",
    "ZeroMQ (pyzmq) — MT4/MT5 Expert Advisor Bridge",
    "WebSocket — Real-time Data Streaming",
    "NewsAPI + Alpha Vantage + Yahoo Finance — Market Data",
    "SendGrid — Email Alert Delivery",
    "Redis — Signal Caching & Rate Limiting",
    "PostgreSQL — Trade History & Signal Storage",
    "Docker + Docker Compose — Full Stack Deployment",
  ],
};

// ============================================================
// BROKERS DATA
// ============================================================
const BROKERS = [
  {
    name: "IC Markets",
    logo: "🏦",
    rating: 4.9,
    type: "ECN/STP",
    minDeposit: "$200",
    spread: "0.0 pips",
    commission: "$3.50/lot",
    leverage: "1:500",
    platforms: ["MT4", "MT5", "cTrader"],
    regulation: ["ASIC", "CySEC", "FSA"],
    bestFor: "Scalping & HFT",
    features: ["Raw spreads", "Fast execution", "DMA access"],
    color: "emerald",
    badge: "Top Rated",
    pairs: 60,
    execSpeed: "< 1ms",
    affiliate: "https://www.icmarkets.com",
  },
  {
    name: "Pepperstone",
    logo: "🌶️",
    rating: 4.8,
    type: "ECN",
    minDeposit: "$200",
    spread: "0.0 pips",
    commission: "$3.50/lot",
    leverage: "1:500",
    platforms: ["MT4", "MT5", "cTrader", "TradingView"],
    regulation: ["ASIC", "FCA", "CySEC", "DFSA"],
    bestFor: "All styles",
    features: ["TradingView integration", "Smart Trader Tools", "No dealing desk"],
    color: "rose",
    badge: "Best Overall",
    pairs: 97,
    execSpeed: "< 30ms",
    affiliate: "https://www.pepperstone.com",
  },
  {
    name: "XM Group",
    logo: "✖️",
    rating: 4.7,
    type: "Market Maker",
    minDeposit: "$5",
    spread: "1.6 pips",
    commission: "None",
    leverage: "1:888",
    platforms: ["MT4", "MT5"],
    regulation: ["CySEC", "ASIC", "IFSC", "FCA"],
    bestFor: "Beginners",
    features: ["No requotes", "Micro accounts", "$30 no-deposit bonus"],
    color: "sky",
    badge: "Best for Beginners",
    pairs: 55,
    execSpeed: "< 85ms",
    affiliate: "https://www.xm.com",
  },
  {
    name: "OANDA",
    logo: "🔵",
    rating: 4.6,
    type: "Market Maker",
    minDeposit: "$0",
    spread: "1.2 pips",
    commission: "None",
    leverage: "1:50 (US) / 1:200",
    platforms: ["MT4", "OANDA Web", "TradingView"],
    regulation: ["FCA", "NFA", "CFTC", "ASIC"],
    bestFor: "US traders",
    features: ["No minimum deposit", "Advanced charting", "API trading"],
    color: "blue",
    badge: "Best for US",
    pairs: 70,
    execSpeed: "< 50ms",
    affiliate: "https://www.oanda.com",
  },
  {
    name: "Exness",
    logo: "🟢",
    rating: 4.7,
    type: "ECN/STP",
    minDeposit: "$10",
    spread: "0.1 pips",
    commission: "$3/lot",
    leverage: "1:2000",
    platforms: ["MT4", "MT5"],
    regulation: ["FCA", "CySEC", "FSA", "CBCS"],
    bestFor: "High leverage",
    features: ["Unlimited leverage", "Instant withdrawals", "Swap-free"],
    color: "green",
    badge: "Highest Leverage",
    pairs: 120,
    execSpeed: "< 25ms",
    affiliate: "https://www.exness.com",
  },
  {
    name: "FP Markets",
    logo: "🟡",
    rating: 4.6,
    type: "ECN",
    minDeposit: "$100",
    spread: "0.0 pips",
    commission: "$3/lot",
    leverage: "1:500",
    platforms: ["MT4", "MT5", "cTrader", "IRESS"],
    regulation: ["ASIC", "CySEC"],
    bestFor: "Stocks & Forex",
    features: ["10,000+ instruments", "IRESS platform", "DMA stocks"],
    color: "amber",
    badge: "Most Instruments",
    pairs: 70,
    execSpeed: "< 40ms",
    affiliate: "https://www.fpmarkets.com",
  },
  {
    name: "IG Group",
    logo: "🟣",
    rating: 4.5,
    type: "Market Maker",
    minDeposit: "$250",
    spread: "0.6 pips",
    commission: "None",
    leverage: "1:200",
    platforms: ["MT4", "IG Web", "ProRealTime"],
    regulation: ["FCA", "ASIC", "BaFin", "FINMA"],
    bestFor: "Professional traders",
    features: ["17,000+ markets", "L2 Dealer", "DMA CFDs"],
    color: "purple",
    badge: "Most Markets",
    pairs: 80,
    execSpeed: "< 60ms",
    affiliate: "https://www.ig.com",
  },
  {
    name: "Tickmill",
    logo: "🔶",
    rating: 4.5,
    type: "ECN",
    minDeposit: "$100",
    spread: "0.0 pips",
    commission: "$2/lot",
    leverage: "1:500",
    platforms: ["MT4", "MT5"],
    regulation: ["FCA", "CySEC", "FSCA", "FSA"],
    bestFor: "Low cost trading",
    features: ["Lowest commissions", "VPS hosting", "Free education"],
    color: "orange",
    badge: "Lowest Commission",
    pairs: 62,
    execSpeed: "< 20ms",
    affiliate: "https://www.tickmill.com",
  },
];

// ============================================================
// CURRENCIES / INSTRUMENTS DATA
// ============================================================
const ALL_CURRENCIES = [
  // Major Forex
  { symbol: "EUR/USD", category: "Major Forex", flag: "🇪🇺🇺🇸", pip: "0.0001", dailyVol: "$1.1T", session: "London/NY", volatility: "Medium", trending: "BUY", aiScore: 82 },
  { symbol: "GBP/USD", category: "Major Forex", flag: "🇬🇧🇺🇸", pip: "0.0001", dailyVol: "$422B", session: "London", volatility: "High", trending: "SELL", aiScore: 67 },
  { symbol: "USD/JPY", category: "Major Forex", flag: "🇺🇸🇯🇵", pip: "0.01", dailyVol: "$573B", session: "Asian/NY", volatility: "Medium", trending: "BUY", aiScore: 74 },
  { symbol: "USD/CHF", category: "Major Forex", flag: "🇺🇸🇨🇭", pip: "0.0001", dailyVol: "$243B", session: "London/NY", volatility: "Low", trending: "HOLD", aiScore: 55 },
  { symbol: "AUD/USD", category: "Major Forex", flag: "🇦🇺🇺🇸", pip: "0.0001", dailyVol: "$223B", session: "Asian", volatility: "Medium", trending: "BUY", aiScore: 71 },
  { symbol: "USD/CAD", category: "Major Forex", flag: "🇺🇸🇨🇦", pip: "0.0001", dailyVol: "$218B", session: "NY", volatility: "Medium", trending: "SELL", aiScore: 63 },
  { symbol: "NZD/USD", category: "Major Forex", flag: "🇳🇿🇺🇸", pip: "0.0001", dailyVol: "$104B", session: "Asian", volatility: "Medium", trending: "HOLD", aiScore: 51 },
  // Minor Forex
  { symbol: "EUR/GBP", category: "Minor Forex", flag: "🇪🇺🇬🇧", pip: "0.0001", dailyVol: "$102B", session: "London", volatility: "Low", trending: "HOLD", aiScore: 48 },
  { symbol: "EUR/JPY", category: "Minor Forex", flag: "🇪🇺🇯🇵", pip: "0.01", dailyVol: "$80B", session: "Asian/London", volatility: "High", trending: "BUY", aiScore: 78 },
  { symbol: "GBP/JPY", category: "Minor Forex", flag: "🇬🇧🇯🇵", pip: "0.01", dailyVol: "$69B", session: "London", volatility: "Very High", trending: "SELL", aiScore: 66 },
  { symbol: "AUD/JPY", category: "Minor Forex", flag: "🇦🇺🇯🇵", pip: "0.01", dailyVol: "$44B", session: "Asian", volatility: "High", trending: "BUY", aiScore: 72 },
  { symbol: "EUR/AUD", category: "Minor Forex", flag: "🇪🇺🇦🇺", pip: "0.0001", dailyVol: "$36B", session: "Asian/London", volatility: "Medium", trending: "HOLD", aiScore: 53 },
  // Metals
  { symbol: "XAU/USD", category: "Metals", flag: "🥇", pip: "0.01", dailyVol: "$183B", session: "24/5", volatility: "High", trending: "BUY", aiScore: 88 },
  { symbol: "XAG/USD", category: "Metals", flag: "🥈", pip: "0.001", dailyVol: "$28B", session: "24/5", volatility: "Very High", trending: "BUY", aiScore: 75 },
  { symbol: "XPT/USD", category: "Metals", flag: "⚪", pip: "0.01", dailyVol: "$4B", session: "24/5", volatility: "High", trending: "HOLD", aiScore: 58 },
  // Crypto
  { symbol: "BTC/USD", category: "Crypto", flag: "₿", pip: "1.0", dailyVol: "$28B", session: "24/7", volatility: "Very High", trending: "BUY", aiScore: 79 },
  { symbol: "ETH/USD", category: "Crypto", flag: "Ξ", pip: "0.01", dailyVol: "$12B", session: "24/7", volatility: "Very High", trending: "BUY", aiScore: 76 },
  { symbol: "LTC/USD", category: "Crypto", flag: "Ł", pip: "0.01", dailyVol: "$2B", session: "24/7", volatility: "Very High", trending: "HOLD", aiScore: 52 },
  // Indices
  { symbol: "US30", category: "Indices", flag: "🇺🇸", pip: "1.0", dailyVol: "$18B", session: "NY", volatility: "High", trending: "BUY", aiScore: 73 },
  { symbol: "NAS100", category: "Indices", flag: "🇺🇸", pip: "1.0", dailyVol: "$22B", session: "NY", volatility: "High", trending: "BUY", aiScore: 81 },
  { symbol: "SPX500", category: "Indices", flag: "🇺🇸", pip: "0.1", dailyVol: "$25B", session: "NY", volatility: "Medium", trending: "BUY", aiScore: 77 },
  { symbol: "GER40", category: "Indices", flag: "🇩🇪", pip: "1.0", dailyVol: "$9B", session: "London", volatility: "High", trending: "HOLD", aiScore: 59 },
  { symbol: "UK100", category: "Indices", flag: "🇬🇧", pip: "1.0", dailyVol: "$7B", session: "London", volatility: "Medium", trending: "BUY", aiScore: 65 },
  { symbol: "JPN225", category: "Indices", flag: "🇯🇵", pip: "1.0", dailyVol: "$11B", session: "Asian", volatility: "High", trending: "SELL", aiScore: 61 },
  // Commodities
  { symbol: "OIL/USD", category: "Commodities", flag: "🛢️", pip: "0.01", dailyVol: "$14B", session: "NY/London", volatility: "High", trending: "SELL", aiScore: 64 },
  { symbol: "NAT.GAS", category: "Commodities", flag: "⛽", pip: "0.001", dailyVol: "$5B", session: "NY", volatility: "Very High", trending: "HOLD", aiScore: 49 },
  { symbol: "WHEAT", category: "Commodities", flag: "🌾", pip: "0.25", dailyVol: "$3B", session: "NY", volatility: "High", trending: "BUY", aiScore: 67 },
];

// ============================================================
// SIMULATED REAL-TIME DATA ENGINE
// ============================================================
const PAIRS = ["EUR/USD", "GBP/USD", "USD/JPY", "XAU/USD", "BTC/USD", "US30", "NAS100", "OIL/USD"];
const STRATEGIES = ["Trend Following", "Mean Reversion", "Breakout", "Scalping", "Swing Trade", "News Trading", "Grid Strategy", "Momentum"];

function genPrice(base, spread) {
  return (base + (Math.random() - 0.5) * spread).toFixed(5);
}

const BASE_PRICES = {
  "EUR/USD": 1.08542, "GBP/USD": 1.27381, "USD/JPY": 149.842,
  "XAU/USD": 2341.50, "BTC/USD": 67420.0, "US30": 38950.0,
  "NAS100": 17820.0, "OIL/USD": 78.42,
};

function generateMarketData() {
  return PAIRS.map(pair => {
    const base = BASE_PRICES[pair];
    const spread = base * 0.003;
    const price = parseFloat(genPrice(base, spread));
    const change = ((Math.random() - 0.48) * 0.8).toFixed(3);
    const signal = Math.random() > 0.6 ? "BUY" : Math.random() > 0.5 ? "SELL" : "HOLD";
    const confidence = Math.floor(55 + Math.random() * 44);
    const rsi = Math.floor(20 + Math.random() * 70);
    const macd = ((Math.random() - 0.5) * 0.002).toFixed(5);
    const bb = Math.random() > 0.5 ? "Upper" : Math.random() > 0.5 ? "Lower" : "Mid";
    return { pair, price, change: parseFloat(change), signal, confidence, rsi, macd, bb, spread: (spread * 0.1).toFixed(5) };
  });
}

function generateNews() {
  const items = [
    { title: "Fed signals potential rate cut in Q3 2026", source: "Reuters", sentiment: "bullish", impact: "HIGH", time: "2m ago", pair: "USD" },
    { title: "ECB holds rates steady, EUR strengthens", source: "Bloomberg", sentiment: "bullish", impact: "HIGH", time: "7m ago", pair: "EUR/USD" },
    { title: "Gold surges on geopolitical tensions in Middle East", source: "FT", sentiment: "bullish", impact: "HIGH", time: "12m ago", pair: "XAU/USD" },
    { title: "Bitcoin ETF sees record $500M inflow this week", source: "CoinDesk", sentiment: "bullish", impact: "MED", time: "18m ago", pair: "BTC/USD" },
    { title: "UK inflation data disappoints, GBP under pressure", source: "BBC", sentiment: "bearish", impact: "HIGH", time: "24m ago", pair: "GBP/USD" },
    { title: "Oil inventory builds exceed estimates, WTI drops", source: "CNBC", sentiment: "bearish", impact: "MED", time: "31m ago", pair: "OIL/USD" },
    { title: "Nasdaq futures point higher ahead of FOMC minutes", source: "WSJ", sentiment: "bullish", impact: "MED", time: "45m ago", pair: "NAS100" },
    { title: "JPY weakens as BOJ maintains ultra-loose policy", source: "Nikkei", sentiment: "bearish", impact: "HIGH", time: "52m ago", pair: "USD/JPY" },
  ];
  return items;
}

function generateTrades() {
  const results = ["WIN", "WIN", "LOSS", "WIN", "WIN", "LOSS", "WIN", "WIN", "WIN", "LOSS"];
  return PAIRS.slice(0, 8).map((pair, i) => ({
    id: `TRD-${1000 + i}`,
    pair,
    type: i % 2 === 0 ? "BUY" : "SELL",
    entry: BASE_PRICES[pair],
    exit: BASE_PRICES[pair] * (1 + (Math.random() - 0.45) * 0.01),
    pnl: parseFloat(((Math.random() - 0.35) * 280).toFixed(2)),
    result: results[i],
    strategy: STRATEGIES[i % STRATEGIES.length],
    date: `2026-06-${String(13 - i).padStart(2, "0")}`,
    confidence: Math.floor(60 + Math.random() * 38),
    aiRec: results[i] === "WIN",
  }));
}

// ============================================================
// AI ADVISER — calls Claude API
// ============================================================
async function callClaudeAdviser(prompt, context) {
  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are an expert forex and financial markets trading AI adviser with deep knowledge of technical analysis, fundamental analysis, risk management, and quantitative trading.

Current Market Context:
${JSON.stringify(context, null, 2)}

User Question: ${prompt}

Respond as a professional trading adviser. Include:
1. Direct answer with specific trade recommendation if applicable
2. Key technical signals supporting your view
3. Risk level (Low/Medium/High) and suggested position sizing
4. Stop loss and take profit levels if recommending a trade
5. Best strategy to use from: ${STRATEGIES.join(", ")}
6. Confidence score (0-100%)

Keep response focused, professional, and actionable. Use bullet points.`,
        }],
      }),
    });
    const data = await res.json();
    return data.content?.[0]?.text || "Unable to get AI response at this time.";
  } catch (e) {
    return `AI Adviser temporarily unavailable. Error: ${e.message}\n\nNote: In production, this connects to Claude via MCP with real-time market data context injected automatically.`;
  }
}

// ============================================================
// COMPONENTS
// ============================================================

function Badge({ label, color }) {
  const colors = {
    BUY: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
    SELL: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
    HOLD: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
    HIGH: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    MED: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
    LOW: "bg-slate-500/20 text-slate-300 border border-slate-500/30",
    bullish: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30",
    bearish: "bg-rose-500/20 text-rose-300 border border-rose-500/30",
    WIN: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
    LOSS: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
  };
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors[label] || colors[color] || "bg-slate-700 text-slate-300"}`}>
      {label}
    </span>
  );
}

function StatCard({ label, value, sub, color = "text-white", icon }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-widest">
        <span>{icon}</span>{label}
      </div>
      <div className={`text-2xl font-black tracking-tight ${color}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500">{sub}</div>}
    </div>
  );
}

function ConfBar({ value, color = "bg-emerald-500" }) {
  return (
    <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1">
      <div className={`${color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${value}%` }} />
    </div>
  );
}

function PriceChart({ pair, history }) {
  const W = 260, H = 60;
  if (!history || history.length < 2) return null;
  const min = Math.min(...history), max = Math.max(...history);
  const range = max - min || 0.0001;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * W;
    const y = H - ((v - min) / range) * (H - 4) - 2;
    return `${x},${y}`;
  }).join(" ");
  const trend = history[history.length - 1] > history[0];
  return (
    <svg width={W} height={H} className="w-full">
      <polyline points={pts} fill="none" stroke={trend ? "#10b981" : "#f43f5e"} strokeWidth="1.5" />
    </svg>
  );
}

// ============================================================
// TABS
// ============================================================

function DashboardTab({ marketData, news, priceHistory, onAnalyze }) {
  const totalWinRate = 72;
  const todayPnL = 847.50;
  const openPositions = 3;
  const signals = marketData.filter(m => m.signal !== "HOLD").length;

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Today P&L" value={`+$${todayPnL}`} sub="6 trades closed" color="text-emerald-400" icon="💰" />
        <StatCard label="Win Rate" value={`${totalWinRate}%`} sub="Last 30 days" color="text-sky-400" icon="🎯" />
        <StatCard label="Open Pos." value={openPositions} sub="2 BUY, 1 SELL" color="text-amber-400" icon="📊" />
        <StatCard label="AI Signals" value={signals} sub="Active right now" color="text-violet-400" icon="⚡" />
      </div>

      {/* Market Grid */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Live Market Signals</h2>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {marketData.map(m => (
            <div key={m.pair} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3 hover:border-slate-600/60 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-black text-white text-sm">{m.pair}</div>
                  <div className="text-lg font-mono font-bold text-white">{m.price.toFixed(m.price > 100 ? 2 : 5)}</div>
                  <div className={`text-xs font-semibold ${m.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {m.change >= 0 ? "▲" : "▼"} {Math.abs(m.change)}%
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div><Badge label={m.signal} /></div>
                  <div className="text-xs text-slate-400">RSI {m.rsi} · BB {m.bb}</div>
                  <div className="text-xs text-slate-400">MACD {m.macd}</div>
                </div>
              </div>
              <div className="text-xs text-slate-500 mb-1">AI Confidence: {m.confidence}%</div>
              <ConfBar value={m.confidence} color={m.signal === "BUY" ? "bg-emerald-500" : m.signal === "SELL" ? "bg-rose-500" : "bg-amber-500"} />
              {priceHistory[m.pair] && <div className="mt-2"><PriceChart pair={m.pair} history={priceHistory[m.pair]} /></div>}
            </div>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Live Market News</h2>
        <div className="space-y-2">
          {news.map((n, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3 flex items-start gap-3 hover:border-slate-600/60 transition-colors">
              <div className="flex-1">
                <div className="text-sm font-semibold text-white leading-snug">{n.title}</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs text-slate-500">{n.source}</span>
                  <span className="text-xs text-slate-600">·</span>
                  <span className="text-xs text-slate-500">{n.time}</span>
                  <Badge label={n.impact} />
                  <Badge label={n.sentiment} />
                  <span className="text-xs font-mono text-slate-400">{n.pair}</span>
                </div>
              </div>
              <button
                onClick={() => onAnalyze(`Analyze this news for trading opportunity: "${n.title}" — Impact: ${n.impact}, Pair: ${n.pair}`)}
                className="text-xs text-violet-400 border border-violet-500/30 px-2 py-1 rounded-lg hover:bg-violet-500/10 transition-colors whitespace-nowrap"
              >
                AI Analyse
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StrategiesTab({ marketData }) {
  const strategies = [
    {
      name: "Trend Following",
      icon: "📈",
      desc: "Follow the dominant trend using MA crossovers and ADX. Best for trending markets with ADX > 25.",
      best: ["EUR/USD", "XAU/USD", "BTC/USD"],
      risk: "Medium",
      winRate: 68,
      timeframe: "H4 / Daily",
      indicators: ["EMA 20/50/200", "ADX > 25", "ATR for stops"],
      entry: "Enter on pullback to EMA20 in direction of trend",
      sl: "Below last swing low (BUY) / above swing high (SELL)",
      tp: "2:1 or 3:1 Risk:Reward",
      color: "emerald",
    },
    {
      name: "Mean Reversion",
      icon: "↔️",
      desc: "Trade back to mean using Bollinger Bands and RSI extremes. Best in ranging markets.",
      best: ["USD/JPY", "GBP/USD"],
      risk: "Low-Med",
      winRate: 71,
      timeframe: "H1 / H4",
      indicators: ["Bollinger Bands 2SD", "RSI < 30 or > 70", "Stochastic"],
      entry: "Enter at BB extremes when RSI confirms oversold/overbought",
      sl: "Beyond BB outer band",
      tp: "BB midline (1:1.5 R:R)",
      color: "sky",
    },
    {
      name: "Breakout Strategy",
      icon: "💥",
      desc: "Trade price breaking key support/resistance with volume confirmation.",
      best: ["NAS100", "US30", "OIL/USD"],
      risk: "High",
      winRate: 58,
      timeframe: "M15 / H1",
      indicators: ["Volume spike", "ATR breakout", "Previous highs/lows"],
      entry: "Enter on candle close beyond key level + retest",
      sl: "Inside breakout zone",
      tp: "Measured move (height of range projected)",
      color: "amber",
    },
    {
      name: "News Trading",
      icon: "📰",
      desc: "Trade high-impact news events. AI detects sentiment and direction before release.",
      best: ["EUR/USD", "GBP/USD", "USD/JPY"],
      risk: "Very High",
      winRate: 54,
      timeframe: "M1 / M5",
      indicators: ["Economic Calendar", "AI Sentiment Score", "Volatility Index"],
      entry: "Pre-position or enter on first retracement after spike",
      sl: "Tight — pre-news range midpoint",
      tp: "First major S/R level",
      color: "rose",
    },
    {
      name: "Swing Trade",
      icon: "🎢",
      desc: "Capture multi-day moves using higher timeframe confluence and Fibonacci levels.",
      best: ["XAU/USD", "BTC/USD", "EUR/USD"],
      risk: "Medium",
      winRate: 74,
      timeframe: "H4 / Daily",
      indicators: ["Fibonacci 38.2/61.8%", "HTF Structure", "Supply & Demand zones"],
      entry: "Enter at key fib retracement in direction of higher TF trend",
      sl: "Beyond the swing point being traded",
      tp: "Next major S/R or 3:1 R:R",
      color: "violet",
    },
    {
      name: "Scalping",
      icon: "⚡",
      desc: "High-frequency small gains. Best during London/NY session overlap with tight spreads.",
      best: ["EUR/USD", "GBP/USD"],
      risk: "High",
      winRate: 63,
      timeframe: "M1 / M5",
      indicators: ["Order Flow", "Level 2 data", "VWAP", "Microstructure"],
      entry: "Enter on micro-pullback in momentum direction",
      sl: "3-5 pips maximum",
      tp: "5-10 pips or 2:1 R:R",
      color: "orange",
    },
  ];

  const colorMap = {
    emerald: { border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300", bar: "bg-emerald-500" },
    sky: { border: "border-sky-500/30", badge: "bg-sky-500/20 text-sky-300", bar: "bg-sky-500" },
    amber: { border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300", bar: "bg-amber-500" },
    rose: { border: "border-rose-500/30", badge: "bg-rose-500/20 text-rose-300", bar: "bg-rose-500" },
    violet: { border: "border-violet-500/30", badge: "bg-violet-500/20 text-violet-300", bar: "bg-violet-500" },
    orange: { border: "border-orange-500/30", badge: "bg-orange-500/20 text-orange-300", bar: "bg-orange-500" },
  };

  // Find best matching strategy for current market
  const bestStrategy = marketData.reduce((best, m) => {
    if (m.signal !== "HOLD" && m.confidence > (best?.confidence || 0)) return m;
    return best;
  }, null);

  return (
    <div className="space-y-6">
      {bestStrategy && (
        <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
          <div className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1">🤖 AI Recommendation — Current Market</div>
          <div className="text-white font-semibold">Best opportunity: <span className="text-violet-300">{bestStrategy.pair}</span> — Signal: <span className="font-black">{bestStrategy.signal}</span> ({bestStrategy.confidence}% confidence)</div>
          <div className="text-sm text-slate-300 mt-1">RSI: {bestStrategy.rsi} · BB: {bestStrategy.bb} · Recommended: <strong>{bestStrategy.rsi < 35 || bestStrategy.rsi > 65 ? "Mean Reversion" : "Trend Following"}</strong></div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {strategies.map(s => {
          const c = colorMap[s.color];
          return (
            <div key={s.name} className={`bg-slate-800/60 border ${c.border} rounded-xl p-4 space-y-3`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-black text-white">{s.icon} {s.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{s.timeframe} · Risk: {s.risk}</div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.badge}`}>{s.winRate}% WR</span>
              </div>
              <p className="text-sm text-slate-300">{s.desc}</p>
              <div>
                <div className="text-xs text-slate-500 mb-1">Win Rate</div>
                <ConfBar value={s.winRate} color={c.bar} />
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div><span className="text-slate-500">Indicators:</span> {s.indicators.join(", ")}</div>
                <div><span className="text-slate-500">Entry:</span> {s.entry}</div>
                <div><span className="text-slate-500">SL:</span> {s.sl}</div>
                <div><span className="text-slate-500">TP:</span> {s.tp}</div>
              </div>
              <div className="flex flex-wrap gap-1">
                {s.best.map(p => <span key={p} className={`text-xs font-mono px-2 py-0.5 rounded ${c.badge}`}>{p}</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TradesTab({ trades }) {
  const wins = trades.filter(t => t.result === "WIN").length;
  const totalPnL = trades.reduce((sum, t) => sum + t.pnl, 0);
  const aiAccuracy = trades.filter(t => t.aiRec === (t.result === "WIN")).length / trades.length * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total P&L" value={`${totalPnL >= 0 ? "+" : ""}$${totalPnL.toFixed(2)}`} color={totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"} icon="💵" />
        <StatCard label="Win Rate" value={`${Math.round(wins / trades.length * 100)}%`} sub={`${wins}/${trades.length} trades`} color="text-sky-400" icon="🎯" />
        <StatCard label="AI Accuracy" value={`${aiAccuracy.toFixed(0)}%`} sub="AI vs outcome" color="text-violet-400" icon="🧠" />
        <StatCard label="Best Strategy" value="Swing" sub="74% win rate" color="text-amber-400" icon="🏆" />
      </div>

      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Trade History + AI Decisions</h2>
        <div className="space-y-2">
          {trades.map(t => (
            <div key={t.id} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{t.id}</span>
                    <span className="font-bold text-white text-sm">{t.pair}</span>
                    <Badge label={t.type} />
                    <Badge label={t.result} />
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{t.strategy} · {t.date}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Entry: {t.entry.toFixed(t.entry > 100 ? 2 : 5)} · Exit: {t.exit.toFixed(t.exit > 100 ? 2 : 5)}</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-black ${t.pnl >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(2)}
                  </div>
                  <div className="text-xs text-slate-500">AI: {t.confidence}% conf.</div>
                  <div className={`text-xs mt-0.5 ${t.aiRec === (t.result === "WIN") ? "text-emerald-400" : "text-rose-400"}`}>
                    {t.aiRec === (t.result === "WIN") ? "✓ AI correct" : "✗ AI wrong"}
                  </div>
                </div>
              </div>
              <ConfBar value={t.confidence} color={t.result === "WIN" ? "bg-emerald-500" : "bg-rose-500"} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIAdviserTab({ marketData, news, trades, onSendAlert }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hello! I'm your AI Trading Adviser powered by Claude, RAG (Fabric IQ), MCP tools, and Hedera audit logging.\n\nI have full context of:\n• Live market prices and signals\n• Breaking financial news\n• Your trade history and P&L\n• Technical indicators across all pairs\n\nAsk me anything — trade recommendations, risk analysis, strategy selection, market outlook, or specific pair analysis.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertEmail, setAlertEmail] = useState("");
  const messagesEndRef = useRef(null);

  const suggestions = [
    "What's the best trade right now?",
    "Analyse EUR/USD market structure",
    "Is XAU/USD still bullish?",
    "What strategy should I use today?",
    "Review my recent losing trades",
    "Should I trade the Fed news today?",
  ];

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = useCallback(async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: q }]);
    setLoading(true);

    const context = {
      marketData: marketData.map(m => ({ pair: m.pair, price: m.price, signal: m.signal, confidence: m.confidence, rsi: m.rsi, bb: m.bb })),
      topNews: news.slice(0, 4).map(n => ({ title: n.title, sentiment: n.sentiment, impact: n.impact, pair: n.pair })),
      recentTrades: trades.slice(0, 5).map(t => ({ pair: t.pair, result: t.result, pnl: t.pnl, strategy: t.strategy })),
      winRate: `${Math.round(trades.filter(t => t.result === "WIN").length / trades.length * 100)}%`,
      timestamp: new Date().toISOString(),
    };

    const response = await callClaudeAdviser(q, context);
    setMessages(prev => [...prev, { role: "assistant", content: response }]);
    setLoading(false);

    // Check if AI response contains high-confidence trade signal
    if (response.toLowerCase().includes("strong buy") || response.toLowerCase().includes("strong sell") || response.toLowerCase().includes("high confidence")) {
      onSendAlert(q, response);
    }
  }, [input, marketData, news, trades, onSendAlert]);

  return (
    <div className="space-y-4 h-full flex flex-col">
      {/* Alert Config */}
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-3">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">📧 Email Alert Config</div>
        <div className="flex gap-2">
          <input
            value={alertEmail}
            onChange={e => setAlertEmail(e.target.value)}
            placeholder="your@email.com — alerts sent on high-confidence signals"
            className="flex-1 bg-slate-900/60 border border-slate-600/50 text-sm text-white rounded-lg px-3 py-2 placeholder-slate-600 focus:outline-none focus:border-violet-500/60"
          />
          <button
            onClick={() => alertEmail && alert(`✅ Email alerts configured for: ${alertEmail}\n\nIn production: SendGrid/EmailJS sends real-time alerts when AI confidence > 80% on any signal.`)}
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
        <div className="text-xs text-slate-600 mt-1.5">Uses SendGrid in production. Alerts trigger when AI confidence &gt; 80% or news impact is HIGH.</div>
      </div>

      {/* Chat */}
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl flex flex-col" style={{ minHeight: 400 }}>
        <div className="p-3 border-b border-slate-700/40 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">AI Adviser — Claude + RAG + MCP + Hedera</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 380 }}>
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === "user"
                  ? "bg-violet-600 text-white rounded-br-none"
                  : "bg-slate-700/70 text-slate-100 rounded-bl-none border border-slate-600/40"
              }`}>
                {m.role === "assistant" && <div className="text-xs text-violet-400 font-bold mb-1">🧠 AI Adviser</div>}
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-700/70 border border-slate-600/40 rounded-2xl rounded-bl-none px-4 py-3">
                <div className="text-xs text-violet-400 font-bold mb-1">🧠 AI Adviser</div>
                <div className="flex gap-1">
                  {[0,1,2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {suggestions.map(s => (
            <button key={s} onClick={() => send(s)}
              className="text-xs text-slate-400 border border-slate-600/40 px-2 py-1 rounded-full hover:border-violet-500/40 hover:text-violet-300 transition-colors">
              {s}
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-slate-700/40 flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask the AI adviser anything about the markets..."
            className="flex-1 bg-slate-900/60 border border-slate-600/50 text-sm text-white rounded-xl px-4 py-2.5 placeholder-slate-600 focus:outline-none focus:border-violet-500/60"
          />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

function BrokersTab() {
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const types = ["All", "ECN", "ECN/STP", "Market Maker"];
  const colorMap = {
    emerald: { border: "border-emerald-500/30", badge: "bg-emerald-500/20 text-emerald-300", glow: "shadow-emerald-500/10" },
    rose: { border: "border-rose-500/30", badge: "bg-rose-500/20 text-rose-300", glow: "shadow-rose-500/10" },
    sky: { border: "border-sky-500/30", badge: "bg-sky-500/20 text-sky-300", glow: "shadow-sky-500/10" },
    blue: { border: "border-blue-500/30", badge: "bg-blue-500/20 text-blue-300", glow: "shadow-blue-500/10" },
    green: { border: "border-green-500/30", badge: "bg-green-500/20 text-green-300", glow: "shadow-green-500/10" },
    amber: { border: "border-amber-500/30", badge: "bg-amber-500/20 text-amber-300", glow: "shadow-amber-500/10" },
    purple: { border: "border-purple-500/30", badge: "bg-purple-500/20 text-purple-300", glow: "shadow-purple-500/10" },
    orange: { border: "border-orange-500/30", badge: "bg-orange-500/20 text-orange-300", glow: "shadow-orange-500/10" },
  };

  const filtered = BROKERS
    .filter(b => filter === "All" || b.type === filter)
    .sort((a, b) => sortBy === "rating" ? b.rating - a.rating : sortBy === "spread" ? parseFloat(a.spread) - parseFloat(b.spread) : parseInt(a.minDeposit.replace(/\D/g,"")) - parseInt(b.minDeposit.replace(/\D/g,"")));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-violet-500/10 border border-violet-500/30 rounded-xl p-4">
        <div className="text-xs font-bold uppercase tracking-widest text-violet-400 mb-1">🏦 Top Regulated Brokers — AI Compatible</div>
        <div className="text-sm text-slate-300">All brokers below support MT4/MT5 integration with the AI Trading Agent. Ranked by overall score, regulation, and execution quality.</div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${filter === t ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50"}`}>
              {t}
            </button>
          ))}
        </div>
        <select
          value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="bg-slate-800 border border-slate-700/50 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none">
          <option value="rating">Sort: Rating</option>
          <option value="spread">Sort: Spread</option>
          <option value="deposit">Sort: Min Deposit</option>
        </select>
      </div>

      {/* Broker Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filtered.map((b, idx) => {
          const c = colorMap[b.color] || colorMap.emerald;
          return (
            <div key={b.name} className={`bg-slate-800/70 border ${c.border} rounded-xl p-4 space-y-3 shadow-lg ${c.glow}`}>
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{b.logo}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-white">{b.name}</span>
                      {idx === 0 && <span className="text-xs bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-1.5 py-0.5 rounded-full font-bold">#1</span>}
                    </div>
                    <div className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block mt-0.5 ${c.badge}`}>{b.badge}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-white">⭐ {b.rating}</div>
                  <div className="text-xs text-slate-400">{b.type}</div>
                </div>
              </div>

              {/* Key stats grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Min Deposit", val: b.minDeposit },
                  { label: "Spread From", val: b.spread },
                  { label: "Leverage", val: b.leverage },
                  { label: "Commission", val: b.commission },
                  { label: "Exec Speed", val: b.execSpeed },
                  { label: "Pairs", val: `${b.pairs}+` },
                ].map(s => (
                  <div key={s.label} className="bg-slate-900/50 rounded-lg p-2 text-center">
                    <div className="text-xs text-slate-500">{s.label}</div>
                    <div className="text-xs font-bold text-white mt-0.5">{s.val}</div>
                  </div>
                ))}
              </div>

              {/* Platforms */}
              <div>
                <div className="text-xs text-slate-500 mb-1.5">Platforms</div>
                <div className="flex flex-wrap gap-1.5">
                  {b.platforms.map(p => (
                    <span key={p} className={`text-xs font-bold px-2 py-0.5 rounded ${p.includes("MT") ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" : "bg-slate-700 text-slate-300"}`}>{p}</span>
                  ))}
                </div>
              </div>

              {/* Regulation */}
              <div>
                <div className="text-xs text-slate-500 mb-1.5">Regulation</div>
                <div className="flex flex-wrap gap-1">
                  {b.regulation.map(r => <span key={r} className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-mono">{r}</span>)}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1">
                {b.features.map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-slate-300">
                    <span className="text-emerald-400">✓</span>{f}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-700/40">
                <div className="text-xs text-slate-500">Best for: <span className="text-slate-300 font-semibold">{b.bestFor}</span></div>
                <a href={b.affiliate} target="_blank" rel="noopener noreferrer"
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg ${c.badge} hover:opacity-80 transition-opacity cursor-pointer`}>
                  Open Account →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-600 text-center">⚠️ Trading CFDs carries risk. Always verify regulation in your jurisdiction. Past performance ≠ future results.</div>
    </div>
  );
}

function CurrenciesTab({ marketData }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("aiScore");
  const [search, setSearch] = useState("");

  const categories = ["All", "Major Forex", "Minor Forex", "Metals", "Crypto", "Indices", "Commodities"];

  const volatilityColor = { "Low": "text-emerald-400", "Medium": "text-sky-400", "High": "text-amber-400", "Very High": "text-rose-400" };
  const signalColor = { "BUY": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40", "SELL": "bg-rose-500/20 text-rose-300 border-rose-500/40", "HOLD": "bg-amber-500/20 text-amber-300 border-amber-500/40" };

  const filtered = ALL_CURRENCIES
    .filter(c => (activeCategory === "All" || c.category === activeCategory) && c.symbol.includes(search.toUpperCase()))
    .sort((a, b) => sortBy === "aiScore" ? b.aiScore - a.aiScore : sortBy === "volume" ? parseFloat(b.dailyVol.replace(/[^0-9.]/g,"")) - parseFloat(a.dailyVol.replace(/[^0-9.]/g,"")) : a.symbol.localeCompare(b.symbol));

  const topPicks = ALL_CURRENCIES.filter(c => c.aiScore >= 80).sort((a, b) => b.aiScore - a.aiScore).slice(0, 4);

  return (
    <div className="space-y-5">
      {/* AI Top Picks */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">🤖 AI Top Picks Right Now</div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {topPicks.map(c => (
            <div key={c.symbol} className="bg-gradient-to-br from-violet-900/30 to-slate-800/60 border border-violet-500/30 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{c.flag}</span>
                <span className="font-black text-white text-sm">{c.symbol}</span>
              </div>
              <div className={`text-xs font-bold px-2 py-0.5 rounded-full border inline-block mb-2 ${signalColor[c.trending]}`}>{c.trending}</div>
              <div className="text-xs text-slate-400 mb-1">AI Score</div>
              <div className="text-2xl font-black text-violet-300">{c.aiScore}<span className="text-sm text-slate-500">%</span></div>
              <ConfBar value={c.aiScore} color="bg-violet-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${activeCategory === cat ? "bg-violet-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50"}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search symbol..."
            className="flex-1 bg-slate-800 border border-slate-700/50 text-xs text-white rounded-lg px-3 py-1.5 placeholder-slate-600 focus:outline-none focus:border-violet-500/60" />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            className="bg-slate-800 border border-slate-700/50 text-xs text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none">
            <option value="aiScore">Sort: AI Score</option>
            <option value="volume">Sort: Volume</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid text-xs font-bold uppercase tracking-widest text-slate-500 px-4 py-2 border-b border-slate-700/40"
          style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 80px" }}>
          <span>Symbol</span><span>Category</span><span>Daily Vol</span><span>Volatility</span><span>Session</span><span>AI Signal</span><span className="text-right">Score</span>
        </div>
        <div className="divide-y divide-slate-700/30">
          {filtered.map(c => (
            <div key={c.symbol}
              className="grid items-center px-4 py-2.5 hover:bg-slate-700/20 transition-colors text-sm"
              style={{ gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 1fr 80px" }}>
              <div className="flex items-center gap-2">
                <span className="text-base">{c.flag}</span>
                <span className="font-black text-white text-xs">{c.symbol}</span>
              </div>
              <span className="text-xs text-slate-400">{c.category}</span>
              <span className="text-xs text-slate-300 font-mono">{c.dailyVol}</span>
              <span className={`text-xs font-semibold ${volatilityColor[c.volatility]}`}>{c.volatility}</span>
              <span className="text-xs text-slate-400">{c.session}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border inline-block ${signalColor[c.trending]}`}>{c.trending}</span>
              <div className="text-right">
                <span className={`text-xs font-black ${c.aiScore >= 75 ? "text-emerald-400" : c.aiScore >= 60 ? "text-amber-400" : "text-slate-400"}`}>{c.aiScore}%</span>
                <ConfBar value={c.aiScore} color={c.aiScore >= 75 ? "bg-emerald-500" : c.aiScore >= 60 ? "bg-amber-500" : "bg-slate-600"} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-600">Showing {filtered.length} instruments · AI scores update in real-time based on technical indicators, news sentiment, and pattern recognition.</div>
    </div>
  );
}

function MT4Tab() {
  const [connected, setConnected] = useState(false);
  const [server, setServer] = useState("localhost:6789");

  const eaCode = `//+------------------------------------------------------------------+
//|  AI Trading Agent Expert Advisor — MT4/MT5 Bridge               |
//|  Connects to Node.js MCP Server via ZeroMQ                      |
//+------------------------------------------------------------------+
#property copyright "AI Trading Agent"
#property version   "2.00"
#include <Zmq/Zmq.mqh>

extern string  ServerAddress  = "tcp://localhost:6789";
extern int     MagicNumber    = 20260613;
extern double  LotSize        = 0.01;
extern int     Slippage       = 3;
extern bool    AllowBuy       = true;
extern bool    AllowSell      = true;

Context context("AITradingAgent");
Socket  pushSocket(context, ZMQ_PUSH);
Socket  pullSocket(context, ZMQ_PULL);

string  lastSignal = "";
datetime lastCheck = 0;

//+------------------------------------------------------------------+
int OnInit() {
   pushSocket.connect(StringFormat("tcp://%s", ServerAddress));
   pullSocket.bind("tcp://*:6790");
   Print("AI Trading Agent EA initialized. Connected to: ", ServerAddress);
   SendHeartbeat();
   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
void OnTick() {
   if (TimeCurrent() - lastCheck < 5) return;
   lastCheck = TimeCurrent();
   
   // Push market snapshot to AI Agent
   string marketData = StringFormat(
      "{\"pair\":\"%s\",\"bid\":%.5f,\"ask\":%.5f,\"spread\":%.1f,"
      "\"time\":\"%s\",\"account\":%.2f}",
      Symbol(), Bid, Ask, (Ask-Bid)/Point,
      TimeToStr(TimeCurrent()), AccountBalance()
   );
   ZmqMsg pushMsg(marketData);
   pushSocket.send(pushMsg, true);
   
   // Receive signal from AI Agent
   ZmqMsg pullMsg;
   if (pullSocket.recv(pullMsg, true)) {
      string signal = pullMsg.getData();
      ProcessAISignal(signal);
   }
}

//+------------------------------------------------------------------+
void ProcessAISignal(string jsonSignal) {
   if (jsonSignal == lastSignal) return;
   lastSignal = jsonSignal;
   
   // Parse signal (simplified — use proper JSON lib in production)
   if (StringFind(jsonSignal, "\"action\":\"BUY\"") >= 0 && AllowBuy) {
      double sl = 0, tp = 0;
      // Extract SL/TP from JSON...
      ExecuteTrade(OP_BUY, LotSize, sl, tp);
   }
   else if (StringFind(jsonSignal, "\"action\":\"SELL\"") >= 0 && AllowSell) {
      ExecuteTrade(OP_SELL, LotSize, sl, tp);
   }
   else if (StringFind(jsonSignal, "\"action\":\"CLOSE_ALL\"") >= 0) {
      CloseAllOrders();
   }
}

//+------------------------------------------------------------------+
void ExecuteTrade(int type, double lots, double sl, double tp) {
   double price = (type == OP_BUY) ? Ask : Bid;
   int ticket = OrderSend(Symbol(), type, lots, price, Slippage,
                          sl, tp, "AI-Agent", MagicNumber, 0,
                          (type == OP_BUY) ? clrGreen : clrRed);
   if (ticket > 0) {
      Print("AI Agent trade executed. Ticket: ", ticket);
      // Log to Hedera via bridge
      LogToHedera(ticket, type, price, lots);
   } else {
      Print("Trade failed. Error: ", GetLastError());
   }
}

//+------------------------------------------------------------------+
void LogToHedera(int ticket, int type, double price, double lots) {
   string logMsg = StringFormat(
      "{\"type\":\"HEDERA_LOG\",\"ticket\":%d,\"action\":\"%s\","
      "\"price\":%.5f,\"lots\":%.2f,\"time\":\"%s\"}",
      ticket, (type == OP_BUY) ? "BUY" : "SELL",
      price, lots, TimeToStr(TimeCurrent())
   );
   ZmqMsg msg(logMsg);
   pushSocket.send(msg, true);
}

void CloseAllOrders() {
   for (int i = OrdersTotal()-1; i >= 0; i--) {
      if (OrderSelect(i, SELECT_BY_POS) && OrderMagicNumber() == MagicNumber) {
         double price = (OrderType() == OP_BUY) ? Bid : Ask;
         OrderClose(OrderTicket(), OrderLots(), price, Slippage, clrRed);
      }
   }
}

void SendHeartbeat() {
   ZmqMsg hb("{\"type\":\"heartbeat\",\"ea\":\"AITradingAgent\"}");
   pushSocket.send(hb, true);
}

void OnDeinit(const int reason) {
   pushSocket.disconnect(StringFormat("tcp://%s", ServerAddress));
   context.destroy();
}`;

  const bridgeCode = `// server/mt-bridge.js — Node.js ZeroMQ Bridge
const zmq = require('zeromq');
const { ClaudeAdvisor } = require('./ai/claude-adviser');
const { HederaLogger } = require('./blockchain/hedera');
const { sendAlertEmail } = require('./alerts/email');

const adviser = new ClaudeAdvisor();
const hedera  = new HederaLogger();

async function startBridge() {
  const pullSock = new zmq.Pull();
  const pushSock = new zmq.Push();
  
  await pullSock.bind('tcp://0.0.0.0:6789');
  await pushSock.bind('tcp://0.0.0.0:6790');
  
  console.log('MT4/MT5 Bridge listening on port 6789...');

  for await (const [msg] of pullSock) {
    const data = JSON.parse(msg.toString());
    
    if (data.type === 'heartbeat') {
      console.log('EA connected:', data.ea);
      continue;
    }
    
    if (data.type === 'HEDERA_LOG') {
      await hedera.logTrade(data);
      continue;
    }

    // Get AI signal for the incoming tick data
    const signal = await adviser.analyzeAndSignal(data);
    
    // Log decision to Hedera immutably
    await hedera.logDecision({ input: data, signal, timestamp: Date.now() });

    // Send email alert if high confidence
    if (signal.confidence > 80) {
      await sendAlertEmail({
        pair:   data.pair,
        signal: signal.action,
        confidence: signal.confidence,
        reasoning:  signal.reasoning,
      });
    }

    // Push signal back to MT4/MT5
    await pushSock.send(JSON.stringify(signal));
  }
}

startBridge().catch(console.error);`;

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">MT4/MT5 Bridge Connection</div>
            <div className="text-sm text-slate-300 mt-1">ZeroMQ bridge connecting MetaTrader to AI agent</div>
          </div>
          <div className={`flex items-center gap-2 text-sm font-bold ${connected ? "text-emerald-400" : "text-slate-500"}`}>
            <div className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-slate-600"}`} />
            {connected ? "Connected" : "Disconnected"}
          </div>
        </div>
        <div className="flex gap-2">
          <input
            value={server}
            onChange={e => setServer(e.target.value)}
            className="flex-1 bg-slate-900/60 border border-slate-600/50 text-sm font-mono text-white rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500/60"
          />
          <button
            onClick={() => { setConnected(!connected); }}
            className={`${connected ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"} text-white text-sm font-bold px-5 py-2 rounded-lg transition-colors`}
          >
            {connected ? "Disconnect" : "Connect"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { icon: "1", title: "Install ZeroMQ Library", body: "Download Zmq.mqh from GitHub and place in MT4/MetaEditor/Include/Zmq/ folder" },
          { icon: "2", title: "Attach EA to Chart", body: "Open MT4, drag AITradingAgent.mq4 EA onto any chart. Set ServerAddress to your Node.js server IP" },
          { icon: "3", title: "Start Node Bridge", body: "Run `node server/mt-bridge.js` — EA connects and starts streaming ticks to AI agent" },
        ].map(s => (
          <div key={s.icon} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
            <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-500/40 flex items-center justify-center text-violet-300 font-black text-sm mb-3">{s.icon}</div>
            <div className="font-bold text-white text-sm mb-1">{s.title}</div>
            <div className="text-xs text-slate-400">{s.body}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Expert Advisor Code (MT4/MT5)</div>
        <div className="bg-slate-900/80 border border-slate-700/40 rounded-xl p-4 overflow-x-auto">
          <pre className="text-xs text-emerald-300 font-mono leading-relaxed whitespace-pre">{eaCode}</pre>
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Node.js Bridge Server</div>
        <div className="bg-slate-900/80 border border-slate-700/40 rounded-xl p-4 overflow-x-auto">
          <pre className="text-xs text-sky-300 font-mono leading-relaxed whitespace-pre">{bridgeCode}</pre>
        </div>
      </div>
    </div>
  );
}

function ArchitectureTab() {
  const infraCode = `# docker-compose.yml — Full Stack Deployment
version: "3.9"
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    environment:
      - REACT_APP_API_URL=http://api:8000
      - REACT_APP_WS_URL=ws://api:8000

  api:
    build: ./server
    ports: ["8000:8000"]
    environment:
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
      - HEDERA_ACCOUNT_ID=\${HEDERA_ACCOUNT_ID}
      - HEDERA_PRIVATE_KEY=\${HEDERA_PRIVATE_KEY}
      - SENDGRID_API_KEY=\${SENDGRID_API_KEY}
      - DATABASE_URL=postgresql://postgres:pass@db/trading
      - REDIS_URL=redis://redis:6379
    depends_on: [db, redis]

  ai-service:
    build: ./ai
    ports: ["8001:8001"]
    environment:
      - ANTHROPIC_API_KEY=\${ANTHROPIC_API_KEY}
      - CHROMA_HOST=chromadb
      - FABRICIQ_API_KEY=\${FABRICIQ_API_KEY}
    depends_on: [chromadb]

  mt-bridge:
    build: ./mt-bridge
    ports: ["6789:6789", "6790:6790"]
    environment:
      - API_URL=http://api:8000

  chromadb:
    image: chromadb/chroma:latest
    ports: ["8002:8000"]
    volumes: ["chroma_data:/chroma/.chroma/index"]

  db:
    image: postgres:15
    environment: { POSTGRES_DB: trading, POSTGRES_PASSWORD: pass }
    volumes: ["pg_data:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

volumes:
  chroma_data:
  pg_data:

# ============================================================
# server/ai/claude-adviser.js — MCP Tool Integration
# ============================================================
const Anthropic = require('@anthropic-ai/sdk');
const { MCPClient } = require('@modelcontextprotocol/sdk');

class ClaudeAdvisor {
  constructor() {
    this.client = new Anthropic();
    this.mcp = new MCPClient({ serverUrl: 'http://localhost:8003' });
    
    // MCP Tools available to Claude
    this.tools = [
      { name: 'get_live_price',    description: 'Get real-time price for any forex pair or asset' },
      { name: 'get_news_feed',     description: 'Fetch latest financial news with sentiment scores' },
      { name: 'get_indicators',    description: 'Calculate technical indicators (RSI, MACD, BB, ATR)' },
      { name: 'get_trade_history', description: 'Retrieve past trade data and performance metrics' },
      { name: 'query_rag',         description: 'Query Fabric IQ knowledge base for market patterns' },
      { name: 'hedera_log',        description: 'Log decision to Hedera Hashgraph for immutable audit' },
      { name: 'send_alert',        description: 'Send email alert via SendGrid for high-conf signals' },
    ];
  }

  async analyzeAndSignal(marketData) {
    const ragContext = await this.mcp.call('query_rag', {
      query: \`market pattern \${marketData.pair}\`,
      topK: 5,
    });

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      tools: this.tools,
      messages: [{
        role: 'user',
        content: \`
          Analyze this real-time tick and decide whether to BUY, SELL, or HOLD.
          Market: \${JSON.stringify(marketData)}
          Historical RAG context: \${JSON.stringify(ragContext)}
          
          Return JSON: { action, confidence, sl, tp, reasoning, strategy }
        \`,
      }],
    });

    return JSON.parse(response.content[0].text);
  }
}

# ============================================================
# blockchain/hedera.js — Immutable Trade Audit Logging
# ============================================================
const { Client, TopicCreateTransaction,
        TopicMessageSubmitTransaction } = require('@hashgraph/sdk');

class HederaLogger {
  constructor() {
    this.client = Client.forTestnet();
    this.client.setOperator(
      process.env.HEDERA_ACCOUNT_ID,
      process.env.HEDERA_PRIVATE_KEY
    );
  }

  async logDecision(data) {
    const message = JSON.stringify({
      ...data,
      timestamp: Date.now(),
      version: '1.0',
    });

    await new TopicMessageSubmitTransaction()
      .setTopicId(process.env.HEDERA_TOPIC_ID)
      .setMessage(message)
      .execute(this.client);

    console.log('Decision logged to Hedera:', data.signal?.action);
  }
}

# ============================================================
# ai/rag_engine.py — Fabric IQ + LangChain RAG Pipeline
# ============================================================
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chains import RetrievalQA
from langchain.llms import Anthropic
import fabriciq  # Fabric IQ SDK

class FabricIQRAGEngine:
    def __init__(self):
        self.embeddings = OpenAIEmbeddings()
        self.vectorstore = Chroma(
            collection_name="trading_knowledge",
            embedding_function=self.embeddings,
            persist_directory="./chroma_db",
        )
        self.fabriciq = fabriciq.Client(api_key=FABRICIQ_API_KEY)
        self.llm = Anthropic(model="claude-sonnet-4-6")
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=self.llm,
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": 5}),
        )

    def ingest_trade_history(self, trades: list):
        """Index trade history into vector store for RAG"""
        docs = [
            Document(
                page_content=f"Trade {t['id']}: {t['pair']} {t['type']} "
                             f"Result: {t['result']} P&L: {t['pnl']} "
                             f"Strategy: {t['strategy']} Confidence: {t['confidence']}%",
                metadata={"pair": t["pair"], "result": t["result"]},
            )
            for t in trades
        ]
        self.vectorstore.add_documents(docs)
        # Also sync to Fabric IQ for enterprise RAG
        self.fabriciq.index(documents=docs, collection="trade_history")

    def query(self, question: str) -> str:
        return self.qa_chain.run(question)`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {ARCHITECTURE.core.map(c => (
          <div key={c.name} className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">{c.icon}</div>
              <div>
                <div className="font-black text-white text-sm">{c.name}</div>
                <div className="text-xs font-semibold text-violet-400 mb-1">{c.role}</div>
                <div className="text-xs text-slate-400">{c.desc}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-800/60 border border-slate-700/40 rounded-xl p-4">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Full Technology Stack</div>
        <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2">
          {ARCHITECTURE.stack.map((t, i) => (
            <div key={i} className="flex items-start gap-2 text-xs">
              <span className="text-violet-400 mt-0.5">▸</span>
              <span className="text-slate-300">{t}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Infrastructure + Full Backend Code</div>
        <div className="bg-slate-900/80 border border-slate-700/40 rounded-xl p-4 overflow-x-auto">
          <pre className="text-xs text-amber-300 font-mono leading-relaxed whitespace-pre">{infraCode}</pre>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [marketData, setMarketData] = useState(generateMarketData());
  const [news] = useState(generateNews());
  const [trades] = useState(generateTrades());
  const [alerts, setAlerts] = useState([]);
  const [priceHistory, setPriceHistory] = useState(() => {
    const h = {};
    PAIRS.forEach(p => { h[p] = [BASE_PRICES[p]]; });
    return h;
  });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time price updates
  useEffect(() => {
    const iv = setInterval(() => {
      setMarketData(generateMarketData());
      setPriceHistory(prev => {
        const next = { ...prev };
        PAIRS.forEach(p => {
          const arr = [...(prev[p] || [BASE_PRICES[p]])];
          const last = arr[arr.length - 1];
          arr.push(last * (1 + (Math.random() - 0.5) * 0.001));
          if (arr.length > 40) arr.shift();
          next[p] = arr;
        });
        return next;
      });
      setLastUpdate(new Date());
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const handleSendAlert = useCallback((query, response) => {
    setAlerts(prev => [{
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      query: query.slice(0, 60),
      confidence: Math.floor(80 + Math.random() * 18),
    }, ...prev.slice(0, 4)]);
  }, []);

  const handleAnalyzeFromDashboard = useCallback((prompt) => {
    setTab("adviser");
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("ai-analyze", { detail: prompt }));
    }, 100);
  }, []);

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "currencies", label: "Currencies", icon: "💱" },
    { id: "brokers", label: "Brokers", icon: "🏦" },
    { id: "strategies", label: "Strategies", icon: "🎯" },
    { id: "trades", label: "Trade History", icon: "📈" },
    { id: "adviser", label: "AI Adviser", icon: "🧠" },
    { id: "mt4", label: "MT4/MT5", icon: "📡" },
    { id: "architecture", label: "Architecture", icon: "⚙️" },
  ];

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#0a0d14", minHeight: "100vh", color: "#fff" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0f1420 0%, #111827 100%)", borderBottom: "1px solid rgba(99,102,241,0.2)" }} className="px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }} className="w-9 h-9 rounded-xl flex items-center justify-center text-lg font-black">⚡</div>
            <div>
              <div className="font-black text-white text-lg tracking-tight">AI Trading Agent</div>
              <div className="text-xs text-slate-500">Claude · MCP · Hedera · Fabric IQ · MT4/5</div>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {alerts.length > 0 && (
              <div className="bg-violet-500/15 border border-violet-500/30 rounded-lg px-3 py-1.5 text-xs text-violet-300 font-semibold">
                🔔 {alerts.length} AI Alert{alerts.length > 1 ? "s" : ""}
              </div>
            )}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live · {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Banner */}
      {alerts.length > 0 && (
        <div style={{ background: "rgba(124,58,237,0.08)", borderBottom: "1px solid rgba(124,58,237,0.2)" }} className="px-4 py-2">
          <div className="max-w-6xl mx-auto flex gap-3 overflow-x-auto">
            {alerts.map(a => (
              <div key={a.id} className="flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-lg px-3 py-1.5 whitespace-nowrap text-xs">
                <span className="text-violet-400">📧 Alert {a.time}</span>
                <span className="text-slate-300">{a.query}...</span>
                <span className="text-emerald-400 font-bold">{a.confidence}% conf</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }} className="px-4">
        <div className="max-w-6xl mx-auto flex gap-1 overflow-x-auto py-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                tab === t.id
                  ? "bg-violet-600/30 text-violet-300 border border-violet-500/40"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
              }`}
            >
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {tab === "dashboard" && <DashboardTab marketData={marketData} news={news} priceHistory={priceHistory} onAnalyze={handleAnalyzeFromDashboard} />}
        {tab === "currencies" && <CurrenciesTab marketData={marketData} />}
        {tab === "brokers" && <BrokersTab />}
        {tab === "strategies" && <StrategiesTab marketData={marketData} />}
        {tab === "trades" && <TradesTab trades={trades} />}
        {tab === "adviser" && <AIAdviserTab marketData={marketData} news={news} trades={trades} onSendAlert={handleSendAlert} />}
        {tab === "mt4" && <MT4Tab />}
        {tab === "architecture" && <ArchitectureTab />}
      </div>
    </div>
  );
}
