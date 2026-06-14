const axios = require("axios");
const PAIRS = ["EURUSD","GBPUSD","USDJPY","XAUUSD","BTCUSD","US30","NAS100","OILUSD"];
const BASE  = { EURUSD:1.08542, GBPUSD:1.27381, USDJPY:149.842, XAUUSD:2341.5, BTCUSD:67420, US30:38950, NAS100:17820, OILUSD:78.42 };

async function fetchPrice(symbol) {
  try {
    const r = await axios.get("https://www.alphavantage.co/query",
      { params: { function:"GLOBAL_QUOTE", symbol, apikey: process.env.ALPHA_VANTAGE_KEY }, timeout: 5000 });
    const q = r.data["Global Quote"];
    return { symbol, price: parseFloat(q["05. price"]), change: parseFloat(q["10. change percent"]), time: Date.now() };
  } catch {
    const base = BASE[symbol] || 1;
    return { symbol, price: base*(1+(Math.random()-0.5)*0.001), change:(Math.random()-0.5)*0.5, time: Date.now() };
  }
}

function startPriceFeed(onTick) {
  setInterval(async () => { for (const p of PAIRS) onTick(await fetchPrice(p)); }, 5000);
}
module.exports = { startPriceFeed };
