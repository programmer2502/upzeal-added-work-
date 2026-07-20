from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user
from app.schemas import CompanyProfileSchema
from app.crud import CompanyRepository

router = APIRouter(prefix="/company", tags=["Company Profile"])

@router.get("/me")
async def get_my_company(current_user: dict = Depends(get_current_user)):
    """Fetch company profile created by the logged in user."""
    return await CompanyRepository.get_company_by_creator(current_user["id"])

@router.post("/profile")
async def save_company_profile(req: CompanyProfileSchema, current_user: dict = Depends(get_current_user)):
    """Save or update company profile securely."""
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
