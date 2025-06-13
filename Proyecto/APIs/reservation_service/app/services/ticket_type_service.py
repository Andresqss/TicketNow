from app.models.ticket_type_model import TicketType
from app.repositories.ticket_type_repo import TicketTypeRepository
from bson.decimal128 import Decimal128
from datetime import datetime

class TicketTypeService:
    def __init__(self):
        self.repo = TicketTypeRepository()

    async def create_ticket_type(self, ticket_type: TicketType):
        data = ticket_type.dict(exclude_unset=True)
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        data["is_deleted"] = False
        data["updated_by"] = "system"
        data["price"] = Decimal128(str(data["price"]))
        return await self.repo.create(data)

    async def list_ticket_types(self):
        data = await self.repo.list()
        return [self._convert(d) for d in data]

    async def get_ticket_type(self, ticket_type_id: str):
        doc = await self.repo.get_by_id(ticket_type_id)
        return self._convert(doc) if doc else None

    async def update_ticket_type(self, ticket_type_id: str, data: dict):
        data["updated_at"] = datetime.utcnow()
        return await self.repo.update(ticket_type_id, data)

    async def delete_ticket_type(self, ticket_type_id: str):
        return await self.repo.delete(ticket_type_id)

    def _convert(self, doc):
        doc["id"] = str(doc["_id"])
        del doc["_id"]

        if "price" in doc and isinstance(doc["price"], Decimal128):
            doc["price"] = float(doc["price"].to_decimal())

        return doc
