from pydantic import BaseModel, Field
from typing import List, Optional, Literal


class SkillRating(BaseModel):
    """A single skill with a confidence level."""
    name: str
    confidence: Literal["low", "medium", "high"]


class NormalizedProfile(BaseModel):
    """Strongly-typed output from Layer 1 extraction.
    Validates that the LLM returned properly structured data."""
    skills: List[SkillRating] = []
    interests: List[str] = []
    availability: dict = Field(
        default_factory=lambda: {"hours_per_week": 0, "windows": []}
    )
    uncertain_fields: List[str] = []


class CandidateProfile(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    name: str = ""
    raw_text: str
    skills: List[SkillRating] = []
    interests: List[str] = []
    availability: dict = Field(
        default_factory=lambda: {"hours_per_week": 0, "windows": []}
    )
    uncertain_fields: List[str] = []


class ProjectRequirements(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    title: str = ""
    description: str = ""
    required_skills: List[str] = []
    team_size: int = 3
    must_have_roles: List[str] = []


class TeamMember(BaseModel):
    candidate_id: str
    candidate_name: str
    role: str
    reason: str


class MatchOutput(BaseModel):
    team: List[TeamMember] = []
    coverage_check: dict = {}  # { "skill": "covered" | "gap" }
    alternatives_considered: List[str] = []


class CritiqueOutput(BaseModel):
    status: Literal["approved", "revise"]
    flagged_issue: Optional[str] = None
    revision_note: Optional[str] = None


class MatchResult(BaseModel):
    id: Optional[str] = Field(alias="_id", default=None)
    project_id: str
    naive_team: Optional[MatchOutput] = None
    pipeline_team: Optional[MatchOutput] = None
    critique_history: List[CritiqueOutput] = []
    layer_timings: dict = {}  # ms per layer
