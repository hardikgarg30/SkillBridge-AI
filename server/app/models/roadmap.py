from sqlalchemy import Column, Integer, String, Text

from app.database.database import Base


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    career_goal = Column(
        String(255),
        nullable=False
    )

    experience_level = Column(
        String(100),
        nullable=False
    )

    roadmap_data = Column(
        Text,
        nullable=False
    )