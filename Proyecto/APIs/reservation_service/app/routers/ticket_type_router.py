from fastapi import APIRouter, HTTPException
from app.models.ticket_type_model import TicketType
from app.services.ticket_type_service import TicketTypeService

router = APIRouter(prefix="/ticket-types", tags=["Ticket Types"])
service = TicketTypeService()

def mongo_to_dict(doc):
    doc["id"] = str(doc["_id"])
    del doc["_id"]
    return doc

@router.post("/", response_model=dict)
async def create(ticket_type: TicketType):
    new_id = await service.create_ticket_type(ticket_type)
    return {"message": "Creado correctamente", "id": new_id}

@router.get("/", response_model=list)
async def list_all():
    return await service.list_ticket_types()

@router.get("/{ticket_type_id}", response_model=dict)
async def get(ticket_type_id: str):
    result = await service.get_ticket_type(ticket_type_id)
    if not result:
        raise HTTPException(status_code=404, detail="Tipo de ticket no encontrado")
    return result

@router.put("/{ticket_type_id}", response_model=dict)
async def update(ticket_type_id: str, data: dict):
    modified_count = await service.update_ticket_type(ticket_type_id, data)
    if modified_count == 0:
        raise HTTPException(status_code=404, detail="No se actualizó el tipo de ticket")
    return {"message": "Actualización exitosa"}

@router.delete("/{ticket_type_id}", response_model=dict)
async def delete(ticket_type_id: str):
    modified_count = await service.delete_ticket_type(ticket_type_id)
    if modified_count == 0:
        raise HTTPException(status_code=404, detail="No se eliminó el tipo de ticket")
    return {"message": "Eliminación exitosa"}
