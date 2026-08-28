from sqlalchemy import Column, Integer, String, Text
from app.database.database import Base


class Assessment(Base):

    __tablename__ = "assessments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        nullable=False,
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

    technical_skills = Column(
        Text,
        nullable=False
    )

    skill_gaps = Column(
        Text,
        nullable=False
    )

    strong_skills = Column(
        Text,
        nullable=False
    )
