from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Numeric
from sqlalchemy.ext.declarative import declarative_base


Base = declarative_base()


class Product(Base):
    __tablename__ = "products"


    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True) 
    price = Column(Numeric(10, 2), nullable=False, default=0.00)
    cost = Column(Numeric(10, 2), nullable=True)
    platform = Column(String(50), nullable=True)
    img_url = Column(String(2048), nullable=True)
    internal_code = Column(String(100), nullable=True, unique=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    inactive = Column(Boolean, nullable=False, default=False)


    def __repr__(self):
        return f"<Product(id={self.id}, name='{self.name}', inactive={self.inactive})>"