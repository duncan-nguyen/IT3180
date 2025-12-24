from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from io import BytesIO
from openpyxl import Workbook
import os

async def generate_pdf(data):
    buffer = BytesIO()
    c = canvas.Canvas(buffer)

    # Đăng ký font Unicode hỗ trợ tiếng Việt
    # Note: This path is Windows-specific. On Linux/WSL, it might need adjustment.
    try:
        font_path = 'C:\\Windows\\Fonts\\arial.ttf'
        if not os.path.exists(font_path) and os.path.exists("/mnt/c/Windows/Fonts/arial.ttf"):
             font_path = "/mnt/c/Windows/Fonts/arial.ttf"
        
        pdfmetrics.registerFont(TTFont('Arial', font_path))
        c.setFont("Arial", 14)
    except:
        # Fallback if font not found
        c.setFont("Helvetica", 14)

    c.drawString(50, 800, "Báo cáo kiến nghị theo trạng thái")

    # In tổng số feedback
    c.setFont("Helvetica", 12) if 'Arial' not in pdfmetrics.getRegisteredFontNames() else c.setFont("Arial", 12)
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
