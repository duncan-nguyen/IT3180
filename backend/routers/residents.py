from datetime import date

from fastapi import APIRouter, Body, Depends, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from core.auth_bearer import JWTBearer
from core.utils import hash_pw, verify_pw
from database import get_db
from models import User
from models.citizen import Citizen
from schemas.auth import UserInfor, UserRole
from schemas.resident import (
    ChangePasswordRequest,
    CitizenSelfUpdate,
    NhankhauCreate,
    NhankhauUpdate,
)
from services.resident_service import ResidentService

router = APIRouter(prefix="/residents", tags=["residents"])

COMMON_ROLES = [UserRole.ADMIN, UserRole.TO_TRUONG, UserRole.CAN_BO_PHUONG]


@router.get("/", summary="Get all citizens with pagination")
async def get_all_nhankhau(
    q: str | None = Query(None, description="Search query (name or CCCD)"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        response = await ResidentService.get_all_nhankhau(q=q, page=page, limit=limit)
        return {
            "data": response.data,
            "pagination": response.meta,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get("/search", summary="Search citizens by name or CCCD number")
async def search_nhankhau(
    q: str = Query(..., description="Query string to search by name or CCCD number"),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        response = await ResidentService.search_nhankhau(q)
        # Return full citizen data for matching in frontend
        formatted = [
            {
                "id": item["id"],
                "full_name": item["full_name"],
                "cccd_number": item.get("cccd_number"),
                "date_of_birth": str(item.get("date_of_birth")) if item.get("date_of_birth") else None,
                "household": item.get("household"),
            }
            for item in response.data
        ]

        return {"data": formatted}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get("/count", summary="Count total citizens")
async def count_nhankhau(
    to_id: str | None = Query(None, description="ID tổ dân phố"),
    phuong_id: str | None = Query(None, description="ID phường xã"),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        response = await ResidentService.count_nhankhau(
            to_id=to_id, phuong_id=phuong_id
        )
        return {
            "data": len(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.post("/", summary="Create new citizen")
async def create_nhankhau(
    data: NhankhauCreate,
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        data_dict = data.model_dump(exclude_none=True)
        response = await ResidentService.create_nhankhau(data_dict)
        return {
            "data": response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


# ==================== CITIZEN SELF-SERVICE ENDPOINTS ====================
# NOTE: These /me endpoints MUST be defined BEFORE /{id} endpoints
# Otherwise FastAPI will match /me as /{id} with id="me"


@router.get("/me", summary="Get current citizen's information")
async def get_my_info(
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.NGUOI_DAN])),
    db: AsyncSession = Depends(get_db),
):
    """Get the logged-in citizen's personal information"""
    try:
        # scope_id contains the citizen's ID
        citizen_id = user_data.scope_id
        if not citizen_id:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": {
                        "code": "NO_CITIZEN_LINKED",
                        "message": "Tài khoản không liên kết với nhân khẩu nào.",
                    }
                },
            )

        response = await ResidentService.get_nhankhau_detail(citizen_id)
        if not response.data:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Không tìm thấy thông tin nhân khẩu.",
                    }
                },
            )

        return {"data": response.data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.put("/me", summary="Update current citizen's personal information")
async def update_my_info(
    update_data: CitizenSelfUpdate = Body(...),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.NGUOI_DAN])),
    db: AsyncSession = Depends(get_db),
):
    """
    Update the logged-in citizen's personal information.
    Only non-critical fields can be updated (occupation, workplace, etc.)
    Critical fields like CCCD, household_id, relationship_to_head cannot be changed.
    """
    try:
        citizen_id = user_data.scope_id
        if not citizen_id:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": {
                        "code": "NO_CITIZEN_LINKED",
                        "message": "Tài khoản không liên kết với nhân khẩu nào.",
                    }
                },
            )

        # Check if citizen exists
        existing = await ResidentService.get_nhankhau_detail(citizen_id)
        if not existing.data:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Không tìm thấy thông tin nhân khẩu.",
                    }
                },
            )

        # Update only non-None fields
        update_fields = {
            k: v for k, v in update_data.model_dump(exclude_unset=True).items() if v is not None
        }

        if not update_fields:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": {
                        "code": "NO_FIELDS_TO_UPDATE",
                        "message": "Không có trường nào để cập nhật.",
                    }
                },
            )

        response = await ResidentService.update_nhankhau(citizen_id, update_fields)
        return {"data": response.data, "message": "Cập nhật thông tin thành công."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.post("/me/change-password", summary="Change current user's password")
async def change_my_password(
    password_data: ChangePasswordRequest = Body(...),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.NGUOI_DAN])),
    db: AsyncSession = Depends(get_db),
):
    """
    Change the logged-in citizen's password.
    Requires old password verification.
    """
    try:
        # Get user from database
        query = select(User).where(User.id == user_data.id)
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "USER_NOT_FOUND",
                        "message": "Không tìm thấy tài khoản.",
                    }
                },
            )

        # Verify old password
        if not verify_pw(password_data.old_password, user.password_hash):
            raise HTTPException(
                status_code=400,
                detail={
                    "error": {
                        "code": "WRONG_PASSWORD",
                        "message": "Mật khẩu hiện tại không đúng.",
                    }
                },
            )

        # Check new password is different from old
        if password_data.old_password == password_data.new_password:
            raise HTTPException(
                status_code=400,
                detail={
                    "error": {
                        "code": "SAME_PASSWORD",
                        "message": "Mật khẩu mới phải khác mật khẩu cũ.",
                    }
                },
            )

        # Update password
        stmt = update(User).where(User.id == user_data.id).values(
            password_hash=hash_pw(password_data.new_password)
        )
        await db.execute(stmt)
        await db.commit()

        return {"message": "Đổi mật khẩu thành công."}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


# ==================== ADMIN/LEADER ENDPOINTS WITH {id} ====================


@router.get("/{id}", summary="Get citizen information with ID")
async def get_nhankhau_detail(
    id: str,
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        response = await ResidentService.get_nhankhau_detail(id)
        if not response:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Không tìm thấy nhân khẩu.",
                    }
                },
            )
        return {
            "data": response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.put("/{id}", summary="Update citizen information")
async def update_nhankhau(
    id: str,
    data: NhankhauUpdate,
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        existing = await ResidentService.get_nhankhau_detail(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Không tìm thấy nhân khẩu.",
                    }
                },
            )

        current_data = existing.data
        payload = jsonable_encoder(data.model_dump(exclude_unset=True))
        old_household = existing.data.get("household_id")
        new_household = payload.get("household_id", old_household)

        change_type = None
        from_household_id = None
        to_household_id = None

        if old_household != new_household:
            if old_household and not new_household:
                change_type = "MOVE_OUT"
                from_household_id = old_household
            elif not old_household and new_household:
                change_type = "MOVE_IN"
                to_household_id = new_household
            elif old_household and new_household and old_household != new_household:
                change_type = "CHANGE_HOUSEHOLD"
                from_household_id = old_household
                to_household_id = new_household

        update_result = await ResidentService.update_nhankhau(id, payload)

        if change_type:
            movement_data = {
                "citizen_id": id,
                "change_type": change_type,
                "from_household_id": from_household_id,
                "to_household_id": to_household_id,
                "change_date": date.today().isoformat(),
                "notes": f"Nhân khẩu {current_data.get('full_name')} thực hiện thay đổi: {change_type}",
            }
            await ResidentService.create_movement_log(movement_data)

        return {
            "data": update_result.data,
            "movement_logged": bool(change_type),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.delete("/{id}", summary="Soft delete a citizen with ID")
async def delete_nhankhau(
    id: str,
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN])),
):
    try:
        existing = await ResidentService.get_nhankhau_detail(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Không tìm thấy nhân khẩu.",
                    }
                },
            )

        response = await ResidentService.delete_nhankhau(id)
        return {
            "data": bool(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get("/{id}/lich-su-bien-dong", summary="Get movement logs of a citizen")
async def get_nhankhau_movement_logs(id: str):
    try:
        existing = await ResidentService.get_nhankhau_detail(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {
                        "code": "NOT_FOUND",
                        "message": "Không tìm thấy nhân khẩu.",
                    }
                },
            )

        response = await ResidentService.get_nhankhau_movement_logs(id)
        return {
            "data": response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )
