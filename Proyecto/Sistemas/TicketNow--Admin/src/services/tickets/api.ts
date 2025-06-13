import { TicketType } from './type';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_FASTAPI}/ticket-types`;

export async function getTicketTypes(): Promise<TicketType[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener tipos de ticket');
  return res.json();
}

export async function getTicketTypeById(id: string): Promise<TicketType> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Tipo de ticket no encontrado');
  return res.json();
}

export async function createTicketType(data: TicketType): Promise<{ id: string }> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear tipo de ticket');
  return res.json();
}

export async function updateTicketType(id: string, data: Partial<TicketType>) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar tipo de ticket');
  return res.json();
}

export async function deleteTicketType(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar tipo de ticket');
  return res.json();
}
