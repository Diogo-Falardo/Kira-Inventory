from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Any
from enum import Enum
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
from app.services import product_service

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

    return product_service.insert_product(payload,current_user_id,db)


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

    return product_service.change_product(product,data,db)


# inactive a product -> it can be activated again 
@router.put("/inactive-product/{product_id}", response_model=ProductOut)
def inactive_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    product = check_product_user(product_id,current_user_id,db)

    return product_service.change_product_state(product,db)


# delete a product -> delete from the db
@router.delete("/delete-product/{product_id}", response_model=dict)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    product = check_product_user(product_id,current_user_id,db)

    return product_service.remove_product(product,db)

# get products
# default -> return all products
# row -> input
# ge -> lowest value possible
# le -> max value possible

class Modes(str, Enum):
    all = "all"
    first = "first"
    last = "last"

# list of all products
@router.get("/my-products/")
def products(
    mode: Modes = Query(Modes.all, description="data order"),
    n: int = Query(5, ge=1, le=1000, description="Number of items for first/last"),
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
): 
    return product_service.retrieve_products(current_user_id,db,mode,n)


"""
stats of the products -> start here
"""

# stock stats and price of all
@router.get("/products-available/", response_model=dict)
def products(
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    return product_service.number_of_products_available(current_user_id,db)

# most lucrative products -> Top 3 or more...
@router.get("/top-lucrative-products/", response_model=dict)
def lucrative_products(
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
): 
    return product_service.most_valuead_products(current_user_id, db)

# stock profits + where client is losing money
@router.get("/estimated-profit/")
def profit(
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    return product_service.profit(current_user_id, db)

# products that are low on stock
@router.get("/low-stock-items/{value}", response_model=dict)
def low_stock(
    value: int,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    return product_service.low_stock_items(value,current_user_id,db)
    
    


   



