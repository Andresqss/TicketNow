export interface WaitingQueue {
  id?: string;
  reservation_id: string;
  event_id: string;
  user_id: string;
  status: 'waiting' | 'notified' | 'expired';
  created_at?: string;
  updated_at?: string;
}
