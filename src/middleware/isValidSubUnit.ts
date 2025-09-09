// middlewares/validate.ts
import { AnyZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validateSubUnitsProduct =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: error.errors,
      });
    }
  };