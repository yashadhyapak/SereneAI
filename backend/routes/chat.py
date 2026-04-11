from fastapi import APIRouter, Depends
from models.schemas import ChatRequest, ChatMessage
from sqlalchemy.orm import Session
from database import get_db
from models import db_models
from services.rag_service import generate_empathetic_response

router = APIRouter()

@router.post("/chat", response_model=ChatMessage)
def send_message(request: ChatRequest, db: Session = Depends(get_db)):
    """Send a message and receive an empathetic AI response using RAG."""
    # (Future step: Embed user message and search local ChromaDB vector store here)
    # top_chunks = my_chroma_db_search(request.message) 
    response_text = generate_empathetic_response(request.message)
    
    db_chat = db_models.ChatMessage(
        user_id=request.user_id,
        message=request.message,
        response=response_text
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    
    return ChatMessage(
        id=db_chat.id,
        user_id=db_chat.user_id,
        message=db_chat.message,
        response=db_chat.response,
        timestamp=db_chat.timestamp.isoformat()
    )

@router.get("/chat/{user_id}")
def get_chat_history(user_id: int, db: Session = Depends(get_db)):
    """Get chat history for a specific user."""
    chats = db.query(db_models.ChatMessage).filter(db_models.ChatMessage.user_id == user_id).all()
    out = []
    for c in chats:
        out.append({
            "id": c.id, "user_id": c.user_id, "message": c.message,
            "response": c.response, "timestamp": c.timestamp.isoformat()
        })
    return {"chats": out}
