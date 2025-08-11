import { z } from 'zod';

export const shopProductSchema = z.object({
  shopId: z.string().uuid(),
  productId: z.string().optional(),
  productName:z.string().min(1),
  productPrice:z.string().min(1),
  isExpires:z.coerce.boolean().optional(),
  expireDate: z.string().optional(),
  productDescription: z.string().min(1),
  productProfile: z.string().optional(),
  isAvailable:z.coerce.boolean().optional()
 
});

export type MarketInput = z.infer<typeof shopProductSchema>;

