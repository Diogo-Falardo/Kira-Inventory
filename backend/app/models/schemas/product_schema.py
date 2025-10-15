from datetime import datetime
from decimal import Decimal
from typing import Optional
from pydantic import BaseModel, ConfigDict, field_validator

# exceptions
from app.utils.exceptions import THROW_ERROR


# ---- Base ----
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Decimal
    cost: Optional[Decimal] = None
    platform: Optional[str] = None
    img_url: Optional[str] = None
    internal_code: Optional[str] = None
    inactive: bool = False


    @field_validator("name")
    @classmethod
    def name_not_blank(cls, v: str):
        if not v or not v.strip():
            THROW_ERROR("name cannot be blank.", 400)
        return v.strip()

    @field_validator("price")
    @classmethod
    def price_non_negative(cls, v: Decimal):
        try:
            if v is None or Decimal(v) < 0:
                THROW_ERROR("price must be >= 0.", 400)
        except Exception:
            THROW_ERROR("price must be a valid decimal.", 400)
        return Decimal(v).quantize(Decimal("0.01"))

    @field_validator("cost")
    @classmethod
    def cost_non_negative(cls, v: Optional[Decimal]):
        if v is None:
            return v
        try:
            if Decimal(v) < 0:
                THROW_ERROR("cost must be >= 0.", 400)
        except Exception:
            THROW_ERROR("cost must be a valid decimal.", 400)
        return Decimal(v).quantize(Decimal("0.01"))

    @field_validator("internal_code", "platform", "img_url", mode="before")
    @classmethod
    def strip_optional_strings(cls, v: Optional[str]):
        if v is None:
            return v
        v2 = v.strip()
        return v2 or None


# ---- Create ----
class ProductCreate(ProductBase):
    pass


# ---- Update (patch) ----
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    cost: Optional[Decimal] = None
    platform: Optional[str] = None
    img_url: Optional[str] = None
    internal_code: Optional[str] = None
    inactive: Optional[bool] = None

    @field_validator("name")
    @classmethod
    def name_if_present_not_blank(cls, v: Optional[str]):
        if v is None:
            return v
        if not v.strip():
            THROW_ERROR("name cannot be blank.", 400)
        return v.strip()

    @field_validator("price")
    @classmethod
    def price_if_present_non_negative(cls, v: Optional[Decimal]):
        if v is None:
            return v
        try:
            if Decimal(v) < 0:
                THROW_ERROR("price must be >= 0.", 400)
        except Exception:
            THROW_ERROR("price must be a valid decimal.", 400)
        return Decimal(v).quantize(Decimal("0.01"))

    @field_validator("cost")
    @classmethod
    def cost_if_present_non_negative(cls, v: Optional[Decimal]):
        if v is None:
            return v
        try:
            if Decimal(v) < 0:
                THROW_ERROR("cost must be >= 0.", 400)
        except Exception:
            THROW_ERROR("cost must be a valid decimal.", 400)
        return Decimal(v).quantize(Decimal("0.01"))

    @field_validator("internal_code", "platform", "img_url", mode="before")
    @classmethod
    def strip_optional_strings(cls, v: Optional[str]):
        if v is None:
            return v
        v2 = v.strip()
        return v2 or None


# ---- Read/Out ----
class ProductOut(ProductBase):
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

# --- Delete ----
class ProductDeleteOut(ProductBase):
    deleted_at: datetime


    
