import uuid

from database import Base
from sqlalchemy import UUID, Boolean, Column, Date, ForeignKey, String
from sqlalchemy.orm import relationship


class Citizen(Base):
    __tablename__ = "citizens"

    id = Column(UUID, primary_key=True, default=uuid.uuid4)
    household_id = Column(UUID, ForeignKey("households.id"), nullable=True)
    full_name = Column(String(100), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    place_of_birth = Column(String(255))
    hometown = Column(String(255))
    ethnicity = Column(String(50))
    occupation = Column(String(100))
    workplace = Column(String(255))
    is_active = Column(Boolean, default=True)
    cccd_number = Column(String(12), unique=True, nullable=False)

    cccd_issue_date = Column(Date)
    cccd_issue_place = Column(String(255))
    residence_registration_date = Column(Date)
    relationship_to_head = Column(String(50))

    # Death Declaration
    date_of_death = Column(Date, nullable=True)
    death_reason = Column(String(255), nullable=True)
    is_deceased = Column(Boolean, default=False)

    # Relations
    household = relationship(
        "Household", back_populates="members", foreign_keys=[household_id]
    )

    # Check current schema usage for other fields if any
