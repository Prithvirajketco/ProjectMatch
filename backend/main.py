from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Database
from routes import candidates, projects, matching


app = FastAPI(title="ProjectMatch API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(candidates.router)
app.include_router(projects.router)
app.include_router(matching.router)

@app.on_event("startup")
async def startup_db_client():
    Database.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    Database.close()

@app.get("/")
def read_root():
    from config import USE_LLM, HACKATHON_MODE
    return {

        "message": "ProjectMatch API is running",
        "llm_enabled": USE_LLM,
        "hackathon_mode": HACKATHON_MODE,
    }

@app.post("/seed")
async def seed_database():
    from mock_data.seed_data import seed_db
    try:
        await seed_db()
        return {"status": "success", "message": "Database seeded successfully!"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
