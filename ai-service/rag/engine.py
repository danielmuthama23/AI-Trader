import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain.schema import Document

class RAGEngine:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
        self.vs = Chroma(collection_name="trading", embedding_function=self.embeddings, persist_directory="./chroma_db")

    def ingest(self, documents: list):
        docs = [Document(page_content=d["content"], metadata=d.get("metadata", {})) for d in documents]
        self.vs.add_documents(docs)

    def query(self, query: str, top_k: int = 5) -> str:
        results = self.vs.similarity_search(query, k=top_k)
        return "\n".join([r.page_content for r in results])

    def ingest_trades(self, trades: list):
        self.ingest([{
            "content": f"Trade {t['id']}: {t['pair']} {t['type']} → {t['result']} P&L:{t['pnl']} Strategy:{t['strategy']}",
            "metadata": {"pair": t["pair"], "result": t["result"]}
        } for t in trades])
