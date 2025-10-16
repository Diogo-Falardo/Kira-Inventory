from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Any
# core
from app.core.session import get_db
# securty
from app.core.security import validate_user_token
# schemas
from app.models.schemas.product_schema import ProductBase, ProductCreate, ProductOut, ProductUpdate
# exceptions 
from app.utils.exceptions import THROW_ERROR
# utils
from app.utils.product_helper import *
# services
from app.services.product_service import insert_product, change_product, change_product_state, remove_product

router = APIRouter(prefix="/product", tags=["product"])

# create a product -> add
@router.post("/add-product/", response_model=ProductBase)
def create_new_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    validate_product_name(payload.name,current_user_id,db)
    validate_product_desc(payload.description)
    validate_product_price(payload.price)
    validate_product_cost(payload.cost)
    validate_product_platform(payload.platform)
    validate_product_internalcode(payload.internal_code,db)

    return insert_product(payload,current_user_id,db)


# update a product -> without needing to update everything
@router.patch("/update-product/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    data: dict[str,Any] = payload.model_dump(exclude_unset=True)

    if not data:
        THROW_ERROR("No data provided!", 400)

    for item, value in data.items():
        if item == "name":
            validate_product_name(value,current_user_id,db)
        elif item == "description":
            validate_product_desc(value)
        elif item == "price":
            validate_product_price(value)
        elif item == "cost":
            validate_product_cost(value)
        elif item == "platform":
            validate_product_platform(value)
        elif item == "internal_code":
            validate_product_internalcode(value, db)

    # validate if the user is the owner of that product
    product = check_product_user(product_id,current_user_id, db)

    return change_product(product,data,db)


# inactive a product -> it can be activated again 
@router.put("/inactive-product/{product_id}", response_model=ProductOut)
def inactive_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    product = check_product_user(product_id,current_user_id,db)

    return change_product_state(product,db)


# delete a product -> delete from the db
@router.delete("/delete-product/{product_id}", response_model=dict)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    product = check_product_user(product_id,current_user_id,db)

    return remove_product(product,db)

    
   



