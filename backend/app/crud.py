from app.supabase_client import supabase_client
from app.security import sanitize_string

class UserRepository:
    @staticmethod
    async def get_user_by_id(user_id: str) -> dict:
        return await supabase_client.get_single("users", {"id": f"eq.{user_id}"})

    @staticmethod
    async def update_dashboard(user_id: str, tech_stack: list[str]) -> dict:
        user = await UserRepository.get_user_by_id(user_id)
        config = user.get("dashboard_config") or {}
        config["tech_stack"] = [sanitize_string(s) for s in tech_stack]

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
        user = await UserRepository.get_user_by_id(user_id)
        profile = user.get("profile_details") or {}
        
        if bio is not None:
            profile["bio"] = sanitize_string(bio)
        if location is not None:
            profile["location"] = sanitize_string(location)
        if avatar_url is not None:
            profile["avatar_url"] = avatar_url.strip()

        results = await supabase_client.update(
            "users",
            {
                "profile_details": profile,
                "onboarding_phase": "phase_3"
            },
            {"id": f"eq.{user_id}"}
        )
        return results[0] if results else {}


class ChallengeRepository:
    @staticmethod
    async def get_all_challenges(user_id: str = None) -> list:
        projects = await supabase_client.get("projects", {"select": "*, companies(id, name, logo_url)"})
        skills = await supabase_client.get("required_skills", {"select": "project_id, skill_name"})
        
        user_apps = []
        if user_id:
            user_apps = await supabase_client.get("applications", {"developer_id": f"eq.{user_id}"})
        
        skills_map = {}
        for s in skills:
            pid = s.get("project_id")
            if pid not in skills_map:
                skills_map[pid] = []
            skills_map[pid].append(s.get("skill_name"))

        apps_map = {a.get("project_id"): a.get("status") for a in user_apps}

        counts = await supabase_client.get("project_participant_counts")
        counts_map = {c.get("project_id"): c.get("participant_count", 0) for c in counts}

        res = []
        for index, p in enumerate(projects):
            pid = p.get("id")
            req_skills = skills_map.get(pid, [])
            res.append({
                "id": pid,
                "rank": f"#{index + 1}",
                "name": p.get("title"),
                "description": p.get("description"),
                "budget": p.get("budget"),
                "author": p.get("companies", {}).get("name") if p.get("companies") else "Upzeal Client Partner",
                "avatar": p.get("companies", {}).get("logo_url") if p.get("companies") else "",
                "created_at": p.get("created_at"),
                "status": "Public" if p.get("status") in ["open", "public"] else "🔒 Private",
                "appStatus": apps_map.get(pid),
                "skills": req_skills,
                "participants": str(counts_map.get(pid, 0))
            })
        return res

    @staticmethod
    async def join_challenge(user_id: str, project_id: str) -> dict:
        # Create application record
        app_res = await supabase_client.insert("applications", {
            "project_id": project_id,
            "developer_id": user_id,
            "status": "pending"
        })

        # Fetch skills for this project
        req_skills = await supabase_client.get("required_skills", {"project_id": f"eq.{project_id}"})
        skill_names = [s.get("skill_name") for s in req_skills]

        # Award +50 points to each skill
        for skill in skill_names:
            current = await supabase_client.get("skill_scores", {
                "user_id": f"eq.{user_id}",
                "skill_name": f"eq.{skill}"
            })
            if current:
                row = current[0]
                new_score = (row.get("score") or 0) + 50
                await supabase_client.update("skill_scores", {"score": new_score}, {"id": f"eq.{row['id']}"})
            else:
                await supabase_client.insert("skill_scores", {
                    "user_id": user_id,
                    "skill_name": skill,
                    "score": 50,
                    "verified": False
                })

        # Award +50 XP to user profile_details
        user = await UserRepository.get_user_by_id(user_id)
        details = user.get("profile_details") or {}
        details["xp"] = (int(details.get("xp") or 0)) + 50
        await supabase_client.update("users", {"profile_details": details}, {"id": f"eq.{user_id}"})

        return {"status": "joined", "xp_added": 50, "application": app_res[0] if app_res else {}}


class SkillRepository:
    @staticmethod
    async def get_user_skills(user_id: str) -> list:
        return await supabase_client.get("skill_scores", {"user_id": f"eq.{user_id}"})


class CompanyRepository:
    @staticmethod
    async def get_company_by_creator(user_id: str) -> dict:
        companies = await supabase_client.get("companies", {"created_by": f"eq.{user_id}"})
        return companies[0] if companies else {}

    @staticmethod
    async def save_company_profile(user_id: str, name: str, logo_url: str = None, website: str = None, description: str = None) -> dict:
        existing = await CompanyRepository.get_company_by_creator(user_id)
        payload = {
            "name": sanitize_string(name),
            "logo_url": logo_url.strip() if logo_url else "",
            "website": sanitize_string(website),
            "description": sanitize_string(description),
            "created_by": user_id
        }
        if existing and existing.get("id"):
            res = await supabase_client.update("companies", payload, {"id": f"eq.{existing['id']}"})
        else:
            res = await supabase_client.insert("companies", payload)
        return res[0] if res else {}


class EvaluationRepository:
    @staticmethod
    async def run_evaluation(user_id: str) -> dict:
        from app.services.evaluation_engine import EvaluationEngine
        return await EvaluationEngine.evaluate_developer(user_id)

