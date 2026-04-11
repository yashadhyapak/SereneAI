import os
import chromadb
from sentence_transformers import SentenceTransformer
import PyPDF2

# Setup Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DOCS_DIR = os.path.join(DATA_DIR, "documents")
DB_DIR = os.path.join(DATA_DIR, "chromadb")

os.makedirs(DOCS_DIR, exist_ok=True)
os.makedirs(DB_DIR, exist_ok=True)

CHUNK_SIZE_WORDS = 350
CHUNK_OVERLAP_WORDS = 50
BATCH_SIZE = 100

def sliding_window_chunking(text: str, filename: str, page_num: int):
    """Chunks text into sliding windows of words with overlaps."""
    words = text.split()
    chunks = []
    
    if len(words) < 20: 
        return [] # Ignore extremely tiny/blank pages
        
    for i in range(0, len(words), CHUNK_SIZE_WORDS - CHUNK_OVERLAP_WORDS):
        chunk_words = words[i:i + CHUNK_SIZE_WORDS]
        chunk_text = " ".join(chunk_words)
        
        # Add metadata for every chunk
        chunks.append({
            "text": chunk_text,
            "metadata": {
                "source": filename,
                "page": page_num
            }
        })
        
        # Stop if we hit the end
        if i + CHUNK_SIZE_WORDS >= len(words):
            break
            
    return chunks

def ingest_documents():
    print("Loading embedding model (all-MiniLM-L6-v2)...")
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print("Connecting to local ChromaDB...")
    client = chromadb.PersistentClient(path=DB_DIR)
    
    # 1. Completely Wipe the Old Database
    try:
        client.delete_collection(name="serene_knowledge")
        print("Successfully wiped the legacy knowledge base.")
    except Exception:
        pass # Collection didn't exist yet
        
    collection = client.get_or_create_collection(name="serene_knowledge")
    
    all_chunks = []
    
    # 2. Parse and Extract
    print("\nStarting extraction phase...")
    for filename in os.listdir(DOCS_DIR):
        filepath = os.path.join(DOCS_DIR, filename)
        
        # Process PDFs
        if filename.endswith(".pdf"):
            print(f"Reading {filename}...")
            try:
                with open(filepath, 'rb') as f:
                    reader = PyPDF2.PdfReader(f)
                    for page_num, page in enumerate(reader.pages):
                        page_text = page.extract_text()
                        if page_text:
                            all_chunks.extend(sliding_window_chunking(page_text, filename, page_num + 1))
            except Exception as e:
                print(f"Failed to read PDF {filename}: {e}")
                
        # Process Plaintext (just in case they have txt files)
        elif filename.endswith(".txt"):
            print(f"Reading {filename}...")
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                    all_chunks.extend(sliding_window_chunking(content, filename, 1))
            except Exception as e:
                print(f"Failed to read TXT {filename}: {e}")

    total_chunks = len(all_chunks)
    print(f"\nExtraction complete! Generated {total_chunks} highly-optimized semantic chunks.")
    
    if total_chunks == 0:
        print("No documents found to ingest or chunks created.")
        return

    # 3. Batch Embed to prevent Out Of Memory (OOM) Errors on large 2000+ page datasets
    print("Starting Batch Embedding Process (This may take several minutes)...")
    
    for i in range(0, total_chunks, BATCH_SIZE):
        batch = all_chunks[i:i + BATCH_SIZE]
        
        texts = [item["text"] for item in batch]
        metadatas = [item["metadata"] for item in batch]
        ids = [f"{item['metadata']['source']}_page{item['metadata']['page']}_chunk{idx}" for idx, item in enumerate(batch)]
        
        print(f"  -> Embedding batch {min(i+BATCH_SIZE, total_chunks)} / {total_chunks}...")
        embeddings = model.encode(texts).tolist()
        
        collection.add(
            embeddings=embeddings,
            documents=texts,
            metadatas=metadatas,
            ids=ids
        )

    print("\n✅ Knowledge base successfully ingested into Vector Database!")

if __name__ == "__main__":
    ingest_documents()
