// src/services/ticket-reservations/hooks.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createReservation,
  createGuestReservation,
  getMyReservations,
  updateReservation,
  cancelReservation,
  getReservationPDF,
  checkToken,
} from "./api";
import {
  CreateReservationPayload,
  CreateGuestReservationPayload,
  UpdateReservationPayload,
} from "./type";

export const useCreateReservation = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateReservationPayload) => createReservation(data, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-reservations"] }),
  });
};

export const useCreateGuestReservation = () => {
  return useMutation({
    mutationFn: createGuestReservation,
  });
};

export const useMyReservations = (token: string) => {
  return useQuery({
    queryKey: ["my-reservations"],
    queryFn: () => getMyReservations(token),
    enabled: !!token,
  });
};

export const useUpdateReservation = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateReservationPayload) => updateReservation(data, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-reservations"] }),
  });
};

export const useCancelReservation = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelReservation(id, token),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-reservations"] }),
  });
};

export const useReservationPDF = (reservationId: number, token: string) => {
  return useQuery({
    queryKey: ["reservation-pdf", reservationId],
    queryFn: () => getReservationPDF(reservationId, token),
    enabled: !!reservationId && !!token,
  });
};

export const useCheckToken = (token: string) => {
  return useQuery({
    queryKey: ["token-valid"],
    queryFn: () => checkToken(token),
    enabled: !!token,
  });
};
