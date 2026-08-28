from sqlalchemy import Column, Integer, String, Text, ForeignKey

from app.database.database import Base


class Resume(Base):

    __tablename__ = "resumes"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
        index=True
    )

    filename = Column(
        String(255),
        nullable=False
    )

    file_type = Column(
        String(50),
        nullable=False
    )

    extracted_text = Column(
        Text,
        nullable=True
    )

    skills = Column(
        Text,
        nullable=True
    )

    experience = Column(
        Text,
        nullable=True
    )

    education = Column(
        Text,
        nullable=True
    )

    certifications = Column(
        Text,
        nullable=True
    )

    skill_gaps = Column(
        Text,
        nullable=True
    )