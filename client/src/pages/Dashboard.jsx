import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);

  const [stats, setStats] = useState({
    skillsAssessed: 0,
    skillGaps: 0,
    roadmapProgress: 0,
    learningProgress: 0,
  });

  const [profileData, setProfileData] = useState({
    careerGoal: "",
    experienceLevel: "",
    skills: [],
    skillGaps: [],
    mockScore: null,
    mockPercentage: null,
  });

  useEffect(() => {
    // =========================
    // Logged-in User
    // =========================

    const savedUser =
      localStorage.getItem("skillbridge_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error(
          "Invalid user data:",
          error
        );

        localStorage.removeItem(
          "skillbridge_user"
        );
      }
    }

    // =========================
    // Load Profile Information
    // =========================

    const loadProfileData = () => {
      try {
        const savedAssessment =
          localStorage.getItem(
            "skillbridge_assessment"
          );

        const savedMockResult =
          localStorage.getItem(
            "skillbridge_mock_test_result"
          );

        let careerGoal = "";
        let experienceLevel = "";
        let skills = [];
        let skillGaps = [];

        if (savedAssessment) {
          const assessment =
            JSON.parse(savedAssessment);

          careerGoal =
            assessment?.career_goal || "";

          experienceLevel =
            assessment?.experience_level || "";

          skills =
            Array.isArray(
              assessment?.technical_skills
            )
              ? assessment.technical_skills
              : Array.isArray(
                  assessment?.skills
                )
              ? assessment.skills
              : [];

          skillGaps =
            Array.isArray(
              assessment?.skill_analysis?.skill_gaps
            )
              ? assessment.skill_analysis.skill_gaps
              : [];
        }

        let mockScore = null;
        let mockPercentage = null;

        if (savedMockResult) {
          const mockResult =
            JSON.parse(savedMockResult);

          mockScore =
            mockResult?.score ?? null;

          mockPercentage =
            mockResult?.percentage ?? null;
        }

        setProfileData({
          careerGoal,
          experienceLevel,
          skills,
          skillGaps,
          mockScore,
          mockPercentage,
        });
      } catch (error) {
        console.error(
          "Failed to load profile data:",
          error
        );
      }
    };

    loadProfileData();

    // =========================
    // Load Dashboard Data
    // =========================

    const loadDashboardData = async () => {
      try {
        const savedAssessment =
          localStorage.getItem(
            "skillbridge_assessment"
          );

        const savedLearningPlan =
          localStorage.getItem(
            "skillbridge_learning_plan"
          );

        const completedLearningTasks =
          JSON.parse(
            localStorage.getItem(
              "skillbridge_completed_learning_tasks"
            ) || "[]"
          );

        const completedRoadmapTopics =
          JSON.parse(
            localStorage.getItem(
              "skillbridge_completed_topics"
            ) || "[]"
          );

        // =========================
        // Assessment Stats
        // =========================

        let skillsAssessed = 0;
        let skillGaps = 0;

        if (savedAssessment) {
          const assessment =
            JSON.parse(savedAssessment);

          const skills =
            assessment?.technical_skills ||
            assessment?.skills ||
            [];

          const gaps =
            assessment?.skill_analysis
              ?.skill_gaps ||
            [];

          skillsAssessed =
            Array.isArray(skills)
              ? skills.length
              : 0;

          skillGaps =
            Array.isArray(gaps)
              ? gaps.length
              : 0;
        }

        // =========================
        // Roadmap Progress
        // =========================

        let roadmapProgress = 0;

        try {
          const roadmapResponse =
            await fetch(
              `${API_URL}/api/roadmap/`
            );

          if (roadmapResponse.ok) {
            const roadmapResult =
              await roadmapResponse.json();

            if (
              roadmapResult?.success &&
              Array.isArray(
                roadmapResult?.data
              ) &&
              roadmapResult.data.length > 0
            ) {
              const latestRoadmap =
                roadmapResult.data[0]?.roadmap;

              const allTopics =
                latestRoadmap?.phases?.flatMap(
                  (phase) =>
                    phase?.skills?.flatMap(
                      (skill) =>
                        skill?.topics || []
                    ) || []
                ) || [];

              if (allTopics.length > 0) {
                const completedCount =
                  completedRoadmapTopics.filter(
                    (topic) =>
                      allTopics.includes(topic)
                  ).length;

                roadmapProgress =
                  Math.round(
                    (completedCount /
                      allTopics.length) *
                      100
                  );

                roadmapProgress =
                  Math.min(
                    roadmapProgress,
                    100
                  );
              }
            }
          }
        } catch (error) {
          console.error(
            "Failed to load roadmap progress:",
            error
          );
        }

        // =========================
        // Learning Plan Progress
        // =========================

        let learningProgress = 0;

        if (savedLearningPlan) {
          const learningPlan =
            JSON.parse(
              savedLearningPlan
            );

          const allTasks =
            learningPlan?.daily_plan?.flatMap(
              (day) =>
                day?.tasks || []
            ) || [];

          if (allTasks.length > 0) {
            learningProgress =
              Math.round(
                (completedLearningTasks.length /
                  allTasks.length) *
                  100
              );

            learningProgress =
              Math.min(
                learningProgress,
                100
              );
          }
        }

        // =========================
        // Update Stats
        // =========================

        setStats({
          skillsAssessed,
          skillGaps,
          roadmapProgress,
          learningProgress,
        });
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      }
    };

    loadDashboardData();
  }, []);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem(
      "skillbridge_user"
    );

    setProfileOpen(false);

    navigate("/");
  };

  // =========================
  // Profile Initial
  // =========================

  const getInitial = () => {
    const name =
      user?.full_name || "Student";

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* =========================
          Navbar
      ========================= */}

      <nav className="border-b border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">

          {/* Logo */}

          <Link
            to="/"
            className="text-2xl font-bold"
          >
            SkillBridge AI
          </Link>

          {/* Right Side */}

          <div className="relative flex items-center gap-4">

            <span className="hidden text-sm text-gray-400 sm:block">
              Welcome,{" "}
              {user?.full_name || "User"}
            </span>

            {/* Profile Button */}

            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (prev) => !prev
                )
              }
              className="flex items-center gap-2 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 transition hover:bg-gray-800"
            >

              {/* Avatar */}

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                {getInitial()}
              </span>

              <span className="hidden text-sm font-medium sm:block">
                Student
              </span>

              <span className="text-xs text-gray-400">
                {profileOpen
                  ? "▲"
                  : "▼"}
              </span>

            </button>

            {/* Logout */}

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm transition hover:bg-gray-900"
            >
              Logout
            </button>

            {/* =========================
                Profile Dropdown
            ========================= */}

            {profileOpen && (
              <div className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl">

                {/* Profile Header */}

                <div className="border-b border-gray-800 p-5">

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl font-bold text-black">
                      {getInitial()}
                    </div>

                    <div className="min-w-0">

                      <h3 className="truncate text-lg font-semibold">
                        {user?.full_name ||
                          "Student"}
                      </h3>

                      <p className="truncate text-sm text-gray-400">
                        {user?.email ||
                          "No email available"}
                      </p>

                    </div>

                  </div>
                </div>

                {/* Profile Information */}

                <div className="max-h-[70vh] overflow-y-auto p-4">

                  {/* Career Goal */}

                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Career Goal
                    </p>

                    <p className="mt-1 font-semibold">
                      {profileData.careerGoal ||
                        "Not specified"}
                    </p>

                  </div>

                  {/* Experience */}

                  <div className="mt-3 rounded-lg border border-gray-800 bg-gray-950 p-4">

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Experience Level
                    </p>

                    <p className="mt-1 font-semibold capitalize">
                      {profileData.experienceLevel ||
                        "Not specified"}
                    </p>

                  </div>

                  {/* Mock Test */}

                  <div className="mt-3 rounded-lg border border-gray-800 bg-gray-950 p-4">

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Latest Mock Test
                    </p>

                    {profileData.mockPercentage !==
                    null ? (
                      <div className="mt-2">

                        <p className="text-2xl font-bold">
                          {profileData.mockPercentage}%
                        </p>

                        <p className="text-sm text-gray-400">
                          {profileData.mockScore} correct
                        </p>

                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-400">
                        No mock test completed yet.
                      </p>
                    )}

                  </div>

                  {/* Skills */}

                  <div className="mt-3 rounded-lg border border-gray-800 bg-gray-950 p-4">

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Technical Skills
                    </p>

                    {profileData.skills.length >
                    0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">

                        {profileData.skills.map(
                          (skill, index) => (
                            <span
                              key={`${skill}-${index}`}
                              className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-300"
                            >
                              {skill}
                            </span>
                          )
                        )}

                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-400">
                        No skills added yet.
                      </p>
                    )}

                  </div>

                  {/* Skill Gaps */}

                  <div className="mt-3 rounded-lg border border-gray-800 bg-gray-950 p-4">

                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Skill Gaps
                    </p>

                    {profileData.skillGaps.length >
                    0 ? (
                      <div className="mt-3 space-y-2">

                        {profileData.skillGaps.map(
                          (gap, index) => (
                            <div
                              key={`${gap}-${index}`}
                              className="rounded-lg border border-gray-800 px-3 py-2 text-sm text-gray-300"
                            >
                              {gap}
                            </div>
                          )
                        )}

                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-400">
                        No skill gaps available.
                      </p>
                    )}

                  </div>

                  {/* Quick Links */}

                  <div className="mt-4 border-t border-gray-800 pt-4">

                    <p className="mb-3 text-xs uppercase tracking-wide text-gray-500">
                      Quick Access
                    </p>

                    <Link
                      to="/roadmap"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="block rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
                    >
                      View AI Career Roadmap
                    </Link>

                    <Link
                      to="/learning-plan"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
                    >
                      View Learning Plan
                    </Link>

                    <Link
                      to="/assessment"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="mt-1 block rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
                    >
                      Retake Skill Assessment
                    </Link>

                  </div>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-4 w-full rounded-lg border border-red-900 px-4 py-2 text-sm text-red-300 transition hover:bg-red-950"
                  >
                    Logout
                  </button>

                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* =========================
          Dashboard
      ========================= */}

      <main className="mx-auto max-w-7xl px-8 py-10">

        {/* Header */}

        <div>
          <h1 className="text-4xl font-bold">
            Dashboard
          </h1>

          <p className="mt-2 text-gray-400">
            Track your skills, identify gaps,
            and follow your AI-powered
            learning roadmap.
          </p>
        </div>

        {/* =========================
            Stats
        ========================= */}

        <div className="mt-10 grid gap-6 md:grid-cols-4">

          {/* Skills Assessed */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Skills Assessed
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {stats.skillsAssessed}
            </h2>
          </div>

          {/* Skill Gaps */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Skill Gaps
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {stats.skillGaps}
            </h2>
          </div>

          {/* Roadmap Progress */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Roadmap Progress
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {stats.roadmapProgress}%
            </h2>
          </div>

          {/* Learning Progress */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-400">
              Learning Progress
            </p>

            <h2 className="mt-3 text-4xl font-bold">
              {stats.learningProgress}%
            </h2>
          </div>

        </div>

        {/* =========================
            Main Features
        ========================= */}

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          {/* Resume Analysis */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">
              Resume Analysis
            </h2>

            <p className="mt-2 text-gray-400">
              Upload your resume to detect
              skills, experience, education
              and skill gaps.
            </p>

            <Link
              to="/resume-analysis"
              className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Analyze Resume
            </Link>
          </div>

          {/* Skill Assessment */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">
              Skill Assessment
            </h2>

            <p className="mt-2 text-gray-400">
              Evaluate your current technical
              skills and identify areas that
              need improvement.
            </p>

            <Link
              to="/assessment"
              className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Start Assessment
            </Link>
          </div>

          {/* AI Career Roadmap */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">
              AI Career Roadmap
            </h2>

            <p className="mt-2 text-gray-400">
              Get a personalized learning
              roadmap based on your skills
              and career goals.
            </p>

            <Link
              to="/roadmap"
              className="mt-6 inline-block rounded-lg border border-gray-700 px-5 py-3 font-semibold transition hover:bg-gray-800"
            >
              View Roadmap
            </Link>
          </div>

          {/* Company Roles */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">
              Company Roles
            </h2>

            <p className="mt-2 text-gray-400">
              Explore suitable company roles
              based on your skills, career
              goals, and skill gaps.
            </p>

            <Link
              to="/company-roles"
              className="mt-6 inline-block rounded-lg border border-gray-700 px-5 py-3 font-semibold transition hover:bg-gray-800"
            >
              Explore Company Roles
            </Link>
          </div>

          {/* Practice Questions */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">
              Practice Questions
            </h2>

            <p className="mt-2 text-gray-400">
              Practice personalized technical
              questions based on your career
              goal and skill gaps.
            </p>

            <Link
              to="/practice-questions"
              className="mt-6 inline-block rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Practice Now
            </Link>
          </div>

          {/* Progress */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="text-xl font-semibold">
              Overall Progress
            </h2>

            <p className="mt-2 text-gray-400">
              View your roadmap, learning,
              and practice progress in one
              place.
            </p>

            <Link
              to="/progress"
              className="mt-6 inline-block rounded-lg border border-gray-700 px-5 py-3 font-semibold transition hover:bg-gray-800"
            >
              View Progress
            </Link>
          </div>

        </div>

        {/* =========================
            Learning Plan
        ========================= */}

        <div className="mt-6 rounded-2xl border border-gray-800 bg-gray-900 p-6">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-xl font-semibold">
                7-Day Learning Plan
              </h2>

              <p className="mt-2 text-gray-400">
                Follow your personalized
                AI-generated learning plan
                and track your daily progress.
              </p>
            </div>

            <Link
              to="/learning-plan"
              className="inline-block rounded-lg bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              View Learning Plan
            </Link>

          </div>

        </div>

      </main>
    </div>
  );
}

export default Dashboard;