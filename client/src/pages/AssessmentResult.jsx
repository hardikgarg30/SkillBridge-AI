import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function AssessmentResult() {
  const navigate = useNavigate();

  const savedData = localStorage.getItem(
    "skillbridge_assessment"
  );

  const assessment = savedData
    ? JSON.parse(savedData)
    : null;

  const [generatingPlan, setGeneratingPlan] =
    useState(false);

  const [planError, setPlanError] =
    useState("");

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold">
            No Assessment Found
          </h1>

          <p className="mt-3 text-gray-400">
            Please complete your skill assessment first.
          </p>

          <Link
            to="/assessment"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    );
  }

  const analysis =
    assessment.skill_analysis || {};

  const generateLearningPlan = async () => {
    try {
      setGeneratingPlan(true);
      setPlanError("");

      const response = await fetch(
        `${API_URL}/api/learning-plan/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            career_goal:
              assessment.career_goal,

            experience_level:
              assessment.experience_level,

            skill_gaps:
              analysis.skill_gaps || [],
          }),
        }
      );

      const result =
        await response
          .json()
          .catch(() => null);

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.error ||
            result?.message ||
            result?.detail ||
            "Failed to generate learning plan"
        );
      }

      // Save latest learning plan locally
      localStorage.setItem(
        "skillbridge_learning_plan",
        JSON.stringify(
          result.data.learning_plan
        )
      );

      // Open Learning Plan page
      navigate("/learning-plan");
    } catch (error) {
      console.error(
        "Learning plan error:",
        error
      );

      setPlanError(
        error?.message ||
          "Unable to generate learning plan."
      );
    } finally {
      setGeneratingPlan(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}

      <nav className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

          <Link
            to="/"
            className="text-2xl font-bold"
          >
            SkillBridge AI
          </Link>

          <Link
            to="/dashboard"
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:bg-gray-900"
          >
            Dashboard
          </Link>

        </div>
      </nav>

      {/* Main */}

      <main className="mx-auto max-w-5xl px-6 py-12">

        <p className="text-sm text-gray-400">
          Assessment Results
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Your Skill Assessment
        </h1>

        <p className="mt-3 text-gray-400">
          We analyzed your current skills against the requirements
          for your selected career goal.
        </p>

        {/* Career Information */}

        <div className="mt-10 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Career Goal
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {assessment.career_goal}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Experience Level
            </p>

            <h2 className="mt-2 text-2xl font-semibold capitalize">
              {assessment.experience_level}
            </h2>
          </div>

        </div>

        {/* Progress */}

        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <p className="text-sm text-gray-400">
            Skill Readiness
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            {analysis.progress || 0}%
          </h2>

          <div className="mt-5 h-3 w-full rounded-full bg-gray-800">
            <div
              className="h-3 rounded-full bg-white"
              style={{
                width: `${analysis.progress || 0}%`,
              }}
            />
          </div>

        </div>

        {/* Strong Skills */}

        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <p className="text-sm text-gray-400">
            Your Strengths
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            Strong Skills
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">

            {(analysis.strong_skills || [])
              .length > 0 ? (
              analysis.strong_skills.map(
                (skill, index) => (
                  <span
                    key={index}
                    className="rounded-lg border border-gray-700 bg-gray-950 px-4 py-2 text-sm"
                  >
                    {skill}
                  </span>
                )
              )
            ) : (
              <p className="text-gray-400">
                No matching skills found.
              </p>
            )}

          </div>
        </div>

        {/* Skill Gaps */}

        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <p className="text-sm text-gray-400">
            Areas to Improve
          </p>

          <h2 className="mt-1 text-2xl font-semibold">
            Skill Gaps
          </h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">

            {(analysis.skill_gaps || [])
              .length > 0 ? (
              analysis.skill_gaps.map(
                (skill, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-800 bg-gray-950 px-4 py-3"
                  >
                    {skill}
                  </div>
                )
              )
            ) : (
              <p className="text-gray-400">
                No major skill gaps found.
              </p>
            )}

          </div>
        </div>

        {/* Learning Plan */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <h2 className="text-2xl font-bold">
            7-Day AI Learning Plan
          </h2>

          <p className="mt-2 text-gray-400">
            Generate a personalized 7-day learning plan
            based on your assessment results and skill gaps.
          </p>

          {planError && (
            <div className="mt-5 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300">
              {planError}
            </div>
          )}

          <button
            type="button"
            onClick={generateLearningPlan}
            disabled={generatingPlan}
            className="mt-6 rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generatingPlan
              ? "Generating Learning Plan..."
              : "Generate 7-Day Learning Plan"}
          </button>

        </div>

        {/* Actions */}

        <div className="mt-10 flex flex-wrap gap-4">

          <Link
            to="/roadmap"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
          >
            View AI Roadmap
          </Link>

          <Link
            to="/dashboard"
            className="rounded-lg border border-gray-700 px-6 py-3 font-semibold hover:bg-gray-900"
          >
            Go to Dashboard
          </Link>

          <Link
            to="/assessment"
            className="rounded-lg border border-gray-700 px-6 py-3 font-semibold hover:bg-gray-900"
          >
            Retake Assessment
          </Link>

        </div>

      </main>
    </div>
  );
}

export default AssessmentResult;