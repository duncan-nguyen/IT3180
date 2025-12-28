from datetime import date

from core.auth_bearer import JWTBearer
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.encoders import jsonable_encoder
from schemas.auth import UserInfor, UserRole
from schemas.resident import NhankhauCreate, NhankhauUpdate
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
        formatted = [
            {
                "id": item["id"],
                "ho_ten": item["full_name"],
                "dia_chi": item.get("household", {}).get("address"),
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
        data_dict = data.model_dump(mode="json", exclude_none=True)
        response = await ResidentService.create_nhankhau(data_dict)
        return {
            "data": response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


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
