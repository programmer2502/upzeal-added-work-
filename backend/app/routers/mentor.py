import os
import httpx
from fastapi import APIRouter, Depends
from app.dependencies import get_current_user
from app.schemas import MentorQueryRequest, MentorResponse
from app.config import settings

router = APIRouter(prefix="/mentor", tags=["AI Mentor"])

# Resolve root skills folder relative to backend/app/routers/mentor.py
SKILLS_DIR = os.path.abspath(os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 
    "..", "..", "..", "SKILLS", "SKILLS"
))

def get_related_skill_md(query: str) -> str:
    """Scan SKILLS folder to find a matching skill name in user's query, then return its SKILL.md content"""
    if not os.path.exists(SKILLS_DIR):
        return ""
        
    try:
        entries = os.listdir(SKILLS_DIR)
        for entry in entries:
            full_path = os.path.join(SKILLS_DIR, entry)
            if not os.path.isdir(full_path):
                continue
                
            normalized_entry = entry.lower().replace("-", " ")
            if normalized_entry in query or entry.lower() in query:
                skill_md_path = os.path.join(full_path, "SKILL.md")
                if os.path.exists(skill_md_path):
                    with open(skill_md_path, 'r', encoding='utf-8') as f:
                        return f.read()
                        
            words = [w for w in entry.lower().split("-") if len(w) > 3]
            for w in words:
                if w in query:
                    skill_md_path = os.path.join(full_path, "SKILL.md")
                    if os.path.exists(skill_md_path):
                        with open(skill_md_path, 'r', encoding='utf-8') as f:
                            return f.read()
    except Exception:
        pass
    return ""

@router.post("/ask", response_model=MentorResponse)
async def ask_ai_mentor(req: MentorQueryRequest, current_user: dict = Depends(get_current_user)):
    """AI Mentor response generation for developer queries."""
    q = req.query.strip().lower()
    first_name = current_user.get("first_name") or "Developer"

    system_prompt = (
        f"You are the AI Mentor for Upzeal, a premium developer talent platform. "
        f"You are helping developer {first_name} with their technical query.\n"
        f"Answer the query clearly, provide concrete code examples, and suggest what they should practice next.\n"
    )
    
    related_skill = get_related_skill_md(q)
    if related_skill:
        system_prompt += (
            f"\nHere are the repository's official guidelines and rules for this skill. "
            f"You MUST align your guidance, terminology, and practice tips with these guidelines:\n"
            f"```markdown\n{related_skill}\n```\n"
        )

    reply = None
    if settings.OPENROUTER_API_KEY:
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
                        "HTTP-Referer": "http://localhost:8000",
                        "X-Title": "Upzeal AI Mentor",
                        "Content-Type": "application/json"
                    },
                    json={
                        "model": settings.OPENROUTER_MODEL,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": req.query.strip()}
                        ],
                        "temperature": 0.3,
                        "max_tokens": 1000
                    },
                    timeout=15.0
                )
                if response.status_code == 200:
                    data = response.json()
                    reply = data["choices"][0]["message"]["content"]
                else:
                    print(f"OpenRouter returned status {response.status_code}: {response.text}")
        except Exception as e:
            print(f"Error calling OpenRouter: {e}")

    # Fallback to local keyword-based matching if OpenRouter fails or is unavailable
    if not reply:
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
