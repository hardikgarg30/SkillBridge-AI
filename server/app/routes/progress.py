from fastapi import APIRouter
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import Depends

from app.database.database import get_db
from app.models.progress import Progress


router = APIRouter(
    prefix="/api/progress",
    tags=["Progress Tracking"]
)


class ProgressRequest(BaseModel):
    user_id: int
    career_goal: str

    roadmap_progress: float = 0
    learning_progress: float = 0
    practice_progress: float = 0


@router.post("/")
def create_or_update_progress(
    data: ProgressRequest,
    db: Session = Depends(get_db)
):

    overall_progress = round(
        (
            data.roadmap_progress
            + data.learning_progress
            + data.practice_progress
        ) / 3,
        2
    )

    progress = (
        db.query(Progress)
        .filter(
            Progress.user_id == data.user_id
        )
        .first()
    )

    if progress:

        progress.career_goal = data.career_goal

        progress.roadmap_progress = (
            data.roadmap_progress
        )

        progress.learning_progress = (
            data.learning_progress
        )

        progress.practice_progress = (
            data.practice_progress
        )

        progress.overall_progress = (
            overall_progress
        )

    else:

        progress = Progress(
            user_id=data.user_id,
            career_goal=data.career_goal,
            roadmap_progress=data.roadmap_progress,
            learning_progress=data.learning_progress,
            practice_progress=data.practice_progress,
            overall_progress=overall_progress
        )

        db.add(progress)

    db.commit()
    db.refresh(progress)

    return {
        "success": True,
        "message": "Progress saved successfully",
        "data": {
            "id": progress.id,
            "user_id": progress.user_id,
            "career_goal": progress.career_goal,
            "roadmap_progress": progress.roadmap_progress,
            "learning_progress": progress.learning_progress,
            "practice_progress": progress.practice_progress,
            "overall_progress": progress.overall_progress
        }
    }


@router.get("/{user_id}")
def get_progress(
    user_id: int,
    db: Session = Depends(get_db)
):

    progress = (
        db.query(Progress)
        .filter(
            Progress.user_id == user_id
        )
        .first()
    )

    if not progress:
        return {
            "success": True,
            "message": "No progress found",
            "data": None
        }

    return {
        "success": True,
        "message": "Progress retrieved successfully",
        "data": {
            "id": progress.id,
            "user_id": progress.user_id,
            "career_goal": progress.career_goal,
            "roadmap_progress": progress.roadmap_progress,
            "learning_progress": progress.learning_progress,
            "practice_progress": progress.practice_progress,
            "overall_progress": progress.overall_progress
        }
    }