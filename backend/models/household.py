import uuid

from sqlalchemy import UUID, Boolean, Column, ForeignKey, String
from sqlalchemy.orm import relationship

from database import Base


class Household(Base):
    __tablename__ = "households"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    household_number = Column(String(50), unique=True, nullable=False)
    head_of_household_id = Column(UUID(as_uuid=True), ForeignKey("citizens.id"), nullable=True)
    address = Column(String(255), nullable=False)
    ward = Column(String(100), nullable=False)  # Legacy - kept for backward compatibility
    ward_id = Column(UUID(as_uuid=True), ForeignKey("wards.id"), nullable=True)
    neighborhood_group_id = Column(UUID(as_uuid=True), ForeignKey("neighborhood_groups.id"), nullable=True)
    scope_id = Column(String(50))
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)  # Whether household has been verified by official

    # Relations
    head_of_household = relationship(
        "Citizen", foreign_keys=[head_of_household_id], post_update=True
    )
    members = relationship(
        "Citizen", back_populates="household", foreign_keys="[Citizen.household_id]"
    )
    ward_ref = relationship("Ward", back_populates="households")
    neighborhood_group = relationship("NeighborhoodGroup", back_populates="households")

