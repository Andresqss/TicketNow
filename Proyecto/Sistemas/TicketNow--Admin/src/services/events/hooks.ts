// src/services/events/hooks.ts
import {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateEventPayload, UpdateEventPayload } from "./type";

export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: getAllEvents,
  });
};

export const useEventById = (id: number) => {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => getEventById(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEventPayload) => createEvent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateEventPayload) => updateEvent(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["events"] }),
  });
};
