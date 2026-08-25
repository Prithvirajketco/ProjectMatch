import time
import logging
from .prompts.layer1_extraction import run_layer1
from .prompts.layer2_matching import run_layer2
from .prompts.layer3_critique import run_layer3
from .prompts.naive_baseline import run_naive

logger = logging.getLogger(__name__)


def run_full_pipeline(project_reqs: dict, raw_candidates: list[dict]) -> dict:
    """Full 3-layer pipeline: normalize raw text -> match -> critique.
    
    Use this when candidates have NOT been pre-processed through Layer 1.
    Each candidate dict must have at least 'name' and 'raw_text' keys.
    """
    start = time.time()
    
    # Layer 1: Normalize each raw candidate
    normalized = []
    for c in raw_candidates:
        raw_text = c.get("raw_text", "")
        if raw_text:
            profile = run_layer1(raw_text)
            normalized.append({
                "name": c.get("name", "Unknown"),
                "_id": c.get("_id", c.get("id", "")),
                "raw_text": raw_text,
                **profile
            })
        else:
            normalized.append(c)
    
    l1_time = int((time.time() - start) * 1000)
    
    # Layers 2+3: Match and critique
    result = run_match_pipeline(project_reqs, normalized)
    result["layer_timings"] = {
        "layer1_ms": l1_time,
        "layer2_3_ms": result["time_ms"],
        "total_ms": int((time.time() - start) * 1000),
    }
    return result


def run_match_pipeline(project_reqs: dict, candidates: list) -> dict:
    """Layer 2 + Layer 3 loop. Candidates should already be normalized.
    
    Runs constraint-aware matching, then critique with up to 2 revisions.
    """
    max_revisions = 2
    revisions = 0
    feedback = None
    
    critique_history = []
    
    start_l2 = time.time()
    while revisions <= max_revisions:
        # Layer 2: Match
        try:
            proposed_team = run_layer2(project_reqs, candidates, feedback)
        except Exception as e:
            logger.error(f"[Pipeline] Layer 2 failed: {e}")
            proposed_team = {
                "team": [],
                "coverage_check": {s: "gap" for s in project_reqs.get("required_skills", [])},
                "alternatives_considered": [f"Layer 2 error: {e}"]
            }
            break
        
        # Layer 3: Critique
        try:
            critique = run_layer3(project_reqs, proposed_team)
        except Exception as e:
            logger.error(f"[Pipeline] Layer 3 failed: {e}")
            critique = {"status": "approved", "flagged_issue": None, "revision_note": None}
        
        critique_history.append(critique)
        
        if critique.get("status") == "approved":
            break
            
        feedback = critique.get("revision_note")
        revisions += 1
        
    return {
        "team_output": proposed_team,
        "critique_history": critique_history,
        "revision_count": revisions,
        "time_ms": int((time.time() - start_l2) * 1000)
    }


def run_naive_match(project_reqs: dict, candidates: list) -> dict:
    """Run the zero-LLM naive baseline matcher."""
    start = time.time()
    out = run_naive(project_reqs, candidates)
    return {
        "team_output": out,
        "time_ms": int((time.time() - start) * 1000)
    }
