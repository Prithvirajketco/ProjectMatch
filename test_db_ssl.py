import asyncio
import certifi
from motor.motor_asyncio import AsyncIOMotorClient

async def test_conn():
    uri = "mongodb+srv://iamketkale_db_user:eFNLdn6UPmVGE3a1@cluster0.iynzplg.mongodb.net/?retryWrites=true&w=majority"
    print("Testing connection with certifi...")
    client = AsyncIOMotorClient(uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=5000)
    try:
        info = await client.server_info()
        print("Connected successfully! Server info:", info.get('version'))
    except Exception as e:
        print("Connection failed:", e)

if __name__ == "__main__":
    asyncio.run(test_conn())
