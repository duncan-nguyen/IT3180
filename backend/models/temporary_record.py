import enum
import uuid

from database import Base
from sqlalchemy import UUID, Column, Date, ForeignKey, String
from sqlalchemy.orm import relationship


class RecordType(str, enum.Enum):
    TAM_TRU = "TAM_TRU"
    TAM_VANG = "TAM_VANG"


class RecordStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"


class TemporaryRecord(Base):
    __tablename__ = "temporary_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    citizen_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=False)

    record_type = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String(255))

    # Status tracking
    status = Column(String, default=RecordStatus.PENDING.value)

    # Relations
    citizen = relationship("Citizen", backref="temporary_records")
