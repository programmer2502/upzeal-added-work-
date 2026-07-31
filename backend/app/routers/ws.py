from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
import logging
from app.ws_manager import manager

router = APIRouter(prefix="/ws", tags=["WebSockets"])
logger = logging.getLogger(__name__)

@router.websocket("/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """
    WebSocket endpoint for real-time collaboration.
    Clients connect to ws://host:port/api/v1/ws/{user_id}.
    """
    await manager.connect(user_id, websocket)
    try:
        while True:
            # Keep connection alive, listen for messages if needed
            data = await websocket.receive_text()
            # In the future, we can handle incoming messages from the client here
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        logger.error(f"WebSocket error for user {user_id}: {e}")
        manager.disconnect(user_id)
