from fastapi import APIRouter, HTTPException
from database import get_db
from models import ProjectRequirements
from bson import ObjectId


router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.post("/")
async def create_project(reqs: ProjectRequirements):
    db = get_db()
    doc = reqs.model_dump(by_alias=True, exclude={"id"})
    result = await db.projects.insert_one(doc)
    doc["_id"] = str(result.inserted_id)
    return doc

@router.get("/")
async def list_projects():
    db = get_db()
    cursor = db.projects.find({})
    projects = []
    async for p in cursor:
        p["_id"] = str(p["_id"])
        projects.append(p)
    return projects
