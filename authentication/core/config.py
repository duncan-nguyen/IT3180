import os

from dotenv import load_dotenv

# Load file .env (tự động tìm file .env ở current working directory)
load_dotenv()

# Lấy giá trị secret
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("SECRET_KEY not found in .env file!")

ACCESS_TOKEN_EXPIRES =  int(os.getenv('ACCESS_TOKEN_EXPIRES'))

if not ACCESS_TOKEN_EXPIRES:
    raise ValueError("ACCESS_TOKEN_EXPIRES not found in .env file!")

REFRESH_TOKEN_EXPIRES = int (os.getenv('REFRESH_TOKEN_EXPIRES'))
if not REFRESH_TOKEN_EXPIRES:
    raise ValueError("REFRESH_TOKEN_EXPIRES not found in .env file!")

ALGORITHM = os.getenv('ALGORITHM')
if not ALGORITHM:
    raise ValueError("ALGORITHM not found in .env file!")
