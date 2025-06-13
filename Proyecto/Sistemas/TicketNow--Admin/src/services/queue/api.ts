import { WaitingQueue } from './type';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_FASTAPI}/waiting-queues`;

export async function getWaitingQueues(): Promise<WaitingQueue[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener la cola de espera');
  return res.json();6
}

export async function getWaitingQueueById(id: string): Promise<WaitingQueue> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Cola no encontrada');
  return res.json();
}

export async function createWaitingQueue(data: WaitingQueue): Promise<{ id: string }> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear cola de espera');
  return res.json();
}

export async function updateWaitingQueue(id: string, data: Partial<WaitingQueue>) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar cola de espera');
  return res.json();
}

export async function deleteWaitingQueue(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar cola de espera');
  return res.json();
}
