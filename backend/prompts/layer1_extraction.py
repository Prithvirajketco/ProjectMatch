import json
import re
import google.generativeai as genai
from config import MODEL_NAME, USE_LLM


SYSTEM_PROMPT = """
You are an expert technical recruiter. Your job is to extract structured profile data from messy, free-text self-descriptions.
You must return ONLY valid JSON matching this schema:
{
  "skills": [{"name": "string", "confidence": "low" | "medium" | "high"}],
  "interests": ["string"],
  "availability": {"hours_per_week": int, "windows": ["string"]},
  "uncertain_fields": ["string"]
}

Confidence Calibration Rules:
- "low": took one course, dabbled, beginner, knows a little
- "medium": built a few projects, comfortable, intermediate
- "high": worked professionally, expert, deep knowledge

Few-shot examples:
Input: "I built 3 fullstack apps with React and Node. I know some Python from a bootcamp. Free evenings and weekends, can do about 15 hours."
Output: {
  "skills": [
    {"name": "React", "confidence": "high"},
    {"name": "Node.js", "confidence": "high"},
    {"name": "Python", "confidence": "low"}
  ],
  "interests": ["fullstack"],
  "availability": {"hours_per_week": 15, "windows": ["evenings", "weekends"]},
  "uncertain_fields": []
}

Input: "i like ai. might be free."
Output: {
  "skills": [],
  "interests": ["AI"],
  "availability": {"hours_per_week": 0, "windows": []},
  "uncertain_fields": ["availability_hours", "specific_skills"]
}
"""

# Common tech keywords for heuristic fallback
_KNOWN_SKILLS = [
    "python", "javascript", "react", "node.js", "node", "vue", "angular",
    "java", "spring boot", "sql", "postgresql", "mongodb", "aws", "docker",
    "kubernetes", "k8s", "figma", "html", "css", "flutter", "react native",
    "pytorch", "tensorflow", "pandas", "machine learning", "ml", "ai",
    "ux", "ui", "design", "data engineering", "airflow", "ci/cd",
    "devops", "go", "rust", "c++", "typescript", "next.js", "django",
    "fastapi", "flask", "tailwind", "graphql", "redis",
    "healthcare domain", "healthcare", "marketing", "product management",
]

_CONFIDENCE_HINTS = {
    "high": ["expert", "professional", "production", "deep", "strong", "rock solid", "built", "shipped", "years", "advanced"],
    "low": ["some", "basic", "beginner", "little", "dabbled", "bootcamp", "course", "kinda", "bit of", "not super"],
}


def _heuristic_extract(raw_text: str) -> dict:
    """Zero-LLM fallback: regex + keyword extraction."""
    text_lower = raw_text.lower()
    
    # Extract skills
    found_skills = []
    for skill in _KNOWN_SKILLS:
        if skill in text_lower:
            # Determine confidence from context
            confidence = "medium"  # default
            for word in _CONFIDENCE_HINTS["high"]:
                if word in text_lower:
                    confidence = "high"
                    break
            for word in _CONFIDENCE_HINTS["low"]:
                if word in text_lower:
                    # Check if the low-confidence hint is near this skill
                    skill_pos = text_lower.find(skill)
                    hint_pos = text_lower.find(word)
                    if abs(skill_pos - hint_pos) < 60:
                        confidence = "low"
                        break
            found_skills.append({"name": skill.title(), "confidence": confidence})
    
    # Extract hours
    hours_match = re.search(r'(\d+)\s*(?:hours?|hrs?)', text_lower)
    hours = int(hours_match.group(1)) if hours_match else 0
    
    # Extract windows
    windows = []
    for window in ["morning", "afternoon", "evening", "weekend", "weekday", "night"]:
        if window in text_lower:
            windows.append(window + "s" if not window.endswith("s") else window)
    
    # Extract interests
    interest_keywords = ["ai", "machine learning", "web", "mobile", "data", "design", 
                         "healthcare", "fintech", "education", "fullstack", "backend", "frontend"]
    interests = [kw.title() for kw in interest_keywords if kw in text_lower]
    
    uncertain = []
    if not found_skills:
        uncertain.append("specific_skills")
    if hours == 0:
        uncertain.append("availability_hours")
    
    return {
        "skills": found_skills,
        "interests": interests,
        "availability": {"hours_per_week": hours, "windows": windows},
        "uncertain_fields": uncertain
    }


def run_layer1(raw_text: str) -> dict:
    """Extract structured profile from free-text. Falls back to heuristic if LLM unavailable."""
    if not USE_LLM:
        return _heuristic_extract(raw_text)
    
    try:
        model = genai.GenerativeModel(MODEL_NAME, system_instruction=SYSTEM_PROMPT)
        response = model.generate_content(
            raw_text,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"[Layer 1] LLM call failed ({e}), falling back to heuristic.")
        return _heuristic_extract(raw_text)
