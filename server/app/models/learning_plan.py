from sqlalchemy import Column, Integer, String, Text
from app.database.database import Base


class LearningPlan(Base):

    __tablename__ = "learning_plans"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    career_goal = Column(
        String,
        nullable=False
    )

    experience_level = Column(
        String,
        nullable=False
    )

    skill_gaps = Column(
        Text,
        nullable=False
    )

    plan_data = Column(
        Text,
        nullable=False
    )
