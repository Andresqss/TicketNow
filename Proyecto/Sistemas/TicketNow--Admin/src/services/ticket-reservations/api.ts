// src/services/ticket-reservations/api.ts
const BASE_URL = `${process.env.NEXT_PUBLIC_API_EXPRESS}/api`;
import {
  TicketReservation,
  CreateReservationPayload,
  CreateGuestReservationPayload,
  UpdateReservationPayload,
} from "./type";

export const createReservation = async (
  data: CreateReservationPayload,
  token: string
): Promise<TicketReservation> => {
  const res = await fetch(`${BASE_URL}/ticket-reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear reservación");
  return res.json();
};

export const createGuestReservation = async (
  data: CreateGuestReservationPayload
): Promise<TicketReservation> => {
  const res = await fetch(`${BASE_URL}/guest-reservations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error en reservación para invitado");
  return res.json();
};

export const getMyReservations = async (token: string): Promise<TicketReservation[]> => {
  const res = await fetch(`${BASE_URL}/my-reservations`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener tus reservaciones");
  return res.json();
};

export const updateReservation = async (
  data: UpdateReservationPayload,
  token: string
): Promise<TicketReservation> => {
  const res = await fetch(`${BASE_URL}/ticket-reservations/${data.reservation_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity: data.quantity }),
  });
  if (!res.ok) throw new Error("Error al actualizar reservación");
  return res.json();
};

export const cancelReservation = async (
  reservationId: number,
  token: string
): Promise<{ message: string }> => {
  const res = await fetch(`${BASE_URL}/ticket-reservations/${reservationId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cancelar reservación");
  return res.json();
};

export const getReservationPDF = async (
  reservationId: number,
  token: string
): Promise<Blob> => {
  const res = await fetch(`${BASE_URL}/ticket-reservations/${reservationId}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener PDF");
  return res.blob();
};

export const checkToken = async (token: string): Promise<{ valid: boolean }> => {
  const res = await fetch(`${BASE_URL}/check-token`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Token inválido");
  return res.json();
};
