from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.diary import router as diary_router
from routes.insights import router as insights_router
from database import engine, SessionLocal
from models import db_models

# Create database tables
db_models.Base.metadata.create_all(bind=engine)

# Seed Demo Accounts
db = SessionLocal()
existing_demo = db.query(db_models.User).filter(db_models.User.email == "demo@serene.ai").first()
if not existing_demo:
    demo_user = db_models.User(name="Demo User", email="demo@serene.ai", password_hash="demo123")
    test_user = db_models.User(name="Test User", email="test@serene.ai", password_hash="test123")
    db.add(demo_user)
    db.add(test_user)
    db.commit()
db.close()


app = FastAPI(
    title="Serene.AI API",
    description="Backend API for Serene.AI Mental Health Companion",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api", tags=["Authentication"])
app.include_router(chat_router, prefix="/api", tags=["Chat"])
app.include_router(diary_router, prefix="/api", tags=["Diary"])
app.include_router(insights_router, prefix="/api", tags=["Insights"])

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "message": "Serene.AI API is running"}

@app.get("/", tags=["Root"])
def root():
    return {"message": "Welcome to Serene.AI API", "docs": "/docs"}
