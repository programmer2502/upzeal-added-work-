import asyncio
from app.supabase_client import supabase_client, user_profile_cache, db_cache
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

        profile = user.get("profile_details") or {}
        profile.pop("evaluation_report", None)  # Invalidate cached report since stack changed

        results = await supabase_client.update(
            "users",
            {
                "dashboard_config": config,
                "profile_details": profile,
                "onboarding_phase": "phase_2"
            },
            {"id": f"eq.{user_id}"}
        )
        user_profile_cache.invalidate(user_id)
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
        user_profile_cache.invalidate(user_id)
        return results[0] if results else {}


class ChallengeRepository:
    @staticmethod
    async def get_all_challenges(user_id: str = None) -> list:
        # Check database cache for static lists to avoid Supabase requests
        projects = db_cache.get("all_projects")
        skills = db_cache.get("all_skills")
        counts = db_cache.get("all_counts")

        missing_tasks = []
        if not projects:
            projects_task = supabase_client.get("projects", {"select": "*, companies(id, name, logo_url)"})
            missing_tasks.append(("projects", projects_task))
        if not skills:
            skills_task = supabase_client.get("required_skills", {"select": "project_id, skill_name"})
            missing_tasks.append(("skills", skills_task))
        if not counts:
            counts_task = supabase_client.get("applications", {"select": "project_id"})
            missing_tasks.append(("counts", counts_task))
        
        # Always fetch user applications dynamically
        user_apps = []
        if user_id:
            user_apps_task = supabase_client.get("applications", {"developer_id": f"eq.{user_id}"})
            missing_tasks.append(("user_apps", user_apps_task))

        if missing_tasks:
            keys, tasks = zip(*missing_tasks)
            results = await asyncio.gather(*tasks)
            for key, res_val in zip(keys, results):
                if key == "projects":
                    projects = res_val
                    db_cache.set("all_projects", res_val)
                elif key == "skills":
                    skills = res_val
                    db_cache.set("all_skills", res_val)
                elif key == "counts":
                    counts = res_val
                    db_cache.set("all_counts", res_val)
                elif key == "user_apps":
                    user_apps = res_val
        else:
            # Static data was fully cached; fetch user applications if logged in
            if user_id:
                user_apps = await supabase_client.get("applications", {"developer_id": f"eq.{user_id}"})
        
        skills_map = {}
        for s in skills:
            pid = s.get("project_id")
            if pid not in skills_map:
                skills_map[pid] = []
            skills_map[pid].append(s.get("skill_name"))

        apps_map = {a.get("project_id"): a.get("status") for a in user_apps}
        
        counts_map = {}
        for c in counts:
            pid = c.get("project_id")
            if pid:
                counts_map[pid] = counts_map.get(pid, 0) + 1

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
                "companyId": p.get("companies", {}).get("id") if p.get("companies") else None,
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
    async def join_challenge(user_id: str, project_id: str, token: str = None) -> dict:
        # Invalidate participant counts cache since a new developer is joining
        db_cache.invalidate("all_counts")

        # 1. Start application insertion, required skills fetch, user details fetch, and project details fetch in parallel
        app_res_task = supabase_client.insert("applications", {
            "project_id": project_id,
            "developer_id": user_id,
            "status": "pending"
        }, token=token)
        req_skills_task = supabase_client.get("required_skills", {"project_id": f"eq.{project_id}"})
        user_task = UserRepository.get_user_by_id(user_id)
        project_task = supabase_client.get_single("projects", {"id": f"eq.{project_id}"})

        app_res, req_skills, user, project = await asyncio.gather(
            app_res_task,
            req_skills_task,
            user_task,
            project_task
        )

        skill_names = [s.get("skill_name") for s in req_skills]

        # 2. Batch query all existing user skill scores for these specific skills to avoid sequential SELECTs in a loop
        current_scores = []
        if skill_names:
            skills_filter = ",".join(f'"{s}"' if ' ' in s else s for s in skill_names)
            current_scores = await supabase_client.get("skill_scores", {
                "user_id": f"eq.{user_id}",
                "skill_name": f"in.({skills_filter})"
            })

        current_scores_map = {s.get("skill_name"): s for s in current_scores}

        # 3. Queue update/insert tasks for skill scores
        tasks = []
        for skill in skill_names:
            row = current_scores_map.get(skill)
            if row:
                new_score = min(100, (row.get("score") or 0) + 50)
                tasks.append(supabase_client.update("skill_scores", {"score": new_score}, {"id": f"eq.{row['id']}"}, token=token))
            else:
                tasks.append(supabase_client.insert("skill_scores", {
                    "user_id": user_id,
                    "skill_name": skill,
                    "score": 50,
                    "verified": False
                }, token=token))

        # 4. Award +50 XP to user profile_details & invalidate cached evaluation report
        details = user.get("profile_details") or {}
        details["xp"] = (int(details.get("xp") or 0)) + 50
        details.pop("evaluation_report", None) # Force recalculation of report on next load
        tasks.append(supabase_client.update("users", {"profile_details": details}, {"id": f"eq.{user_id}"}, token=token))

        # 5. Execute all skill and profile updates concurrently
        await asyncio.gather(*tasks)
        user_profile_cache.invalidate(user_id)
        db_cache.invalidate("recruiter_developers_list")

        # 6. Send real-time WebSocket notification to project creator recruiter
        project_creator_id = project.get("created_by")
        app_id = app_res[0].get("id") if app_res else None
        if project_creator_id and app_id:
            from app.ws_manager import manager
            applicant_name = f"{user.get('first_name') or ''} {user.get('last_name') or ''}".strip() or user.get("username") or user.get("email") or "Developer"
            project_title = project.get("title") or "Project"
            await manager.send_json({
                "type": "NEW_APPLICATION",
                "payload": {
                    "app_id": app_id,
                    "project_id": project_id,
                    "project_title": project_title,
                    "applicant_name": applicant_name
                }
            }, project_creator_id)

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
    async def save_company_profile(user_id: str, name: str, logo_url: str = None, website: str = None, description: str = None, token: str = None) -> dict:
        existing = await CompanyRepository.get_company_by_creator(user_id)
        payload = {
            "name": sanitize_string(name),
            "logo_url": logo_url.strip() if logo_url else "",
            "website": sanitize_string(website),
            "description": sanitize_string(description),
            "created_by": user_id
        }
        if existing and existing.get("id"):
            res = await supabase_client.update("companies", payload, {"id": f"eq.{existing['id']}"}, token=token)
        else:
            res = await supabase_client.insert("companies", payload, token=token)
        return res[0] if res else {}


class EvaluationRepository:
    @staticmethod
    async def run_evaluation(user_id: str) -> dict:
        from app.services.evaluation_engine import EvaluationEngine
        return await EvaluationEngine.evaluate_developer(user_id)

