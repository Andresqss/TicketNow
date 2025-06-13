// src/services/event-types/type.ts

export interface EventType {
  event_type_id: number;
  type_name: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateEventTypePayload {
  type_name: string;
  description?: string;
}

export interface UpdateEventTypePayload extends CreateEventTypePayload {
  event_type_id: number;
}
