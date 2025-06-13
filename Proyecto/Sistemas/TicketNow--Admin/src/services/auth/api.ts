// src/services/auth/api.ts

import { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse } from "./type";
const BASE_URL = `${process.env.NEXT_PUBLIC_API_EXPRESS}/api`;

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Error al iniciar sesión");
  }

  return response.json();
};

export const register = async (data: RegisterRequest): Promise<RegisterResponse> => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Error al registrarse");
  }

  return response.json();
};
