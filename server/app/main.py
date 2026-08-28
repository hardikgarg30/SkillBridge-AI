from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine


# ============================================================
# IMPORT ALL DATABASE MODELS
# ============================================================

from app.models.assessment import Assessment
from app.models.roadmap import Roadmap
from app.models.learning_plan import LearningPlan
from app.models.user import User
from app.models.resume import Resume
from app.models.progress import Progress


# ============================================================
# CREATE DATABASE TABLES
# ============================================================

Base.metadata.create_all(bind=engine)


# ============================================================
# FASTAPI APPLICATION
# ============================================================

app = FastAPI(
    title="SkillBridge AI API",
    description="AI-powered career skill assessment and learning roadmap API",
    version="1.0.0",
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        # Vite development servers
        "http://localhost:5173",
        "http://127.0.0.1:5173",

        "http://localhost:5174",
        "http://127.0.0.1:5174",

        "http://localhost:5175",
        "http://127.0.0.1:5175",

        "http://localhost:5176",
        "http://127.0.0.1:5176",
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


# ============================================================
# API ROUTERS
# ============================================================

from app.routes.assessment import router as assessment_router
from app.routes.roadmap import router as roadmap_router
from app.routes.learning_plan import router as learning_plan_router
from app.routes.auth import router as auth_router
from app.routes.resume import router as resume_router
from app.routes.company_roles import router as company_roles_router
from app.routes.practice_questions import router as practice_questions_router
from app.routes.progress import router as progress_router


# ============================================================
# INCLUDE ROUTERS
# ============================================================

app.include_router(assessment_router)
app.include_router(roadmap_router)
app.include_router(learning_plan_router)
app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(company_roles_router)
app.include_router(practice_questions_router)
app.include_router(progress_router)


# ============================================================
# ROOT ENDPOINT
# ============================================================

@app.get("/")
def root():
    return {
        "success": True,
        "message": "SkillBridge AI API is running",
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/health")
def health_check():
    return {
        "success": True,
        "status": "healthy",
    }