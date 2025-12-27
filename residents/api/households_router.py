from datetime import datetime, timedelta, timezone
from typing import Optional

from core.remote_auth import RemoteBearer
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from schemas.auth import UserInfor, UserRole
from schemas.household import HokhauCreate, HokhauUpdate
from services.household_service import HouseholdService

router = APIRouter(prefix="/households", tags=["households"])

COMMON_ROLES = [UserRole.ADMIN, UserRole.TO_TRUONG, UserRole.CAN_BO_PHUONG]


@router.get("/count", summary="Count total households")
async def count_hokhau(
    to_id: str | None = Query(None, description="ID tổ"),
    phuong_id: str | None = Query(None, description="ID phường"),
    user_data: UserInfor = Depends(RemoteBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        response = await HouseholdService.count_hokhau(to_id=to_id, phuong_id=phuong_id)
        return {
            "data": len(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get("/", summary="Get household list")
async def get_hokhau_list(
    q: Optional[str] = Query(None, description="Tìm kiếm theo tên chủ hộ hoặc địa chỉ"),
    phuong_xa: Optional[str] = Query(None, description="Lọc theo phường/xã"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
    user_data: UserInfor = Depends(RemoteBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        response = await HouseholdService.get_hokhau_list(
            q=q,
            phuong_xa=phuong_xa,
            page=page,
            limit=limit,
        )
        return {
            "data": response.data,
            "pagination": {"page": page, "limit": limit, "count": len(response.data)},
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get("/{id}", summary="Get household information with ID")
async def get_hokhau_detail(
    id: str,
    user_data: UserInfor = Depends(RemoteBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        response = await HouseholdService.get_hokhau_detail(id)
        if not response:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {"code": "NOT_FOUND", "message": "Không tìm thấy hộ khẩu."}
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


@router.post("/", summary="Create new household")
async def create_hokhau(
    data: HokhauCreate,
    user_data: UserInfor = Depends(RemoteBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        data_dict = data.model_dump(mode="json")
        response = await HouseholdService.create_hokhau(data_dict)
        return {
            "data": response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.put("/{id}", summary="Update household information")
async def update_hokhau(
    id: str,
    data: HokhauUpdate,
    user_data: UserInfor = Depends(RemoteBearer(accepted_role_list=COMMON_ROLES)),
):
    try:
        existing = await HouseholdService.get_hokhau_detail_without_nhankhau(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {"code": "NOT_FOUND", "message": "Không tìm thấy hộ khẩu."}
                },
            )

        data_dict = data.model_dump(exclude_unset=True)  # mode='json'
        changed_fields = {
            k: v for k, v in data_dict.items() if existing.data.get(k) != v
        }
        if not changed_fields:
            return {
                "data": existing.data,
                "message": "Không có thay đổi nào được thực hiện.",
            }

        changed_fields["updated_at"] = datetime.now(timezone(timedelta(hours=7)))
        changed_fields = jsonable_encoder(changed_fields)
        response = await HouseholdService.update_hokhau(id, changed_fields)
        return {"data": response.data}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.delete("/{id}", summary="Soft delete a household with ID")
async def delete_hokhau(
    id: str,
    user_data: UserInfor = Depends(RemoteBearer(accepted_role_list=[UserRole.ADMIN])),
):
    try:
        existing = await HouseholdService.get_hokhau_detail_without_nhankhau(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {"code": "NOT_FOUND", "message": "Không tìm thấy hộ khẩu."}
                },
            )

        response = await HouseholdService.delete_hokhau(id)
        return {
            "data": bool(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )
        return {
            "data": bool(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get("/me/info", summary="Get household information of current user (Citizen)")
async def get_my_household(
    user_data: UserInfor = Depends(RemoteBearer(accepted_role_list=[UserRole.NGUOI_DAN])),
):
    try:
        # For Citizen, scope_id MUST be their citizen_id
        if not user_data.scope_id:
             raise HTTPException(
                status_code=400,
                detail={"error": {"code": "INVALID_SCOPE", "message": "Tài khoản chưa được liên kết với nhân khẩu."}}
            )

        response = await HouseholdService.get_household_by_citizen_id(user_data.scope_id)
        if not response:
            raise HTTPException(
                status_code=404,
                detail={
                    "error": {"code": "NOT_FOUND", "message": "Không tìm thấy hộ khẩu của bạn."}
                },
            )
        return {
            "data": response.data,
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )
