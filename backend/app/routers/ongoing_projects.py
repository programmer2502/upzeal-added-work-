import os
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import HTTPAuthorizationCredentials

from app.dependencies import get_current_user, require_role, security_scheme
from app.supabase_client import supabase_client

router = APIRouter(prefix="/ongoing-projects", tags=["Ongoing Projects"])

DATA_FILE = os.path.join(os.path.dirname(__file__), "..", "data", "project_submissions.json")

def load_data() -> dict:
    if not os.path.exists(DATA_FILE):
        return {"submissions": []}
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"submissions": []}

def save_data(data: dict):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


class FileSubmissionRequest(BaseModel):
    level: str  # 'L1', 'L2', 'L3'
    file_name: str
    file_content: str

class FeedbackRequest(BaseModel):
    feedback: str


@router.get("/list")
async def list_ongoing_projects(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    current_user: dict = Depends(get_current_user)
):
    """List ongoing projects for the logged-in user.
    - If recruiter: returns projects they created or owned with onboarded developers.
    - If developer: returns projects they have been hired for, with start date and teammates.
    """
    token = credentials.credentials
    user_id = current_user["id"]
    role = current_user.get("role", "developer")

    try:
        if role == "recruiter":
            # 1. Fetch companies owned by recruiter
            companies = await supabase_client.get("companies", {"created_by": f"eq.{user_id}"}, token=token)
            comp_ids = [c["id"] for c in companies] if companies else []

            # 2. Fetch projects matching recruiter or their companies
            projects = []
            if comp_ids:
                proj_filter = f"company_id.in.({','.join(comp_ids)})"
                projects = await supabase_client.get("projects", {
                    "or": f"(created_by.eq.{user_id},{proj_filter})"
                }, token=token)
            else:
                projects = await supabase_client.get("projects", {"created_by": f"eq.{user_id}"}, token=token)

            if not projects:
                return []

            # Filter active projects
            proj_ids = [p["id"] for p in projects]
            proj_filter_str = ",".join(proj_ids)

            # 3. Fetch applications with status 'hired'
            hired_apps = await supabase_client.get("applications", {
                "project_id": f"in.({proj_filter_str})",
                "status": "eq.hired"
            }, token=token)

            # Build list of hired developers per project
            project_members = {}
            dev_ids = list(set([a["developer_id"] for a in hired_apps if a.get("developer_id")]))
            
            # Fetch developer details
            dev_profiles = {}
            if dev_ids:
                dev_filter = ",".join(dev_ids)
                devs = await supabase_client.get("users", {"id": f"in.({dev_filter})"}, token=token)
                for d in devs:
                    profile = d.get("profile_details") or {}
                    dev_profiles[d["id"]] = {
                        "id": d["id"],
                        "name": f"{d.get('first_name','')} {d.get('last_name','')}".strip() or d.get("username", "Developer"),
                        "avatar": profile.get("avatar_url", ""),
                        "email": d.get("email")
                    }

            for app in hired_apps:
                pid = app["project_id"]
                did = app["developer_id"]
                if pid not in project_members:
                    project_members[pid] = []
                if did in dev_profiles:
                    project_members[pid].append(dev_profiles[did])

            result = []
            for p in projects:
                pid = p["id"]
                members = project_members.get(pid, [])
                
                # Dynamic start date: use the earliest application hire time or project creation time
                started_at = p.get("created_at")
                project_apps = [a for a in hired_apps if a["project_id"] == pid]
                if project_apps:
                    started_at = min([a["created_at"] for a in project_apps])

                result.append({
                    "id": pid,
                    "title": p["title"],
                    "description": p["description"],
                    "budget": p.get("budget"),
                    "status": p.get("status"),
                    "started_at": started_at,
                    "onboarded_members": members
                })
            return result

        else:  # Developer
            # 1. Fetch applications where developer is hired
            hired_apps = await supabase_client.get("applications", {
                "developer_id": f"eq.{user_id}",
                "status": "eq.hired"
            }, token=token)

            if not hired_apps:
                return []

            # 2. Fetch project details
            proj_ids = [a["project_id"] for a in hired_apps]
            proj_filter_str = ",".join(proj_ids)
            projects = await supabase_client.get("projects", {"id": f"in.({proj_filter_str})"}, token=token)
            projects_map = {p["id"]: p for p in projects}

            # 3. Fetch all hired teammates on these projects
            all_hired_apps = await supabase_client.get("applications", {
                "project_id": f"in.({proj_filter_str})",
                "status": "eq.hired"
            }, token=token)

            # Get teammate profiles
            teammate_ids = list(set([a["developer_id"] for a in all_hired_apps if a.get("developer_id")]))
            teammate_profiles = {}
            if teammate_ids:
                teammate_filter = ",".join(teammate_ids)
                teammates = await supabase_client.get("users", {"id": f"in.({teammate_filter})"}, token=token)
                for t in teammates:
                    profile = t.get("profile_details") or {}
                    teammate_profiles[t["id"]] = {
                        "id": t["id"],
                        "name": f"{t.get('first_name','')} {t.get('last_name','')}".strip() or t.get("username", "Teammate"),
                        "avatar": profile.get("avatar_url", ""),
                        "email": t.get("email")
                    }

            project_teammates = {}
            for app in all_hired_apps:
                pid = app["project_id"]
                did = app["developer_id"]
                if pid not in project_teammates:
                    project_teammates[pid] = []
                if did in teammate_profiles:
                    project_teammates[pid].append(teammate_profiles[did])

            result = []
            for app in hired_apps:
                pid = app["project_id"]
                proj = projects_map.get(pid)
                if proj:
                    result.append({
                        "id": pid,
                        "title": proj["title"],
                        "description": proj["description"],
                        "budget": proj.get("budget"),
                        "status": proj.get("status"),
                        "started_at": app["created_at"],
                        "onboarded_members": project_teammates.get(pid, [])
                    })
            return result

    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{project_id}/submissions")
async def get_submissions(project_id: str, current_user: dict = Depends(get_current_user)):
    """Fetch submissions and advice comments for a project."""
    db_data = load_data()
    submissions = [
        s for s in db_data["submissions"] 
        if s["project_id"] == project_id
    ]
    return submissions


@router.post("/{project_id}/submit")
async def submit_file(
    project_id: str, 
    req: FileSubmissionRequest,
    current_user: dict = Depends(require_role(["developer"]))
):
    """Developer submits a code file under level L1, L2, or L3."""
    if req.level not in ["L1", "L2", "L3"]:
        raise HTTPException(status_code=400, detail="Invalid level. Must be L1, L2, or L3.")

    db_data = load_data()
    
    # Check for existing submission for this project + dev + level to update it, or insert new
    existing = None
    for s in db_data["submissions"]:
        if s["project_id"] == project_id and s["developer_id"] == current_user["id"] and s["level"] == req.level:
            existing = s
            break

    if existing:
        existing["file_name"] = req.file_name
        existing["file_content"] = req.file_content
        existing["updated_at"] = datetime.utcnow().isoformat()
        submission = existing
    else:
        submission = {
            "id": str(uuid.uuid4()),
            "project_id": project_id,
            "developer_id": current_user["id"],
            "developer_name": f"{current_user.get('first_name','')} {current_user.get('last_name','')}".strip() or current_user.get("username", "Developer"),
            "level": req.level,
            "file_name": req.file_name,
            "file_content": req.file_content,
            "feedback": None,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        db_data["submissions"].append(submission)

    save_data(db_data)
    return submission


@router.post("/submissions/{submission_id}/feedback")
async def submit_feedback(
    submission_id: str, 
    req: FeedbackRequest,
    current_user: dict = Depends(require_role(["recruiter"]))
):
    """Recruiter provides suggestions/feedback to a submission."""
    db_data = load_data()
    submission = None
    for s in db_data["submissions"]:
        if s["id"] == submission_id:
            submission = s
            break

    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")

    submission["feedback"] = req.feedback
    submission["updated_at"] = datetime.utcnow().isoformat()
    
    save_data(db_data)
    return submission
