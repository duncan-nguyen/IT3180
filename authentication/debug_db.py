
import asyncio
import sys
import os

# Add the current directory to sys.path so we can import from core and database
sys.path.append(os.getcwd())

from database.database import get_db
from models import User
from sqlalchemy import select
from schemas.auth_schema import UserRole

async def main():
    print("Connecting to database...")
    # Manually getting session
    async for session in get_db():
        print("Session created.")
        try:
            query = select(User)
            result = await session.execute(query)
            users = result.scalars().all()
            print(f"Found {len(users)} users.")
            for user in users:
                print(f"User: {user.username}, Role: {user.role}, Active: {user.active}, ID: {user.id}")
                try:
                    UserRole(user.role)
                    print("  -> Role is VALID")
                except ValueError:
                    print(f"  -> Role is INVALID: '{user.role}'")
        except Exception as e:
            print(f"Error: {e}")
        finally:
            await session.close()
            break

if __name__ == "__main__":
    asyncio.run(main())
