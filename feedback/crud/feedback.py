from supabase import AsyncClient
import datetime
from datetime import timezone
from app.schemas.common import Status, Category
from app.schemas.feedback import FeedBack, FBResponse, MergedFB

async def get_feedbacks(
    client: AsyncClient,
    trang_thai: Status | None = None,
    phan_loai: Category | None = None,
    start_date: datetime.date | None = None,
    end_date: datetime.date | None = None,
    q: str | None = None
):
    query = client.table("feedbacks").select("*")
    if trang_thai:
        query = query.eq("status", trang_thai)
    if phan_loai:
        query = query.eq("category", phan_loai)
    if start_date:
        query = query.gte("created_at", start_date.isoformat())
    if end_date:
        next_day = end_date + datetime.timedelta(days=1)
        query = query.lte("updated_at", next_day.isoformat())
    if q:
        query = query.ilike("content", f"%{q}%")
    response = await query.execute()
    return response.data

async def get_feedback_by_id(client: AsyncClient, feedback_id: str):
    query = client.table("feedbacks").select("*, feedback_reporters(*), feedback_responses(*)")
    query = query.eq("id", feedback_id).maybe_single()
    response = await query.execute()
    return response.data

async def update_feedback(client: AsyncClient, feedback: FeedBack, feedback_id: str):
    status_value = feedback.trang_thai.value
    data_to_update = {"status": status_value}
    
    await client.table("feedbacks") \
        .update(data_to_update) \
        .eq("id", feedback_id) \
        .execute()
    
    response = await client.table("feedbacks") \
        .select("*") \
        .eq("id", feedback_id) \
        .maybe_single() \
        .execute()
    return response.data

async def create_feedback_response(client: AsyncClient, fbresponse: FBResponse, feedback_id: str):
    feedback_query = await client.table("feedbacks") \
        .select("created_by_user_id") \
        .eq("id", feedback_id) \
        .maybe_single() \
        .execute()

    created_by_user_id_q = feedback_query.data.get("created_by_user_id")
    noi_dung_value = fbresponse.noi_dung
    co_quan_value = fbresponse.co_quan
    tep_dinh_kem_url_value = fbresponse.tep_dinh_kem_url
    
    await client.table("feedback_responses")\
        .insert({
            "content" : noi_dung_value, 
            "agency" : co_quan_value, 
            "attachment_url": tep_dinh_kem_url_value, 
            "feedback_id" : feedback_id, 
            "responded_at": datetime.datetime.now(timezone.utc).isoformat(),
            "created_by_user_id" : created_by_user_id_q
        }).execute()
        
    response = await client.table("feedback_responses")\
        .select("*") \
        .eq("feedback_id", feedback_id) \
        .eq("content", noi_dung_value)\
        .maybe_single()\
        .execute()
    return response.data

async def merge_feedbacks(client: AsyncClient, merged_fb: MergedFB):
    sub_fb_id = merged_fb.sub_id[0]
    sub_fb_table = await client.table("feedbacks") \
        .select("category, scope_id, status, content, created_by_user_id") \
        .eq("id", sub_fb_id) \
        .maybe_single() \
        .execute()

    sub_fb_category = sub_fb_table.data.get("category")
    sub_fb_scope = sub_fb_table.data.get("scope_id")
    sub_fb_status = sub_fb_table.data.get("status")
    sub_fb_content = sub_fb_table.data.get("content")
    sub_fb_cbui = sub_fb_table.data.get("created_by_user_id")

    count = 0
    for i in merged_fb.sub_id:
        fb_row = await client.table("feedbacks") \
            .select("report_count") \
            .eq("id", i) \
            .maybe_single() \
            .execute()
        count += fb_row.data.get("report_count", 0)

    if merged_fb.parent_id is None:
        new_parent_fb = await client.table("feedbacks").insert({
            "category": sub_fb_category,
            "scope_id": sub_fb_scope,
            "status": sub_fb_status,
            "content": sub_fb_content,
            "report_count": count,
            "created_by_user_id": sub_fb_cbui,
            "created_at": datetime.datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.datetime.now(timezone.utc).isoformat()
        }).execute()

        parent_id = new_parent_fb.data[0]["id"]
    else:
        parent_id = merged_fb.parent_id

    for sub_id in merged_fb.sub_id:
        await client.table("feedbacks") \
            .update({"parent_id": parent_id}) \
            .eq("id", sub_id) \
            .execute()
            
    if merged_fb.parent_id is None:
        return new_parent_fb.data[0]
    else:
        parent_fb = await client.table("feedbacks") \
            .select("*") \
            .eq("id", parent_id) \
            .maybe_single() \
            .execute()
        return parent_fb.data
