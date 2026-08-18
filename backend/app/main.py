from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.security import SecurityHeadersMiddleware
from app.schemas import UserResponseSchema, DashboardConfigUpdate, ProfileUpdate
from app.dependencies import get_current_user
from app.crud import UserRepository
from app.supabase_client import supabase_client
from app.routers import challenges, mentor, company, evaluation, ws, skills, applications, ongoing_projects

import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    from app.routers.mentor import openrouter_client
    await asyncio.gather(
        supabase_client.close(),
        openrouter_client.aclose()
    )

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Upzeal Structured & Secured FastAPI Microservice with /api/v1 versioning and RBAC.",
    version="1.0.0",
    lifespan=lifespan
)

# Security Headers Middleware & CORS
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Version 1 Master Router (/api/v1)
v1_router = APIRouter(prefix="/api/v1")

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

v1_router.include_router(user_router)
v1_router.include_router(challenges.router)
v1_router.include_router(mentor.router)
v1_router.include_router(company.router)
v1_router.include_router(evaluation.router)
v1_router.include_router(ws.router)
v1_router.include_router(skills.router)
v1_router.include_router(applications.router)
v1_router.include_router(ongoing_projects.router)

app.include_router(v1_router)

@app.get("/")
async def root():
    return {
        "status": "Upzeal API is running",
        "api_version": "v1",
        "docs_url": "/docs",
        "security": "RBAC & Headers Enabled"
    }
