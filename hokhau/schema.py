from pydantic import BaseModel, Field, field_validator
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone, timedelta

class HokhauCreate(BaseModel):
    # id: UUID = None #Field(..., description='ID của hộ khẩu')
    household_number: str = Field(..., max_length=50, description='Số hộ khẩu')
    head_of_household_id: UUID | None = Field(None, description='ID của chủ hộ')
    address: str = Field(..., max_length=255, description='Địa chỉ')
    ward: str = Field(..., max_length=100, description='Tên phường/xã')
    # scope_id: str | None = Field(None, max_length=50, description='ID của tổ/phường')
    # created_at: datetime = Field(default_factory=lambda: datetime.now(timezone(timedelta(hours=7))))
    # updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone(timedelta(hours=7))))

    @field_validator('head_of_household_id', mode='before')
    def empty_string_2_none(cls, v):
        if v == '' or v is None:
            return None
        return v
    

class HokhauUpdate(BaseModel):
    household_number: str | None = Field(None, max_length=50, description='Số hộ khẩu')
    head_of_household_id: UUID | None = Field(None, description='ID của chủ hộ')
    address: str | None = Field(None, max_length=255, description='Địa chỉ')
    ward: str | None = Field(None, max_length=100, description='Tên phường/xã')
    scope_id: str | None = Field(None, max_length=50, description='ID của tổ/phường')
    updated_at: Optional[datetime] = None
