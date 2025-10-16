from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Any
# core
from app.core.session import get_db
# securty
from app.core.security import validate_user_token
# exceptions 
from app.utils.exceptions import THROW_ERROR
# schemas
from app.models.schemas.user_schema import AdvancedUsersProfileUpdate
# services
from app.services.user_service import get_user_profile, insert_new_profile, update_user_profile
# utils
from app.utils.user_helper import *

router = APIRouter(prefix="/user", tags=["user"])

# update profile
@router.patch("/update-user/", response_model=dict)
def update_user(
    payload: AdvancedUsersProfileUpdate, 
    db: Session = Depends(get_db), 
    current_user_id = Depends(validate_user_token)
):
    user = get_user_profile(current_user_id, db)
    if user is False:
        insert_new_profile(current_user_id, db)

    data: dict[str, Any] = payload.model_dump(exclude_unset=True)

    if not data:
        THROW_ERROR("No changes provided!", 400)

    for item, value in data.items():
        if item == "user_id":
            data[item] = current_user_id
        if item == "username":
            validate_username(value)
            if username_finder(value, db) is True:
                THROW_ERROR("Username already in use!", 400)
        elif item == "phone_number":
            validate_phone(value)


    return update_user_profile(user,data,db)
    

# change email
# change password
# last-login -> GET

