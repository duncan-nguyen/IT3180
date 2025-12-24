from supabase import AsyncClient
import datetime
from datetime import timezone
from collections import defaultdict
from app.schemas.common import QUY

async def get_report_by_quarter(client: AsyncClient, quy: QUY, nam: int):
    month_start = (quy.value - 1) * 3 + 1
    month_end = month_start + 2

    query = client.table("feedbacks").select("status")
    query = query.gte("created_at", f"{nam}-{month_start:02d}-01")
    query = query.lte("created_at", f"{nam}-{month_end:02d}-31")
    
    feedbacks = await query.execute()
    records = feedbacks.data
    
    await client.table("feedbacks").update({"reported_at" : datetime.datetime.now(timezone.utc).isoformat() })\
        .gte("created_at", f"{nam}-{month_start:02d}-01")\
        .lte("created_at", f"{nam}-{month_end:02d}-31")\
        .execute()

    thong_ke = defaultdict(int)
    for record in records:
        thong_ke[record["status"]] += 1

    tong = sum(thong_ke.values())
    return {
        "Sum": tong,
        "Report": [{"status": a, "count": b} for a, b in thong_ke.items()]
    }
