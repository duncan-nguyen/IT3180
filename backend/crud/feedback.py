import datetime
from datetime import timezone

from models.feedback import Feedback, FeedbackResponse
from schemas.common import Category, Status
from schemas.feedback import FBResponse, FeedBack, MergedFB
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload


async def get_feedbacks(
    client: AsyncSession,
    trang_thai: Status | None = None,
    phan_loai: Category | None = None,
    start_date: datetime.date | None = None,
    end_date: datetime.date | None = None,
    q: str | None = None,
    user_id: str | None = None,
):
    query = select(Feedback)

    if trang_thai:
        query = query.filter(
            Feedback.status == trang_thai.value
            if hasattr(trang_thai, "value")
            else trang_thai
        )
    if phan_loai:
        query = query.filter(
            Feedback.category == phan_loai.value
            if hasattr(phan_loai, "value")
            else phan_loai
        )
    if start_date:
        query = query.filter(Feedback.created_at >= start_date)
    if end_date:
        next_day = end_date + datetime.timedelta(days=1)
        query = query.filter(Feedback.updated_at <= next_day)
    if q:
        query = query.filter(Feedback.content.ilike(f"%{q}%"))
    if user_id:
        query = query.filter(Feedback.created_by_user_id == user_id)

    result = await client.execute(query)
    feedbacks = result.scalars().all()
    return [f.as_dict() for f in feedbacks]


async def get_feedback_by_id(client: AsyncSession, feedback_id: str):
    query = (
        select(Feedback)
        .options(selectinload(Feedback.responses))
        .filter(Feedback.id == feedback_id)
    )
    result = await client.execute(query)
    feedback = result.scalar_one_or_none()

    if not feedback:
        return None

    data = feedback.as_dict()
    data["feedback_responses"] = [r.as_dict() for r in feedback.responses]
    data["feedback_reporters"] = []
    return data


async def update_feedback(client: AsyncSession, feedback: FeedBack, feedback_id: str):
    status_value = (
        feedback.trang_thai.value
        if hasattr(feedback.trang_thai, "value")
        else feedback.trang_thai
    )

    stmt = (
        update(Feedback).where(Feedback.id == feedback_id).values(status=status_value)
    )
    await client.execute(stmt)
    await client.commit()

    return await get_feedback_by_id(client, feedback_id)


async def create_feedback_response(
    client: AsyncSession, fbresponse: FBResponse, feedback_id: str
):
    query = select(Feedback).filter(Feedback.id == feedback_id)
    result = await client.execute(query)
    feedback_obj = result.scalar_one_or_none()

    if not feedback_obj:
        return None

    created_by_user_id = feedback_obj.created_by_user_id

    response = FeedbackResponse(
        content=fbresponse.noi_dung,
        agency=fbresponse.co_quan,
        attachment_url=fbresponse.tep_dinh_kem_url,
        feedback_id=feedback_id,
        responded_at=datetime.datetime.now(timezone.utc),
        created_by_user_id=created_by_user_id,
    )
    client.add(response)
    await client.commit()
    await client.refresh(response)
    return response.as_dict()


async def create_new_feedback(client: AsyncSession, posted_fb, user_id: str):
    category_value = (
        posted_fb.phan_loai.value
        if hasattr(posted_fb.phan_loai, "value")
        else posted_fb.phan_loai
    )

    created_by_user_id = user_id
    scope_id = None

    if posted_fb.nguoi_phan_anh.nhankhau_id:
        scope_id = posted_fb.nguoi_phan_anh.nhankhau_id

    new_feedback = Feedback(
        status=Status.moi_ghi_nhan.value,
        category=category_value,
        content=posted_fb.noi_dung,
        scope_id=scope_id,
        created_by_user_id=created_by_user_id,
        report_count=1,
        created_at=datetime.datetime.now(timezone.utc),
        updated_at=datetime.datetime.now(timezone.utc),
    )

    client.add(new_feedback)
    await client.commit()
    await client.refresh(new_feedback)

    return new_feedback.as_dict()


async def merge_feedbacks(client: AsyncSession, merged_fb: MergedFB):
    sub_fb_id = merged_fb.sub_id[0]
    q = select(Feedback).filter(Feedback.id == sub_fb_id)
    res = await client.execute(q)
    sub_fb = res.scalar_one()

    q_sum = select(func.sum(Feedback.report_count)).filter(
        Feedback.id.in_(merged_fb.sub_id)
    )
    sum_res = await client.execute(q_sum)
    count = sum_res.scalar() or 0

    parent_id = merged_fb.parent_id

    if parent_id is None:
        new_parent = Feedback(
            category=sub_fb.category,
            scope_id=sub_fb.scope_id,
            status=sub_fb.status,
            content=sub_fb.content,
            report_count=count,
            created_by_user_id=sub_fb.created_by_user_id,
            created_at=datetime.datetime.now(timezone.utc),
            updated_at=datetime.datetime.now(timezone.utc),
        )
        client.add(new_parent)
        await client.flush()
        parent_id = new_parent.id

    stmt = (
        update(Feedback)
        .where(Feedback.id.in_(merged_fb.sub_id))
        .values(parent_id=parent_id)
    )
    await client.execute(stmt)
    await client.commit()

    return await get_feedback_by_id(client, str(parent_id))
