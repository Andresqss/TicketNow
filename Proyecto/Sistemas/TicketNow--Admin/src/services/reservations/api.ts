import { Reservation } from './type';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_FASTAPI}/reservations`;

export async function getAllReservations(): Promise<Reservation[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener reservaciones');
  return res.json();
}

export async function getReservationById(id: string): Promise<Reservation> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Reservación no encontrada');
  return res.json();
}

export async function createReservation(data: Reservation): Promise<{ id: string }> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear reservación');
  return res.json();
}

export async function updateReservation(id: string, data: Partial<Reservation>) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar reservación');
  return res.json();
}

export async function deleteReservation(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar reservación');
  return res.json();
}
