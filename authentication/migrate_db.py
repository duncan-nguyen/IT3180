import asyncio
import os
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

# Use localhost:3901 as defined in docker-compose.yml for host access
# But from within the same network (if running efficiently) we might use service name.
# Since we are running this script from the WSL shell (HOST relative to containers), we should use localhost:3901.
DATABASE_URL = "postgresql+asyncpg://admin:password123@localhost:3901/citizen_management"

async def migrate():
    engine = create_async_engine(DATABASE_URL, echo=True)
    async with engine.begin() as conn:
        print("Migrating database...")
        await conn.execute(text("ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS ip_address VARCHAR;"))
        await conn.execute(text("ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_agent VARCHAR;"))
        print("Migration complete.")
    await engine.dispose()

if __name__ == "__main__":
    try:
        asyncio.run(migrate())
    except Exception as e:
        print(f"Migration failed: {e}")
