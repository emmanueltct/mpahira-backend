// Middleware: zodValidate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const zodValidate = (schema: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.errors });
    return
  }
  next();
};
