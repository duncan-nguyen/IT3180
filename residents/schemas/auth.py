from enum import Enum
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


class AuthRes(BaseModel):
    id: UUID
    scope_id: str
    role: UserRole
