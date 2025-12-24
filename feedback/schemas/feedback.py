from pydantic import BaseModel
from typing import List
from .common import Status, Category

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
