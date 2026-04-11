from fastapi import APIRouter, Depends
from models.schemas import InsightResponse
from sqlalchemy.orm import Session
from database import get_db
from models import db_models
from services.llm_rotator import is_llm_available, generate_content_with_rotator
import json

llm_available = is_llm_available()
router = APIRouter()

def _get_insight_stats(user_id: int, db: Session):
    total_entries = db.query(db_models.DiaryEntry).filter(db_models.DiaryEntry.user_id == user_id).count()
    total_chats = db.query(db_models.ChatMessage).filter(db_models.ChatMessage.user_id == user_id).count()
    return total_entries, total_chats

@router.get("/insights/{user_id}", response_model=InsightResponse)
def get_insights(user_id: int, db: Session = Depends(get_db)):
    """Get emotional insights without hitting LLM."""
    total_entries, total_chats = _get_insight_stats(user_id, db)
    
    insight = db.query(db_models.UserInsight).filter(db_models.UserInsight.user_id == user_id).first()
    if not insight:
        return InsightResponse(
            user_id=user_id, total_entries=total_entries, total_chats=total_chats, keywords=[],
            mood_summary="Click 'Analyze My Journal' below to generate your psychological insights.",
            weekly_insight="Start journaling and logging your thoughts.",
            optimism_level="N/A", dominant_emotion="N/A", primary_stressor="N/A",
            emotional_volatility="N/A", coping_strategy="N/A",
            can_analyze=(total_entries >= 3)
        )
    
    can_analyze = total_entries >= 3 and total_entries > insight.last_analyzed_diary_count

    try:
        keywords = json.loads(insight.keywords) if insight.keywords else []
    except:
        keywords = []

    return InsightResponse(
        user_id=user_id,
        total_entries=total_entries,
        total_chats=total_chats,
        keywords=keywords,
        mood_summary=insight.mood_summary,
        weekly_insight=insight.weekly_insight,
        optimism_level=insight.optimism_level,
        dominant_emotion=insight.dominant_emotion,
        primary_stressor=insight.primary_stressor,
        emotional_volatility=insight.emotional_volatility,
        coping_strategy=insight.coping_strategy,
        can_analyze=can_analyze
    )

@router.post("/insights/{user_id}/analyze", response_model=InsightResponse)
def analyze_insights(user_id: int, db: Session = Depends(get_db)):
    total_entries, total_chats = _get_insight_stats(user_id, db)
    
    if total_entries < 3:
        return get_insights(user_id, db) 

    entries = db.query(db_models.DiaryEntry).filter(db_models.DiaryEntry.user_id == user_id).order_by(db_models.DiaryEntry.date.desc()).limit(10).all()
    text_content = "\n".join([f"- {e.date.date()}: {e.content}" for e in entries])

    mood_summary = "Keep writing to allow deeper analysis of your mood."
    weekly_insight = f"You have written {len(entries)} diary entries recently."
    optimism_level, dominant_emotion, primary_stressor = "Evaluating...", "Evaluating...", "Evaluating..."
    emotional_volatility, coping_strategy = "Evaluating...", "Keep writing to unlock strategies."
    keywords = []

    if llm_available:
        try:
            prompt = f"Analyze these recent mental health diary entries from a user.\n{text_content}\n" \
                     f"Return exactly in this format:\nMood Summary: <2-sentence summary>\nWeekly Insight: <1-sentence insight>\n" \
                     f"Keywords: <word, word, word>\nOptimism Level: <Optimistic/Neutral/Pessimistic>\n" \
                     f"Dominant Emotion: <One word>\nPrimary Stressor: <Short phrase>\n" \
                     f"Emotional Volatility: <High/Medium/Low>\nCoping Strategy: <1-sentence actionable strategy>"
            
            response_text = generate_content_with_rotator(prompt)
            lines = [line.strip() for line in response_text.split("\n") if line.strip()]
            for line in lines:
                if line.startswith("Mood Summary:"): mood_summary = line.replace("Mood Summary:", "").strip()
                if line.startswith("Weekly Insight:"): weekly_insight = line.replace("Weekly Insight:", "").strip()
                if line.startswith("Optimism Level:"): optimism_level = line.replace("Optimism Level:", "").strip()
                if line.startswith("Dominant Emotion:"): dominant_emotion = line.replace("Dominant Emotion:", "").strip()
                if line.startswith("Primary Stressor:"): primary_stressor = line.replace("Primary Stressor:", "").strip()
                if line.startswith("Emotional Volatility:"): emotional_volatility = line.replace("Emotional Volatility:", "").strip()
                if line.startswith("Coping Strategy:"): coping_strategy = line.replace("Coping Strategy:", "").strip()
                if line.startswith("Keywords:"): 
                    kw = line.replace("Keywords:", "").strip().split(",")
                    keywords = [k.strip() for k in kw][:5]
        except Exception as e:
            mood_summary = f"Error communicating with AI: {str(e)}"
    
    insight = db.query(db_models.UserInsight).filter(db_models.UserInsight.user_id == user_id).first()
    if not insight:
        insight = db_models.UserInsight(user_id=user_id)
        db.add(insight)

    insight.mood_summary = mood_summary
    insight.weekly_insight = weekly_insight
    insight.optimism_level = optimism_level
    insight.dominant_emotion = dominant_emotion
    insight.primary_stressor = primary_stressor
    insight.emotional_volatility = emotional_volatility
    insight.coping_strategy = coping_strategy
    insight.keywords = json.dumps(keywords)
    insight.last_analyzed_diary_count = total_entries

    db.commit()

    return get_insights(user_id, db)
