import { useState } from "react";
import { Link } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function ResumeAnalysis() {
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a PDF or DOCX resume.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/api/resume/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data =
        await response
          .json()
          .catch(() => null);

      if (!response.ok || !data?.success) {
        setError(
          data?.message ||
            data?.detail ||
            data?.error ||
            "Resume analysis failed."
        );
        return;
      }

      setResult(data.data);
    } catch (err) {
      console.error(
        "Resume analysis error:",
        err
      );

      setError(
        "Unable to connect to server. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <Link
            to="/dashboard"
            className="text-xl font-bold"
          >
            SkillBridge AI
          </Link>

          <Link
            to="/dashboard"
            className="text-sm text-gray-400 hover:text-white"
          >
            Back to Dashboard
          </Link>

        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-12">

        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            Resume Analysis
          </h1>

          <p className="mt-3 text-gray-400">
            Upload your resume and let SkillBridge AI
            analyze your skills, experience and skill gaps.
          </p>

        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">

          <form onSubmit={handleUpload}>

            <label className="mb-3 block text-sm font-medium">
              Upload Resume
            </label>

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="block w-full rounded-lg border border-gray-700 bg-gray-950 p-3 text-sm text-gray-300"
            />

            <p className="mt-2 text-xs text-gray-500">
              Supported formats: PDF, DOCX
            </p>

            {file && (
              <p className="mt-4 text-sm text-gray-300">
                Selected: {file.name}
              </p>
            )}

            {error && (
              <div className="mt-5 rounded-lg border border-red-800 bg-red-950 p-4 text-sm text-red-300">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Analyzing Resume..."
                : "Analyze Resume"}
            </button>

          </form>

        </div>

        {result && (
          <div className="mt-8 space-y-6">

            <div>

              <h2 className="text-2xl font-bold">
                Analysis Result
              </h2>

              <p className="mt-1 text-gray-400">
                {result.filename}
              </p>

            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

              <h3 className="text-lg font-semibold">
                Detected Skills
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">

                {(result.analysis?.skills || []).map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-800 px-3 py-1 text-sm"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

              <h3 className="text-lg font-semibold">
                Skill Gaps
              </h3>

              <div className="mt-4 flex flex-wrap gap-2">

                {(result.analysis?.skill_gaps || []).map(
                  (skill, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-gray-800 px-3 py-1 text-sm text-gray-300"
                    >
                      {skill}
                    </span>
                  )
                )}

              </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

                <h3 className="text-lg font-semibold">
                  Experience
                </h3>

                <p className="mt-3 text-gray-400">
                  {result.analysis?.experience ||
                    "Not detected"}
                </p>

              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

                <h3 className="text-lg font-semibold">
                  Certifications
                </h3>

                <p className="mt-3 text-gray-400">
                  {(result.analysis?.certifications || [])
                    .join(", ") ||
                    "None detected"}
                </p>

              </div>

            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">

              <h3 className="text-lg font-semibold">
                Education
              </h3>

              <div className="mt-3 text-gray-400">
                {(result.analysis?.education || [])
                  .join(", ") ||
                  "Not detected"}
              </div>

            </div>

            <Link
              to="/assessment"
              className="block w-full rounded-lg bg-white py-3 text-center font-semibold text-black hover:bg-gray-200"
            >
              Continue to Skill Assessment
            </Link>

          </div>
        )}

      </main>
    </div>
  );
}

export default ResumeAnalysis;