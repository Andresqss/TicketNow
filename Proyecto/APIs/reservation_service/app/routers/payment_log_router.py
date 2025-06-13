from fastapi import APIRouter, HTTPException
from app.models.payment_log_model import PaymentLog
from app.services.payment_log_service import PaymentLogService

router = APIRouter(prefix="/payment-logs", tags=["Payment Logs"])
service = PaymentLogService()

def mongo_to_dict(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.post("/", response_model=dict)
async def create(log: PaymentLog):
    new_id = await service.create_log(log)
    return {"message": "Log creado", "id": new_id}

@router.get("/", response_model=list)
async def list_all():
    return await service.list_logs()

@router.get("/{log_id}", response_model=dict)
async def get(log_id: str):
    result = await service.get_log(log_id)
    if not result:
        raise HTTPException(status_code=404, detail="Log no encontrado")
    return result

@router.put("/{log_id}", response_model=dict)
async def update(log_id: str, data: dict):
    modified_count = await service.update_log(log_id, data)
    if modified_count == 0:
        raise HTTPException(status_code=404, detail="Log no actualizado")
    return {"message": "Actualización exitosa"}

@router.delete("/{log_id}", response_model=dict)
async def delete(log_id: str):
    modified_count = await service.delete_log(log_id)
    if modified_count == 0:
        raise HTTPException(status_code=404, detail="Log no eliminado")
    return {"message": "Eliminación exitosa"}
