import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function CompanyRoles() {
  const navigate = useNavigate();

  const [skills, setSkills] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDetectRoles = async (e) => {
    e.preventDefault();

    setError("");
    setRoles([]);

    const technicalSkills = skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    if (technicalSkills.length === 0) {
      setError(
        "Please enter at least one technical skill."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/company-roles/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            technical_skills: technicalSkills,
          }),
        }
      );

      const result =
        await response
          .json()
          .catch(() => null);

      if (!response.ok || !result?.success) {
        setError(
          result?.message ||
            result?.detail ||
            result?.error ||
            "Unable to detect suitable roles."
        );
        return;
      }

      setRoles(result.data || []);
    } catch (err) {
      console.error(
        "Company role detection error:",
        err
      );

      setError(
        "Unable to connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-sm text-gray-400 hover:text-white"
          >
            ← Back to Dashboard
          </button>

          <h1 className="text-4xl font-bold">
            Company Role Detection
          </h1>

          <p className="mt-3 text-gray-400">
            Discover the job roles that best match your current skills.
          </p>
        </div>

        {/* Input Card */}
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <form
            onSubmit={handleDetectRoles}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-sm font-medium">
                Your Technical Skills
              </label>

              <input
                type="text"
                value={skills}
                onChange={(e) =>
                  setSkills(e.target.value)
                }
                placeholder="Python, Java, SQL, Git, React"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-white"
              />

              <p className="mt-2 text-sm text-gray-500">
                Enter skills separated by commas.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Detecting Roles..."
                : "Detect Suitable Roles"}
            </button>
          </form>
        </div>

        {/* Results */}
        {roles.length > 0 && (
          <div className="mt-10">
            <h2 className="mb-6 text-2xl font-bold">
              Suitable Job Roles
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {roles.map((role, index) => (
                <div
                  key={`${role.role}-${index}`}
                  className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
                >
                  {/* Role Header */}
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold">
                      {role.role}
                    </h3>

                    <span className="text-2xl font-bold">
                      {role.match_percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-800">
                    <div
                      className="h-full rounded-full bg-white"
                      style={{
                        width: `${role.match_percentage}%`,
                      }}
                    />
                  </div>

                  {/* Matched Skills */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-300">
                      Matched Skills
                    </h4>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {role.matched_skills &&
                      role.matched_skills.length > 0 ? (
                        role.matched_skills.map(
                          (skill, skillIndex) => (
                            <span
                              key={`${skill}-${skillIndex}`}
                              className="rounded-full border border-gray-700 bg-gray-950 px-3 py-1 text-xs text-gray-300"
                            >
                              {skill}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-500">
                          No matching skills yet.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-300">
                      Skills to Improve
                    </h4>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {role.missing_skills &&
                      role.missing_skills.length > 0 ? (
                        role.missing_skills.map(
                          (skill, skillIndex) => (
                            <span
                              key={`${skill}-${skillIndex}`}
                              className="rounded-full border border-gray-700 px-3 py-1 text-xs text-gray-400"
                            >
                              {skill}
                            </span>
                          )
                        )
                      ) : (
                        <span className="text-sm text-gray-500">
                          No additional skills suggested.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Reason */}
                  {role.reason && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-gray-300">
                        Why This Role?
                      </h4>

                      <p className="mt-2 text-sm leading-6 text-gray-400">
                        {role.reason}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CompanyRoles;