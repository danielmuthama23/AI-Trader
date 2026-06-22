import chromadb
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
import os

class RAGEngine:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        chroma_host = os.getenv("CHROMA_HOST", "localhost")
        chroma_port = int(os.getenv("CHROMA_PORT", 8000))
        
        self.client = chromadb.HttpClient(
            host=chroma_host,
            port=chroma_port
        )
        self.collection = self.client.get_or_create_collection(
            name="trading_knowledge",
            metadata={"hnsw:space": "cosine"}
        )

    def query(self, query_text: str, top_k: int = 5) -> list:
        """Query RAG knowledge base"""
        try:
            embedding = self.embeddings.embed_query(query_text)
            results = self.collection.query(
                query_embeddings=[embedding],
                n_results=top_k
            )
            return results.get("documents", [[]])[0] if results else []
        except Exception as e:
            print(f"RAG query error: {e}")
            return []

    def ingest(self, documents: list):
        """Ingest documents into RAG"""
        try:
            for i, doc in enumerate(documents):
                embedding = self.embeddings.embed_query(doc.get("content", ""))
                self.collection.add(
                    ids=[f"doc_{i}"],
                    embeddings=[embedding],
                    documents=[doc.get("content", "")],
                    metadatas=[doc.get("metadata", {})]
                )
            print(f"✓ Ingested {len(documents)} documents")
        except Exception as e:
            print(f"RAG ingest error: {e}")
