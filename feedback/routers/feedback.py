import datetime
import logging

from core.database import get_db
from core.remote_auth import RemoteBearer
from crud import feedback as crud_feedback
from fastapi import APIRouter, Depends
from schemas.auth import UserInfor, UserRole
from schemas.common import Category, Status
from schemas.feedback import FBResponse, FeedBack, MergedFB, Posted_FB
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/feedback")
async def get_feedback_list(
    status: Status | None = None,
    category: Category | None = None,
    start_date: datetime.date | None = None,
    update_date: datetime.date | None = None,
    q: str | None = None,
    db: AsyncSession = Depends(get_db),
    user_data: UserInfor = Depends(
        RemoteBearer(
            accepted_role_list=[
                UserRole.ADMIN,
                UserRole.TO_TRUONG,
                UserRole.CAN_BO_PHUONG,
                UserRole.NGUOI_DAN,
            ]
        )
    ),
):
    logger.info(
        f"GET /feedback - User: {user_data.username} (ID: {user_data.id}), Role: {user_data.role.value}, Filters: status={status}, category={category}, q={q}"
    )

    # Filter by user_id if user is a Citizen
    filter_user_id = None
    if user_data.role == UserRole.NGUOI_DAN:
        filter_user_id = str(user_data.id)

    feedback = await crud_feedback.get_feedbacks(
        client=db,
        trang_thai=status,
        phan_loai=category,
        start_date=start_date,
        end_date=update_date,
        q=q,
        user_id=filter_user_id,
    )
    transformed_data = [
        {"stt_feedback": str(index), "data": record}
        for index, record in enumerate(feedback, start=1)
    ]
    logger.info(f"GET /feedback - Retrieved {len(transformed_data)} feedbacks")
    return transformed_data


@router.get("/feedback/{feedback_id}")
async def get_feedback_by_id(
    feedback_id: str,
    db: AsyncSession = Depends(get_db),
    user_data: UserInfor = Depends(
        RemoteBearer(
            accepted_role_list=[
                UserRole.ADMIN,
                UserRole.TO_TRUONG,
                UserRole.CAN_BO_PHUONG,
            ]
        )
    ),
):
    logger.info(
        f"GET /feedback/{feedback_id} - User: {user_data.username} (ID: {user_data.id}), Role: {user_data.role.value}"
    )
    feedback = await crud_feedback.get_feedback_by_id(
        client=db, feedback_id=feedback_id
    )
    logger.info(
        f"GET /feedback/{feedback_id} - Retrieved feedback: {feedback is not None}"
    )
    return feedback


@router.put("/feedback/{feedback_id}")
async def update_feedback(
    feedback: FeedBack,
    feedback_id: str,
    db: AsyncSession = Depends(get_db),
    user_data: UserInfor = Depends(
        RemoteBearer(accepted_role_list=[UserRole.TO_TRUONG])
    ),
):
    logger.info(
        f"PUT /feedback/{feedback_id} - User: {user_data.username} (ID: {user_data.id}), Role: {user_data.role.value}, New status: {feedback.trang_thai.value}"
    )
    data = await crud_feedback.update_feedback(
        client=db, feedback=feedback, feedback_id=feedback_id
    )
    logger.info(f"PUT /feedback/{feedback_id} - Feedback updated successfully")
    return data


@router.post("/feedback/{feedback_id}/response")
async def create_fb_response(
    feedback_id: str,
    fbresponse: FBResponse,
    db: AsyncSession = Depends(get_db),
    user_data: UserInfor = Depends(
        RemoteBearer(accepted_role_list=[UserRole.CAN_BO_PHUONG])
    ),
):
    logger.info(
        f"POST /feedback/{feedback_id}/response - User: {user_data.username} (ID: {user_data.id}), Role: {user_data.role.value}, Agency: {fbresponse.co_quan}"
    )
    data = await crud_feedback.create_feedback_response(
        client=db, fbresponse=fbresponse, feedback_id=feedback_id
    )
    logger.info(
        f"POST /feedback/{feedback_id}/response - Response created successfully"
    )
    return data


@router.post("/feedback/merge")
async def merge_feedback(
    merged_fb: MergedFB,
    db: AsyncSession = Depends(get_db),
    user_data: UserInfor = Depends(
        RemoteBearer(accepted_role_list=[UserRole.TO_TRUONG])
    ),
):
    logger.info(
        f"POST /feedback/merge - User: {user_data.username} (ID: {user_data.id}), Role: {user_data.role.value}, Parent ID: {merged_fb.parent_id}, Sub IDs: {merged_fb.sub_id}"
    )
    data = await crud_feedback.merge_feedbacks(client=db, merged_fb=merged_fb)
    logger.info("POST /feedback/merge - Feedbacks merged successfully")
    return data


@router.post("/feedback")
async def create_new_fb(
    posted_fb: Posted_FB,
    db: AsyncSession = Depends(get_db),
    user_data: UserInfor = Depends(
        RemoteBearer(
            accepted_role_list=[
                UserRole.NGUOI_DAN,
                UserRole.ADMIN,
                UserRole.TO_TRUONG,
                UserRole.CAN_BO_PHUONG,
            ]
        )
    ),
):
    logger.info(
        f"POST /feedback - User: {user_data.username} (ID: {user_data.id}), Role: {user_data.role.value}, Category: {posted_fb.phan_loai.value}, Resident ID: {posted_fb.nguoi_phan_anh.nhankhau_id}"
    )
    data = await crud_feedback.create_new_feedback(
        client=db, posted_fb=posted_fb, user_id=str(user_data.user_id)
    )
    logger.info(f"POST /feedback - New feedback created with ID: {data.get('id')}")
    return data
