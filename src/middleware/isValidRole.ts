import { Request, Response, NextFunction } from 'express';
import { roleSchema } from "../validations/roleValidation"
import Role from "../models/roleModel"

export const validateRoleInput = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const parsed = roleSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({
      message: 'Validation failed',
      errors: parsed.error.format(),
    });
    return;
  }

  const { role } = parsed.data;

  try {
    const existingRole = await Role.findOne({ where: { role } });
    if (existingRole) {
      res.status(409).json({ message: 'Role already exists' });
      return;
    }

    req.body = parsed.data; // update request with parsed/validated data
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error during validation', error: err });
  }
};
