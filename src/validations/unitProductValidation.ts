import { z } from 'zod';

export const unitProductSchema = z.object({
  unitProduct: z
    .string()
    .min(1, 'Product unit must be at least 1 characters long')
    .max(30, 'Product unit must not exceed 30 characters'),
});
