# Password hashing utilities
from passlib.context import CryptContext

password_context = CryptContext(
    schemes=["bcrypt", "argon2"], deprecated="auto"
)


def hash_pw(password) -> str:
    return password_context.hash(password)


def verify_pw(plain_password, hashed_password) -> bool:
    return password_context.verify(plain_password, hashed_password)
