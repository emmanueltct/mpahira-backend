import { z } from 'zod';

export const shopProductSchema = z.object({
  shopId: z.string().uuid(),
  productId: z.string().min(1),
  subCategoryId: z.string().min(1),
  productName:z.string().min(1),
  kinyLabel:z.string().min(1),
  isExpires:z.coerce.boolean().optional(),
  expireDate: z.string().optional(),
  productDescription: z.string().min(20),
  productProfile: z.string().optional(),
  isAvailable:z.coerce.boolean().optional()
 
});

export type MarketInput = z.infer<typeof shopProductSchema>;

