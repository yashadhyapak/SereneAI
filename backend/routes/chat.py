from fastapi import APIRouter, Depends
from pydantic import BaseModel
from models.schemas import ChatRequest, ChatMessage as ChatMessageSchema, ChatSessionResponse
from sqlalchemy.orm import Session
from database import get_db
from models import db_models
from services.rag_service import generate_empathetic_response

router = APIRouter()

@router.post("/chat/sessions", response_model=ChatSessionResponse)
def create_chat_session(user_id: int, db: Session = Depends(get_db)):
    session_count = db.query(db_models.ChatSession).filter(db_models.ChatSession.user_id == user_id).count()
    title = f"Conversation {session_count + 1}"
    
    db_session = db_models.ChatSession(user_id=user_id, title=title)
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    
    return ChatSessionResponse(
        id=db_session.id,
        user_id=db_session.user_id,
        title=db_session.title,
        created_at=db_session.created_at.isoformat()
    )

@router.get("/chat/sessions/{user_id}")
def get_chat_sessions(user_id: int, db: Session = Depends(get_db)):
    sessions = db.query(db_models.ChatSession).filter(db_models.ChatSession.user_id == user_id).order_by(db_models.ChatSession.created_at.desc()).all()
    out = []
    for s in sessions:
        out.append({
            "id": s.id, "user_id": s.user_id, "title": s.title, "created_at": s.created_at.isoformat()
        })
    return {"sessions": out}

@router.get("/chat/session/{session_id}")
def get_session_messages(session_id: int, db: Session = Depends(get_db)):
    chats = db.query(db_models.ChatMessage).filter(db_models.ChatMessage.session_id == session_id).order_by(db_models.ChatMessage.timestamp.asc()).all()
    out = []
    for c in chats:
        out.append({
            "id": c.id, "user_id": c.user_id, "session_id": c.session_id, "message": c.message,
            "response": c.response, "timestamp": c.timestamp.isoformat()
        })
    return {"chats": out}

@router.post("/chat", response_model=ChatMessageSchema)
def send_message(request: ChatRequest, db: Session = Depends(get_db)):
    """Send a message and receive an empathetic AI response using RAG."""
    session_id = request.session_id
    if not session_id:
        session_count = db.query(db_models.ChatSession).filter(db_models.ChatSession.user_id == request.user_id).count()
        title = f"Conversation {session_count + 1}"
        new_session = db_models.ChatSession(user_id=request.user_id, title=title)
        db.add(new_session)
        db.commit()
        db.refresh(new_session)
        session_id = new_session.id

    response_text = generate_empathetic_response(request.message)
    
    db_chat = db_models.ChatMessage(
        user_id=request.user_id,
        session_id=session_id,
        message=request.message,
        response=response_text
    )
    db.add(db_chat)
    db.commit()
    db.refresh(db_chat)
    
    return ChatMessageSchema(
        id=db_chat.id,
        user_id=db_chat.user_id,
        session_id=db_chat.session_id,
        message=db_chat.message,
        response=db_chat.response,
        timestamp=db_chat.timestamp.isoformat()
    )
