import json

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.learning_plan import LearningPlan
from app.services.ai_service import generate_learning_plan


router = APIRouter(
    prefix="/api/learning-plan",
    tags=["Learning Plan"]
)


# =========================
# Request Model
# =========================

class LearningPlanData(BaseModel):
    career_goal: str
    experience_level: str
    skill_gaps: List[str]


# =========================
# POST - Generate & Save
# =========================

@router.post("/")
def create_learning_plan(
    data: LearningPlanData,
    db: Session = Depends(get_db)
):

    try:

        # Generate AI learning plan
        learning_plan = generate_learning_plan(
            data.career_goal,
            data.experience_level,
            data.skill_gaps
        )

        # Save to database
        plan_record = LearningPlan(
            career_goal=data.career_goal,
            experience_level=data.experience_level,
            skill_gaps=json.dumps(data.skill_gaps),
            plan_data=json.dumps(learning_plan)
        )

        db.add(plan_record)
        db.commit()
        db.refresh(plan_record)

        return {
            "success": True,
            "message": "Learning plan generated and saved successfully",
            "data": {
                "id": plan_record.id,
                "career_goal": data.career_goal,
                "experience_level": data.experience_level,
                "skill_gaps": data.skill_gaps,
                "learning_plan": learning_plan
            }
        }

    except Exception as e:

        db.rollback()

        return {
            "success": False,
            "message": "Failed to generate and save learning plan",
            "error": str(e)
        }


# =========================
# GET - Latest Learning Plan
# =========================

@router.get("/")
def get_learning_plan(
    db: Session = Depends(get_db)
):

    plan = (
        db.query(LearningPlan)
        .order_by(LearningPlan.id.desc())
        .first()
    )

    if not plan:

        return {
            "success": False,
            "message": "No learning plan found",
            "data": None
        }

    return {
        "success": True,
        "data": {
            "id": plan.id,
            "career_goal": plan.career_goal,
            "experience_level": plan.experience_level,

            "skill_gaps": json.loads(
                plan.skill_gaps or "[]"
            ),

            "learning_plan": json.loads(
                plan.plan_data
            )
        }
    }