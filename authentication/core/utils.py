# tách file ra khỏi security.py để fake_db có thể dùng dc và k bị vòng lặp import
from passlib.context import CryptContext


password_context = CryptContext(schemes=["argon2"], deprecated = "auto") #schemeS => list => [], deprecated = auto để nếu scheme cũ => chọn cái khác
def hash_pw(password)->str:
    return password_context.hash(password)

def verify_pw(plain_password, hashed_password) -> bool: # vì băm phải có salt, nên cần dùng verify để lấy salt rồi băm plain_pw => compare
    return password_context.verify(plain_password, hashed_password)