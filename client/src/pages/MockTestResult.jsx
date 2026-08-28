import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { generateRoadmap } from "../services/roadmapService";

function MockTestResult() {
  const navigate = useNavigate();

  const savedResult = localStorage.getItem(
    "skillbridge_mock_test_result"
  );

  const result = savedResult
    ? JSON.parse(savedResult)
    : null;

  const [generatingRoadmap, setGeneratingRoadmap] =
    useState(false);

  const [roadmapError, setRoadmapError] =
    useState("");

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="text-center">

          <h1 className="text-3xl font-bold">
            No Mock Test Result Found
          </h1>

          <p className="mt-3 text-gray-400">
            Please complete the mock test first.
          </p>

          <Link
            to="/assessment"
            className="mt-6 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
          >
            Start Assessment
          </Link>

        </div>
      </div>
    );
  }

  const percentage = Number(
    result.percentage || 0
  );

  let performance = "Needs Improvement";

  if (percentage >= 80) {
    performance = "Excellent";
  } else if (percentage >= 60) {
    performance = "Good";
  } else if (percentage >= 40) {
    performance = "Average";
  }

  // =========================================================
  // GENERATE NEW AI ROADMAP
  // =========================================================

  const handleGenerateRoadmap = async () => {
    try {
      setGeneratingRoadmap(true);
      setRoadmapError("");

      // ------------------------------------------------------
      // Get saved assessment
      // ------------------------------------------------------

      const savedAssessment =
        localStorage.getItem(
          "skillbridge_assessment"
        );

      if (!savedAssessment) {
        throw new Error(
          "Assessment data not found. Please complete the assessment again."
        );
      }

      const assessment =
        JSON.parse(savedAssessment);

      // ------------------------------------------------------
      // Current skills
      // ------------------------------------------------------

      const technicalSkills =
        Array.isArray(
          assessment?.technical_skills
        )
          ? assessment.technical_skills
          : Array.isArray(
              result?.technical_skills
            )
          ? result.technical_skills
          : [];

      // ------------------------------------------------------
      // Current skill gaps
      // ------------------------------------------------------

      const skillGaps =
        Array.isArray(
          assessment?.skill_analysis?.skill_gaps
        )
          ? assessment.skill_analysis.skill_gaps
          : [];

      // ------------------------------------------------------
      // Career information
      // ------------------------------------------------------

      const careerGoal =
        assessment?.career_goal ||
        result?.career_goal ||
        "";

      const experienceLevel =
        assessment?.experience_level ||
        result?.experience_level ||
        "";

      if (!careerGoal) {
        throw new Error(
          "Career goal is missing. Please complete the assessment again."
        );
      }

      if (!experienceLevel) {
        throw new Error(
          "Experience level is missing. Please complete the assessment again."
        );
      }

      // ------------------------------------------------------
      // Mock Test information
      // ------------------------------------------------------

      const mockTestScore =
        Number(result?.score || 0);

      const mockTestTotal =
        Number(result?.total || 0);

      const mockTestPercentage =
        Number(result?.percentage || 0);

      // ------------------------------------------------------
      // Final AI roadmap request
      // ------------------------------------------------------

      const roadmapRequest = {
        career_goal: careerGoal,

        experience_level: experienceLevel,

        technical_skills: technicalSkills,

        skill_gaps: skillGaps,

        mock_test_score: mockTestScore,

        mock_test_total: mockTestTotal,

        mock_test_percentage: mockTestPercentage,
      };

      console.log(
        "Generating NEW AI roadmap:",
        roadmapRequest
      );

      // ------------------------------------------------------
      // Call backend
      // ------------------------------------------------------

      const response =
        await generateRoadmap(
          roadmapRequest
        );

      console.log(
        "NEW AI roadmap response:",
        response
      );

      if (
        !response?.success ||
        !response?.data?.roadmap
      ) {
        throw new Error(
          response?.message ||
            response?.error ||
            "AI roadmap generation failed."
        );
      }

      // ------------------------------------------------------
      // Save fresh roadmap locally
      // ------------------------------------------------------

      const roadmapData =
        response.data.roadmap;

      localStorage.setItem(
        "skillbridge_current_roadmap",
        JSON.stringify(
          roadmapData
        )
      );

      // Also keep standard roadmap key
      localStorage.setItem(
        "skillbridge_roadmap",
        JSON.stringify(
          roadmapData
        )
      );

      // ------------------------------------------------------
      // Save latest learning plan returned by backend
      // ------------------------------------------------------

      if (
        response?.data?.learning_plan
      ) {
        localStorage.setItem(
          "skillbridge_learning_plan",
          JSON.stringify(
            response.data.learning_plan.learning_plan
          )
        );
      }

      // ------------------------------------------------------
      // Save roadmap generation metadata
      // ------------------------------------------------------

      localStorage.setItem(
        "skillbridge_roadmap_meta",
        JSON.stringify({
          id: roadmapData.id,

          career_goal:
            roadmapData.career_goal,

          experience_level:
            roadmapData.experience_level,

          mock_test_score:
            mockTestScore,

          mock_test_total:
            mockTestTotal,

          mock_test_percentage:
            mockTestPercentage,

          generated_at:
            new Date().toISOString(),
        })
      );

      // ------------------------------------------------------
      // Open roadmap
      // ------------------------------------------------------

      navigate("/roadmap");

    } catch (error) {
      console.error(
        "AI roadmap generation failed:",
        error
      );

      setRoadmapError(
        error?.message ||
          "Unable to generate AI roadmap."
      );
    } finally {
      setGeneratingRoadmap(false);
    }
  };

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

          <Link
            to="/dashboard"
            className="rounded-lg border border-gray-700 px-4 py-2 text-sm hover:bg-gray-900"
          >
            Dashboard
          </Link>

        </div>

      </nav>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-6 py-12">

        {/* Header */}
        <div className="text-center">

          <p className="text-sm text-gray-400">
            Step 3 of your SkillBridge journey
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Mock Test Result
          </h1>

          <p className="mt-3 text-gray-400">
            Your technical knowledge has been evaluated.
          </p>

        </div>

        {/* Career */}
        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <p className="text-sm text-gray-400">
            Career Goal
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            {result.career_goal ||
              "Not specified"}
          </h2>

        </div>

        {/* Score */}
        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">

          <p className="text-sm text-gray-400">
            Your Score
          </p>

          <h2 className="mt-3 text-6xl font-bold">
            {percentage}%
          </h2>

          <p className="mt-3 text-gray-400">
            {result.score} out of{" "}
            {result.total} questions correct
          </p>

          <div className="mx-auto mt-6 h-3 max-w-xl overflow-hidden rounded-full bg-gray-800">

            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{
                width: `${percentage}%`,
              }}
            />

          </div>

        </div>

        {/* Performance */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <p className="text-sm text-gray-400">
              Performance
            </p>

            <h2 className="mt-2 text-2xl font-semibold">
              {performance}
            </h2>

          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <p className="text-sm text-gray-400">
              Experience Level
            </p>

            <h2 className="mt-2 text-2xl font-semibold capitalize">
              {result.experience_level ||
                "Not specified"}
            </h2>

          </div>

        </div>

        {/* Roadmap Generation */}
        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-8">

          <p className="text-sm text-gray-400">
            Next Step
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Generate Your AI Career Roadmap
          </h2>

          <p className="mt-3 text-gray-400">
            SkillBridge AI will use your current skills,
            skill gaps, experience level, career goal and
            mock test performance to generate a fresh
            personalized roadmap.
          </p>

          {roadmapError && (
            <div className="mt-5 rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {roadmapError}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4">

            <button
              type="button"
              onClick={handleGenerateRoadmap}
              disabled={generatingRoadmap}
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingRoadmap
                ? "Generating AI Roadmap..."
                : "Generate AI Career Roadmap"}
            </button>

            <Link
              to="/dashboard"
              className="rounded-lg border border-gray-700 px-6 py-3 font-semibold hover:bg-gray-800"
            >
              Go to Dashboard
            </Link>

          </div>

        </div>

      </main>

    </div>
  );
}

export default MockTestResult;