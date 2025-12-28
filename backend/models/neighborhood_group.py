import uuid

from database import Base
from sqlalchemy import UUID, Boolean, Column, ForeignKey, String
from sqlalchemy.orm import relationship


class NeighborhoodGroup(Base):
    __tablename__ = "neighborhood_groups"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ward_id = Column(UUID(as_uuid=True), ForeignKey("wards.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(20))  # Mã tổ
    to_truong_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)  # Tổ trưởng
    is_active = Column(Boolean, default=True)

    # Relations
    ward = relationship("Ward", back_populates="neighborhood_groups")
    to_truong = relationship("User", foreign_keys=[to_truong_id])
    households = relationship("Household", back_populates="neighborhood_group")
