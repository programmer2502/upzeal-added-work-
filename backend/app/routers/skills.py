from fastapi import APIRouter, Depends
from app.dependencies import get_current_user, require_role
from app.crud import SkillRepository
from app.supabase_client import supabase_client

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("/me")
async def get_my_skills(current_user: dict = Depends(get_current_user)):
    """Fetch the authenticated user's skill scores from the database."""
    return await SkillRepository.get_user_skills(current_user["id"])


@router.get("/developers")
async def list_developers(current_user: dict = Depends(require_role(["recruiter"]))):
    """Fetch developer profiles with their skill scores (Recruiter only).
    Returns real candidate data instead of hardcoded dummy profiles.
    """
    from app.supabase_client import db_cache

    cached_devs = db_cache.get("recruiter_developers_list")
    if cached_devs is not None:
        return cached_devs

    # Fetch all users with role 'developer'
    developers = await supabase_client.get("users", {
        "role": "eq.developer",
        "select": "id, username, first_name, last_name, email, profile_details, dashboard_config"
    })

    # Fetch all skill scores in a single query
    all_scores = await supabase_client.get("skill_scores", {
        "select": "user_id, skill_name, score, verified"
    })

    # Fetch all applications to map developer application statuses
    apps = await supabase_client.get("applications", {
        "select": "status, developer_id"
    })

    # Build a lookup: user_id -> list of skills
    scores_map: dict[str, list] = {}
    for s in all_scores:
        uid = s.get("user_id")
        if uid not in scores_map:
            scores_map[uid] = []
        scores_map[uid].append({
            "skill_name": s.get("skill_name"),
            "score": s.get("score", 0),
            "verified": s.get("verified", False)
        })

    app_map = {}
    for app in apps:
        status = app.get("status")
        dev_id = app.get("developer_id")
        if dev_id:
            target_status = 'new'
            if status == 'shortlisted':
                target_status = 'screening'
            elif status == 'hired':
                target_status = 'interviewing'
            app_map[dev_id] = target_status

    result = []
    for dev in developers:
        uid = dev.get("id")
        skills = scores_map.get(uid, [])
        # Sort skills by score descending to show strongest first
        skills.sort(key=lambda x: x.get("score", 0), reverse=True)

        profile = dev.get("profile_details") or {}
        result.append({
            "id": uid,
            "username": dev.get("username"),
            "email": dev.get("email"),
            "first_name": dev.get("first_name"),
            "last_name": dev.get("last_name"),
            "profile_details": profile,
            "dashboard_config": dev.get("dashboard_config"),
            "name": f"{dev.get('first_name', '')} {dev.get('last_name', '')}".strip() or dev.get("username", "Developer"),
            "avatar": profile.get("avatar_url", ""),
            "bio": profile.get("bio", ""),
            "xp": int(profile.get("xp", 0)),
            "skills": skills,
            "application_status": app_map.get(uid, 'new')
        })

    # Sort by total XP descending
    result.sort(key=lambda x: x.get("xp", 0), reverse=True)
    
    # Store list in database cache for 15 seconds
    db_cache.set("recruiter_developers_list", result)
    return result
