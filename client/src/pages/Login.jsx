import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const clearPreviousUserData = () => {
    const keysToClear = [
      "skillbridge_assessment",
      "skillbridge_mock_test_info",
      "skillbridge_mock_test_result",
      "skillbridge_roadmap",
      "skillbridge_current_roadmap",
      "skillbridge_roadmap_meta",
      "skillbridge_learning_plan",
      "skillbridge_completed_topics",
      "skillbridge_completed_learning_tasks",
      "skillbridge_resume_analysis",
      "skillbridge_resume",
      "skillbridge_progress",
    ];

    keysToClear.forEach((key) => {
      localStorage.removeItem(key);
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      console.log(
        "Login API:",
        `${API_URL}/api/auth/login`
      );

      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const result = await response
        .json()
        .catch(() => null);

      console.log(
        "Login response:",
        result
      );

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            result?.detail ||
            result?.error ||
            "Invalid email or password"
        );
      }

      // =====================================================
      // CURRENT LOGGED-IN USER
      // =====================================================

      const newUser = result?.data;

      if (!newUser) {
        throw new Error(
          "Login successful, but user data was not returned."
        );
      }

      // =====================================================
      // PREVIOUS LOGGED-IN USER
      // =====================================================

      const oldUserData =
        localStorage.getItem(
          "skillbridge_user"
        );

      let oldUser = null;

      if (oldUserData) {
        try {
          oldUser = JSON.parse(oldUserData);
        } catch {
          oldUser = null;
        }
      }

      // =====================================================
      // USER SWITCH DETECTION
      // =====================================================

      const oldUserId = oldUser?.id;
      const newUserId = newUser?.id;

      const isDifferentUser =
        oldUserId &&
        newUserId &&
        String(oldUserId) !==
          String(newUserId);

      // =====================================================
      // CLEAR OLD ACCOUNT DATA
      // =====================================================

      if (isDifferentUser) {
        console.log(
          "Different user detected. Clearing previous user data."
        );

        clearPreviousUserData();
      }

      // =====================================================
      // SAVE NEW USER
      // =====================================================

      localStorage.setItem(
        "skillbridge_user",
        JSON.stringify(newUser)
      );

      if (newUserId !== undefined && newUserId !== null) {
        localStorage.setItem(
          "skillbridge_active_user_id",
          String(newUserId)
        );
      }

      // =====================================================
      // GO TO DASHBOARD
      // =====================================================

      navigate("/dashboard");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error?.message ||
          "Unable to connect to server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <Link
            to="/"
            className="mb-8 block text-center text-2xl font-bold"
          >
            SkillBridge AI
          </Link>

          {/* Card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">

            {/* Heading */}
            <h1 className="text-3xl font-bold">
              Welcome 
            </h1>

            <p className="mt-2 text-gray-400">
              Sign in to continue your career journey.
            </p>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-lg border border-red-800 bg-red-950 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleLogin}
              className="mt-8 space-y-5"
            >

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-white"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-white py-3 font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>
            </form>

            {/* Register */}
            <p className="mt-6 text-center text-sm text-gray-400">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-medium text-white hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;