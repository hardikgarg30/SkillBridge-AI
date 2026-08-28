import json

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.roadmap import Roadmap
from app.models.learning_plan import LearningPlan

from app.services.ai_service import (
    generate_ai_roadmap,
    generate_learning_plan
)


router = APIRouter(
    prefix="/api/roadmap",
    tags=["Roadmap"]
)


# ============================================================
# REQUEST MODEL
# ============================================================

class RoadmapRequest(BaseModel):

    career_goal: str

    experience_level: str

    technical_skills: List[str] = []

    skill_gaps: List[str] = []

    # Mock Test
    mock_test_score: int = 0

    mock_test_total: int = 0

    mock_test_percentage: int = 0


# ============================================================
# POST - GENERATE ROADMAP + LEARNING PLAN
# ============================================================

@router.post("/")
def create_roadmap(
    request: RoadmapRequest,
    db: Session = Depends(get_db)
):

    try:

        # ----------------------------------------------------
        # 1. Generate AI Roadmap
        # ----------------------------------------------------

        roadmap = generate_ai_roadmap(
            career_goal=request.career_goal,
            experience_level=request.experience_level,
            technical_skills=request.technical_skills,
            skill_gaps=request.skill_gaps,

            # NEW: Mock Test Performance
            mock_test_score=request.mock_test_score,
            mock_test_total=request.mock_test_total,
            mock_test_percentage=request.mock_test_percentage
        )


        # ----------------------------------------------------
        # 2. Save Roadmap
        # ----------------------------------------------------

        roadmap_record = Roadmap(
            career_goal=request.career_goal,
            experience_level=request.experience_level,
            roadmap_data=json.dumps(roadmap)
        )

        db.add(roadmap_record)

        # Create ID before continuing
        db.flush()


        # ----------------------------------------------------
        # 3. Generate AI Learning Plan
        # ----------------------------------------------------

        learning_plan = generate_learning_plan(
            career_goal=request.career_goal,
            experience_level=request.experience_level,
            skill_gaps=request.skill_gaps
        )


        # ----------------------------------------------------
        # 4. Save Learning Plan
        # ----------------------------------------------------

        learning_plan_record = LearningPlan(
            career_goal=request.career_goal,
            experience_level=request.experience_level,

            skill_gaps=json.dumps(
                request.skill_gaps
            ),

            plan_data=json.dumps(
                learning_plan
            )
        )

        db.add(learning_plan_record)


        # ----------------------------------------------------
        # 5. Commit
        # ----------------------------------------------------

        db.commit()

        db.refresh(roadmap_record)
        db.refresh(learning_plan_record)


        # ----------------------------------------------------
        # 6. Return Everything
        # ----------------------------------------------------

        return {
            "success": True,

            "message": (
                "AI roadmap and learning plan "
                "generated and saved successfully"
            ),

            "data": {

                "roadmap": {
                    "id": roadmap_record.id,

                    "career_goal": (
                        request.career_goal
                    ),

                    "experience_level": (
                        request.experience_level
                    ),

                    "mock_test_score": (
                        request.mock_test_score
                    ),

                    "mock_test_total": (
                        request.mock_test_total
                    ),

                    "mock_test_percentage": (
                        request.mock_test_percentage
                    ),

                    "roadmap": roadmap
                },

                "learning_plan": {
                    "id": learning_plan_record.id,

                    "career_goal": (
                        request.career_goal
                    ),

                    "experience_level": (
                        request.experience_level
                    ),

                    "skill_gaps": (
                        request.skill_gaps
                    ),

                    "learning_plan": learning_plan
                }

            }
        }


    except Exception as e:

        db.rollback()

        print(
            "Roadmap/Learning Plan generation error:",
            str(e)
        )

        return {
            "success": False,

            "message": (
                "Failed to generate roadmap "
                "and learning plan"
            ),

            "error": str(e)
        }


# ============================================================
# GET - ALL ROADMAPS
# ============================================================

@router.get("/")
def get_roadmaps(
    db: Session = Depends(get_db)
):

    roadmaps = (
        db.query(Roadmap)
        .order_by(Roadmap.id.desc())
        .all()
    )

    return {
        "success": True,

        "data": [

            {
                "id": roadmap.id,

                "career_goal": roadmap.career_goal,

                "experience_level": (
                    roadmap.experience_level
                ),

                "roadmap": json.loads(
                    roadmap.roadmap_data
                )
            }

            for roadmap in roadmaps
        ]
    }