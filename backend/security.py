import os
from datetime import datetime, timedelta, timezone

import bcrypt
import jwt as pyjwt
from dotenv import load_dotenv

load_dotenv()

JWT_SECRET = os.environ["JWT_SECRET"]  # set in .env, never hard-coded
ALGORITHM = "HS256"
TOKEN_HOURS = 1


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode(), password_hash.encode())


def create_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(hours=TOKEN_HOURS),
    }
    return pyjwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)


def decode_token(token: str) -> dict:
    return pyjwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])