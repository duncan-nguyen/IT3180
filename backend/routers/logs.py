from datetime import datetime, time
from typing import Optional

from core.auth_bearer import JWTBearer
from database import get_db
from fastapi import APIRouter, Depends, HTTPException, Query
from models import AuditLog, User
from schemas.auth import UserInfor, UserRole
from schemas.role import (
    AuditLogListResponse,
    AuditLogResponse,
    AuditLogStatsResponse,
)
from sqlalchemy import and_, desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/audit-logs", tags=["audit_logs"])


@router.get("", response_model=AuditLogListResponse)
async def get_logs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    action_type: Optional[str] = None,
    role: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    _: UserInfor = Depends(JWTBearer(accepted_role_list=UserRole.ADMIN)),
):
    query = select(AuditLog, User.username, User.role).outerjoin(
        User, AuditLog.user_id == User.id
    )

    conditions = []

    if action_type:
        if action_type == "account":
            conditions.append(func.lower(AuditLog.entity_name).in_(["user", "account"]))
        elif action_type == "security":
            conditions.append(func.lower(AuditLog.action).in_(["login", "logout", "failed_login"]))
        elif action_type == "permission":
            conditions.append(func.lower(AuditLog.entity_name).in_(["role", "permission"]))
        elif action_type == "database":
            conditions.append(func.lower(AuditLog.action).in_(["backup", "restore"]))
        elif action_type == "settings":
            conditions.append(func.lower(AuditLog.entity_name) == "setting")

    if role:
        conditions.append(User.role == role)

    if status:
        if status == "success":
            pass
        elif status == "error":
            conditions.append(1 == 0)

    if search:
        search_lower = f"%{search.lower()}%"
        conditions.append(
            (func.lower(User.username).like(search_lower)) |
            (func.lower(AuditLog.action).like(search_lower))
        )

    if conditions:
        query = query.where(and_(*conditions))

    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar_one()

    total_pages = (total + page_size - 1) // page_size

    query = query.order_by(desc(AuditLog.timestamp))
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    rows = result.all()

    logs_data = []
    for log, username, user_role in rows:
        logs_data.append(
            AuditLogResponse(
                id=log.id,
                user_id=log.user_id,
                username=username,
                user_role=user_role,
                action=log.action,
                entity_name=log.entity_name,
                entity_id=log.entity_id,
                before_state=log.before_state,
                after_state=log.after_state,
                timestamp=log.timestamp,
            )
        )

    return AuditLogListResponse(
        logs=logs_data,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/stats", response_model=AuditLogStatsResponse)
async def get_stats(
    db: AsyncSession = Depends(get_db),
    _: UserInfor = Depends(JWTBearer(accepted_role_list=UserRole.ADMIN)),
):
    today = datetime.utcnow().date()
    start_of_today = datetime.combine(today, time.min)

    today_query = select(func.count(AuditLog.id)).where(AuditLog.timestamp >= start_of_today)
    today_result = await db.execute(today_query)
    today_count = today_result.scalar() or 0

    users_query = select(func.count(func.distinct(AuditLog.user_id)))
    users_result = await db.execute(users_query)
    unique_users = users_result.scalar() or 0

    total_query = select(func.count(AuditLog.id))
    total_result = await db.execute(total_query)
    total_count = total_result.scalar() or 0

    return AuditLogStatsResponse(
        today_count=today_count,
        success_count=total_count,
        error_count=0,
        unique_users=unique_users,
    )


@router.get("/{log_id}", response_model=AuditLogResponse)
async def get_log_detail(
    log_id: str,
    db: AsyncSession = Depends(get_db),
    _: UserInfor = Depends(JWTBearer(accepted_role_list=UserRole.ADMIN)),
):
    query = select(AuditLog, User.username, User.role).outerjoin(
        User, AuditLog.user_id == User.id
    ).where(AuditLog.id == log_id)

    result = await db.execute(query)
    row = result.first()

    if not row:
        raise HTTPException(status_code=404, detail="Log not found")

    log, username, user_role = row

    return AuditLogResponse(
        id=log.id,
        user_id=log.user_id,
        username=username,
        user_role=user_role,
        action=log.action,
        entity_name=log.entity_name,
        entity_id=log.entity_id,
        before_state=log.before_state,
        after_state=log.after_state,
        timestamp=log.timestamp,
    )
