from datetime import datetime, timedelta

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from fastapi.security import (
    HTTPBearer,
    HTTPAuthorizationCredentials
)
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from jose import jwt
import bcrypt

from app.database.database import get_db
from app.models.user import User


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


# =========================
# JWT Configuration
# =========================

SECRET_KEY = "skillbridge-ai-secret-key-change-later"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


# =========================
# Authentication Security
# =========================

security = HTTPBearer()


# =========================
# Request Models
# =========================

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================
# Create JWT Token
# =========================

def create_access_token(user_id: int):

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": str(user_id),
        "exp": expire
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# =========================
# Get Current Logged-in User
# =========================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token"
            )

        user = (
            db.query(User)
            .filter(User.id == int(user_id))
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired authentication token"
        )


# =========================
# Register
# =========================

@router.post("/register")
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    try:

        existing_user = (
            db.query(User)
            .filter(User.email == data.email)
            .first()
        )

        if existing_user:
            return {
                "success": False,
                "message": "Email already registered"
            }

        password_bytes = data.password.encode("utf-8")

        if len(password_bytes) > 72:
            return {
                "success": False,
                "message": "Password must be 72 bytes or less"
            }

        hashed_password = bcrypt.hashpw(
            password_bytes,
            bcrypt.gensalt()
        ).decode("utf-8")

        user = User(
            full_name=data.full_name,
            email=data.email,
            hashed_password=hashed_password
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        return {
            "success": True,
            "message": "Account created successfully",
            "data": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email
            }
        }

    except Exception as e:

        db.rollback()

        return {
            "success": False,
            "message": "Failed to create account",
            "error": str(e)
        }


# =========================
# Login
# =========================

@router.post("/login")
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    try:

        user = (
            db.query(User)
            .filter(User.email == data.email)
            .first()
        )

        if not user:
            return {
                "success": False,
                "message": "Invalid email or password"
            }

        password_bytes = data.password.encode("utf-8")

        if len(password_bytes) > 72:
            return {
                "success": False,
                "message": "Invalid email or password"
            }

        password_valid = bcrypt.checkpw(
            password_bytes,
            user.hashed_password.encode("utf-8")
        )

        if not password_valid:
            return {
                "success": False,
                "message": "Invalid email or password"
            }

        # Create JWT
        access_token = create_access_token(
            user.id
        )

        return {
            "success": True,
            "message": "Login successful",
            "data": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "access_token": access_token,
                "token_type": "bearer"
            }
        }

    except Exception as e:

        return {
            "success": False,
            "message": "Login failed",
            "error": str(e)
        }