import asyncio
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.supabase_client import supabase_client, token_cache, user_profile_cache

security_scheme = HTTPBearer()

# Request coalescing dictionary to group concurrent duplicate auth requests
_token_verification_tasks = {}
_user_profile_tasks = {}

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> dict:
    token = credentials.credentials
    try:
        # Check cache for verified token
        auth_user = token_cache.get(token)
        if not auth_user:
            # Check if verification for this token is already in progress
            if token in _token_verification_tasks:
                auth_user = await _token_verification_tasks[token]
            else:
                # Start new verification task and register it
                task = asyncio.create_task(supabase_client.verify_token(token))
                _token_verification_tasks[token] = task
                try:
                    auth_user = await task
                    token_cache.set(token, auth_user)
                finally:
                    _token_verification_tasks.pop(token, None)

        user_id = auth_user.get("id")
        if not user_id:
            raise Exception("No user ID found in session credentials")
            
        # Check cache for user profile
        user_profile = user_profile_cache.get(user_id)
        if not user_profile:
            # Check if profile fetch for this user_id is already in progress
            if user_id in _user_profile_tasks:
                user_profile = await _user_profile_tasks[user_id]
            else:
                # Start new profile fetch task and register it
                task = asyncio.create_task(supabase_client.get_single(
                    "users", 
                    {"id": f"eq.{user_id}"}
                ))
                _user_profile_tasks[user_id] = task
                try:
                    user_profile = await task
                    if not user_profile:
                        user_profile = {
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
                    user_profile_cache.set(user_id, user_profile)
                finally:
                    _user_profile_tasks.pop(user_id, None)

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
