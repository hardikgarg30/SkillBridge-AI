import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { submitAssessment } from "../services/assessmentService";

function Assessment() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    careerGoal: "",
    experience: "",
    skills: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.careerGoal.trim() ||
      !formData.experience ||
      !formData.skills.trim()
    ) {
      setError("Please complete all fields before continuing.");
      return;
    }

    setError("");
    setLoading(true);

    const technicalSkills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    const assessmentData = {
      career_goal: formData.careerGoal.trim(),
      experience_level: formData.experience,
      technical_skills: technicalSkills,
    };

    try {
      // Existing backend assessment remains unchanged
      const result = await submitAssessment(assessmentData);

      console.log("Assessment API response:", result);

      // Save assessment result
      localStorage.setItem(
    "skillbridge_assessment",
    JSON.stringify(result.data)
    );

      // Save mock-test information
      localStorage.setItem(
    "skillbridge_mock_test_info",
     JSON.stringify({
    career_goal: assessmentData.career_goal,
    experience_level: assessmentData.experience_level,
    technical_skills: assessmentData.technical_skills,
    })
  );

      // Go to Mock Test instead of directly to assessment result
      navigate("/mock-test");

    } catch (error) {
      console.error("Assessment submission failed:", error);

      setError(
        error.message ||
          "Something went wrong while submitting assessment."
      );
    } finally {
      setLoading(false);
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
      <main className="mx-auto max-w-3xl px-6 py-10">

        <div>
          <p className="text-sm text-gray-400">
            Skill Assessment
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Tell us about your skills
          </h1>

          <p className="mt-3 text-gray-400">
            First tell us about your current skills. After this,
            you will take a technical mock test so SkillBridge AI
            can understand your actual knowledge level.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-6"
        >

          {/* Career Goal */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <label className="text-lg font-semibold">
              What is your career goal?
            </label>

            <p className="mt-1 text-sm text-gray-400">
              Example: Software Engineer, Data Scientist,
              Frontend Developer
            </p>

            <input
              type="text"
              name="careerGoal"
              value={formData.careerGoal}
              onChange={handleChange}
              placeholder="Enter your target role"
              className="mt-4 w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-white"
            />

          </div>

          {/* Experience */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <label className="text-lg font-semibold">
              Experience Level
            </label>

            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="mt-4 w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-white"
            >
              <option value="">
                Select your experience
              </option>

              <option value="beginner">
                Beginner
              </option>

              <option value="intermediate">
                Intermediate
              </option>

              <option value="advanced">
                Advanced
              </option>

            </select>

          </div>

          {/* Skills */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

            <label className="text-lg font-semibold">
              Technical Skills
            </label>

            <p className="mt-1 text-sm text-gray-400">
              Enter your skills separated by commas.
            </p>

            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              rows="5"
              placeholder="Java, Python, React, SQL, Git..."
              className="mt-4 w-full resize-none rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none focus:border-white"
            />

          </div>

          {/* Error */}
          {error && (
            <div className="rounded-lg border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Analyzing Skills..."
              : "Continue to Mock Test"}
          </button>

        </form>

      </main>
    </div>
  );
}

export default Assessment;