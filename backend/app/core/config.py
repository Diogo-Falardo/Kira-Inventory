from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    APP_NAME: str 
    API_PREFIX: str
    DB_URL: str
    CORS_ORIGINS: List[str] = ["http://localhost:5174", "http://localhost:5173"]
    JWT_SECRET: str
    ISSUER: str
    AUDIENCE: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()