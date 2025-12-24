from fastapi import APIRouter, Depends, Response
from app.schemas.common import QUY, Format
from app.authentication.core.auth_bearer import JWTBearer
from app.authentication.schemas.auth_schema import UserInfor, UserRole
from app.core.database import get_db
from app.crud import report as crud_report
from app.services import report_generator
from supabase import AsyncClient

router = APIRouter()

@router.get("/reports/kiennghi-theo-trangthai")
async def get_amount_fb_by_status(
    quy: QUY, 
    nam: int, 
    format: Format = Format.json, 
    db: AsyncClient = Depends(get_db),
    user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value, UserRole.TO_TRUONG.value, UserRole.CAN_BO_PHUONG.value]))
):
    data = await crud_report.get_report_by_quarter(client=db, quy=quy, nam=nam)

    if format == Format.json:
        return data

    if format == Format.pdf:
        pdf_bytes = await report_generator.generate_pdf(data)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=report.pdf"}
        )

    if format == Format.excel:
        excel_bytes = await report_generator.generate_excel(data)
        return Response(
            content=excel_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=report.xlsx"}
        )
