from motor.motor_asyncio import AsyncIOMotorClient
from config import MONGO_URI, DB_NAME
from bson import ObjectId


class Database:
    client: AsyncIOMotorClient = None
    db = None

    @classmethod
    def connect(cls):
        cls.client = AsyncIOMotorClient(MONGO_URI)
        cls.db = cls.client[DB_NAME]

    @classmethod
    def close(cls):
        if cls.client:
            cls.client.close()

db_instance = Database()

def get_db():
    return db_instance.db
