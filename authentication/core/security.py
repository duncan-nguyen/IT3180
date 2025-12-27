from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException
from models import AuditLog, User
from schemas.auth_schema import AuditLogForm, UserInfor, UserRole
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import (
    ACCESS_TOKEN_EXPIRES,
    ALGORITHM,
    REFRESH_TOKEN_EXPIRES,
    SECRET_KEY,
)
from core.utils import verify_pw


async def authenticate_user(
    username: str, password: str, db: AsyncSession
) -> str | None:
    query = select(User).where(User.username == username)
    result = await db.execute(query)
    user = result.scalar_one_or_none()

    if not user:
        return None

    # Check if account is locked
    if not user.active:
        return None

    if verify_pw(password, user.password_hash):
        return str(user.id)
    return None


def create_token(user_id: str, token_type: str, expires_delta) -> str:
    exp = datetime.now(timezone.utc)
    if token_type == "access_token":
        exp = exp + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRES))
    elif token_type == "refresh_token":
        exp = exp + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRES))
    # tạo token
    to_encode = {"id": user_id, "iat": datetime.now(timezone.utc), "exp": exp}
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_payload(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidSignatureError:
        raise HTTPException(status_code=401, detail="Invalid token signature")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token: " + str(e))


async def get_current_user(access_token: str, db: AsyncSession):
    payload = get_payload(access_token)
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token: missing user ID")

    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    u = result.scalar_one_or_none()

    if not u:
        raise HTTPException(status_code=401, detail="User not found")

    if not u.active:
        raise HTTPException(status_code=401, detail="User is inactive")

    return UserInfor(
        id=u.id,
        username=u.username,
        role=UserRole(u.role),
        active=bool(u.active),
        scope_id=str(u.scope_id) if u.scope_id else "",
    )


def recreate_token(refresh_token: str) -> str:
    payload = get_payload(refresh_token)
    user_id = payload.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
    new_access_token = create_token(
        user_id, "access_token", timedelta(minutes=ACCESS_TOKEN_EXPIRES)
    )
    return new_access_token


async def save_audit_log(log: AuditLogForm, db: AsyncSession):
    try:
        payload = log.model_dump(mode="json")
        # Map payload to AuditLog model
        audit_log = AuditLog(
            user_id=log.user_id,
            action=log.action,
            entity_name=log.entity_name,
            entity_id=log.entity_id,
            before_state=log.before_state,
            after_state=log.after_state,
            timestamp=datetime.now(timezone.utc),
        )
        db.add(audit_log)
        await db.commit()

    except Exception as e:
        # KHÔNG raise HTTPException trong background task
        print("AUDIT LOG ERROR:", str(e))
