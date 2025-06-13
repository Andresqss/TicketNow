# app/repositories/waiting_queue_repo.py

from app.core.database import db
from bson import ObjectId

class WaitingQueueRepository:
    def __init__(self):
        self.collection = db.get_collection("waiting_queues")

    async def create(self, data: dict):
        result = await self.collection.insert_one(data)
        return str(result.inserted_id)

    async def list(self):
        return await self.collection.find({"is_deleted": False}).to_list(100)

    async def get_by_id(self, queue_id: str):
        return await self.collection.find_one({"_id": ObjectId(queue_id), "is_deleted": False})

    async def update(self, queue_id: str, data: dict):
        return await self.collection.update_one(
            {"_id": ObjectId(queue_id)},
            {"$set": data}
        )

    async def delete(self, queue_id: str):
        return await self.collection.update_one(
            {"_id": ObjectId(queue_id)},
            {"$set": {"is_deleted": True}}
        )
