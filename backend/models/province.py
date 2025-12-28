import uuid

from database import Base
from sqlalchemy import UUID, Boolean, Column, String
from sqlalchemy.orm import relationship


class Province(Base):
    __tablename__ = "provinces"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    code = Column(String(10), unique=True)  # Mã tỉnh
    is_active = Column(Boolean, default=True)

    # Relations
    wards = relationship("Ward", back_populates="province")
