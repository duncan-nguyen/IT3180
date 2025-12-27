from typing import List, Optional

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
