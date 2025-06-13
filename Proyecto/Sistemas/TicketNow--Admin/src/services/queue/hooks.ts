'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getWaitingQueues,
  getWaitingQueueById,
  createWaitingQueue,
  updateWaitingQueue,
  deleteWaitingQueue,
} from './api';
import { WaitingQueue } from './type';

export function useWaitingQueues() {
  return useQuery<WaitingQueue[]>({
    queryKey: ['waiting-queues'],
    queryFn: getWaitingQueues,
  });
}

export function useWaitingQueue(id: string) {
  return useQuery<WaitingQueue>({
    queryKey: ['waiting-queues', id],
    queryFn: () => getWaitingQueueById(id),
    enabled: !!id,
  });
}

export function useCreateWaitingQueue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWaitingQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-queues'] });
    },
  });
}

export function useUpdateWaitingQueue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WaitingQueue> }) =>
      updateWaitingQueue(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-queues'] });
    },
  });
}

export function useDeleteWaitingQueue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteWaitingQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['waiting-queues'] });
    },
  });
}
