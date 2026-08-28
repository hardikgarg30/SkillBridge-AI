# SkillBridge AI 🚀

### AI-Powered Career Skill Assessment, Adaptive Mock Testing & Personalized Learning Platform

SkillBridge AI is an AI-powered career development platform designed to help students and professionals assess their current skills, identify career-specific skill gaps, evaluate their knowledge, generate personalized career roadmaps, and follow structured learning plans.

It combines a React + Vite frontend, FastAPI backend, SQLAlchemy persistence, JWT-based authentication, AI-powered skill analysis, adaptive mock testing, personalized learning plans, practice questions, resume analysis, company-role matching, and progress tracking.


## 📦 Source Code

🔗 **[GitHub Repository](https://github.com/hardikgarg30/SkillBridge-AI)**

## ✨ Key Features

- 🧠 **AI Skill Assessment** --- analyze the user's career goal, experience level, and technical skills to identify strong skills, skill gaps, and current progress.
- 📄 **AI Resume Analysis** --- upload a resume and let AI identify technical skills, experience, education, certifications, skill gaps, suitable roles, and a professional summary.
- 🎯 **Adaptive AI Mock Test** --- dynamically generate career-specific multiple-choice questions based on the learner's career goal, experience level, technical skills, and skill gaps.
- 🗺️ **AI Career Roadmap** --- generate a personalized career roadmap based on current skills, missing skills, experience level, and mock-test performance.
- 📚 **7-Day AI Learning Plan** --- generate a structured seven-day learning plan with skills, topics, practical tasks, and estimated learning time.
- 💡 **Personalized Practice Questions** --- enter any career goal manually and generate practice questions around the selected skill gaps.
- 👤 **Student Profile** --- view student information, career goal, experience level, technical skills, skill gaps, latest mock-test score, and quick-access learning actions.
- 🏢 **AI Company Role Matching** --- dynamically recommend relevant job roles based on the user's actual skills and identify matched and missing skills.
- 📊 **Progress Tracking** --- track roadmap progress, learning progress, completed roadmap topics, learning tasks, and practice questions.
- 🔐 **Authentication** --- registration and login with protected backend routes and token-based authentication.
- 🤖 **Dynamic AI Personalization** --- the system adapts its generated assessment, mock test, roadmap, and learning content according to the user's actual career profile.
- 🧩 **Flexible Career Goals** --- users can enter custom career goals instead of being restricted to a predefined career list in personalized practice.
- 🔄 **End-to-End Career Workflow** --- connect assessment, testing, roadmap generation, learning, practice, and progress tracking in one platform.

## 🧱 Tech Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- JavaScript

### Backend

- Python
- FastAPI
- SQLAlchemy
- SQLite
- Pydantic
- CORS

### AI

- Hugging Face Inference API
- Llama 3.1 8B Instruct

### Authentication

- JWT-based authentication
- Password hashing
- Protected API routes

### Development

- VS Code
- Git
- GitHub

## 🏗️ Architecture

```text
┌──────────────────────────────┐
│        React + Vite UI       │
│ Dashboard / Assessment /     │
│ Mock Test / Roadmap /        │
│ Learning / Practice /        │
│ Resume / Progress            │
└──────────────┬───────────────┘
               │
               │ REST API
               │ JSON
               ▼
┌──────────────────────────────┐
│       FastAPI Backend        │
│ Authentication               │
│ Skill Analysis               │
│ AI Mock Test Generation      │
│ AI Roadmap Generation        │
│ AI Learning Plan             │
│ Resume Analysis              │
│ Practice Questions           │
│ Company Role Matching        │
│ Progress APIs                │
└──────────────┬───────────────┘
               │
               │ SQLAlchemy
               ▼
┌──────────────────────────────┐
│          SQLite DB           │
│ Users                        │
│ Assessments                  │
│ Roadmaps                     │
│ Learning Plans               │
│ Resumes / Progress Data      │
└──────────────────────────────┘

               │
               │ AI Inference
               ▼
┌──────────────────────────────┐
│   Hugging Face Inference API │
│       Llama 3.1 8B Instruct  │
└──────────────────────────────┘
📁 Project Structure
SKILLBRIDGE-AI/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Assessment.jsx
│   │   │   ├── AssessmentResult.jsx
│   │   │   ├── MockTest.jsx
│   │   │   ├── MockTestResult.jsx
│   │   │   ├── Roadmap.jsx
│   │   │   ├── LearningPlan.jsx
│   │   │   ├── PracticeQuestions.jsx
│   │   │   ├── CompanyRoles.jsx
│   │   │   ├── ResumeAnalysis.jsx
│   │   │   └── Progress.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── assessmentService.js
│   │   │   ├── learningPlanService.js
│   │   │   └── roadmapService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── server/
│   ├── app/
│   │   ├── database/
│   │   │   └── database.py
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── check_db.py
│
├── .gitignore
├── .env.example
└── README.md
🚀 Run Locally
Requirements
Windows 10/11
Python 3.10+
Node.js
npm
Git
Hugging Face API key
Backend
cd server
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

Backend:

http://127.0.0.1:8000

FastAPI documentation:

http://127.0.0.1:8000/docs
Frontend

Open a second terminal:

cd client
npm install
npm run dev

Frontend:

http://localhost:5176

If Vite selects another available port such as 5173, 5174, or 5175, use the URL printed in the terminal.

🔐 Environment Variables

Create:

server/.env

Example:

HF_API_KEY=your_huggingface_api_key

Never commit your real API key to GitHub.

Use .env.example as the safe configuration template.

For production deployments, store secrets in the hosting platform's environment-variable settings.

🔄 Core User Workflow

A typical SkillBridge AI workflow is:

User Registration
       ↓
User Login
       ↓
Dashboard
       ↓
Skill Assessment
       ↓
AI Skill Analysis
       ↓
Strong Skills + Skill Gaps
       ↓
Adaptive AI Mock Test
       ↓
Mock Test Score
       ↓
AI Career Roadmap
       ↓
7-Day AI Learning Plan
       ↓
Practice Questions
       ↓
Progress Tracking
       ↓
Student Profile

Resume analysis can be used as an additional entry point to understand the learner's existing career profile.

🎯 Adaptive AI Mock Test

The mock-test system is designed to generate questions dynamically rather than relying on one fixed question bank.

The generated test can use:

Career Goal
      +
Experience Level
      +
Technical Skills
      +
Skill Gaps
      ↓
AI-Generated Questions

Examples:

Career Goal: Sales Manager

Relevant focus:
CRM
Salesforce
Lead Generation
Negotiation
Sales Strategy
Forecasting
Career Goal: Data Analyst

Relevant focus:
SQL
Python
Excel
Power BI
Data Analysis
Statistics
Career Goal: Cloud Engineer

Relevant focus:
AWS
Linux
Docker
Kubernetes
Cloud Infrastructure
Career Goal: Cybersecurity Analyst

Relevant focus:
Linux
SIEM
Network Security
Threat Detection
Packet Analysis
Incident Response

The system is designed to avoid unrelated generic questions when a more role-specific topic is appropriate.

🧠 AI Personalization

SkillBridge AI uses multiple inputs to personalize the learner's experience.

Career Goal
     +
Experience Level
     +
Current Skills
     +
Skill Gaps
     +
Mock Test Performance
     ↓
Personalized Learning Experience

The same platform can therefore generate different learning paths for different users.

📈 Mock Test → Roadmap

Mock-test performance can influence the generated career roadmap.

Lower Performance

The roadmap can prioritize:

Fundamentals
Weak areas
Core concepts
Additional practice
Moderate Performance

The roadmap can balance:

Fundamentals
Intermediate concepts
Practical projects
Strong Performance

The roadmap can progress toward:

Advanced concepts
Real-world projects
Interview preparation
Job readiness
📚 AI Learning Plan

The learning-plan system creates a structured seven-day learning schedule.

Each day can include:

Target skill
Topics
Practical tasks
Estimated learning hours

Example:

Day 1
↓
Fundamentals

Day 2
↓
Core Concepts

Day 3
↓
Practical Application

Day 4
↓
Intermediate Concepts

Day 5
↓
Problem Solving

Day 6
↓
Project Work

Day 7
↓
Review + Practice

The actual content is generated according to the learner's career goal and skill gaps.

💡 Personalized Practice Questions

The practice-question module allows the learner to enter a custom career goal manually.

Examples:

AI Product Manager
Cybersecurity Analyst
Blockchain Developer
DevSecOps Engineer
Healthcare Data Analyst
Sales Manager
Cloud Security Engineer
Game Developer

The learner can also enter skill gaps manually:

System Design, Docker, REST APIs

The backend then generates practice content around the supplied profile.

📄 AI Resume Analysis

Resume analysis can process uploaded resume information and return:

Technical skills
Experience
Education
Certifications
Skill gaps
Recommended roles
Professional summary

The system is designed to analyze the resume dynamically rather than relying only on a predefined career list.

🏢 AI Company Role Matching

The company-role module analyzes the candidate's skills and dynamically suggests relevant roles.

A role recommendation can include:

Role
Match Percentage
Matched Skills
Missing Skills
Reason

This allows learners to understand not only which roles may fit them, but also which skills they should improve.

👤 Student Profile

The dashboard profile menu provides quick access to:

Student name
Email
Career goal
Experience level
Technical skills
Skill gaps
Latest mock-test score
AI Career Roadmap
Learning Plan
Retake Assessment
Logout
📊 Progress Tracking

The dashboard provides high-level learning metrics:

Skills Assessed
Skill Gaps
Roadmap Progress
Learning Progress

The application can also track completed:

Roadmap topics
Learning tasks
Practice questions
🔌 Important API Capabilities

The FastAPI backend provides endpoints for:

User registration
User login
Skill assessment
Assessment retrieval
AI mock-test generation
AI career roadmap
AI learning plan
Resume analysis
Practice questions
Company-role matching
Progress tracking
Health checks

Important endpoints include:

POST /api/auth/register
POST /api/auth/login

POST /api/assessment/
GET  /api/assessment/

POST /api/assessment/mock-test

GET  /api/roadmap/

GET  /api/learning-plan/

POST /api/practice-questions/

POST /api/resume/

GET  /api/progress/

FastAPI Swagger documentation:

http://127.0.0.1:8000/docs
🗺️ AI Decision Flow
Student Profile
      ↓
Career Goal
      ↓
Experience Level
      ↓
Current Skills
      ↓
AI Skill Analyzer
      ↓
Skill Gaps
      ↓
Adaptive Mock Test
      ↓
Mock Test Performance
      ↓
AI Roadmap
      ↓
7-Day Learning Plan
      ↓
Practice Questions
      ↓
Progress Tracking
🛡️ Security Notes
Passwords are stored using secure password hashing.
Protected backend routes use token-based authentication.
API keys are stored through environment variables.
.env files should never be committed.
Production deployments should use HTTPS.
Production deployments should use strong secrets.
CORS should be restricted to trusted production frontend origins.
Local database files should not be committed to the repository.
💻 Local Development Notes

The frontend currently runs through Vite.

Typical development URLs:

Frontend:
http://localhost:5176/

Backend:
http://127.0.0.1:8000/

API Docs:
http://127.0.0.1:8000/docs

If the selected frontend port is already in use, Vite may automatically choose another available port.

☁️ Deployment

Recommended production architecture:

React + Vite Frontend
          ↓
      Vercel
          ↓
        HTTPS
          ↓
   FastAPI Backend
          ↓
       Render
          ↓
   Production Database

Production deployment should use:

HTTPS
Environment variables
Secure API keys
Production database configuration
Restricted CORS
Strong authentication secrets
Production-ready logging and monitoring
🎯 Why SkillBridge AI?

Career preparation is often fragmented across different tools.

One platform may provide a roadmap.

Another may provide practice questions.

Another may analyze resumes.

Another may offer assessments.

SkillBridge AI brings these workflows together:

Assess
  ↓
Analyze
  ↓
Test
  ↓
Identify Gaps
  ↓
Build Roadmap
  ↓
Learn
  ↓
Practice
  ↓
Track Progress

The core idea is simple:

What do you know?
        +
What do you want to become?
        +
Where are your gaps?
        +
How well did you perform?
        ↓
What should you learn next?
📌 Project Highlights

AI-Powered: Hugging Face + Llama-based career intelligence

Adaptive: career-specific mock tests and learning recommendations

Personalized: skill gaps drive roadmap and learning content

Full-stack: React + FastAPI + SQLAlchemy

Authentication: token-based protected user flows

Resume Intelligence: AI-powered resume analysis

Career Intelligence: AI company-role matching

Learning: personalized 7-day learning plans

Practice: custom career-based practice questions

Tracking: roadmap, learning, and practice progress

Flexible: custom career goals supported in personalized practice

🔮 Future Improvements
User-specific cloud database persistence across all modules
Advanced mock-test analytics
Detailed skill proficiency history
AI interview simulator
AI-generated interview feedback
Resume-to-job matching
Job recommendation engine
Weekly AI roadmap re-planning
Advanced role benchmarking
Notifications and learning reminders
Automated backend and frontend tests
CI/CD pipeline
Production monitoring
Multi-provider AI support
More detailed career readiness scoring
📝 Project Status
Core MVP: Complete
User Registration: Complete
User Login: Complete
Student Dashboard: Complete
Student Profile: Complete
AI Skill Assessment: Complete
AI Resume Analysis: Complete
Adaptive AI Mock Test: Complete
AI Career Roadmap: Complete
7-Day AI Learning Plan: Complete
Personalized Practice Questions: Complete
AI Company Role Matching: Complete
Progress Tracking: Complete
GitHub Repository: Complete
Live Deployment: Next Step
👨‍💻 Author

Hardik Garg

GitHub: @hardikgarg30

Project: SkillBridge AI

⭐ Support

If you find SkillBridge AI useful or interesting, consider giving the repository a star.