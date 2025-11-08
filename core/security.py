from datetime import timedelta, datetime, timezone
from schemas.auth_schema import UserInfor
from database.fake_db import db
from core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES
import jwt
from core.utils import verify_pw
from schemas.auth_schema import TokenRes
from jwt import ExpiredSignatureError,  InvalidSignatureError, exceptions
from fastapi import HTTPException


def authenticate_user(username, password) -> UserInfor|None: 
    for u in db:
        if u == username: 
            #u['role'] là enum => k thể chuyển sang json dc để bỏ vào jwt.encode() 
            # scope, {'id' : u['id'], 'username': u['username'], "role": u['role']}
            if verify_pw(password, db[u]['password']): return UserInfor(**(db.get(u)))  
            else: return None
    return None
    
def create_token(user: UserInfor, token_type: str, expires_delta: timedelta | None = None):
    exp =  datetime.now(timezone.utc)
    if token_type == 'access_token': exp = exp + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRES))
    else: exp = exp + (expires_delta or timedelta(days=REFRESH_TOKEN_EXPIRES))
    to_encode = { 
        #scope
        "id": user.id,
        "username": user.username,
        "role": user.role.value,
        "iat": datetime.now(timezone.utc),
        "exp": exp
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm = [ALGORITHM])


def get_payload(token: str) -> UserInfor | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithm = [ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail = 'Token expired')
    except InvalidSignatureError:
        raise HTTPException(status_code=401, detail="Invalid token signature")
    except exceptions as e:
        raise HTTPException(status_code=401, detail = "Invalid token")
# check blacklist
def get_current_user(access_token: str) -> str:
    payload = get_payload(access_token)
    username = payload['username']
    for u in db:
        if u == username: return UserInfor(**db.get(u))
    raise HTTPException(status_code=401, detail = "Invalid token")

def recreate_token(refresh_token: str)->str:
    payload = get_payload(refresh_token)
    return create_token(UserInfor(**payload), 'access_token', timedelta(minutes=ACCESS_TOKEN_EXPIRES))