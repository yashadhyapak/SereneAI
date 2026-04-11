from fastapi import APIRouter, HTTPException, Depends
from models.schemas import LoginRequest, RegisterRequest, UserResponse
from sqlalchemy.orm import Session
from database import get_db
from models import db_models

router = APIRouter()

@router.post("/login", response_model=UserResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user with email and password."""
    user = db.query(db_models.User).filter(db_models.User.email == request.email).first()
    if user and user.password_hash == request.password:
        return UserResponse(id=user.id, name=user.name, email=user.email)
    raise HTTPException(status_code=401, detail="Invalid email or password")

@router.post("/register", response_model=UserResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """Register a new user."""
    if request.password != request.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    existing_user = db.query(db_models.User).filter(db_models.User.email == request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = db_models.User(
        name=request.name,
        email=request.email,
        password_hash=request.password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return UserResponse(id=new_user.id, name=new_user.name, email=new_user.email)
