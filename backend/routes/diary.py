from fastapi import APIRouter, Depends
from models.schemas import DiaryEntryRequest, DiaryEntry
from sqlalchemy.orm import Session
from database import get_db
from models import db_models
from services.diary_service import label_emotion

router = APIRouter()

@router.post("/diary", response_model=DiaryEntry)
def create_diary_entry(request: DiaryEntryRequest, db: Session = Depends(get_db)):
    """Create a new diary entry, classify emotion."""
    emotion = "Pending Analysis"
    
    preview = request.content[:50] + "..." if len(request.content) > 50 else request.content
    
    db_diary = db_models.DiaryEntry(
        user_id=request.user_id,
        content=request.content,
        emotion_label=emotion
    )
    db.add(db_diary)
    db.commit()
    db.refresh(db_diary)
    
    return DiaryEntry(
        id=db_diary.id,
        user_id=db_diary.user_id,
        content=db_diary.content,
        date=db_diary.date.strftime("%Y-%m-%d"),
        preview=preview
    )

@router.get("/diary/{user_id}")
def get_diary_entries(user_id: int, db: Session = Depends(get_db)):
    """Get all diary entries for a specific user."""
    entries = db.query(db_models.DiaryEntry).filter(db_models.DiaryEntry.user_id == user_id).order_by(db_models.DiaryEntry.date.desc()).all()
    
    out = []
    for e in entries:
        preview = e.content[:50] + "..." if len(e.content) > 50 else e.content
        out.append({
            "id": e.id, "user_id": e.user_id, "content": e.content,
            "date": e.date.strftime("%Y-%m-%d"), "preview": preview
        })
    return {"entries": out}
