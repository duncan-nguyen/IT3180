from enum import Enum

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
