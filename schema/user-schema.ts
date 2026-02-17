import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(1, 'Nama diperlukan'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  role: z.enum(['user', 'admin']),
});

export const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Nama diperlukan'),
  email: z.string().email('Email tidak valid'),
  role: z.enum(['user', 'admin']),
});

export const BanUserSchema = z.object({
  userId: z.string(),
  banReason: z.string().optional(),
});
