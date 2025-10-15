from sqlalchemy.orm import Session
# models
from app.models.product_model import Product
# schemas
from app.models.schemas.product_schema import ProductCreate
# utils 
from app.utils.exceptions import THROW_ERROR

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