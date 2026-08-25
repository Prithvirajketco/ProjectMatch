from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db
from prompts.layer1_extraction import run_layer1
from bson import ObjectId
import asyncio


router = APIRouter(prefix="/api/candidates", tags=["Candidates"])

class RawProfileInput(BaseModel):
    name: str
    raw_text: str

@router.post("/")
async def create_candidate(data: RawProfileInput):
    db = get_db()
    
    # Run Layer 1 to extract structured data (in a thread to avoid blocking)
    try:
        structured_data = await asyncio.to_thread(run_layer1, data.raw_text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Profile extraction failed: {str(e)}")
    
    candidate_doc = {
        "name": data.name,
        "raw_text": data.raw_text,
        **structured_data
    }
    
    result = await db.candidates.insert_one(candidate_doc)
    candidate_doc["_id"] = str(result.inserted_id)
    return candidate_doc

@router.get("/")
async def list_candidates():
    db = get_db()
    cursor = db.candidates.find({})
    candidates = []
    async for c in cursor:
        c["_id"] = str(c["_id"])
        candidates.append(c)
    return candidates
