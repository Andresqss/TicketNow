
import {
  getAllEventTypes,
  getEventTypeById,
  createEventType,
  updateEventType,
  deleteEventType,
} from "./api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateEventTypePayload,
  UpdateEventTypePayload,
} from "./type";

export const useEventTypes = () => {
  return useQuery({
    queryKey: ["event-types"],
    queryFn: getAllEventTypes,
  });
};

export const useEventTypeById = (id: number) => {
  return useQuery({
    queryKey: ["event-type", id],
    queryFn: () => getEventTypeById(id),
    enabled: !!id,
  });
};

export const useCreateEventType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventTypePayload) => createEventType(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["event-types"] }),
  });
};

export const useUpdateEventType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEventTypePayload) => updateEventType(data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["event-types"] }),
  });
};

export const useDeleteEventType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEventType(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["event-types"] }),
  });
};
