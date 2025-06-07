import { z } from 'zod';

export const roleSchema = z.object({
  role: z
    .string()
    .min(2, 'Role must be at least 2 characters long')
    .max(30, 'Role must not exceed 30 characters'),
});
