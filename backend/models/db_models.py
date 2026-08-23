from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

    chats = relationship("ChatMessage", back_populates="user")
    diary_entries = relationship("DiaryEntry", back_populates="user")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String, default="New Conversation")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(Integer, ForeignKey("chat_sessions.id"), nullable=True) # Optional for backward compatibility with old data
    message = Column(Text)
    response = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="chats")
    session = relationship("ChatSession", back_populates="messages")

class DiaryEntry(Base):
    __tablename__ = "diary_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    date = Column(DateTime(timezone=True), server_default=func.now())
    emotion_label = Column(String, nullable=True)  # Store the LLM classified emotion

    user = relationship("User", back_populates="diary_entries")

class UserInsight(Base):
    __tablename__ = "user_insights"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True)
    mood_summary = Column(Text, default="Start journaling and logging your thoughts.")
    weekly_insight = Column(Text, default="Keep writing to allow deeper analysis of your mood.")
    optimism_level = Column(String, default="N/A")
    dominant_emotion = Column(String, default="N/A")
    primary_stressor = Column(String, default="N/A")
    emotional_volatility = Column(String, default="N/A")
    coping_strategy = Column(String, default="N/A")
    keywords = Column(Text, default="")
    last_analyzed_diary_count = Column(Integer, default=0)

    user = relationship("User")
