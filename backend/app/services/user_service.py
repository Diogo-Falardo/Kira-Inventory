from sqlalchemy.orm import Session
from typing import Mapping, Any
# core
from app.core.session import get_db
# model
from app.models.user_model import User, AdvancedUsersProfile
# exceptions
from app.utils.exceptions import THROW_ERROR
# schemas
from app.models.schemas.user_schema import AdvancedUsersProfileUpdate

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

