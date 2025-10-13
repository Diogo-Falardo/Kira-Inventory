from datetime import datetime, timedelta, timezone
from typing import Tuple, Dict, Any
import uuid
from app.core.config import settings

def _now() -> datetime:
    return datetime.now(timezone.utc)

"""
PASSWORD
"""
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt_sha256", "bcrypt"], deprecated="auto")

# hash password
def create_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password_hash(plain_password: str, password_hash: str)-> bool:
    return pwd_context.verify(plain_password, password_hash)

"""
JWT
"""
import jwt

def generate_access_token(
    subject: str,
    minutes: int = 15,
    scope: str | None = None,
    extra_claims: Dict[str,Any] | None = None,
) -> str:
    now = _now()
    payload = {
        "sub": subject, # owner of  the token
        "iss": settings.ISSUER, # who send the token
        "aud": settings.AUDIENCE, # who must accept token
        "iat": int(now.timestamp()), # when it was created
        "nbf": int(now.timestamp()), # not valid before this time
        "exp": int((now + timedelta(minutes=minutes)).timestamp()), # expires
        "jti": str(uuid.uuid4()), # permissons (custom claim)
    }
    if scope:
        payload["scope"] = scope
    if extra_claims:
        payload.update(extra_claims)

    token = jwt.encode(payload, settings.JWT_SECRET, algorithm="HS256", headers={"typ": "JWT"})
    return token

def verify_token(token: str)-> Dict[str, Any]:
    claims = jwt.decode(
        token,
        settings.JWT_SECRET,
        algorithms=["HS256"],
        audience=settings.AUDIENCE,
        issuer=settings.ISSUER,
        options={"require": ["exp", "iat", "nbf", "iss", "aud"]},
        leeway=60,
    )
    return claims
    