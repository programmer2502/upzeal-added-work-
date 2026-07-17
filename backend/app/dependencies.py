from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.supabase_client import supabase_client

security_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> dict:
    token = credentials.credentials
    try:
        # Verify user token with Supabase Auth API
        auth_user = await supabase_client.verify_token(token)
        user_id = auth_user.get("id")
        if not user_id:
            raise Exception("No user ID found in session credentials")
            
        # Fetch matching record from our public users table
        user_profile = await supabase_client.get_single(
            "users", 
            {"id": f"eq.{user_id}"}
        )
        if not user_profile:
            # Fallback if trigger hasn't completed or profile details are not created
            return {
                "id": user_id,
                "email": auth_user.get("email"),
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
