import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Upzeal API"
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://sdgdovzmjpyycaaunagp.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sb_publishable_JSSJWQxBL4qEYgOm7LNsoA_hfXt5Vqz")
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_MODEL: str = os.getenv("OPENROUTER_MODEL", "cohere/north-mini-code:free")
    ALLOWED_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:5200",
        "http://127.0.0.1:5200",
        "https://upzeal.in",
        "https://www.upzeal.in"
    ]


    class Config:
        env_file = ".env"

settings = Settings()
