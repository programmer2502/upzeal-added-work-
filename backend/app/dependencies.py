from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.supabase_client import supabase_client

security_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> dict:
    token = credentials.credentials
    try:
        auth_user = await supabase_client.verify_token(token)
        user_id = auth_user.get("id")
        if not user_id:
            raise Exception("No user ID found in session credentials")
            
        user_profile = await supabase_client.get_single(
            "users", 
            {"id": f"eq.{user_id}"}
        )
        if not user_profile:
            return {
                "id": user_id,
                "email": auth_user.get("email"),
                "username": auth_user.get("user_metadata", {}).get("username", ""),
                "first_name": auth_user.get("user_metadata", {}).get("first_name", ""),
                "last_name": auth_user.get("user_metadata", {}).get("last_name", ""),
                "role": auth_user.get("user_metadata", {}).get("role", "developer"),
                "onboarding_phase": "phase_1",
                "dashboard_config": {},
                "profile_details": {}
            }
        return user_profile
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_role(allowed_roles: list[str]):
    async def role_checker(current_user: dict = Depends(get_current_user)):
        user_role = current_user.get("role", "developer")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. User role '{user_role}' does not have permission to perform this action."
            )
        return current_user
    return role_checker
