import os

from dotenv import load_dotenv

# Load file .env
load_dotenv()

# Lấy giá trị secret
SECRET_KEY = os.getenv('SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("SECRET_KEY not found in .env file!")

ACCESS_TOKEN_EXPIRES = int(os.getenv('ACCESS_TOKEN_EXPIRES', '30'))
REFRESH_TOKEN_EXPIRES = int(os.getenv('REFRESH_TOKEN_EXPIRES', '10080'))

ALGORITHM = os.getenv('ALGORITHM', 'HS256')

DATABASE_URL = os.getenv('DATABASE_URL', "postgresql+asyncpg://admin:password123@localhost:5432/citizen_management")
