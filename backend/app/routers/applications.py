from fastapi import APIRouter, Depends, HTTPException
from app.dependencies import require_role
from app.supabase_client import supabase_client
from app.ws_manager import manager
import logging

router = APIRouter(prefix="/applications", tags=["Applications"])
logger = logging.getLogger(__name__)

@router.post("/{app_id}/accept")
async def accept_application(app_id: str, current_user: dict = Depends(require_role(["recruiter"]))):
    """
    Accept a developer's application for a project.
    Updates the database and instantly pushes a WebSocket notification to the developer.
    """
    try:
        # 1. Update the application status to 'hired'
        updated = await supabase_client.update("applications", {"status": "hired"}, {"id": f"eq.{app_id}"})
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
