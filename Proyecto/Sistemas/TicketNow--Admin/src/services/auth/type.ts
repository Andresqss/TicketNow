// src/services/auth/type.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    user_id: number;
    email: string;
    username?: string;
  };
}

export interface RegisterRequest {
  email: string;
  password: string;
  username?: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    user_id: number;
    email: string;
    username?: string;
  };
}
