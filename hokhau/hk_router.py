from fastapi import FastAPI, APIRouter, Query, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
import os
from hokhau.database import Database
from typing import Optional, Dict, Any
from hokhau.schema import HokhauCreate, HokhauUpdate
from uuid import uuid4
from datetime import datetime, timezone, timedelta


router = APIRouter(prefix='/hokhau', tags=['hokhau'])


@router.get("/count", summary="Count total households")
async def count_hokhau(
    to_id: str | None = Query(None, description="ID tổ"),
    phuong_id: str | None = Query(None, description="ID phường"),
):
    db = Database()
    try:
        response = await db.count_hokhau(to_id=to_id, phuong_id=phuong_id)
        return {
            'data': len(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get('/', summary='Get household list')
async def get_hokhau_list(
    q: Optional[str] = Query(None, description="Tìm kiếm theo tên chủ hộ hoặc địa chỉ"),
    phuong_xa: Optional[str] = Query(None, description="Lọc theo phường/xã"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=100),
):
    db = Database()
    try:
        response = await db.get_hokhau_list(
            q=q,
            phuong_xa=phuong_xa,
            page=page,
            limit=limit,
        )
        return {
            "data": response.data, 
            "pagination": {"page": page, "limit": limit, "count": len(response.data)}
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.get('/{id}', summary='Get household information with ID')
async def get_hokhau_detail(
    id: str, 
):
    db = Database()
    try:
        response = await db.get_hokhau_detail(id)
        if not response:
            raise HTTPException(
                status_code=404,
                detail={"error": {"code": "NOT_FOUND", "message": "Không tìm thấy hộ khẩu."}},
            )
        return {
            'data': response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )

  
@router.post('/', summary='Create new household')
async def create_hokhau(data: HokhauCreate):
    db = Database()
    try:
        data_dict = data.model_dump(mode='json')
        response = await db.create_hokhau(data_dict)
        return {
            'data': response.data,
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.put('/{id}', summary='Update household information')
async def update_hokhau(
    id: str,
    data: HokhauUpdate,
):
    db = Database()
    try:
        existing = await db.get_hokhau_detail_without_nhankhau(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={"error": {"code": "NOT_FOUND", "message": "Không tìm thấy hộ khẩu."}},
            )

        data_dict = data.model_dump(exclude_unset=True) # mode='json'
        changed_fields = {
            k: v for k, v in data_dict.items() if existing.data.get(k) != v
        }
        if not changed_fields:
            return {
                'data': existing.data,
                'message': 'Không có thay đổi nào được thực hiện.'
            }

        changed_fields['updated_at'] = datetime.now(timezone(timedelta(hours=7)))
        changed_fields = jsonable_encoder(changed_fields)
        response = await db.update_hokhau(id, changed_fields)
        return {
            "data": response.data
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )


@router.delete('/{id}', summary='Soft delete a household with ID')
async def delete_hokhau(
    id: str, 
):
    db = Database()
    try:
        existing = await db.get_hokhau_detail_without_nhankhau(id)
        if not existing:
            raise HTTPException(
                status_code=404,
                detail={"error": {"code": "NOT_FOUND", "message": "Không tìm thấy hộ khẩu."}},
            )
        
        response = await db.delete_hokhau(id)
        return {
            'data': bool(response.data),
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail={"error": {"code": "SERVER_ERROR", "message": str(e)}},
        )
        
            




