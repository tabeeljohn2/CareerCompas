from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
import jwt as pyjwt

from database import Base, engine, get_db
from models import User
from security import hash_password, verify_password, create_token, decode_token

Base.metadata.create_all(bind=engine)  # creates tables on first run

app = FastAPI(title="careercompas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

bearer = HTTPBearer()


class Credentials(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_token(creds.credentials)
    except pyjwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = db.get(User, int(payload["sub"]))
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/auth/register", status_code=201)
def register(body: Credentials, db: Session = Depends(get_db)):
    email = body.email.lower()
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(status_code=409, detail="Email already registered")
    user = User(email=email, password_hash=hash_password(body.password))
    db.add(user)
    db.commit()
    db.refresh(user)
    return {"access_token": create_token(user.id), "token_type": "bearer"}


@app.post("/api/auth/login")
def login(body: Credentials, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email.lower()).first()
    if user is None or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"access_token": create_token(user.id), "token_type": "bearer"}


@app.get("/api/auth/me")
def me(user: User = Depends(get_current_user)):
    return {"id": user.id, "email": user.email}