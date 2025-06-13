from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr, conint, confloat
from datetime import datetime
from app.models.common import AuditFields

class Ticket(BaseModel):
    ticket_type_id: str = Field(..., min_length=1)
    quantity: conint(gt=0)
    unit_price: confloat(ge=0)
    subtotal: confloat(ge=0)

class Reservation(BaseModel, AuditFields):
    event_id: str = Field(..., min_length=1)
    user_id: str = Field(..., min_length=1)
    guest_email: EmailStr
    tickets: List[Ticket]
    status: str = Field(default="pending", pattern="^(pending|confirmed|cancelled|expired)$")
    payment_reference: Optional[str]
    total_amount: confloat(gt=0)
    currency: str = Field(..., min_length=1, max_length=5)
    taxes: Optional[List[str]] = []
    discount_code: Optional[str]
    queue_position: Optional[conint(ge=0)]
    expires_at: Optional[datetime]
    cancellation_reason: Optional[str]
