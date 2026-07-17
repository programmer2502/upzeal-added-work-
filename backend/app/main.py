from fastapi import FastAPI, Depends, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import UserResponseSchema, DashboardConfigUpdate, ProfileUpdate
from app.dependencies import get_current_user
from app.crud import UserRepository
from app.supabase_client import supabase_client

app = FastAPI(
    title="Upzeal Structured Backend",
    description="Refactored async FastAPI microservice connected directly to Supabase.",
    version="1.0.0"
)

# CORS configurations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

router = APIRouter()

@router.get("/users/me", response_model=UserResponseSchema)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Fetch current user profile state dynamically."""
    return current_user

@router.put("/users/me/dashboard", response_model=UserResponseSchema)
async def update_dashboard(
    config: DashboardConfigUpdate, 
    current_user: dict = Depends(get_current_user)
):
    """Update user workspace config."""
    return await UserRepository.update_dashboard(current_user["id"], config.tech_stack)

@router.put("/users/me/profile", response_model=UserResponseSchema)
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

@router.get("/")
async def root():
    return {"status": "Upzeal API is running", "async": True}

app.include_router(router)

@app.on_event("shutdown")
async def shutdown_event():
    # Properly shutdown connection pool limits on backend exit
    await supabase_client.close()
