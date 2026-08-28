# SkillBridge AI Deployment 🚀

## Local

### Backend

```powershell
cd server
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env

Add your Hugging Face API key to server/.env:

HF_API_KEY=your_huggingface_api_key

Start the backend:

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

If Vite selects another available port, use the URL shown in the terminal.

The local frontend communicates with:

http://127.0.0.1:8000
Production
Backend — Render

Deploy the server directory as a Python Web Service.

Root Directory:

server

Build Command:

pip install -r requirements.txt

Start Command:

uvicorn app.main:app --host 0.0.0.0 --port $PORT

Environment Variable:

HF_API_KEY=your_huggingface_api_key

After deployment, the backend will be available at a URL similar to:

https://skillbridge-ai-backend.onrender.com

FastAPI documentation:

https://skillbridge-ai-backend.onrender.com/docs
Frontend — Vercel

Deploy the client directory as the frontend.

Root Directory:

client

Build Command:

npm run build

Install Command:

npm install

Output Directory:

dist

Frontend Environment Variable:

VITE_API_URL=https://skillbridge-ai-backend.onrender.com

Replace the backend URL with the actual Render URL.

After deployment, the frontend will be available at a URL similar to:

https://skillbridge-ai.vercel.app
Environment Variables
Backend
HF_API_KEY=your_huggingface_api_key
Frontend

Local:

VITE_API_URL=http://127.0.0.1:8000

Production:

VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com

Never commit real .env files or API keys to GitHub.

Production API Configuration

The frontend must use the deployed backend URL instead of localhost.

Example:

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";

Local:

http://127.0.0.1:8000

Production:

https://YOUR-BACKEND-URL.onrender.com
CORS

The FastAPI backend must allow the production frontend origin.

Local origins:

http://localhost:5173
http://localhost:5174
http://localhost:5175
http://localhost:5176

Production origin:

https://YOUR-FRONTEND.vercel.app

Replace the production value with the actual Vercel URL.

AI Configuration

SkillBridge AI uses:

Hugging Face Inference API
Llama 3.1 8B Instruct

AI-powered features include:

AI Skill Analysis
AI Resume Analysis
Adaptive AI Mock Test
AI Career Roadmap
7-Day Learning Plan
Practice Questions
Company Role Matching

The Hugging Face API key is configured through:

HF_API_KEY
AI Mock Test Flow
Career Goal
      +
Experience Level
      +
Technical Skills
      +
Skill Gaps
      ↓
FastAPI Backend
      ↓
Hugging Face AI
      ↓
Career-Specific Mock Test
      ↓
Student Answers
      ↓
Mock Test Score
AI Roadmap Flow
Skill Assessment
      ↓
AI Skill Analysis
      ↓
Strong Skills + Skill Gaps
      +
Mock Test Performance
      ↓
FastAPI Backend
      ↓
Hugging Face AI
      ↓
Personalized Career Roadmap
AI Learning Plan Flow
Career Goal
      +
Experience Level
      +
Skill Gaps
      ↓
FastAPI Backend
      ↓
Hugging Face AI
      ↓
7-Day Learning Plan
Resume Analysis Flow
Resume Upload
      ↓
React Frontend
      ↓
FastAPI Backend
      ↓
Hugging Face AI
      ↓
Skills
Experience
Education
Certifications
Skill Gaps
Recommended Roles
Professional Summary
Authentication
Create Account
      ↓
Login
      ↓
Authentication Token
      ↓
Protected API Routes
      ↓
Dashboard
Database

Current database:

SQLite

ORM:

SQLAlchemy

Main entities:

Users
Assessments
Roadmaps
Learning Plans
Resumes
Progress

For larger production deployments, SQLite can be replaced with PostgreSQL.

Production SPA Routing

The frontend uses React Router.

Production hosting must serve the React application entry point for routes such as:

/login
/register
/dashboard
/assessment
/mock-test
/roadmap
/learning-plan
/practice-questions
/company-roles
/resume-analysis
/progress

Configure SPA fallback/rewrite behavior on the frontend hosting platform.

Production Testing
[ ] Frontend loads
[ ] Backend loads
[ ] /docs works
[ ] Registration works
[ ] Login works
[ ] Dashboard works
[ ] Student Profile works
[ ] Assessment works
[ ] AI Skill Analysis works
[ ] AI Mock Test works
[ ] Mock Test Score works
[ ] AI Roadmap works
[ ] Learning Plan works
[ ] Practice Questions work
[ ] Resume Analysis works
[ ] Company Roles work
[ ] Progress works
[ ] Logout works
[ ] CORS works
[ ] HF_API_KEY configured