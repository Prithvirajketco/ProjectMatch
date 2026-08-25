"""
Naive Baseline Matcher — Zero LLM.

A deliberately simple keyword-overlap matcher used as a control group
to demonstrate how much better the 3-layer AI pipeline performs.

Algorithm:
1. For each candidate, count how many required skills appear in their profile.
2. Sort by match count (descending), then by availability (descending).
3. Pick the top N candidates (team_size).
4. Assign roles by first-matched-skill.

This intentionally has NO:
- Confidence weighting
- Redundancy avoidance
- Coverage gap detection
- Reasoning traces
- Self-correction
"""


def run_naive(project_reqs: dict, candidates: list) -> dict:
    """Pure keyword-overlap matcher. No LLM calls."""
    required_skills = [s.lower() for s in project_reqs.get("required_skills", [])]
    team_size = project_reqs.get("team_size", 3)
    
    scored = []
    for c in candidates:
        # Extract candidate skill names (handle both dict and list formats)
        candidate_skills = []
        for s in c.get("skills", []):
            if isinstance(s, dict):
                candidate_skills.append(s.get("name", "").lower())
            elif isinstance(s, str):
                candidate_skills.append(s.lower())
        
        # Simple keyword overlap count — no confidence weighting
        match_count = sum(1 for req in required_skills if any(
            req in cs or cs in req for cs in candidate_skills
        ))
        
        # Get availability hours
        avail = c.get("availability", {})
        hours = avail.get("hours_per_week", 0) if isinstance(avail, dict) else 0
        
        scored.append({
            "candidate": c,
            "match_count": match_count,
            "hours": hours,
            "skills_matched": candidate_skills
        })
    
    # Sort: most skill matches first, then most availability
    scored.sort(key=lambda x: (x["match_count"], x["hours"]), reverse=True)
    
    # Pick top N
    picked = scored[:team_size]
    
    team = []
    for entry in picked:
        c = entry["candidate"]
        cid = c.get("_id", c.get("id", "unknown"))
        cname = c.get("name", "Unknown")
        
        # Assign role from first matching skill (very naive)
        if entry["skills_matched"]:
            role = entry["skills_matched"][0].title() + " Developer"
        else:
            role = "General Contributor"
        
        reason = f"Matched {entry['match_count']}/{len(required_skills)} required skills."
        
        team.append({
            "candidate_id": str(cid),
            "candidate_name": cname,
            "role": role,
            "reason": reason
        })
    
    # No coverage check — this is intentionally naive
    return {
        "team": team,
        "coverage_check": {},
        "alternatives_considered": []
    }
