// src/services/users/type.ts

export interface User {
  user_id: number;
  username?: string;
  email: string;
  phone?: string;
  status?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UpdateUserPayload {
  user_id: number;
  username?: string;
  phone?: string;
}
