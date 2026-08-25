import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import sys
import os
import time

# Add parent directory to path for standalone execution
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.config import MONGO_URI, DB_NAME, USE_LLM
from backend.prompts.layer1_extraction import run_layer1

CANDIDATES_RAW = [
    {"name": "Alice Chen", "raw_text": "I'm a fullstack dev, mainly React and Node.js. Built a few production apps. Also know some basic Python. Free on weekends, maybe 10 hours."},
    {"name": "Bob Smith", "raw_text": "Data engineer. Expert in Python, SQL, Airflow. Don't know any frontend. I work full time so only available 5 hrs a week."},
    {"name": "Charlie Davis", "raw_text": "UX/UI Designer. Good at Figma and user research. Took a bootcamp in HTML/CSS but not super confident. Can do 20 hours a week."},
    {"name": "Diana Prince", "raw_text": "Machine learning researcher. PyTorch, TensorFlow, Pandas. Not interested in building the app itself, just the models. Very free right now, 30 hrs/week."},
    {"name": "Evan Wright", "raw_text": "I know a bit of everything. React, Python, some AWS. Jack of all trades. Free evenings."},
    {"name": "Fiona Gallagher", "raw_text": "Healthcare domain expert. No coding skills, but I know the medical compliance space inside out. Can consult 2 hours a week."},
    {"name": "George Miller", "raw_text": "Backend dev. Java, Spring Boot, PostgreSQL. Rock solid architecture. 15 hours a week."},
    {"name": "Hannah Abbott", "raw_text": "Mobile dev. Flutter and React Native. Built 2 apps on the App Store. 20 hours a week available."},
    {"name": "Ian Malcolm", "raw_text": "Chaos engineer. K8s, Docker, CI/CD pipelines. 5 hours a week."},
    {"name": "Julia Roberts", "raw_text": "Marketing and growth. I can help launch the product and get users. No tech skills. 10 hours a week."},
    {"name": "Kevin Hart", "raw_text": "Frontend exclusively. Vue and React. CSS wizard. 15 hours a week."},
    {"name": "Linda Belcher", "raw_text": "Product manager. I keep teams on track and write requirements. 10 hours a week."},
]

PROJECTS = [
    {
        "title": "AI Study Buddy",
        "description": "An app that helps students study using LLMs.",
        "required_skills": ["React", "Python", "UX Design"],
        "team_size": 3,
        "must_have_roles": ["Frontend Developer", "Backend Developer", "Designer"]
    },
    {
        "title": "Healthcare Analytics Dashboard",
        "description": "Dashboard for hospital administrators to track metrics.",
        "required_skills": ["SQL", "React", "Healthcare Domain"],
        "team_size": 3,
        "must_have_roles": ["Data Engineer", "Frontend Developer", "Domain Expert"]
    }
]

async def seed_db():
    print(f"Connecting to MongoDB at {MONGO_URI}...")
    client = AsyncIOMotorClient(MONGO_URI)
    db = client[DB_NAME]
    
    print("Clearing existing data...")
    await db.candidates.delete_many({})
    await db.projects.delete_many({})
    await db.match_results.delete_many({})
    
    print("Seeding Projects...")
    await db.projects.insert_many(PROJECTS)
    
    print(f"Seeding Candidates (LLM={'ON' if USE_LLM else 'OFF — using heuristic'})...")
    docs = []
    for c in CANDIDATES_RAW:
        print(f"  Extracting profile for {c['name']}...")
        max_retries = 3
        for attempt in range(max_retries):
            try:
                structured = run_layer1(c["raw_text"])
                break
            except Exception as e:
                if "429" in str(e) and attempt < max_retries - 1:
                    print("    Rate limited, sleeping for 15 seconds...")
                    time.sleep(15)
                else:
                    raise e
        if USE_LLM:
            time.sleep(4)  # Base delay to avoid hitting API limits
        doc = {
            "name": c["name"],
            "raw_text": c["raw_text"],
            **structured
        }
        docs.append(doc)
        
    await db.candidates.insert_many(docs)
    print(f"Seeding complete! {len(docs)} candidates and {len(PROJECTS)} projects inserted.")

if __name__ == "__main__":
    asyncio.run(seed_db())
