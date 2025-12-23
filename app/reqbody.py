from pydantic import BaseModel
from enum import Enum
from typing import List

class QUY(int, Enum):
    mot = 1
    hai = 2
    ba = 3
    bon = 4
class Format(str, Enum):
    json = "json"
    pdf = "pdf"
    excel = "excel"
class Status(str, Enum):
    moi_ghi_nhan = "MOI_GHI_NHAN"
    dang_xu_ly = "DANG_XU_LY"
    da_giai_quyet ="DA_GIAI_QUYET"
    dong = "DONG"

class Category(str, Enum):
    ha_tang = "HA_TANG"
    an_ninh = "AN_NINH"
    moi_truong = "MOI_TRUONG"
    khac = "KHAC"

class Format(str,Enum):
    json = "json"
    pdf = "pdf"
    excel = "excel"

class FeedBack(BaseModel):
    trang_thai: Status

class FBResponse(BaseModel):
    noi_dung : str
    co_quan : str
    tep_dinh_kem_url: str

class MergedFB(BaseModel):
    parent_id : str | None = None
    sub_id : List[str]

class NguoiPhanAnh(BaseModel):
    nhankhau_id : str | None = None
    ho_ten_tu_do : str | None = None

class Posted_FB(BaseModel):
    noi_dung : str
    phan_loai : Category
    nguoi_phan_anh : NguoiPhanAnh
