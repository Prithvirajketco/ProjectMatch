# Product Requirements Document — ProjectMatch

**Team Formation Platform powered by a layered prompt-reasoning system**
Prepared for: FAST Hackathon — Problem Statement 2
Status: Draft v1.0

---

## 1. Overview

ProjectMatch is a platform that helps people form effective project teams by matching them based on skills, interests, availability, and project requirements. Unlike similarity-score matchers, ProjectMatch is built around a **layered AI reasoning pipeline** that extracts structured signal from messy self-reported profiles, reasons explicitly about team coverage and trade-offs, and self-critiques its own output before presenting a recommendation.

The core differentiator: **most matchers optimize for skill overlap; ProjectMatch optimizes for team completeness and explains its trade-offs the way a human organizer would.**

## 2. Problem Statement

When people need to form teams for projects, research, or startups, they often rely on existing social connections, which limits access to complementary skills. It's difficult to discover people with data engineering, design, or domain expertise, while a researcher may need a designer and someone with complementary skills, while neither knows the other is available or interested.

## 3. Goals

- Turn free-text, inconsistent self-descriptions into structured, comparable candidate profiles.
- Given a project's requirements and a candidate pool, produce a ranked team composition that maximizes skill coverage, balances workload/availability, and avoids common failure patterns (redundant specialists, single points of failure, all-generalist teams).
- Explain every match decision in plain language, including why alternative candidates were not selected.
- Catch and correct flawed team compositions before presenting them, via an automated critique pass.
- Demonstrate, quantitatively, that the engineered prompt pipeline outperforms a naive single-prompt baseline.

## 4. Non-Goals (Out of Scope for Competition Build)

- Payment, contracts, or legal team-formation agreements.
- Long-term project management / task tracking after a team is formed.
- Full production-grade authentication, moderation, or abuse handling (basic guardrails only).
- Mobile app — web demo is sufficient.

## 5. Users

- **Project Owner / Organizer** — has a project idea, needs a team, provides requirements.
- **Candidate / Contributor** — has skills and availability, wants to join a team.
- **Judge / Evaluator (competition context)** — needs to see the reasoning quality, not just the output.

## 6. Core System Architecture — Three-Layer Prompt Pipeline

### Layer 1 — Profile Extraction & Normalization
- **Input:** Free-text self-description (e.g., "I know some Python, kinda into design too, free most evenings").
- **Output:** Structured JSON — skills (each with a proficiency/confidence estimate, not a boolean), interests, availability windows, and an explicit `uncertain_fields` array for anything the model couldn't confidently infer.
- **Technique:** Few-shot calibration examples showing correctly-calibrated confidence levels (e.g., "built 3 projects in X" → high confidence; "took one course" → low confidence).

### Layer 2 — Constraint-Aware Matching
- **Input:** Project requirement profile (required skills, team size, must-have roles) + candidate pool (Layer 1 outputs).
- **Output:** Ranked team composition with a **reasoning trace** — one sentence per pick explaining why that person was chosen over the next-best alternative.
- **Requirements checked explicitly:** full skill coverage, redundancy avoidance where not needed, availability/workload balance.
- **Technique:** Chain-of-thought reasoning forced *before* the model commits to a team (not after, to avoid post-hoc rationalization). Structured JSON output.

### Layer 3 — Critique & Revision Pass
- **Input:** Layer 2's proposed team + reasoning trace.
- **Output:** Either an approval or a revision note flagging a specific failure mode (all-generalist team, single point of failure on a critical skill, uncaught availability conflict, redundant role clash).
- **Technique:** Independent critique prompt, structurally separate from Layer 2, checking against a defined failure-mode checklist rather than free-form review.

## 7. Data Schema (draft)

```json
// Candidate Profile (Layer 1 output)
{
  "candidate_id": "string",
  "skills": [
    { "name": "string", "confidence": "low | medium | high" }
  ],
  "interests": ["string"],
  "availability": { "hours_per_week": "number", "windows": ["string"] },
  "uncertain_fields": ["string"]
}

// Project Requirements
{
  "project_id": "string",
  "required_skills": ["string"],
  "team_size": "number",
  "must_have_roles": ["string"]
}

// Match Output (Layer 2)
{
  "team": [
    { "candidate_id": "string", "role": "string", "reason": "string" }
  ],
  "coverage_check": { "skill": "covered | gap" },
  "alternatives_considered": ["string"]
}

// Critique Output (Layer 3)
{
  "status": "approved | revise",
  "flagged_issue": "string | null",
  "revision_note": "string | null"
}
```

## 8. Functional Requirements

| ID | Requirement |
|----|-------------|
| F1 | User can submit a free-text profile and receive a structured extraction |
| F2 | User can submit a project's requirements |
| F3 | System returns a ranked team with per-pick reasoning |
| F4 | System runs a critique pass and revises before final output |
| F5 | System flags when no candidate pool can satisfy a required skill, rather than forcing a bad match |
| F6 | System handles near-empty/vague profiles gracefully (flags low confidence rather than guessing) |

## 9. Non-Functional Requirements

- **Explainability:** Every output must include human-readable reasoning, not just scores.
- **Auditability:** All intermediate layer outputs are structured JSON and logged/inspectable.
- **Cost-awareness:** Use a lighter/cheaper model for Layer 1 (extraction) and reserve deeper reasoning capacity for Layer 2/3.
- **Latency:** Precompute/cache Layer 1 extractions where possible so live demo matching feels near-instant.
- **Guardrails:** Basic content filtering on free-text input (inappropriate/nonsensical profile text).

## 10. Evaluation Plan

- Build a small hand-labeled eval set: 10–15 test cases, each with a candidate pool + project requirements + a human-judged "ideal team."
- Score pipeline output agreement against the labeled set.
- Run the same test cases through a naive single-prompt baseline for comparison.
- Document at least one concrete failure case from the naive baseline that the layered pipeline correctly handles — this is the centerpiece demo asset.

## 11. Demo Script (Competition Presentation)

1. State the problem as a human pain point (~30 sec).
2. Show the naive-prompt vs. engineered-pipeline comparison side by side — lead with this.
3. Walk through one real example end-to-end: messy input → Layer 1 extraction → Layer 2 matched team with reasoning → Layer 3 catching and fixing an issue.
4. State the eval harness result in one sentence (e.g., "agrees with human judgment in N/15 cases").
5. Stop — let the reasoning trace speak for itself rather than over-explaining architecture.

## 12. Risks & Open Questions

- **Open:** Exact competition judging rubric (prompt quality vs. end-to-end product) — unconfirmed, affects how much UI polish vs. prompt depth to prioritize.
- **Risk:** Layer 3 critique pass could loop indefinitely on ambiguous cases — needs a max-revision cap.
- **Risk:** Small candidate pools (typical in a demo) limit how impressive "team coverage" reasoning looks — plan to seed a realistic-sized mock dataset (15–20 profiles) for the demo.
- **Open:** Exact schema fields for skills/availability — draft schema above should be validated against whatever input the competition provides, if any.

## 13. Milestones (Suggested)

1. Build Layer 1 prompt + few-shot calibration set; test on 5 sample profiles.
2. Build Layer 2 prompt with structured output + reasoning trace; test against mock project + pool.
3. Build Layer 3 critique prompt; test that it catches at least 2 injected failure cases.
4. Build 10–15 case eval harness; run naive baseline vs. pipeline comparison.
5. Build minimal demo UI (input form → pipeline → results view with reasoning shown).
6. Rehearse demo script; time it.
