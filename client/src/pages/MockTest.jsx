import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { generateMockTest } from "../services/assessmentService";

function MockTest() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [answers, setAnswers] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] = useState("");

  const [mockInfo, setMockInfo] = useState({
    career_goal: "",
    experience_level: "",
    technical_skills: [],
    skill_gaps: [],
  });

  // ============================================================
  // LOAD ASSESSMENT + GENERATE AI TEST
  // ============================================================

  useEffect(() => {
    const loadMockTest = async () => {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------------
        // Get assessment
        // ------------------------------------------------------

        const savedAssessment =
          localStorage.getItem(
            "skillbridge_assessment"
          );

        if (!savedAssessment) {
          throw new Error(
            "Please complete the skill assessment first."
          );
        }

        const assessment =
          JSON.parse(savedAssessment);

        // ------------------------------------------------------
        // Extract data
        // ------------------------------------------------------

        const careerGoal =
          assessment?.career_goal || "";

        const experienceLevel =
          assessment?.experience_level || "";

        const technicalSkills =
          Array.isArray(
            assessment?.technical_skills
          )
            ? assessment.technical_skills
            : [];

        const skillGaps =
          Array.isArray(
            assessment?.skill_analysis?.skill_gaps
          )
            ? assessment.skill_analysis.skill_gaps
            : [];

        if (!careerGoal) {
          throw new Error(
            "Career goal is missing from assessment."
          );
        }

        if (!experienceLevel) {
          throw new Error(
            "Experience level is missing from assessment."
          );
        }

        if (
          technicalSkills.length === 0
        ) {
          throw new Error(
            "No technical skills were found in the assessment."
          );
        }

        // ------------------------------------------------------
        // Save mock info
        // ------------------------------------------------------

        const info = {
          career_goal: careerGoal,
          experience_level:
            experienceLevel,
          technical_skills:
            technicalSkills,
          skill_gaps: skillGaps,
        };

        setMockInfo(info);

        localStorage.setItem(
          "skillbridge_mock_test_info",
          JSON.stringify(info)
        );

        // ------------------------------------------------------
        // Generate AI Mock Test
        // ------------------------------------------------------

        const result =
          await generateMockTest({
            career_goal:
              careerGoal,

            experience_level:
              experienceLevel,

            technical_skills:
              technicalSkills,

            skill_gaps:
              skillGaps,
          });

        console.log(
          "AI Mock Test response:",
          result
        );

        const generatedQuestions =
          result?.data?.questions || [];

        if (
          !Array.isArray(
            generatedQuestions
          ) ||
          generatedQuestions.length === 0
        ) {
          throw new Error(
            "AI did not generate any mock test questions."
          );
        }

        setQuestions(
          generatedQuestions
        );

      } catch (err) {
        console.error(
          "Mock test generation error:",
          err
        );

        setError(
          err?.message ||
            "Unable to generate AI mock test."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMockTest();
  }, []);

  // ============================================================
  // SELECT ANSWER
  // ============================================================

  const handleAnswer = (answer) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]:
        answer,
    }));

    setError("");
  };

  // ============================================================
  // NEXT
  // ============================================================

  const handleNext = () => {
    if (
      answers[currentQuestion] ===
      undefined
    ) {
      setError(
        "Please select an answer before continuing."
      );

      return;
    }

    setError("");

    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      );
    }
  };

  // ============================================================
  // PREVIOUS
  // ============================================================

  const handlePrevious = () => {
    setError("");

    if (
      currentQuestion > 0
    ) {
      setCurrentQuestion(
        (previous) =>
          previous - 1
      );
    }
  };

  // ============================================================
  // SUBMIT TEST
  // ============================================================

  const handleSubmit = async () => {
    if (
      answers[currentQuestion] ===
      undefined
    ) {
      setError(
        "Please select an answer before submitting."
      );

      return;
    }

    if (
      Object.keys(answers).length !==
      questions.length
    ) {
      setError(
        "Please answer all questions before submitting the mock test."
      );

      return;
    }

    try {
      setSubmitting(true);
      setError("");

      let score = 0;

      questions.forEach(
        (question, index) => {
          if (
            answers[index] ===
            question.answer
          ) {
            score++;
          }
        }
      );

      const total =
        questions.length;

      const percentage =
        Math.round(
          (score / total) *
            100
        );

      const result = {
        score,
        total,
        percentage,

        career_goal:
          mockInfo.career_goal,

        experience_level:
          mockInfo.experience_level,

        technical_skills:
          mockInfo.technical_skills,

        skill_gaps:
          mockInfo.skill_gaps,

        completed_at:
          new Date().toISOString(),
      };

      localStorage.setItem(
        "skillbridge_mock_test_result",
        JSON.stringify(result)
      );

      console.log(
        "Mock Test Result:",
        result
      );

      navigate(
        "/mock-test-result"
      );

    } catch (err) {
      console.error(
        "Failed to submit mock test:",
        err
      );

      setError(
        "Unable to submit mock test."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">

        <div className="text-center">

          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-white" />

          <p className="text-xl font-semibold">
            Generating Your AI Mock Test...
          </p>

          <p className="mt-2 text-sm text-gray-400">
            Questions are being created based on
            your career goal, skills and skill gaps.
          </p>

        </div>

      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error && questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">

        <div className="max-w-lg text-center">

          <h1 className="text-3xl font-bold">
            Unable to Generate Mock Test
          </h1>

          <p className="mt-4 text-red-400">
            {error}
          </p>

          <Link
            to="/assessment"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
          >
            Retake Assessment
          </Link>

        </div>

      </div>
    );
  }

  const question =
    questions[currentQuestion];

  const selectedAnswer =
    answers[currentQuestion];

  const progressPercentage =
    Math.round(
      ((currentQuestion + 1) /
        questions.length) *
        100
    );

  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}

      <nav className="border-b border-gray-800 bg-gray-950">

        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

          <Link
            to="/dashboard"
            className="text-2xl font-bold"
          >
            SkillBridge AI
          </Link>

          <span className="text-sm text-gray-400">
            AI Technical Mock Test
          </span>

        </div>

      </nav>

      {/* Main */}

      <main className="mx-auto max-w-3xl px-6 py-10">

        {/* Header */}

        <div className="mb-8">

          <p className="text-sm text-gray-400">
            Step 2 of your SkillBridge journey
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            AI Mock Test
          </h1>

          <p className="mt-3 text-gray-400">
            These questions were generated specifically
            for your career goal, experience level,
            technical skills and skill gaps.
          </p>

        </div>

        {/* Profile Info */}

        <div className="mb-6 rounded-2xl border border-gray-800 bg-gray-900 p-5">

          <div className="grid gap-4 sm:grid-cols-2">

            <div>

              <p className="text-sm text-gray-400">
                Career Goal
              </p>

              <p className="mt-1 font-semibold">
                {mockInfo.career_goal}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-400">
                Experience
              </p>

              <p className="mt-1 font-semibold capitalize">
                {mockInfo.experience_level}
              </p>

            </div>

          </div>

          {mockInfo.technical_skills.length >
            0 && (
            <div className="mt-4">

              <p className="text-sm text-gray-400">
                Skills Used For Test
              </p>

              <div className="mt-2 flex flex-wrap gap-2">

                {mockInfo.technical_skills.map(
                  (skill, index) => (
                    <span
                      key={`${skill}-${index}`}
                      className="rounded-full border border-gray-700 bg-gray-950 px-3 py-1 text-xs text-gray-300"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            </div>
          )}

        </div>

        {/* Progress */}

        <div className="mb-6">

          <div className="flex justify-between text-sm text-gray-400">

            <span>
              Question{" "}
              {currentQuestion + 1} of{" "}
              {questions.length}
            </span>

            <span>
              {progressPercentage}%
            </span>

          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-800">

            <div
              className="h-full bg-white transition-all duration-300"
              style={{
                width: `${progressPercentage}%`,
              }}
            />

          </div>

        </div>

        {/* Question */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">

          <div className="flex flex-wrap items-center gap-2">

            <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400">
              {question.skill ||
                "General"}
            </span>

            <span className="rounded-full border border-gray-700 px-3 py-1 text-xs capitalize text-gray-400">
              {question.difficulty ||
                "medium"}
            </span>

          </div>

          <h2 className="mt-5 text-2xl font-semibold leading-relaxed">
            {question.question}
          </h2>

          <div className="mt-8 space-y-4">

            {question.options.map(
              (option, index) => {

                const selected =
                  selectedAnswer ===
                  option;

                return (
                  <button
                    key={`${option}-${index}`}
                    type="button"
                    onClick={() =>
                      handleAnswer(option)
                    }
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-white bg-gray-800"
                        : "border-gray-700 bg-gray-950 hover:bg-gray-800"
                    }`}
                  >

                    <span
                      className={`mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                        selected
                          ? "bg-white text-black"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {String.fromCharCode(
                        65 + index
                      )}
                    </span>

                    {option}

                  </button>
                );
              }
            )}

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="mt-5 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Navigation */}

        <div className="mt-6 flex items-center justify-between">

          <button
            type="button"
            onClick={
              handlePrevious
            }
            disabled={
              currentQuestion ===
              0
            }
            className="rounded-lg border border-gray-700 px-5 py-3 font-semibold transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {currentQuestion <
          questions.length - 1 ? (

            <button
              type="button"
              onClick={
                handleNext
              }
              disabled={
                selectedAnswer ===
                undefined
              }
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          ) : (

            <button
              type="button"
              onClick={
                handleSubmit
              }
              disabled={
                submitting ||
                selectedAnswer ===
                  undefined ||
                Object.keys(
                  answers
                ).length !==
                  questions.length
              }
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Submitting..."
                : "Submit Mock Test"}
            </button>

          )}

        </div>

        {/* Question Navigator */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-5">

          <p className="text-sm text-gray-400">
            Test Progress
          </p>

          <div className="mt-4 flex flex-wrap gap-2">

            {questions.map(
              (_, index) => {

                const answered =
                  answers[index] !==
                  undefined;

                const active =
                  index ===
                  currentQuestion;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setCurrentQuestion(
                        index
                      );

                      setError("");
                    }}
                    className={`h-10 w-10 rounded-lg border text-sm font-semibold transition ${
                      active
                        ? "border-white bg-white text-black"
                        : answered
                        ? "border-gray-500 bg-gray-800 text-white"
                        : "border-gray-700 bg-gray-950 text-gray-400 hover:bg-gray-800"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              }
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default MockTest;