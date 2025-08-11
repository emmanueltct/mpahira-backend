import { Request, Response, NextFunction } from 'express';
import { productSchema } from "../validations/productValidation"
import Product from "../models/productModel"

export const validateProductInput = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = productSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.format(),
    });
    return;
  }

  const { product } = parsed.data;

  try {
    const existingProduct = await Product.findOne({ where: { product } });
    if (existingProduct) {
      res.status(409).json({ message: 'Product already exists' });
      return;
    }

    req.body = parsed.data; // update request with parsed/validated data
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error during validation', error: err });
  }
};
