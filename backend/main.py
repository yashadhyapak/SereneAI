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
demo_accounts = [
    {"name": "Demo User", "email": "demo@serene.ai", "password_hash": "demo123"},
    {"name": "Test User", "email": "test@serene.ai", "password_hash": "test123"},
    {"name": "Faculty Evaluator", "email": "faculty@serene.ai", "password_hash": "faculty123"}
]
for acc in demo_accounts:
    if not db.query(db_models.User).filter(db_models.User.email == acc["email"]).first():
        db.add(db_models.User(**acc))
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
