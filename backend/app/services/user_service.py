from sqlalchemy.orm import Session
# core
from app.core.session import get_db
# model
from app.models.user_model import User
# exceptions
from app.utils.exceptions import THROW_ERROR

def get_user_from_id(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        THROW_ERROR("Invalid user", 400)
    
    return user

