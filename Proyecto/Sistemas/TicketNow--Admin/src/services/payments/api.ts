import { PaymentLog } from './type';

const BASE_URL = `${process.env.NEXT_PUBLIC_API_FASTAPI}/payment-logs`;

export async function getPaymentLogs(): Promise<PaymentLog[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Error al obtener logs de pago');
  return res.json();
}

export async function getPaymentLogById(id: string): Promise<PaymentLog> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Log de pago no encontrado');
  return res.json();
}

export async function createPaymentLog(data: PaymentLog): Promise<{ id: string }> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear log de pago');
  return res.json();
}

export async function updatePaymentLog(id: string, data: Partial<PaymentLog>) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar log de pago');
  return res.json();
}

export async function deletePaymentLog(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar log de pago');
  return res.json();
}
