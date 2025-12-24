from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, UUID, Boolean, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import uuid
from datetime import datetime

Base = declarative_base() # Or import specific Base if shared, but microservice typically has own Base

class Feedback(Base):
    __tablename__ = "feedbacks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # Using String for Enums to simplify migration, or use Enum type
    status = Column(String) 
    category = Column(String)
    content = Column(String)
    attachment_urls = Column(JSON, default=[]) # List of URLs (images/docs)
    scope_id = Column(String)
    report_count = Column(Integer, default=0)
    created_by_user_id = Column(UUID(as_uuid=True)) # Assuming UUID
    parent_id = Column(UUID(as_uuid=True), ForeignKey("feedbacks.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    reported_at = Column(DateTime, nullable=True)

    # Relations
    responses = relationship("FeedbackResponse", back_populates="feedback")
    # sub_feedbacks = relationship("Feedback") # self-referential
    
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
