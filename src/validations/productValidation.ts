import { z } from 'zod';

export const productSchema = z.object({
  product: z
    .string()
    .min(2, 'Product must be at least 2 characters long')
    .max(250, 'Product must not exceed 250 characters'),
});
