from sqlalchemy.orm import Session
from email_validator import validate_email as valid, EmailNotValidError
import re
# utils
from app.utils.exceptions import THROW_ERROR
# models
from app.models.user_model import User, AdvancedUsersProfile

"""
input validators
"""
# validate parameter if invalid return HTTPEXCEPTION
# if valid return true

def validate_email(email: str) -> bool:
    try:
        info = valid(email, check_deliverability=True)
        # cleans email
        return info.normalized
    except EmailNotValidError as e:
        return False, str(e)
    
def validate_password(password: str)-> bool:
    if len(password) < 6:
        THROW_ERROR("Password is to short!", 400)
    if len(password) > 128:
        THROW_ERROR("Password is to long!", 400)
    
    password_pattern = r"^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9]).{6,}$"
    if not re.match(password_pattern, password):
        THROW_ERROR("Passowrd need at least 6 characters, 1 letter upercase, 1 lowercase and 1 simbol!", 400)

    return True
    
def validate_username(username: str) -> bool:

    if not username:
        THROW_ERROR("Username is required!", 400)

    if len(username) < 3:
        THROW_ERROR("Username is to short!", 400)
    if len(username) > 15:
        THROW_ERROR("Username is to long!", 400)
    
    underscore_pattern = r"^[A-Za-z0-9_]+$"
    if not re.fullmatch(underscore_pattern, username):
        THROW_ERROR("Username can only contain letters,numbers and _(underscore)!", 400)

    
    
    return True

def validate_phone(phone_number: int) -> bool:
    
    if not phone_number:
        THROW_ERROR("Phone number is required", 400)

    if len(phone_number) < 4 or len(phone_number) > 15:
        THROW_ERROR("Invalid phone number!", 400)

    return True

"""
input finders
"""
# if there is no parameter on the db return false
# if there is return true

def email_finder(email: str, db: Session) -> bool:
    user = db.query(User).filter(User.email == email).first()
    if user is not None:
        return True
    
    return False

def username_finder(username: str, db: Session) -> bool:
    user = db.query(User).filter(AdvancedUsersProfile.username == username).first()
    if user is not None:
        return True
    
    return False

