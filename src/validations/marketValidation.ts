import { z } from 'zod';

export const marketSchema = z.object({
  marketName: z.string().min(1),
  province: z.string().min(1),
  district: z.string().min(1),
  sector: z.string().min(1),
  marketThumbnail: z.string().url().optional(),
  classification: z.enum(['shared', 'owner', 'store']),
  locationLongitude: z.string().optional(),
  locationLatitude: z.string().optional(),
  googleMapCoordinate: z.string().optional(),
});

export type MarketInput = z.infer<typeof marketSchema>;
