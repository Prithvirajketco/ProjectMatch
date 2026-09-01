# ProjectMatch 🚀
> **AI-Powered Constraint-Aware Team Formation Platform**

ProjectMatch is a modern, full-stack application designed to assemble balanced, highly-capable project teams. Unlike traditional matchers that optimize only for basic skill similarity scores, ProjectMatch implements a **Three-Layer Prompt-Reasoning Pipeline** powered by `gemini-3.6-flash`. It parses messy, self-reported user profiles, evaluates candidate pools against complex project constraints, and self-critiques recommendations before presenting the final, human-explainable team.

---

## 🌐 Live Deployment Links

- **Frontend (Vercel):** [https://vercel.com/ketco/project-match/5ggm1NeQvxQxv8cLJMddQC7DFXAw](https://project-match-rust.vercel.app/)
- **Backend (Render API):** [https://projectmatch-backend1.onrender.com](https://projectmatch-backend1.onrender.com)

---

## ⚡ Core Features

- **Layered Reasoning Pipeline:** Runs Profile Extraction (Layer 1), Constraint-Aware Selection (Layer 2), and Validation Critique (Layer 3) with a feedback loop.
- **Explainable Team Assembly:** Provides clear Chain-of-Thought (CoT) reasoning for select choices, detailing why they were preferred over alternative candidates.
- **Robust Heuristic Fallbacks:** Handles rate limits or missing API keys gracefully by falling back to deterministic regex-based profile extraction and rule-based constraint matching.
- **Interactive Management Dashboard:** 
  - **Candidates:** Register and monitor structured profiles.
  - **Projects:** Design project requirements, skill constraints, and team size targets.
  - **Matching Pipeline:** Run matching evaluations, inspect timings, and visualize the critique feedback loop.
  - **Analytics:** Run and compare advanced AI configurations against naive single-prompt baselines.

---

## 🏗️ System Architecture

ProjectMatch coordinates three sequential agents to transform candidate descriptions into functional team networks.

```mermaid
graph TD
    A[Raw Candidate Self-Descriptions] --> L1["Layer 1: Profile Normalizer (LLM/Regex)"]
    L1 -->|Structured Candidate JSON| L2["Layer 2: Constraint-Aware Matching (CoT)"]
    L2 -->|Proposed Team + Reasoning Trace| L3{"Layer 3: Validator Critique"}
    L3 -->|Status: Revise (Max 2 Revisions)| L2
    L3 -->|Status: Approved| Out["Final Explainable Team Output"]
    
    style L1 fill:#4f46e5,stroke:#fff,stroke-width:2px,color:#fff
    style L2 fill:#0ea5e9,stroke:#fff,stroke-width:2px,color:#fff
    style L3 fill:#e11d48,stroke:#fff,stroke-width:2px,color:#fff
    style Out fill:#16a34a,stroke:#fff,stroke-width:2px,color:#fff
```

### The Three-Layer Pipeline

1. **Layer 1: Profile Extraction & Normalization**
   Extracts user skills (with confidence calibration: `low`/`medium`/`high`), interests, and availability limits. It flags ambiguous inputs under `uncertain_fields` instead of making wild assumptions.
2. **Layer 2: Constraint-Aware Selection**
   Receives normalized candidates and matches them against project requisites. It generates direct reason traces explaining the selection of each developer relative to alternatives.
3. **Layer 3: Critique & Revision Loop**
   Verifies the team structure against key software failure modes (role redundancy, single points of failure, availability conflicts, lack of tech expertise). If a validation failure is flagged, it returns actionable instructions to Layer 2 for revision.

---

## 💻 Tech Stack

- **Backend:** 
  - [FastAPI](https://fastapi.tiangolo.com/) (Web framework)
  - [MongoDB](https://www.mongodb.com/) (Database via `Motor` async driver)
  - [Google GenAI SDK](https://github.com/google/generative-ai-python) (`gemini-3.6-flash`)
- **Frontend:**
  - [React](https://react.dev/) + [Vite](https://vitejs.dev/) (Build tool & framework)
  - [TailwindCSS](https://tailwindcss.com/) (Styling)

---

## 📂 Project Structure

```
FAST SRM/
├── backend/
│   ├── mock_data/                   # Mock database utilities
│   │   └── seed_data.py             # Database seeder script
│   ├── prompts/                     # Prompt definition layouts
│   │   ├── layer1_extraction.py     # Layer 1 prompt & regex fallback
│   │   ├── layer2_matching.py       # Layer 2 system Prompt / matching logic
│   │   ├── layer3_critique.py       # Layer 3 validator rules & critique
│   │   ├── naive_baseline.py        # Baseline evaluation prompting
│   │   └── heuristic_fallback.py    # Hardcoded candidate matching heuristics
│   ├── routes/                      # Route handlers (Candidates, Projects, Matching)
│   ├── config.py                    # Environment & Model configurations
│   ├── database.py                  # PyMongo client initialization
│   ├── main.py                      # FastAPI entrypoint definition
│   └── pipeline.py                  # Core pipeline orchestrator
├── frontend/
│   ├── src/
│   │   ├── pages/                   # Application view dashboards
│   │   │   ├── AIFeatures.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Candidates.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Matching.jsx
│   │   │   └── Projects.jsx
│   │   ├── api.js                   # Client HTTP calls to FastAPI
│   │   ├── App.jsx                  # Root Layout and App shell routes
│   │   └── main.jsx
├── start_all.ps1                    # Main shell orchestration script
└── README.md                        # This file
```

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **MongoDB** running locally (`mongodb://localhost:27017`)
- **Gemini API Key** (optional, fallback heuristics are activated if key is absent)

### 🔧 Setup & Installations

#### 1. Repository Setup
Ensure your local database is running.

#### 2. Backend Config
In the `backend/` directory, create a `.env` file containing your credentials:
```env
GEMINI_API_KEY=your_gemini_api_key_here
HACKATHON_MODE=false
MONGO_URI=mongodb://localhost:27017
```

Create a virtual env and install requirements:
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn motor pymongo google-generativeai python-dotenv
```

#### 3. Frontend Config
Navigate to the `frontend/` directory and install local dependencies:
```bash
cd frontend
npm install
```

---

## 🏃 Running the Application

You can spin up the end-to-end framework (database seeding + backend server + frontend development dev-server) in one go using the provided PowerShell script.

From the repository **root**, run:
```powershell
./start_all.ps1
```

This script will:
1. Seed the local MongoDB database with mock candidates and projects.
2. Launch the **FastAPI Backend** on [http://localhost:8000](http://localhost:8000).
3. Launch the **Vite Frontend** development server on [http://localhost:5173](http://localhost:5173).

---

## 🧪 Evaluation & Naive Baselines
You can verify the accuracy improvement of this multi-agent pipeline over a standard single-prompt query by accessing the **Analytics** tab in the dashboard. The framework keeps track of:
- Layer execution durations (timings in milliseconds for extraction, matching, and critique).
- Comparative performance ratios.
- Revision cycles (feedback loops triggered by Layer 3 validator).
