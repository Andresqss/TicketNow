# app/models/payment_log_model.py

from pydantic import BaseModel, Field, condecimal
from typing import Optional
from datetime import datetime
from app.models.common import AuditFields

class PaymentLog(BaseModel, AuditFields):
    reservation_id: str
    status: str = Field(..., pattern="^(pending|approved|failed|refunded)$")
    amount: condecimal(gt=0)
    gateway_response: Optional[dict] = {}
    registered_at: datetime = Field(default_factory=datetime.utcnow)
