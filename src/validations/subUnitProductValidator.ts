// File: validators/subUnitProductValidator.ts
import { z } from "zod";

export const createSubUnitProductSchema = z.object({
  body: z.object({
    unitId: z.string().uuid({ message: "unitId must be a valid UUID" }),
    subUnit: z.string().min(1, { message: "subUnit is required" }),
  }),
});

export const updateSubUnitProductSchema = z.object({
  body: z.object({
    subUnit: z.string().min(1, { message: "subUnit is required" }).optional(),
  }),
  params: z.object({
    id: z.string().uuid({ message: "Invalid SubUnitProduct ID" }),
  }),
});

export const getOrDeleteSubUnitProductSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid SubUnitProduct ID" }),
  }),
});
