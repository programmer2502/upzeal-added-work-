import os
import re
from app.supabase_client import supabase_client

class EvaluationEngine:
    # Resolve root skills folder relative to backend/app/services/evaluation_engine.py
    SKILLS_DIR = os.path.abspath(os.path.join(
        os.path.dirname(os.path.abspath(__file__)), 
        "..", "..", "..", "SKILLS", "SKILLS"
    ))

    @staticmethod
    def get_matching_skill_info(skill_name: str) -> dict:
        """Scan SKILLS folder to find a folder matching the skill name, then read its SKILL.md"""
        if not os.path.exists(EvaluationEngine.SKILLS_DIR):
            return {"name": skill_name, "guidelines": "Core development standards."}
            
        normalized_name = skill_name.lower().replace(" ", "-").replace(".", "")
        matched_folder = None
        
        # Scan folders in SKILLS_DIR
        try:
            for entry in os.listdir(EvaluationEngine.SKILLS_DIR):
                full_path = os.path.join(EvaluationEngine.SKILLS_DIR, entry)
                if os.path.isdir(full_path) and normalized_name in entry.lower():
                    matched_folder = entry
                    break
        except Exception:
            pass

        if not matched_folder:
            return {"name": skill_name, "guidelines": "Core development standards."}

        skill_md_path = os.path.join(EvaluationEngine.SKILLS_DIR, matched_folder, "SKILL.md")
        if not os.path.exists(skill_md_path):
            return {"name": skill_name, "guidelines": "Core development standards."}

        # Parse SKILL.md
        try:
            with open(skill_md_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Try to extract the description or first few lines of instructions
            guidelines = "Follow guidelines from SKILL.md."
            m = re.search(r"## Guidelines\s*\n(.*?)(?=\n##|\Z)", content, re.DOTALL | re.IGNORECASE)
            if m:
                guidelines = m.group(1).strip()
            else:
                # Fallback to instructions or overview
                m_inst = re.search(r"## Instructions\s*\n(.*?)(?=\n##|\Z)", content, re.DOTALL | re.IGNORECASE)
                if m_inst:
                    guidelines = m_inst.group(1).strip()
            
            # Clean guidelines (limit size)
            lines = [line.strip() for line in guidelines.split("\n") if line.strip()]
            short_guidelines = " ".join(lines[:4])
            if len(short_guidelines) > 250:
                short_guidelines = short_guidelines[:247] + "..."
                
            return {
                "name": matched_folder.replace("-", " ").title(),
                "guidelines": short_guidelines or "Follow core best practices."
            }
        except Exception:
            return {"name": skill_name, "guidelines": "Core development standards."}

    @staticmethod
    async def evaluate_developer(user_id: str) -> dict:
        """Run AI Evaluation on a developer based on their skills, application history, and reviews."""
        # 1. Fetch user profile
        user = await supabase_client.get_single("users", {"id": f"eq.{user_id}"})
        if not user:
            raise Exception("User profile not found")

        tech_stack = user.get("dashboard_config", {}).get("tech_stack", [])
        if not tech_stack:
            tech_stack = ["FastAPI", "React"] # Default fallback fallback

        # 2. Fetch applications (hire status)
        apps = await supabase_client.get("applications", {"developer_id": f"eq.{user_id}"})
        hired_count = sum(1 for a in apps if a.get("status") == "hired")

        # 3. Fetch reviews from public.reviews
        reviews = await supabase_client.get("reviews", {"reviewee_id": f"eq.{user_id}"})
        avg_rating = 0.0
        if reviews:
            avg_rating = sum(float(r.get("rating") or 0) for r in reviews) / len(reviews)

        # 4. Calculate skill scores (0-100) dynamically
        evaluated_skills = []
        overall_skills_points = 0
        
        for skill in tech_stack:
            skill_info = EvaluationEngine.get_matching_skill_info(skill)
            
            # Algorithmic scoring base on:
            # - Baseline points: 60
            # - +8 points per hired project
            # - Review points adjust (+6 for rating > 4, +2 for rating > 3, -10 for rating < 3)
            base_score = 60
            proj_bonus = hired_count * 8
            review_bonus = 0
            if reviews:
                if avg_rating >= 4.5:
                    review_bonus = 15
                elif avg_rating >= 4.0:
                    review_bonus = 8
                elif avg_rating >= 3.0:
                    review_bonus = 2
                else:
                    review_bonus = -15
                    
            final_score = min(100, max(10, base_score + proj_bonus + review_bonus))
            overall_skills_points += final_score

            # Save to public.skill_scores
            # Check if record exists
            existing = await supabase_client.get("skill_scores", {
                "user_id": f"eq.{user_id}",
                "skill_name": f"eq.{skill}"
            })
            if existing:
                await supabase_client.update("skill_scores", {
                    "score": final_score,
                    "verified": True if hired_count > 0 else False
                }, {"id": f"eq.{existing[0]['id']}"})
            else:
                await supabase_client.insert("skill_scores", {
                    "user_id": user_id,
                    "skill_name": skill,
                    "score": final_score,
                    "verified": True if hired_count > 0 else False
                })

            evaluated_skills.append({
                "name": skill,
                "score": final_score,
                "guidelines": skill_info["guidelines"]
            })

        # 5. Compute new overall profile XP
        # Formula: overall skills average * 150 + hired projects * 500 + baseline 1000
        avg_skill_score = overall_skills_points / len(tech_stack) if tech_stack else 60.0
        new_xp = int((avg_skill_score * 150) + (hired_count * 500) + 1000)

        # Update profile details
        profile_details = user.get("profile_details") or {}
        profile_details["xp"] = new_xp
        await supabase_client.update("users", {"profile_details": profile_details}, {"id": f"eq.{user_id}"})

        # 6. Calculate global rank
        all_devs = await supabase_client.get("users", {"role": "eq.developer"})
        # Sort by XP
        def get_xp_val(d):
            details = d.get("profile_details") or {}
            return int(details.get("xp") or 0)
            
        sorted_devs = sorted(all_devs, key=get_xp_val, reverse=True)
        
        rank_idx = 1
        for idx, dev in enumerate(sorted_devs):
            if dev.get("id") == user_id:
                rank_idx = idx + 1
                break
                
        ranking_str = f"Rank #{rank_idx} of {len(sorted_devs)} developers"
        percentile = round(((len(sorted_devs) - rank_idx) / len(sorted_devs)) * 100) if sorted_devs else 100

        # 7. Generate Feedback Report (Markdown format)
        strengths = []
        improvements = []
        for s in evaluated_skills:
            if s["score"] >= 80:
                strengths.append(f"**{s['name']}** (Score: {s['score']}/100) - Strong delivery. Guidelines followed: *\"{s['guidelines']}\"*")
            elif s["score"] >= 60:
                strengths.append(f"**{s['name']}** (Score: {s['score']}/100) - Solid core fundamentals. Guidelines followed: *\"{s['guidelines']}\"*")
            else:
                improvements.append(f"**{s['name']}** (Score: {s['score']}/100) - Needs practice on rule checks. Tip: *{s['guidelines']}*")

        report_md = f"### AI Evaluation Feedback Report\n\n"
        report_md += f"**Developer Name:** {user.get('first_name') or 'Developer'} {user.get('last_name') or ''}\n"
        report_md += f"**Computed XP:** {new_xp} ({percentile}% percentile)\n"
        report_md += f"**Global Ranking:** {ranking_str}\n\n"
        
        report_md += "#### Key Strengths\n"
        if strengths:
            for st in strengths:
                report_md += f"- {st}\n"
        else:
            report_md += "- No outstanding skills graded yet. Join more challenges or request client projects!\n"
            
        report_md += "\n#### Recommended Improvements\n"
        if improvements:
            for imp in improvements:
                report_md += f"- {imp}\n"
        else:
            report_md += "- Excellent! All stack items show high compliance scores. Keep building and maintaining clean code standards!\n"

        report_md += "\n#### Actionable Next Steps\n"
        if hired_count == 0:
            report_md += "- Apply and complete at least **1 Company Challenge** to gain production review verification.\n"
        if avg_rating < 4.0 and reviews:
            report_md += "- Address recruiter comments by optimizing code structures and documenting endpoints.\n"
        report_md += "- Review the instructions in the corresponding `SKILL.md` folders to improve verification metrics.\n"

        return {
            "user_id": user_id,
            "xp": new_xp,
            "ranking": ranking_str,
            "percentile": percentile,
            "skills": evaluated_skills,
            "feedback_report": report_md
        }
