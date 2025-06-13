// src/services/ticket-reservations/type.ts

export interface TicketReservation {
  reservation_id: number;
  user_id?: number;
  event_id?: number;
  quantity: number;
  total_price: string;
  reserved_at: string;
  guest_email?: string;
  guest_name?: string;
  guest_phone?: string;
}

export interface CreateReservationPayload {
  event_id: number;
  quantity: number;
}

export interface CreateGuestReservationPayload {
  event_id: number;
  quantity: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
}

export interface UpdateReservationPayload {
  reservation_id: number;
  quantity: number;
}

export interface ReservationPDF {
  file: Blob;
}
