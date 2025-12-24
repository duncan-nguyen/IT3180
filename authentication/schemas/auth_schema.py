from enum import Enum
from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional
class UserRole(Enum):
    ADMIN = 'Admin' #sua lai viet thuong
    TO_TRUONG = 'ToTruong'
    CAN_BO_PHUONG = 'CanBoPhuong'
    NGUOI_DAN = "NguoiDan"


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
    role: UserRole | None = None
    scope_id: str | None = None
    
class ResetPasswordForm(BaseModel):
    password: str


class Action(Enum):
    CREATE_CITIZEN = 'CREATE_CITIZEN'
    UPDATE_CITIZEN = 'UPDATE_CITIZEN'
    DELETE_CITIZEN = 'DELETE_CITIZEN'
    LOCK = 'LOCK'
    #MO RONG THEM

class Entity(Enum):
    Citizens = 'Citizens'
    Users = 'Users'
    Households: 'Households'
    #MO RONG THEM
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