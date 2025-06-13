import {
  EventType,
  CreateEventTypePayload,
  UpdateEventTypePayload,
} from "./type";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_EXPRESS}/api`;

export const getAllEventTypes = async (): Promise<EventType[]> => {
  const res = await fetch(`${BASE_URL}/event-types`);
  if (!res.ok) throw new Error("Error al obtener tipos de evento");
  return res.json();
};

export const getEventTypeById = async (id: number): Promise<EventType> => {
  const res = await fetch(`${BASE_URL}/event-types/${id}`);
  if (!res.ok) throw new Error("Tipo de evento no encontrado");
  return res.json();
};

export const createEventType = async (
  data: CreateEventTypePayload
): Promise<EventType> => {
  const res = await fetch(`${BASE_URL}/event-types`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear tipo de evento");
  return res.json();
};

export const updateEventType = async (
  data: UpdateEventTypePayload
): Promise<EventType> => {
  const res = await fetch(`${BASE_URL}/event-types/${data.event_type_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar tipo de evento");
  return res.json();
};

export const deleteEventType = async (
  id: number
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/event-types/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar tipo de evento");
  return res.json();
};
