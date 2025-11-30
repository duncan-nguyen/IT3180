from database.supabase_client import supabase_client
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from core.utils import verify_pw
import jwt
from schemas.auth_schema import UserInfor
from core.config import (
    ACCESS_TOKEN_EXPIRES,   
    REFRESH_TOKEN_EXPIRES,
    ALGORITHM,
    SECRET_KEY
)
def authenticate_user(username: str, password: str) -> str | None:
    db = supabase_client.table('users').select('*').execute().data
    for u in db:
        if u['username'] == username:
            if verify_pw(password, u['password_hash']):
                return str(u['id'])
            else: return None
    return None

def create_token(user_id: str, token_type: str, expires_delta) -> str:
    exp = datetime.now(timezone.utc)
    if(token_type == 'access_token'):
        exp = exp + (expires_delta or ACCESS_TOKEN_EXPIRES)
    elif(token_type == 'refresh_token'):
        exp = exp + (expires_delta or REFRESH_TOKEN_EXPIRES)
    # tạo token
    to_encode = {
        "id": user_id,
        "iat": datetime.now(timezone.utc),
        "exp": exp
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)

def get_payload(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail = 'Token expired')
    except jwt.InvalidSignatureError:
        raise HTTPException(status_code=401, detail="Invalid token signature")
    except Exception as e:
        raise HTTPException(status_code=401, detail = "Invalid token: " + str(e))

async def get_current_user(access_token: str) :
    payload = get_payload(access_token)
    user_id = payload.get('id')
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
    data = supabase_client.table('users').select('*').execute()
    db = data.data
    for u in db:
        if str(u['id']) == str(user_id):
            return UserInfor(
                id = u['id'],
                username = u['username'],
                role = u['role'],
                active = bool(u['active']), #tại răng phải bool đây mới chạy dc
                scope_id = u['scope_id'] # tại răng nỏ cần str()
            )
    raise HTTPException(status_code=401, detail="User not found")
    
    
def recreate_token(refresh_token: str) -> str:
    payload = get_payload(refresh_token)
    user_id = payload.get('id')
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token: missing user ID")
    new_access_token = create_token(user_id, 'access_token', timedelta(minutes=ACCESS_TOKEN_EXPIRES))
    return new_access_token