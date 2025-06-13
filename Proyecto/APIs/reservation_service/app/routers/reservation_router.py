from fastapi import APIRouter, HTTPException
from app.models.reservation_model import Reservation
from app.services.reservation_service import ReservationService

router = APIRouter(prefix="/reservations", tags=["Reservations"])
service = ReservationService()

def mongo_to_dict(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.post("/", response_model=dict)
async def create(reservation: Reservation):
    new_id = await service.create_reservation(reservation)
    return {"message": "Creado correctamente", "id": new_id}

@router.get("/", response_model=list)
async def list_all():
    return await service.list_reservations()
@router.get("/{reservation_id}", response_model=dict)
async def get(reservation_id: str):
    result = await service.get_reservation(reservation_id)
    if not result:
        raise HTTPException(status_code=404, detail="Reserva no encontrada")
    return result

@router.put("/{reservation_id}", response_model=dict)
async def update(reservation_id: str, reservation: dict):
    modified_count = await service.update_reservation(reservation_id, reservation)
    if modified_count == 0:
        raise HTTPException(status_code=404, detail="No se actualizó ningún documento")
    return {"message": "Actualización exitosa"}

@router.delete("/{reservation_id}", response_model=dict)
async def delete(reservation_id: str):
    modified_count = await service.delete_reservation(reservation_id)
    if modified_count == 0:
        raise HTTPException(status_code=404, detail="Reserva no eliminada")
    return {"message": "Eliminación exitosa"}
