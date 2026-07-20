from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user, require_role
from app.schemas import CompanyProfileSchema
from app.crud import CompanyRepository

router = APIRouter(prefix="/company", tags=["Company Profile"])

@router.get("/me")
async def get_my_company(current_user: dict = Depends(require_role(["recruiter"]))):
    """Fetch company profile created by logged-in recruiter (Recruiter role required)."""
    return await CompanyRepository.get_company_by_creator(current_user["id"])

@router.post("/profile")
async def save_company_profile(
    req: CompanyProfileSchema, 
    current_user: dict = Depends(require_role(["recruiter"]))
):
    """Save or update company profile securely (Recruiter role required)."""
    try:
        return await CompanyRepository.save_company_profile(
            user_id=current_user["id"],
            name=req.name,
            logo_url=req.logo_url,
            website=req.website,
            description=req.description
        )
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
