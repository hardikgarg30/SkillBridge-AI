import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function LearningPlan() {
  const [learningPlan, setLearningPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [completedTasks, setCompletedTasks] =
    useState(() => {
      try {
        return JSON.parse(
          localStorage.getItem(
            "skillbridge_completed_learning_tasks"
          ) || "[]"
        );
      } catch {
        return [];
      }
    });

  useEffect(() => {
    fetch(`${API_URL}/api/learning-plan/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Failed to fetch learning plan"
          );
        }

        return response.json();
      })
      .then((result) => {
        if (result?.success && result?.data) {
          setLearningPlan(result.data);
        } else {
          setError(
            "No learning plan found."
          );
        }
      })
      .catch((err) => {
        console.error(err);

        setError(
          "Unable to load learning plan. Please try again."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const toggleTask = (taskId) => {
    setCompletedTasks((previous) => {
      const updated = previous.includes(taskId)
        ? previous.filter(
            (id) => id !== taskId
          )
        : [...previous, taskId];

      localStorage.setItem(
        "skillbridge_completed_learning_tasks",
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <p className="text-gray-400">
          Loading your learning plan...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        <nav className="border-b border-gray-800 bg-gray-950">
          <div className="mx-auto max-w-7xl px-8 py-4">
            <Link
              to="/dashboard"
              className="text-2xl font-bold"
            >
              SkillBridge AI
            </Link>
          </div>
        </nav>

        <main className="mx-auto max-w-5xl px-8 py-16">
          <div className="rounded-2xl border border-red-900 bg-gray-900 p-8">
            <h1 className="text-2xl font-bold">
              Learning Plan
            </h1>

            <p className="mt-3 text-red-400">
              {error}
            </p>

            <Link
              to="/dashboard"
              className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-black"
            >
              Back to Dashboard
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const plan =
    learningPlan?.learning_plan || {};

  const dailyPlan =
    plan?.daily_plan ||
    plan?.days ||
    [];

  const allTasks =
    dailyPlan.flatMap(
      (day, dayIndex) =>
        (day.tasks || []).map(
          (task, taskIndex) => ({
            ...task,
            id:
              task.id ||
              `${dayIndex}-${taskIndex}`,
          })
        )
    );

  const completedCount =
    allTasks.filter(
      (task) =>
        completedTasks.includes(task.id)
    ).length;

  const progress =
    allTasks.length > 0
      ? Math.round(
          (completedCount /
            allTasks.length) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

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
      <main className="mx-auto max-w-7xl px-8 py-10">

        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">
            7-Day Learning Plan
          </h1>

          <p className="mt-2 text-gray-400">
            Your personalized AI-powered learning plan.
          </p>
        </div>

        {/* Progress */}
        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                Overall Progress
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {progress}%
              </h2>
            </div>

            <p className="text-sm text-gray-400">
              {completedCount} /{" "}
              {allTasks.length} tasks completed
            </p>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-white transition-all duration-500"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

        </div>

        {/* Career Info */}
        <div className="mt-6 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Career Goal
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {learningPlan?.career_goal ||
                "Not specified"}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Experience Level
            </p>

            <h2 className="mt-2 text-xl font-semibold capitalize">
              {learningPlan?.experience_level ||
                "Not specified"}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Skill Gaps
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              {learningPlan?.skill_gaps?.length ||
                0}
            </h2>
          </div>

        </div>

        {/* Daily Plan */}
        <div className="mt-8 space-y-6">

          {dailyPlan.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
              <p className="text-gray-400">
                No daily learning tasks are available in the saved plan.
              </p>
            </div>
          ) : (
            dailyPlan.map(
              (day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
                >

                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

                    <div>
                      <h2 className="text-2xl font-semibold">
                        {day.day ||
                          `Day ${dayIndex + 1}`}
                      </h2>

                      {day.focus && (
                        <p className="mt-1 text-gray-400">
                          Focus: {day.focus}
                        </p>
                      )}
                    </div>

                  </div>

                  {/* Tasks */}
                  <div className="mt-6 space-y-3">

                    {(day.tasks || []).map(
                      (task, taskIndex) => {
                        const taskId =
                          task.id ||
                          `${dayIndex}-${taskIndex}`;

                        const isCompleted =
                          completedTasks.includes(
                            taskId
                          );

                        const taskTitle =
                          typeof task ===
                          "string"
                            ? task
                            : task.title ||
                              task.name ||
                              "Learning Task";

                        const taskDescription =
                          typeof task ===
                          "object"
                            ? task.description
                            : "";

                        return (
                          <div
                            key={taskId}
                            className="flex gap-4 rounded-xl border border-gray-800 bg-gray-950 p-4"
                          >

                            <button
                              type="button"
                              onClick={() =>
                                toggleTask(
                                  taskId
                                )
                              }
                              className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${
                                isCompleted
                                  ? "border-white bg-white text-black"
                                  : "border-gray-600"
                              }`}
                            >
                              {isCompleted
                                ? "✓"
                                : ""}
                            </button>

                            <div>
                              <h3
                                className={`font-semibold ${
                                  isCompleted
                                    ? "text-gray-500 line-through"
                                    : "text-white"
                                }`}
                              >
                                {taskTitle}
                              </h3>

                              {taskDescription && (
                                <p className="mt-1 text-sm text-gray-400">
                                  {taskDescription}
                                </p>
                              )}
                            </div>

                          </div>
                        );
                      }
                    )}

                  </div>

                </div>
              )
            )
          )}

        </div>

      </main>

    </div>
  );
}

export default LearningPlan;