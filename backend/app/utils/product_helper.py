from sqlalchemy.orm import Session
import re
from decimal import Decimal
# utils
from app.utils.exceptions import THROW_ERROR
# models
from app.models.product_model import Product

# validate product 
# if its valid return true

def validate_product_name(db: Session,product_name: str, user_id: int) -> bool:
    pattern = re.compile('[a-zA-Z0-9\s]+$')

    if pattern.match(product_name) is None: 
        THROW_ERROR("Product name cant have simbols!", 400)
    
    product = db.query(Product).filter(Product.name == product_name, Product.user_id == user_id).first()
    if product:
        THROW_ERROR("There is already a product with that name", 400)
    
    return True

def validate_product_desc(product_desc: str) -> bool:
    if len(product_desc) > 250:
        THROW_ERROR("Max 250 characters!", 400)

    return True

def validate_product_price(product_price: Decimal) -> bool:
    if product_price < 0.01 or product_price > 1000000:
        THROW_ERROR("Invalid product price!", 400)
    
    return True

def validate_product_cost(product_cost: Decimal) -> bool:
    if product_cost < 0.01 or product_cost > 1000000:
        THROW_ERROR("Invalid product cost!", 400)
    
    return True

def validate_product_platform(product_platform: str) -> bool:
    if len(product_platform) > 15:
        THROW_ERROR("Does it realy have a platform with such long name?", 400)
    
    return True


