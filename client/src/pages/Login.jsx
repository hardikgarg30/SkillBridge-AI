import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
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

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Invalid email or password"
        );

        return;
      }

      // =====================================================
      // CURRENT LOGGED-IN USER
      // =====================================================

      const newUser = result.data;

      // Previous logged-in user
      const oldUserData =
        localStorage.getItem(
          "skillbridge_user"
        );

      let oldUser = null;

      if (oldUserData) {
        try {
          oldUser = JSON.parse(
            oldUserData
          );
        } catch {
          oldUser = null;
        }
      }

      // =====================================================
      // USER SWITCH DETECTION
      // =====================================================

      const oldUserId =
        oldUser?.id;

      const newUserId =
        newUser?.id;

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
      // SAVE NEW LOGGED-IN USER
      // =====================================================

      localStorage.setItem(
        "skillbridge_user",
        JSON.stringify(newUser)
      );

      // Save active user ID separately
      localStorage.setItem(
        "skillbridge_active_user_id",
        String(newUserId)
      );

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

          <Link
            to="/"
            className="mb-8 block text-center text-2xl font-bold"
          >
            SkillBridge AI
          </Link>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">

            <h1 className="text-3xl font-bold">
              Welcome Back
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
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-white"
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
                  required
                  className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-white"
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