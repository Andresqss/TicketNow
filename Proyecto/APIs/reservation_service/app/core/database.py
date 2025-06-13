from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ASCENDING
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27018")
DB_NAME = os.getenv("DB_NAME", "db_reservation")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]