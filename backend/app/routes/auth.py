from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from datetime import datetime, timezone
# core
from app.core.session import get_db
# security
from app.core.security import create_password_hash, verify_password_hash, generate_access_token, verify_token
# model
from app.models.user_model import User
# schemas
from app.models.schemas.user_schema import UserOut, UserCreate, UserLogin, Token
# utils
import app.utils.user_helper as user_helper
# exceptions
from app.utils.exceptions import THROW_ERROR

router = APIRouter(prefix="/auth", tags=["auth"])

# register the user
@router.post("/register", response_model=UserOut)
def register_user(
    payload: UserCreate,
    db: Session = Depends(get_db)
):
    _email = user_helper.validate_email(payload.email)
    user_helper.validate_password(payload.password)

    if user_helper.email_finder(payload.email, db) is True:
        THROW_ERROR("Email already in use.", 400)
    
    _password = create_password_hash(payload.password)

    user = User(
        email = _email,
        password_hash = _password
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user

# login the user
@router.post("/login", response_model=Token)
def login_user(
    payload: UserLogin,
    db: Session = Depends(get_db)
):
    _email = user_helper.validate_email(payload.email)
    if _email:
        user = db.query(User).filter(User.email == _email).first()
    if not user:
       THROW_ERROR("Account was not found!", 400)

    user_helper.validate_password(payload.password)
    _password = payload.password
    if not verify_password_hash(_password, user.password_hash):
        THROW_ERROR("Incorrect password!", 401)

    access_token = generate_access_token(
        subject= str(user.id),
        minutes= 15,
    )

    refresh_token = generate_access_token(
        subject= str(user.id),
        minutes=60*24*30,
        scope="refresh",
    )

    user.last_login = datetime.now(timezone.utc)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
    
# refresh JWT token
@router.post("/refresh", response_model=Token)
def refresh_token(payload: dict = Body(...)):
    token = payload.get("refresh_token")
    if not token:
        THROW_ERROR("Refresh token required", 400)

    claims = verify_token(token)
    if claims.get("scope") != "refresh":
        THROW_ERROR("Invalid refresh token", 403)

    new_access_token = generate_access_token(
        subject=claims["sub"],
        minutes=15
    )

    return {
        "access_token": new_access_token,
        "refresh_token": token, 
        "token_type": "bearer"
    }

