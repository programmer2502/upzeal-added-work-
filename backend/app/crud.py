from app.supabase_client import supabase_client

class UserRepository:
    @staticmethod
    async def get_user_by_id(user_id: str) -> dict:
        return await supabase_client.get_single("users", {"id": f"eq.{user_id}"})

    @staticmethod
    async def update_dashboard(user_id: str, tech_stack: list[str]) -> dict:
        # Load user profile to merge dashboard config safely
        user = await UserRepository.get_user_by_id(user_id)
        config = user.get("dashboard_config") or {}
        config["tech_stack"] = tech_stack

        results = await supabase_client.update(
            "users",
            {
                "dashboard_config": config,
                "onboarding_phase": "phase_2"
            },
            {"id": f"eq.{user_id}"}
        )
        return results[0] if results else {}

    @staticmethod
    async def update_profile(user_id: str, bio: str = None, location: str = None, avatar_url: str = None) -> dict:
        # Load profile to merge profile details safely
        user = await UserRepository.get_user_by_id(user_id)
        profile = user.get("profile_details") or {}
        
        if bio is not None:
            profile["bio"] = bio
        if location is not None:
            profile["location"] = location
        if avatar_url is not None:
            profile["avatar_url"] = avatar_url

        results = await supabase_client.update(
            "users",
            {
                "profile_details": profile,
                "onboarding_phase": "phase_3"
            },
            {"id": f"eq.{user_id}"}
        )
        return results[0] if results else {}
