from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any

class UserResponseSchema(BaseModel):
    id: str
    email: str
    username: Optional[str] = ""
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
    tech_stack: List[str] = Field(..., max_items=20)

class ProfileUpdate(BaseModel):
    bio: Optional[str] = Field(None, max_length=1000)
    location: Optional[str] = Field(None, max_length=200)
    avatar_url: Optional[str] = Field(None, max_length=100000)

class JoinChallengeRequest(BaseModel):
    project_id: str

class SkillScoreSchema(BaseModel):
    skill_name: str
    score: int = Field(0, ge=0, le=10000)
    verified: bool = False

class MentorQueryRequest(BaseModel):
    query: str = Field(..., max_length=500)

class MentorResponse(BaseModel):
    reply: str

class CompanyProfileSchema(BaseModel):
    name: str = Field(..., max_length=150)
    logo_url: Optional[str] = Field(None, max_length=100000)
    website: Optional[str] = Field(None, max_length=500)
    description: Optional[str] = Field(None, max_length=2000)
