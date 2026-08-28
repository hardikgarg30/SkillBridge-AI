from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

from app.services.practice_questions import (
    generate_practice_questions
)


router = APIRouter(
    prefix="/api/practice-questions",
    tags=["Practice Questions"]
)


class PracticeQuestionsRequest(BaseModel):
    career_goal: str
    experience_level: str
    skill_gaps: List[str]
    number_of_questions: int = 10


@router.post("/")
def create_practice_questions(
    data: PracticeQuestionsRequest
):

    questions = generate_practice_questions(
        career_goal=data.career_goal,
        experience_level=data.experience_level,
        skill_gaps=data.skill_gaps,
        number_of_questions=data.number_of_questions
    )

    return {
        "success": True,
        "message": "Practice questions generated successfully",
        "data": questions
    }