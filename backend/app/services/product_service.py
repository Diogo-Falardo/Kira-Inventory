from sqlalchemy.orm import Session
from typing import Mapping, Any
# models
from app.models.product_model import Product
# schemas
from app.models.schemas.product_schema import ProductCreate, ProductUpdate
# utils 
from app.utils.exceptions import THROW_ERROR
from app.utils.product_helper import *

# insert product in the db
def insert_product(payload: ProductCreate, current_user_id: int, db: Session):
    
    new_product = Product(
        user_id = current_user_id,
        name = payload.name,
        description = payload.description,
        price = payload.price,
        cost = payload.cost,
        platform = payload.platform,
        img_url = payload.img_url,
        internal_code = payload.internal_code
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product

# update product in the db
def change_product(payload: ProductUpdate,data: Mapping[str, Any], db: Session):

    for item, value in data.items():
        setattr(payload, item, value)

    db.commit()
    db.refresh(payload)

    return payload

# alter state of change
# if its true change for false || if its false change for true
def change_product_state(product: Product, db: Session):
    if product.inactive == 1:
        product.inactive = 0
    else:
        product.inactive = 1

    db.commit()
    db.refresh(product)
        
    return product

# delete a product from the db
def remove_product(product: Product, db: Session):

    db.delete(product)
    db.commit()

    return {"detail":"Product deleted successfully"}
    