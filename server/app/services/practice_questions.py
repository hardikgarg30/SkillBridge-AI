from app.services.ai_service import _call_ai


def generate_practice_questions(
    career_goal,
    experience_level,
    skill_gaps,
    number_of_questions=10
):
    """
    Generate personalized practice questions using Hugging Face AI.
    """

    if number_of_questions < 1:
        number_of_questions = 10

    if number_of_questions > 20:
        number_of_questions = 20

    gaps = ", ".join(skill_gaps)

    prompt = f"""
You are an expert technical interviewer and coding mentor.

Generate personalized practice questions for a learner.

Career Goal:
{career_goal}

Experience Level:
{experience_level}

Current Skill Gaps:
{gaps}

Number of Questions:
{number_of_questions}

IMPORTANT:
The questions must be dynamically generated from the user's
career goal, experience level and actual skill gaps.

Do NOT use a fixed question bank.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "career_goal": "{career_goal}",
    "questions": [
        {{
            "id": 1,
            "question": "Question text",
            "skill": "Relevant skill",
            "difficulty": "Easy",
            "type": "Technical",
            "answer": "Clear correct answer or explanation"
        }}
    ]
}}

Requirements:

1. Generate exactly {number_of_questions} questions.
2. Focus mainly on the supplied skill gaps.
3. Adapt difficulty to the experience level.
4. Adapt questions to the career goal.
5. Mix conceptual and practical questions.
6. Include coding/problem-solving questions when appropriate.
7. Difficulty must be Easy, Medium, or Hard.
8. Type can be Technical, Coding, Database, System Design,
   Debugging, API, Security, or another relevant category.
9. Every question must be different.
10. Answers must directly answer the corresponding question.
11. Do not generate unrelated questions.
12. Do not assume a fixed set of skills.
13. Return valid JSON only.
"""

    result = _call_ai(
        prompt=prompt,
        system_message=(
            "You are an expert adaptive technical interviewer. "
            "Generate questions dynamically from the user's inputs. "
            "Return only valid JSON."
        ),
        max_tokens=5000
    )

    if not isinstance(result, dict):
        raise ValueError("AI response is not a JSON object.")

    questions = result.get("questions", [])

    if not isinstance(questions, list):
        raise ValueError("AI returned an invalid questions list.")

    if not questions:
        raise ValueError("AI returned no practice questions.")

    return result