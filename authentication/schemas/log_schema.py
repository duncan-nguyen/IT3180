from typing import Any, Dict, List, Optional
from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

class AuditLogBase(BaseModel):
    action: str
    entity_name: str
    entity_id: Optional[UUID] = None
    before_state: Optional[Dict[str, Any]] = None
    after_state: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class AuditLogCreate(AuditLogBase):
    user_id: Optional[UUID] = None

class AuditLogResponse(AuditLogBase):
    id: UUID
    user_id: Optional[UUID]
    username: Optional[str] = None
    user_role: Optional[str] = None
    timestamp: datetime

    class Config:
        from_attributes = True

class AuditLogListResponse(BaseModel):
    logs: List[AuditLogResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

class AuditLogStatsResponse(BaseModel):
    today_count: int
    success_count: int
    error_count: int
    unique_users: int
