from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy import create_engine, Column, Integer, String, JSON, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import enum
from typing import Optional, Dict, Any

# ==========================================
# CONFIGURATION & SECURITY
# ==========================================
# Secret key for JWT signing (In production, load from environment variables!)
SECRET_KEY = "upzeal_super_secret_dev_key_2026"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 1 week

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# ==========================================
# DATABASE SETUP (SQLite for fast prototyping)
# ==========================================
SQLALCHEMY_DATABASE_URL = "sqlite:///./upzeal.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class OnboardingPhase(str, enum.Enum):
    PHASE_1_REGISTERED = "phase_1"
    PHASE_2_DASHBOARD = "phase_2"
    PHASE_3_COMPLETED = "phase_3"

class UserDB(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=True) # Nullable for OAuth users
    first_name = Column(String)
    last_name = Column(String)
    auth_provider = Column(String, default="email") # 'email', 'google', 'github'
    
    # Tracking the multi-step UI progress
    onboarding_phase = Column(String, default=OnboardingPhase.PHASE_1_REGISTERED.value)
    
    # JSON columns to store step 2 & 3 data flexibly
    dashboard_config = Column(JSON, default={})
    profile_details = Column(JSON, default={})

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# PYDANTIC SCHEMAS (Data Validation)
# ==========================================
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str

class Token(BaseModel):
    access_token: str
    token_type: str

class DashboardConfig(BaseModel):
    organization_name: str
    tech_stack: list[str]
    default_repo: str

class ProfileFinalize(BaseModel):
    role: str
    bio: Optional[str] = None
    github_url: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    onboarding_phase: str
    dashboard_config: Dict[str, Any]
    profile_details: Dict[str, Any]

    class Config:
        from_attributes = True

# ==========================================
# HELPER FUNCTIONS
# ==========================================
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if user is None:
        raise credentials_exception
    return user

# ==========================================
# FASTAPI APP & ROUTES
# ==========================================
app = FastAPI(title="Up Zeal Backend API")

@app.post("/auth/register", response_model=Token)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """Phase 1: Register Identity via Email/Password"""
    db_user = db.query(UserDB).filter(UserDB.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user.password)
    new_user = UserDB(
        email=user.email,
        hashed_password=hashed_pw,
        first_name=user.first_name,
        last_name=user.last_name,
        auth_provider="email",
        onboarding_phase=OnboardingPhase.PHASE_1_REGISTERED.value
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Automatically log them in after registration
    access_token = create_access_token(data={"sub": new_user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/login", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Standard Login Endpoint"""
    user = db.query(UserDB).filter(UserDB.email == form_data.username).first()
    if not user or not user.hashed_password:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
        
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/auth/{provider}/login")
def oauth_login_placeholder(provider: str):
    """
    Placeholder for Google/GitHub OAuth.
    In production, use Authlib to redirect to provider, get profile, 
    and then issue the same JWT token as the standard login.
    """
    if provider not in ["google", "github"]:
        raise HTTPException(status_code=400, detail="Unsupported provider")
    return {"message": f"Redirecting to {provider.capitalize()} OAuth..."}

@app.get("/users/me", response_model=UserResponse)
def read_users_me(current_user: UserDB = Depends(get_current_user)):
    """Fetch current user state to load the correct UI step on the frontend."""
    return current_user

@app.put("/users/me/dashboard", response_model=UserResponse)
def update_dashboard_config(config: DashboardConfig, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """Phase 2: Configure Workspace/Dashboard"""
    current_user.dashboard_config = config.dict()
    current_user.onboarding_phase = OnboardingPhase.PHASE_2_DASHBOARD.value
    db.commit()
    db.refresh(current_user)
    return current_user

@app.put("/users/me/profile", response_model=UserResponse)
def finalize_profile(profile: ProfileFinalize, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    """Phase 3: Finalize Profile"""
    current_user.profile_details = profile.dict()
    current_user.onboarding_phase = OnboardingPhase.PHASE_3_COMPLETED.value
    db.commit()
    db.refresh(current_user)
    return current_user

@app.get("/")
def root():
    return {"status": "Up Zeal API is running", "meeting_ready": True}