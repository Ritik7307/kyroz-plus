import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from pymongo import MongoClient
from langchain_core.documents import Document

load_dotenv()
if not os.getenv("MONGO_URI"):
    from pathlib import Path
    parent_env = Path(__file__).resolve().parent.parent / '.env'
    if parent_env.exists():
        load_dotenv(dotenv_path=parent_env)


class KosaRAG:
    def __init__(self):
        self.embeddings = None
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        self.vector_db = None
        self.llm = None

    def _init_embeddings(self):
        if self.embeddings is None:
            print("Initializing HuggingFaceEmbeddings...")
            self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

    def _init_llm(self):
        if self.llm is None:
            self.llm = ChatGroq(
                groq_api_key=os.getenv("GROQ_API_KEY"),
                model_name="llama-3.3-70b-versatile",
                temperature=0.3
            )

    def load_document(self, file_path: str):
        self._init_embeddings()
        ext = os.path.splitext(file_path)[1].lower()
        if ext == ".pdf":
            loader = PyPDFLoader(file_path)
        elif ext == ".docx":
            loader = Docx2txtLoader(file_path)
        else:
            loader = TextLoader(file_path, encoding='utf-8')
        
        documents = loader.load()
        chunks = self.text_splitter.split_documents(documents)
        
        if self.vector_db is None:
            self.vector_db = FAISS.from_documents(chunks, self.embeddings)
        else:
            self.vector_db.add_documents(chunks)
        
        # Save locally
        self.vector_db.save_local("faiss_index")

    def sync_sops_from_mongo(self):
        self._init_embeddings()
        mongo_uri = os.getenv("MONGO_URI") or os.getenv("MONGO_URL") or "mongodb://127.0.0.1:27017/kyroz"
        print("Connecting to MongoDB for SOP sync...")
        client = MongoClient(mongo_uri)
        try:
            try:
                db = client.get_default_database()
            except Exception:
                db = client["test"]
            
            print(f"Using database: {db.name}")
            
            sops_col = db["sops"]
            mastersops_col = db["mastersops"]
            
            all_sops = list(sops_col.find({}))
            all_mastersops = list(mastersops_col.find({}))
            
            print(f"Retrieved {len(all_sops)} user SOPs and {len(all_mastersops)} master SOPs.")
            
            seen_titles = set()
            documents_to_index = []
            
            for doc in all_sops + all_mastersops:
                title = doc.get("title")
                if not title:
                    continue
                
                title_key = title.strip().lower()
                if title_key in seen_titles:
                    continue
                seen_titles.add(title_key)
                
                content_parts = []
                content_parts.append(f"TITLE: {title}")
                
                category = doc.get("category")
                if category:
                    content_parts.append(f"CATEGORY: {category}")
                    
                content_en = doc.get("contentEn")
                if content_en:
                    content_parts.append(f"CONTENT (EN):\n{content_en}")
                    
                content_hi = doc.get("contentHi")
                if content_hi:
                    content_parts.append(f"CONTENT (HI):\n{content_hi}")
                    
                content_legacy = doc.get("content")
                if content_legacy:
                    content_parts.append(f"CONTENT:\n{content_legacy}")
                    
                full_text = "\n".join(content_parts)
                
                metadata = {
                    "source": "mongodb",
                    "title": title,
                    "category": category or "General"
                }
                
                documents_to_index.append((full_text, metadata))
                
            if not documents_to_index:
                print("No SOP documents found in MongoDB to index.")
                return
            
            print(f"Deduplicated and prepared {len(documents_to_index)} unique SOP documents for indexing.")
            
            chunks = []
            for text, meta in documents_to_index:
                split_texts = self.text_splitter.split_text(text)
                for chunk_text in split_texts:
                    chunks.append(Document(page_content=chunk_text, metadata=meta))
            
            print(f"Split documents into {len(chunks)} chunks.")
            
            self.vector_db = FAISS.from_documents(chunks, self.embeddings)
            self.vector_db.save_local("faiss_index")
            print("Successfully built and saved FAISS index from MongoDB.")
            
        except Exception as e:
            print(f"Error syncing SOPs from MongoDB: {e}")
            raise e
        finally:
            client.close()

    def query(self, user_query: str, lang: str = "en"):
        self._init_embeddings()
        self._init_llm()
        if self.vector_db is None:
            if os.path.exists("faiss_index"):
                self.vector_db = FAISS.load_local("faiss_index", self.embeddings, allow_dangerous_deserialization=True)
            else:
                return "I don't have any SOP context yet. Please upload some documents."

        # Translate query to English for better similarity search
        translation_prompt = f"""Translate the following user query to English. It might be in Hindi, Hinglish, or English.
If there are any spelling mistakes, informal typing, or wrongly pronounced words spelled out (like 'jalfarzi' instead of 'jalfrezi'), correct them automatically.
Reply ONLY with the corrected English translation, nothing else. Do not answer the query, just translate it.
Query: {user_query}"""
        translated_query_response = self.llm.invoke(translation_prompt)
        translated_query = translated_query_response.content.strip()

        # Manual RAG using the translated query for better English embedding match
        docs = self.vector_db.similarity_search(translated_query, k=5)
        context = "\n\n".join([doc.page_content for doc in docs])
        
        prompt = f"""You are a kitchen assistant (Chef) for Kyroz Plus. 
Use the following context to answer the user's query in {lang}. The user's query may be in Hinglish, English, or Hindi.
STRICT RULES:
1. Use ONLY the provided context. Do NOT use your own general training knowledge to answer recipe or operational questions. If the requested dish, recipe, or operational detail is NOT explicitly mentioned in the context, you MUST strictly respond with exactly: "I do not have this recipe in my SOP library." (or in Hindi: "मेरे पास SOP लाइब्रेरी में यह रेसिपी नहीं है।") and absolutely nothing else.
2. If answering in Hindi, you MUST use the Devanagari script (हिन्दी), NOT the Urdu script or Hinglish (Latin alphabet).

Context:
{context}

Original User Query: {user_query}
Translated English Query (for reference): {translated_query}
Answer:"""
        
        response = self.llm.invoke(prompt)
        return response.content

# Singleton instance
rag_engine = KosaRAG()

