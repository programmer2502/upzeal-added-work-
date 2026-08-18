from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from fastapi.security import HTTPAuthorizationCredentials
from app.dependencies import require_role, security_scheme
from app.supabase_client import supabase_client
from app.ws_manager import manager
import logging

router = APIRouter(prefix="/applications", tags=["Applications"])
logger = logging.getLogger(__name__)

@router.post("/{app_id}/accept")
async def accept_application(
    app_id: str, 
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    current_user: dict = Depends(require_role(["recruiter"]))
):
    """
    Accept a developer's application for a project.
    Updates the database and instantly pushes a WebSocket notification to the developer.
    """
    try:
        # 1. Update the application status to 'hired'
        updated = await supabase_client.update("applications", {"status": "hired"}, {"id": f"eq.{app_id}"}, token=credentials.credentials)
        if not updated:
            raise HTTPException(status_code=404, detail="Application not found or update failed")
        
        application = updated[0]
        project_id = application.get("project_id")
        developer_id = application.get("developer_id")
        
        # 2. Fetch project details to include in the notification
        project_data = await supabase_client.get("projects", {"id": f"eq.{project_id}", "select": "title"})
        project_title = project_data[0].get("title") if project_data else "Project"

        # 3. Push real-time event to the developer's WebSocket
        if developer_id:
            await manager.send_json({
                "type": "APPLICATION_ACCEPTED",
                "payload": {
                    "app_id": app_id,
                    "project_id": project_id,
                    "project_title": project_title
                }
            }, developer_id)

        return {"success": True, "message": "Application accepted and developer notified"}
    except Exception as e:
        logger.error(f"Failed to accept application {app_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


class OnboardDeveloperRequest(BaseModel):
    developer_id: str
    project_id: str


@router.post("/onboard")
async def onboard_developer(
    req: OnboardDeveloperRequest,
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    current_user: dict = Depends(require_role(["recruiter"]))
):
    """
    Onboard a developer to a project (Recruiter only).
    """
    try:
        developer_id = req.developer_id
        project_id = req.project_id

        # 1. Fetch project details to verify ownership
        project = await supabase_client.get_single("projects", {"id": f"eq.{project_id}"}, token=credentials.credentials)
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # 2. Check ownership permissions
        is_owner = project.get("created_by") == current_user["id"]
        if not is_owner:
            # Check company
            company_id = project.get("company_id")
            if company_id:
                company = await supabase_client.get_single("companies", {"id": f"eq.{company_id}"}, token=credentials.credentials)
                if company and company.get("created_by") == current_user["id"]:
                    is_owner = True

        if not is_owner:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to onboard developers for this project"
            )

        # 3. Check if application already exists
        existing = await supabase_client.get("applications", {
            "project_id": f"eq.{project_id}",
            "developer_id": f"eq.{developer_id}"
        }, token=credentials.credentials)

        if existing:
            # Update existing status to 'hired'
            updated = await supabase_client.update(
                "applications",
                {"status": "hired"},
                {"id": f"eq.{existing[0]['id']}"},
                token=credentials.credentials
            )
            application = updated[0] if updated else existing[0]
        else:
            # Insert new hired application
            inserted = await supabase_client.insert("applications", {
                "project_id": project_id,
                "developer_id": developer_id,
                "status": "hired"
            }, token=credentials.credentials)
            if not inserted:
                raise HTTPException(status_code=500, detail="Failed to create application")
            application = inserted[0]

        # 4. Push real-time WebSocket notification to developer
        project_title = project.get("title") or "Project"
        await manager.send_json({
            "type": "APPLICATION_ACCEPTED",
            "payload": {
                "app_id": application.get("id"),
                "project_id": project_id,
                "project_title": project_title
            }
        }, developer_id)

        return {"success": True, "message": "Developer onboarded successfully"}
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Failed to onboard developer {req.developer_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

