from fastapi import APIRouter, HTTPException
from app.models.waiting_queue_model import WaitingQueueEntry
from app.services.queue_service import QueueService

router = APIRouter(prefix="/waiting-queues", tags=["Waiting Queues"])
service = QueueService()

def mongo_to_dict(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.post("/", response_model=dict)
async def create(entry: WaitingQueueEntry):
    new_id = await service.create_entry(entry)
    return {"message": "Agregado a la cola", "id": new_id}

@router.get("/", response_model=list)
async def list_all():
    results = await service.list_entries()
    return [mongo_to_dict(r) for r in results]

@router.get("/{entry_id}", response_model=dict)
async def get(entry_id: str):
    result = await service.get_entry(entry_id)
    if not result:
        raise HTTPException(status_code=404, detail="Entrada no encontrada")
    return mongo_to_dict(result)

@router.put("/{entry_id}", response_model=dict)
async def update(entry_id: str, data: dict):
    result = await service.update_entry(entry_id, data)
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Entrada no actualizada")
    return {"message": "Actualización exitosa"}

@router.delete("/{entry_id}", response_model=dict)
async def delete(entry_id: str):
    result = await service.delete_entry(entry_id)
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Entrada no eliminada")
    return {"message": "Eliminación exitosa"}
