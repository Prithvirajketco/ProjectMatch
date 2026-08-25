"""
Heuristic Fallback Matcher — Zero LLM, Production-Quality.

Used when HACKATHON_MODE=true or when LLM calls fail.
This is a deterministic constraint-aware matcher that produces
reasonable team compositions without any API calls.

Unlike the naive baseline, this matcher:
- Weights skills by confidence level
- Checks coverage gaps
- Avoids redundancy
- Considers availability
- Generates reasoning traces
"""


def _skill_score(confidence: str) -> float:
    """Convert confidence level to a numeric weight."""
    return {"high": 1.0, "medium": 0.6, "low": 0.3}.get(confidence, 0.0)


def _candidate_skill_map(candidate: dict) -> dict:
    """Build a {skill_name_lower: confidence_score} map for a candidate."""
    skill_map = {}
    for s in candidate.get("skills", []):
        if isinstance(s, dict):
            name = s.get("name", "").lower()
            conf = s.get("confidence", "medium")
            skill_map[name] = _skill_score(conf)
        elif isinstance(s, str):
            skill_map[s.lower()] = 0.6  # default medium
    return skill_map


def _match_skill(required: str, candidate_skills: dict) -> float:
    """Fuzzy match a required skill against candidate's skills. Returns best score."""
    req_lower = required.lower()
    best = 0.0
    for skill_name, score in candidate_skills.items():
        if req_lower == skill_name or req_lower in skill_name or skill_name in req_lower:
            best = max(best, score)
    return best


def heuristic_match(project_reqs: dict, candidates: list) -> dict:
    """Deterministic constraint-aware team assembly. No LLM needed."""
    required_skills = project_reqs.get("required_skills", [])
    team_size = project_reqs.get("team_size", 3)
    must_have_roles = [r.lower() for r in project_reqs.get("must_have_roles", [])]
    
    # Score each candidate
    scored_candidates = []
    for c in candidates:
        skill_map = _candidate_skill_map(c)
        avail = c.get("availability", {})
        hours = avail.get("hours_per_week", 0) if isinstance(avail, dict) else 0
        
        # Compute per-skill match scores
        skill_scores = {}
        total_score = 0.0
        for req_skill in required_skills:
            score = _match_skill(req_skill, skill_map)
            skill_scores[req_skill] = score
            total_score += score
        
        # Availability bonus (normalized to 0-1, capped at 40hrs)
        avail_bonus = min(hours / 40.0, 1.0) * 0.5
        
        scored_candidates.append({
            "candidate": c,
            "skill_scores": skill_scores,
            "total_score": total_score + avail_bonus,
            "hours": hours,
            "best_skill": max(skill_scores, key=skill_scores.get) if skill_scores else None,
            "best_skill_score": max(skill_scores.values()) if skill_scores else 0
        })
    
    # Greedy selection: pick candidates that maximize uncovered skill coverage
    team = []
    covered_skills = set()
    remaining = list(scored_candidates)
    alternatives = []
    
    for _ in range(min(team_size, len(remaining))):
        # Re-score based on uncovered skills
        for sc in remaining:
            uncovered_score = sum(
                sc["skill_scores"].get(skill, 0)
                for skill in required_skills
                if skill not in covered_skills
            )
            sc["priority_score"] = uncovered_score + (sc["hours"] / 100.0)
        
        remaining.sort(key=lambda x: x["priority_score"], reverse=True)
        
        if not remaining:
            break
            
        best = remaining.pop(0)
        c = best["candidate"]
        
        # Determine role based on strongest matching skill
        if best["best_skill"]:
            role = f"{best['best_skill']} Specialist"
        else:
            role = "General Contributor"
        
        # Build reasoning trace
        runner_up = remaining[0] if remaining else None
        if runner_up:
            runner_up_name = runner_up["candidate"].get("name", "Unknown")
            reason = (
                f"Selected for {best['best_skill'] or 'general'} coverage "
                f"(score: {best['total_score']:.1f}, {best['hours']}h/week). "
                f"Chosen over {runner_up_name} (score: {runner_up['total_score']:.1f}) "
                f"due to better fit for uncovered skills."
            )
            alternatives.append(
                f"{runner_up_name} considered but ranked lower "
                f"(score {runner_up['total_score']:.1f} vs {best['total_score']:.1f})"
            )
        else:
            reason = f"Only available candidate for {best['best_skill'] or 'remaining'} coverage."
        
        # Mark skills as covered
        for skill in required_skills:
            if best["skill_scores"].get(skill, 0) >= 0.3:
                covered_skills.add(skill)
        
        cid = c.get("_id", c.get("id", "unknown"))
        team.append({
            "candidate_id": str(cid),
            "candidate_name": c.get("name", "Unknown"),
            "role": role,
            "reason": reason
        })
    
    # Build coverage check
    coverage_check = {}
    for skill in required_skills:
        coverage_check[skill] = "covered" if skill in covered_skills else "gap"
    
    return {
        "team": team,
        "coverage_check": coverage_check,
        "alternatives_considered": alternatives
    }
