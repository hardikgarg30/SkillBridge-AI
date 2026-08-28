from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.services.skill_analyzer import detect_company_roles


router = APIRouter(
    prefix="/api/company-roles",
    tags=["Company Role Detection"]
)


# =========================
# Request Model
# =========================

class CompanyRoleRequest(BaseModel):
    technical_skills: List[str]


# =========================
# Detect Company Roles
# =========================

@router.post("/")
def detect_roles(data: CompanyRoleRequest):

    roles = detect_company_roles(
        data.technical_skills
    )

    return {
        "success": True,
        "message": "Company roles detected successfully",
        "data": roles
    }