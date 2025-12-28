from database import get_db
from fastapi import Depends, HTTPException, Request
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from schemas.auth import UserInfor, UserRole
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_current_user


class JWTBearer(HTTPBearer):
    def __init__(
        self,
        accepted_role_list: list[UserRole] | UserRole,
        accepted_scope_list: list[str] | None = None,
        auto_error: bool = True,
    ):
        super().__init__(auto_error=auto_error)
        if not isinstance(accepted_role_list, list):
            accepted_role_list = [accepted_role_list]
        self.accepted_role_list = accepted_role_list
        self.accepted_scope_list = accepted_scope_list

    async def __call__(
        self, request: Request, db: AsyncSession = Depends(get_db)
    ) -> UserInfor:
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if not credentials:
            raise HTTPException(status_code=403, detail="Invalid authorization code")
        if credentials.scheme != "Bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
        token = credentials.credentials
        user_data = await get_current_user(token, db)
        if (
            user_data is not None
            and hasattr(user_data, "active")
            and hasattr(user_data, "role")
            and hasattr(user_data, "id")
            and hasattr(user_data, "scope_id")
        ):
            if not user_data.active:
                raise HTTPException(status_code=403, detail="Locked User")
            # Compare role values - user_data.role is string due to use_enum_values=True
            accepted_role_values = [r.value if hasattr(r, 'value') else r for r in self.accepted_role_list]
            if user_data.role in accepted_role_values:
                return user_data
            else:
                raise HTTPException(status_code=403, detail="Insufficient permissions")
        else:
            raise HTTPException(status_code=401, detail="Invalid User")


class JWTBearerMe(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super().__init__(auto_error=auto_error)

    async def __call__(
        self, request: Request, db: AsyncSession = Depends(get_db)
    ) -> UserInfor:
        try:
            credentials: HTTPAuthorizationCredentials = await super().__call__(request)
            if not credentials:
                raise HTTPException(
                    status_code=403, detail="Invalid authorization code"
                )
            if credentials.scheme != "Bearer":
                raise HTTPException(status_code=401, detail="Invalid auth scheme")
            token = credentials.credentials
            user_data: UserInfor = await get_current_user(token, db)
            return user_data
        except HTTPException as e:
            raise HTTPException(status_code=500, detail=f"{str(e)}")
