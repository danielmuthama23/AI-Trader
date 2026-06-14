require("dotenv").config();
const express = require("express");
const http    = require("http");
const { Server } = require("socket.io");
const cors    = require("cors");
const cron    = require("node-cron");

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Routes (stubs — expand each file for full logic)
app.get("/api/signals",  (req, res) => res.json({ signals: [] }));
app.get("/api/news",     (req, res) => res.json({ news: [] }));
app.get("/api/trades",   (req, res) => res.json({ trades: [] }));
app.post("/api/adviser", async (req, res) => {
  const { askAdviser } = require("./ai/claudeAdviser");
  const answer = await askAdviser(req.body.message, req.body.context);
  res.json({ answer });
});
app.post("/api/alerts/config", (req, res) => {
  const { subscribeEmail } = require("./alerts/email");
  subscribeEmail(req.body.email);
  res.json({ status: "subscribed" });
});
app.post("/api/mt4/signal", async (req, res) => {
  const { analyzeAndSignal } = require("./ai/claudeAdviser");
  const signal = await analyzeAndSignal(req.body);
  res.json(signal);
});

// WebSocket ticks
io.on("connection", (socket) => {
  socket.on("subscribe", ({ pairs }) => pairs.forEach(p => socket.join(`pair:${p}`)));
});

const { startPriceFeed } = require("./data/priceFeed");
startPriceFeed((tick) => io.to(`pair:${tick.symbol}`).emit("tick", tick));

// AI signal scan every 60s
cron.schedule("* * * * *", async () => {
  // placeholder for signal scanner
  io.emit("heartbeat", { time: Date.now() });
});

server.listen(8000, () => console.log("Server on :8000"));
