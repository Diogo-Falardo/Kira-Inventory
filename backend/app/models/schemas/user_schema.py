from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict, Field, field_validator

# exceptions
from app.utils.exceptions import THROW_ERROR


# ---- Base ----
class UserBase(BaseModel):
    email: EmailStr
    plan_code: str = "free"
    is_admin: bool = False

    @field_validator("email", mode="before")
    @classmethod
    def email_not_blank(cls, v: EmailStr):
        if v is None:
            THROW_ERROR("Email cannot be blank.", 400)
        if isinstance(v, str) and not v.strip():
            THROW_ERROR("Email cannot be blank.", 400)
        return v.lower()

    @field_validator("plan_code", mode="before")
    @classmethod
    def plan_code_not_blank(cls, v: Optional[str]):
        if v is None:
            return "free"
        if isinstance(v, str) and not v.strip():
            THROW_ERROR("plan_code cannot be blank.", 400)
        return v.strip()


# ---- Create ----
class UserCreate(UserBase):
    password: str = Field(min_length=6)

    @field_validator("password")
    @classmethod
    def password_not_blank(cls, v: str):
        if not v or not v.strip():
            THROW_ERROR("Password cannot be blank.", 400)
        return v
    
class UserLogin(BaseModel):
    email: EmailStr

    @field_validator("email", mode="before")
    @classmethod
    def email_not_blank(cls, v: EmailStr):
        if v is None:
            THROW_ERROR("Email cannot be blank.", 400)
        if isinstance(v, str) and not v.strip():
            THROW_ERROR("Email cannot be blank.", 400)
        return v.lower()

    password: str = Field(min_length=6)

    @field_validator("password")
    @classmethod
    def password_not_blank(cls, v: str):
        if not v or not v.strip():
            THROW_ERROR("Password cannot be blank.", 400)
        return v


# ---- Update (patch) ----
class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(default=None, min_length=6)
    plan_code: Optional[str] = None
    plan_expires: Optional[datetime] = None
    is_admin: Optional[bool] = None

    @field_validator("email", mode="before")
    @classmethod
    def email_lower_if_present(cls, v: Optional[EmailStr]):
        if v is None:
            return v
        if isinstance(v, str) and not v.strip():
            THROW_ERROR("Email cannot be blank.", 400)
        return v.lower()  # type: ignore

    @field_validator("plan_code", mode="before")
    @classmethod
    def plan_code_clean(cls, v: Optional[str]):
        if v is None:
            return v
        if isinstance(v, str) and not v.strip():
            THROW_ERROR("plan_code cannot be blank.", 400)
        return v.strip()


# ---- Read/Out ----
class UserOut(UserBase):
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

"""
ADVANCER USER SCHEMA
"""
# ---- Base ----
class AdvancedUsersProfileBase(BaseModel):
    user_id: int
    username: Optional[str] = None
    avatar_url: Optional[str] = None 
    address: Optional[str] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None

    @field_validator("user_id")
    @classmethod
    def user_id_positive(cls, v: int):
        if v is None or v <= 0:
            THROW_ERROR("user_id must be a positive integer.", 400)
        return v

    @field_validator("avatar_url")
    @classmethod
    def avatar_url_strip(cls, v: Optional[str]):
        if v is None:
            return v
        v2 = v.strip()
        return v2 or None


# ---- Create ----
class AdvancedUsersProfileCreate(AdvancedUsersProfileBase):
    pass


# ---- Update (patch) ----
class AdvancedUsersProfileUpdate(BaseModel):
    username: Optional[str] = None
    avatar_url: Optional[str] = None
    address: Optional[str] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None


# ---- Read/Out ----
class AdvancedUsersProfileOut(AdvancedUsersProfileBase):
    id: int

    model_config = ConfigDict(from_attributes=True)