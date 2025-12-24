from supabase import AsyncClient, create_async_client
from .config import settings

class DBClient:
    def __init__(self):
        self.client: AsyncClient | None = None

    async def get_client(self) -> AsyncClient:
        if self.client is None:
            self.client = await create_async_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        return self.client

db_client = DBClient()

async def get_db() -> AsyncClient:
    return await db_client.get_client()
