// src/services/auth/hooks.ts
import { useMutation } from '@tanstack/react-query';
import { login, register } from './api';
import { LoginRequest, RegisterRequest } from './type';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
  });
};
