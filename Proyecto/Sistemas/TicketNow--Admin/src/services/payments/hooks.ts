'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPaymentLogs,
  getPaymentLogById,
  createPaymentLog,
  updatePaymentLog,
  deletePaymentLog,
} from './api';
import { PaymentLog } from './type';

export function usePaymentLogs() {
  return useQuery<PaymentLog[]>({
    queryKey: ['payment-logs'],
    queryFn: getPaymentLogs,
  });
}

export function usePaymentLog(id: string) {
  return useQuery<PaymentLog>({
    queryKey: ['payment-logs', id],
    queryFn: () => getPaymentLogById(id),
    enabled: !!id,
  });
}

export function useCreatePaymentLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPaymentLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-logs'] });
    },
  });
}

export function useUpdatePaymentLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PaymentLog> }) =>
      updatePaymentLog(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-logs'] });
    },
  });
}

export function useDeletePaymentLog() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePaymentLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payment-logs'] });
    },
  });
}
