import os
import json
import re

from dotenv import load_dotenv
from huggingface_hub import InferenceClient


# ============================================================
# ENVIRONMENT
# ============================================================

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")

MODEL_NAME = "meta-llama/Llama-3.1-8B-Instruct"

if not HF_API_KEY:
    raise ValueError(
        "HF_API_KEY is not set in the environment."
    )

client = InferenceClient(
    api_key=HF_API_KEY
)


# ============================================================
# JSON HELPER
# ============================================================

def _extract_json(text):
    """
    Extract JSON from Hugging Face response.

    Supports:
    - plain JSON
    - markdown JSON code fences
    - JSON embedded inside text
    """

    if not text:
        raise ValueError(
            "AI returned an empty response."
        )

    text = text.strip()

    # Remove markdown code fences
    text = re.sub(
        r"^```(?:json)?\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"\s*```$",
        "",
        text
    )

    text = text.strip()

    # Try direct JSON
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to extract object
    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1 and end > start:
        json_text = text[start:end + 1]

        try:
            return json.loads(json_text)
        except json.JSONDecodeError:
            pass

    raise ValueError(
        f"AI did not return valid JSON. Raw response: {text}"
    )


# ============================================================
# GENERIC AI CALL
# ============================================================

def _call_ai(
    prompt,
    system_message,
    max_tokens=3000
):
    """
    Centralized Hugging Face AI call.
    """

    response = client.chat.completions.create(
        model=MODEL_NAME,

        messages=[
            {
                "role": "system",
                "content": system_message
            },
            {
                "role": "user",
                "content": prompt
            }
        ],

        max_tokens=max_tokens,
        temperature=0.3
    )

    if not response.choices:
        raise ValueError(
            "AI returned no response."
        )

    content = (
        response.choices[0]
        .message
        .content
    )

    return _extract_json(content)


# ============================================================
# AI RESUME ANALYSIS
# ============================================================

def generate_resume_analysis(
    resume_text
):
    """
    Analyze the complete resume using AI.
    """

    prompt = f"""
You are an expert technical recruiter
and career mentor.

Analyze the following resume carefully.

RESUME:
{resume_text}

Understand the actual information present
in the resume.

Do not use a fixed predefined skill list.

Detect technical skills even if they are
uncommon or specialized.

Determine:

1. Technical skills actually mentioned.
2. Professional/relevant experience.
3. Education.
4. Certifications.
5. Important skill gaps.
6. Suitable job roles.
7. Short personalized professional summary.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "skills": [
        "skill 1",
        "skill 2"
    ],

    "experience": "experience description",

    "education": [
        "education 1",
        "education 2"
    ],

    "certifications": [
        "certification 1",
        "certification 2"
    ],

    "skill_gaps": [
        "skill gap 1",
        "skill gap 2"
    ],

    "recommended_roles": [
        "role 1",
        "role 2",
        "role 3"
    ],

    "summary": "Short personalized professional summary"
}}

IMPORTANT RULES:

- Use only information supported by the resume.
- Do not invent degrees.
- Do not invent certifications.
- Do not invent years of experience.
- Do not invent technical skills.
- Skills must be specific and useful.
- Skill gaps must be relevant.
- Recommended roles must be based on the resume.
- Return JSON only.
"""

    return _call_ai(
        prompt=prompt,

        system_message=(
            "You are an expert resume analyzer. "
            "Return only valid JSON."
        ),

        max_tokens=3500
    )


# ============================================================
# AI ROADMAP
# ============================================================

def generate_ai_roadmap(
    career_goal,
    experience_level,
    technical_skills,
    skill_gaps,
    mock_test_score=0,
    mock_test_total=0,
    mock_test_percentage=0
):
    """
    Generate a personalized AI career roadmap.

    Uses:
    - career goal
    - experience level
    - current skills
    - skill gaps
    - mock test performance
    """

    prompt = f"""
You are an expert software engineering
and career mentor.

Create a personalized AI career roadmap.

============================================================
USER PROFILE
============================================================

Career Goal:
{career_goal}

Experience Level:
{experience_level}

Current Technical Skills:
{technical_skills}

Identified Skill Gaps:
{skill_gaps}

============================================================
MOCK TEST PERFORMANCE
============================================================

Mock Test Score:
{mock_test_score} out of {mock_test_total}

Mock Test Percentage:
{mock_test_percentage}%

============================================================
IMPORTANT
============================================================

Use ALL of the information above.

The mock test performance MUST influence
the roadmap.

Low score:
- strengthen fundamentals
- add more practice
- slow progression

Medium score:
- balance fundamentals and intermediate topics

High score:
- progress faster toward advanced topics,
  projects and interview preparation

Do not ignore mock test performance.

Do not produce a generic roadmap.

The roadmap must reflect:

1. Career goal
2. Experience level
3. Current technical skills
4. Skill gaps
5. Mock test performance

============================================================
OUTPUT
============================================================

Return ONLY valid JSON.

Use exactly this structure:

{{
    "career_goal": "{career_goal}",

    "summary": "Short personalized summary explaining the learner's current position and roadmap direction.",

    "mock_test_analysis": {{
        "score": {mock_test_score},
        "total": {mock_test_total},
        "percentage": {mock_test_percentage},
        "readiness": "Beginner / Developing / Job Ready",
        "recommendation": "Short explanation of how mock test performance affects the roadmap."
    }},

    "phases": [
        {{
            "phase": 1,
            "title": "Phase title",
            "duration_weeks": 4,
            "priority": "High",
            "skills": [
                {{
                    "skill": "Skill name",
                    "topics": [
                        "Topic 1",
                        "Topic 2",
                        "Topic 3"
                    ]
                }}
            ],
            "project": "Practical project description"
        }}
    ],

    "interview_preparation": [
        "Interview preparation activity 1",
        "Interview preparation activity 2",
        "Interview preparation activity 3"
    ]
}}

============================================================
REQUIREMENTS
============================================================

1. Create 4 to 5 realistic phases.
2. Start from actual experience level.
3. Use mock score to control progression.
4. Focus mainly on actual skill gaps.
5. Use current skills as prerequisites.
6. Include practical projects.
7. Include interview preparation.
8. Adapt everything to career goal.
9. Do not invent unrelated skills.
10. Do not ignore mock test score.
11. Return JSON only.
"""

    return _call_ai(
        prompt=prompt,

        system_message=(
            "You are a personalized AI career roadmap "
            "generator. Analyze career goal, experience, "
            "skills, skill gaps and mock test performance. "
            "Return only valid JSON."
        ),

        max_tokens=4000
    )


# ============================================================
# AI LEARNING PLAN
# ============================================================

def generate_learning_plan(
    career_goal,
    experience_level,
    skill_gaps
):
    """
    Generate a personalized 7-day AI learning plan.
    """

    prompt = f"""
You are an expert software engineering
learning mentor.

Create a personalized 7-day learning plan.

Career Goal:
{career_goal}

Experience Level:
{experience_level}

Skill Gaps:
{skill_gaps}

Adapt the plan to the actual inputs.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "career_goal": "{career_goal}",
    "duration_days": 7,

    "daily_plan": [
        {{
            "day": 1,
            "title": "Day title",
            "skill": "Skill name",

            "topics": [
                "Topic 1",
                "Topic 2"
            ],

            "tasks": [
                "Task 1",
                "Task 2",
                "Task 3"
            ],

            "estimated_hours": 2
        }}
    ]
}}

Requirements:

1. Exactly 7 days.
2. Focus on actual skill gaps.
3. Adapt to experience level.
4. Adapt to career goal.
5. Include practical tasks.
6. Include coding/problem solving where appropriate.
7. Progress from fundamentals to advanced concepts.
8. Estimated hours normally between 1 and 4.
9. Do not use unrelated fixed topics.
10. Return valid JSON only.
"""

    return _call_ai(
        prompt=prompt,

        system_message=(
            "You are a personalized AI learning-plan "
            "generator. Return only valid JSON."
        ),

        max_tokens=3500
    )


# ============================================================
# AI MOCK TEST
# ============================================================

def generate_mock_test(
    career_goal,
    experience_level,
    technical_skills,
    skill_gaps
):
    """
    Generate a dynamic AI-powered mock test.

    The test is created from:
    - career goal
    - experience level
    - technical skills
    - skill gaps

    Exactly 10 validated MCQs are returned.
    """

    skills = [
        str(skill).strip()
        for skill in technical_skills
        if skill and str(skill).strip()
    ]

    gaps = [
        str(gap).strip()
        for gap in skill_gaps
        if gap and str(gap).strip()
    ]

    # ========================================================
    # PROMPT
    # ========================================================

    prompt = f"""
You are an expert career assessment designer.

Create a personalized mock test.

============================================================
CAREER
============================================================

Career Goal:
{career_goal}

Experience Level:
{experience_level}

Current Technical Skills:
{json.dumps(skills)}

Current Skill Gaps:
{json.dumps(gaps)}

============================================================
CORE RULE
============================================================

The mock test MUST be relevant to the
user's actual career goal and supplied skills.

Do NOT create the same generic computer
science test for every career.

Do NOT randomly include DSA questions.

Do NOT include unrelated topics.

Examples:

Sales Manager:
- CRM
- Salesforce
- lead generation
- sales pipeline
- negotiation
- sales strategy
- forecasting
- customer relationship
- account management
- sales analytics

Frontend Developer:
- JavaScript
- React
- HTML
- CSS
- browser concepts
- APIs
- frontend architecture

Backend Developer:
- Python
- Java
- Node.js
- APIs
- databases
- authentication
- backend architecture

Data Analyst:
- SQL
- Python
- Excel
- Power BI
- Pandas
- data cleaning
- dashboards
- statistics

These are examples only.

ALWAYS prioritize the actual user's
career goal and skills.

============================================================
TEST REQUIREMENTS
============================================================

Generate EXACTLY 10 questions.

Each question must contain:

- question
- exactly 4 options
- exactly 1 correct answer
- difficulty
- skill

Difficulty must be one of:

easy
medium
hard

Match difficulty to experience.

Beginner:
- mostly easy/medium
- limited hard

Intermediate:
- balanced difficulty

Advanced:
- more medium/hard

Questions should test actual understanding.

Avoid duplicates.

============================================================
OUTPUT FORMAT
============================================================

Return ONLY valid JSON.

No markdown.
No explanations outside JSON.

Use exactly:

{{
    "career_goal": "{career_goal}",

    "total_questions": 10,

    "questions": [
        {{
            "id": 1,

            "question": "Question text",

            "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
            ],

            "answer": "Correct option exactly as written",

            "difficulty": "medium",

            "skill": "Relevant skill"
        }}
    ]
}}

============================================================
STRICT RULES
============================================================

1. Exactly 10 questions.
2. Exactly 4 unique options per question.
3. Exactly 1 correct answer.
4. Answer must exactly match one option.
5. Career-specific questions.
6. Use actual supplied skills.
7. Target actual skill gaps where appropriate.
8. Do not invent unrelated skills.
9. Do not generate random DSA questions.
10. Do not generate unrelated career questions.
11. Do not repeat questions.
12. Do not repeat options inside a question.
13. Keep options plausible.
14. Difficulty must match experience.
15. Return JSON only.
"""

    # ========================================================
    # TRY TWICE
    # ========================================================

    last_error = None

    for attempt in range(2):

        try:

            result = _call_ai(
                prompt=prompt,

                system_message=(
                    "You are an adaptive AI mock test "
                    "generator. Generate career-specific "
                    "MCQs based only on the learner's "
                    "career goal, skills, experience "
                    "and skill gaps. Avoid unrelated "
                    "generic questions. Return only "
                    "valid JSON."
                ),

                max_tokens=5000
            )

            if not isinstance(
                result,
                dict
            ):
                raise ValueError(
                    "AI mock test response is not a JSON object."
                )

            questions = result.get(
                "questions",
                []
            )

            if not isinstance(
                questions,
                list
            ):
                raise ValueError(
                    "AI mock test questions are not a list."
                )

            cleaned_questions = []

            # =================================================
            # VALIDATE EVERY QUESTION
            # =================================================

            for item in questions:

                if not isinstance(
                    item,
                    dict
                ):
                    continue

                question_text = str(
                    item.get(
                        "question",
                        ""
                    )
                ).strip()

                options = item.get(
                    "options",
                    []
                )

                answer = str(
                    item.get(
                        "answer",
                        ""
                    )
                ).strip()

                difficulty = str(
                    item.get(
                        "difficulty",
                        "medium"
                    )
                ).strip().lower()

                skill = str(
                    item.get(
                        "skill",
                        ""
                    )
                ).strip()

                # Question must exist
                if not question_text:
                    continue

                # Options must be a list
                if not isinstance(
                    options,
                    list
                ):
                    continue

                # Clean options
                clean_options = []

                for option in options:

                    option_text = str(
                        option
                    ).strip()

                    if (
                        option_text
                        and option_text
                        not in clean_options
                    ):
                        clean_options.append(
                            option_text
                        )

                # Must have exactly four
                if len(clean_options) != 4:
                    continue

                # Answer must match option
                if answer not in clean_options:
                    continue

                # Normalize difficulty
                if difficulty not in {
                    "easy",
                    "medium",
                    "hard"
                }:
                    difficulty = "medium"

                # Fallback skill
                if not skill:
                    skill = (
                        skills[0]
                        if skills
                        else "General"
                    )

                cleaned_questions.append({
                    "id":
                        len(cleaned_questions) + 1,

                    "question":
                        question_text,

                    "options":
                        clean_options,

                    "answer":
                        answer,

                    "difficulty":
                        difficulty,

                    "skill":
                        skill
                })

            # =================================================
            # REQUIRE 10 VALID QUESTIONS
            # =================================================

            if len(cleaned_questions) < 10:
                raise ValueError(
                    f"AI generated only "
                    f"{len(cleaned_questions)} valid questions."
                )

            # Only first 10
            cleaned_questions = (
                cleaned_questions[:10]
            )

            return {
                "career_goal":
                    career_goal,

                "total_questions":
                    10,

                "questions":
                    cleaned_questions
            }

        except Exception as error:

            last_error = error

            print(
                f"Mock test generation attempt "
                f"{attempt + 1} failed:",
                str(error)
            )

            # =================================================
            # SECOND ATTEMPT
            # =================================================

            if attempt == 0:

                prompt = f"""
Generate EXACTLY 10 career-specific
multiple-choice questions.

Career Goal:
{career_goal}

Experience:
{experience_level}

Skills:
{json.dumps(skills)}

Skill Gaps:
{json.dumps(gaps)}

Rules:

- Only career-relevant questions.
- Use actual skills.
- Use skill gaps where useful.
- Do not ask unrelated DSA questions.
- Do not ask generic computer science questions.
- Exactly 10 questions.
- Exactly 4 options per question.
- Exactly 1 correct answer.
- Answer must exactly match one option.
- Difficulty must be easy, medium or hard.
- Match difficulty to experience.
- Return ONLY JSON.
- No markdown.
- No explanations.

Format:

{{
    "career_goal": "{career_goal}",
    "total_questions": 10,
    "questions": [
        {{
            "id": 1,
            "question": "question",
            "options": [
                "option 1",
                "option 2",
                "option 3",
                "option 4"
            ],
            "answer": "option 1",
            "difficulty": "medium",
            "skill": "skill"
        }}
    ]
}}
"""

    raise ValueError(
        "Unable to generate a valid AI mock test. "
        f"AI error: {last_error}"
    )


# ============================================================
# AI COMPANY ROLE DETECTION
# ============================================================

def detect_company_roles(
    technical_skills
):
    """
    AI-powered company/job-role matching.
    """

    skills = [
        skill.strip()
        for skill in technical_skills
        if skill and skill.strip()
    ]

    prompt = f"""
You are an expert technical recruiter
and career advisor.

Analyze these technical skills:

{json.dumps(skills)}

Identify the most relevant technology
job roles for this candidate.

Do NOT use a fixed role list.

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
2. Roles must be based on supplied skills.
3. Do not always return the same roles.
4. Match percentages between 0 and 100.
5. matched_skills must come from supplied skills.
6. missing_skills should be useful.
7. Rank roles from highest match to lowest.
8. Do not generate unrelated careers.
9. Return valid JSON only.
"""

    result = _call_ai(
        prompt=prompt,

        system_message=(
            "You are an AI-powered technical recruiter. "
            "Generate job roles dynamically from the user's "
            "skills. Never use a fixed role list. "
            "Return only valid JSON."
        ),

        max_tokens=3500
    )

    if not isinstance(
        result,
        dict
    ):
        raise ValueError(
            "AI company role response is not a JSON object."
        )

    roles = result.get(
        "roles",
        []
    )

    if not isinstance(
        roles,
        list
    ):
        raise ValueError(
            "AI company role response contains an invalid roles list."
        )

    cleaned_roles = []

    for role in roles:

        if not isinstance(
            role,
            dict
        ):
            continue

        role_name = str(
            role.get(
                "role",
                ""
            )
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
        except (
            ValueError,
            TypeError
        ):
            percentage = 0

        percentage = max(
            0,
            min(
                100,
                percentage
            )
        )

        matched_skills = role.get(
            "matched_skills",
            []
        )

        missing_skills = role.get(
            "missing_skills",
            []
        )

        if not isinstance(
            matched_skills,
            list
        ):
            matched_skills = []

        if not isinstance(
            missing_skills,
            list
        ):
            missing_skills = []

        cleaned_roles.append({
            "role":
                role_name,

            "match_percentage":
                percentage,

            "matched_skills":
                matched_skills,

            "missing_skills":
                missing_skills,

            "reason":
                str(
                    role.get(
                        "reason",
                        ""
                    )
                ).strip()
        })

    cleaned_roles.sort(
        key=lambda item:
            item["match_percentage"],

        reverse=True
    )

    return cleaned_roles