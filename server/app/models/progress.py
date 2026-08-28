from sqlalchemy import Column, Integer, String, Float
from app.database.database import Base


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, nullable=False, index=True)

    career_goal = Column(String, nullable=False)

    roadmap_progress = Column(Float, default=0)
    learning_progress = Column(Float, default=0)
    practice_progress = Column(Float, default=0)

    overall_progress = Column(Float, default=0)