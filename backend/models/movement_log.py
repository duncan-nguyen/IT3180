import uuid
from datetime import datetime

from database import Base
from sqlalchemy import UUID, Column, Date, ForeignKey, String
from sqlalchemy.orm import relationship


class MovementLog(Base):
    __tablename__ = "movement_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False)
    change_type = Column(String(50))  # e.g. "Tạm vắng", "Tạm trú"
    change_date = Column(Date, default=datetime.utcnow)
    reason = Column(String(255))
    destination = Column(String(255))
    from_household_id = Column(UUID(as_uuid=True), nullable=True)
    to_household_id = Column(UUID(as_uuid=True), nullable=True)
    notes = Column(String(500), nullable=True)

    # Relation
    citizen = relationship("Citizen")
