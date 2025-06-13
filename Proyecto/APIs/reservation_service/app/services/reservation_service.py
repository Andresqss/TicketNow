from app.models.reservation_model import Reservation
from app.repositories.reservation_repo import ReservationRepository
from bson.decimal128 import Decimal128
from datetime import datetime

class ReservationService:
    def __init__(self):
        self.repo = ReservationRepository()

    async def create_reservation(self, reservation: Reservation):
        data = reservation.dict(exclude_unset=True)
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        data["is_deleted"] = False
        data["updated_by"] = "system"
        data["total_amount"] = Decimal128(str(data["total_amount"]))
        for t in data["tickets"]:
            t["unit_price"] = Decimal128(str(t["unit_price"]))
            t["subtotal"] = Decimal128(str(t["subtotal"]))
        return await self.repo.create(data)

    async def list_reservations(self):
        data = await self.repo.list()
        return [self._convert(d) for d in data]

    async def get_reservation(self, reservation_id: str):
        doc = await self.repo.get_by_id(reservation_id)
        return self._convert(doc) if doc else None

    async def update_reservation(self, reservation_id: str, reservation: dict):
        reservation["updated_at"] = datetime.utcnow()
        return await self.repo.update(reservation_id, reservation)

    async def delete_reservation(self, reservation_id: str):
        return await self.repo.delete(reservation_id)

    def _convert(self, doc):
        doc["id"] = str(doc["_id"])
        del doc["_id"]

        if "total_amount" in doc and isinstance(doc["total_amount"], Decimal128):
            doc["total_amount"] = float(doc["total_amount"].to_decimal())

        for t in doc.get("tickets", []):
            if isinstance(t.get("unit_price"), Decimal128):
                t["unit_price"] = float(t["unit_price"].to_decimal())
            if isinstance(t.get("subtotal"), Decimal128):
                t["subtotal"] = float(t["subtotal"].to_decimal())

        return doc
