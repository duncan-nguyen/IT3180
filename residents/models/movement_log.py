import uuid
from datetime import datetime

from database import Base
from sqlalchemy import UUID, Column, Date, ForeignKey, String
from sqlalchemy.orm import relationship


class MovementLog(Base):
    __tablename__ = "movement_logs"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID, ForeignKey("citizens.id"), nullable=False)
    change_type = Column(String(50))  # e.g. "Tạm vắng", "Tạm trú"
    change_date = Column(Date, default=datetime.utcnow)
    reason = Column(String(255))
    destination = Column(String(255))  # For leaving
    # ... any other fields inferred or needed

    # Relation
    citizen = relationship("Citizen")
