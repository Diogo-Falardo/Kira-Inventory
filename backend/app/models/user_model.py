from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, UniqueConstraint
from .base import Base



class User(Base):
    __tablename__ = "users"


    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    plan_code = Column(String(50), nullable=False, default="free")
    plan_expires = Column(DateTime, nullable=True)
    is_admin = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    last_login = Column(DateTime, nullable=True)


    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', plan='{self.plan_code}', admin={self.is_admin})>"




class AdvancedUsersProfile(Base):
    __tablename__ = "advanced_users_profile"


    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, unique=True)
    username = Column(String(50), nullable=True, unique=True)
    avatar_url = Column(String(2048), nullable=True)
    address = Column(Text, nullable=True)
    country = Column(String(100), nullable=True)
    phone_number = Column(String(30), nullable=True)


    def __repr__(self):
        return f"<AdvancedUsersProfile(id={self.id}, user_id={self.user_id})>"