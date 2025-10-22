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
from app.models.schemas.user_schema import AdvancedUsersProfileUpdate, UserChangePassword
# services
from app.services.user_service import get_user_from_id, get_user_profile, insert_new_profile, update_user_profile, new_email, new_password
# utils
from app.utils.user_helper import *

router = APIRouter(prefix="/user", tags=["user"])

# get user profile
@router.get("/user", response_model=dict, name="user")
def user(
    db: Session = Depends(get_db), 
    current_user_id = Depends(validate_user_token)
):
    user = get_user_from_id(db, current_user_id)
    user_profile = get_user_profile(current_user_id, db)

    if user and user_profile:
        info = {
            "email": user.email,
            "username": user_profile.username,
            "avatar": user_profile.avatar_url,
            "last_login": user.last_login
        }
    else:
        THROW_ERROR("No user has been found!", 400)

    return info
    
# update profile
@router.patch("/update-user/", response_model=dict, name="updateUserProfile")
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
@router.put("/change-email/", response_model=dict, name="changeUserEmail")
def change_email(
    payload: str,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    return new_email(payload, current_user_id, db)

# change password
@router.put("/change-password/", response_model=dict, name="changeUserPassword")
def change_password(
    payload: UserChangePassword,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
): 
    validate_password(payload.password)
    validate_password(payload.new_password)

    return new_password(payload,current_user_id, db)

# last-login -> GET
@router.get("/my-last-login/", response_model=dict, name="lastLogin")
def last_login(
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    user = get_user_from_id(db, current_user_id)


    return {"detail":f"{user.last_login}"}
