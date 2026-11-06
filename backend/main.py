from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import json
from datetime import datetime, timezone
from pydantic import BaseModel, EmailStr, Field, field_validator
from sqlalchemy.orm import Session
import jwt as pyjwt

from database import Base, engine, get_db
from models import User, UserProfile, Recommendation, ProgressItem
from recommender import recommend_careers, build_roadmap
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

class ProfileIn(BaseModel):
    education_level: str = Field(min_length=1, max_length=100)
    skills: list[str] = Field(min_length=1, max_length=30)
    interests: list[str] = Field(min_length=1, max_length=15)
    goals: str = Field(default="", max_length=500)

    @field_validator("skills", "interests")
    @classmethod
    def short_items(cls, items: list[str]) -> list[str]:
        if any(len(i) > 50 for i in items):
            raise ValueError("Each item must be 50 characters or fewer")
        return items


class ProgressUpdate(BaseModel):
    is_done: bool


def roadmap_for(db: Session, rec_id: int) -> list[dict]:
    items = (
        db.query(ProgressItem)
        .filter(ProgressItem.recommendation_id == rec_id)
        .order_by(ProgressItem.id)
        .all()
    )
    return [{"id": i.id, "title": i.title, "is_done": i.is_done} for i in items]


@app.post("/api/recommend")
def recommend(body: ProfileIn, user: User = Depends(get_current_user),
              db: Session = Depends(get_db)):
    # 1. Save or update the profile
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if profile is None:
        profile = UserProfile(user_id=user.id)
        db.add(profile)
    profile.education_level = body.education_level
    profile.skills_json = json.dumps(body.skills)
    profile.interests_json = json.dumps(body.interests)
    profile.goals = body.goals
    profile.updated_at = datetime.now(timezone.utc)

    # 2. Rank careers (placeholder, replaced in Phase 4)
    careers = recommend_careers(body.skills, body.interests)

    # 3. Save the recommendation and its roadmap steps
    rec = Recommendation(user_id=user.id, careers_json=json.dumps(careers))
    db.add(rec)
    db.flush()  # gives rec an id
    for title in build_roadmap(careers[0]):
        db.add(ProgressItem(recommendation_id=rec.id, title=title))
    db.commit()

    return {"recommendation_id": rec.id, "careers": careers,
            "roadmap": roadmap_for(db, rec.id)}


@app.get("/api/recommendations/latest")
def latest(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rec = (
        db.query(Recommendation)
        .filter(Recommendation.user_id == user.id)
        .order_by(Recommendation.id.desc())
        .first()
    )
    if rec is None:
        raise HTTPException(status_code=404, detail="No recommendations yet")
    return {"recommendation_id": rec.id, "careers": json.loads(rec.careers_json),
            "roadmap": roadmap_for(db, rec.id)}


@app.patch("/api/progress/{item_id}")
def update_progress(item_id: int, body: ProgressUpdate,
                    user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    item = (
        db.query(ProgressItem)
        .join(Recommendation, ProgressItem.recommendation_id == Recommendation.id)
        .filter(ProgressItem.id == item_id, Recommendation.user_id == user.id)
        .first()
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    item.is_done = body.is_done
    item.completed_at = datetime.now(timezone.utc) if body.is_done else None
    db.commit()
    return {"id": item.id, "is_done": item.is_done}