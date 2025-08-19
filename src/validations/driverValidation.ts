import { z } from "zod";

export const createDriverSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  telephone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid telephone number"),
  plateNumber: z
    .string()
    .min(3, "Plate number must be at least 10 numbers"),
});

export const useExistingDriverSchema = z.object({
  telephone: z
    .string()
    .regex(/^\+?[0-9]{10,15}$/, "Invalid telephone number"),
});
