from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.security import SecurityHeadersMiddleware
from app.schemas import UserResponseSchema, DashboardConfigUpdate, ProfileUpdate
from app.dependencies import get_current_user
from app.crud import UserRepository
from app.supabase_client import supabase_client
from app.routers import challenges, mentor, company

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    yield
    # Shutdown actions: Close connection pools safely
    await supabase_client.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Upzeal Structured & Secured FastAPI Microservice.",
    version="1.0.0",
    lifespan=lifespan
)

# 1. Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# 2. CORS configurations with configured origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# User Profile Router
user_router = APIRouter(prefix="/users", tags=["Users"])

@user_router.get("/me", response_model=UserResponseSchema)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Fetch current user profile state dynamically."""
    return current_user

@user_router.put("/me/dashboard", response_model=UserResponseSchema)
async def update_dashboard(
    config: DashboardConfigUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update user workspace config."""
    return await UserRepository.update_dashboard(current_user["id"], config.tech_stack)

@user_router.put("/me/profile", response_model=UserResponseSchema)
async def update_profile(
    profile: ProfileUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update user profile fields."""
    return await UserRepository.update_profile(
        current_user["id"],
        bio=profile.bio,
        location=profile.location,
        avatar_url=profile.avatar_url
    )

app.include_router(user_router)
app.include_router(challenges.router)
app.include_router(mentor.router)
app.include_router(company.router)

@app.get("/")
async def root():
    return {"status": "Upzeal API is running", "security": "enhanced", "version": "1.0.0"}
