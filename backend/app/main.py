from fastapi import FastAPI
from fastapi.middleware. cors import CORSMiddleware
from app.core.config import settings


app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routes.auth import router as auth_router
app.include_router(auth_router)

from app.routes.product import router as product_router
app.include_router(product_router)
