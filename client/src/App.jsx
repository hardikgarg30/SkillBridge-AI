import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import Assessment from "./pages/Assessment";
import AssessmentResult from "./pages/AssessmentResult";

import MockTest from "./pages/MockTest";
import MockTestResult from "./pages/MockTestResult";

import Roadmap from "./pages/Roadmap";
import LearningPlan from "./pages/LearningPlan";

import ResumeAnalysis from "./pages/ResumeAnalysis";
import CompanyRoles from "./pages/CompanyRoles";
import PracticeQuestions from "./pages/PracticeQuestions";
import Progress from "./pages/Progress";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* =========================
            Authentication
        ========================= */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =========================
            Dashboard
        ========================= */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* =========================
            Resume Analysis
        ========================= */}

        <Route
          path="/resume-analysis"
          element={<ResumeAnalysis />}
        />

        {/* =========================
            Skill Assessment
        ========================= */}

        <Route
          path="/assessment"
          element={<Assessment />}
        />

        <Route
          path="/assessment-result"
          element={<AssessmentResult />}
        />

        {/* =========================
            Mock Test
        ========================= */}

        <Route
          path="/mock-test"
          element={<MockTest />}
        />

        <Route
          path="/mock-test-result"
          element={<MockTestResult />}
        />

        {/* =========================
            AI Career Roadmap
        ========================= */}

        <Route
          path="/roadmap"
          element={<Roadmap />}
        />

        {/* =========================
            Learning Plan
        ========================= */}

        <Route
          path="/learning-plan"
          element={<LearningPlan />}
        />

        {/* =========================
            Company Roles
        ========================= */}

        <Route
          path="/company-roles"
          element={<CompanyRoles />}
        />

        {/* =========================
            Practice Questions
        ========================= */}

        <Route
          path="/practice-questions"
          element={<PracticeQuestions />}
        />

        {/* =========================
            Progress
        ========================= */}

        <Route
          path="/progress"
          element={<Progress />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;