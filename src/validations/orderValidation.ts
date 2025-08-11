import { z } from 'zod';

export const paymentStatusSchema = z.object({
  paymentStatus: z.enum(['Pending', 'Verification', 'Paid', 'Rejected'])
});

export const assignAgentSchema = z.object({
  agentId: z.string().uuid({ message: 'Invalid agent ID' })
});

export const assignDriverSchema = z.object({
  driverId: z.string().uuid({ message: 'Invalid driver ID' })
});

export const orderStatusSchema = z.object({
  orderProcessingStatus: z.enum(['Pending', 'Assigned to Agent', 'Shopping', 'Shipping', 'Delivered'])
});


export const orderItemUpdateSchema = z.object({
  generalStatus: z.enum(['Available', 'Not available']).optional(),
  processingStatus: z.enum(['pending', 'Picked', 'Cancelled']).optional(),
  agentComment: z.string().optional(),
  buyerComment: z.string().optional()
});
