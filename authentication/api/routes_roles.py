from typing import List

from core.auth_bearer import JWTBearer
from core.permissions import (
    ALL_PERMISSIONS,
    PERMISSION_CATEGORIES,
    ROLE_METADATA,
    ROLE_PERMISSIONS,
)
from database.database import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import User
from schemas.auth_schema import UserInfor, UserRole
from schemas.role_schema import (
    PermissionCategory,
    PermissionItem,
    RoleDetailResponse,
    RoleResponse,
)
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

roles_router = APIRouter(prefix="/roles", tags=["roles"])


@roles_router.get("", response_model=List[RoleResponse])
async def get_all_roles(
    db: AsyncSession = Depends(get_db),
    _: UserInfor = Depends(JWTBearer(accepted_role_list=UserRole.ADMIN)),
):
    """
    Get all roles with their basic information and user counts
    """
    roles_data = []

    for role_code, metadata in ROLE_METADATA.items():
        # Count users with this role
        query = select(func.count(User.id)).where(User.role == role_code)
        result = await db.execute(query)
        user_count = result.scalar() or 0

        # Get role permissions
        permissions = ROLE_PERMISSIONS.get(role_code, [])
        permission_names = [ALL_PERMISSIONS.get(p, p) for p in permissions]

        roles_data.append(
            RoleResponse(
                id=hash(role_code) % 1000,  # Generate a simple ID from role code
                name=metadata["name"],
                code=metadata["code"],
                color=metadata["color"],
                description=metadata.get("description"),
                user_count=user_count,
                permissions=permission_names,
            )
        )

    return roles_data


@roles_router.get("/{role_code}", response_model=RoleDetailResponse)
async def get_role_detail(
    role_code: str,
    db: AsyncSession = Depends(get_db),
    _: UserInfor = Depends(JWTBearer(accepted_role_list=UserRole.ADMIN)),
):
    """
    Get detailed information about a specific role including categorized permissions
    """
    # Validate role exists
    if role_code not in ROLE_METADATA:
        raise HTTPException(status_code=404, detail="Role not found")

    metadata = ROLE_METADATA[role_code]

    # Count users with this role
    query = select(func.count(User.id)).where(User.role == role_code)
    result = await db.execute(query)
    user_count = result.scalar() or 0

    # Get role permissions
    role_permissions = set(ROLE_PERMISSIONS.get(role_code, []))

    # Organize permissions by category
    permission_categories = []
    for category_info in PERMISSION_CATEGORIES:
        items = []
        for perm_id in category_info["permissions"]:
            items.append(
                PermissionItem(
                    id=perm_id,
                    name=ALL_PERMISSIONS.get(perm_id, perm_id),
                    enabled=perm_id in role_permissions,
                )
            )

        permission_categories.append(
            PermissionCategory(category=category_info["category"], items=items)
        )

    return RoleDetailResponse(
        id=hash(role_code) % 1000,
        name=metadata["name"],
        code=metadata["code"],
        color=metadata["color"],
        description=metadata.get("description"),
        user_count=user_count,
        permissions=permission_categories,
    )


@roles_router.get("/{role_code}/permissions", response_model=List[str])
async def get_role_permissions(
    role_code: str, _: UserInfor = Depends(JWTBearer(accepted_role_list=UserRole.ADMIN))
):
    """
    Get list of permission IDs for a specific role
    """
    if role_code not in ROLE_METADATA:
        raise HTTPException(status_code=404, detail="Role not found")

    return ROLE_PERMISSIONS.get(role_code, [])
