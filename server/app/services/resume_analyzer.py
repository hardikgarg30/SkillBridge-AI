import json
import re

from app.services.ai_service import generate_resume_analysis


def analyze_resume(text: str):
    """
    Analyze resume using Hugging Face AI.
    """

    if not text or not text.strip():
        raise ValueError("Resume text is empty.")

    analysis = generate_resume_analysis(text)

    # Safety defaults
    if not isinstance(analysis, dict):
        raise ValueError("AI returned an invalid resume analysis.")

    return {
        "skills": analysis.get("skills", []),
        "experience": analysis.get(
            "experience",
            "Not detected"
        ),
        "education": analysis.get(
            "education",
            []
        ),
        "certifications": analysis.get(
            "certifications",
            []
        ),
        "skill_gaps": analysis.get(
            "skill_gaps",
            []
        ),
        "summary": analysis.get(
            "summary",
            ""
        ),
        "recommended_roles": analysis.get(
            "recommended_roles",
            []
        )
    }