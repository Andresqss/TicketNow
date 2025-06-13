// src/services/users/hooks.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser, toggleUserStatus } from "./api";
import { UpdateUserPayload } from "./type";

export const useUserById = (id: number, token: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserById(id, token),
    enabled: !!id && !!token,
  });
};

export const useUpdateUser = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserPayload) => updateUser(data, token),
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["user", data.user_id] });
    },
  });
};

export const useToggleUserStatus = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => toggleUserStatus(id, token),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["user", id] });
    },
  });
};
