from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user, require_role
from app.schemas import JoinChallengeRequest
from app.crud import ChallengeRepository

router = APIRouter(prefix="/challenges", tags=["Challenges"])

@router.get("/")
async def list_challenges(current_user: dict = Depends(get_current_user)):
    """Fetch all company challenges dynamically with participant counts and app status."""
    return await ChallengeRepository.get_all_challenges(user_id=current_user["id"])

@router.post("/join")
async def join_challenge(
    req: JoinChallengeRequest, 
    current_user: dict = Depends(require_role(["developer"]))
):
    """Join a challenge (Developer role required). Earns +50 points per skill and profile XP."""
    try:
        return await ChallengeRepository.join_challenge(user_id=current_user["id"], project_id=req.project_id)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
