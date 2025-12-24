from sqlalchemy import Column, String, Boolean, ForeignKey, UUID, DateTime, JSON
from sqlalchemy.orm import declarative_base
import uuid
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)
    scope_id = Column(String, nullable=True)
    active = Column(Boolean, default=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True))
    action = Column(String)
    entity_name = Column(String)
    entity_id = Column(UUID(as_uuid=True))
    before_state = Column(JSON)
    after_state = Column(JSON)
    timestamp = Column(DateTime, default=datetime.utcnow)
