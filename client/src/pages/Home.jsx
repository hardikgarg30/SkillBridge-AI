import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl items-center px-8">
        <div className="max-w-3xl">
          <div className="mb-6 inline-flex rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm text-gray-300">
            AI-Powered Career Development Platform
          </div>

          <h1 className="text-5xl font-bold leading-tight md:text-7xl">
            Build Skills.
            <br />
            <span className="text-gray-400">Build Your Career.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            SkillBridge AI analyzes your skills, identifies gaps, and creates
            a personalized learning roadmap to help you reach your career
            goals.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="rounded-lg bg-white px-6 py-3 font-semibold text-black transition hover:bg-gray-200"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="rounded-lg border border-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-900"
            >
              Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;