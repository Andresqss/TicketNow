from app.core.database import db
from bson import ObjectId

class TicketTypeRepository:
    def __init__(self):
        self.collection = db.get_collection("ticket_types")

    async def create(self, data: dict):
        result = await self.collection.insert_one(data)
        return str(result.inserted_id)

    async def list(self):
        return await self.collection.find({"is_deleted": False}).to_list(100)

    async def get_by_id(self, ticket_type_id: str):
        return await self.collection.find_one({"_id": ObjectId(ticket_type_id), "is_deleted": False})

    async def update(self, ticket_type_id: str, data: dict):
        return await self.collection.update_one(
            {"_id": ObjectId(ticket_type_id)},
            {"$set": data}
        )

    async def delete(self, ticket_type_id: str):
        return await self.collection.update_one(
            {"_id": ObjectId(ticket_type_id)},
            {"$set": {"is_deleted": True}}
        )
