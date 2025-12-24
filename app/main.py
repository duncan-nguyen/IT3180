from app.database import Database
from fastapi import FastAPI, Request, Depends, HTTPException, Response
from app.reqbody import *
import datetime
from typing import List
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
from openpyxl import Workbook
from io import BytesIO
from app.authentication.core.auth_bearer import JWTBearer
from app.authentication.schemas.auth_schema import UserInfor,UserRole

program = FastAPI(prefix = "/api/v1")

db = Database(url = None, key = None)


async def generate_pdf(data):
    buffer = BytesIO()
    c = canvas.Canvas(buffer)

    # Đăng ký font Unicode hỗ trợ tiếng Việt
    pdfmetrics.registerFont(TTFont('Arial', 'C:\\Windows\\Fonts\\arial.ttf'))  # đường dẫn font trên Windows
    c.setFont("Arial", 14)

    c.drawString(50, 800, "Báo cáo kiến nghị theo trạng thái")

    # In tổng số feedback
    c.setFont("Arial", 12)
    c.drawString(50, 780, f"Tổng số feedback: {data.get('Sum', 0)}")

    # In chi tiết từng trạng thái
    y = 760
    for item in data.get("Report", []):
        c.drawString(50, y, f"{item['status']}: {item['count']}")
        y -= 20

    c.save()
    buffer.seek(0)
    return buffer.read()


async def generate_excel(data):
    wb = Workbook()
    ws = wb.active
    ws.title = "BaoCao"

    # Header
    ws.append(["Báo cáo kiến nghị theo trạng thái"])
    ws.append([])  # hàng trống
    ws.append([f"Tổng số feedback: {data.get('Sum', 0)}"])
    ws.append([])  # hàng trống

    # Chi tiết trạng thái
    ws.append(["Trạng thái", "Số lượng"])
    for item in data.get("Report", []):
        ws.append([item["status"], item["count"]])

    # Lưu vào buffer
    buffer = BytesIO()
    wb.save(buffer)
    buffer.seek(0)
    return buffer.read()


async def check_totruong_role(request : Request):
    if "role" in request.headers:
        role = request.headers["role"]
        if role != "ToTruong":
            raise HTTPException(status_code = 403, detail = "Forbidden: To Truong only")
    else:
            raise HTTPException(status_code = 401, detail = "Unauthorized: No role provided")
    
async def check_canbophuong_role(request : Request):
    if "role" in request.headers:
        role = request.headers["role"]
        if role != "CanBoPhuong":
            raise HTTPException(status_code = 403, detail = "Forbidden: Can Bo Phuong only")
    else:
            raise HTTPException(status_code = 401, detail = "Unauthorized: No role provided")
    
async def check_admin_role(request : Request):
    if "role" in request.headers:
        role = request.headers["role"]
        if role != "Admin":
            raise HTTPException(status_code = 403, detail = "Forbidden: Admin only")
    else:
            raise HTTPException(status_code = 401, detail = "Unauthorized: No role provided")
    
def require_single_roles(*roles):
    async def checker(request: Request):
        if "role" not in request.headers:
            raise HTTPException(status_code=401, detail="Unauthorized: No role provided")

        role = request.headers["role"]
        if role not in roles:
            raise HTTPException(status_code=403, detail=f"Permission denied for role: {role}")
    return checker

@program.get("/kiennghi")
async def get_feedback(status: Status |None =None , category: Category | None = None, 
                       start_date: datetime.date |None = None, update_date : datetime.date | None = None, 
                       q : str |None = None, user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value, UserRole.TO_TRUONG.value, UserRole.CAN_BO_PHUONG.value]))):
    feedback = await db.get_kiennghi(
        trang_thai=status.value if status else None,
        phan_loai=category.value if category else None,
        start_date=start_date,
        end_date=update_date,
        q=q
    )
    transformed_data = [{"stt_feedback": str(index), "data": record} for index, record in enumerate(feedback, start=1)]
    return transformed_data

@program.get("/kiennghi/{feedback_id}")
async def get_feedback_by_id(feedback_id : str, user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value, UserRole.TO_TRUONG.value, UserRole.CAN_BO_PHUONG.value]))):
    feedback = await db.get_kiennghi_byid(
        feedback_id= feedback_id
    )
    return feedback

@program.put("/kiennghi/{feedback_id}")
async def update_feedback(feedback : FeedBack, feedback_id : str, user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.TO_TRUONG.value]))):
    data = await db.update_kiennghi(feedback= feedback, feedback_id= feedback_id)
    return data

@program.post("/kiennghi/{feedback_id}/phanhoi")
async def create_fb_response(feedback_id : str, fbresponse : FBResponse, user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[ UserRole.CAN_BO_PHUONG.value]))):
    data = await db.create_phanhoi_kiennghi(fbresponse = fbresponse, feedback_id = feedback_id)
    return data

@program.post("/kiennghi/gop")
async def merge_feedback(merged_fb : MergedFB, user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.TO_TRUONG.value]))):
    data = await db.gop_kien_nghi(merged_fb= merged_fb)
    return data

@program.post("/kiennghi")
async def create_new_fb(posted_fb : Posted_FB):
    return 0

@program.get("/reports/kiennghi-theo-trangthai")
async def get_amount_fb_by_status(quy : QUY, nam : int, format : Format = "json", user_data: UserInfor = Depends(JWTBearer(accepted_role_list=[UserRole.ADMIN.value, UserRole.TO_TRUONG.value, UserRole.CAN_BO_PHUONG.value]))):
    data = await db.get_report(quy = quy, nam = nam)

    if format == "json":
        return data

    if format == "pdf":
        pdf_bytes = await generate_pdf(data)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=report.pdf"}
        )

    if format == "excel":
        excel_bytes = await generate_excel(data)
        return Response(
            content=excel_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=report.xlsx"}
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(program, host="0.0.0.0", port=8000)


    