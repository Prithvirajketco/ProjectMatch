import json
import google.generativeai as genai
from ..config import MODEL_NAME, USE_LLM

SYSTEM_PROMPT = """
You are an independent AI Validator.
Review the Proposed Team for the Project Requirements.
Check against this Failure Mode Checklist:
1. All-generalist team (missing deep expertise / 'high' confidence in required skills).
2. Single point of failure on a critical skill.
3. Availability conflict (someone doing too much).
4. Redundant role clash.
5. Missing required skill coverage.

Return STRICT JSON:
{
  "status": "approved" | "revise",
  "flagged_issue": "Name of issue from checklist or null",
  "revision_note": "Detailed instruction on what to fix or null"
}

Be strict. If the team is sub-optimal, output 'revise'.
"""


def _heuristic_critique(project_reqs: dict, proposed_team: dict) -> dict:
    """Zero-LLM critique: check for obvious issues."""
    team = proposed_team.get("team", [])
    required_skills = [s.lower() for s in project_reqs.get("required_skills", [])]
    desired_size = project_reqs.get("team_size", 3)
    coverage = proposed_team.get("coverage_check", {})
    
    # Check for gaps in coverage
    gaps = [skill for skill, status in coverage.items() if status == "gap"]
    if gaps:
        return {
            "status": "revise",
            "flagged_issue": "Missing required skill coverage",
            "revision_note": f"The following required skills have gaps: {', '.join(gaps)}. Find candidates who cover them."
        }
    
    # Check team size
    if len(team) < desired_size:
        return {
            "status": "revise",
            "flagged_issue": "Team too small",
            "revision_note": f"Team has {len(team)} members but {desired_size} are needed."
        }
    
    # Check for redundant roles
    roles = [m.get("role", "").lower() for m in team]
    seen = set()
    for role in roles:
        if role in seen:
            return {
                "status": "revise",
                "flagged_issue": "Redundant role clash",
                "revision_note": f"Multiple team members assigned the same role: '{role}'. Diversify."
            }
        seen.add(role)
    
    return {"status": "approved", "flagged_issue": None, "revision_note": None}


def run_layer3(project_reqs: dict, proposed_team: dict) -> dict:
    """Critique the proposed team. Falls back to heuristic if LLM unavailable."""
    if not USE_LLM:
        return _heuristic_critique(project_reqs, proposed_team)
    
    try:
        model = genai.GenerativeModel(MODEL_NAME, system_instruction=SYSTEM_PROMPT)
        
        prompt = f"Project Requirements:\n{json.dumps(project_reqs, indent=2)}\n\n"
        prompt += f"Proposed Team Output:\n{json.dumps(proposed_team, indent=2)}\n"
            
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json",
                temperature=0.1
            )
        )
        return json.loads(response.text)
    except Exception as e:
        print(f"[Layer 3] LLM call failed ({e}), falling back to heuristic critique.")
        return _heuristic_critique(project_reqs, proposed_team)
