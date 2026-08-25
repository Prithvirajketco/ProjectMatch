import sys
import os
import time

# Add parent directory to path for standalone execution
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.pipeline import run_match_pipeline, run_naive_match

# Eval test cases — each with a candidate pool, project requirements, and ideal team
TEST_CASES = [
    {
        "name": "Missing critical skill — naive picks wrong candidate",
        "description": "Naive should grab Dev C (most skills listed) but miss the domain expert. Pipeline should pick the correct trio.",
        "project": {
            "title": "Medical ML App",
            "required_skills": ["Python", "React", "Healthcare Domain"],
            "team_size": 3,
            "must_have_roles": []
        },
        "candidates": [
            {"_id": "1", "name": "Dev A", "skills": [{"name": "Python", "confidence": "high"}], "availability": {"hours_per_week": 20, "windows": []}},
            {"_id": "2", "name": "Dev B", "skills": [{"name": "React", "confidence": "high"}], "availability": {"hours_per_week": 15, "windows": []}},
            {"_id": "3", "name": "Dev C", "skills": [{"name": "Node", "confidence": "medium"}, {"name": "CSS", "confidence": "low"}], "availability": {"hours_per_week": 30, "windows": []}},
            {"_id": "4", "name": "Expert D", "skills": [{"name": "Healthcare Domain", "confidence": "high"}], "availability": {"hours_per_week": 10, "windows": []}}
        ],
        "expected_ideal_team_ids": ["1", "2", "4"]
    },
    {
        "name": "Redundant specialists — naive picks duplicates",
        "description": "Two strong React devs exist but only one frontend spot. Naive may pick both.",
        "project": {
            "title": "Fullstack Dashboard",
            "required_skills": ["React", "Python", "SQL"],
            "team_size": 3,
            "must_have_roles": []
        },
        "candidates": [
            {"_id": "1", "name": "React Pro 1", "skills": [{"name": "React", "confidence": "high"}], "availability": {"hours_per_week": 20, "windows": []}},
            {"_id": "2", "name": "React Pro 2", "skills": [{"name": "React", "confidence": "high"}], "availability": {"hours_per_week": 25, "windows": []}},
            {"_id": "3", "name": "Python Dev", "skills": [{"name": "Python", "confidence": "high"}], "availability": {"hours_per_week": 15, "windows": []}},
            {"_id": "4", "name": "SQL Wizard", "skills": [{"name": "SQL", "confidence": "high"}], "availability": {"hours_per_week": 10, "windows": []}},
        ],
        "expected_ideal_team_ids": ["1", "3", "4"]  # or ["2", "3", "4"]
    },
    {
        "name": "All-generalist trap — no deep expertise",
        "description": "Generalists look good on paper but lack depth. Pipeline should prefer specialists.",
        "project": {
            "title": "AI Chatbot",
            "required_skills": ["Python", "React", "Machine Learning"],
            "team_size": 3,
            "must_have_roles": []
        },
        "candidates": [
            {"_id": "1", "name": "Generalist A", "skills": [{"name": "Python", "confidence": "low"}, {"name": "React", "confidence": "low"}, {"name": "Machine Learning", "confidence": "low"}], "availability": {"hours_per_week": 20, "windows": []}},
            {"_id": "2", "name": "Generalist B", "skills": [{"name": "Python", "confidence": "low"}, {"name": "React", "confidence": "low"}], "availability": {"hours_per_week": 25, "windows": []}},
            {"_id": "3", "name": "ML Expert", "skills": [{"name": "Machine Learning", "confidence": "high"}, {"name": "Python", "confidence": "high"}], "availability": {"hours_per_week": 15, "windows": []}},
            {"_id": "4", "name": "React Expert", "skills": [{"name": "React", "confidence": "high"}], "availability": {"hours_per_week": 10, "windows": []}},
        ],
        "expected_ideal_team_ids": ["3", "4", "1"]  # Specialists + one generalist to fill
    },
    {
        "name": "Single point of failure — low-availability critical role",
        "description": "Only one person has a critical skill but they're barely available.",
        "project": {
            "title": "Compliance App",
            "required_skills": ["Python", "Healthcare Domain"],
            "team_size": 2,
            "must_have_roles": []
        },
        "candidates": [
            {"_id": "1", "name": "Dev A", "skills": [{"name": "Python", "confidence": "high"}], "availability": {"hours_per_week": 30, "windows": []}},
            {"_id": "2", "name": "Domain Expert", "skills": [{"name": "Healthcare Domain", "confidence": "high"}], "availability": {"hours_per_week": 2, "windows": []}},
        ],
        "expected_ideal_team_ids": ["1", "2"]  # Must pick both, but pipeline should flag the SPOF risk
    },
    {
        "name": "Empty skills — vague profile handling",
        "description": "A candidate with no parseable skills should be ranked lowest.",
        "project": {
            "title": "Web App",
            "required_skills": ["React", "Python"],
            "team_size": 2,
            "must_have_roles": []
        },
        "candidates": [
            {"_id": "1", "name": "Vague Person", "skills": [], "availability": {"hours_per_week": 40, "windows": []}},
            {"_id": "2", "name": "React Dev", "skills": [{"name": "React", "confidence": "high"}], "availability": {"hours_per_week": 10, "windows": []}},
            {"_id": "3", "name": "Python Dev", "skills": [{"name": "Python", "confidence": "medium"}], "availability": {"hours_per_week": 15, "windows": []}},
        ],
        "expected_ideal_team_ids": ["2", "3"]
    },
]


def calculate_jaccard(set1, set2):
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    return intersection / union if union > 0 else 0


def flexible_match(predicted_ids, ideal_ids):
    """For cases like 'redundant specialists' where multiple correct answers exist."""
    return calculate_jaccard(predicted_ids, ideal_ids)


def run_eval():
    print("=" * 60)
    print("  ProjectMatch Evaluation Harness")
    print("=" * 60)
    
    results = []
    naive_wins = 0
    pipeline_wins = 0
    
    for i, case in enumerate(TEST_CASES, 1):
        print(f"\n[{i}/{len(TEST_CASES)}] {case['name']}")
        print(f"  -> {case['description']}")
        
        # Naive
        start = time.time()
        naive_out = run_naive_match(case["project"], case["candidates"])
        naive_time = int((time.time() - start) * 1000)
        naive_team_ids = {m["candidate_id"] for m in naive_out["team_output"].get("team", [])}
        
        # Pipeline
        start = time.time()
        pipeline_out = run_match_pipeline(case["project"], case["candidates"])
        pipeline_time = int((time.time() - start) * 1000)
        pipeline_team_ids = {m["candidate_id"] for m in pipeline_out["team_output"].get("team", [])}
        
        ideal_ids = set(case["expected_ideal_team_ids"])
        
        naive_score = flexible_match(naive_team_ids, ideal_ids)
        pipeline_score = flexible_match(pipeline_team_ids, ideal_ids)
        
        revisions = len(pipeline_out["critique_history"]) - 1 if pipeline_out["critique_history"] else 0
        
        if pipeline_score > naive_score:
            pipeline_wins += 1
        elif naive_score > pipeline_score:
            naive_wins += 1
        
        results.append({
            "case_name": case["name"],
            "naive_score": naive_score,
            "pipeline_score": pipeline_score,
            "pipeline_revisions": revisions,
            "naive_time_ms": naive_time,
            "pipeline_time_ms": pipeline_time,
            "naive_picked": naive_team_ids,
            "pipeline_picked": pipeline_team_ids,
            "ideal": ideal_ids,
        })
        
        print(f"  Naive:    {naive_score*100:.0f}% match (picked {naive_team_ids}) [{naive_time}ms]")
        print(f"  Pipeline: {pipeline_score*100:.0f}% match (picked {pipeline_team_ids}) [{pipeline_time}ms] (revisions: {revisions})")
    
    print("\n" + "=" * 60)
    print("  SUMMARY")
    print("=" * 60)
    
    avg_naive = sum(r["naive_score"] for r in results) / len(results) * 100
    avg_pipeline = sum(r["pipeline_score"] for r in results) / len(results) * 100
    
    print(f"  Cases:          {len(TEST_CASES)}")
    print(f"  Naive avg:      {avg_naive:.1f}%")
    print(f"  Pipeline avg:   {avg_pipeline:.1f}%")
    print(f"  Pipeline wins:  {pipeline_wins}/{len(TEST_CASES)}")
    print(f"  Naive wins:     {naive_wins}/{len(TEST_CASES)}")
    print(f"  Improvement:    {avg_pipeline - avg_naive:+.1f}pp")
    print("=" * 60)


if __name__ == "__main__":
    run_eval()
