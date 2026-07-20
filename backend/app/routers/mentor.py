from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.schemas import MentorQueryRequest, MentorResponse

router = APIRouter(prefix="/mentor", tags=["AI Mentor"])

@router.post("/ask", response_model=MentorResponse)
async def ask_ai_mentor(req: MentorQueryRequest, current_user: dict = Depends(get_current_user)):
    """AI Mentor response generation for developer queries."""
    q = req.query.strip().lower()
    first_name = current_user.get("first_name") or "Developer"

    if "react" in q:
        reply = f"Hi {first_name}! For React: Focus on hooks (useEffect, useMemo), state composition patterns, and building reusable component libraries."
    elif "dsa" in q or "algorithm" in q:
        reply = f"Hi {first_name}! For DSA Prep: Practice Big-O complexity, HashMaps, Sliding Window algorithms, and Binary Search Trees."
    elif "project" in q or "idea" in q:
        reply = f"Hi {first_name}! Project Idea: Build a real-time collaborative dev tool with WebSockets, state syncing, and PostgreSQL storage."
    elif "aws" in q or "cloud" in q:
        reply = f"Hi {first_name}! For AWS: Focus on S3 asset delivery, Lambda serverless functions, API Gateway routing, and VPC networks."
    elif "database" in q or "postgres" in q or "sql" in q:
        reply = f"Hi {first_name}! For Database: Master SQL joins, indexing strategies, connection pooling, and transaction isolation."
    else:
        reply = f"Hi {first_name}! Here is a tip on '{req.query.strip()}': Master core fundamentals, write automated tests, and practice clean code standards."

    return MentorResponse(reply=reply)
