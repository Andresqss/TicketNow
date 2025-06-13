export interface Ticket {
  ticket_type_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Reservation {
  id: string;
  event_id: string;
  user_id: string;
  guest_email: string;
  tickets: Ticket[];
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';
  payment_method?: string;
  payment_reference?: string;
  total_amount: number;
  currency: string;
  taxes?: string[];
  discount_code?: string;
  queue_position?: number;
  expires_at?: string;
  cancellation_reason?: string;
  created_at?: string;
  updated_at?: string;
}
