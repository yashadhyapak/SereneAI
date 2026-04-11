import os
from dotenv import load_dotenv
import chromadb
from sentence_transformers import SentenceTransformer
from services.llm_rotator import is_llm_available, generate_content_with_rotator

load_dotenv()
llm_available = is_llm_available()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_DIR = os.path.join(BASE_DIR, "data", "chromadb")

# Initialize models
try:
    embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
    chroma_client = chromadb.PersistentClient(path=DB_DIR)
    knowledge_collection = chroma_client.get_or_create_collection(name="serene_knowledge")
    vector_db_ready = True
except Exception as e:
    print(f"Warning: Vector DB not initialized correctly. {e}")
    vector_db_ready = False

SYS_PROMPT = """You are Serene.AI, a highly empathetic, clinical-grade psychiatric companion.

CRITICAL GUARDRAILS & SAFETY (ZERO COMPROMISE):
1. **NO DIAGNOSIS/MEDICATION**: Under absolutely no circumstances can you diagnose a medical condition or suggest pharmaceutical drugs.
2. **INDIAN CRISIS ESCALATION**: If the user explicitly mentions self-harm, suicide, murder, or extreme distress (e.g., "ending it all", "can't go on"), immediately enter CRISIS MODE. In Crisis Mode: Be deeply compassionate, urge them to seek immediate professional help, and explicitly provide these Indian toll-free suicide helplines: KIRAN (1800-599-0019) and Vandrevala Foundation (9999 666 555). Do not provide US/UK lines.

THERAPEUTIC BEHAVIOR & PACING (NO "YES-MAN" CHATBOTS):
- Act exactly like a real human psychiatrist sitting across from them. Do not sound artificial.
- Do not immediately agree with severe cognitive distortions. If they say "I am a total failure," gently challenge and reframe this absolute thought using CBT principles rather than blindly validating it as truth.
- Use retrieved RAG textbook knowledge heavily to ground your clinical logic (CBT, ACT, DBT).

DYNAMIC CONVERSATION MODES:
1. **SHORT MODE**: If the user inputs 1-5 words (e.g., "Had a bad day", "Feeling low"), DO NOT reply with a massive paragraph or list of exercises. Give a rapid, gentle 1-2 sentence response validating them and asking one open question to draw them out.
2. **DEEP MODE**: If the user writes a large, detailed paragraph, adopt a clinical depth. Identify their core stressor, validate the specific emotional weight they are carrying, and draw exactly ONE relevant coping mechanism from your retrieved psychiatric context. Explain exactly how to perform it. Never dump multiple exercises at once—that overwhelms patients."""

def my_chroma_db_search(query: str, top_k: int = 4) -> list:
    if not vector_db_ready:
        return []
    try:
        # Check if collection is empty
        if knowledge_collection.count() == 0:
            return []
            
        query_embedding = embedding_model.encode([query]).tolist()
        results = knowledge_collection.query(
            query_embeddings=query_embedding,
            n_results=top_k
        )
        # Process and return the extracted documents with metadata
        if results and 'documents' in results and len(results['documents']) > 0:
            retrieved_chunks = []
            for i, doc in enumerate(results['documents'][0]):
                meta = results['metadatas'][0][i] if 'metadatas' in results and results['metadatas'] else {}
                source = meta.get("source", "Unknown Text")
                page = meta.get("page", "?")
                retrieved_chunks.append(f"[Source: {source}, Page {page}]: {doc}")
            return retrieved_chunks
        return []
    except Exception as e:
        print(f"ChromaDB search error: {e}")
        return []

def generate_empathetic_response(user_message: str) -> str:
    if not llm_available:
        return "I am Serene.AI. Please update the GEMINI_API_KEY in the backend/.env file to enable my AI capabilities."

    # 1. Similarity Search Vector DB
    top_chunks = my_chroma_db_search(user_message)

    try:
        # 2. Combine Context
        context_str = ""
        if top_chunks and len(top_chunks) > 0:
            context_str = "Relevant context from mental health guidelines (use this to inform your response but stay conversational and warm):\n" 
            context_str += "\n".join(f"- {chunk}" for chunk in top_chunks) + "\n\n"

        prompt = f"{SYS_PROMPT}\n\n{context_str}User: {user_message}\nSerene.AI:"
        
        # 3. Generate Final Response uses Rotator to prevent crashes
        return generate_content_with_rotator(prompt)
    except Exception as e:
        return f"I'm sorry, I encountered an error connecting to my thought engine. ({str(e)})"
