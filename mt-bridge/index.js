require("dotenv").config({ path: "../.env" });
const zmq   = require("zeromq");
const axios = require("axios");

const API = process.env.API_URL || "http://localhost:8000";

async function start() {
  const pull = new zmq.Pull();
  const push = new zmq.Push();
  await pull.bind("tcp://0.0.0.0:6789");
  await push.bind("tcp://0.0.0.0:6790");
  console.log("MT Bridge listening :6789");

  for await (const [msg] of pull) {
    let data;
    try { data = JSON.parse(msg.toString()); } catch { continue; }
    if (data.type === "heartbeat") { console.log("EA connected:", data.ea); continue; }
    if (data.type === "HEDERA_LOG") { await axios.post(`${API}/api/trades/log`, data).catch(()=>{}); continue; }

    try {
      const res = await axios.post(`${API}/api/mt4/signal`, data);
      await push.send(JSON.stringify(res.data));
      console.log(`→ ${res.data.action} ${data.pair} (${res.data.confidence}%)`);
    } catch (e) { console.error("Signal error:", e.message); }
  }
}

start().catch(console.error);
