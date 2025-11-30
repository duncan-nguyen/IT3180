from enum import Enum
from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional
class UserRole(Enum):
    ADMIN = 'Admin'
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