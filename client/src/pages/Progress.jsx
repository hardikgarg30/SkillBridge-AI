import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Progress() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState({
    practice: 0,
    roadmap: 0,
    learning: 0,
    overall: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const savedUser =
        localStorage.getItem("skillbridge_user");

      if (!savedUser) {
        navigate("/login");
        return;
      }

      // =========================
      // Practice Progress
      // =========================

      const completedPractice = JSON.parse(
        localStorage.getItem(
          "skillbridge_completed_practice_questions"
        ) || "[]"
      );

      const savedPracticeQuestions =
        JSON.parse(
          localStorage.getItem(
            "skillbridge_practice_questions"
          ) || "[]"
        );

      let practiceProgress = 0;

      if (savedPracticeQuestions.length > 0) {
        practiceProgress = Math.round(
          (completedPractice.length /
            savedPracticeQuestions.length) *
            100
        );
      } else {
        // If questions are not stored,
        // calculate from currently known count.
        const practiceTotal =
          Number(
            localStorage.getItem(
              "skillbridge_practice_total"
            )
          ) || 5;

        practiceProgress = Math.round(
          (completedPractice.length /
            practiceTotal) *
            100
        );
      }

      practiceProgress = Math.min(
        100,
        Math.max(0, practiceProgress)
      );


      // =========================
      // Learning Plan Progress
      // =========================

      const completedLearningTasks =
        JSON.parse(
          localStorage.getItem(
            "skillbridge_completed_learning_tasks"
          ) || "[]"
        );

      const savedLearningPlan =
        localStorage.getItem(
          "skillbridge_learning_plan"
        );

      let learningProgress = 0;

      if (savedLearningPlan) {
        const learningPlan =
          JSON.parse(savedLearningPlan);

        const allTasks =
          learningPlan?.daily_plan?.flatMap(
            (day) => day?.tasks || []
          ) || [];

        if (allTasks.length > 0) {
          learningProgress = Math.round(
            (completedLearningTasks.length /
              allTasks.length) *
              100
          );
        }
      }

      learningProgress = Math.min(
        100,
        Math.max(0, learningProgress)
      );


      // =========================
      // Roadmap Progress
      // =========================

      const completedTopics =
        JSON.parse(
          localStorage.getItem(
            "skillbridge_completed_topics"
          ) || "[]"
        );

      let roadmapProgress = 0;

      const savedRoadmap =
        localStorage.getItem(
          "skillbridge_roadmap"
        );

      if (savedRoadmap) {
        const roadmap =
          JSON.parse(savedRoadmap);

        const allTopics =
          roadmap?.phases?.flatMap(
            (phase) =>
              phase?.skills?.flatMap(
                (skill) =>
                  skill?.topics || []
              ) || []
          ) || [];

        if (allTopics.length > 0) {
          roadmapProgress = Math.round(
            (completedTopics.length /
              allTopics.length) *
              100
          );
        }
      }

      roadmapProgress = Math.min(
        100,
        Math.max(0, roadmapProgress)
      );


      // =========================
      // Overall Progress
      // =========================

      const overallProgress = Math.round(
        (
          practiceProgress +
          learningProgress +
          roadmapProgress
        ) / 3
      );


      setProgress({
        practice: practiceProgress,
        roadmap: roadmapProgress,
        learning: learningProgress,
        overall: overallProgress,
      });

    } catch (error) {
      console.error(
        "Progress loading error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // Progress Bar
  // =========================

  const ProgressBar = ({
    value,
  }) => {
    return (
      <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-800">

        <div
          className="h-full rounded-full bg-white transition-all duration-500"
          style={{
            width: `${value}%`,
          }}
        />

      </div>
    );
  };


  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">

        <p className="text-gray-400">
          Loading progress...
        </p>

      </div>
    );
  }


  // =========================
  // Page
  // =========================

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">

      <div className="mx-auto max-w-6xl">

        {/* Back */}

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="mb-8 text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Dashboard
        </button>


        {/* Header */}

        <div>

          <h1 className="text-4xl font-bold">
            Your Progress
          </h1>

          <p className="mt-3 text-gray-400">
            Track your progress across your
            SkillBridge AI learning journey.
          </p>

        </div>


        {/* Overall */}

        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-8">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm text-gray-400">
                Overall Progress
              </p>

              <h2 className="mt-2 text-5xl font-bold">
                {progress.overall}%
              </h2>

            </div>

            <div className="text-sm text-gray-400">
              Keep learning and improving 🚀
            </div>

          </div>

          <ProgressBar
            value={progress.overall}
          />

        </div>


        {/* Progress Cards */}

        <div className="mt-8 grid gap-6 md:grid-cols-3">

          {/* Practice */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <p className="text-sm text-gray-400">
              Practice Questions
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {progress.practice}%
            </h2>

            <ProgressBar
              value={progress.practice}
            />

            <p className="mt-4 text-sm text-gray-500">
              Complete practice questions
              to improve this progress.
            </p>

          </div>


          {/* Roadmap */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <p className="text-sm text-gray-400">
              Career Roadmap
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {progress.roadmap}%
            </h2>

            <ProgressBar
              value={progress.roadmap}
            />

            <p className="mt-4 text-sm text-gray-500">
              Complete roadmap topics to
              increase your progress.
            </p>

          </div>


          {/* Learning */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <p className="text-sm text-gray-400">
              Learning Plan
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {progress.learning}%
            </h2>

            <ProgressBar
              value={progress.learning}
            />

            <p className="mt-4 text-sm text-gray-500">
              Complete learning tasks to
              increase your progress.
            </p>

          </div>

        </div>


        {/* Navigation */}

        <div className="mt-8 flex flex-wrap gap-4">

          <button
            onClick={() =>
              navigate("/practice-questions")
            }
            className="rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200"
          >
            Practice Questions
          </button>

          <button
            onClick={() =>
              navigate("/roadmap")
            }
            className="rounded-lg border border-gray-700 px-5 py-3 font-semibold transition hover:bg-gray-800"
          >
            View Roadmap
          </button>

          <button
            onClick={() =>
              navigate("/learning-plan")
            }
            className="rounded-lg border border-gray-700 px-5 py-3 font-semibold transition hover:bg-gray-800"
          >
            View Learning Plan
          </button>

        </div>

      </div>

    </div>
  );
}

export default Progress;