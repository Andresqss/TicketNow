'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTicketTypes,
  getTicketTypeById,
  createTicketType,
  updateTicketType,
  deleteTicketType,
} from './api';
import { TicketType } from './type';

export function useTicketTypes() {
  return useQuery<TicketType[]>({
    queryKey: ['ticket-types'],
    queryFn: getTicketTypes,
  });
}

export function useTicketType(id: string) {
  return useQuery<TicketType>({
    queryKey: ['ticket-types', id],
    queryFn: () => getTicketTypeById(id),
    enabled: !!id,
  });
}

export function useCreateTicketType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTicketType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-types'] });
    },
  });
}

export function useUpdateTicketType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TicketType> }) =>
      updateTicketType(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-types'] });
    },
  });
}

export function useDeleteTicketType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTicketType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket-types'] });
    },
  });
}
