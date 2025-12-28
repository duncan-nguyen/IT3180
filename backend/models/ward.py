import uuid

from database import Base
from sqlalchemy import UUID, Boolean, Column, ForeignKey, String
from sqlalchemy.orm import relationship


class Ward(Base):
    __tablename__ = "wards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    province_id = Column(UUID(as_uuid=True), ForeignKey("provinces.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(20), unique=True)  # Mã phường xã
    is_active = Column(Boolean, default=True)

    # Relations
    province = relationship("Province", back_populates="wards")
    neighborhood_groups = relationship("NeighborhoodGroup", back_populates="ward")
    households = relationship("Household", back_populates="ward_ref")
