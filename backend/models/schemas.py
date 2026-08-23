from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    confirm_password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str

class ChatSessionResponse(BaseModel):
    id: int
    user_id: int
    title: str
    created_at: str

class ChatRequest(BaseModel):
    user_id: int
    message: str
    session_id: Optional[int] = None

class ChatMessage(BaseModel):
    id: int
    user_id: int
    session_id: Optional[int] = None
    message: str
    response: str
    timestamp: str

class DiaryEntryRequest(BaseModel):
    user_id: int
    content: str

class DiaryEntry(BaseModel):
    id: int
    user_id: int
    content: str
    date: str
    preview: str

class InsightResponse(BaseModel):
    user_id: int
    total_entries: int
    total_chats: int
    keywords: List[str]
    mood_summary: str
    weekly_insight: str
    optimism_level: str
    dominant_emotion: str
    primary_stressor: str
    emotional_volatility: str
    coping_strategy: str
    can_analyze: bool
