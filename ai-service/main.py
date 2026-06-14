from fastapi import FastAPI
from pydantic import BaseModel
from rag.engine import RAGEngine
import anthropic, os, json

app = FastAPI(title="AI Trading Service")
rag = RAGEngine()
client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

class SignalReq(BaseModel):
    pair: str; price: float; rsi: float = 50; macd: float = 0; bb: str = "mid"

class RAGReq(BaseModel):
    query: str; top_k: int = 5

@app.post("/signal")
async def get_signal(req: SignalReq):
    ctx = rag.query(f"pattern {req.pair} RSI {req.rsi:.0f}")
    msg = client.messages.create(
        model="claude-sonnet-4-6", max_tokens=300,
        messages=[{"role":"user","content":
            f"Signal for {req.pair} price={req.price} RSI={req.rsi} MACD={req.macd} BB={req.bb}. Context: {ctx}\n"
            f"Return ONLY JSON: {{\"action\":\"BUY|SELL|HOLD\",\"confidence\":0-100,\"sl\":0,\"tp\":0,\"reasoning\":\"...\",\"strategy\":\"...\"}}"}])
    return json.loads(msg.content[0].text.replace("```json","").replace("```","").strip())

@app.post("/rag/query")
async def query_rag(req: RAGReq):
    return {"result": rag.query(req.query, req.top_k)}

@app.post("/rag/ingest")
async def ingest(data: dict):
    rag.ingest(data.get("documents", []))
    return {"status": "ok"}
