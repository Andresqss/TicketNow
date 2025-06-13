# app/models/waiting_queue_model.py

from pydantic import BaseModel, Field, conint
from typing import Optional
from datetime import datetime
from app.models.common import AuditFields

class WaitingQueueEntry(BaseModel, AuditFields):
    event_id: str
    user_id: str
    position: conint(ge=0)
    joined_at: datetime = Field(default_factory=datetime.utcnow)
    notified: bool = False
