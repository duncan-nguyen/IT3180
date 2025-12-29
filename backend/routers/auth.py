from datetime import timedelta
from typing import Annotated

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Body,
    Depends,
    HTTPException,
    status,
)
from fastapi.encoders import jsonable_encoder
from fastapi.security.oauth2 import OAuth2PasswordRequestForm
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from core.auth_bearer import JWTBearer, JWTBearerMe
from core.config import ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES
from core.security import (
    authenticate_user,
    create_token,
    get_current_user,
    recreate_token,
    save_audit_log,
)
from core.utils import hash_pw
from database import get_db
from models import User
from schemas.auth import (
    AccessTokenResponse,
    AuditLogForm,
    AuthRes,
    LoginRes,
    RefreshTokenRequest,
    ResetPasswordForm,
    UserCreateForm,
    UserInfor,
    UserRole,
    UserUpdateForm,
    ValidateRequest,
)

router = APIRouter()


@router.post("/validate", response_model=AuthRes, status_code=200)
async def auth_check(request_data: ValidateRequest, db: AsyncSession = Depends(get_db)):
    token = request_data.access_token
    user = await get_current_user(token, db)

    if request_data.username != user.username:
        raise HTTPException(
            status_code=401,
            detail="Username mismatch: provided username does not match token",
        )

    return AuthRes(
        role=user.role, id=user.id, scope_id=str(user.scope_id) if user.scope_id else ""
    )


async def exist_user_checking(id: str, db: AsyncSession):
    query = select(User).where(User.id == id)
    result = await db.execute(query)
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="ID Not Found")


@router.post("/login", response_model=LoginRes, status_code=status.HTTP_200_OK)
async def login_for_access_token(
    format_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: AsyncSession = Depends(get_db),
):
    try:
        username = format_data.username
        password = format_data.password
        id = await authenticate_user(username, password, db)
        if not id:
            raise HTTPException(
                status_code=400,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        access_token = create_token(
            id, "access_token", timedelta(minutes=ACCESS_TOKEN_EXPIRES)
        )
        refresh_token = create_token(
            id, "refresh_token", timedelta(days=REFRESH_TOKEN_EXPIRES)
        )

        query = select(User).where(User.id == id)
        result = await db.execute(query)
        data = result.scalar_one()

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail="Incorrect username or password " + str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_data = UserInfor(
        id=data.id,
        username=data.username,
        role=UserRole(data.role),
        scope_id=str(data.scope_id) if data.scope_id else "",
        active=bool(data.active),
    )
    return LoginRes(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=user_data,
    )


@router.get("/me", response_model=UserInfor, status_code=status.HTTP_200_OK)
async def get_me(user_data: UserInfor = Depends(JWTBearerMe())):
    try:
        return user_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")


@router.get("/users", response_model=list[UserInfor], status_code=200)
async def get_users(
    user_data: UserInfor = Depends(JWTBearer([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db),
):
    try:
        query = select(User)
        res = await db.execute(query)
        db_users = res.scalars().all()
        li: list[UserInfor] = []
        for u in db_users:
            li.append(
                UserInfor(
                    id=u.id,
                    username=u.username,
                    role=u.role,
                    active=bool(u.active),
                    scope_id=str(u.scope_id) if u.scope_id else "",
                )
            )
        return li
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")


@router.get("/users/{id}", response_model=UserInfor, status_code=200)
async def get_user_by_id(
    id: str,
    user_data: UserInfor = Depends(JWTBearer([UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db),
):
    """Get a single user by ID"""
    try:
        query = select(User).where(User.id == id)
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return UserInfor(
            id=user.id,
            username=user.username,
            role=user.role,
            active=bool(user.active),
            scope_id=str(user.scope_id) if user.scope_id else "",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")


@router.post("/users", status_code=200)
async def create_user(
    user: UserCreateForm = Body(..., embed=True),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=UserRole.ADMIN)),
    db: AsyncSession = Depends(get_db),
):
    query = select(User).where(User.username == user.username)
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Username already exists"
        )
    try:
        new_user = User(
            username=user.username,
            role=user.role.value,
            scope_id=user.scope_id,
            password_hash=hash_pw(user.password),
            active=True,
        )
        db.add(new_user)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")
    return {"message": "Successfully Created"}


@router.post("/users/{id}", status_code=200)
async def update_user(
    id: str,
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN])),
    update_data: UserUpdateForm = Body(..., embed=True),
    db: AsyncSession = Depends(get_db),
):
    await exist_user_checking(id, db)
    try:
        update_fields = {
            k: v if k != "role" else v.value
            for k, v in update_data.model_dump(exclude_unset=True).items()
            if v is not None
        }
        if not update_fields:
            raise HTTPException(status_code=400, detail="Invalid Update Form")

        stmt = update(User).where(User.id == id).values(**update_fields)
        await db.execute(stmt)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")
    return {"message": "Successfully Updated"}


@router.post("/{id}/reset-password")
async def reset_password(
    id: str,
    password: ResetPasswordForm = Body(..., embed=True),
    user: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN])),
    db: AsyncSession = Depends(get_db),
):
    await exist_user_checking(id, db)
    try:
        stmt = (
            update(User)
            .where(User.id == id)
            .values(password_hash=hash_pw(password.password))
        )
        await db.execute(stmt)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")
    return {"message": "Successfully Updated"}


@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh_token(refresh_token: RefreshTokenRequest = Body(..., embed=True)):
    try:
        new_access_token = recreate_token(refresh_token.refresh_token)
        return AccessTokenResponse(access_token=new_access_token, token_type="bearer")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Invalid refresh token: {str(e)}")


@router.delete("/users/{id}/delete", status_code=200)
async def delete_user(
    id: str,
    user_data: UserInfor = Depends(
        JWTBearer(accepted_role_list=[UserRole.ADMIN.value])
    ),
    db: AsyncSession = Depends(get_db),
):
    await exist_user_checking(id, db)
    try:
        stmt = delete(User).where(User.id == id)
        await db.execute(stmt)
        await db.commit()
        return {"message": "Successfully Deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")


@router.post("/users/{id}/lock", status_code=200)
async def lock_user(
    id: str,
    user_data: UserInfor = Depends(
        JWTBearer(accepted_role_list=[UserRole.ADMIN.value])
    ),
    db: AsyncSession = Depends(get_db),
):
    await exist_user_checking(id, db)
    try:
        stmt = update(User).where(User.id == id).values(active=False)
        await db.execute(stmt)
        await db.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")
    return {"message": "Successfully Locked"}


@router.put("/users/{id}/unlock", status_code=200)
async def unlock_user(
    id: str,
    background_task: BackgroundTasks,
    user_data: UserInfor = Depends(
        JWTBearer(accepted_role_list=[UserRole.ADMIN.value])
    ),
    db: AsyncSession = Depends(get_db),
):
    await exist_user_checking(id, db)
    try:
        result = await db.execute(select(User).where(User.id == id))
        before_data = result.scalar_one().__dict__.copy()
        if "_sa_instance_state" in before_data:
            del before_data["_sa_instance_state"]

        stmt = update(User).where(User.id == id).values(active=True)
        await db.execute(stmt)
        await db.commit()

        result = await db.execute(select(User).where(User.id == id))
        after_data = result.scalar_one().__dict__.copy()
        if "_sa_instance_state" in after_data:
            del after_data["_sa_instance_state"]

        t = AuditLogForm(
            user_id=user_data.id,
            action="UNLOCK_USER",
            entity_name="USER",
            entity_id=id,
            before_state=jsonable_encoder(before_data),
            after_state=jsonable_encoder(after_data),
        )
        await save_audit_log(t, db)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"{str(e)}")
    return {"message": "Successfully Unlocked"}
