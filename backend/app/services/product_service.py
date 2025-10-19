from sqlalchemy.orm import Session
from typing import Mapping, Any
from enum import Enum
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


class Modes(str, Enum):
    all = "all"
    first = "first"
    last = "last"

# get products
# if first or last doesnt have an n [default = 5]
def retrieve_products(user_id: int,db: Session,mode: Modes = Modes.all, n: int = 5):
    # not needed
    if mode not in Modes:
        THROW_ERROR("Option not available!", 400)

    user_products = db.query(Product).filter(Product.user_id == user_id)   

    if mode == Modes.all:
        products = user_products.order_by(Product.created_at.desc()).all()
    # asc
    elif mode == Modes.first:
        products = user_products.order_by(Product.created_at.asc()).limit(n).all()
    # desc
    elif mode == Modes.last:
        products = user_products.order_by(Product.created_at.desc()).limit(n).all()

    else:
        THROW_ERROR("Invalid mode!", 400)

    return products

# number of products available + price of all
def number_of_products_available(user_id: int, db: Session):

    products = db.query(Product).filter(Product.user_id == user_id).all()

    available_stock = 0
    total_price = 0
    for product in products:
        if product.available_stock > 1:
            available_stock += product.available_stock
            total_price += product.available_stock * product.price

    return{
        "available_stock": f"{available_stock}",
        "total_price": f"{total_price}"
    }
    
# top 3 lucrative products
def most_valuead_products(user_id: int, db: Session):

    products = db.query(Product).filter(Product.user_id == user_id).all()

    profitable = [product for product in products if product.price > product.cost]

    profitable.sort(key=lambda product: product.price - product.cost, reverse=True)

    top3 = profitable[:3]

    result = {
        product.name: {
            "profit": round(product.price - product.cost, 2)
        }
        for product in top3
    }

    return result

# value of stock and profit + product where client losing money
def profit(user_id: int, db: Session):

    products = db.query(Product).filter(Product.user_id == user_id).all()

    profit_value = 0
    stock_cost = 0
    products_not_profitable = 0
    losses = []
    for product in products:
        profit_value += product.price * product.available_stock
        stock_cost += product.cost * product.available_stock
        if product.cost > product.price:
            products_not_profitable += 1
            loss_amout = round(product.cost - product.price, 3)
            losses.append({
                "name": product.name,
                "loss on each product": loss_amout
            })
            

            

    return {"stock cost":stock_cost,"profit":profit_value,"losing_products": losses}
        
# get the low stock items -> user says what quantity its low
def low_stock_items(quantity: int, user_id: int, db: Session):

    products = db.query(Product).filter(Product.user_id == user_id).all()

    low_stock = []
    for product in products:
        if product.available_stock < quantity:
            low_stock.append({
                "name": product.name,
                "stock available": product.available_stock
            })

    if len(low_stock) > 1:
        return {"You need more stock of ": low_stock}
    else:
        return "Your stock is all good"




    