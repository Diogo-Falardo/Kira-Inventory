from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
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
from app.services.product_service import insert_product

router = APIRouter(prefix="/product", tags=["product"])

# create a product -> add
@router.post("/add-product/", response_model=ProductBase)
def create_new_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    validate_product_name(db,payload.name,current_user_id)
    validate_product_desc(payload.description)
    validate_product_price(payload.price)
    validate_product_cost(payload.cost)
    validate_product_platform(payload.platform)

    return insert_product(payload,current_user_id,db)

    
    

# update a product -> without needing to update everything
router.patch("/update-product/", response_model=ProductOut)
def update_product(
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    validate_product_name(db,payload.name,current_user_id)
    validate_product_desc(payload.description)
    validate_product_price(payload.price)
    validate_product_cost(payload.cost)
    validate_product_platform(payload.platform)

    pass

# inactive a product -> it can be activated again 
router.put("/inactive-product/", response_model=ProductOut)
def inactive_product(
    value: int,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    pass

# delete a product -> delete from the db
router.delete("/delete-product/", response_model=ProductOut)
def delete_product(
    value: int,
    db: Session = Depends(get_db),
    current_user_id = Depends(validate_user_token)
):
    pass

    
   



