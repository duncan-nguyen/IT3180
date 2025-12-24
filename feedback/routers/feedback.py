from fastapi import APIRouter, Depends
from typing import List
import datetime
from app.schemas.common import Status, Category
from app.schemas.feedback import FeedBack, FBResponse, MergedFB, Posted_FB
from app.authentication.core.auth_bearer import JWTBearer
from app.authentication.schemas.auth_schema import UserInfor, UserRole
from app.core.database import get_db
from app.crud import feedback as crud_feedback
from supabase import AsyncClient

router = APIRouter()

@router.get("/kiennghi")
async def get_feedback(
    status: Status | None = None, 
    category: Category | None = None, 
    start_date: datetime.date | None = None, 
    update_date: datetime.date | None = None, 
    q: str | None = None, 
    db: AsyncClient = Depends(get_db),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value, UserRole.TO_TRUONG.value, UserRole.CAN_BO_PHUONG.value]))
):
    feedback = await crud_feedback.get_feedbacks(
        client=db,
        trang_thai=status,
        phan_loai=category,
        start_date=start_date,
        end_date=update_date,
        q=q
    )
    transformed_data = [{"stt_feedback": str(index), "data": record} for index, record in enumerate(feedback, start=1)]
    return transformed_data

@router.get("/kiennghi/{feedback_id}")
async def get_feedback_by_id(
    feedback_id: str, 
    db: AsyncClient = Depends(get_db),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value, UserRole.TO_TRUONG.value, UserRole.CAN_BO_PHUONG.value]))
):
    feedback = await crud_feedback.get_feedback_by_id(client=db, feedback_id=feedback_id)
    return feedback

@router.put("/kiennghi/{feedback_id}")
async def update_feedback(
    feedback: FeedBack, 
    feedback_id: str, 
    db: AsyncClient = Depends(get_db),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.TO_TRUONG.value]))
):
    data = await crud_feedback.update_feedback(client=db, feedback=feedback, feedback_id=feedback_id)
    return data

@router.post("/kiennghi/{feedback_id}/phanhoi")
async def create_fb_response(
    feedback_id: str, 
    fbresponse: FBResponse, 
    db: AsyncClient = Depends(get_db),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.CAN_BO_PHUONG.value]))
):
    data = await crud_feedback.create_feedback_response(client=db, fbresponse=fbresponse, feedback_id=feedback_id)
    return data

@router.post("/kiennghi/gop")
async def merge_feedback(
    merged_fb: MergedFB, 
    db: AsyncClient = Depends(get_db),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.TO_TRUONG.value]))
):
    data = await crud_feedback.merge_feedbacks(client=db, merged_fb=merged_fb)
    return data

@router.post("/kiennghi")
async def create_new_fb(posted_fb: Posted_FB):
    return 0
