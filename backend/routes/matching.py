from fastapi import APIRouter, HTTPException
from ..pipeline import run_match_pipeline, run_naive_match
from ..database import get_db
from bson import ObjectId
import asyncio

router = APIRouter(prefix="/api/match", tags=["Matching"])


@router.post("/{project_id}")
async def run_matching(project_id: str):
    db = get_db()
    
    # 1. Fetch project
    project = await db.projects.find_one({"_id": ObjectId(project_id)})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    project["_id"] = str(project["_id"])
    
    # 2. Fetch all candidates (Layer 1 already processed them on ingestion)
    cursor = db.candidates.find({})
    candidates = []
    async for c in cursor:
        c["_id"] = str(c["_id"])
        candidates.append(c)
    
    if not candidates:
        raise HTTPException(status_code=400, detail="No candidates in the pool")
    
    # 3. Run pipelines in background threads (they are sync + potentially slow)
    try:
        pipeline_res, naive_res = await asyncio.gather(
            asyncio.to_thread(run_match_pipeline, project, candidates),
            asyncio.to_thread(run_naive_match, project, candidates),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pipeline execution failed: {str(e)}")
    
    # 4. Save result
    result_doc = {
        "project_id": project_id,
        "naive_team": naive_res["team_output"],
        "pipeline_team": pipeline_res["team_output"],
        "critique_history": pipeline_res["critique_history"],
        "layer_timings": {
            "pipeline": pipeline_res["time_ms"],
            "naive": naive_res["time_ms"]
        }
    }
    
    res = await db.match_results.insert_one(result_doc)
    result_doc["_id"] = str(res.inserted_id)
    return result_doc


@router.get("/results/{result_id}")
async def get_match_result(result_id: str):
    db = get_db()
    try:
        result = await db.match_results.find_one({"_id": ObjectId(result_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid result ID format")
    if not result:
        raise HTTPException(status_code=404, detail="Match result not found")
    result["_id"] = str(result["_id"])
    return result
