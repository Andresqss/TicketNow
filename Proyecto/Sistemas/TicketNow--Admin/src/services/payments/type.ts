export interface PaymentLog {
  id: string;
  reservation_id: string;
  status: 'pending' | 'approved' | 'failed' | 'refunded';
  amount: number;
  gateway_response?: Record<string, any>;
  registered_at?: string;
  created_at?: string;
  updated_at?: string;
}
