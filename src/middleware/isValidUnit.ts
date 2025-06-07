import { Request, Response, NextFunction } from 'express';
import { unitProductSchema } from '../validations/unitProductValidation';
import UnitProduct from '../models/unitProductModel';

export const validateProductUnitInput = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = unitProductSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.format(),
    });
    return;
  }

  const { unitProduct } = parsed.data;

  try {
    const existingProductUnit = await UnitProduct.findOne({ where: { unitProduct } });
    if (existingProductUnit) {
      res.status(409).json({ message: 'Product unit already exists' });
      return;
    }

    req.body = parsed.data; // update request with parsed/validated data
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error during validation', error: err });
  }
};
