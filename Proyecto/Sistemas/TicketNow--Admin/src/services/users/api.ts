

const BASE_URL = `${process.env.NEXT_PUBLIC_API_EXPRESS}/api`;

import { User, UpdateUserPayload } from "./type";

export const getUserById = async (id: number, token: string): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Error al obtener usuario");
  return res.json();
};

export const updateUser = async (
  data: UpdateUserPayload,
  token: string
): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/${data.user_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar perfil");
  return res.json();
};

// Opcional: cambiar estado del usuario (activo/inactivo)
export const toggleUserStatus = async (
  id: number,
  token: string
): Promise<{ status: boolean }> => {
  const res = await fetch(`${BASE_URL}/users/${id}/status`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cambiar estado del usuario");
  return res.json();
};
