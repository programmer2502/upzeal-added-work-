import httpx
from app.config import settings

class SupabaseClient:
    def __init__(self):
        self.url = settings.SUPABASE_URL
        self.key = settings.SUPABASE_KEY
        self.headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }
        # Connection pooling limits (max 100 concurrent connections, 20 idle keepalives)
        self.limits = httpx.Limits(max_keepalive_connections=20, max_connections=100)
        self.client = httpx.AsyncClient(headers=self.headers, limits=self.limits, timeout=10.0)

    async def close(self):
        await self.client.aclose()

    async def get(self, table: str, query_params: dict = None) -> list:
        req_url = f"{self.url}/rest/v1/{table}"
        response = await self.client.get(req_url, params=query_params)
        response.raise_for_status()
        return response.json()

    async def get_single(self, table: str, query_params: dict = None) -> dict:
        data = await self.get(table, query_params)
        return data[0] if data else {}

    async def insert(self, table: str, data: dict) -> list:
        req_url = f"{self.url}/rest/v1/{table}"
        response = await self.client.post(req_url, json=data)
        response.raise_for_status()
        return response.json()

    async def update(self, table: str, data: dict, query_params: dict) -> list:
        req_url = f"{self.url}/rest/v1/{table}"
        response = await self.client.patch(req_url, json=data, params=query_params)
        response.raise_for_status()
        return response.json()

    async def delete(self, table: str, query_params: dict) -> list:
        req_url = f"{self.url}/rest/v1/{table}"
        response = await self.client.delete(req_url, params=query_params)
        response.raise_for_status()
        return response.json()

    async def verify_token(self, token: str) -> dict:
        """Verify the user token against Supabase Auth API dynamically"""
        auth_url = f"{self.url}/auth/v1/user"
        headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {token}"
        }
        # Simple short-lived client for token authentication checks
        async with httpx.AsyncClient() as client:
            response = await client.get(auth_url, headers=headers)
            if response.status_code != 200:
                raise Exception("Invalid authorization token")
            return response.json()

supabase_client = SupabaseClient()
