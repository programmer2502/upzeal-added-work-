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

# Initialize global client for external API requests to keep connections warm
openrouter_client = httpx.AsyncClient(timeout=15.0)

_skills_folders_cache = None
_skill_md_cache = {}

def get_related_skill_md(query: str) -> str:
    """Scan SKILLS folder to find a matching skill name in user's query, then return its SKILL.md content"""
    global _skills_folders_cache
    if not os.path.exists(SKILLS_DIR):
        return ""
        
    try:
        if _skills_folders_cache is None:
            _skills_folders_cache = [
                entry for entry in os.listdir(SKILLS_DIR)
                if os.path.isdir(os.path.join(SKILLS_DIR, entry))
            ]

        for entry in _skills_folders_cache:
            normalized_entry = entry.lower().replace("-", " ")
            is_match = False
            if normalized_entry in query or entry.lower() in query:
                is_match = True
            else:
                words = [w for w in entry.lower().split("-") if len(w) > 3]
                for w in words:
                    if w in query:
                        is_match = True
                        break
            
            if is_match:
                if entry in _skill_md_cache:
                    return _skill_md_cache[entry]
                    
                skill_md_path = os.path.join(SKILLS_DIR, entry, "SKILL.md")
                if os.path.exists(skill_md_path):
                    with open(skill_md_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                        _skill_md_cache[entry] = content
                        return content
    except Exception:
        pass
    return ""

@router.post("/ask", response_model=MentorResponse)
async def ask_ai_mentor(req: MentorQueryRequest, current_user: dict = Depends(get_current_user)):
    """AI Mentor response generation for developer queries."""
    print("[MENTOR] Started ask_ai_mentor")
    q = req.query.strip().lower()
    first_name = current_user.get("first_name") or "Developer"

    system_prompt = (
        f"You are the AI Mentor for Upzeal, a premium developer talent platform. "
        f"You are helping developer {first_name} with their technical query.\n"
        f"Answer the query clearly, provide concrete code examples, and suggest what they should practice next.\n"
    )
    
    print("[MENTOR] Scanning related skill markdown")
    related_skill = get_related_skill_md(q)
    print(f"[MENTOR] Related skill length: {len(related_skill)}")
    if related_skill:
        # Avoid model context limit overflows (e.g. cohere/north-mini-code:free limit is 8192 tokens)
        max_guideline_len = 4000
        truncated_guideline = related_skill
        if len(related_skill) > max_guideline_len:
            truncated_guideline = related_skill[:max_guideline_len] + "\n... [guidelines truncated for length] ..."
        system_prompt += (
            f"\nHere are the repository's official guidelines and rules for this skill. "
            f"You MUST align your guidance, terminology, and practice tips with these guidelines:\n"
            f"```markdown\n{truncated_guideline}\n```\n"
        )

    reply = None
    print(f"[MENTOR] OpenRouter API Key configured: {bool(settings.OPENROUTER_API_KEY)}")
    if settings.OPENROUTER_API_KEY:
        try:
            print(f"[MENTOR] Making request to OpenRouter with model: {settings.OPENROUTER_MODEL}")
            response = await openrouter_client.post(
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
                }
            )
            print(f"[MENTOR] OpenRouter returned status: {response.status_code}")
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, dict):
                    if "error" in data:
                        print(f"[MENTOR] OpenRouter returned error payload: {data['error']}")
                    elif "choices" in data and data["choices"]:
                        first_choice = data["choices"][0]
                        if first_choice and isinstance(first_choice, dict) and "message" in first_choice:
                            msg = first_choice["message"]
                            if msg and isinstance(msg, dict) and "content" in msg:
                                reply = msg["content"]
                                if reply:
                                    safe_preview = reply[:100].encode('ascii', 'ignore').decode('ascii')
                                    print(f"[MENTOR] Successfully parsed OpenRouter response: {safe_preview}...")
            else:
                print(f"[MENTOR] OpenRouter returned status {response.status_code}: {response.text}")
        except Exception as e:
            print(f"[MENTOR] Error calling OpenRouter: {e}")

    # Fallback to local keyword-based matching if OpenRouter fails or is unavailable
    if not reply:
        print("[MENTOR] OpenRouter failed or no reply; falling back to local copy")
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

    print("[MENTOR] Finished ask_ai_mentor")
    return MentorResponse(reply=reply)
