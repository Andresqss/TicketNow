from pydantic import BaseModel, Field, conint, confloat
from typing import Optional
from datetime import datetime
from app.models.common import AuditFields

class TicketType(BaseModel, AuditFields):
    event_id: str
    name: str
    price: confloat(ge=0)
    max_quantity: conint(gt=0)
    current_stock: conint(ge=0)
    is_active: bool = True
    sales_start_at: datetime
    sales_end_at: datetime
    metadata: Optional[dict] = {}
