import os
from typing import List
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

class KosaRAG:
    def __init__(self):
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        self.vector_db = None
        self.llm = ChatGroq(
            groq_api_key=os.getenv("GROQ_API_KEY"),
            model_name="llama-3.3-70b-versatile",
            temperature=0.3
        )

    def load_document(self, file_path: str):
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

    def query(self, user_query: str, lang: str = "en"):
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
        
        prompt = f"""You are a helpful kitchen assistant (KOSA). 
Use the following context to answer the user's query in {lang}. The user's query may be in Hinglish, English, or Hindi.
IMPORTANT: If answering in Hindi, you MUST use the Devanagari script (हिन्दी), NOT the Urdu script.
If the user asks in Hinglish (Roman Hindi), reply in the language specified by '{lang}'.
If the answer is not in the context, say that you don't know based on the SOPs, but try to be helpful.

Context:
{context}

Original User Query: {user_query}
Translated English Query (for reference): {translated_query}
Answer:"""
        
        response = self.llm.invoke(prompt)
        return response.content

# Singleton instance
rag_engine = KosaRAG()
