from pydantic import BaseModel, Field
from enum import Enum


class UserRole(Enum):
    ADMIN = 'admin'
    TO_TRUONG = 'to_truong'
    CAN_BO_PHUONG = 'can_bo_phuong'
    NGUOI_DAN = "nguoi_dan"

class UserInfor(BaseModel):
    id: int
    role: UserRole 
    username: str = Field(min_length = 5, max_length = 25)
    #scope
class TokenRes(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str
