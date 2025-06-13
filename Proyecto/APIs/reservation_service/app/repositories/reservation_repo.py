from app.core.database import db
from bson import ObjectId
from typing import Optional

class ReservationRepository:
    def __init__(self):
        self.collection = db.get_collection("reservations")

    async def create(self, data: dict):
        result = await self.collection.insert_one(data)
        return str(result.inserted_id)

    async def list(self):
        return await self.collection.find({"is_deleted": False}).to_list(length=100)

    async def get_by_id(self, reservation_id: str):
        return await self.collection.find_one({"_id": ObjectId(reservation_id), "is_deleted": False})

    async def update(self, reservation_id: str, data: dict):
        result = await self.collection.update_one(
            {"_id": ObjectId(reservation_id)},
            {"$set": data}
        )
        return result.modified_count

    async def delete(self, reservation_id: str):
        result = await self.collection.update_one(
            {"_id": ObjectId(reservation_id)},
            {"$set": {"is_deleted": True}}
        )
        return result.modified_count
