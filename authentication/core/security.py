from datetime import datetime, timedelta, timezone

import jwt
from database.fake_db import db
from fastapi import HTTPException
from jwt import ExpiredSignatureError, InvalidSignatureError
from schemas.auth_schema import UserInfor, UserRole

from core.config import (
    ACCESS_TOKEN_EXPIRES,
    ALGORITHM,
    REFRESH_TOKEN_EXPIRES,
    SECRET_KEY,
)
from core.utils import verify_pw


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
        "role": user.role,
        "iat": datetime.now(timezone.utc),
        "exp": exp
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)


def get_payload(token: str) -> UserInfor | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401, detail = 'Token expired')
    except InvalidSignatureError:
        raise HTTPException(status_code=401, detail="Invalid token signature")
    except Exception as e:
        raise HTTPException(status_code=401, detail = "Invalid token: " + str(e))
# check blacklist
def get_current_user(access_token: str) -> str:
    payload = get_payload(access_token)
    username = payload.get('username')
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    for u in db:
        if u == username: 
            return UserInfor(**db.get(u))
    raise HTTPException(status_code=401, detail = "User not found")

def recreate_token(refresh_token: str)->str:
    payload = get_payload(refresh_token)
    try:
        role_enum = UserRole(role_str)
    except ValueError:
        raise HTTPException(status_code=401, detail=f"Invalid role: {role_str}")
    user_data = {
        'id': payload.id,
        'username': payload.username,
        'role': role_enum
    }
    return create_token(user=UserInfor(**user_data), token_type='access_token', expires_delta=timedelta(minutes=int(ACCESS_TOKEN_EXPIRES)))