from core.config import DATABASE_URL
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


class Base(DeclarativeBase):
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


class DbResponse:
    def __init__(self, data, count=0, meta=None):
        self.data = data
        self.count = count
        self.meta = meta
