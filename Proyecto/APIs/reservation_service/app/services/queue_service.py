from app.models.waiting_queue_model import WaitingQueueEntry
from app.repositories.waiting_queue_repo import WaitingQueueRepository
from datetime import datetime

class QueueService:
    def __init__(self):
        self.repo = WaitingQueueRepository()

    async def create_entry(self, entry: WaitingQueueEntry):
        data = entry.dict(exclude_unset=True)
        data["created_at"] = datetime.utcnow()
        data["updated_at"] = datetime.utcnow()
        data["is_deleted"] = False
        data["updated_by"] = "system"

        return await self.repo.create(data)

    async def list_entries(self):
        return await self.repo.list()

    async def get_entry(self, entry_id: str):
        return await self.repo.get_by_id(entry_id)

    async def update_entry(self, entry_id: str, data: dict):
        data["updated_at"] = datetime.utcnow()
        return await self.repo.update(entry_id, data)

    async def delete_entry(self, entry_id: str):
        return await self.repo.delete(entry_id)
