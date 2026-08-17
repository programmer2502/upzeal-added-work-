from fastapi import APIRouter, Depends, HTTPException, status
from app.dependencies import get_current_user, require_role
from app.crud import EvaluationRepository

router = APIRouter(prefix="/evaluation", tags=["AI Evaluation Engine"])

@router.post("/evaluate")
async def evaluate_developer(
    target_user_id: str = None,
    current_user: dict = Depends(get_current_user)
):
    """
    Trigger the AI Evaluation Engine.
    If target_user_id is provided, recruiters/admins can evaluate that developer.
    Otherwise, the developer evaluates themselves.
    """
    try:
        # Default to self-evaluation if no target_user_id is provided
        user_id_to_eval = target_user_id or current_user["id"]
        
        # Check permissions: if evaluating someone else, must be recruiter or admin
        if target_user_id and target_user_id != current_user["id"]:
            if current_user.get("role") not in ["recruiter", "admin"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Only recruiters and admins can evaluate other developers."
                )

        return await EvaluationRepository.run_evaluation(user_id_to_eval)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/my-evaluation")
async def get_my_evaluation(current_user: dict = Depends(require_role(["developer"]))):
    """Fetch the current logged-in developer's latest evaluation report."""
    try:
        # Check if we already have a cached evaluation report in profile_details
        profile_details = current_user.get("profile_details") or {}
        cached_report = profile_details.get("evaluation_report")
        if cached_report:
            return cached_report

        # Otherwise, run it once, which will save it to profile_details
        return await EvaluationRepository.run_evaluation(current_user["id"])
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
