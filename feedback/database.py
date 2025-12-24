import os
from typing import List
from dotenv import load_dotenv
from supabase import AsyncClient, create_async_client
import datetime
from datetime import  timezone
from app.reqbody import *
_ = load_dotenv()


SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")

class Database:
    def __init__(self, url: str | None, key: str | None) -> None:
        self.url: str = url if url is not None else SUPABASE_URL
        self.key: str = key if key is not None else SUPABASE_KEY
        self.client: AsyncClient | None = None

    async def init_client(self):
        self.client = await create_async_client(self.url, self.key)
    
    async def get_kiennghi(
        self,
        trang_thai: Status | None = None,
        phan_loai: Category | None = None,
        start_date: datetime.date | None = None,
        end_date: datetime.date | None = None,
        q: str | None = None
    ):
        if self.client is None:
            await self.init_client()
        query = self.client.table("feedbacks").select("*")
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
    
    async def get_kiennghi_byid(self, feedback_id:str):
        if self.client is None:
            await self.init_client()
        query = self.client.table("feedbacks").select("*, feedback_reporters(*), feedback_responses(*)")
        query = query.eq("id", feedback_id).maybe_single()
        response = await query.execute()
        return response.data
    
    async def update_kiennghi(self, feedback : FeedBack, feedback_id : str):
        if self.client is None:
            await self.init_client()
        status_value = feedback.trang_thai.value
        data_to_update = {"status": status_value}
         # Cập nhật
        await self.client.table("feedbacks") \
                         .update(data_to_update) \
                         .eq("id", feedback_id) \
                         .execute()
        
        response = await self.client.table("feedbacks") \
                                    .select("*") \
                                    .eq("id", feedback_id) \
                                    .maybe_single() \
                                    .execute()
        return response.data
    
    async def create_phanhoi_kiennghi(self, fbresponse : FBResponse, feedback_id : str):
        if self.client is None:
            await self.init_client()
        feedback_query = await self.client.table("feedbacks") \
                                    .select("created_by_user_id") \
                                    .eq("id", feedback_id) \
                                    .maybe_single() \
                                    .execute()

        created_by_user_id_q = feedback_query.data.get("created_by_user_id")
        noi_dung_value = fbresponse.noi_dung
        co_quan_value = fbresponse.co_quan
        tep_dinh_kem_url_value = fbresponse.tep_dinh_kem_url
        await self.client.table("feedback_responses")\
                         .insert({"content" : noi_dung_value, 
                                  "agency" : co_quan_value, 
                                  "attachment_url": tep_dinh_kem_url_value, 
                                  "feedback_id" : feedback_id, 
                                  "responded_at": datetime.datetime.now(timezone.utc).isoformat(),
                                  "created_by_user_id" :created_by_user_id_q})\
                         .execute()
        response = await self.client.table("feedback_responses")\
                            .select("*") \
                            .eq("feedback_id", feedback_id) \
                            .eq("content", noi_dung_value)\
                            .maybe_single()\
                            .execute()
        return response.data
    
    async def gop_kien_nghi(self, merged_fb: MergedFB):
        if self.client is None:
            await self.init_client()

        sub_fb_id = merged_fb.sub_id[0]
        sub_fb_table = await self.client.table("feedbacks") \
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
            fb_row = await self.client.table("feedbacks") \
                                      .select("report_count") \
                                      .eq("id", i) \
                                      .maybe_single() \
                                      .execute()
            count += fb_row.data.get("report_count", 0)

        if merged_fb.parent_id is None:
            new_parent_fb = await self.client.table("feedbacks").insert({
                "category": sub_fb_category,
                "scope_id": sub_fb_scope,
                "status": sub_fb_status,
                "content": sub_fb_content,
                "report_count": count,
                "created_by_user_id": sub_fb_cbui,
                "created_at": datetime.datetime.now(timezone.utc).isoformat(),
                "updated_at": datetime.datetime.now(timezone.utc).isoformat()
                # "reported_at": datetime.datetime.now(timezone.utc).isoformat()
            }).execute()

            parent_id = new_parent_fb.data[0]["id"]
        else:
            
            parent_id = merged_fb.parent_id

        for sub_id in merged_fb.sub_id:
            await self.client.table("feedbacks") \
                .update({"parent_id": parent_id}) \
                .eq("id", sub_id) \
                .execute()
        if merged_fb.parent_id is None:
            return new_parent_fb.data[0]
        else:
            parent_fb = await self.client.table("feedbacks") \
                                        .select("*") \
                                        .eq("id", parent_id) \
                                        .maybe_single() \
                                        .execute()
            return parent_fb.data
    
    async def get_report(self, quy : QUY, nam : int):
        if self.client is None:
            await self.init_client()
        month_start = (quy.value - 1) * 3 + 1
        month_end = month_start + 2

        query = self.client.table("feedbacks").select("status")
        query = query.gte("created_at", f"{nam}-{month_start:02d}-01")
        query = query.lte("created_at", f"{nam}-{month_end:02d}-31")
        
        feedbacks = await query.execute()
        records = feedbacks.data
        await self.client.table("feedbacks").update({"reported_at" : datetime.datetime.now(timezone.utc).isoformat() })\
                                            .gte("created_at", f"{nam}-{month_start:02d}-01")\
                                            .lte("created_at", f"{nam}-{month_end:02d}-31")\
                                            .execute()

        from collections import defaultdict
        thong_ke = defaultdict(int)
        for record in records:
            thong_ke[record["status"]] += 1

        tong = sum(thong_ke.values())
        return {
        "Sum": tong,
        "Report": [{"status": a, "count": b} for a, b in thong_ke.items()]
        }
        
    # async def tao_fb_moi(self, posted_fb : Posted_FB):
    #     if self.client is None:
    #         await self.init_client()
    #     new_fb_content = posted_fb.noi_dung
    #     new_fb_category = posted_fb.phan_loai
    #     new_fb_nhankhau_id = posted_fb.nguoi_phan_anh.nhankhau_id
    #     new_fb_ho_ten_tu_do = posted_fb.nguoi_phan_anh.ho_ten_tu_do
    #     if new_fb_nhankhau_id is not None:
