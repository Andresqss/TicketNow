from app.models.payment_log_model import PaymentLog
from app.repositories.payment_log_repo import PaymentLogRepository
from bson.decimal128 import Decimal128
from datetime import datetime

class PaymentLogService:
    def __init__(self):
        self.repo = PaymentLogRepository()

    async def create_log(self, log: PaymentLog):
        data = log.dict(exclude_unset=True)
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        data["is_deleted"] = False
        data["updated_by"] = "system"
        data["amount"] = Decimal128(str(data["amount"]))
        return await self.repo.create(data)

    async def list_logs(self):
        data = await self.repo.list()
        return [self._convert(d) for d in data]

    async def get_log(self, log_id: str):
        doc = await self.repo.get_by_id(log_id)
        return self._convert(doc) if doc else None

    async def update_log(self, log_id: str, data: dict):
        data["updated_at"] = datetime.utcnow()
        return await self.repo.update(log_id, data)

    async def delete_log(self, log_id: str):
        return await self.repo.delete(log_id)

    def _convert(self, doc):
        doc["id"] = str(doc["_id"])
        del doc["_id"]

        if "amount" in doc and isinstance(doc["amount"], Decimal128):
            doc["amount"] = float(doc["amount"].to_decimal())

        return doc
