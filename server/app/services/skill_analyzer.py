import json

from app.services.ai_service import _call_ai


def normalize_skill(skill):
    return skill.strip().lower()


def analyze_skills(career_goal, technical_skills):
    """
    AI-powered skill analysis.

    User ke career goal aur skills ke basis par
    AI strong skills, skill gaps aur progress generate karta hai.
    """

    skills = [
        skill.strip()
        for skill in technical_skills
        if skill and skill.strip()
    ]

    prompt = f"""
You are an expert software engineering career mentor.

Analyze the learner's technical skills for their desired career.

Career Goal:
{career_goal}

Current Technical Skills:
{json.dumps(skills)}

Return ONLY valid JSON.

Use exactly this structure:

{{
    "career_goal": "{career_goal}",
    "strong_skills": [
        "skill that is relevant and already possessed"
    ],
    "skill_gaps": [
        "important skill that should be learned"
    ],
    "progress": 0,
    "analysis_summary": "Short explanation of the learner's current position"
}}

Requirements:

1. Use the user's actual career goal.
2. Do not assume a fixed career role.
3. Analyze the supplied skills dynamically.
4. Identify skills that are genuinely relevant to the career goal.
5. Put relevant existing skills in strong_skills.
6. Identify important missing skills in skill_gaps.
7. Progress must be an integer from 0 to 100.
8. Progress should reflect how well the current skills cover
   the skills normally expected for the requested career goal.
9. Do not use a fixed predefined skill list.
10. Do not invent skills that are unrelated to the career goal.
11. Return valid JSON only.
"""

    result = _call_ai(
        prompt=prompt,
        system_message=(
            "You are an adaptive career skill analyzer. "
            "Analyze each user's input dynamically. "
            "Never use a fixed predefined role list. "
            "Return only valid JSON."
        ),
        max_tokens=2500
    )

    if not isinstance(result, dict):
        raise ValueError("AI skill analysis is not a JSON object.")

    result["career_goal"] = career_goal

    result["strong_skills"] = result.get(
        "strong_skills",
        []
    )

    result["skill_gaps"] = result.get(
        "skill_gaps",
        []
    )

    try:
        result["progress"] = int(
            float(result.get("progress", 0))
        )
    except (ValueError, TypeError):
        result["progress"] = 0

    result["progress"] = max(
        0,
        min(100, result["progress"])
    )

    return result


def detect_company_roles(technical_skills):
    """
    AI-powered company/job-role matching.

    User ke skills ko dekh kar AI dynamically relevant
    company roles generate karta hai.
    """

    skills = [
        skill.strip()
        for skill in technical_skills
        if skill and skill.strip()
    ]

    prompt = f"""
You are an expert technical recruiter and career advisor.

Analyze these technical skills:

{json.dumps(skills)}

Identify the most relevant software/technology job roles
for this candidate.

IMPORTANT:
Do NOT use a fixed list of roles.
Generate roles dynamically based on the actual skills.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "roles": [
        {{
            "role": "Backend Developer",
            "match_percentage": 85,
            "matched_skills": [
                "Python",
                "SQL"
            ],
            "missing_skills": [
                "Docker",
                "System Design"
            ],
            "reason": "Short explanation of why this role matches"
        }}
    ]
}}

Requirements:

1. Generate 5 to 8 relevant job roles.
2. Roles must be based on the supplied skills.
3. Do not always return the same roles.
4. Match percentages must be between 0 and 100.
5. matched_skills must come from the user's supplied skills.
6. missing_skills should contain useful skills that would improve
   the candidate's suitability for that role.
7. Rank roles from highest match to lowest match.
8. Do not generate unrelated careers.
9. Return valid JSON only.
"""

    result = _call_ai(
        prompt=prompt,
        system_message=(
            "You are an AI-powered technical recruiter. "
            "Generate job roles dynamically from the user's skills. "
            "Never use a fixed role list. "
            "Return only valid JSON."
        ),
        max_tokens=3500
    )

    if not isinstance(result, dict):
        raise ValueError(
            "AI company role response is not a JSON object."
        )

    roles = result.get("roles", [])

    if not isinstance(roles, list):
        raise ValueError(
            "AI company role response contains an invalid roles list."
        )

    cleaned_roles = []

    for role in roles:

        if not isinstance(role, dict):
            continue

        role_name = str(
            role.get("role", "")
        ).strip()

        if not role_name:
            continue

        try:
            percentage = int(
                float(
                    role.get(
                        "match_percentage",
                        0
                    )
                )
            )
        except (ValueError, TypeError):
            percentage = 0

        percentage = max(
            0,
            min(100, percentage)
        )

        matched_skills = role.get(
            "matched_skills",
            []
        )

        missing_skills = role.get(
            "missing_skills",
            []
        )

        if not isinstance(matched_skills, list):
            matched_skills = []

        if not isinstance(missing_skills, list):
            missing_skills = []

        cleaned_roles.append({
            "role": role_name,
            "match_percentage": percentage,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "reason": str(
                role.get("reason", "")
            ).strip()
        })

    cleaned_roles.sort(
        key=lambda item: item["match_percentage"],
        reverse=True
    )

    return cleaned_roles