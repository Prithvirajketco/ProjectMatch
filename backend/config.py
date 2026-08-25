import os
from pathlib import Path
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env from the backend directory (where this config file lives)
_backend_dir = Path(__file__).resolve().parent
load_dotenv(_backend_dir / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
HACKATHON_MODE = os.getenv("HACKATHON_MODE", "false").lower() == "true"

# Determine if LLM is available
USE_LLM = bool(GEMINI_API_KEY) and not HACKATHON_MODE

if USE_LLM:
    genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = "gemini-3.6-flash"

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "projectmatch"
