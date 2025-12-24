import logging

from core.database import get_db
from core.remote_auth import RemoteBearer
from crud import report as crud_report
from fastapi import APIRouter, Depends, Response
from schemas.auth import UserInfor, UserRole
from schemas.common import QUY, Format
from services import report_generator
from sqlalchemy.ext.asyncio import AsyncSession

logger = logging.getLogger(__name__)
router = APIRouter()


@router.get("/reports/kiennghi-theo-trangthai")
async def get_amount_fb_by_status(
    quy: QUY,
    nam: int,
    format: Format = Format.json,
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
        f"GET /reports/kiennghi-theo-trangthai - User: {user_data.username} (ID: {user_data.id}), Role: {user_data.role.value}, Quarter: {quy.value}, Year: {nam}, Format: {format.value}"
    )
    data = await crud_report.get_report_by_quarter(client=db, quy=quy, nam=nam)

    if format == Format.json:
        logger.info("GET /reports/kiennghi-theo-trangthai - Returning JSON format")
        return data

    if format == Format.pdf:
        logger.info("GET /reports/kiennghi-theo-trangthai - Generating PDF format")
        pdf_bytes = await report_generator.generate_pdf(data)
        logger.info("GET /reports/kiennghi-theo-trangthai - PDF generated successfully")
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=report.pdf"},
        )

    if format == Format.excel:
        logger.info("GET /reports/kiennghi-theo-trangthai - Generating Excel format")
        excel_bytes = await report_generator.generate_excel(data)
        logger.info(
            "GET /reports/kiennghi-theo-trangthai - Excel generated successfully"
        )
        return Response(
            content=excel_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=report.xlsx"},
        )


@router.get("/reports")
async def get_reports(
    quy: QUY | None = None,
    nam: int | None = None,
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
        f"GET /reports - User: {user_data.username} (ID: {user_data.id}), Role: {user_data.role.value}, Quarter: {quy}, Year: {nam}"
    )
    if quy and nam:
        data = await crud_report.get_report_by_quarter(client=db, quy=quy, nam=nam)
        logger.info(f"GET /reports - Retrieved report data for Q{quy.value}/{nam}")
    else:
        # Default to current quarter or something, but for simplicity, return empty or all
        data = []
        logger.info("GET /reports - No quarter/year specified, returning empty data")
    return {"data": data}
