import json

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.assessment import Assessment
from app.models.user import User
from app.routes.auth import get_current_user

from app.services.skill_analyzer import analyze_skills
from app.services.ai_service import generate_mock_test


# ============================================================
# ROUTER
# ============================================================

router = APIRouter(
    prefix="/api/assessment",
    tags=["Assessment"]
)


# ============================================================
# ASSESSMENT REQUEST
# ============================================================

class AssessmentData(BaseModel):

    career_goal: str

    experience_level: str

    technical_skills: List[str]


# ============================================================
# MOCK TEST REQUEST
# ============================================================

class MockTestRequest(BaseModel):

    career_goal: str

    experience_level: str

    technical_skills: List[str]

    skill_gaps: List[str] = []


# ============================================================
# POST - SUBMIT ASSESSMENT
# ============================================================

@router.post("/")
def submit_assessment(
    data: AssessmentData,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # --------------------------------------------------------
    # AI Skill Analysis
    # --------------------------------------------------------

    analysis = analyze_skills(
        data.career_goal,
        data.technical_skills
    )

    # --------------------------------------------------------
    # Skill gaps
    # --------------------------------------------------------

    skill_gaps = analysis.get(
        "skill_gaps",
        []
    )

    # --------------------------------------------------------
    # Strong skills
    # --------------------------------------------------------

    strong_skills = analysis.get(
        "strong_skills",
        []
    )

    # --------------------------------------------------------
    # Save assessment
    # --------------------------------------------------------

    assessment = Assessment(

        user_id=current_user.id,

        career_goal=data.career_goal,

        experience_level=data.experience_level,

        technical_skills=json.dumps(
            data.technical_skills
        ),

        skill_gaps=json.dumps(
            skill_gaps
        ),

        strong_skills=json.dumps(
            strong_skills
        )
    )

    db.add(assessment)

    db.commit()

    db.refresh(assessment)

    # --------------------------------------------------------
    # Return assessment
    # --------------------------------------------------------

    return {

        "success": True,

        "message":
            "Assessment analyzed and saved successfully",

        "data": {

            "id":
                assessment.id,

            "user_id":
                current_user.id,

            "career_goal":
                data.career_goal,

            "experience_level":
                data.experience_level,

            "technical_skills":
                data.technical_skills,

            "skill_analysis":
                analysis
        }
    }


# ============================================================
# POST - GENERATE AI MOCK TEST
# ============================================================

@router.post("/mock-test")
def create_mock_test(

    data: MockTestRequest,

    current_user: User = Depends(
        get_current_user
    )
):

    try:

        # ----------------------------------------------------
        # Generate AI mock test
        # ----------------------------------------------------

        mock_test = generate_mock_test(

            career_goal=
                data.career_goal,

            experience_level=
                data.experience_level,

            technical_skills=
                data.technical_skills,

            skill_gaps=
                data.skill_gaps
        )

        # ----------------------------------------------------
        # Validate
        # ----------------------------------------------------

        if not isinstance(
            mock_test,
            dict
        ):
            raise ValueError(
                "AI mock test response is invalid."
            )

        questions = mock_test.get(
            "questions",
            []
        )

        if not isinstance(
            questions,
            list
        ):
            raise ValueError(
                "AI mock test questions are invalid."
            )

        if len(questions) == 0:
            raise ValueError(
                "AI did not generate any questions."
            )

        # ----------------------------------------------------
        # Return
        # ----------------------------------------------------

        return {

            "success": True,

            "message":
                "AI mock test generated successfully",

            "data": {

                "career_goal":
                    data.career_goal,

                "experience_level":
                    data.experience_level,

                "technical_skills":
                    data.technical_skills,

                "skill_gaps":
                    data.skill_gaps,

                "total_questions":
                    len(questions),

                "questions":
                    questions
            }
        }

    except Exception as e:

        print(
            "Mock test generation error:",
            str(e)
        )

        return {

            "success": False,

            "message":
                "Failed to generate AI mock test",

            "error":
                str(e)
        }


# ============================================================
# GET - ALL ASSESSMENTS FOR CURRENT USER
# ============================================================

@router.get("/")
def get_assessments(

    db: Session = Depends(get_db),

    current_user: User = Depends(
        get_current_user
    )

):

    assessments = (

        db.query(Assessment)

        .filter(
            Assessment.user_id ==
            current_user.id
        )

        .order_by(
            Assessment.id.desc()
        )

        .all()
    )

    return {

        "success": True,

        "data": [

            {

                "id":
                    assessment.id,

                "user_id":
                    assessment.user_id,

                "career_goal":
                    assessment.career_goal,

                "experience_level":
                    assessment.experience_level,

                "technical_skills":
                    json.loads(
                        assessment.technical_skills
                    ),

                "skill_gaps":
                    json.loads(
                        assessment.skill_gaps
                        or "[]"
                    ),

                "strong_skills":
                    json.loads(
                        assessment.strong_skills
                        or "[]"
                    )
            }

            for assessment in assessments

        ]
    }