import datetime
from collections import defaultdict
from datetime import timezone

from models.feedback import Feedback
from schemas.common import QUY
from sqlalchemy import select, update, and_
from sqlalchemy.ext.asyncio import AsyncSession


async def get_report_by_quarter(client: AsyncSession, quy: QUY, nam: int):
    month_start = (quy.value - 1) * 3 + 1
    # End month of quarter
    month_end = month_start + 2

    # Robust date calculation
    start_dt = datetime.datetime(nam, month_start, 1)
    if month_end == 12:
        end_dt = datetime.datetime(nam + 1, 1, 1)
    else:
        end_dt = datetime.datetime(nam, month_end + 1, 1)

    # Query 1: Get data
    stmt = select(Feedback.status).where(
        and_(
            Feedback.created_at >= start_dt,
            Feedback.created_at < end_dt
        )
    )
    result = await client.execute(stmt)
    statuses = result.scalars().all()

    # Query 2: Update reported_at
    update_stmt = (
        update(Feedback)
        .where(
            and_(
                Feedback.created_at >= start_dt,
                Feedback.created_at < end_dt
            )
        )
        .values(reported_at=datetime.datetime.now(timezone.utc))
    )
    await client.execute(update_stmt)
    await client.commit()

    thong_ke = defaultdict(int)
    for status in statuses:
        thong_ke[status] += 1

    tong = sum(thong_ke.values())
    return {
        "Sum": tong,
        "Report": [{"status": a, "count": b} for a, b in thong_ke.items()],
    }
