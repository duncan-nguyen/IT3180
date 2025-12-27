from datetime import datetime
from enum import Enum
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, Field


class UserRole(Enum):
    ADMIN = "admin"
    TO_TRUONG = "to_truong"
    CAN_BO_PHUONG = "can_bo_phuong"
    NGUOI_DAN = "nguoi_dan"


class UserInfor(BaseModel):
    id: UUID
    role: UserRole
    username: str = Field(min_length=5, max_length=25)
    scope_id: str
    active: bool

    class Config:
        use_enum_values = True


class LoginRes(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
    user: UserInfor


class UserCreateForm(BaseModel):
    password: str = Field(..., min_length=8, max_length=64)
    role: UserRole
    username: str = Field(min_length=5, max_length=25)
    scope_id: str


class AccessTokenResponse(BaseModel):
    access_token: str
    token_type: str


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UserUpdateForm(BaseModel):
    role: Optional[UserRole] = None
    scope_id: Optional[str] = None


class ResetPasswordForm(BaseModel):
    password: str


class Action(Enum):
    CREATE_CITIZEN = "CREATE_CITIZEN"
    UPDATE_CITIZEN = "UPDATE_CITIZEN"
    DELETE_CITIZEN = "DELETE_CITIZEN"
    LOCK = "LOCK"
    # MO RONG THEM


class Entity(Enum):
    Citizens = "Citizens"
    Users = "Users"
    Households: "Households"
    # MO RONG THEM


class AuditLogForm(BaseModel):
    user_id: UUID
    action: str
    entity_name: str
    entity_id: UUID
    before_state: dict
    after_state: dict


class AuthRes(BaseModel):
    id: UUID
    scope_id: str
    role: UserRole


class ValidateRequest(BaseModel):
    username: str
    access_token: str


# Audit Log Schemas
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
