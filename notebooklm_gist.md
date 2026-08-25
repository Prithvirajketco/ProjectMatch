# ProjectMatch - NotebookLM Context Document

## 1. Project Overview
**ProjectMatch** is a team formation platform built for the **FAST Hackathon** (Problem Statement 2). Its purpose is to intelligently match people into effective project teams based on skills, interests, and availability. 

Unlike traditional similarity-score matchers that optimize for skill overlap, ProjectMatch optimizes for **team completeness** and relies on a **layered AI reasoning pipeline** to explicitly reason about team coverage, trade-offs, and self-critiques before presenting recommendations.

## 2. Core System Architecture: Three-Layer Prompt Pipeline
The heart of the application is a 3-layer LLM pipeline (implemented in `backend/pipeline.py`):

*   **Layer 1: Profile Extraction & Normalization**
    *   **Goal:** Convert free-text, messy candidate descriptions into structured JSON.
    *   **Output:** Skills (with confidence levels, not just booleans), interests, and availability.
*   **Layer 2: Constraint-Aware Matching**
    *   **Goal:** Take project requirements and candidate pools to generate a ranked team.
    *   **Output:** The matched team with a **reasoning trace** (a sentence explaining *why* a candidate was chosen over alternatives). It explicitly checks for full skill coverage, workload balance, and redundancy.
*   **Layer 3: Critique & Revision Pass**
    *   **Goal:** Acts as an automated judge to review Layer 2's proposed team.
    *   **Output:** Approves or flags specific failure modes (e.g., single point of failure, missing critical skill). If rejected, the feedback loops back into Layer 2 for a revision (up to a max of 2 revisions).

*Note: The platform also features a "naive baseline" pipeline to quantitatively demonstrate the superiority of the 3-layer engineered pipeline.*

## 3. Tech Stack & Project Structure

### Backend (Python / FastAPI)
Located in the `backend/` directory.
*   **Framework:** FastAPI (`backend/main.py`) running via Uvicorn.
*   **Endpoints:** Routes for Candidates, Projects, and Matching (`backend/routes/`).
*   **Core Logic:** The matching pipeline is orchestrated in `backend/pipeline.py`.
*   **Prompts:** LLM logic for the various layers and baseline (`backend/prompts/`).
*   **Mock Data:** Scripts to seed the database (`backend/mock_data/seed_data.py`).

### Frontend (JavaScript / React / Vite)
Located in the `frontend/` directory.
*   **Framework:** React powered by Vite (`vite.config.js`).
*   **Styling:** Tailwind CSS (`tailwind.config.js`).
*   **Source Code:** Lives in `frontend/src/`.

### Run Configuration
*   A root PowerShell script `start_all.ps1` seeds the mock data and concurrently starts the FastAPI backend (venv) and Vite frontend (npm run dev).

## 4. Primary Use Cases
1.  **Project Owners:** Submit project requirements (needed skills, team size, roles).
2.  **Candidates:** Provide free-text profiles.
3.  **Evaluators/Judges:** View the matched teams side-by-side with the naive baseline, explicitly evaluating the reasoning trace and the quality of the multi-layered decisions.

## 5. Key Files to Reference
*   `ProjectMatch_PRD.md`: The canonical Product Requirements Document outlining goals, schema, and eval plans.
*   `backend/pipeline.py`: The orchestrator of the matching and critique loop.
*   `backend/prompts/`: Contains the actual instructions driving the LLM layers.
*   `start_all.ps1`: Defines how the application is initialized and run locally.
