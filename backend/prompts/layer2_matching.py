import json
import google.generativeai as genai
from config import MODEL_NAME, USE_LLM
from prompts.heuristic_fallback import heuristic_match


SYSTEM_PROMPT = """
You are a technical team assembly AI.
Given a Project's requirements and a list of Candidate profiles, select the optimal team.

You MUST optimize for:
1. Complete skill coverage (cover all required skills).
2. Minimizing redundancy (don't pick 2 frontend devs if only 1 is needed).
3. Availability balance.

You MUST use Chain-of-Thought reasoning. Explain explicitly WHY a person was chosen over others.

Output MUST be strictly JSON matching this schema:
{
  "team": [
    {
      "candidate_id": "string",
      "candidate_name": "string",
      "role": "string",
      "reason": "String explaining why they were chosen over alternative X."
    }
  ],
  "coverage_check": {
    "skill_name_1": "covered",
    "skill_name_2": "gap"
  },
  "alternatives_considered": ["Briefly list who else was considered but rejected and why."]
}
"""

def run_layer2(project_reqs: dict, candidates: list, critique_feedback: str = None) -> dict:
    """Constraint-aware team matching. Falls back to heuristic if LLM unavailable."""
    if not USE_LLM:
        return heuristic_match(project_reqs, candidates)
    
    try:
        model = genai.GenerativeModel(MODEL_NAME, system_instruction=SYSTEM_PROMPT)
        
        prompt = f"Project Requirements:\n{json.dumps(project_reqs, indent=2)}\n\n"
        prompt += f"Candidates Pool:\n{json.dumps(candidates, indent=2)}\n\n"
        
        if critique_feedback:
            prompt += f"PREVIOUS FEEDBACK TO FIX:\n{critique_feedback}\nAdjust the team to address this issue.\n"
            
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.3
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"[Layer 2] LLM call failed ({e}), falling back to heuristic.")
        return heuristic_match(project_reqs, candidates)
