from pydantic import BaseModel, Field, field_validator
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime, timezone, timedelta, date

class NhankhauCreate(BaseModel):
    household_id: UUID = Field(..., description='ID hộ khẩu của nhân khẩu')
    full_name: str = Field(..., description='Họ và tên', max_length=100)
    date_of_birth: date = Field(..., description='Ngày sinh', example='2005-09-02')
    place_of_birth: str | None = Field(None, description='Nơi sinh', max_length=255)
    hometown: str | None = Field(None, description='Nguyên quán', max_length=255)
    ethnicity: str | None = Field(None, description='Dân tộc', max_length=50)
    occupation: str | None = Field(None, description='Nghề nghiệp', max_length=100)
    workplace: str | None = Field(None, description='Nơi làm việc', max_length=255)
    cccd_number: str = Field(..., description='Số CCCD', max_length=12)
    cccd_issue_date: str | None = Field(None, description='Ngày cấp CCCD', example='2020-01-15')
    cccd_issue_place: str | None = Field(None, description='Nơi cấp CCCD', max_length=255)
    residence_registration_date: str | None = Field(None, description='Ngày đăng ký thường trú', example='2020-01-15')
    relationship_to_head: str | None = Field(None, description='Quan hệ với chủ hộ', max_length=50)


class NhankhauUpdate(BaseModel):
    household_id: UUID | None = Field(None, description='ID hộ khẩu của nhân khẩu')
    full_name: str | None = Field(None, description='Họ và tên', max_length=100)
    date_of_birth: date | None = Field(None, description='Ngày sinh', example='2005-09-02')
    place_of_birth: str | None = Field(None, description='Nơi sinh', max_length=255)
    hometown: str | None = Field(None, description='Nguyên quán', max_length=255)
    ethnicity: str | None = Field(None, description='Dân tộc', max_length=50)
    occupation: str | None = Field(None, description='Nghề nghiệp', max_length=100)
    workplace: str | None = Field(None, description='Nơi làm việc', max_length=255)
    cccd_number: str | None = Field(None, description='Số CCCD', max_length=12)
    cccd_issue_date: str | None = Field(None, description='Ngày cấp CCCD', example='2020-01-15')
    cccd_issue_place: str | None = Field(None, description='Nơi cấp CCCD', max_length=255)
    residence_registration_date: str | None = Field(None, description='Ngày đăng ký thường trú', example='2020-01-15')
    relationship_to_head: str | None = Field(None, description='Quan hệ với chủ hộ', max_length=50)
