from sqlalchemy.orm import Session
import re
from decimal import Decimal
# utils
from app.utils.exceptions import THROW_ERROR
# models
from app.models.product_model import Product

"""
input validatores
"""

# validate product 
# if its valid return true
def validate_product_name(product_name: str, user_id: int,db: Session) -> bool:
    pattern = re.compile(r'^[a-zA-Z0-9]+$')

    if pattern.match(product_name) is None: 
        THROW_ERROR("Product name cant have simbols or spaces!", 400)
    
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


def validate_product_internalcode(product_internalcode: str, db: Session) -> bool:

    product = db.query(Product).filter(Product.internal_code == product_internalcode).first()
    if product:
        THROW_ERROR("There is already a product with that internal code", 400)

    return True

"""
checker
"""
# this function verifies if the product id corresponds to that user id
# returns the product
def check_product_user(product_id: int, user_id: int, db: Session) -> bool:

    product = db.query(Product).filter(Product.id == product_id, Product.user_id == user_id).first()
    if product is None:
        THROW_ERROR("Hmmm that doenst look good! are u sure thats your product??", 400)


    return product

