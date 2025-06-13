// src/services/events/type.ts

export interface Event {
  event_id: number;
  event_name: string;
  description?: string;
  short_description?: string;
  event_type_id?: number;
  start_datetime: string;
  end_datetime: string;
  capacity: number;
  base_price?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  image?: string;
}

export interface CreateEventPayload extends Omit<Event, "event_id" | "created_at" | "updated_at"> {
  imageFile?: File;
}

export interface UpdateEventPayload extends Partial<CreateEventPayload> {
  event_id: number;
}
