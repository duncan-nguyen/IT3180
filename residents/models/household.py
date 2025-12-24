import uuid

from database import Base
from sqlalchemy import UUID, Boolean, Column, ForeignKey, String
from sqlalchemy.orm import relationship


class Household(Base):
    __tablename__ = "households"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    household_number = Column(String(50), unique=True, nullable=False)
    head_of_household_id = Column(UUID, ForeignKey("citizens.id"), nullable=True)
    address = Column(String(255), nullable=False)
    ward = Column(String(100), nullable=False)
    scope_id = Column(String(50))  # Optional scope_id as seen in schema
    is_active = Column(Boolean, default=True)

    # Relations
    head_of_household = relationship(
        "Citizen", foreign_keys=[head_of_household_id], post_update=True
    )
    members = relationship(
        "Citizen", back_populates="household", foreign_keys="[Citizen.household_id]"
    )
