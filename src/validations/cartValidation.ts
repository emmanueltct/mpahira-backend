// File: validators/cart.validator.ts
import { z } from 'zod';

export const cartSchema = z.object({
  items: z.object({
    productId: z.string().uuid({ message: 'choose from an existing product' }),
    quantity: z.number().min(1, { message: 'quantity must be at least 1' }),
    unit: z.string().min(1, { message: 'unit is required' }),
    unitPrice: z.number().min(0, { message: 'unitPrice must be non-negative' }),
    totalPrice: z.number().min(0, { message: 'totalPrice must be non-negative' }),
  }),
  totalAmount: z.number().nonnegative(),
});

export const updateItemSchema = z.object({
  productId: z.string().uuid({ message: 'choose from an existing product' }),
  quantity: z.number().min(1),
});

export const removeItemSchema = z.object({
  productId: z.string().uuid({ message: 'choose from an existing product' }),
});

export type CartInput = z.infer<typeof cartSchema>;