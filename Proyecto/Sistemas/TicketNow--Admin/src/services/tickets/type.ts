export interface TicketType {
  id?: string;
  event_id: string;
  name: string;
  price: number;
  max_quantity: number;
  current_stock: number;
  is_active: boolean;
  sales_start_at: string;
  sales_end_at: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}
