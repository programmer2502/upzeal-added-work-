from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any

class UserResponseSchema(BaseModel):
    id: str
    email: str
    first_name: Optional[str] = ""
    last_name: Optional[str] = ""
    role: Optional[str] = "developer"
    auth_provider: Optional[str] = "email"
    onboarding_phase: Optional[str] = "phase_1"
    dashboard_config: Optional[Dict[str, Any]] = {}
    profile_details: Optional[Dict[str, Any]] = {}

    class Config:
        from_attributes = True

class DashboardConfigUpdate(BaseModel):
    tech_stack: list[str]

class ProfileUpdate(BaseModel):
    bio: Optional[str] = None
    location: Optional[str] = None
    avatar_url: Optional[str] = None
