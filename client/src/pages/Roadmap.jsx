import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { generateLearningPlan } from "../services/learningPlanService";
import { generateRoadmap } from "../services/roadmapService";

function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [careerGoal, setCareerGoal] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");

  const [loading, setLoading] = useState(true);
  const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
  const [error, setError] = useState("");

  // Learning Plan states
  const [generatingLearningPlan, setGeneratingLearningPlan] =
    useState(false);

  const [learningPlanMessage, setLearningPlanMessage] =
    useState("");

  // Completed roadmap topics
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "skillbridge_completed_topics"
      );

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // ============================================================
  // LOAD CURRENT ROADMAP
  // ============================================================

  useEffect(() => {
    const loadRoadmap = () => {
      try {
        setLoading(true);
        setError("");

        // ------------------------------------------------------
        // First preference: latest roadmap generated for
        // current assessment/mock-test flow
        // ------------------------------------------------------

        const savedCurrentRoadmap =
          localStorage.getItem(
            "skillbridge_current_roadmap"
          );

        if (savedCurrentRoadmap) {
          const parsedRoadmap =
            JSON.parse(savedCurrentRoadmap);

          if (parsedRoadmap?.roadmap) {
            setRoadmap(parsedRoadmap.roadmap);

            setCareerGoal(
              parsedRoadmap.career_goal || ""
            );

            setExperienceLevel(
              parsedRoadmap.experience_level || ""
            );

            setLoading(false);
            return;
          }
        }

        // ------------------------------------------------------
        // Fallback: old saved roadmap
        // ------------------------------------------------------

        const savedRoadmap =
          localStorage.getItem(
            "skillbridge_roadmap"
          );

        if (savedRoadmap) {
          const parsedRoadmap =
            JSON.parse(savedRoadmap);

          if (parsedRoadmap?.roadmap) {
            setRoadmap(parsedRoadmap.roadmap);

            setCareerGoal(
              parsedRoadmap.career_goal || ""
            );

            setExperienceLevel(
              parsedRoadmap.experience_level || ""
            );

            setLoading(false);
            return;
          }
        }

        setError(
          "No current AI roadmap found. Please generate your roadmap from the mock test result."
        );
      } catch (err) {
        console.error(
          "Failed to load saved roadmap:",
          err
        );

        setError(
          "Saved roadmap data could not be loaded."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRoadmap();
  }, []);

  // ============================================================
  // GENERATE NEW AI ROADMAP
  // ============================================================

  const handleGenerateRoadmap = async () => {
    try {
      setGeneratingRoadmap(true);
      setError("");

      // ------------------------------------------------------
      // Assessment
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
      // Mock Test
      // ------------------------------------------------------

      const savedMockResult =
        localStorage.getItem(
          "skillbridge_mock_test_result"
        );

      if (!savedMockResult) {
        throw new Error(
          "Please complete the mock test first."
        );
      }

      const mockResult =
        JSON.parse(savedMockResult);

      // ------------------------------------------------------
      // Current assessment data
      // ------------------------------------------------------

      const currentCareerGoal =
        assessment?.career_goal ||
        mockResult?.career_goal ||
        "";

      const currentExperienceLevel =
        assessment?.experience_level ||
        mockResult?.experience_level ||
        "";

      const technicalSkills =
        Array.isArray(
          assessment?.technical_skills
        )
          ? assessment.technical_skills
          : Array.isArray(
              mockResult?.technical_skills
            )
          ? mockResult.technical_skills
          : [];

      const skillGaps =
        assessment?.skill_analysis
          ?.skill_gaps || [];

      // ------------------------------------------------------
      // Validate
      // ------------------------------------------------------

      if (!currentCareerGoal) {
        throw new Error(
          "Career goal is missing. Please complete the assessment again."
        );
      }

      if (!currentExperienceLevel) {
        throw new Error(
          "Experience level is missing. Please complete the assessment again."
        );
      }

      // ------------------------------------------------------
      // Mock score
      // ------------------------------------------------------

      const mockTestScore =
        Number(mockResult?.score || 0);

      const mockTestTotal =
        Number(mockResult?.total || 0);

      const mockTestPercentage =
        Number(
          mockResult?.percentage || 0
        );

      // ------------------------------------------------------
      // Generate NEW AI roadmap
      // ------------------------------------------------------

      console.log(
        "Generating NEW AI roadmap with:",
        {
          career_goal: currentCareerGoal,
          experience_level:
            currentExperienceLevel,
          technical_skills: technicalSkills,
          skill_gaps: skillGaps,
          mock_test_score:
            mockTestScore,
          mock_test_total:
            mockTestTotal,
          mock_test_percentage:
            mockTestPercentage,
        }
      );

      const result =
        await generateRoadmap({
          career_goal:
            currentCareerGoal,

          experience_level:
            currentExperienceLevel,

          technical_skills:
            technicalSkills,

          skill_gaps:
            skillGaps,

          mock_test_score:
            mockTestScore,

          mock_test_total:
            mockTestTotal,

          mock_test_percentage:
            mockTestPercentage,
        });

      console.log(
        "NEW AI roadmap response:",
        result
      );

      if (
        !result?.success ||
        !result?.data?.roadmap
      ) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to generate AI roadmap."
        );
      }

      // ------------------------------------------------------
      // Extract new roadmap
      // ------------------------------------------------------

      const newRoadmap =
        result.data.roadmap;

      const roadmapData = {
        id: newRoadmap.id,

        career_goal:
          newRoadmap.career_goal ||
          currentCareerGoal,

        experience_level:
          newRoadmap.experience_level ||
          currentExperienceLevel,

        roadmap:
          newRoadmap.roadmap,
      };

      // ------------------------------------------------------
      // SAVE CURRENT ROADMAP
      // ------------------------------------------------------

      localStorage.setItem(
        "skillbridge_current_roadmap",
        JSON.stringify(
          roadmapData
        )
      );

      // Also maintain general roadmap storage
      localStorage.setItem(
        "skillbridge_roadmap",
        JSON.stringify(
          roadmapData
        )
      );

      // ------------------------------------------------------
      // Update UI immediately
      // ------------------------------------------------------

      setCareerGoal(
        roadmapData.career_goal
      );

      setExperienceLevel(
        roadmapData.experience_level
      );

      setRoadmap(
        roadmapData.roadmap
      );

      // ------------------------------------------------------
      // Clear completed topics because this is a NEW roadmap
      // ------------------------------------------------------

      localStorage.removeItem(
        "skillbridge_completed_topics"
      );

      setCompletedTopics([]);

      setError("");

      console.log(
        "New roadmap generated successfully."
      );
    } catch (error) {
      console.error(
        "Roadmap generation error:",
        error
      );

      setError(
        error?.message ||
          "Failed to generate AI roadmap."
      );
    } finally {
      setGeneratingRoadmap(false);
    }
  };

  // ============================================================
  // GENERATE LEARNING PLAN
  // ============================================================

  const handleGenerateLearningPlan = async () => {
    try {
      setGeneratingLearningPlan(true);
      setLearningPlanMessage("");

      const savedAssessment =
        localStorage.getItem(
          "skillbridge_assessment"
        );

      if (!savedAssessment) {
        setLearningPlanMessage(
          "Please complete the skill assessment first."
        );

        return;
      }

      const assessment =
        JSON.parse(savedAssessment);

      const skillGaps =
        assessment?.skill_analysis
          ?.skill_gaps || [];

      if (
        !Array.isArray(skillGaps) ||
        skillGaps.length === 0
      ) {
        setLearningPlanMessage(
          "No skill gaps found. Please complete the assessment again."
        );

        return;
      }

      console.log(
        "Generating learning plan with:",
        {
          career_goal:
            careerGoal,

          experience_level:
            experienceLevel,

          skill_gaps:
            skillGaps,
        }
      );

      const result =
        await generateLearningPlan({
          career_goal:
            careerGoal,

          experience_level:
            experienceLevel,

          skill_gaps:
            skillGaps,
        });

      console.log(
        "Learning plan response:",
        result
      );

      if (
        !result?.success ||
        !result?.data
      ) {
        throw new Error(
          result?.message ||
            result?.error ||
            "Failed to generate learning plan."
        );
      }

      localStorage.setItem(
        "skillbridge_learning_plan",
        JSON.stringify(
          result.data.learning_plan
        )
      );

      setLearningPlanMessage(
        "7-Day Learning Plan generated and saved successfully."
      );
    } catch (error) {
      console.error(
        "Learning plan generation error:",
        error
      );

      setLearningPlanMessage(
        error?.message ||
          "Failed to generate learning plan."
      );
    } finally {
      setGeneratingLearningPlan(false);
    }
  };

  // ============================================================
  // TOGGLE ROADMAP TOPIC
  // ============================================================

  const toggleTopic = (topic) => {
    setCompletedTopics((prev) => {
      let updated;

      if (prev.includes(topic)) {
        updated = prev.filter(
          (item) => item !== topic
        );
      } else {
        updated = [
          ...prev,
          topic,
        ];
      }

      localStorage.setItem(
        "skillbridge_completed_topics",
        JSON.stringify(
          updated
        )
      );

      return updated;
    });
  };

  // ============================================================
  // ROADMAP PROGRESS
  // ============================================================

  const allTopics =
    roadmap?.phases?.flatMap(
      (phase) =>
        phase?.skills?.flatMap(
          (skill) =>
            skill?.topics || []
        ) || []
    ) || [];

  const totalTopics =
    allTopics.length;

  const completedCount =
    completedTopics.filter(
      (topic) =>
        allTopics.includes(topic)
    ).length;

  const progress =
    totalTopics > 0
      ? Math.round(
          (completedCount /
            totalTopics) *
            100
        )
      : 0;

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">
        <div className="text-center">

          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-gray-700 border-t-white" />

          <h1 className="text-2xl font-bold">
            Loading Your AI Roadmap...
          </h1>

          <p className="mt-2 text-gray-400">
            Loading your latest generated roadmap.
          </p>

        </div>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error && !roadmap) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-6">

        <div className="max-w-lg text-center">

          <h1 className="text-3xl font-bold">
            Unable to Load Roadmap
          </h1>

          <p className="mt-4 text-red-400">
            {error}
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-4">

            <Link
              to="/mock-test-result"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black hover:bg-gray-200"
            >
              Back to Mock Test Result
            </Link>

            <Link
              to="/assessment"
              className="rounded-lg border border-gray-700 px-6 py-3 font-semibold hover:bg-gray-900"
            >
              Assessment
            </Link>

          </div>

        </div>

      </div>
    );
  }

  // ============================================================
  // MAIN UI
  // ============================================================

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

        {/* Header */}

        <div>

          <p className="text-sm text-gray-400">
            AI Career Roadmap
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Your {careerGoal} Roadmap
          </h1>

          <p className="mt-3 text-gray-400">
            Personalized learning path generated by AI
            based on your assessment, skills, skill gaps,
            and mock test performance.
          </p>

        </div>

        {/* Experience */}

        <div className="mt-6">

          <span className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300">
            Experience: {experienceLevel}
          </span>

        </div>

        {/* Generate New Roadmap */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <p className="text-sm text-gray-400">
            Mock Test Based AI Roadmap
          </p>

          <h2 className="mt-1 text-2xl font-bold">
            Generate Fresh Career Roadmap
          </h2>

          <p className="mt-2 text-gray-400">
            Your latest assessment, skill gaps and mock
            test score will be used to generate a new
            personalized roadmap.
          </p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={
              handleGenerateRoadmap
            }
            disabled={
              generatingRoadmap
            }
            className="mt-6 rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {generatingRoadmap
              ? "Generating New AI Roadmap..."
              : "Generate New AI Roadmap"}
          </button>

        </div>

        {/* AI Summary */}

        {roadmap?.summary && (
          <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <p className="text-sm font-semibold text-gray-400">
              AI Roadmap Summary
            </p>

            <p className="mt-3 leading-7 text-gray-300">
              {roadmap.summary}
            </p>

          </div>
        )}

        {/* Roadmap Progress */}

        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Roadmap Progress
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                {completedCount} of{" "}
                {totalTopics} topics completed
              </p>

            </div>

            <span className="text-2xl font-bold">
              {progress}%
            </span>

          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-800">

            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

        </div>

        {/* Learning Path */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold">
            Learning Path
          </h2>

          <p className="mt-2 text-gray-400">
            Complete each topic to progress through
            your roadmap.
          </p>

        </div>

        {/* Phases */}

        <div className="mt-6 space-y-6">

          {roadmap?.phases?.map(
            (phase) => (

              <div
                key={phase.phase}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
              >

                <div className="flex items-start gap-5">

                  {/* Phase Number */}

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-lg font-bold text-black">
                    {phase.phase}
                  </div>

                  {/* Phase Content */}

                  <div className="flex-1">

                    {/* Phase Header */}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                      <div>

                        <p className="text-sm text-gray-500">
                          Phase {phase.phase}
                        </p>

                        <h3 className="mt-1 text-xl font-semibold">
                          {phase.title}
                        </h3>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300">
                          {phase.duration_weeks} weeks
                        </span>

                        <span className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300">
                          {phase.priority} Priority
                        </span>

                      </div>

                    </div>

                    {/* Skills */}

                    <div className="mt-6">

                      <h4 className="text-sm font-semibold text-gray-300">
                        Skills & Topics
                      </h4>

                      <div className="mt-4 space-y-4">

                        {phase.skills?.map(
                          (
                            skillItem,
                            index
                          ) => (

                            <div
                              key={`${skillItem.skill}-${index}`}
                              className="rounded-xl border border-gray-800 bg-gray-950 p-4"
                            >

                              <h5 className="font-semibold">
                                {skillItem.skill}
                              </h5>

                              <div className="mt-3 flex flex-wrap gap-2">

                                {skillItem.topics?.map(
                                  (
                                    topic,
                                    topicIndex
                                  ) => {

                                    const completed =
                                      completedTopics.includes(
                                        topic
                                      );

                                    return (
                                      <button
                                        key={`${topic}-${topicIndex}`}
                                        type="button"
                                        onClick={() =>
                                          toggleTopic(
                                            topic
                                          )
                                        }
                                        className={`rounded-lg border px-3 py-2 text-sm transition ${
                                          completed
                                            ? "border-green-700 bg-green-950 text-green-300 line-through"
                                            : "border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800"
                                        }`}
                                      >

                                        {completed
                                          ? "✓ "
                                          : ""}

                                        {topic}

                                      </button>
                                    );
                                  }
                                )}

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                    {/* Project */}

                    {phase.project && (
                      <div className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-4">

                        <p className="text-sm font-semibold text-gray-300">
                          Practical Project
                        </p>

                        <p className="mt-2 text-gray-400">
                          {phase.project}
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              </div>

            )
          )}

        </div>

        {/* Interview Preparation */}

        {roadmap?.interview_preparation?.length > 0 && (

          <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <h2 className="text-2xl font-bold">
              Interview Preparation
            </h2>

            <p className="mt-2 text-gray-400">
              Focus on these areas while following
              your roadmap.
            </p>

            <div className="mt-5 space-y-3">

              {roadmap.interview_preparation.map(
                (item, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-3 rounded-lg border border-gray-800 bg-gray-950 p-4"
                  >

                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                      {index + 1}
                    </span>

                    <p className="text-gray-300">
                      {item}
                    </p>

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {/* Learning Plan */}

        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <div>

            <p className="text-sm text-gray-400">
              Personalized Learning
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              7-Day Learning Plan
            </h2>

            <p className="mt-2 text-gray-400">
              Generate a personalized 7-day study plan
              based on your assessment skill gaps.
            </p>

          </div>

          {learningPlanMessage && (
            <div className="mt-5 rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-gray-300">
              {learningPlanMessage}
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-4">

            <button
              type="button"
              onClick={
                handleGenerateLearningPlan
              }
              disabled={
                generatingLearningPlan
              }
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {generatingLearningPlan
                ? "Generating Learning Plan..."
                : "Generate 7-Day Learning Plan"}
            </button>

            <Link
              to="/learning-plan"
              className="rounded-lg border border-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              View Learning Plan
            </Link>

          </div>

        </div>

        {/* Bottom Buttons */}

        <div className="mt-10 flex flex-wrap gap-4">

          <Link
            to="/dashboard"
            className="rounded-lg border border-gray-700 px-6 py-3 font-semibold hover:bg-gray-900"
          >
            Back to Dashboard
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

export default Roadmap;