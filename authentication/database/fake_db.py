from schemas.auth_schema import UserRole
from core.utils import hash_pw

db = {
    "NKLHAHA": {'id': 1, "username": "NKLHAHA", "password": hash_pw("Moitao"), "role": UserRole.ADMIN}, 
    "LNGHAHA": {'id': 2, "username": "LNGHAHA", "password": hash_pw("Moitao"), "role": UserRole.CAN_BO_PHUONG}
}