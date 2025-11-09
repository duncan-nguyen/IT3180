from enum import Enum

from pydantic import BaseModel, Field


class UserRole(Enum):
    ADMIN = 'admin'
    TO_TRUONG = 'to_truong'
    CAN_BO_PHUONG = 'can_bo_phuong'
    NGUOI_DAN = "nguoi_dan"

class UserInfor(BaseModel):
    id: int
    role: UserRole 
    username: str = Field(min_length=5, max_length=25)
    class Config:
        use_enum_values = True 

class TokenRes(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class AccessTokenResponse(BaseModel):
    """Response model cho refresh token endpoint"""
    access_token: str
    token_type: str


class RefreshTokenRequest(BaseModel):
    """Request model cho refresh token"""
    refresh_token: str
