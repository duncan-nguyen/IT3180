from fastapi import FastAPI, APIRouter, Query, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
import os
from nhankhau.database import Database
from typing import Optional, Dict, Any
from nhankhau.schema import NhankhauCreate, NhankhauUpdate
from uuid import uuid4
from datetime import datetime, date

from schemas.auth_schema import UserInfor, UserRole
from core.auth_bearer import JWTBearer


router = APIRouter(prefix='/nhankhau', tags=['nhankhau'])


@router.get('/search', summary='Search citizens by name or CCCD number')
async def search_nhankhau(
    q: str = Query(..., description='Query string to search by name or CCCD number'),
):
    db = Database()
    try:
        response = await db.search_nhankhau(q)
        formatted = [
            {
                'id': item['id'],
                'ho_ten': item['full_name'],
                'dia_chi': item.get('household', {}).get('address'),
            }
            for item in response.data
        ]

        return {'data': formatted,}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get('/count', summary='Count total citizens')
async def count_nhankhau(
    to_id: str | None = Query(None, description='ID tổ dân phố'),
    phuong_id: str | None = Query(None, description='ID phường xã'),
):
    db = Database()
    try:
        response = await db.count_nhankhau(to_id=to_id, phuong_id=phuong_id)
        return {
            'data': len(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )
    

@router.post('/', summary='Create new citizen')
async def create_nhankhau(data: NhankhauCreate):
    db = Database()
    try:
        data_dict = data.model_dump(mode='json', exclude_none=True)
        response = await db.create_nhankhau(data_dict)
        return {
            'data': response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get('/{id}', summary='Get citizen information with ID')
async def get_nhankhau_detail(
    id: str, 
):
    db = Database()
    try:
        response = await db.get_nhankhau_detail(id)
        if not response:
            raise HTTPException(
                status_code=404,
                detail={"error": {"code": "NOT_FOUND", "message": "Không tìm thấy nhân khẩu."}},
            )
        return {
            'data': response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.put('/{id}', summary='Update citizen information')
async def update_nhankhau(
    id: str,
    data: NhankhauUpdate,
):
    db = Database()
    await db.init_client()

    try:
        existing = await db.get_nhankhau_detail(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={"error": {"code": "NOT_FOUND", "message": "Không tìm thấy nhân khẩu."}},
            )
        
        current_data = existing.data
        payload = jsonable_encoder(data.model_dump(exclude_unset=True))
        old_household = existing.data.get('household_id')
        new_household = payload.get('household_id', old_household)

        change_type = None
        from_household_id = None
        to_household_id = None

        if old_household != new_household:
            # CASE 1: MOVE OUT
            if old_household and not new_household:
                change_type = 'MOVE_OUT'
                from_household_id = old_household
            # CASE 2: MOVE IN
            elif not old_household and new_household:
                change_type = 'MOVE_IN'
                to_household_id = new_household
            # CASE 3: CHANGE HOUSEHOLD
            elif old_household and new_household and old_household != new_household:
                change_type = 'CHANGE_HOUSEHOLD'
                from_household_id = old_household
                to_household_id = new_household
        
        update_result = await db.update_nhankhau(id, payload)

        # if there is a household change, create movement log
        if change_type:
            movement_data = {
                'citizen_id': id,
                'change_type': change_type,
                'from_household_id': from_household_id,
                'to_household_id': to_household_id,
                'change_date': date.today().isoformat(),
                'notes': f'Nhân khẩu {current_data.get("full_name")} thực hiện thay đổi: {change_type}',
            }
            await db.create_movement_log(movement_data)
        
        return {
            'data': update_result.data,
            'movement_logged': bool(change_type),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.delete('/{id}', summary='Soft delete a citizen with ID')
async def delete_nhankhau(
    id: str, 
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value])),
):
    db = Database()
    try:
        existing = await db.get_nhankhau_detail(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={"error": {"code": "NOT_FOUND", "message": "Không tìm thấy nhân khẩu."}},
            )
        
        response = await db.delete_nhankhau(id)
        return {
            'data': bool(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )
        
            
@router.get('/{id}/lich-su-bien-dong', summary='Get movement logs of a citizen')
async def get_nhankhau_movement_logs(
    id: str,
):
    db = Database()
    try:
        existing = await db.get_nhankhau_detail(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={"error": {"code": "NOT_FOUND", "message": "Không tìm thấy nhân khẩu."}},
            )
        
        response = await db.get_nhankhau_movement_logs(id)
        return {
            'data': response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )

