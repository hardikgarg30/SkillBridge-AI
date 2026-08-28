import { useState } from "react";
import { useNavigate } from "react-router-dom";

function PracticeQuestions() {
  const navigate = useNavigate();

  const [careerGoal, setCareerGoal] = useState("");
  const [experienceLevel, setExperienceLevel] =
    useState("");

  const [skillGaps, setSkillGaps] = useState("");

  const [questions, setQuestions] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [visibleAnswers, setVisibleAnswers] =
    useState({});

  const [completedQuestions, setCompletedQuestions] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "skillbridge_completed_practice_questions"
          ) || "[]"
        );
      } catch {
        return [];
      }
    });

  // ============================================================
  // GENERATE QUESTIONS
  // ============================================================

  const generateQuestions = async (event) => {
    event.preventDefault();

    setError("");
    setQuestions([]);
    setVisibleAnswers({});
    setLoading(true);

    const cleanCareerGoal =
      careerGoal.trim();

    const cleanExperience =
      experienceLevel.trim();

    const gaps = skillGaps
      .split(",")
      .map((skill) => skill.trim())
      .filter(
        (skill) => skill.length > 0
      );

    // ==========================================================
    // VALIDATION
    // ==========================================================

    if (!cleanCareerGoal) {
      setError(
        "Please enter a career goal."
      );

      setLoading(false);
      return;
    }

    if (!cleanExperience) {
      setError(
        "Please select your experience level."
      );

      setLoading(false);
      return;
    }

    if (gaps.length === 0) {
      setError(
        "Please enter at least one skill gap."
      );

      setLoading(false);
      return;
    }

    try {
      // ========================================================
      // API CALL
      // ========================================================

      const response = await fetch(
        "http://127.0.0.1:8000/api/practice-questions/",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            career_goal:
              cleanCareerGoal,

            experience_level:
              cleanExperience,

            skill_gaps:
              gaps,

            number_of_questions: 5,
          }),
        }
      );

      const result =
        await response.json();

      // ========================================================
      // RESPONSE VALIDATION
      // ========================================================

      if (!response.ok) {
        throw new Error(
          result?.message ||
            result?.detail ||
            "Failed to generate questions."
        );
      }

      if (!result?.success) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Unable to generate practice questions."
        );
      }

      const generatedQuestions =
        result?.data?.questions ||
        result?.questions ||
        [];

      setQuestions(
        generatedQuestions
      );

      if (
        generatedQuestions.length === 0
      ) {
        setError(
          "No questions were returned by the server."
        );
      }

    } catch (err) {
      console.error(
        "Practice Questions Error:",
        err
      );

      setError(
        err?.message ||
          "Unable to connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // TOGGLE ANSWER
  // ============================================================

  const toggleAnswer = (
    questionId
  ) => {
    setVisibleAnswers(
      (previous) => ({
        ...previous,

        [questionId]:
          !previous[questionId],
      })
    );
  };

  // ============================================================
  // TOGGLE COMPLETED
  // ============================================================

  const toggleCompleted = (
    questionId
  ) => {
    setCompletedQuestions(
      (previous) => {
        let updated;

        if (
          previous.includes(
            questionId
          )
        ) {
          updated =
            previous.filter(
              (id) =>
                id !== questionId
            );
        } else {
          updated = [
            ...previous,
            questionId,
          ];
        }

        localStorage.setItem(
          "skillbridge_completed_practice_questions",
          JSON.stringify(
            updated
          )
        );

        return updated;
      }
    );
  };

  // ============================================================
  // PROGRESS
  // ============================================================

  const completedCount =
    questions.filter(
      (question, index) => {
        const questionId =
          question.id ??
          index + 1;

        return completedQuestions.includes(
          questionId
        );
      }
    ).length;

  const practiceProgress =
    questions.length > 0
      ? Math.round(
          (completedCount /
            questions.length) *
            100
        )
      : 0;

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-5xl">

        {/* ==================================================
            BACK
        ================================================== */}

        <button
          type="button"
          onClick={() =>
            navigate("/dashboard")
          }
          className="mb-8 text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </button>

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="mb-10">

          <p className="text-sm text-gray-500">
            Personalized Practice
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Practice Questions
          </h1>

          <p className="mt-3 text-gray-400">
            Enter any career role, experience
            level and skill gaps to generate
            personalized practice questions.
          </p>

        </div>

        {/* ==================================================
            GENERATOR FORM
        ================================================== */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-7">

          <h2 className="text-xl font-semibold">
            Generate Practice Questions
          </h2>

          <form
            onSubmit={
              generateQuestions
            }
            className="mt-6 space-y-5"
          >

            {/* =================================================
                CAREER GOAL
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Career Goal
              </label>

              <input
                type="text"
                value={careerGoal}
                onChange={(event) =>
                  setCareerGoal(
                    event.target.value
                  )
                }
                placeholder="e.g. Cybersecurity Analyst, AI Product Manager, Sales Manager"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
              />

              <p className="mt-2 text-xs text-gray-500">
                Enter any career role you want
                to practice for.
              </p>

            </div>

            {/* =================================================
                EXPERIENCE
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Experience Level
              </label>

              <select
                value={experienceLevel}
                onChange={(event) =>
                  setExperienceLevel(
                    event.target.value
                  )
                }
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-gray-500"
              >

                <option value="">
                  Select Experience Level
                </option>

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>

              </select>

            </div>

            {/* =================================================
                SKILL GAPS
            ================================================= */}

            <div>

              <label className="mb-2 block text-sm text-gray-400">
                Skill Gaps
              </label>

              <input
                type="text"
                value={skillGaps}
                onChange={(event) =>
                  setSkillGaps(
                    event.target.value
                  )
                }
                placeholder="Example: SIEM, Threat Detection, Network Security"
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-gray-500"
              />

              <p className="mt-2 text-xs text-gray-500">
                Enter skill gaps separated by commas.
              </p>

            </div>

            {/* =================================================
                GENERATE
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Generating Questions..."
                : "Generate Practice Questions"}
            </button>

          </form>

        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-800 bg-red-950 p-5">

            <p className="text-red-300">
              {error}
            </p>

          </div>
        )}

        {/* ==================================================
            PRACTICE PROFILE
        ================================================== */}

        {questions.length > 0 && (

          <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <p className="text-sm text-gray-400">
              Practice Profile
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-2">

              {/* Career */}

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Career Goal
                </p>

                <p className="mt-1 font-semibold">
                  {careerGoal}
                </p>

              </div>

              {/* Experience */}

              <div className="rounded-xl border border-gray-800 bg-gray-950 p-4">

                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Experience Level
                </p>

                <p className="mt-1 font-semibold">
                  {experienceLevel}
                </p>

              </div>

            </div>

            {/* Skill Gaps */}

            <div className="mt-4 rounded-xl border border-gray-800 bg-gray-950 p-4">

              <p className="text-xs uppercase tracking-wide text-gray-500">
                Skill Gaps
              </p>

              <div className="mt-3 flex flex-wrap gap-2">

                {skillGaps
                  .split(",")
                  .map(
                    (gap, index) => {

                      const cleanGap =
                        gap.trim();

                      if (
                        !cleanGap
                      ) {
                        return null;
                      }

                      return (
                        <span
                          key={`${cleanGap}-${index}`}
                          className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300"
                        >
                          {cleanGap}
                        </span>
                      );
                    }
                  )}

              </div>

            </div>

          </div>
        )}

        {/* ==================================================
            PROGRESS
        ================================================== */}

        {questions.length > 0 && (

          <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>

                <p className="text-sm text-gray-400">
                  Practice Progress
                </p>

                <h2 className="mt-1 text-3xl font-bold">
                  {practiceProgress}%
                </h2>

              </div>

              <div className="text-sm text-gray-400">
                {completedCount} /{" "}
                {questions.length}{" "}
                completed
              </div>

            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-800">

              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{
                  width: `${practiceProgress}%`,
                }}
              />

            </div>

          </div>
        )}

        {/* ==================================================
            QUESTIONS
        ================================================== */}

        {questions.length > 0 && (

          <div className="mt-8 space-y-6">

            {questions.map(
              (
                question,
                index
              ) => {

                const questionId =
                  question.id ??
                  index + 1;

                const isCompleted =
                  completedQuestions.includes(
                    questionId
                  );

                const isAnswerVisible =
                  visibleAnswers[
                    questionId
                  ];

                return (
                  <div
                    key={questionId}
                    className={`rounded-2xl border p-7 transition ${
                      isCompleted
                        ? "border-gray-600 bg-gray-900"
                        : "border-gray-800 bg-gray-900"
                    }`}
                  >

                    {/* Question */}

                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                      <div className="flex-1">

                        <p className="text-sm text-gray-500">
                          Question{" "}
                          {index + 1}
                        </p>

                        <h2 className="mt-2 text-xl font-semibold leading-relaxed">
                          {question.question}
                        </h2>

                      </div>

                      {isCompleted && (
                        <span className="rounded-full border border-gray-600 px-3 py-1 text-xs text-gray-300">
                          Completed
                        </span>
                      )}

                    </div>

                    {/* Metadata */}

                    <div className="mt-5 flex flex-wrap gap-3">

                      {question.skill && (
                        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
                          Skill:{" "}
                          {question.skill}
                        </span>
                      )}

                      {question.difficulty && (
                        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
                          Difficulty:{" "}
                          {question.difficulty}
                        </span>
                      )}

                      {question.type && (
                        <span className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-300">
                          Type:{" "}
                          {question.type}
                        </span>
                      )}

                    </div>

                    {/* Answer */}

                    {isAnswerVisible && (
                      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-5">

                        <p className="mb-2 text-sm font-semibold text-gray-400">
                          Answer / Explanation
                        </p>

                        <p className="whitespace-pre-line leading-relaxed text-gray-300">
                          {question.answer ||
                            "No answer provided."}
                        </p>

                      </div>
                    )}

                    {/* Actions */}

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">

                      <button
                        type="button"
                        onClick={() =>
                          toggleAnswer(
                            questionId
                          )
                        }
                        className="rounded-lg border border-gray-700 px-5 py-3 text-sm font-semibold transition hover:bg-gray-800"
                      >
                        {isAnswerVisible
                          ? "Hide Answer"
                          : "Show Answer"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          toggleCompleted(
                            questionId
                          )
                        }
                        className="rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-200"
                      >
                        {isCompleted
                          ? "Mark as Incomplete"
                          : "Mark as Completed"}
                      </button>

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

        {/* ==================================================
            EMPTY STATE
        ================================================== */}

        {!loading &&
          questions.length === 0 &&
          !error && (

            <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">

              <h2 className="text-xl font-semibold">
                Ready to Practice?
              </h2>

              <p className="mt-2 text-gray-400">
                Enter any career goal and your
                current skill gaps above, then
                generate personalized questions.
              </p>

            </div>
          )}

        {/* ==================================================
            PROGRESS BUTTON
        ================================================== */}

        {questions.length > 0 && (

          <div className="mt-8 flex justify-center">

            <button
              type="button"
              onClick={() =>
                navigate("/progress")
              }
              className="rounded-lg border border-gray-700 px-6 py-3 font-semibold transition hover:bg-gray-800"
            >
              View Overall Progress
            </button>

          </div>
        )}

      </div>

    </div>
  );
}

export default PracticeQuestions;