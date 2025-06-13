// src/services/events/api.ts

import { CreateEventPayload, UpdateEventPayload, Event } from "./type";
const BASE_URL = `${process.env.NEXT_PUBLIC_API_EXPRESS}/api`;

export const getAllEvents = async (): Promise<Event[]> => {
  const res = await fetch(`${BASE_URL}/events`);
  if (!res.ok) throw new Error("Error al obtener eventos");
  return res.json();
};

export const getEventById = async (id: number): Promise<Event> => {
  const res = await fetch(`${BASE_URL}/events/${id}`);
  if (!res.ok) throw new Error("Evento no encontrado");
  return res.json();
};

export const createEvent = async (data: CreateEventPayload): Promise<Event> => {
  const formData = new FormData();
  formData.append("event_name", data.event_name);
  if (data.description) formData.append("description", data.description);
  if (data.short_description) formData.append("short_description", data.short_description);
  if (data.event_type_id) formData.append("event_type_id", data.event_type_id.toString());
  formData.append("start_datetime", data.start_datetime);
  formData.append("end_datetime", data.end_datetime);
  formData.append("capacity", data.capacity.toString());
  if (data.base_price) formData.append("base_price", data.base_price);
  if (data.imageFile) formData.append("image", data.imageFile);

  const res = await fetch(`${BASE_URL}/events`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al crear evento");
  return res.json();
};

export const updateEvent = async (data: UpdateEventPayload): Promise<Event> => {
  const formData = new FormData();
  if (data.event_name) formData.append("event_name", data.event_name);
  if (data.description) formData.append("description", data.description);
  if (data.short_description) formData.append("short_description", data.short_description);
  if (data.event_type_id) formData.append("event_type_id", data.event_type_id.toString());
  if (data.start_datetime) formData.append("start_datetime", data.start_datetime);
  if (data.end_datetime) formData.append("end_datetime", data.end_datetime);
  if (data.capacity !== undefined) formData.append("capacity", data.capacity.toString());
  if (data.base_price) formData.append("base_price", data.base_price);
  if (data.imageFile) formData.append("image", data.imageFile);

  const res = await fetch(`${BASE_URL}/events/${data.event_id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Error al actualizar evento");
  return res.json();
};

export const deleteEvent = async (id: number): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar evento");
  return res.json();
};
