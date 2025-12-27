from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class PermissionItem(BaseModel):
    id: str
    name: str
    enabled: bool


class PermissionCategory(BaseModel):
    category: str
    items: List[PermissionItem]


class RoleBase(BaseModel):
    name: str
    code: str
    color: str
    description: Optional[str] = None


class RoleCreate(RoleBase):
    permissions: List[str] = []


class RoleUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None
    description: Optional[str] = None
    permissions: Optional[List[str]] = None


class RoleResponse(RoleBase):
    id: int
    user_count: int
    permissions: List[str]

    class Config:
        from_attributes = True


class RoleDetailResponse(RoleBase):
    id: int
    user_count: int
    permissions: List[PermissionCategory]

    class Config:
        from_attributes = True


class AuditLogResponse(BaseModel):
    id: UUID
    user_id: Optional[UUID]
    username: Optional[str]
    user_role: Optional[str]
    action: str
    entity_name: str
    entity_id: Optional[UUID]
    before_state: Optional[dict]
    after_state: Optional[dict]
    timestamp: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

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
