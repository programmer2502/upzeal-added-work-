import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Upzeal API"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://sdgdovzmjpyycaaunagp.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sb_secret_lR7O85wAk-_Sx4jWg9OPaA_MYFhDTdZ")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "google/gemma-4-26b-a4b-it:free")
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "https://upzeal.in"
    ]

    class Config:
        env_file = ".env"

settings = Settings()
