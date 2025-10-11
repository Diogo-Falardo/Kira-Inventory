from fastapi import FastAPI
from fastapi.middleware. cors import CORSMiddleware
from app.core.config import Settings

app = FastAPI(title=Settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)