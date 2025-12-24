from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from .config import settings

# engine = create_async_engine(settings.DATABASE_URL, echo=True)

# AsyncSessionLocal = async_sessionmaker(
#     bind=engine,
#     class_=AsyncSession,
#     expire_on_commit=False,
#     autoflush=False,
# )

# async def get_db():
#     async with AsyncSessionLocal() as session:
#         yield session

# Note: Ideally we reuse the same logic as Residents if we want consistency, 
# but putting it here to keep service independent.

class DbResponse:
    def __init__(self, data, count=0):
        self.data = data
        self.count = count

# Lazy initialization or direct
engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
