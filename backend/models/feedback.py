import uuid
from datetime import datetime

from database import Base
from sqlalchemy import JSON, UUID, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(String)
    category = Column(String)
    content = Column(String)
    attachment_urls = Column(JSON, default=[])
    scope_id = Column(String)
    report_count = Column(Integer, default=0)
    created_by_user_id = Column(UUID(as_uuid=True))
    parent_id = Column(UUID(as_uuid=True), ForeignKey("feedbacks.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    reported_at = Column(DateTime, nullable=True)

    # Relations
    responses = relationship("FeedbackResponse", back_populates="feedback")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class FeedbackResponse(Base):
    __tablename__ = "feedback_responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(String)
    agency = Column(String)
    attachment_url = Column(String)
    feedback_id = Column(UUID(as_uuid=True), ForeignKey("feedbacks.id"))
    responded_at = Column(DateTime, default=datetime.utcnow)
    created_by_user_id = Column(UUID(as_uuid=True))

    feedback = relationship("Feedback", back_populates="responses")

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}
