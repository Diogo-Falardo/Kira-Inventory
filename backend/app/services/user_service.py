from sqlalchemy.orm import Session
from typing import Mapping, Any
# core
from app.core.session import get_db
# security
from app.core.security import create_password_hash, verify_password_hash
# model
from app.models.user_model import User, AdvancedUsersProfile
# exceptions
from app.utils.exceptions import THROW_ERROR
# schemas
from app.models.schemas.user_schema import AdvancedUsersProfileUpdate, UserChangePassword

def get_user_from_id(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        THROW_ERROR("Invalid user", 400)
    
    return user

# user has a profile already?
def get_user_profile(user_id: int, db: Session):
    user = db.query(AdvancedUsersProfile).filter(AdvancedUsersProfile.user_id == user_id).first()
    if not user:
        return False
    
    return user

def insert_new_profile(user_id: int, db: Session) -> bool:

    new_profile = AdvancedUsersProfile(
        user_id = user_id
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return True

# update an user
def update_user_profile(payload: AdvancedUsersProfileUpdate, data: Mapping[str,Any], db: Session):

    for item, value in data.items():
        setattr(payload, item, value)

    db.commit()
    db.refresh(payload)

    return {"detail":"Profile updated!"}

def new_email(payload: str, user_id: int,db: Session):

    user = get_user_from_id(db, user_id)

    user.email = payload

    db.commit()
    db.refresh(user)

    return {"detail": f"Your new email is: {payload}"}

def new_password(payload: UserChangePassword, user_id: int, db:Session):
    
    user = get_user_from_id(db, user_id)

    if payload.password == payload.new_password:
        THROW_ERROR("Passwords cant be the same!", 400)

    if verify_password_hash(payload.password, user.password_hash) is not True:
        THROW_ERROR("The password doesnt correspond to the old one!", 400)

    new_password = create_password_hash(payload.new_password)

    if new_password == user.password_hash:
        THROW_ERROR("You cant change the password to your old password!", 400)

    user.password_hash = new_password

    db.commit()
    db.refresh(user)

    return {"detail": "Password changed successfully"}