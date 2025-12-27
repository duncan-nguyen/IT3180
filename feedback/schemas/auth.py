from enum import Enum
from uuid import UUID

from pydantic import BaseModel


class UserRole(Enum):
    ADMIN = "admin"
    TO_TRUONG = "to_truong"
    CAN_BO_PHUONG = "can_bo_phuong"
    NGUOI_DAN = "nguoi_dan"


class UserInfor(BaseModel):
    id: UUID
    role: UserRole
    username: str
    scope_id: str
    active: bool

    class Config:
        use_enum_values = True


class AuthRes(BaseModel):
    id: UUID
    scope_id: str
    role: UserRole

    class Config:
        use_enum_values = True
